import { useState } from 'react';
import Ico from './Ico.jsx';
import { FONTS } from '../fonts.js';

function Btn({ icon, label, on, onClick, disabled, children }) {
  return (
    <button
      className={`tb ${on ? 'on' : ''}`}
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={on === undefined ? undefined : !!on}
      disabled={disabled}
    >
      {icon ? <Ico name={icon} /> : children}
    </button>
  );
}

function Num({ label, value, min, max, step = 1, onChange, width = 56 }) {
  return (
    <label className="num">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        style={{ width }}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
      />
    </label>
  );
}

function Color({ label, value, onChange }) {
  const hexVal = typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : '#ffffff';
  return (
    <label className="color" title={label}>
      <span className="sr">{label}</span>
      <input
        type="color"
        value={hexVal}
        onInput={(e) => onChange(e.target.value)}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

export default function StudioPropsBar({ ed, bg, folds = 3 }) {
  const s = ed.sel;
  const [showShuffle, setShowShuffle] = useState(false);

  if (!s) {
    return (
      <div className="props">
        <span className="props-label">Page background</span>
        <Color label="Page background" value={bg} onChange={ed.setBackground} />
        <span className="sep" />
        <button
          className="tb txt"
          style={{ background: '#0b5d4b', color: '#fff', borderRadius: 6, padding: '3px 10px', fontWeight: 600 }}
          onClick={() => ed.addText({ label: 'Click to edit', size: 32, font: 'Poppins' })}
        >
          + Add Text
        </button>
        {folds > 1 && (
          <>
            <span className="sep" />
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
              <button
                className="tb txt"
                style={{
                  background: '#f0fdf4',
                  color: '#006837',
                  border: '1px solid #86efac',
                  borderRadius: '6px 0 0 6px',
                  padding: '4px 10px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                }}
                onClick={() => ed.shufflePanels('rotate', folds)}
                title="Shuffle/Cycle panels (Panel 1 → Panel 2 → Panel 3)"
              >
                🔀 Shuffle Panels
              </button>
              <button
                className="tb txt"
                style={{
                  background: '#f0fdf4',
                  color: '#006837',
                  border: '1px solid #86efac',
                  borderLeft: 'none',
                  borderRadius: '0 6px 6px 0',
                  padding: '4px 7px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => setShowShuffle((v) => !v)}
                title="Shuffle options"
              >
                ▾
              </button>

              {showShuffle && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 6,
                    zIndex: 200,
                    minWidth: 210,
                    background: '#ffffff',
                    borderRadius: 8,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #e2e8f0',
                    padding: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                  }}
                  onMouseLeave={() => setShowShuffle(false)}
                >
                  <button
                    className="menu-item"
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}
                    onClick={() => { ed.shufflePanels('rotate', folds); setShowShuffle(false); }}
                  >
                    🔀 Cycle Panels (1 → 2 → 3)
                  </button>
                  <button
                    className="menu-item"
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}
                    onClick={() => { ed.shufflePanels('rotate-prev', folds); setShowShuffle(false); }}
                  >
                    🔁 Cycle Reverse (3 → 2 → 1)
                  </button>
                  <div style={{ height: 1, background: '#f1f5f9', margin: '3px 0' }} />
                  <button
                    className="menu-item"
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}
                    onClick={() => { ed.shufflePanels('swap-0-1', folds); setShowShuffle(false); }}
                  >
                    ↔️ Swap Panel 1 & 2
                  </button>
                  <button
                    className="menu-item"
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}
                    onClick={() => { ed.shufflePanels('swap-1-2', folds); setShowShuffle(false); }}
                  >
                    ↔️ Swap Panel 2 & 3
                  </button>
                  <button
                    className="menu-item"
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13 }}
                    onClick={() => { ed.shufflePanels('swap-0-2', folds); setShowShuffle(false); }}
                  >
                    ↔️ Swap Panel 1 & 3
                  </button>
                  <div style={{ height: 1, background: '#f1f5f9', margin: '3px 0' }} />
                  <button
                    className="menu-item"
                    style={{ textAlign: 'left', padding: '6px 10px', borderRadius: 4, border: 'none', background: 'none', cursor: 'pointer', fontSize: 13, color: '#006837', fontWeight: 600 }}
                    onClick={() => { ed.shufflePanels('shuffle-footers', folds); setShowShuffle(false); }}
                  >
                    📍 Shuffle Bottom Elements
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        <span className="props-hint" style={{ marginLeft: 8 }}>
          — or double-click anywhere on the canvas to add text
        </span>
      </div>
    );
  }

  return (
    <div className="props">
      {/* ── Text controls ─────────────────────────────────── */}
      {s.kind === 'text' && (
        <>
          <select
            className="font-select"
            value={s.fontFamily}
            onChange={(e) => ed.setProps({ fontFamily: e.target.value })}
            aria-label="Font"
          >
            {FONTS.map((f) => (
              <option key={f} value={f} style={{ fontFamily: `"${f}"` }}>
                {f}
              </option>
            ))}
          </select>
          <Num label="Size" value={s.fontSize} min={4} max={400} onChange={(v) => ed.setProps({ fontSize: v })} />
          <Color label="Text color" value={s.fill} onChange={ed.setColor} />
          <span className="sep" />
          <Btn label="Bold" on={s.bold} onClick={() => ed.toggle('bold')}>
            <b>B</b>
          </Btn>
          <Btn label="Italic" on={s.italic} onClick={() => ed.toggle('italic')}>
            <i>I</i>
          </Btn>
          <Btn label="Underline" on={s.underline} onClick={() => ed.toggle('underline')}>
            <u>U</u>
          </Btn>
          <span className="sep" />
          <Btn icon="align-left" label="Align left" on={s.align === 'left'} onClick={() => ed.setProps({ textAlign: 'left' })} />
          <Btn icon="align-center" label="Align center" on={s.align === 'center'} onClick={() => ed.setProps({ textAlign: 'center' })} />
          <Btn icon="align-right" label="Align right" on={s.align === 'right'} onClick={() => ed.setProps({ textAlign: 'right' })} />
          <Btn icon="align-justify" label="Justify" on={s.align === 'justify'} onClick={() => ed.setProps({ textAlign: 'justify' })} />
          <span className="sep" />
          <Num label="Line" value={Number(s.lh).toFixed(2)} min={0.5} max={4} step={0.05} onChange={(v) => ed.setProps({ lineHeight: v })} />
          <Num label="Space" value={s.sp} min={-100} max={1000} step={10} onChange={(v) => ed.setProps({ charSpacing: v })} />
        </>
      )}

      {/* ── Shape controls ────────────────────────────────── */}
      {s.kind === 'shape' && (
        <>
          <span className="props-label">Fill</span>
          <Color label="Fill color" value={s.fill} onChange={ed.setColor} />
          <span className="props-label">Border</span>
          <Color label="Border color" value={s.stroke} onChange={(v) => ed.setStroke({ stroke: v })} />
          <Num label="Width" value={s.sw} min={0} max={80} onChange={(v) => ed.setStroke({ strokeWidth: v })} />
          {s.isRect && <Num label="Corners" value={Math.round(s.r)} min={0} max={300} onChange={ed.setCorner} />}
        </>
      )}

      {/* ── Icon / Line controls ──────────────────────────── */}
      {(s.kind === 'icon' || s.kind === 'line') && (
        <>
          <span className="props-label">Color</span>
          <Color label="Color" value={s.fill} onChange={ed.setColor} />
          {s.kind === 'line' && (
            <Num label="Thickness" value={s.sw} min={1} max={60} onChange={(v) => ed.setProps({ strokeWidth: v })} width={48} />
          )}
        </>
      )}

      {/* ── Image controls (Clean: no replace/OCR) ────────── */}
      {s.kind === 'image' && (
        <>
          <span className="props-label">Image</span>
          <button className="tb txt" onClick={ed.fitImageToPage} title="Stretch this image to fill the canvas">
            Fit to page
          </button>
          <button
            className="tb txt"
            onClick={() => ed.addText({ label: 'Your text here', size: 36, font: 'Poppins', color: '#1a1a1a', bold: true })}
            title="Add text on top"
          >
            + Add text on top
          </button>
        </>
      )}

      {s.kind === 'multi' && <span className="props-label">Multiple items selected</span>}

      {/* ── General controls ──────────────────────────────── */}
      <span className="sep" />
      <Num
        label="Opacity"
        value={Math.round(s.opacity * 100)}
        min={0}
        max={100}
        step={5}
        width={52}
        onChange={(v) => ed.setProps({ opacity: v / 100 })}
      />
      <span className="sep" />
      <Btn icon="front" label="Bring to front" onClick={() => ed.layer('front')} />
      <Btn icon="up" label="Bring forward" onClick={() => ed.layer('up')} />
      <Btn icon="down" label="Send backward" onClick={() => ed.layer('down')} />
      <Btn icon="back" label="Send to back" onClick={() => ed.layer('back')} />
      <span className="sep" />
      <button className="tb txt" onClick={() => ed.centerOnPage('h')}>
        Center across
      </button>
      <button className="tb txt" onClick={() => ed.centerOnPage('v')}>
        Center down
      </button>
      <span className="sep" />
      <Btn icon="copy" label="Duplicate (Ctrl+D)" onClick={ed.duplicate} />
      <Btn icon="trash" label="Delete (Del)" onClick={ed.remove} />
    </div>
  );
}
