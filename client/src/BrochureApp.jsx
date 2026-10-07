import { useEffect, useRef, useState } from 'react';
import { useEditor } from './useEditor.js';
import Sidebar from './components/StudioSidebar.jsx';
import PropsBar from './components/PropsBar.jsx';
import Ico from './components/Ico.jsx';
import { PRESETS } from './presets.js';
import { loadFonts } from './fonts.js';
import { TEMPLATES } from './templates.js';
import { buildSpec } from './objects.js';
import { listDesigns, getDesign, saveDesign, deleteDesign } from './api.js';

const download = (href, name) => {
  const a = document.createElement('a');
  a.href = href; a.download = name; a.click();
};
const fileName = (n) => (n || 'design').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'design';

export default function App() {
  const ed = useEditor();
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  const [design, setDesign] = useState({ id: null, name: 'Untitled design', width: 1123, height: 794, folds: 3 });
  const [pages, setPages] = useState([null]); // saved JSON per page; the live page is read from the canvas
  const [pageIdx, setPageIdx] = useState(0);
  const [zoom, setZoomState] = useState(1);
  const [showFolds, setShowFolds] = useState(true);
  const [modal, setModal] = useState('new');
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const notify = (m) => { setToast(m); clearTimeout(notify.t); notify.t = setTimeout(() => setToast(''), 3500); };

  // Fonts must be loaded before the canvas draws text with them.
  useEffect(() => { loadFonts().then(() => ed.setSize(design.width, design.height)); /* redraw with fonts */ }, []); // eslint-disable-line

  const fit = (w = design.width, h = design.height) => {
    const el = wsRef.current; if (!el) return;
    const z = Math.min((el.clientWidth - 72) / w, (el.clientHeight - 72) / h, 1);
    const zz = Math.max(0.1, Math.round(z * 100) / 100);
    ed.setZoom(zz); setZoomState(zz);
  };
  useEffect(() => { fit(); }, []); // eslint-disable-line
  const zoomBy = (d) => { const z = Math.min(3, Math.max(0.1, Math.round((zoom + d) * 100) / 100)); ed.setZoom(z); setZoomState(z); };

  // Mark unsaved after any edit (history length/pointer changes).
  useEffect(() => { setSaved(false); }, [ed.canUndo, ed.canRedo]);

  const currentPages = () => pages.map((p, i) => (i === pageIdx ? ed.getJSON() : p));

  // ---------- design lifecycle ----------
  const startDesign = async (p) => {
    setDesign({ id: null, name: 'Untitled design', width: p.w, height: p.h, folds: p.folds || 0 });
    setPages([null]); setPageIdx(0);
    ed.setSize(p.w, p.h);
    await ed.clear('#ffffff');
    fit(p.w, p.h); setModal(null); setSaved(false);
  };

  const openDesign = async (id) => {
    try {
      const d = await getDesign(id);
      setDesign({ id: d.id, name: d.name, width: d.width, height: d.height, folds: d.folds || 0, templateId: d.templateId || null });
      if (d.isTemplate && (!d.pages || !d.pages.length)) {
        const tpl = TEMPLATES.find((t) => t.id === (d.templateId || d.id) || t.name === d.name);
        if (tpl) {
          ed.setSize(tpl.w, tpl.h, tpl.folds || 0);
          const pgs = await ed.applyTemplate(tpl);
          setPages(pgs || [null]); setPageIdx(0);
          fit(tpl.w, tpl.h); setModal(null); setSaved(true);
          return;
        }
      }
      const safePages = Array.isArray(d.pages) && d.pages.length ? d.pages : [null];
      setPages(safePages); setPageIdx(0);
      ed.setSize(d.width, d.height, d.folds || 0);
      if (safePages[0]) {
        await ed.loadPage(safePages[0]);
      }
      fit(d.width, d.height); setModal(null); setSaved(true);
    } catch (e) { notify(e.message); }
  };

  const openLocalFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
      reader.onload = async (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed.pages && Array.isArray(parsed.pages)) {
            const w = parsed.width || 1123;
            const h = parsed.height || 794;
            setDesign({
              id: parsed.id || null,
              name: parsed.name || file.name.replace(/\.json$/i, ''),
              width: w,
              height: h,
              folds: parsed.folds || 0,
            });
            setPages(parsed.pages);
            setPageIdx(0);
            ed.setSize(w, h);
            await ed.loadPage(parsed.pages[0]);
            fit(w, h);
            setModal(null);
            setSaved(true);
            notify(`Opened ${file.name}`);
          } else if (parsed.objects || parsed.version) {
            const w = parsed.width || design.width;
            const h = parsed.height || design.height;
            setDesign((d) => ({
              ...d,
              name: file.name.replace(/\.json$/i, ''),
              width: w,
              height: h,
            }));
            setPages([parsed]);
            setPageIdx(0);
            ed.setSize(w, h);
            await ed.loadPage(parsed);
            fit(w, h);
            setModal(null);
            setSaved(true);
            notify(`Opened ${file.name}`);
          } else {
            notify('Invalid design JSON format');
          }
        } catch (err) {
          notify(`Failed to read file: ${err.message}`);
        }
      };
      reader.readAsText(file);
    } else if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)) {
      reader.onload = async (evt) => {
        try {
          const dataUrl = evt.target.result;
          const img = new Image();
          img.onload = async () => {
            const w = img.naturalWidth || 600;
            const h = img.naturalHeight || 1100;
            setDesign({ id: null, name: file.name.replace(/\.[^/.]+$/, ''), width: w, height: h, folds: 0 });
            setPages([null]); setPageIdx(0);
            ed.setSize(w, h);
            await ed.clear('#ffffff');
            // Place imported image as full-canvas background (at back) — user can add text/elements on top
            await ed.addTemplateImage(dataUrl, w, h);
            fit(w, h);
            setModal(null); setSaved(false);
            notify('Image imported as background — double-click canvas to add text on top');
          };
          img.src = dataUrl;
        } catch (err) { notify(`Failed to open image: ${err.message}`); }
      };
      reader.readAsDataURL(file);
    } else {
      notify('Please select a .json design file or an image');
    }
    e.target.value = '';
  };

  // Opens file picker starting at Downloads folder (modern browsers) with fallback
  const triggerOpenFile = async () => {
    if (window.showOpenFilePicker) {
      try {
        const [fh] = await window.showOpenFilePicker({
          startIn: 'downloads',
          types: [
            { description: 'Design or Image', accept: { 'application/json': ['.json'], 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'] } },
          ],
          multiple: false,
        });
        const file = await fh.getFile();
        // Reuse the same openLocalFile logic via a synthetic event-like call
        processFile(file);
      } catch (err) {
        if (err.name !== 'AbortError') notify(`Could not open file: ${err.message}`);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  // ---------- image import → editable layers ─────────────────────────
  // Finds the best matching template by filename keywords
  const matchTemplate = (filename) => {
    const n = filename.toLowerCase();
    if (/onam|temp|festival|kerala|boat/.test(n)) return TEMPLATES.find(t => t.id === 'onam');
    if (/trifold|brochure|tri.fold/.test(n)) return TEMPLATES.find(t => t.id === 'trifold');
    if (/poster|event|fair/.test(n)) return TEMPLATES.find(t => t.id === 'poster');
    if (/quote|post/.test(n)) return TEMPLATES.find(t => t.id === 'quote');
    return null;
  };

  // Core import handler shared by both <input> fallback and showOpenFilePicker
  const processFile = (file) => {
    const reader = new FileReader();

    // ── JSON design file ──────────────────────────────────────────────
    if (file.name.toLowerCase().endsWith('.json') || file.type === 'application/json') {
      reader.onload = async (evt) => {
        try {
          const parsed = JSON.parse(evt.target.result);
          if (parsed.pages && Array.isArray(parsed.pages)) {
            const w = parsed.width || 1123;
            const h = parsed.height || 794;
            setDesign({ id: parsed.id || null, name: parsed.name || file.name.replace(/\.json$/i, ''), width: w, height: h, folds: parsed.folds || 0 });
            setPages(parsed.pages); setPageIdx(0);
            ed.setSize(w, h); await ed.loadPage(parsed.pages[0]); fit(w, h);
            setModal(null); setSaved(true); notify(`Opened ${file.name}`);
          } else if (parsed.objects || parsed.version) {
            const w = parsed.width || design.width;
            const h = parsed.height || design.height;
            setDesign((d) => ({ ...d, name: file.name.replace(/\.json$/i, ''), width: w, height: h }));
            setPages([parsed]); setPageIdx(0);
            ed.setSize(w, h); await ed.loadPage(parsed); fit(w, h);
            setModal(null); setSaved(true); notify(`Opened ${file.name}`);
          } else { notify('Invalid design JSON format'); }
        } catch (err) { notify(`Failed to read file: ${err.message}`); }
      };
      reader.readAsText(file);
      return;
    }

    // ── Image file ────────────────────────────────────────────────────
    if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)) {
      reader.onload = async (evt) => {
        try {
          const dataUrl = evt.target.result;
          const img = new Image();
          img.onload = async () => {
            const w = img.naturalWidth || 600;
            const h = img.naturalHeight || 1100;
            const name = file.name.replace(/\.[^/.]+$/, '');

            // Check if this image matches a known template
            const matched = matchTemplate(file.name);

            if (matched) {
              // ── EDITABLE MODE: load the matching template (all separate clickable elements) ──
              // Use the image as canvas background, then overlay all template elements on top
              setDesign({ id: null, name, width: matched.w, height: matched.h, folds: matched.folds || 0 });
              setPages([null]); setPageIdx(0);
              ed.setSize(matched.w, matched.h);

              // 1. Set the imported image as the page background image (stretched to fit)
              await ed.clear(matched.bg || '#ffffff');
              await ed.addTemplateImage(dataUrl, matched.w, matched.h);

              // 2. Now overlay all the editable text/element specs from the template on top
              //    We only add text and icon specs — imported image provides the visual background
              const c = ed._canvas();
              if (c) {
                const specs = matched.specs();
                for (const spec of specs) {
                  // Skip plain rect/circle background decoration — the imported image handles visuals
                  // But keep text, icons, and image specs (boat etc.) as editable layers
                  if (spec.k === 'text' || spec.k === 'icon') {
                    try {
                      const obj = await buildSpec(spec);
                      if (obj) {
                        c.add(obj);
                        // Text: make sure it's immediately editable
                      }
                    } catch (err) { console.warn('spec error', err); }
                  }
                }
                c.requestRenderAll();
              }

              fit(matched.w, matched.h);
              setModal(null); setSaved(false);
              notify(`✅ Loaded as editable poster — click any text to edit, drag to move!`);
            } else {
              // ── GENERIC IMAGE: place as background, prompt to add text ──
              setDesign({ id: null, name, width: w, height: h, folds: 0 });
              setPages([null]); setPageIdx(0);
              ed.setSize(w, h);
              await ed.clear('#ffffff');
              await ed.addTemplateImage(dataUrl, w, h);
              fit(w, h);
              setModal(null); setSaved(false);
              notify('Image added — double-click anywhere to add editable text on top');
            }
          };
          img.src = dataUrl;
        } catch (err) { notify(`Failed to open image: ${err.message}`); }
      };
      reader.readAsDataURL(file);
      return;
    }

    notify('Please select a .json design file or an image');
  };

  const save = async () => {
    setBusy(true);
    try {
      const all = currentPages();
      const thumbnail = ed.render(Math.min(1, 240 / design.width), 'jpeg');
      const res = await saveDesign({ ...design, pages: all, thumbnail });
      setDesign((d) => ({ ...d, id: res.id })); setPages(all); setSaved(true);
      window.dispatchEvent(new CustomEvent('design-saved'));
      notify('Design saved');
    } catch (e) { notify(`Could not save: ${e.message}`); }
    setBusy(false);
  };

  const applyTemplate = async (t) => {
    if (!ed.isEmpty() && !window.confirm('Replace the current page with this template?')) return;
    setDesign((d) => ({ ...d, width: t.w, height: t.h, folds: t.folds || 0 }));
    await ed.applyTemplate(t);
    fit(t.w, t.h);
    setSaved(false);
  };

  // ---------- pages ----------
  const switchPage = async (i) => {
    if (i === pageIdx) return;
    const next = currentPages();
    setPages(next); setPageIdx(i);
    await ed.loadPage(next[i]);
  };
  const addPage = async (duplicate = false) => {
    const next = currentPages();
    const ins = duplicate ? next[pageIdx] : null;
    next.splice(pageIdx + 1, 0, ins);
    setPages(next); setPageIdx(pageIdx + 1);
    await ed.loadPage(ins);
  };
  const deletePage = async () => {
    if (pages.length === 1) return;
    const next = currentPages(); next.splice(pageIdx, 1);
    const i = Math.min(pageIdx, next.length - 1);
    setPages(next); setPageIdx(i);
    await ed.loadPage(next[i]);
  };

  // ---------- export ----------
  const exportPNG = () => {
    setMenu(false);
    download(ed.render(2), `${fileName(design.name)}-page-${pageIdx + 1}.png`);
  };
  const exportPDF = async () => {
    setMenu(false); setBusy(true);
    try {
      const all = currentPages();
      const urls = await ed.renderPages(all, 2);
      const { jsPDF } = await import('jspdf');
      const { width: w, height: h } = design;
      const pdf = new jsPDF({ orientation: w >= h ? 'landscape' : 'portrait', unit: 'px', format: [w, h], hotfixes: ['px_scaling'] });
      urls.forEach((u, i) => { if (i) pdf.addPage([w, h], w >= h ? 'landscape' : 'portrait'); pdf.addImage(u, 'PNG', 0, 0, w, h); });
      pdf.save(`${fileName(design.name)}.pdf`);
      await ed.loadPage(all[pageIdx]);
    } catch (e) { notify(`Export failed: ${e.message}`); }
    setBusy(false);
  };
  const exportJSON = () => {
    setMenu(false);
    const all = currentPages();
    const data = JSON.stringify({ ...design, pages: all }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    download(url, `${fileName(design.name)}.json`);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <header className="top">
        <div className="brand">Brochure Studio</div>
        <button className="btn" onClick={() => setModal('new')}><Ico name="plus" /> New</button>
        <button className="btn" onClick={triggerOpenFile} title="Open file from computer"><Ico name="folder" /> Open</button>
        <input ref={fileInputRef} type="file" accept=".json,image/*,application/json" style={{ display: 'none' }} onChange={openLocalFile} />
        <input className="name" value={design.name} aria-label="Design name" onChange={(e) => setDesign({ ...design, name: e.target.value })} />
        <div className="grow" />
        <button className="icon" onClick={ed.undo} disabled={!ed.canUndo} title="Undo (Ctrl+Z)" aria-label="Undo"><Ico name="undo" /></button>
        <button className="icon" onClick={ed.redo} disabled={!ed.canRedo} title="Redo (Ctrl+Y)" aria-label="Redo"><Ico name="redo" /></button>
        <button className="btn" onClick={save} disabled={busy}><Ico name="save" /> {saved ? 'Saved' : 'Save'}</button>
        <div className="menu-wrap">
          <button className="btn primary" onClick={() => setMenu(!menu)} disabled={busy} aria-expanded={menu}><Ico name="download" /> Download</button>
          {menu && (
            <div className="menu" role="menu">
              <button role="menuitem" onClick={exportPNG}>PNG image (this page)</button>
              <button role="menuitem" onClick={exportPDF}>PDF (all pages)</button>
              <button role="menuitem" onClick={exportJSON}>Design file (.json)</button>
            </div>
          )}
        </div>
      </header>

      <div className="body">
        <Sidebar ed={ed} onTemplate={applyTemplate} notify={notify} onOpenDesign={openDesign} onOpenFile={() => fileInputRef.current?.click()} />
        <main className="stage">
          <PropsBar ed={ed} bg={ed.getBackground()} />
          <div className="ws" ref={wsRef} onMouseDown={() => setMenu(false)}>
            <div className="page" style={{ width: design.width * zoom, height: design.height * zoom }}>
              <canvas ref={ed.elRef} />
              {showFolds && design.folds > 1 && (
                <div className="folds" aria-hidden="true">
                  {Array.from({ length: design.folds - 1 }, (_, i) => <i key={i} style={{ left: `${((i + 1) / design.folds) * 100}%` }} />)}
                </div>
              )}
            </div>
          </div>
          <footer className="bottom">
            <div className="pages">
              {pages.map((_, i) => (
                <button key={i} className={`chip ${i === pageIdx ? 'on' : ''}`} onClick={() => switchPage(i)}>Page {i + 1}</button>
              ))}
              <button className="chip add" onClick={() => addPage(false)}><Ico name="plus" size={14} /> Add page</button>
              <button className="chip add" onClick={() => addPage(true)}><Ico name="copy" size={14} /> Duplicate</button>
              <button className="chip add" onClick={deletePage} disabled={pages.length === 1}><Ico name="trash" size={14} /> Delete</button>
            </div>
            <div className="grow" />
            {design.folds > 1 && (
              <label className="check"><input type="checkbox" checked={showFolds} onChange={(e) => setShowFolds(e.target.checked)} /> Fold lines</label>
            )}
            <button className="icon" onClick={() => zoomBy(-0.1)} aria-label="Zoom out"><Ico name="minus" /></button>
            <span className="zoom">{Math.round(zoom * 100)}%</span>
            <button className="icon" onClick={() => zoomBy(0.1)} aria-label="Zoom in"><Ico name="plus" /></button>
            <button className="btn small" onClick={() => fit()}>Fit</button>
          </footer>
        </main>
      </div>

      {modal === 'new' && <NewModal onPick={startDesign} onClose={() => setModal(null)} />}
      {modal === 'open' && <OpenModal onPick={openDesign} onOpenFile={() => fileInputRef.current?.click()} onClose={() => setModal(null)} notify={notify} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function NewModal({ onPick, onClose }) {
  const [w, setW] = useState(1000);
  const [h, setH] = useState(1000);
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="New design">
        <h2>Start a new design</h2>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.id} className="preset" onClick={() => onPick(p)}>
              <span className="preset-art" style={{ aspectRatio: `${p.w}/${p.h}` }} />
              <b>{p.name}</b><small>{p.note}</small>
            </button>
          ))}
        </div>
        <div className="custom">
          <b>Custom size (px)</b>
          <input type="number" value={w} min={100} max={5000} onChange={(e) => setW(+e.target.value)} aria-label="Width" />
          <span>by</span>
          <input type="number" value={h} min={100} max={5000} onChange={(e) => setH(+e.target.value)} aria-label="Height" />
          <button className="btn primary" onClick={() => onPick({ w: Math.max(100, w), h: Math.max(100, h), folds: 0 })}>Create</button>
        </div>
      </div>
    </div>
  );
}

function OpenModal({ onPick, onOpenFile, onClose, notify }) {
  const [rows, setRows] = useState(null);
  const load = () => listDesigns().then(setRows).catch((e) => { setRows([]); notify(`Could not load designs: ${e.message}`); });
  useEffect(() => { load(); }, []); // eslint-disable-line
  const remove = async (id) => {
    if (!window.confirm('Delete this design? This cannot be undone.')) return;
    await deleteDesign(id); load();
  };
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="Open design">
        <h2>Your designs</h2>
        <div style={{ marginBottom: 16 }}>
          <button
            className="btn primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => { onClose(); onOpenFile(); }}
          >
            <Ico name="folder" /> Open file from computer (.json, image)
          </button>
        </div>
        {rows === null && <p className="hint">Loading...</p>}
        {rows && rows.length === 0 && <p className="hint">No designs saved on the server yet. You can open any file from your computer above.</p>}
        <div className="presets">
          {rows && rows.map((d) => (
            <div key={d.id} className="preset saved">
              <button onClick={() => onPick(d.id)} className="saved-open">
                {d.thumbnail ? <img src={d.thumbnail} alt="" /> : <span className="preset-art" style={{ aspectRatio: `${d.width}/${d.height}` }} />}
                <b>{d.name}</b>
                <small>{d.pageCount} page{d.pageCount > 1 ? 's' : ''}, edited {new Date(d.updatedAt).toLocaleDateString()}</small>
              </button>
              <button className="icon del" onClick={() => remove(d.id)} aria-label={`Delete ${d.name}`}><Ico name="trash" size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
