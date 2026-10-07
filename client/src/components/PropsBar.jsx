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

function SizeStepper({ value, onChange, onStep, label = "Size" }) {
  return (
    <div className="size-stepper" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span className="props-label">{label}</span>
      <button
        type="button"
        className="tb"
        style={{ width: 24, height: 24, minWidth: 24, padding: 0, fontWeight: 'bold', fontSize: 13, lineHeight: '22px' }}
        onClick={() => onStep(-2)}
        title="Minimize / shrink size (-)"
        aria-label="Minimize size"
      >
        −
      </button>
      <input
        type="number"
        value={value || 0}
        min={2}
        max={2000}
        style={{ width: 48, textAlign: 'center', padding: '2px 4px', fontSize: 12, borderRadius: 4, border: '1px solid #ccc' }}
        onChange={(e) => {
          const v = parseFloat(e.target.value);
          if (!Number.isNaN(v) && v > 0) onChange(v);
        }}
      />
      <button
        type="button"
        className="tb"
        style={{ width: 24, height: 24, minWidth: 24, padding: 0, fontWeight: 'bold', fontSize: 13, lineHeight: '22px' }}
        onClick={() => onStep(2)}
        title="Maximize / enlarge size (+)"
        aria-label="Maximize size"
      >
        +
      </button>
    </div>
  );
}

export default function StudioPropsBar({ ed, bg }) {
  const s = ed.sel;

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
          <SizeStepper value={s.size} onChange={ed.setObjectSize} onStep={ed.changeObjectSize} />
          <span className="sep" />
          <span className="props-label">Fill</span>
          <Color label="Fill color" value={s.fill} onChange={ed.setColor} />
          <span className="props-label">Border</span>
          <Color label="Border color" value={s.stroke} onChange={(v) => ed.setStroke({ stroke: v })} />
          <Num label="Border Width" value={s.sw} min={0} max={80} onChange={(v) => ed.setStroke({ strokeWidth: v })} />
          {s.isRect && <Num label="Corners" value={Math.round(s.r)} min={0} max={300} onChange={ed.setCorner} />}
        </>
      )}

      {/* ── Icon / Line controls ──────────────────────────── */}
      {(s.kind === 'icon' || s.kind === 'line') && (
        <>
          {s.kind === 'icon' && (
            <>
              <SizeStepper value={s.size} onChange={ed.setObjectSize} onStep={ed.changeObjectSize} />
              <span className="sep" />
            </>
          )}
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
          <SizeStepper value={s.size} onChange={ed.setObjectSize} onStep={(d) => ed.changeObjectSize(d * 4)} />
          <span className="sep" />
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

      {s.kind === 'multi' && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span className="props-label">Multiple selected</span>
          <SizeStepper value={s.size} onChange={ed.setObjectSize} onStep={ed.changeObjectSize} />
        </div>
      )}

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
