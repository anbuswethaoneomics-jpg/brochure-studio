import { useEffect, useRef, useState } from 'react';
import Ico from './Ico.jsx';
import { DECOR } from '../icons.js';
import { iconSvg } from '../icons.js';
import { TEMPLATES } from '../brochureTemplates.js';
import { listUploads, uploadImage, listDesigns, deleteDesign, deleteUpload } from '../api.js';

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

export default function StudioSidebar({ ed, onTemplate, notify, onOpenDesign, onOpenFile, currentTemplateId }) {
  const [tab, setTab] = useState('templates');
  const [previewTpl, setPreviewTpl] = useState(null);
  const [previewPage, setPreviewPage] = useState(0);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tplFilter, setTplFilter] = useState('all');
  const [tplSearch, setTplSearch] = useState('');
  const input = useRef(null);

  // Gallery state
  const [designs, setDesigns] = useState([]);
  const [loadingDesigns, setLoadingDesigns] = useState(false);

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
      .then((data) => setDesigns(data || []))
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
        {tab === 'templates' && (() => {
          const trifoldList = TEMPLATES.filter((t) => t.category === 'trifold' || t.folds === 3);
          const bifoldList = TEMPLATES.filter((t) => t.category === 'bifold' || t.folds === 2);
          const flyerList = TEMPLATES.filter((t) => t.category === 'a4-flyer' || t.category === 'flyer');
          const posterList = TEMPLATES.filter(
            (t) => !(t.category === 'trifold' || t.folds === 3 || t.category === 'bifold' || t.folds === 2 || t.category === 'a4-flyer' || t.category === 'flyer')
          );

          const filterOptions = [
            { id: 'all', label: 'All', count: TEMPLATES.length },
            { id: 'trifold', label: 'Tri-fold', count: trifoldList.length },
            { id: 'bifold', label: 'Bi-fold', count: bifoldList.length },
            { id: 'flyer', label: 'A4 Flyer', count: flyerList.length },
            { id: 'poster', label: 'Posters', count: posterList.length },
          ];

          const filterBySearch = (list) => {
            if (!tplSearch.trim()) return list;
            const q = tplSearch.toLowerCase();
            return list.filter((t) => (t.name || '').toLowerCase().includes(q) || (t.subtitle || '').toLowerCase().includes(q));
          };

          const filteredTrifold = filterBySearch(trifoldList);
          const filteredBifold = filterBySearch(bifoldList);
          const filteredFlyer = filterBySearch(flyerList);
          const filteredPoster = filterBySearch(posterList);

          const totalVisible =
            (tplFilter === 'all' || tplFilter === 'trifold' ? filteredTrifold.length : 0) +
            (tplFilter === 'all' || tplFilter === 'bifold' ? filteredBifold.length : 0) +
            (tplFilter === 'all' || tplFilter === 'flyer' ? filteredFlyer.length : 0) +
            (tplFilter === 'all' || tplFilter === 'poster' ? filteredPoster.length : 0);

          const renderCard = (t) => (
            <div
              key={t.id}
              className={`tpl-box ${currentTemplateId === t.id ? 'active' : ''}`}
              onClick={() => onTemplate(t)}
              title={`Click to choose "${t.name}"`}
            >
              <div className="tpl-thumb-wrap" style={{ aspectRatio: `${t.w}/${t.h}` }}>
                {t.preview ? (
                  <img src={t.preview} alt={t.name} className="tpl-thumb-img" />
                ) : (
                  <span className="tpl-art" style={{ aspectRatio: `${t.w}/${t.h}` }}>
                    {t.swatch?.map((c, i) => (
                      <i key={i} style={{ background: c }} />
                    ))}
                  </span>
                )}
                {t.folds > 1 && (
                  <div className="tpl-folds-overlay">
                    {Array.from({ length: t.folds }).map((_, i) => (
                      <span key={i} />
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="tpl-quick-preview-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTpl(t);
                  }}
                  title="Enlarge preview"
                >
                  <Ico name="maximize" size={12} />
                </button>
              </div>
              <div className="tpl-info">
                <div className="tpl-title">{t.name}</div>
                {t.subtitle && <div className="tpl-sub">{t.subtitle}</div>}
                <span className="tpl-tag">
                  {t.folds === 3 ? 'Tri-fold' : t.folds === 2 ? 'Bi-fold' : t.category === 'a4-flyer' || t.category === 'flyer' ? 'A4 Flyer' : t.category === 'social' ? 'Social' : 'Poster'}
                </span>
              </div>
            </div>
          );

          return (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <h3 style={{ margin: 0 }}>Templates</h3>
                <span className="tpl-sec-badge">{totalVisible} designs</span>
              </div>

              {/* Filter Buttons */}
              <div
                className="tpl-filter-bar"
                style={{
                  display: 'flex',
                  gap: 5,
                  flexWrap: 'wrap',
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: '1px solid #edf2f7',
                }}
              >
                {filterOptions.map((f) => {
                  const isActive = tplFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setTplFilter(f.id)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '4px 9px',
                        borderRadius: 16,
                        border: isActive ? '1px solid #005b76' : '1px solid #d5e3ef',
                        background: isActive ? '#005b76' : '#ffffff',
                        color: isActive ? '#ffffff' : '#2b3a4f',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{f.label}</span>
                      <span
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          background: isActive ? 'rgba(255,255,255,0.22)' : '#eef4f8',
                          color: isActive ? '#ffffff' : '#005b76',
                          padding: '1px 5px',
                          borderRadius: 8,
                        }}
                      >
                        {f.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search box */}
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  type="text"
                  placeholder="Filter or search templates…"
                  value={tplSearch}
                  onChange={(e) => setTplSearch(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '6px 26px 6px 9px',
                    fontSize: 11.5,
                    border: '1px solid #d5e3ef',
                    borderRadius: 6,
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                />
                {tplSearch && (
                  <button
                    type="button"
                    onClick={() => setTplSearch('')}
                    style={{
                      position: 'absolute',
                      right: 6,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: '#8a94b8',
                      padding: 0,
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {totalVisible === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 10px', color: 'var(--mute)' }}>
                  <p style={{ margin: '0 0 6px 0', fontSize: 13, fontWeight: 600 }}>No matching templates</p>
                  <p style={{ fontSize: 11.5, margin: 0 }}>Try clearing your search or picking another filter.</p>
                  <button
                    className="btn small"
                    style={{ marginTop: 10, fontSize: 11 }}
                    onClick={() => {
                      setTplFilter('all');
                      setTplSearch('');
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <>
                  {/* Tri-fold Brochures */}
                  {(tplFilter === 'all' || tplFilter === 'trifold') && filteredTrifold.length > 0 && (
                    <div className="tpl-section">
                      <div className="tpl-sec-hdr">
                        <h4>Tri-fold Brochures</h4>
                        <span className="tpl-sec-badge">{filteredTrifold.length}</span>
                      </div>
                      <div className="tpl-grid">{filteredTrifold.map(renderCard)}</div>
                    </div>
                  )}

                  {/* Bi-fold Brochures */}
                  {(tplFilter === 'all' || tplFilter === 'bifold') && filteredBifold.length > 0 && (
                    <div className="tpl-section">
                      <div className="tpl-sec-hdr">
                        <h4>Bi-fold Brochures</h4>
                        <span className="tpl-sec-badge">{filteredBifold.length}</span>
                      </div>
                      <div className="tpl-grid">{filteredBifold.map(renderCard)}</div>
                    </div>
                  )}

                  {/* A4 Product Flyers */}
                  {(tplFilter === 'all' || tplFilter === 'flyer') && filteredFlyer.length > 0 && (
                    <div className="tpl-section">
                      <div className="tpl-sec-hdr">
                        <h4>A4 Product Flyers</h4>
                        <span className="tpl-sec-badge">{filteredFlyer.length}</span>
                      </div>
                      <div className="tpl-grid">{filteredFlyer.map(renderCard)}</div>
                    </div>
                  )}

                  {/* Posters & Social */}
                  {(tplFilter === 'all' || tplFilter === 'poster') && filteredPoster.length > 0 && (
                    <div className="tpl-section">
                      <div className="tpl-sec-hdr">
                        <h4>Posters & Social</h4>
                        <span className="tpl-sec-badge">{filteredPoster.length}</span>
                      </div>
                      <div className="tpl-grid">{filteredPoster.map(renderCard)}</div>
                    </div>
                  )}
                </>
              )}
            </>
          );
        })()}

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
              <button
                className="icon"
                title="Refresh gallery"
                onClick={refreshDesigns}
                style={{ width: 28, height: 28, border: '1px solid var(--line)', borderRadius: 6, display: 'grid', placeItems: 'center' }}
              >
                <Ico name="redo" size={14} />
              </button>
            </div>

            {onOpenFile && (
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
              {designs.map((d) => (
                <div key={d.id} className="gallery-card">
                  <button
                    className="gallery-card-btn"
                    onClick={() => onOpenDesign && onOpenDesign(d.id)}
                    title={`Open "${d.name}"`}
                  >
                    <div className="gallery-thumb-wrap">
                      {d.thumbnail ? (
                        <img src={d.thumbnail} alt={d.name} loading="lazy" />
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
                      <span className="gallery-title">{d.name || 'Untitled design'}</span>
                      <div className="gallery-meta">
                        <span>{d.width}×{d.height}px</span>
                        <span>•</span>
                        <span>{d.pageCount || 1} pg</span>
                        <span>•</span>
                        <span>{new Date(d.updatedAt || d.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </button>
                  <button
                    className="gallery-del-btn"
                    onClick={(e) => handleDeleteDesign(d.id, d.name, e)}
                    title={`Delete ${d.name}`}
                    aria-label={`Delete ${d.name}`}
                  >
                    <Ico name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {previewTpl && (
        <div className="scrim" onMouseDown={() => setPreviewTpl(null)}>
          <div
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Template preview"
            style={{ maxWidth: 840, width: '92vw', padding: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#10243E' }}>{previewTpl.name}</h3>
                  <small style={{ color: '#64748b' }}>
                    {previewTpl.subtitle || 'Custom Template'} · {previewTpl.folds > 1 ? `${previewTpl.folds}-Panel Tri-fold Brochure` : 'Single Page'}
                  </small>
                </div>
                {previewTpl.previewInside && (
                  <div style={{ display: 'inline-flex', gap: 4, background: '#f1f5f9', padding: 3, borderRadius: 6 }}>
                    <button
                      type="button"
                      className="btn small"
                      style={{
                        background: previewPage === 0 ? '#ffffff' : 'transparent',
                        boxShadow: previewPage === 0 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        fontWeight: previewPage === 0 ? 600 : 400,
                        padding: '4px 10px',
                        fontSize: 12,
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPreviewPage(0)}
                    >
                      Page 1 (Outside)
                    </button>
                    <button
                      type="button"
                      className="btn small"
                      style={{
                        background: previewPage === 1 ? '#ffffff' : 'transparent',
                        boxShadow: previewPage === 1 ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        fontWeight: previewPage === 1 ? 600 : 400,
                        padding: '4px 10px',
                        fontSize: 12,
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPreviewPage(1)}
                    >
                      Page 2 (Inside)
                    </button>
                  </div>
                )}
              </div>
              <button
                className="icon"
                onClick={() => setPreviewTpl(null)}
                aria-label="Close preview"
                style={{ fontSize: 18, cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #cbd5e1', background: previewTpl.bg || '#fff', marginBottom: 16 }}>
              {previewTpl.preview ? (
                <img
                  src={(previewPage === 1 && previewTpl.previewInside) ? previewTpl.previewInside : previewTpl.preview}
                  alt={previewTpl.name}
                  style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '68vh', objectFit: 'contain' }}
                />
              ) : (
                <div style={{ width: '100%', height: 320, background: previewTpl.bg }} />
              )}
              {previewTpl.folds > 1 && (
                <div className="folds" aria-hidden="true">
                  {Array.from({ length: previewTpl.folds - 1 }, (_, i) => (
                    <i key={i} style={{ left: `${((i + 1) / previewTpl.folds) * 100}%` }} />
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>
                Full brochure dimensions: {previewTpl.w} × {previewTpl.h} px
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn" onClick={() => setPreviewTpl(null)}>Cancel</button>
                <button
                  className="btn primary"
                  style={{ background: '#005b76', color: '#fff', padding: '8px 22px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                  onClick={() => {
                    onTemplate(previewTpl);
                    setPreviewTpl(null);
                  }}
                >
                  ✓ Use This Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
