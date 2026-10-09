import { useEffect, useRef, useState } from 'react';
import { useEditor } from './useEditor.js';
import Sidebar from './components/StudioSidebar.jsx';
import PropsBar from './components/StudioPropsBar.jsx';
import Ico from './components/Ico.jsx';
import { PRESETS } from './presets.js';
import { loadFonts } from './fonts.js';
import { TEMPLATES, createEmptyTemplateFromCanvas } from './brochureTemplates.js';
import { makeImageTextEditable } from './ocrEditable.js';
import { listDesigns, getDesign, saveDesign, deleteDesign } from './api.js';
import ImageCropModal from './components/ImageCropModal.jsx';

const download = (href, name) => {
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.click();
};
const fileName = (n) => (n || 'design').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'design';

export default function StudioApp() {
  const ed = useEditor();
  const wsRef = useRef(null);
  const fileInputRef = useRef(null);
  const [design, setDesign] = useState({ id: null, templateId: 'trifold', name: 'Oneomics Trifold Brochure', width: 1123, height: 794, folds: 3 });
  const [pages, setPages] = useState([null, null]);
  const [pageIdx, setPageIdx] = useState(0);
  const [zoom, setZoomState] = useState(1);
  const [panMode, setPanMode] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, scrollLeft: 0, scrollTop: 0 });
  const [showFolds, setShowFolds] = useState(true);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [menu, setMenu] = useState(false);
  const [saved, setSaved] = useState(false);

  const notify = (m) => {
    setToast(m);
    clearTimeout(notify.t);
    notify.t = setTimeout(() => setToast(''), 4000);
  };

  // Keyboard navigation: Spacebar hold for temporary drag/pan, 'H' for Hand tool toggle, 'V' to return
  useEffect(() => {
    const isEditingText = () => {
      const activeEl = document.activeElement;
      if (!activeEl) return false;
      const tag = activeEl.tagName.toLowerCase();
      return tag === 'input' || tag === 'textarea' || activeEl.isContentEditable;
    };

    const handleKeyDown = (e) => {
      if (isEditingText()) return;
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setSpacePressed(true);
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setPanMode((p) => !p);
      } else if (e.key === 'v' || e.key === 'V' || e.key === 'Escape') {
        setPanMode(false);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startPanning = (clientX, clientY) => {
    if (!wsRef.current) return;
    setIsPanning(true);
    panStartRef.current = {
      x: clientX,
      y: clientY,
      scrollLeft: wsRef.current.scrollLeft,
      scrollTop: wsRef.current.scrollTop,
    };
  };

  useEffect(() => {
    if (!isPanning) return;
    const handleMouseMove = (e) => {
      if (!wsRef.current) return;
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      wsRef.current.scrollLeft = panStartRef.current.scrollLeft - dx;
      wsRef.current.scrollTop = panStartRef.current.scrollTop - dy;
    };
    const handleMouseUp = () => {
      setIsPanning(false);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  // On mount: set canvas size, apply the Trifold template (Page 1 Front & Page 2 Back), and set default 100% zoom
  useEffect(() => {
    let mounted = true;
    const init = async () => {
      ed.setSize(1123, 794, 3);
      ed.setZoom(1);
      setZoomState(1);
      const trifoldTemplate = TEMPLATES.find((t) => t.id === 'trifold');
      if (trifoldTemplate) {
        setDesign((d) => ({
          ...d,
          name: trifoldTemplate.name,
          width: trifoldTemplate.w,
          height: trifoldTemplate.h,
          folds: trifoldTemplate.folds || 3,
        }));
        const pgs = await ed.applyTemplate(trifoldTemplate);
        if (mounted && Array.isArray(pgs) && pgs.length) {
          setPages(pgs);
          setPageIdx(0);
        }
      }
      if (mounted) {
        ed.setZoom(1);
        setZoomState(1);
      }
    };

    init();
    loadFonts().then(() => { if (mounted) ed.render(); }).catch(() => {});

    return () => { mounted = false; };
  }, []); // eslint-disable-line

  const fit = (w = design.width, h = design.height, forceFit = false) => {
    if (!forceFit) {
      ed.setZoom(1);
      setZoomState(1);
      return;
    }
    const el = wsRef.current;
    if (!el) return;
    const z = Math.min((el.clientWidth - 72) / w, (el.clientHeight - 72) / h, 1);
    const zz = Math.max(0.1, Math.round(z * 100) / 100);
    ed.setZoom(zz);
    setZoomState(zz);
  };

  const zoomBy = (d) => {
    const z = Math.min(3, Math.max(0.1, Math.round((zoom + d) * 100) / 100));
    ed.setZoom(z);
    setZoomState(z);
  };

  useEffect(() => {
    setSaved(false);
  }, [ed.canUndo, ed.canRedo]);

  const currentPages = () => pages.map((p, i) => (i === pageIdx ? ed.getJSON() : p));

  const startDesign = async (p) => {
    setDesign({ id: null, name: 'Untitled design', width: p.w, height: p.h, folds: p.folds || 0 });
    setPages([null]);
    setPageIdx(0);
    ed.setSize(p.w, p.h);
    await ed.clear('#ffffff');
    ed.setZoom(1);
    setZoomState(1);
    setModal(null);
    setSaved(false);
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
          setPages(pgs || [null]);
          setPageIdx(0);
          ed.setZoom(1);
          setZoomState(1);
          setModal(null);
          setSaved(true);
          return;
        }
      }
      const safePages = Array.isArray(d.pages) && d.pages.length ? d.pages : [null];
      setPages(safePages);
      setPageIdx(0);
      ed.setSize(d.width, d.height, d.folds || 0);
      if (safePages[0]) {
        await ed.loadPage(safePages[0]);
      }
      ed.setZoom(1);
      setZoomState(1);
      setModal(null);
      setSaved(true);
    } catch (e) {
      notify(e.message);
    }
  };

  const matchTemplate = (filename) => {
    const n = filename.toLowerCase();
    if (/onam|festival|kerala|boat/.test(n)) {
      return TEMPLATES.find((t) => t.id === 'onam');
    }
    if (/insight|sample.to.insight/.test(n)) {
      return TEMPLATES.find((t) => t.id === 'trifold-insight');
    }
    if (/trifold|brochure|oneomics|precision|tri.fold/.test(n)) {
      return TEMPLATES.find((t) => t.id === 'trifold');
    }
    if (/poster|event|fair/.test(n)) {
      return TEMPLATES.find((t) => t.id === 'poster');
    }
    if (/quote|post/.test(n)) {
      return TEMPLATES.find((t) => t.id === 'quote');
    }
    return null;
  };

  const processFile = (file) => {
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
            ed.setZoom(1);
            setZoomState(1);
            setModal(null);
            setSaved(true);
            notify(`Opened ${file.name}`);
          } else if (parsed.objects || parsed.version) {
            const w = parsed.width || design.width;
            const h = parsed.height || design.height;
            setDesign((d) => ({ ...d, name: file.name.replace(/\.json$/i, ''), width: w, height: h }));
            setPages([parsed]);
            setPageIdx(0);
            ed.setSize(w, h);
            await ed.loadPage(parsed);
            ed.setZoom(1);
            setZoomState(1);
            setModal(null);
            setSaved(true);
            notify(`Opened ${file.name}`);
          }
        } catch (err) {
          notify(`Failed to read file: ${err.message}`);
        }
      };
      reader.readAsText(file);
      return;
    }

    if (file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name)) {
      reader.onload = async (evt) => {
        try {
          const dataUrl = evt.target.result;
          const img = new Image();
          img.onload = async () => {
            const w = img.naturalWidth || 1123;
            const h = img.naturalHeight || 794;
            const name = file.name.replace(/\.[^/.]+$/, '');

            const matched = matchTemplate(file.name);

            if (matched) {
              setDesign({ id: null, name, width: matched.w, height: matched.h, folds: matched.folds || 0 });
              setPages([null]);
              setPageIdx(0);
              await ed.applyTemplate(matched);
              ed.setZoom(1);
              setZoomState(1);
              setModal(null);
              setSaved(false);
              notify(`✅ Loaded as editable design — double-click text to edit, click images to replace!`);
            } else {
              setDesign({ id: null, name, width: w, height: h, folds: 0 });
              setPages([null]);
              setPageIdx(0);
              ed.setSize(w, h);
              await ed.clear('#ffffff');
              const bgImg = await ed.addTemplateImage(dataUrl, w, h);
              ed.setZoom(1);
              setZoomState(1);
              setModal(null);
              setSaved(false);

              const c = ed._canvas ? ed._canvas() : null;
              if (c && bgImg) {
                notify('🔍 Scanning text in image to make it editable…');
                try {
                  await makeImageTextEditable(c, bgImg, (status) => notify(status));
                  if (ed._snapshot) ed._snapshot();
                } catch {
                  notify('Image imported! Click "✏️ Make text editable" in top bar to extract text');
                }
              }
            }
          };
          img.src = dataUrl;
        } catch (err) {
          notify(`Failed to open image: ${err.message}`);
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    notify('Please select a .json design file or an image');
  };

  const openLocalFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = '';
  };

  const triggerOpenFile = async () => {
    if (window.showOpenFilePicker) {
      try {
        const [fh] = await window.showOpenFilePicker({
          startIn: 'downloads',
          types: [
            {
              description: 'Design or Image',
              accept: {
                'application/json': ['.json'],
                'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'],
              },
            },
          ],
          multiple: false,
        });
        const file = await fh.getFile();
        processFile(file);
      } catch (err) {
        if (err.name !== 'AbortError') notify(`Could not open file: ${err.message}`);
      }
    } else {
      fileInputRef.current?.click();
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      const all = currentPages();
      const thumbnail = ed.render(Math.min(1, 240 / design.width), 'jpeg');
      const res = await saveDesign({ ...design, pages: all, thumbnail });
      setDesign((d) => ({ ...d, id: res.id }));
      setPages(all);
      setSaved(true);
      window.dispatchEvent(new CustomEvent('design-saved'));
      notify('Design saved to gallery');
    } catch (e) {
      notify(`Could not save: ${e.message}`);
    }
    setBusy(false);
  };

  const applyTemplate = async (t) => {
    if (!window.confirm(`Switch to "${t.name}"?\nYour current design and edits will be replaced.`)) {
      return;
    }
    setDesign((d) => ({ ...d, id: null, templateId: t.id, name: t.name || d.name, width: t.w, height: t.h, folds: t.folds || 0 }));
    ed.setSize(t.w, t.h, t.folds || 0);
    const pgs = await ed.applyTemplate(t);
    if (Array.isArray(pgs) && pgs.length) {
      setPages(pgs);
      setPageIdx(0);
    }
    ed.setZoom(1);
    setZoomState(1);
    setSaved(false);
  };

  const switchPage = async (i) => {
    if (i === pageIdx) return;
    const next = currentPages();
    if (!next[i]) {
      const curTemplate = TEMPLATES.find((t) => t.id === (design.templateId || design.id) || t.name === design.name);
      if (curTemplate) {
        const targetPageNum = i + 1;
        if (curTemplate.pages?.[i]) {
          next[i] = await ed.buildPageFromSpecs(curTemplate.pages[i], curTemplate.bg || '#ffffff');
        } else if (curTemplate.emptySpecs) {
          next[i] = await ed.buildPageFromSpecs(() => curTemplate.emptySpecs(targetPageNum), curTemplate.bg || '#ffffff');
        } else if (next[0]) {
          next[i] = createEmptyTemplateFromCanvas(next[0], design.width, design.height, targetPageNum);
        }
      }
    }
    setPages(next);
    setPageIdx(i);
    await ed.loadPage(next[i]);
  };

  const shufflePagesOrPanels = async (mode = 'rotate') => {
    if (design.folds > 1) {
      ed.shufflePanels(mode, design.folds);
      return;
    }

    const next = currentPages();
    if (next.length < 2) {
      notify('Add a page first in the bottom to swap pages');
      return;
    }

    // Swap Page 1 and Page 2
    const temp = next[0];
    next[0] = next[1];
    next[1] = temp;

    setPages(next);
    await ed.loadPage(next[pageIdx]);
    notify('🔀 Swapped Page 1 and Page 2');
  };
  const addPage = async (duplicate = false) => {
    const next = currentPages();
    let ins = null;

    if (duplicate) {
      const curTemplate = TEMPLATES.find((t) => t.id === (design.templateId || design.id) || t.name === design.name);
      const targetPageNum = next.length + 1;

      if (curTemplate?.emptySpecs) {
        ins = await ed.buildPageFromSpecs(() => curTemplate.emptySpecs(targetPageNum), curTemplate.bg || '#ffffff');
      } else if (curTemplate?.pages?.[pageIdx + 1]) {
        ins = await ed.buildPageFromSpecs(curTemplate.pages[pageIdx + 1], curTemplate.bg || '#ffffff');
      } else if (curTemplate?.pages?.[1] && pageIdx === 0) {
        ins = await ed.buildPageFromSpecs(curTemplate.pages[1], curTemplate.bg || '#ffffff');
      } else if (next[pageIdx]) {
        ins = createEmptyTemplateFromCanvas(next[pageIdx], design.width, design.height, targetPageNum);
      }
      notify(`📄 Added empty template page (Page ${targetPageNum})`);
    }

    next.splice(pageIdx + 1, 0, ins);
    setPages(next);
    setPageIdx(pageIdx + 1);
    await ed.loadPage(ins);
  };
  const deletePage = async () => {
    if (pages.length === 1) return;
    const next = currentPages();
    next.splice(pageIdx, 1);
    const i = Math.min(pageIdx, next.length - 1);
    setPages(next);
    setPageIdx(i);
    await ed.loadPage(next[i]);
  };

  const exportPNG = () => {
    setMenu(false);
    download(ed.render(2), `${fileName(design.name)}-page-${pageIdx + 1}.png`);
  };
  const exportPDF = async () => {
    setMenu(false);
    setBusy(true);
    try {
      const all = currentPages();
      const urls = await ed.renderPages(all, 2);
      const { jsPDF } = await import('jspdf');
      const { width: w, height: h } = design;
      const pdf = new jsPDF({
        orientation: w >= h ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w, h],
        hotfixes: ['px_scaling'],
      });
      urls.forEach((u, i) => {
        if (i) pdf.addPage([w, h], w >= h ? 'landscape' : 'portrait');
        pdf.addImage(u, 'PNG', 0, 0, w, h);
      });
      pdf.save(`${fileName(design.name)}.pdf`);
      await ed.loadPage(all[pageIdx]);
    } catch (e) {
      notify(`Export failed: ${e.message}`);
    }
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
        <button className="btn" onClick={() => setModal('new')}>
          <Ico name="plus" /> New
        </button>
        <button className="btn" onClick={triggerOpenFile} title="Open file from computer">
          <Ico name="folder" /> Open
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,image/*,application/json"
          style={{ display: 'none' }}
          onChange={openLocalFile}
        />
        <input
          className="name"
          value={design.name}
          aria-label="Design name"
          onChange={(e) => setDesign({ ...design, name: e.target.value })}
        />
        <div className="grow" />
        <button className="icon" onClick={ed.undo} disabled={!ed.canUndo} title="Undo (Ctrl+Z)" aria-label="Undo">
          <Ico name="undo" />
        </button>
        <button className="icon" onClick={ed.redo} disabled={!ed.canRedo} title="Redo (Ctrl+Y)" aria-label="Redo">
          <Ico name="redo" />
        </button>
        <button className="btn" onClick={save} disabled={busy}>
          <Ico name="save" /> {saved ? 'Saved' : 'Save'}
        </button>
        <div className="menu-wrap">
          <button className="btn primary" onClick={() => setMenu(!menu)} disabled={busy} aria-expanded={menu}>
            <Ico name="download" /> Download
          </button>
          {menu && (
            <div className="menu" role="menu">
              <button role="menuitem" onClick={exportPNG}>
                PNG image (this page)
              </button>
              <button role="menuitem" onClick={exportPDF}>
                PDF (all pages)
              </button>
              <button role="menuitem" onClick={exportJSON}>
                Design file (.json)
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  setMenu(false);
                  window.open('/brochure-insight.html', '_blank');
                }}
              >
                Clean HTML Print View
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="body">
        <Sidebar
          ed={ed}
          onTemplate={applyTemplate}
          notify={notify}
          onOpenDesign={openDesign}
          onOpenFile={triggerOpenFile}
          currentTemplateId={design.templateId || design.id}
        />
        <main className="stage">
          <PropsBar ed={ed} bg={ed.getBackground()} folds={design.folds} pagesCount={pages.length} onShuffle={shufflePagesOrPanels} />
          <div
            className={`ws ${panMode || spacePressed ? 'pan-mode' : ''} ${isPanning ? 'panning' : ''}`}
            ref={wsRef}
            onMouseDown={(e) => {
              setMenu(false);
              if (panMode || spacePressed) {
                e.preventDefault();
                startPanning(e.clientX, e.clientY);
              }
            }}
          >
            <div className="page" style={{ width: design.width * zoom, height: design.height * zoom }}>
              <canvas ref={ed.elRef} />
              {showFolds && design.folds > 1 && (
                <div className="folds" aria-hidden="true">
                  {Array.from({ length: design.folds - 1 }, (_, i) => (
                    <i key={i} style={{ left: `${((i + 1) / design.folds) * 100}%` }} />
                  ))}
                </div>
              )}
              {(panMode || spacePressed) && (
                <div
                  className={`pan-overlay ${isPanning ? 'active' : ''}`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    startPanning(e.clientX, e.clientY);
                  }}
                />
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
              <button className="chip add" onClick={() => addPage(false)}>
                <Ico name="plus" size={14} /> Add page
              </button>
              <button className="chip add" onClick={() => addPage(true)}>
                <Ico name="copy" size={14} /> Duplicate
              </button>
              <button className="chip add" onClick={deletePage} disabled={pages.length === 1}>
                <Ico name="trash" size={14} /> Delete
              </button>
            </div>
            <div className="grow" />
            {design.folds > 1 && (
              <label className="check">
                <input type="checkbox" checked={showFolds} onChange={(e) => setShowFolds(e.target.checked)} /> Fold lines
              </label>
            )}
            {(design.folds > 1 || pages.length > 1) && (
              <button
                className="btn small"
                style={{
                  marginLeft: 6,
                  marginRight: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: '#f0fdf4',
                  color: '#006837',
                  border: '1px solid #86efac',
                  fontWeight: 600,
                  borderRadius: 6,
                  padding: '4px 9px',
                  cursor: 'pointer',
                }}
                onClick={() => shufflePagesOrPanels('rotate')}
                title={design.folds > 1 ? "Shuffle panels" : "Swap between Page 1 and Page 2"}
              >
                🔀 {design.folds > 1 ? 'Shuffle' : 'Swap Pages'}
              </button>
            )}
            <button
              className={`icon pan-btn ${panMode || spacePressed ? 'active' : ''}`}
              onClick={() => setPanMode((p) => !p)}
              title={panMode ? "Hand tool (Active) - Click or press V to switch back to Select tool" : "Hand tool - Click to drag canvas freely when zoomed in (or hold Spacebar)"}
              aria-label="Hand tool"
            >
              <Ico name="hand" size={17} />
            </button>
            <button className="icon" onClick={() => zoomBy(-0.1)} aria-label="Zoom out">
              <Ico name="minus" />
            </button>
            <span
              className="zoom"
              style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => { ed.setZoom(1); setZoomState(1); }}
              title="Click to reset to 100%"
            >
              {Math.round(zoom * 100)}%
            </span>
            <button className="icon" onClick={() => zoomBy(0.1)} aria-label="Zoom in">
              <Ico name="plus" />
            </button>
            <button className="btn small" onClick={() => fit(design.width, design.height, true)} title="Fit brochure to screen">
              Fit
            </button>
          </footer>
        </main>
      </div>

      {modal === 'new' && <NewModal onPick={startDesign} onClose={() => setModal(null)} />}
      {modal === 'open' && (
        <OpenModal
          onPick={openDesign}
          onOpenFile={() => fileInputRef.current?.click()}
          onClose={() => setModal(null)}
          notify={notify}
        />
      )}
      {ed.cropTarget && (
        <ImageCropModal
          target={ed.cropTarget}
          onApply={(croppedUrl, meta) => {
            ed.applyCrop(croppedUrl, meta);
            notify('✅ Image cropped successfully!');
          }}
          onClose={ed.closeCrop}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}

function NewModal({ onPick, onClose }) {
  const [w, setW] = useState(1123);
  const [h, setH] = useState(794);
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="New design">
        <h2>Start a new design</h2>
        <div className="presets">
          {PRESETS.map((p) => (
            <button key={p.id} className="preset" onClick={() => onPick(p)}>
              <span className="preset-art" style={{ aspectRatio: `${p.w}/${p.h}` }} />
              <b>{p.name}</b>
              <small>{p.note}</small>
            </button>
          ))}
        </div>
        <div className="custom">
          <b>Custom size (px)</b>
          <input
            type="number"
            value={w}
            min={100}
            max={5000}
            onChange={(e) => setW(+e.target.value)}
            aria-label="Width"
          />
          <span>by</span>
          <input
            type="number"
            value={h}
            min={100}
            max={5000}
            onChange={(e) => setH(+e.target.value)}
            aria-label="Height"
          />
          <button className="btn primary" onClick={() => onPick({ w: Math.max(100, w), h: Math.max(100, h), folds: 0 })}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

function OpenModal({ onPick, onOpenFile, onClose, notify }) {
  const [rows, setRows] = useState(null);
  const load = () =>
    listDesigns()
      .then(setRows)
      .catch((e) => {
        setRows([]);
        notify(`Could not load designs: ${e.message}`);
      });
  useEffect(() => {
    load();
  }, []); // eslint-disable-line
  const remove = async (id) => {
    if (!window.confirm('Delete this design? This cannot be undone.')) return;
    await deleteDesign(id);
    load();
  };
  return (
    <div className="scrim" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label="Open design">
        <h2>Your designs</h2>
        <div style={{ marginBottom: 16 }}>
          <button
            className="btn primary"
            style={{ width: '100%', justifyContent: 'center', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}
            onClick={() => {
              onClose();
              onOpenFile();
            }}
          >
            <Ico name="folder" /> Open file from computer (.json, image)
          </button>
        </div>
        {rows === null && <p className="hint">Loading...</p>}
        {rows && rows.length === 0 && (
          <p className="hint">No designs saved on the server yet. You can open any file from your computer above.</p>
        )}
        <div className="presets">
          {rows &&
            rows.map((d) => (
              <div key={d.id} className="preset saved">
                <button onClick={() => onPick(d.id)} className="saved-open">
                  {d.thumbnail ? (
                    <img src={d.thumbnail} alt="" />
                  ) : (
                    <span className="preset-art" style={{ aspectRatio: `${d.width}/${d.height}` }} />
                  )}
                  <b>{d.name}</b>
                  <small>
                    {d.pageCount} page{d.pageCount > 1 ? 's' : ''}, edited {new Date(d.updatedAt).toLocaleDateString()}
                  </small>
                </button>
                <button className="icon del" onClick={() => remove(d.id)} aria-label={`Delete ${d.name}`}>
                  <Ico name="trash" size={16} />
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
