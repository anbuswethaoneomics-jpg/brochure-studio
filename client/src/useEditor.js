import { useEffect, useRef, useState } from 'react';
import {
  Canvas, Textbox, Rect, Circle, Triangle, Line, FabricImage, Group, ActiveSelection, Gradient,
} from 'fabric';
import { buildSpec, makeIcon, makeText } from './objects.js';
import { toFabricGradient } from './gradientUtils.js';

const hex = (v) => (typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : '#000000');

export function useEditor() {
  const elRef = useRef(null);
  const cvs = useRef(null);
  const busy = useRef(false);
  const timer = useRef(null);
  const hist = useRef({ stack: [], i: -1 });
  const size = useRef({ w: 1123, h: 794, z: 1, folds: 3 });
  const guideLinesRef = useRef([]);
  const openCropRef = useRef(null);
  const [sel, setSel] = useState(null);
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });
  const [bgColor, setBgColor] = useState('#ffffff');
  const [cropTarget, setCropTarget] = useState(null);

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
    const scaledW = Math.round(o.getScaledWidth ? o.getScaledWidth() : (o.width || 0) * (o.scaleX || 1));
    const scaledH = Math.round(o.getScaledHeight ? o.getScaledHeight() : (o.height || 0) * (o.scaleY || 1));
    if (o instanceof FabricImage) {
      const src = o._originalSrc || o.getSrc?.() || (o._element && o._element.src) || '';
      return setSel({
        kind: 'image',
        ...base,
        size: scaledW,
        width: scaledW,
        height: scaledH,
        flipX: !!o.flipX,
        flipY: !!o.flipY,
        angle: Math.round(o.angle || 0),
        isCropped: !!o._isCropped,
        hasOriginal: !!o._originalSrc,
        cornerRadius: o._cornerRadius || 0,
        isBackground: !!o._isBackground,
        src,
      });
    }
    if (o instanceof Group) {
      const first = o.getObjects()[0];
      return setSel({ kind: 'icon', ...base, fill: hex(first && first.stroke), size: scaledW, width: scaledW, height: scaledH });
    }
    if (o instanceof Line) return setSel({ kind: 'line', ...base, fill: hex(o.stroke), sw: o.strokeWidth });
    return setSel({
      kind: 'shape', ...base, fill: hex(o.fill), stroke: hex(o.stroke), hasStroke: !!o.stroke,
      sw: o.strokeWidth || 0, r: o.rx || 0, isRect: o instanceof Rect,
      size: scaledW, width: scaledW, height: scaledH,
    });
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
    h.push ? h.stack.push(json) : h.stack.push(json);
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

  const changeObjectSize = (delta) => {
    const c = cvs.current;
    if (!c) return;
    const objs = c.getActiveObjects();
    if (!objs.length) return;
    objs.forEach((o) => {
      if (o instanceof Textbox) {
        const cur = o.fontSize || 16;
        o.set('fontSize', Math.max(6, Math.min(400, cur + delta)));
        o.initDimensions();
      } else {
        const curW = o.getScaledWidth() || (o.radius ? o.radius * 2 : 10);
        const nextW = Math.max(2, Math.min(2500, curW + delta));
        const ratio = nextW / Math.max(0.1, curW);
        const center = o.getCenterPoint ? o.getCenterPoint() : { x: o.left, y: o.top };
        o.set({
          scaleX: Math.max(0.01, (o.scaleX || 1) * ratio),
          scaleY: Math.max(0.01, (o.scaleY || 1) * ratio),
        });
        if (o.setPositionByOrigin) o.setPositionByOrigin(center, 'center', 'center');
      }
      o.setCoords();
    });
    commit();
  };

  const setObjectSize = (targetSize) => {
    const c = cvs.current;
    if (!c) return;
    const objs = c.getActiveObjects();
    if (!objs.length) return;
    objs.forEach((o) => {
      if (o instanceof Textbox) {
        o.set('fontSize', Math.max(6, Math.min(400, Math.round(targetSize))));
        o.initDimensions();
      } else {
        const curW = o.getScaledWidth() || (o.radius ? o.radius * 2 : 10);
        const nextW = Math.max(2, Math.min(2500, targetSize));
        const ratio = nextW / Math.max(0.1, curW);
        const center = o.getCenterPoint ? o.getCenterPoint() : { x: o.left, y: o.top };
        o.set({
          scaleX: Math.max(0.01, (o.scaleX || 1) * ratio),
          scaleY: Math.max(0.01, (o.scaleY || 1) * ratio),
        });
        if (o.setPositionByOrigin) o.setPositionByOrigin(center, 'center', 'center');
      }
      o.setCoords();
    });
    commit();
  };
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

  const sanitizeDesignJson = (json) => {
    if (!json) return json;
    try {
      let str = typeof json === 'string' ? json : JSON.stringify(json);
      // Replace absolute localhost/127.0.0.1 assets with relative paths
      str = str.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/assets\//g, '/assets/');
      str = str.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/uploads\//g, '/uploads/');
      return JSON.parse(str);
    } catch {
      return json;
    }
  };

  const restore = async (json) => {
    const c = cvs.current;
    if (!c) return;
    busy.current = true;
    c.discardActiveObject();
    const cleanJson = sanitizeDesignJson(json);
    if (cleanJson && !cleanJson.background && cleanJson.backgroundColor) {
      cleanJson.background = cleanJson.backgroundColor;
    }
    try {
      await c.loadFromJSON(cleanJson);
    } catch (err) {
      console.warn('loadFromJSON warning:', err);
      try {
        let str = JSON.stringify(cleanJson);
        const blank = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        const match = err?.message?.match(/loading (https?:\/\/[^\s]+)/i);
        if (match && match[1]) {
          str = str.split(match[1]).join(blank);
        } else {
          str = str.replace(/https?:\/\/[^\s"']+\.(png|jpe?g|webp|svg)/gi, (url) => {
            if (url.includes('localhost') || url.includes('127.0.0.1')) return blank;
            return url;
          });
        }
        await c.loadFromJSON(JSON.parse(str));
      } catch (retryErr) {
        console.error('loadFromJSON recovery failed:', retryErr);
      }
    }
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
    c.on('mouse:dblclick', (e) => {
      const target = e.target;
      if (target instanceof FabricImage && openCropRef.current) {
        openCropRef.current(target);
      }
    });
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
        if ((e.altKey || mod) && (k === 'arrowup' || k === 'arrowdown')) {
          const grow = k === 'arrowup';
          changeObjectSize(grow ? (e.shiftKey ? 6 : 2) : (e.shiftKey ? -6 : -2));
          return;
        }
        const step = e.shiftKey ? 10 : 1;
        const d = { arrowleft: [-step, 0], arrowright: [step, 0], arrowup: [0, -step], arrowdown: [0, step] }[k];
        o.set({ left: o.left + d[0], top: o.top + d[1] }); o.setCoords(); c.requestRenderAll(); queue();
      }
      else if (o && (k === ']' || k === '[' || k === '+' || k === '=' || k === '-' || k === '_' || k === '>' || k === '<' || (mod && (k === '.' || k === ',')))) {
        e.preventDefault();
        const grow = (k === ']' || k === '+' || k === '=' || k === '>' || (mod && k === '.'));
        changeObjectSize(grow ? (e.shiftKey ? 6 : 2) : (e.shiftKey ? -6 : -2));
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
    img._originalSrc = url;
    img._originalWidth = img.width;
    img._originalHeight = img.height;
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

    let targetBg = color;
    if (color && typeof color === 'object' && !(color instanceof Gradient) && (color.colors || color.colorStops || color.direction || color.isGradient)) {
      targetBg = toFabricGradient(color, size.current.w, size.current.h);
    }
    c.backgroundColor = targetBg;

    // Remove any full-size white background panel rects that block the canvas background
    const blockingPanels = c.getObjects('rect').filter((o) => {
      const f = String(o.fill || '').toLowerCase();
      const isWhite = f === '#ffffff' || f === '#fff' || f === 'white' || f === 'rgb(255, 255, 255)' || f === 'rgb(255,255,255)' || f === 'rgba(255, 255, 255, 1)' || f === 'rgba(255,255,255,1)';
      const isPanel = (o.height >= 550 && o.width >= 280);
      const isFullPage = (o.width >= size.current.w - 20 && o.height >= size.current.h - 20);
      return (isWhite && isPanel) || isFullPage;
    });
    if (blockingPanels.length > 0) {
      blockingPanels.forEach((p) => c.remove(p));
    }

    c.requestRenderAll();
    setBgColor(targetBg);
    queue();
  };
  const getBackground = () => cvs.current?.backgroundColor || bgColor || '#ffffff';

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
  const getJSON = () => {
    const obj = cvs.current.toObject();
    if (obj && obj.background && !obj.backgroundColor) {
      obj.backgroundColor = obj.background;
    }
    return obj;
  };
  const clear = async (bg = '#ffffff') => {
    const c = cvs.current; busy.current = true;
    c.discardActiveObject(); c.clear();
    let clearBg = bg;
    if (bg && typeof bg === 'object' && !(bg instanceof Gradient) && (bg.colors || bg.direction || bg.isGradient)) {
      clearBg = toFabricGradient(bg, size.current.w, size.current.h);
    }
    c.backgroundColor = clearBg;
    applyZoom(); busy.current = false; resetHistory(); readSel();
    setBgColor(clearBg);
  };
  const loadPage = async (json) => {
    if (!json) return clear();
    await restore(json); resetHistory();
    const bgVal = cvs.current?.backgroundColor || json.background || json.backgroundColor || '#ffffff';
    setBgColor(bgVal);
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
    if (!c) return;
    const { w, h } = size.current;
    const numCols = Number(folds) >= 2 ? Number(folds) : 2;
    const panelW = w / numCols;
    const objs = c.getObjects();

    c.discardActiveObject();

    if (mode === 'shuffle-footers') {
      // Rotate / swap only bottom elements (top >= h * 0.65)
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        if (o.top < h * 0.65) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(numCols - 1, Math.max(0, Math.floor(cx / panelW)));
        const nextCol = (col + 1) % numCols;
        const shift = (nextCol - col) * panelW;
        o.set({ left: o.left + shift });
        o.setCoords();
      });
    } else if (mode === 'swap-vertical' || mode === 'swap-top-bottom') {
      // For single-page/A4 flyers: swap upper body content and lower body content
      const minY = h * 0.12;
      const maxY = h * 0.88;
      const midY = (minY + maxY) / 2;
      const shiftDist = (maxY - minY) / 2;
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.90 && o.getScaledHeight() >= h * 0.90) return;
        const cy = o.top + o.getScaledHeight() / 2;
        if (cy < minY || cy > maxY) return;
        const shift = cy < midY ? shiftDist : -shiftDist;
        o.set({ top: o.top + shift });
        o.setCoords();
      });
    } else if (mode === 'rotate') {
      // 0 -> 1 -> 2 (or 0 <-> 1 for 2 columns / A4)
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(numCols - 1, Math.max(0, Math.floor(cx / panelW)));
        const nextCol = (col + 1) % numCols;
        const shift = (nextCol - col) * panelW;
        o.set({ left: o.left + shift });
        o.setCoords();
      });
    } else if (mode === 'rotate-prev') {
      // 0 -> 2, 1 -> 0, 2 -> 1
      objs.forEach((o) => {
        if (o.getScaledWidth() >= w * 0.85) return;
        const cx = o.left + o.getScaledWidth() / 2;
        const col = Math.min(numCols - 1, Math.max(0, Math.floor(cx / panelW)));
        const nextCol = (col - 1 + numCols) % numCols;
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
        const col = Math.min(numCols - 1, Math.max(0, Math.floor(cx / panelW)));
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
      let tplBg = tpl.bg || '#ffffff';
      if (tplBg && typeof tplBg === 'object' && !(tplBg instanceof Gradient) && (tplBg.colors || tplBg.direction || tplBg.isGradient)) {
        tplBg = toFabricGradient(tplBg, tpl.w, tpl.h);
      }
      c.backgroundColor = tplBg;
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
    setBgColor(c.backgroundColor || tpl.bg || '#ffffff');
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

  /** Helper to safely resolve a Fabric image object even if a React event is passed */
  const getSelectedImage = (maybeObj) => {
    const isImg = (obj) =>
      obj &&
      typeof obj === 'object' &&
      !obj.nativeEvent &&
      !obj._reactName &&
      !obj.preventDefault &&
      (obj instanceof FabricImage || obj.type === 'image' || obj.isType?.('image') || typeof obj.getSrc === 'function' || !!obj._element);

    if (isImg(maybeObj)) return maybeObj;
    const c = cvs.current;
    if (!c) return null;
    const active = c.getActiveObject();
    if (isImg(active)) return active;
    if (active instanceof ActiveSelection) {
      const found = active.getObjects().find(isImg);
      if (found) return found;
    }
    const allImgs = c.getObjects().filter(isImg);
    if (allImgs.length === 1) return allImgs[0];
    return null;
  };

  /** Set selected image as the canvas background (cover page & send to back) or detach it */
  const setImageAsBackground = (maybeObj) => {
    const c = cvs.current;
    if (!c) return;
    const o = getSelectedImage(maybeObj);
    if (!o) {
      console.warn('setImageAsBackground: no image selected');
      return;
    }
    const { w, h } = size.current;

    if (o._isBackground) {
      // Detach from background: restore normal size and controls
      o._isBackground = false;
      const defaultW = Math.min(w * 0.45, 420);
      const ratio = (o.height || 1) / (o.width || 1);
      o.set({
        originX: 'center',
        originY: 'center',
        left: w / 2,
        top: h / 2,
        scaleX: defaultW / (o.width || 1),
        scaleY: (defaultW * ratio) / (o.height || 1),
        lockMovementX: false,
        lockMovementY: false,
        lockScalingX: false,
        lockScalingY: false,
        lockRotation: false,
        hasControls: true,
      });
      o.setCoords();
      c.bringObjectForward(o);
      c.setActiveObject(o);
      c.requestRenderAll();
      commit();
      readSel();
      return;
    }

    // Cover scale so image fills entire page without stretching/distortion
    const scale = Math.max(w / (o.width || 1), h / (o.height || 1));
    o.set({
      originX: 'center',
      originY: 'center',
      left: w / 2,
      top: h / 2,
      scaleX: scale,
      scaleY: scale,
      lockMovementX: true,
      lockMovementY: true,
      lockScalingX: true,
      lockScalingY: true,
      lockRotation: true,
      hasControls: false,
    });
    o._isBackground = true;
    o.setCoords();

    // Send to back so all text, shapes, icons, and logos sit cleanly on top
    c.sendObjectToBack(o);

    // Remove any solid white or panel background rects that block the image
    const blockingPanels = c.getObjects('rect').filter((rect) => {
      if (rect === o) return false;
      const f = String(rect.fill || '').toLowerCase();
      const isWhite =
        f === '#ffffff' ||
        f === '#fff' ||
        f === 'white' ||
        f === 'rgb(255, 255, 255)' ||
        f === 'rgb(255,255,255)' ||
        f === 'rgba(255, 255, 255, 1)' ||
        f === 'rgba(255,255,255,1)';
      const isPanel = rect.height >= 500 && rect.width >= 250;
      const isFullPage = rect.width >= w - 30 && rect.height >= h - 30;
      return (isWhite && isPanel) || isFullPage;
    });
    blockingPanels.forEach((p) => c.remove(p));

    c.setActiveObject(o);
    c.requestRenderAll();
    commit();
    readSel();
  };

  /** Add a text box directly above / on top of the selected image */
  const addTextOnImage = (maybeObj) => {
    const c = cvs.current;
    if (!c) return;
    const img = getSelectedImage(maybeObj);
    const { w, h } = size.current;
    let targetLeft = w / 2;
    let targetTop = h / 2;
    if (img && !img._isBackground) {
      targetLeft = img.left;
      targetTop = img.top;
    }
    const textBox = makeText({
      t: 'Add heading text',
      w: Math.min(w * 0.65, 480),
      size: 34,
      font: 'Poppins',
      bold: true,
      color: '#1a1a1a',
      align: 'center',
    });
    textBox.set({
      originX: 'center',
      originY: 'center',
      left: targetLeft,
      top: targetTop,
    });
    c.add(textBox);
    c.bringObjectToFront(textBox);
    c.setActiveObject(textBox);
    c.requestRenderAll();
    commit();
    textBox.enterEditing();
    textBox.selectAll();
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

  // ---------- Image Editing & Cropping ----------
  const openCrop = (customObj) => {
    const c = cvs.current;
    if (!c) return;
    const o = getSelectedImage(customObj);
    if (!o) {
      console.warn('openCrop: no image selected');
      return;
    }
    const src = o._originalSrc || o.getSrc?.() || (o._element && (o._element.src || o._element.currentSrc)) || '';
    if (!src) {
      console.warn('openCrop: no src found on image', o);
      return;
    }
    setCropTarget({
      obj: o,
      src,
      flipX: !!o.flipX,
      flipY: !!o.flipY,
      angle: o.angle || 0,
      isBackground: !!o._isBackground,
    });
  };
  openCropRef.current = openCrop;

  const closeCrop = () => {
    setCropTarget(null);
  };

  const applyCrop = async (croppedDataUrl, meta = {}) => {
    const c = cvs.current;
    if (!c || !cropTarget) return;
    const active = cropTarget.obj;
    if (!active) {
      setCropTarget(null);
      return;
    }

    const originalSrc = active._originalSrc || active.getSrc?.() || (active._element && (active._element.src || active._element.currentSrc));
    const originalW = active._originalWidth || active.width;
    const originalH = active._originalHeight || active.height;
    const wasBackground = !!active._isBackground;

    const newImg = await FabricImage.fromURL(croppedDataUrl, { crossOrigin: 'anonymous' });

    newImg.set({
      left: active.left,
      top: active.top,
      scaleX: active.scaleX || 1,
      scaleY: active.scaleY || 1,
      angle: active.angle || 0,
      opacity: active.opacity ?? 1,
      originX: active.originX || 'left',
      originY: active.originY || 'top',
      flipX: meta.flipX !== undefined ? meta.flipX : active.flipX,
      flipY: meta.flipY !== undefined ? meta.flipY : active.flipY,
    });

    newImg._originalSrc = originalSrc;
    newImg._originalWidth = originalW;
    newImg._originalHeight = originalH;
    newImg._isCropped = true;
    newImg._isBackground = wasBackground;

    if (wasBackground) {
      newImg.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
      });
    }

    if (active._cornerRadius) {
      setImageCornerRadius(active._cornerRadius, newImg);
    }

    c.remove(active);
    c.add(newImg);
    if (wasBackground) {
      c.sendObjectToBack(newImg);
    }
    c.setActiveObject(newImg);
    c.requestRenderAll();
    commit();
    setCropTarget(null);
    readSel();
  };

  const resetImageCrop = async () => {
    const c = cvs.current;
    if (!c) return;
    const active = getSelectedImage();
    if (!active || !active._originalSrc) return;
    const wasBackground = !!active._isBackground;

    const origUrl = active._originalSrc;
    const newImg = await FabricImage.fromURL(origUrl, { crossOrigin: 'anonymous' });
    newImg.set({
      left: active.left,
      top: active.top,
      scaleX: active.scaleX || 1,
      scaleY: active.scaleY || 1,
      angle: active.angle || 0,
      opacity: active.opacity ?? 1,
      originX: active.originX || 'left',
      originY: active.originY || 'top',
      flipX: active.flipX,
      flipY: active.flipY,
    });
    newImg._originalSrc = origUrl;
    newImg._isCropped = false;
    newImg._isBackground = wasBackground;

    if (wasBackground) {
      newImg.set({
        lockMovementX: true,
        lockMovementY: true,
        lockScalingX: true,
        lockScalingY: true,
        lockRotation: true,
        hasControls: false,
      });
    }

    c.remove(active);
    c.add(newImg);
    if (wasBackground) {
      c.sendObjectToBack(newImg);
    }
    c.setActiveObject(newImg);
    c.requestRenderAll();
    commit();
    readSel();
  };

  const flipImage = (axis = 'x') => {
    const c = cvs.current;
    const active = c && c.getActiveObject();
    if (!active) return;
    if (axis === 'x') {
      active.set('flipX', !active.flipX);
    } else {
      active.set('flipY', !active.flipY);
    }
    active.setCoords();
    c.requestRenderAll();
    queue();
    readSel();
  };

  const rotateImage = (deg = 90) => {
    const c = cvs.current;
    const active = c && c.getActiveObject();
    if (!active) return;
    const currentAngle = active.angle || 0;
    const newAngle = (currentAngle + deg) % 360;
    active.set('angle', newAngle);
    active.setCoords();
    c.requestRenderAll();
    queue();
    readSel();
  };

  const setImageCornerRadius = (r, customObj) => {
    const c = cvs.current;
    const active = customObj || (c && c.getActiveObject());
    if (!(active instanceof FabricImage)) return;
    const rad = Math.max(0, Number(r) || 0);
    if (rad === 0) {
      active.clipPath = null;
      active._cornerRadius = 0;
    } else {
      const rx = rad / (active.scaleX || 1);
      const ry = rad / (active.scaleY || 1);
      active.clipPath = new Rect({
        width: active.width,
        height: active.height,
        rx,
        ry,
        originX: 'center',
        originY: 'center',
      });
      active._cornerRadius = rad;
    }
    active.setCoords();
    c.requestRenderAll();
    queue();
    readSel();
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
    changeObjectSize, setObjectSize,
    setBackground, getBackground, setSize, setFolds, setZoom, getJSON, clear, loadPage, applyTemplate, buildPageFromSpecs, shufflePanels, isEmpty,
    render, renderPages,
    // helpers
    _canvas,
    addTemplateImage,
    makeSelectedImageEditable,
    replaceImage,
    fitImageToPage,
    setImageAsBackground,
    addTextOnImage,
    _snapshot,
    // image editing
    cropTarget,
    openCrop,
    closeCrop,
    applyCrop,
    resetImageCrop,
    flipImage,
    rotateImage,
    setImageCornerRadius,
  };
}