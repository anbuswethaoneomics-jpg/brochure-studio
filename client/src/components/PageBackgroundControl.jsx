import { useState, useRef, useEffect } from 'react';
import {
  GRADIENT_PRESETS,
  SOLID_PRESETS,
  DIRECTIONS,
  parseBackground,
  toCssGradient,
} from '../gradientUtils.js';

export default function PageBackgroundControl({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('solid'); // 'solid' | 'gradient'
  const popoverRef = useRef(null);

  const parsed = parseBackground(value);

  // Custom gradient local editing state
  const [customGrad, setCustomGrad] = useState({
    type: parsed.type || 'linear',
    direction: parsed.direction || 'to-bottom-right',
    color1: parsed.colors?.[0] || '#005b76',
    color2: parsed.colors?.[1] || '#00b4d8',
  });

  // Solid local color state
  const [solidColor, setSolidColor] = useState(parsed.isGradient ? '#ffffff' : (parsed.color || '#ffffff'));

  // Sync internal state when external value changes
  useEffect(() => {
    if (parsed.isGradient) {
      setTab('gradient');
      if (parsed.colors && parsed.colors.length >= 2) {
        setCustomGrad((prev) => ({
          ...prev,
          type: parsed.type || prev.type,
          direction: parsed.direction || prev.direction,
          color1: parsed.colors[0],
          color2: parsed.colors[1],
        }));
      }
    } else {
      setSolidColor(parsed.color || '#ffffff');
    }
  }, [value]); // eslint-disable-line

  // Click outside listener
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const handleApplySolid = (c) => {
    setSolidColor(c);
    setTab('solid');
    onChange(c);
  };

  const handleApplyPreset = (preset) => {
    const config = {
      isGradient: true,
      type: preset.type || 'linear',
      direction: preset.direction || 'to-bottom-right',
      colors: [...preset.colors],
    };
    setCustomGrad({
      type: config.type,
      direction: config.direction,
      color1: preset.colors[0],
      color2: preset.colors[1],
    });
    setTab('gradient');
    onChange(config);
  };

  const handleApplyCustom = (updates = {}) => {
    const next = { ...customGrad, ...updates };
    setCustomGrad(next);
    onChange({
      isGradient: true,
      type: next.direction === 'radial' ? 'radial' : (next.type || 'linear'),
      direction: next.direction,
      colors: [next.color1, next.color2],
    });
  };

  const handleSwapCustomColors = () => {
    const next = {
      ...customGrad,
      color1: customGrad.color2,
      color2: customGrad.color1,
    };
    setCustomGrad(next);
    onChange({
      isGradient: true,
      type: next.direction === 'radial' ? 'radial' : (next.type || 'linear'),
      direction: next.direction,
      colors: [next.color1, next.color2],
    });
  };

  const liveCustomCss = toCssGradient({
    type: customGrad.direction === 'radial' ? 'radial' : customGrad.type,
    direction: customGrad.direction,
    colors: [customGrad.color1, customGrad.color2],
  });

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }} ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className="tb"
        onClick={() => setOpen((v) => !v)}
        title="Change Page Background (Solid or Gradient)"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          padding: '3px 8px',
          height: 34,
          background: '#ffffff',
          border: open ? '1.5px solid #005b76' : '1px solid #cbd5e1',
          borderRadius: 8,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
      >
        {/* Swatch */}
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: parsed.css,
            border: '1px solid rgba(0,0,0,0.18)',
            display: 'inline-block',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
          }}
        />
        {parsed.isGradient ? (
          <span style={{ fontSize: 12, fontWeight: 600, color: '#005b76' }}>
            Gradient ▾
          </span>
        ) : (
          <span style={{ fontSize: 12, color: '#475569', fontWeight: 500, fontFamily: 'monospace' }}>
            {parsed.color?.toUpperCase?.() || '#FFFFFF'} ▾
          </span>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            zIndex: 350,
            width: 320,
            background: '#ffffff',
            borderRadius: 12,
            border: '1px solid #e2e8f0',
            boxShadow: '0 16px 36px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            userSelect: 'none',
          }}
        >
          {/* Tabs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              background: '#f1f5f9',
              padding: 3,
              borderRadius: 8,
              gap: 3,
            }}
          >
            <button
              type="button"
              onClick={() => {
                setTab('solid');
                handleApplySolid(solidColor);
              }}
              style={{
                border: 'none',
                background: tab === 'solid' ? '#ffffff' : 'transparent',
                color: tab === 'solid' ? '#0f172a' : '#64748b',
                fontWeight: tab === 'solid' ? 600 : 500,
                fontSize: 12.5,
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: tab === 'solid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Solid Color
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('gradient');
                handleApplyCustom();
              }}
              style={{
                border: 'none',
                background: tab === 'gradient' ? '#005b76' : 'transparent',
                color: tab === 'gradient' ? '#ffffff' : '#64748b',
                fontWeight: tab === 'gradient' ? 600 : 500,
                fontSize: 12.5,
                padding: '6px 10px',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: tab === 'gradient' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Gradient Color
            </button>
          </div>

          {/* Tab 1: Solid Color */}
          {tab === 'solid' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Color picker row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={solidColor?.length === 7 ? solidColor : '#ffffff'}
                  onChange={(e) => handleApplySolid(e.target.value)}
                  style={{
                    width: 44,
                    height: 36,
                    padding: 2,
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer',
                    background: '#ffffff',
                  }}
                />
                <input
                  type="text"
                  value={solidColor}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSolidColor(v);
                    if (/^#[0-9a-f]{6}$/i.test(v)) {
                      onChange(v);
                    }
                  }}
                  placeholder="#ffffff"
                  style={{
                    flex: 1,
                    height: 36,
                    border: '1px solid #cbd5e1',
                    borderRadius: 6,
                    padding: '0 10px',
                    fontSize: 13,
                    fontFamily: 'monospace',
                    color: '#0f172a',
                  }}
                />
              </div>

              {/* Popular palette presets */}
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
                  Popular colors
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
                  {SOLID_PRESETS.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      title={p.label}
                      onClick={() => handleApplySolid(p.color)}
                      style={{
                        height: 28,
                        borderRadius: 6,
                        background: p.color,
                        border: solidColor?.toLowerCase() === p.color.toLowerCase() ? '2px solid #005b76' : '1px solid rgba(0,0,0,0.15)',
                        cursor: 'pointer',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
                        transition: 'transform 0.1s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Gradient */}
          {tab === 'gradient' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Preset Gradients */}
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
                  Curated Presets
                </span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 6,
                    maxHeight: 155,
                    overflowY: 'auto',
                    paddingRight: 2,
                  }}
                >
                  {GRADIENT_PRESETS.map((preset) => {
                    const css = toCssGradient({
                      type: preset.type || 'linear',
                      direction: preset.direction || 'to-bottom-right',
                      colors: preset.colors,
                    });
                    const isActive =
                      parsed.isGradient &&
                      customGrad.color1 === preset.colors[0] &&
                      customGrad.color2 === preset.colors[1];

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 7,
                          padding: '5px 7px',
                          border: isActive ? '1.5px solid #005b76' : '1px solid #e2e8f0',
                          background: isActive ? '#f0f9ff' : '#ffffff',
                          borderRadius: 7,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            background: css,
                            border: '1px solid rgba(0,0,0,0.12)',
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? '#005b76' : '#334155',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Gradient Builder */}
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block' }}>
                  Custom Gradient
                </span>

                {/* Direction Selector */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  {DIRECTIONS.map((dir) => (
                    <button
                      key={dir.id}
                      type="button"
                      title={dir.label}
                      onClick={() => handleApplyCustom({ direction: dir.id })}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        fontSize: 13,
                        border: customGrad.direction === dir.id ? '1.5px solid #005b76' : '1px solid #cbd5e1',
                        background: customGrad.direction === dir.id ? '#e0f2fe' : '#ffffff',
                        color: customGrad.direction === dir.id ? '#005b76' : '#475569',
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {dir.icon}
                    </button>
                  ))}
                </div>

                {/* Color 1 & Color 2 pickers + Swap */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  {/* Color 1 */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="color"
                      value={customGrad.color1}
                      onChange={(e) => handleApplyCustom({ color1: e.target.value })}
                      style={{
                        width: 28,
                        height: 28,
                        padding: 1,
                        borderRadius: 4,
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                      }}
                    />
                    <input
                      type="text"
                      value={customGrad.color1}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-f]{6}$/i.test(v)) {
                          handleApplyCustom({ color1: v });
                        } else {
                          setCustomGrad((prev) => ({ ...prev, color1: v }));
                        }
                      }}
                      style={{
                        width: 65,
                        height: 28,
                        fontSize: 11,
                        fontFamily: 'monospace',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '0 4px',
                      }}
                    />
                  </div>

                  {/* Swap Button */}
                  <button
                    type="button"
                    onClick={handleSwapCustomColors}
                    title="Swap gradient colors"
                    style={{
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      borderRadius: 4,
                      width: 28,
                      height: 28,
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      color: '#475569',
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    ⇄
                  </button>

                  {/* Color 2 */}
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input
                      type="color"
                      value={customGrad.color2}
                      onChange={(e) => handleApplyCustom({ color2: e.target.value })}
                      style={{
                        width: 28,
                        height: 28,
                        padding: 1,
                        borderRadius: 4,
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                      }}
                    />
                    <input
                      type="text"
                      value={customGrad.color2}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (/^#[0-9a-f]{6}$/i.test(v)) {
                          handleApplyCustom({ color2: v });
                        } else {
                          setCustomGrad((prev) => ({ ...prev, color2: v }));
                        }
                      }}
                      style={{
                        width: 65,
                        height: 28,
                        fontSize: 11,
                        fontFamily: 'monospace',
                        border: '1px solid #cbd5e1',
                        borderRadius: 4,
                        padding: '0 4px',
                      }}
                    />
                  </div>
                </div>

                {/* Live Preview */}
                <div
                  style={{
                    height: 24,
                    borderRadius: 6,
                    background: liveCustomCss,
                    border: '1px solid rgba(0,0,0,0.15)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #e2e8f0',
              paddingTop: 8,
              marginTop: 2,
            }}
          >
            <button
              type="button"
              onClick={() => {
                handleApplySolid('#ffffff');
                setOpen(false);
              }}
              style={{
                border: 'none',
                background: 'none',
                color: '#64748b',
                fontSize: 12,
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: 4,
                textDecoration: 'underline',
              }}
            >
              Reset to White
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              style={{
                border: 'none',
                background: '#005b76',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: 12,
                padding: '5px 14px',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

