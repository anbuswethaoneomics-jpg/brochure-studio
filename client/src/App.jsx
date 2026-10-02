import { useEffect, useRef, useState } from 'react';
import { Textbox } from 'fabric';
import { useEditor } from './useBrochureEditor.js';
import Sidebar from './components/Sidebar.jsx';
import PropsBar from './components/PropsBar.jsx';
import Ico from './components/Ico.jsx';
import { PRESETS } from './presets.js';
import { loadFonts } from './fonts.js';
import { TEMPLATES } from './templates.js';
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
  const [design, setDesign] = useState({ id: null, name: 'Oneomics Onam Festival Poster', width: 600, height: 1100, folds: 0 });
  const [pages, setPages] = useState([null]); // saved JSON per page; the live page is read from the canvas
  const [pageIdx, setPageIdx] = useState(0);
  const [zoom, setZoomState] = useState(1);
  const [showFolds, setShowFolds] = useState(false);
  const [modal, setModal] = useState(null); // Default null so the editable poster is shown immediately!
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const notify = (m) => { setToast(m); clearTimeout(notify.t); notify.t = setTimeout(() => setToast(''), 3500); };

  const fit = (w = design.width, h = design.height) => {
    const el = wsRef.current; if (!el) return;
    const z = Math.min((el.clientWidth - 72) / w, (el.clientHeight - 72) / h, 1);
    const zz = Math.max(0.1, Math.round(z * 100) / 100);
    ed.setZoom(zz); setZoomState(zz);
  };

  // Fonts must be loaded before the canvas draws text with them.
  // DEFAULT LOAD: Automatically load the Oneomics Onam Festival Poster with full editable elements!
  useEffect(() => {
    loadFonts().then(async () => {
      ed.setSize(600, 1100);
      const onamTpl = TEMPLATES.find((t) => t.id === 'onam');
      if (onamTpl) {
        await ed.applyTemplate(onamTpl);
        fit(600, 1100);
      }
    });
  }, []); // eslint-disable-line

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
      setDesign({ id: d.id, name: d.name, width: d.width, height: d.height, folds: d.folds || 0 });
      setPages(d.pages); setPageIdx(0);
      ed.setSize(d.width, d.height);
      await ed.loadPage(d.pages[0]);
      fit(d.width, d.height); setModal(null); setSaved(true);
    } catch (e) { notify(e.message); }
  };

  const processFile = async (file) => {
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
    } else if (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.svg')) {
      // Check if opening the Onam / Oneomics festive template
      const isTempOrFestival = file.name.toLowerCase().includes('temp') || file.name.toLowerCase().includes('onam');
      if (isTempOrFestival) {
        const onamTpl = TEMPLATES.find((t) => t.id === 'onam');
        if (onamTpl) {
          setDesign({
            id: null,
            name: file.name.replace(/\.[^/.]+$/, ''),
            width: 600,
            height: 1100,
            folds: 0,
          });
          setPages([null]);
          setPageIdx(0);
          await ed.applyTemplate(onamTpl);
          fit(600, 1100);
          setModal(null);
          setSaved(false);
          notify('Oneomics Festival Poster loaded! All text and images are fully editable.');
          return;
        }
      }

      // For any other image: fit image and add editable heading overlay
      reader.onload = async (evt) => {
        try {
          const dataUrl = evt.target.result;
          const img = new Image();
          img.onload = async () => {
            try {
              const w = img.naturalWidth || 600;
              const h = img.naturalHeight || 1000;
              setDesign({
                id: null,
                name: file.name.replace(/\.[^/.]+$/, ''),
                width: w,
                height: h,
                folds: 0,
              });
              setPages([null]);
              setPageIdx(0);
              ed.setSize(w, h);
              await ed.clear('#ffffff');
              await ed.addTemplateImage(dataUrl, w, h);

              ed.addRawObj(new Textbox('Add Heading Here', {
                left: w * 0.15,
                top: h * 0.25,
                width: w * 0.7,
                fontSize: Math.round(w * 0.07),
                fontFamily: 'Montserrat',
                fontWeight: 'bold',
                textAlign: 'center',
                fill: '#1b2b27',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }));

              fit(w, h);
              setModal(null);
              setSaved(false);
              notify(`Image loaded! Click "+ Add Text" or double-click anywhere to type.`);
            } catch (err) {
              console.error(err);
              notify(`Error loading image: ${err.message}`);
            }
          };
          img.src = dataUrl;
        } catch (err) {
          notify(`Failed to open image: ${err.message}`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      notify('Please select a .json design file or an image');
    }
  };

  const handleOpenFile = async () => {
    // If the browser supports the File System Access API with startIn
    if (window.showOpenFilePicker) {
      try {
        const [fileHandle] = await window.showOpenFilePicker({
          startIn: 'downloads',
          types: [
            {
              description: 'Designs & Images',
              accept: {
                'application/json': ['.json'],
                'image/*': ['.png', '.jpg', '.jpeg', '.svg', '.webp'],
              },
            },
          ],
        });
        const file = await fileHandle.getFile();
        processFile(file);
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }
    fileInputRef.current?.click();
  };

  const openLocalFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = '';
  };

  const save = async () => {
    setBusy(true);
    try {
      const all = currentPages();
      const thumbnail = ed.render(Math.min(1, 240 / design.width), 'jpeg');
      const res = await saveDesign({ ...design, pages: all, thumbnail });
      setDesign((d) => ({ ...d, id: res.id })); setPages(all); setSaved(true);
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
  const exportJPG = () => {
    setMenu(false);
    download(ed.render(2, 'jpeg'), `${fileName(design.name)}-page-${pageIdx + 1}.jpg`);
  };
  const exportPDF = async () => {
    setMenu(false); setBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const orientation = design.width >= design.height ? 'l' : 'p';
      const doc = new jsPDF({ orientation, unit: 'px', format: [design.width, design.height] });
      const pagesData = currentPages();
      const urls = await ed.renderPages(pagesData, 2);
      urls.forEach((u, i) => {
        if (i > 0) doc.addPage([design.width, design.height], orientation);
        doc.addImage(u, 'PNG', 0, 0, design.width, design.height);
      });
      doc.save(`${fileName(design.name)}.pdf`);
    } catch (e) { notify(`PDF failed: ${e.message}`); }
    setBusy(false);
  };
  const exportJSON = () => {
    setMenu(false);
    const blob = new Blob([JSON.stringify({ ...design, pages: currentPages() }, null, 2)], { type: 'application/json' });
    download(URL.createObjectURL(blob), `${fileName(design.name)}.json`);
  };

  return (
    <div className="app">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,image/*"
        style={{ display: 'none' }}
        onChange={openLocalFile}
      />
      <header className="top">
        <div className="brand">
          <Ico name="sparkles" size={22} />
          <strong>Brochure Studio</strong>
        </div>

        <button className="btn" onClick={() => setModal('new')}><Ico name="plus" /> New</button>
        <button className="btn" onClick={handleOpenFile} title="Open design file or template image from Downloads"><Ico name="folder" /> Open</button>

        <input
          className="name"
          value={design.name}
          onChange={(e) => setDesign({ ...design, name: e.target.value })}
          aria-label="Design name"
        />

        <div className="top-right">
          <button className="icon-btn" disabled={!ed.canUndo} onClick={ed.undo} title="Undo (Ctrl+Z)"><Ico name="undo" /></button>
          <button className="icon-btn" disabled={!ed.canRedo} onClick={ed.redo} title="Redo (Ctrl+Y)"><Ico name="redo" /></button>
          <span className="sep" />
          <button className={`btn ${saved ? 'ghost' : 'accent'}`} onClick={save} disabled={busy}>
            <Ico name="save" /> {saved ? 'Saved' : 'Save'}
          </button>
          <div className="drop-wrap">
            <button className="btn cta" onClick={() => setMenu(!menu)}><Ico name="download" /> Download</button>
            {menu && (
              <div className="menu">
                <button onClick={exportPNG}>PNG (high res)</button>
                <button onClick={exportJPG}>JPEG</button>
                <button onClick={exportPDF}>PDF (all pages)</button>
                <button onClick={exportJSON}>Design JSON (editable backup)</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="main">
        <Sidebar ed={ed} onTemplate={applyTemplate} notify={notify} />

        <div className="stage">
          <PropsBar ed={ed} bg={ed.getBackground()} />

          <div className="ws" ref={wsRef} onClick={() => setMenu(false)}>
            <div
              className="page"
              style={{
                width: design.width * zoom,
                height: design.height * zoom,
              }}
            >
              <canvas ref={ed.elRef} />
              {showFolds && design.folds > 1 && (
                <div className="folds">
                  {Array.from({ length: design.folds - 1 }).map((_, i) => (
                    <i key={i} style={{ left: `${((i + 1) / design.folds) * 100}%` }} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <footer className="bottom">
            <div className="pages">
              {pages.map((_, i) => (
                <button key={i} className={`chip ${i === pageIdx ? 'on' : ''}`} onClick={() => switchPage(i)}>
                  Page {i + 1}
                </button>
              ))}
              <button className="chip add" onClick={() => addPage(false)} title="Add blank page"><Ico name="plus" size={14} /></button>
              <button className="chip add" onClick={() => addPage(true)} title="Duplicate page"><Ico name="copy" size={14} /> Duplicate</button>
              {pages.length > 1 && (
                <button className="chip add" onClick={deletePage} title="Delete page"><Ico name="trash" size={14} /> Delete</button>
              )}
            </div>

            <div style={{ flex: 1 }} />

            {design.folds > 1 && (
              <label className="check">
                <input type="checkbox" checked={showFolds} onChange={(e) => setShowFolds(e.target.checked)} />
                Fold guides
              </label>
            )}

            <button className="icon-btn" onClick={() => zoomBy(-0.1)} title="Zoom out"><Ico name="minus" /></button>
            <span className="zoom">{Math.round(zoom * 100)}%</span>
            <button className="icon-btn" onClick={() => zoomBy(0.1)} title="Zoom in"><Ico name="plus" /></button>
            <button className="btn ghost sm" onClick={() => fit()}>Fit</button>
          </footer>
        </div>
      </div>

      {modal === 'new' && (
        <ModalPresets
          onPick={startDesign}
          onClose={() => setModal(null)}
          onOpenSaved={() => setModal('saved')}
        />
      )}
      {modal === 'saved' && (
        <ModalSaved
          onPick={openDesign}
          onClose={() => setModal(null)}
          notify={notify}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function ModalPresets({ onPick, onClose, onOpenSaved }) {
  const [w, setW] = useState(1123);
  const [h, setH] = useState(794);
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2>Start a new design</h2>
          <button className="btn" onClick={onOpenSaved}><Ico name="folder" /> Your saved designs</button>
        </div>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.id} className="preset" onClick={() => onPick(p)}>
              <span className="preset-art" style={{ aspectRatio: `${p.w}/${p.h}` }} />
              <strong>{p.name}</strong>
              <small>{p.desc}</small>
            </button>
          ))}
        </div>
        <form className="custom" onSubmit={(e) => { e.preventDefault(); onPick({ w: parseInt(w, 10), h: parseInt(h, 10), folds: 0 }); }}>
          <span>Custom size:</span>
          <input type="number" value={w} onChange={(e) => setW(e.target.value)} min={200} max={6000} placeholder="Width" />
          <span>&times;</span>
          <input type="number" value={h} onChange={(e) => setH(e.target.value)} min={200} max={6000} placeholder="Height" />
          <span>px</span>
          <button type="submit" className="btn accent" style={{ marginLeft: 'auto' }}>Create</button>
        </form>
      </div>
    </div>
  );
}

function ModalSaved({ onPick, onClose, notify }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listDesigns()
      .then(setList)
      .catch((e) => notify(e.message))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line
  const del = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved design?')) return;
    await deleteDesign(id);
    setList(list.filter((d) => d.id !== id));
  };
  return (
    <div className="scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Your designs</h2>
        {loading && <p>Loading...</p>}
        {!loading && list.length === 0 && <p>Nothing saved yet. Press Save in the top bar to keep a design.</p>}
        <div className="presets">
          {list.map((d) => (
            <div key={d.id} className="preset saved">
              <button className="saved-open" onClick={() => onPick(d.id)}>
                {d.thumbnail ? <img src={d.thumbnail} alt="" /> : <span className="preset-art" />}
                <strong>{d.name}</strong>
                <small>{new Date(d.updatedAt).toLocaleDateString()}</small>
              </button>
              <button className="icon-btn del" onClick={(e) => del(e, d.id)} title="Delete"><Ico name="trash" size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
