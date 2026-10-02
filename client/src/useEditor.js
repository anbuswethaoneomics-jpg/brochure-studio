import { useEffect, useRef, useState } from 'react';
import {
  Canvas, Textbox, Rect, Circle, Triangle, Line, FabricImage, Group, ActiveSelection,
} from 'fabric';
import { buildSpec, makeIcon, makeText } from './objects.js';

const hex = (v) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : '#000000');

export function useEditor() {
  const elRef = useRef(null);
  const cvs = useRef(null);
  const busy = useRef(false);
  const timer = useRef(null);
  const hist = useRef({ stack: [], i: -1 });
  const size = useRef({ w: 1123, h: 794, z: 1, folds: 3 });
  const guideLinesRef = useRef([]);
  const [sel, setSel] = useState(null);
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });
  const [bgColor, setBgColor] = useState('#ffffff');

  // ---------- selection -> React state ----------
  const readSel = () => {
    const c = cvs.current;
    const o = c && c.getActiveObject();
    if (!o) return setSel(null);
    const base = { opacity: o.opacity ?? 1 };
    if (o instanceof ActiveSelection) return setSel({ kind: 'multi', ...base });
    if (o instanceof Textbox) {
      return setSel({
        kind: 'text', ...base, fill: hex(o.fill), fontFamily: o.fontFamily, fontSize: Math.round(o.fontSize),
        bold: o.fontWeight === 'bold' || Number(o.fontWeight) >= 600, italic: o.fontStyle === 'italic',
        underline: !!o.underline, align: o.textAlign, lh: o.lineHeight, sp: o.charSpacing,
      });
    }
    if (o instanceof FabricImage) return setSel({ kind: 'image', ...base });
    if (o instanceof Group) {
      const first = o.getObjects()[0];
      return setSel({ kind: 'icon', ...base, fill: hex(first && first.stroke) });
    }
    if (o instanceof Line) return setSel({ kind: 'line', ...base, fill: hex(o.stroke), sw: o.strokeWidth });
    return setSel({ kind: 'shape', ...base, fill: hex(o.fill), stroke: hex(o.stroke), hasStroke: !!o.stroke, sw: o.strokeWidth || 0, r: o.rx || 0, isRect: o instanceof Rect });
  };

  // ---------- history ----------
  const syncFlags = () => {
    const h = hist.current;
    setFlags({ canUndo: h.i > 0, canRedo: h.i < h.stack.length - 1 });
  };
  const snapshot = () => {
    const c = cvs.current;
    if (!c || busy.current) return;
    const json = JSON.stringify(c.toObject());
    const h = hist.current;
    if (h.stack[h.i] === json) return;
    h.stack = h.stack.slice(0, h.i + 1);
    h.stack.push(json);
    if (h.stack.length > 60) h.stack.shift();
    h.i = h.stack.length - 1;
    syncFlags();
  };
  const queue = () => {
    if (busy.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(snapshot, 200);
  };
  const commit = () => { readSel(); cvs.current.requestRenderAll(); queue(); };
  const resetHistory = () => {
    hist.current = { stack: [JSON.stringify(cvs.current.toObject())], i: 0 };
    syncFlags();
  };

  const applyZoom = () => {
    const c = cvs.current; const { w, h, z } = size.current;
    c.setZoom(z);
    c.setDimensions({ width: w * z, height: h * z });
    c.requestRenderAll();
  };

  const restore = async (json) => {
    const c = cvs.current;
    busy.current = true;
    c.discardActiveObject();
    await c.loadFromJSON(json);
    applyZoom();
    busy.current = false;
    readSel();
  };
  const undo = async () => {
    const h = hist.current; if (h.i <= 0) return;
    h.i -= 1; await restore(h.stack[h.i]); syncFlags();
  };
  const redo = async () => {
    const h = hist.current; if (h.i >= h.stack.length - 1) return;
    h.i += 1; await restore(h.stack[h.i]); syncFlags();
  };

  // ---------- setup ----------
  useEffect(() => {
    const c = new Canvas(elRef.current, {
      width: size.current.w, height: size.current.h, backgroundColor: '#ffffff',
      preserveObjectStacking: true, enableRetinaScaling: true,
    });
    cvs.current = c;

    // Corner-dragging a text box scales it; convert that scale into a real font size.
    const bakeTextScale = (t) => {
      if (t instanceof Textbox && (t.scaleX !== 1 || t.scaleY !== 1)) {
        const s = t.scaleX;
        t.set({ fontSize: Math.round(t.fontSize * s), width: t.width * s, scaleX: 1, scaleY: 1 });
        t.setCoords();
      }
    };
    c.on('object:modified', (e) => { bakeTextScale(e.target); readSel(); queue(); });
    c.on('object:added', queue);
    c.on('object:removed', queue);
    c.on('text:changed', queue);
    c.on('selection:created', readSel);
    c.on('selection:updated', readSel);
    c.on('selection:cleared', readSel);
    resetHistory();

    // ---------- Smart Alignment Guidelines & Magnetic Snapping (Canva / Figma style) ----------
    const handleObjectMoving = (e) => {
      const target = e.target;
      if (!target || !c) return;

      const zoom = c.getZoom() || 1;
      const SNAP_DISTANCE = 6 / zoom;

      const tRect = target.getBoundingRect();
      const tLeft = tRect.left;
      const tTop = tRect.top;
      const tWidth = tRect.width;
      const tHeight = tRect.height;
      const tCenterX = tLeft + tWidth / 2;
      const tCenterY = tTop + tHeight / 2;
      const tRight = tLeft + tWidth;
      const tBottom = tTop + tHeight;

      const W = size.current.w;
      const H = size.current.h;

      // Only snap against other real design elements (text, images, shapes, cards)
      // Exclude target itself, invisible elements, guidelines, and full-canvas background rects
      const eligible = c.getObjects().filter((obj) => {
        if (obj === target || !obj.visible || obj.isGuideline) return false;
        const b = obj.getBoundingRect();
        if (b.width >= W * 0.92 && b.height >= H * 0.92) return false;
        if (b.width < 4 || b.height < 4) return false;
        return true;
      });

      // Find the single closest horizontal match (aligning Y coords so texts are in a straight line)
      let bestY = null;
      let minDiffY = SNAP_DISTANCE;

      for (const obj of eligible) {
        const oRect = obj.getBoundingRect();
        const oTop = oRect.top;
        const oCenterY = oTop + oRect.height / 2;
        const oBottom = oTop + oRect.height;
        const oLeft = oRect.left;
        const oRight = oLeft + oRect.width;

        const yPairs = [
          { tVal: tTop, oVal: oTop },
          { tVal: tCenterY, oVal: oCenterY },
          { tVal: tBottom, oVal: oBottom },
        ];

        for (const p of yPairs) {
          const diff = Math.abs(p.tVal - p.oVal);
          if (diff <= minDiffY) {
            minDiffY = diff;
            bestY = {
              shift: p.oVal - p.tVal,
              lineY: p.oVal,
              x1: Math.min(tLeft, oLeft) - 8,
              x2: Math.max(tRight, oRight) + 8,
            };
          }
        }
      }

      // Find the single closest vertical match (aligning X coords so texts are vertically aligned)
      let bestX = null;
      let minDiffX = SNAP_DISTANCE;

      for (const obj of eligible) {
        const oRect = obj.getBoundingRect();
        const oLeft = oRect.left;
        const oCenterX = oLeft + oRect.width / 2;
        const oRight = oLeft + oRect.width;
        const oTop = oRect.top;
        const oBottom = oTop + oRect.height;

        const xPairs = [
          { tVal: tLeft, oVal: oLeft },
          { tVal: tCenterX, oVal: oCenterX },
          { tVal: tRight, oVal: oRight },
        ];

        for (const p of xPairs) {
          const diff = Math.abs(p.tVal - p.oVal);
          if (diff <= minDiffX) {
            minDiffX = diff;
            bestX = {
              shift: p.oVal - p.tVal,
              lineX: p.oVal,
              y1: Math.min(tTop, oTop) - 8,
              y2: Math.max(tBottom, oBottom) + 8,
            };
          }
        }
      }

      const activeLines = [];

      // Apply vertical alignment snap (shifts target left/right to snap X)
      if (bestX && minDiffX <= SNAP_DISTANCE) {
        target.set('left', target.left + bestX.shift);
        target.setCoords();
        activeLines.push({
          type: 'vertical',
          x: bestX.lineX,
          y1: bestX.y1,
          y2: bestX.y2,
        });
      }

      // Apply horizontal alignment snap (shifts target up/down to snap Y)
      if (bestY && minDiffY <= SNAP_DISTANCE) {
        target.set('top', target.top + bestY.shift);
        target.setCoords();
        activeLines.push({
          type: 'horizontal',
          y: bestY.lineY,
          x1: bestY.x1,
          x2: bestY.x2,
        });
      }

      guideLinesRef.current = activeLines;
      c.requestRenderAll();
    };

    const clearGuides = () => {
      if (guideLinesRef.current && guideLinesRef.current.length > 0) {
        guideLinesRef.current = [];
        c.requestRenderAll();
      }
    };

    c.on('object:moving', handleObjectMoving);
    c.on('mouse:up', clearGuides);
    c.on('object:modified', clearGuides);

    c.on('after:render', (opt) => {
      const lines = guideLinesRef.current;
      if (!lines || lines.length === 0) return;
      const ctx = opt?.ctx || c.getContext();
      if (!ctx) return;

      ctx.save();
      const vpt = c.viewportTransform;
      if (vpt) {
        ctx.transform(vpt[0], vpt[1], vpt[2], vpt[3], vpt[4], vpt[5]);
      }

      const z = c.getZoom() || 1;
      ctx.lineWidth = 1.3 / z;
      ctx.strokeStyle = '#e11d48'; // Canva / Figma vibrant magenta guideline
      ctx.setLineDash([4 / z, 3 / z]);

      for (const line of lines) {
        ctx.beginPath();
        if (line.type === 'vertical') {
          ctx.moveTo(line.x, line.y1);
          ctx.lineTo(line.x, line.y2);
        } else if (line.type === 'horizontal') {
          ctx.moveTo(line.x1, line.y);
          ctx.lineTo(line.x2, line.y);
        }
        ctx.stroke();
      }
      ctx.restore();
    });

    const onKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const o = c.getActiveObject();
      if (o && o.isEditing) return;
      const mod = e.ctrlKey || e.metaKey;
      const k = e.key.toLowerCase();
      if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
      else if (mod && k === 'y') { e.preventDefault(); redo(); }
      else if (mod && k === 'd') { e.preventDefault(); duplicate(); }
      else if (k === 'delete' || k === 'backspace') { e.preventDefault(); remove(); }
      else if (o && k.startsWith('arrow')) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const d = { arrowleft: [-step, 0], arrowright: [step, 0], arrowup: [0, -step], arrowdown: [0, step] }[k];
        o.set({ left: o.left + d[0], top: o.top + d[1] }); o.setCoords(); c.requestRenderAll(); queue();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); c.dispose(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- adding things ----------
  const place = (o, atTop = false) => {
    const { w, h } = size.current;
    o.set({ left: (w - o.getScaledWidth()) / 2, top: atTop ? h * 0.3 : (h - o.getScaledHeight()) / 2 });
    o.setCoords();
  };
  const addObj = (o, atTop) => {
    const c = cvs.current;
    place(o, atTop);
    c.add(o); c.setActiveObject(o); c.requestRenderAll();
  };

  const addText = (p = {}) => {
    const { w } = size.current;
    const o = makeText({ t: p.label || 'Add your text', w: Math.min(w * 0.6, 520), size: p.size || 24, font: p.font || 'Poppins', bold: p.bold, italic: p.italic, color: p.color, align: p.align, sp: p.sp });
    addObj(o, true);
    o.enterEditing(); o.selectAll();
  };

  const addShape = (kind) => {
    const fill = '#0f8a6d';
    let o;
    if (kind === 'rect') o = new Rect({ width: 240, height: 160, fill, strokeUniform: true });
    if (kind === 'rounded') o = new Rect({ width: 240, height: 160, fill, rx: 24, ry: 24, strokeUniform: true });
    if (kind === 'circle') o = new Circle({ radius: 90, fill, strokeUniform: true });
    if (kind === 'triangle') o = new Triangle({ width: 200, height: 180, fill, strokeUniform: true });
    if (kind === 'line') o = new Line([0, 0, 300, 0], { stroke: '#0b5d4b', strokeWidth: 4, strokeUniform: true });
    if (o) addObj(o);
  };

  const addIcon = async (name) => addObj(await makeIcon(name, 96, '#0b5d4b'));

  const addImage = async (url) => {
    const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    const max = size.current.w * 0.6;
    if (img.width > max) img.scaleToWidth(max);
    addObj(img);
  };

  // ---------- editing selection ----------
  const active = () => cvs.current.getActiveObjects();
  const setProps = (props) => {
    active().forEach((o) => { o.set(props); if (o instanceof Textbox) o.initDimensions(); o.setCoords(); });
    commit();
  };
  const setColor = (color) => {
    active().forEach((o) => {
      if (o instanceof Group) {
        o.getObjects().forEach((ch) => {
          if (ch.stroke) ch.set('stroke', color);
          if (ch.fill && ch.fill !== 'none') ch.set('fill', color);
        });
        o.set('dirty', true);
      } else if (o instanceof Line) o.set('stroke', color);
      else o.set('fill', color);
    });
    commit();
  };
  const setStroke = (props) => {
    active().forEach((o) => {
      const next = { ...props };
      if (next.stroke && next.strokeWidth === undefined && !o.strokeWidth) next.strokeWidth = 3;
      if (next.strokeWidth > 0 && !o.stroke && !next.stroke) next.stroke = '#0b5d4b';
      o.set(next);
    });
    commit();
  };
  const setCorner = (r) => { active().forEach((o) => o.set({ rx: r, ry: r })); commit(); };
  const toggle = (key) => {
    active().forEach((o) => {
      if (!(o instanceof Textbox)) return;
      if (key === 'bold') o.set('fontWeight', o.fontWeight === 'bold' ? 'normal' : 'bold');
      if (key === 'italic') o.set('fontStyle', o.fontStyle === 'italic' ? 'normal' : 'italic');
      if (key === 'underline') o.set('underline', !o.underline);
      o.initDimensions();
    });
    commit();
  };
  const layer = (how) => {
    const c = cvs.current; const o = c.getActiveObject(); if (!o) return;
    ({ front: c.bringObjectToFront, back: c.sendObjectToBack, up: c.bringObjectForward, down: c.sendObjectBackwards })[how].call(c, o);
    commit();
  };
  const centerOnPage = (axis) => {
    const o = cvs.current.getActiveObject(); if (!o) return;
    const { w, h } = size.current;
    if (axis === 'h') o.set('left', (w - o.getScaledWidth()) / 2);
    else o.set('top', (h - o.getScaledHeight()) / 2);
    o.setCoords(); commit();
  };
  const remove = () => {
    const c = cvs.current; const objs = c.getActiveObjects();
    c.discardActiveObject(); objs.forEach((o) => c.remove(o)); c.requestRenderAll();
  };
  const duplicate = async () => {
    const c = cvs.current; const objs = c.getActiveObjects(); if (!objs.length) return;
    c.discardActiveObject();
    const clones = [];
    for (const o of objs) {
      const cl = await o.clone();
      cl.set({ left: o.left + 24, top: o.top + 24 });
      c.add(cl); clones.push(cl);
    }
    c.setActiveObject(clones.length === 1 ? clones[0] : new ActiveSelection(clones, { canvas: c }));
    c.requestRenderAll();
  };
  const setBackground = (color) => {
    const c = cvs.current;
    if (!c) return;
    c.backgroundColor = color;

    // Remove any full-size white background panel rects that block the canvas background
    const blockingPanels = c.getObjects('rect').filter((o) =>
      o.height >= 600 && o.width >= 300 && (o.fill === '#ffffff' || o.fill === 'white')
    );
    if (blockingPanels.length > 0) {
      blockingPanels.forEach((p) => c.remove(p));
    }

    c.requestRenderAll();
    setBgColor(color);
    queue();
  };
  const getBackground = () => hex(bgColor || cvs.current?.backgroundColor);

  const setSize = (w, h, folds) => {
    size.current = {
      ...size.current,
      w,
      h,
      ...(folds !== undefined ? { folds: Number(folds) || 0 } : {}),
    };
    applyZoom();
  };
  const setFolds = (folds) => {
    size.current = { ...size.current, folds: Number(folds) || 0 };
  };
  const setZoom = (z) => { size.current = { ...size.current, z }; applyZoom(); };
  const getJSON = () => cvs.current.toObject();
  const clear = async (bg = '#ffffff') => {
    const c = cvs.current; busy.current = true;
    c.discardActiveObject(); c.clear(); c.backgroundColor = bg;
    applyZoom(); busy.current = false; resetHistory(); readSel();
    setBgColor(bg);
  };
  const loadPage = async (json) => {
    if (!json) return clear();
    await restore(json); resetHistory();
    if (json.backgroundColor) setBgColor(hex(json.backgroundColor));
  };
  const buildPageFromSpecs = async (specsFn, bg = '#ffffff') => {
    const c = cvs.current;
    if (!c) return null;
    const currentJson = c.toObject();
    c.discardActiveObject();
    c.clear();
    c.backgroundColor = bg;
    const specs = typeof specsFn === 'function' ? specsFn() : specsFn;
    if (specs && Array.isArray(specs.objects)) {
      await c.loadFromJSON(specs);
    } else if (Array.isArray(specs)) {
      for (const s of specs) {
        const o = await buildSpec(s);
        if (o) c.add(o);
      }
    }
    const pageJson = c.toObject(['name', 'selectable', 'evented']);
    c.clear();
    await c.loadFromJSON(currentJson);
    return pageJson;
  };

  /**
   * Shuffle or swap panels on the canvas (for tri-fold or multi-fold brochures).
   * @param {string} mode - 'rotate' (1->2->3), 'rotate-prev' (3->2->1), 'swap-0-1', 'swap-1-2', 'swap-0-2', 'shuffle-footers'
   * @param {number} folds - number of folds (default 3)
   */
  const shufflePanels = (mode = 'rotate', folds = 3) => {
    const c = cvs.current;
    if (!c || folds < 2) return;
    const { w, h } = size.current;
    const panelW = w / folds;
    const objs = c.getObjects();

    c.discardActiveObject();

    if (mode === 'shuffle-footers') {
      // Rotate only bottom elements (top >= h * 0.70)
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        if (o.top < h * 0.70) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(folds - 1, Math.max(0, Math.floor(cx / panelW)));
        const nextCol = (col + 1) % folds;
        const shift = (nextCol - col) * panelW;
        o.set({ left: o.left + shift });
        o.setCoords();
      });
    } else if (mode === 'rotate') {
      // 0 -> 1, 1 -> 2, 2 -> 0
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(folds - 1, Math.max(0, Math.floor(cx / panelW)));
        const nextCol = (col + 1) % folds;
        const shift = (nextCol - col) * panelW;
        o.set({ left: o.left + shift });
        o.setCoords();
      });
    } else if (mode === 'rotate-prev') {
      // 0 -> 2, 1 -> 0, 2 -> 1
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(folds - 1, Math.max(0, Math.floor(cx / panelW)));
        const nextCol = (col - 1 + folds) % folds;
        const shift = (nextCol - col) * panelW;
        o.set({ left: o.left + shift });
        o.setCoords();
      });
    } else if (mode.startsWith('swap-')) {
      const parts = mode.split('-').slice(1).map(Number);
      const [colA, colB] = parts;
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(folds - 1, Math.max(0, Math.floor(cx / panelW)));
        if (col === colA) {
          o.set({ left: o.left + (colB - colA) * panelW });
          o.setCoords();
        } else if (col === colB) {
          o.set({ left: o.left + (colA - colB) * panelW });
          o.setCoords();
        }
      });
    }

    c.requestRenderAll();
    snapshot();
    readSel();
  };

  const applyTemplate = async (tpl) => {
    const c = cvs.current; busy.current = true;
    c.discardActiveObject();
    size.current = { ...size.current, w: tpl.w, h: tpl.h };

    const pageSpecsList = tpl.pages && tpl.pages.length > 0
      ? tpl.pages
      : (tpl.backSpecs ? [tpl.specs, tpl.backSpecs] : [tpl.specs]);

    const pagesJson = [];

    for (let i = 0; i < pageSpecsList.length; i++) {
      c.clear();
      c.backgroundColor = tpl.bg || '#ffffff';
      const specsFn = pageSpecsList[i];
      if (typeof specsFn === 'function') {
        const specs = specsFn();
        if (specs && Array.isArray(specs.objects)) {
          await c.loadFromJSON(specs);
        } else if (Array.isArray(specs)) {
          for (const s of specs) {
            const o = await buildSpec(s);
            if (o) c.add(o);
          }
        }
      } else if (specsFn && Array.isArray(specsFn.objects)) {
        await c.loadFromJSON(specsFn);
      }
      pagesJson.push(c.toObject(['name', 'selectable', 'evented']));
    }

    // Restore Page 1 as the active view on the canvas
    if (pagesJson.length > 0) {
      c.clear();
      await c.loadFromJSON(pagesJson[0]);
    }

    applyZoom();
    busy.current = false;
    resetHistory();
    readSel();
    setBgColor(tpl.bg || '#ffffff');
    return pagesJson;
  };
  const isEmpty = () => cvs.current.getObjects().length === 0;

  // ---------- helpers used by App / StudioPropsBar ----------
  const _canvas = () => cvs.current;

  /** Place an image as a full-page background layer (selectable so OCR button appears) */
  const addTemplateImage = async (url, w, h) => {
    const c = cvs.current;
    const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    img.set({
      left: 0,
      top: 0,
      originX: 'left',
      originY: 'top',
      selectable: true,          // can click it
      evented: true,
      lockMovementX: true,       // cannot drag
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasControls: false,        // hide resize handles
    });
    img.scaleX = w / img.width;
    img.scaleY = h / img.height;
    c.add(img);

    // send to back
    if (typeof c.sendObjectToBack === 'function') {
      c.sendObjectToBack(img);
    } else if (typeof c.sendToBack === 'function') {
      c.sendToBack(img);
    }

    // auto-select so PropsBar immediately shows the image tools + "Make text editable"
    c.setActiveObject(img);
    c.requestRenderAll();
    return img;
  };

  /** Run OCR on the currently selected image (or the first image on canvas) */
  const makeSelectedImageEditable = async (onStatus) => {
    const c = cvs.current;
    let img = c.getActiveObject();
    if (!(img instanceof FabricImage)) {
      img = c.getObjects().find((o) => o instanceof FabricImage);
    }
    if (!img) {
      onStatus?.('No image found on the canvas.');
      return 0;
    }
    const { makeImageTextEditable } = await import('./ocrEditable.js');
    return makeImageTextEditable(c, img, onStatus);
  };

  /** Replace the currently selected image with a new one */
  const replaceImage = async (url) => {
    const c = cvs.current;
    const active = c.getActiveObject();
    if (!(active instanceof FabricImage)) return;

    const newImg = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
    newImg.set({
      left: active.left,
      top: active.top,
      scaleX: active.scaleX,
      scaleY: active.scaleY,
      angle: active.angle,
      opacity: active.opacity,
      originX: active.originX,
      originY: active.originY,
    });
    c.remove(active);
    c.add(newImg);
    c.setActiveObject(newImg);
    c.requestRenderAll();
    queue();
  };

  /** Stretch the selected image to fill the whole page */
  const fitImageToPage = () => {
    const c = cvs.current;
    const o = c.getActiveObject();
    if (!(o instanceof FabricImage)) return;
    const { w, h } = size.current;
    o.set({
      left: 0,
      top: 0,
      originX: 'left',
      originY: 'top',
      scaleX: w / o.width,
      scaleY: h / o.height,
    });
    o.setCoords();
    c.requestRenderAll();
    queue();
  };

  /** Force a history snapshot (used after OCR) */
  const _snapshot = () => {
    snapshot();
  };

  // ---------- export ----------
  const render = (scale = 1, format = 'png') => {
    const c = cvs.current; const { w, h, z } = size.current;
    c.discardActiveObject();
    c.setZoom(1); c.setDimensions({ width: w, height: h });
    const url = c.toDataURL({ format, quality: 0.85, multiplier: scale });
    applyZoom();
    return url;
  };
  const renderPages = async (pagesJson, scale) => {
    const urls = [];
    for (const p of pagesJson) { await loadPage(p); urls.push(render(scale)); }
    return urls;
  };

  return {
    elRef, sel, ...flags, bgColor,
    undo, redo, addText, addShape, addIcon, addImage,
    setProps, setColor, setStroke, setCorner, toggle, layer, centerOnPage, remove, duplicate,
    setBackground, getBackground, setSize, setFolds, setZoom, getJSON, clear, loadPage, applyTemplate, buildPageFromSpecs, shufflePanels, isEmpty,
    render, renderPages,
    // helpers
    _canvas,
    addTemplateImage,
    makeSelectedImageEditable,
    replaceImage,
    fitImageToPage,
    _snapshot,
  };
}