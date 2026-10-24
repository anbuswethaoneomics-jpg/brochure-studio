import { useEffect, useRef, useState } from 'react';
import Ico from './Ico.jsx';
import { DECOR } from '../icons.js';
import { iconSvg } from '../icons.js';
import { TEMPLATES } from '../templates.js';
import { listUploads, uploadImage, listDesigns, deleteDesign, deleteUpload } from '../api.js';
import { mergeDesignsToPDF } from '../mergePdfUtils.js';

const TABS = [
  { id: 'templates', label: 'Templates', icon: 'layout' },
  { id: 'text', label: 'Text', icon: 'type' },
  { id: 'elements', label: 'Elements', icon: 'shapes' },
  { id: 'uploads', label: 'Images', icon: 'image' },
  { id: 'gallery', label: 'Gallery', icon: 'gallery' },
];

const TEXT_STYLES = [
  { label: 'Add a heading', size: 56, bold: true, font: 'Montserrat' },
  { label: 'Add a subheading', size: 32, font: 'Poppins' },
  { label: 'Add body text', size: 18, font: 'Open Sans' },
  { label: 'Poster title', size: 96, font: 'Anton', sp: 20 },
  { label: 'Elegant title', size: 48, font: 'Playfair Display', italic: true },
  { label: 'Handwritten note', size: 40, font: 'Caveat' },
];

const SHAPES = [
  ['rect', 'Rectangle'], ['rounded', 'Rounded'], ['circle', 'Circle'], ['triangle', 'Triangle'], ['line', 'Line'],
];

export default function StudioSidebar({ ed, onTemplate, notify, onOpenDesign, onOpenFile }) {
  const [tab, setTab] = useState('templates');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const input = useRef(null);

  // Gallery state
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [mergingPdf, setMergingPdf] = useState(false);
  const [mergeStatus, setMergeStatus] = useState(null);

  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [dragOverPos, setDragOverPos] = useState('before'); // 'before' | 'after'
  const dragOccurredRef = useRef(false);

  const toggleSelect = (id, e) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCardDragStart = (id, e) => {
    dragOccurredRef.current = true;
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleCardDragOver = (id, e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedId && draggedId !== id) {
      const rect = e.currentTarget.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const pos = e.clientY < midY ? 'before' : 'after';
      if (dragOverId !== id || dragOverPos !== pos) {
        setDragOverId(id);
        setDragOverPos(pos);
      }
    }
  };

  const handleCardDragLeave = (id, e) => {
    if (dragOverId === id) {
      const rect = e.currentTarget.getBoundingClientRect();
      if (
        e.clientY < rect.top ||
        e.clientY >= rect.bottom ||
        e.clientX < rect.left ||
        e.clientX >= rect.right
      ) {
        setDragOverId(null);
      }
    }
  };

  const handleCardDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
    setTimeout(() => {
      dragOccurredRef.current = false;
    }, 150);
  };

  const handleCardDrop = (targetId, e) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('text/plain') || draggedId;
    setDraggedId(null);
    setDragOverId(null);
    setTimeout(() => {
      dragOccurredRef.current = false;
    }, 150);

    if (!sourceId || sourceId === targetId) return;

    setDesigns((prevDesigns) => {
      const fromIdx = prevDesigns.findIndex((d) => d.id === sourceId);
      const toIdx = prevDesigns.findIndex((d) => d.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prevDesigns;
      const next = [...prevDesigns];
      const [moved] = next.splice(fromIdx, 1);
      const insertIdx = dragOverPos === 'after'
        ? (fromIdx < toIdx ? toIdx : toIdx + 1)
        : (fromIdx < toIdx ? toIdx - 1 : toIdx);
      next.splice(Math.max(0, Math.min(next.length, insertIdx)), 0, moved);

      // Keep selectedIds in sync with the new order in designs!
      setSelectedIds((prevSelected) => {
        const selectedSet = new Set(prevSelected);
        return next.filter((d) => selectedSet.has(d.id)).map((d) => d.id);
      });

      return next;
    });
  };

  const handleCardClick = (id, e) => {
    if (dragOccurredRef.current) {
      e.stopPropagation();
      return;
    }
    if (selectMode) {
      toggleSelect(id, e);
    } else if (onOpenDesign) {
      onOpenDesign(id);
    }
  };

  const handleMergePDF = async () => {
    if (selectedIds.length === 0) {
      notify('Please select at least one design to merge.');
      return;
    }
    setMergingPdf(true);
    setMergeStatus('Starting PDF compilation...');
    try {
      const selectedDesignsList = selectedIds
        .map((id) => designs.find((d) => d.id === id))
        .filter(Boolean);

      const result = await mergeDesignsToPDF(selectedDesignsList, (prog) => {
        setMergeStatus(prog.status);
      });

      notify(`✅ Merged ${result.pageCount} page(s) into ${result.filename}!`);
      setSelectMode(false);
      setSelectedIds([]);
    } catch (err) {
      notify(`Merge PDF failed: ${err.message}`);
    } finally {
      setMergingPdf(false);
      setMergeStatus(null);
    }
  };

  const refreshUploads = () => listUploads().then(setFiles).catch((err) => console.warn('refreshUploads error:', err));
  useEffect(() => { if (tab === 'uploads') refreshUploads(); }, [tab]);

  const handleDeleteUpload = async (fileItem, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${fileItem.name || 'this image'}"?`)) return;
    try {
      setFiles((prev) => prev.filter((p) => (p.id || p.url) !== (fileItem.id || fileItem.url)));
      await deleteUpload(fileItem);
      notify('Image deleted');
      refreshUploads();
    } catch (err) {
      notify(`Could not delete image: ${err.message}`);
    }
  };

  const refreshDesigns = () => {
    setLoadingDesigns(true);
    listDesigns()
      .then((data) => {
        setDesigns(data || []);
        setSelectedIds((prev) => prev.filter((id) => (data || []).some((d) => d.id === id)));
      })
      .catch((err) => notify(`Could not load saved gallery: ${err.message}`))
      .finally(() => setLoadingDesigns(false));
  };

  useEffect(() => {
    if (tab === 'gallery') refreshDesigns();
  }, [tab]);

  // Auto-refresh gallery whenever a design is saved in the app
  useEffect(() => {
    const handleSaved = () => refreshDesigns();
    window.addEventListener('design-saved', handleSaved);
    return () => window.removeEventListener('design-saved', handleSaved);
  }, []);

  const handleDeleteDesign = async (id, name, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${name || 'this design'}" from your saved gallery?`)) return;
    try {
      await deleteDesign(id);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      notify('Design deleted');
      refreshDesigns();
    } catch (e) {
      notify(`Could not delete: ${e.message}`);
    }
  };

  const onFiles = async (list) => {
    setLoading(true);
    try {
      const addedItems = [];
      for (const f of Array.from(list)) {
        const item = await uploadImage(f);
        addedItems.push(item);
        await ed.addImage(item.dataUrl || item.url);
      }
      setFiles((prev) => {
        const existingKeys = new Set(prev.map((p) => p.id || p.url));
        const newOnes = addedItems.filter((i) => !existingKeys.has(i.id || i.url));
        return [...newOnes, ...prev];
      });
      refreshUploads();
    } catch (e) { notify(e.message); }
    setLoading(false);
    if (input.current) input.current.value = '';
  };

  return (
    <aside className="side">
      <nav className="rail" aria-label="Tools">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            <Ico name={t.icon} size={20} /><span>{t.label}</span>
          </button>
        ))}
      </nav>
      <div className="panel">
        {tab === 'templates' && (
          <>
            <h3>Templates</h3>
            <div className="tpl-list">
              {TEMPLATES.map((t) => (
                <button key={t.id} className="tpl" onClick={() => onTemplate(t)}>
                  <span className="tpl-art" style={{ aspectRatio: `${t.w}/${t.h}` }}>
                    {t.swatch.map((c, i) => <i key={i} style={{ background: c }} />)}
                  </span>
                  <span>{t.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'text' && (
          <>
            <h3>Text</h3>
            <div className="stack">
              {TEXT_STYLES.map((s) => (
                <button key={s.label} className="text-tile" style={{ fontFamily: `"${s.font}"`, fontWeight: s.bold ? 700 : 400, fontStyle: s.italic ? 'italic' : 'normal', fontSize: Math.min(s.size, 34) }} onClick={() => ed.addText(s)}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="hint">Double-click any text on the page to edit it. Drag the corners to resize it.</p>
          </>
        )}

        {tab === 'elements' && (
          <>
            <h3>Shapes</h3>
            <div className="grid3">
              {SHAPES.map(([id, label]) => (
                <button key={id} className="tile" onClick={() => ed.addShape(id)} title={label} aria-label={label}>
                  <ShapePreview kind={id} />
                </button>
              ))}
            </div>
            <h3>Icons</h3>
            <div className="grid4">
              {Object.keys(DECOR).map((name) => (
                <button key={name} className="tile" onClick={() => ed.addIcon(name)} title={name} aria-label={name}
                  dangerouslySetInnerHTML={{ __html: iconSvg(name, '#0b5d4b').replace('width="24" height="24"', 'width="28" height="28"') }} />
              ))}
            </div>
          </>
        )}

        {tab === 'uploads' && (
          <>
            <h3>Your images</h3>
            <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            <button className="btn primary wide" disabled={loading} onClick={() => input.current.click()}>
              <Ico name="upload" /> {loading ? 'Uploading...' : 'Upload images'}
            </button>
            {files.length === 0 && <p className="hint">Uploaded images appear here. PNG, JPG, WEBP or GIF up to 15 MB.</p>}
            <div className="grid2">
              {files.map((f) => (
                <div key={f.id || f.url} className="upload-card">
                  <button
                    type="button"
                    className="upload-thumb-btn"
                    onClick={() => ed.addImage(f.dataUrl || f.url)}
                    title={`Add "${f.name || 'image'}" to canvas`}
                  >
                    <img src={f.dataUrl || f.url} alt={f.name || ''} loading="lazy" />
                  </button>
                  <button
                    type="button"
                    className="upload-del-btn"
                    onClick={(e) => handleDeleteUpload(f, e)}
                    title={`Delete "${f.name || 'image'}"`}
                    aria-label={`Delete "${f.name || 'image'}"`}
                  >
                    <Ico name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'gallery' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Saved Gallery</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {designs.length > 0 && (
                  <button
                    className={`btn small ${selectMode ? 'primary' : ''}`}
                    onClick={() => {
                      setSelectMode(!selectMode);
                      if (selectMode) setSelectedIds([]);
                    }}
                    title={selectMode ? 'Exit selection mode' : 'Choose saved designs to merge into a single PDF'}
                    style={{ padding: '4px 8px', fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Ico name="copy" size={13} /> {selectMode ? 'Cancel' : 'Merge to PDF'}
                  </button>
                )}
                <button
                  className="icon"
                  title="Refresh gallery"
                  onClick={refreshDesigns}
                  style={{ width: 28, height: 28, border: '1px solid var(--line)', borderRadius: 6, display: 'grid', placeItems: 'center' }}
                >
                  <Ico name="redo" size={14} />
                </button>
              </div>
            </div>

            {selectMode && (
              <div className="gallery-merge-toolbar">
                <div className="gallery-merge-header">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={designs.length > 0 && selectedIds.length === designs.length}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedIds(designs.map((d) => d.id));
                        else setSelectedIds([]);
                      }}
                      style={{ cursor: 'pointer', accentColor: 'var(--accent, #0b5d4b)' }}
                    />
                    <span>Select All ({designs.length})</span>
                  </label>
                  <span style={{ color: 'var(--mute)', fontSize: 11.5, fontWeight: 500 }}>
                    {selectedIds.length} selected
                  </span>
                </div>

                {selectedIds.length > 1 && (
                  <div className="gallery-drag-hint">
                    <span>⠿</span> Drag cards to reorder (1st, 2nd, etc.)
                  </div>
                )}

                {mergingPdf ? (
                  <div className="gallery-merge-progress">
                    <Ico name="clock" size={14} />
                    <span>{mergeStatus || 'Compiling multi-page PDF...'}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn primary wide"
                    disabled={selectedIds.length === 0}
                    onClick={handleMergePDF}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      fontSize: 12.5,
                      fontWeight: 600,
                    }}
                  >
                    <Ico name="download" size={14} /> Merge & Save as PDF ({selectedIds.length})
                  </button>
                )}
              </div>
            )}

            {!selectMode && onOpenFile && (
              <button
                className="btn wide"
                style={{ marginBottom: 14, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                onClick={onOpenFile}
              >
                <Ico name="folder" size={16} /> Open from computer
              </button>
            )}

            {loadingDesigns && <p className="hint">Loading saved posters & brochures…</p>}

            {!loadingDesigns && designs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--mute)' }}>
                <p style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 600 }}>No saved designs yet</p>
                <p style={{ fontSize: 12, margin: 0, lineHeight: 1.4 }}>
                  Click the <b>💾 Save</b> button in the top bar to save your poster or brochure here.
                </p>
              </div>
            )}

            <div className="gallery-list">
              {designs.map((d) => {
                const isSelected = selectedIds.includes(d.id);
                const selIndex = isSelected ? selectedIds.indexOf(d.id) + 1 : 0;

                return (
                  <div
                    key={d.id}
                    className={`gallery-card ${isSelected ? 'selected-for-merge' : ''} ${draggedId === d.id ? 'is-dragging' : ''} ${dragOverId === d.id ? `drag-over-${dragOverPos}` : ''}`}
                    style={selectMode ? { cursor: 'grab' } : {}}
                    onClick={(e) => handleCardClick(d.id, e)}
                    draggable={selectMode}
                    onDragStart={selectMode ? (e) => handleCardDragStart(d.id, e) : undefined}
                    onDragEnd={selectMode ? handleCardDragEnd : undefined}
                    onDragOver={selectMode ? (e) => handleCardDragOver(d.id, e) : undefined}
                    onDragLeave={selectMode ? (e) => handleCardDragLeave(d.id, e) : undefined}
                    onDrop={selectMode ? (e) => handleCardDrop(d.id, e) : undefined}
                  >
                    {selectMode && (
                      <div
                        className={`gallery-select-badge ${isSelected ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(d.id, e);
                        }}
                        title={isSelected ? `Page #${selIndex} (drag to reorder, click to deselect)` : 'Click to select for merged PDF'}
                      >
                        {isSelected ? <span>{selIndex}</span> : null}
                      </div>
                    )}

                    <div
                      className="gallery-card-btn"
                      title={selectMode ? (isSelected ? `Page #${selIndex} (drag to reorder)` : 'Click to select') : `Open "${d.name}"`}
                    >
                      <div className="gallery-thumb-wrap">
                        {d.thumbnail ? (
                          <img src={d.thumbnail} alt={d.name} loading="lazy" draggable={false} />
                        ) : (
                          <div
                            style={{
                              aspectRatio: `${d.width || 800}/${d.height || 600}`,
                              width: '80%',
                              maxHeight: 110,
                              background: 'var(--mint)',
                              border: '1px dashed var(--accent-2)',
                              borderRadius: 4,
                            }}
                          />
                        )}
                      </div>
                      <div className="gallery-info">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                          <span className="gallery-title">{d.name || 'Untitled design'}</span>
                          {selectMode && isSelected && (
                            <span className="gallery-drag-grip" title="Drag to reorder">⠿</span>
                          )}
                        </div>
                        <div className="gallery-meta">
                          <span>{d.width}×{d.height}px</span>
                          <span>•</span>
                          <span>{d.pageCount || 1} pg</span>
                          <span>•</span>
                          <span>{new Date(d.updatedAt || d.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {!selectMode && (
                      <button
                        className="gallery-del-btn"
                        onClick={(e) => handleDeleteDesign(d.id, d.name, e)}
                        title={`Delete ${d.name}`}
                        aria-label={`Delete ${d.name}`}
                      >
                        <Ico name="trash" size={13} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function ShapePreview({ kind }) {
  const p = { fill: '#0f8a6d', stroke: '#0b5d4b' };
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      {kind === 'rect' && <rect x="6" y="10" width="32" height="24" fill={p.fill} />}
      {kind === 'rounded' && <rect x="6" y="10" width="32" height="24" rx="8" fill={p.fill} />}
      {kind === 'circle' && <circle cx="22" cy="22" r="15" fill={p.fill} />}
      {kind === 'triangle' && <polygon points="22,8 38,36 6,36" fill={p.fill} />}
      {kind === 'line' && <line x1="6" y1="22" x2="38" y2="22" stroke={p.stroke} strokeWidth="4" strokeLinecap="round" />}
    </svg>
  );
}
