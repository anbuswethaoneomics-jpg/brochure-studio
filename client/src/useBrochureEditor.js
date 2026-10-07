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
  const size = useRef({ w: 1123, h: 794, z: 1 });
  const [sel, setSel] = useState(null);
  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });

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

  const sanitizeDesignJson = (json) => {
    if (!json) return json;
    try {
      let str = typeof json === 'string' ? json : JSON.stringify(json);
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
    resetHistory();

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
        if (e.altKey && (k === 'arrowup' || k === 'arrowdown')) {
          const grow = k === 'arrowup';
          const rate = e.shiftKey ? 0.2 : 0.05;
          const factor = grow ? (1 + rate) : (1 - rate);
          if (o.type === 'textbox' || o.type === 'i-text') {
            const curSize = o.fontSize || 16;
            const delta = grow ? (e.shiftKey ? 4 : 1) : (e.shiftKey ? -4 : -1);
            o.set({ fontSize: Math.max(6, Math.min(400, curSize + delta)) });
          } else {
            const center = o.getCenterPoint ? o.getCenterPoint() : { x: o.left, y: o.top };
            o.set({ scaleX: Math.max(0.02, (o.scaleX || 1) * factor), scaleY: Math.max(0.02, (o.scaleY || 1) * factor) });
            if (o.setPositionByOrigin) o.setPositionByOrigin(center, 'center', 'center');
          }
          o.setCoords(); c.requestRenderAll(); queue(); readSel();
          return;
        }
        const step = e.shiftKey ? 10 : 1;
        const d = { arrowleft: [-step, 0], arrowright: [step, 0], arrowup: [0, -step], arrowdown: [0, step] }[k];
        o.set({ left: o.left + d[0], top: o.top + d[1] }); o.setCoords(); c.requestRenderAll(); queue();
      }
      else if (o && (k === ']' || k === '[' || k === '+' || k === '=' || k === '-' || k === '_')) {
        e.preventDefault();
        const grow = (k === ']' || k === '+' || k === '=');
        const rate = e.shiftKey ? 0.2 : 0.05;
        const factor = grow ? (1 + rate) : (1 - rate);
        if (o.type === 'textbox' || o.type === 'i-text') {
          const curSize = o.fontSize || 16;
          const delta = grow ? (e.shiftKey ? 4 : 1) : (e.shiftKey ? -4 : -1);
          o.set({ fontSize: Math.max(6, Math.min(400, curSize + delta)) });
        } else {
          const center = o.getCenterPoint ? o.getCenterPoint() : { x: o.left, y: o.top };
          o.set({ scaleX: Math.max(0.02, (o.scaleX || 1) * factor), scaleY: Math.max(0.02, (o.scaleY || 1) * factor) });
          if (o.setPositionByOrigin) o.setPositionByOrigin(center, 'center', 'center');
        }
        o.setCoords(); c.requestRenderAll(); queue(); readSel();
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
    c.discardActiveObject(); // objects return to absolute coordinates
    const clones = [];
    for (const o of objs) {
      const cl = await o.clone();
      cl.set({ left: o.left + 24, top: o.top + 24 });
      c.add(cl); clones.push(cl);
    }
    c.setActiveObject(clones.length === 1 ? clones[0] : new ActiveSelection(clones, { canvas: c }));
    c.requestRenderAll();
  };
  const setBackground = (color) => { const c = cvs.current; c.backgroundColor = color; c.requestRenderAll(); queue(); };
  const getBackground = () => hex(cvs.current?.backgroundColor);

  // ---------- pages, size, zoom ----------
  const setSize = (w, h) => { size.current = { ...size.current, w, h }; applyZoom(); };
  const setZoom = (z) => { size.current = { ...size.current, z }; applyZoom(); };
  const getJSON = () => cvs.current.toObject();
  const clear = async (bg = '#ffffff') => {
    const c = cvs.current; busy.current = true;
    c.discardActiveObject(); c.clear(); c.backgroundColor = bg;
    applyZoom(); busy.current = false; resetHistory(); readSel();
  };
  const loadPage = async (json) => {
    if (!json) return clear();
    await restore(json); resetHistory();
  };
  const applyTemplate = async (tpl) => {
    const c = cvs.current; busy.current = true;
    c.discardActiveObject(); c.clear(); c.backgroundColor = tpl.bg;
    size.current = { ...size.current, w: tpl.w, h: tpl.h };
    for (const s of tpl.specs()) { const o = await buildSpec(s); if (o) c.add(o); }
    applyZoom(); busy.current = false; snapshot(); readSel();
  };
  const isEmpty = () => cvs.current.getObjects().length === 0;

  // ---------- export ----------
  // Renders at native size (zoom 1), then puts the on-screen zoom back.
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
    elRef, sel, ...flags,
    undo, redo, addText, addShape, addIcon, addImage,
    setProps, setColor, setStroke, setCorner, toggle, layer, centerOnPage, remove, duplicate,
    setBackground, getBackground, setSize, setZoom, getJSON, clear, loadPage, applyTemplate, isEmpty,
    render, renderPages,
  };
}
