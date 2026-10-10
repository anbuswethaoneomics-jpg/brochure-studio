import React, { useState, useRef, useEffect, useCallback } from 'react';
import Ico from './Ico.jsx';

const ASPECT_RATIOS = [
  { id: 'free', label: 'Free' },
  { id: '1:1', label: '1:1 Square', ratio: 1 },
  { id: '4:3', label: '4:3', ratio: 4 / 3 },
  { id: '16:9', label: '16:9 Wide', ratio: 16 / 9 },
  { id: '3:2', label: '3:2 Photo', ratio: 3 / 2 },
  { id: 'circle', label: 'Circle', ratio: 1, isCircle: true },
];

const FILTERS = [
  { id: 'none', label: 'Normal' },
  { id: 'grayscale', label: 'B&W', filter: 'grayscale(100%)' },
  { id: 'sepia', label: 'Sepia', filter: 'sepia(90%)' },
  { id: 'bright', label: 'Bright', filter: 'brightness(120%)' },
  { id: 'contrast', label: 'High Contrast', filter: 'contrast(140%)' },
  { id: 'vivid', label: 'Vivid', filter: 'saturate(160%) contrast(110%)' },
  { id: 'warm', label: 'Warm', filter: 'sepia(30%) saturate(130%) brightness(105%)' },
  { id: 'cool', label: 'Cool', filter: 'hue-rotate(180deg) saturate(90%)' },
];

export default function ImageCropModal({ target, onApply, onClose }) {
  const [aspect, setAspect] = useState('free');
  const [activeFilter, setActiveFilter] = useState('none');
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(target?.flipX || false);
  const [flipV, setFlipV] = useState(target?.flipY || false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const imgRef = useRef(null);

  // Crop box in display coordinates
  const [box, setBox] = useState({ x: 0, y: 0, w: 100, h: 100 });
  const [dispSize, setDispSize] = useState({ w: 100, h: 100 });
  const [naturalSize, setNaturalSize] = useState({ w: 100, h: 100 });

  // Drag interaction state
  const dragRef = useRef({
    active: false,
    type: null, // 'move' or handle name e.g. 'nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'
    startX: 0,
    startY: 0,
    origBox: { x: 0, y: 0, w: 100, h: 100 },
  });

  const srcUrl = target?.src || '';

  // Initialize image and crop box
  useEffect(() => {
    if (!srcUrl) return;
    setLoading(true);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      imgRef.current = img;
      setLoading(false);
    };
    img.onerror = () => {
      setError('Failed to load image for cropping.');
      setLoading(false);
    };
    img.src = srcUrl;
  }, [srcUrl]);

  // Compute displayed image layout within container
  const computeDisplaySize = useCallback(() => {
    if (!containerRef.current || !naturalSize.w || !naturalSize.h) return;
    const cw = containerRef.current.clientWidth - 40;
    const ch = containerRef.current.clientHeight - 40;
    if (cw <= 0 || ch <= 0) return;

    // Is rotation 90 or 270 deg swapped?
    const isSwapped = (rotation % 180) !== 0;
    const nw = isSwapped ? naturalSize.h : naturalSize.w;
    const nh = isSwapped ? naturalSize.w : naturalSize.h;

    const scale = Math.min(cw / nw, ch / nh, 1);
    const dw = Math.round(nw * scale);
    const dh = Math.round(nh * scale);

    setDispSize({ w: dw, h: dh });

    // Set default initial crop box with 80% inset
    const initW = Math.round(dw * 0.85);
    const initH = Math.round(dh * 0.85);
    const initX = Math.round((dw - initW) / 2);
    const initY = Math.round((dh - initH) / 2);

    setBox({ x: initX, y: initY, w: initW, h: initH });
  }, [naturalSize, rotation]);

  useEffect(() => {
    if (!loading && !error) {
      computeDisplaySize();
    }
  }, [loading, error, computeDisplaySize]);

  // When aspect ratio preset changes, adjust the crop box to match
  const handleSelectAspect = (preset) => {
    setAspect(preset.id);
    if (!preset.ratio) return;

    const targetRatio = preset.ratio;
    const dw = dispSize.w;
    const dh = dispSize.h;

    let newW, newH;
    if (dw / dh > targetRatio) {
      newH = Math.round(dh * 0.85);
      newW = Math.round(newH * targetRatio);
    } else {
      newW = Math.round(dw * 0.85);
      newH = Math.round(newW / targetRatio);
    }

    // Ensure within bounds
    if (newW > dw) {
      newW = dw;
      newH = Math.round(newW / targetRatio);
    }
    if (newH > dh) {
      newH = dh;
      newW = Math.round(newH * targetRatio);
    }

    const newX = Math.round(Math.max(0, (dw - newW) / 2));
    const newY = Math.round(Math.max(0, (dh - newH) / 2));
    setBox({ x: newX, y: newY, w: newW, h: newH });
  };

  // Reset to full bounds
  const handleResetCrop = () => {
    setBox({ x: 0, y: 0, w: dispSize.w, h: dispSize.h });
    setAspect('free');
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setActiveFilter('none');
  };

  // Pointer drag handler for moving and resizing crop box
  const startDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    dragRef.current = {
      active: true,
      type,
      startX: e.clientX,
      startY: e.clientY,
      origBox: { ...box },
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const { type, startX, startY, origBox } = dragRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const maxW = dispSize.w;
    const maxH = dispSize.h;
    const minSize = 30;

    let newX = origBox.x;
    let newY = origBox.y;
    let newW = origBox.w;
    let newH = origBox.h;

    const currentPreset = ASPECT_RATIOS.find((a) => a.id === aspect);
    const fixedRatio = currentPreset?.ratio;

    if (type === 'move') {
      newX = Math.max(0, Math.min(maxW - newW, origBox.x + dx));
      newY = Math.max(0, Math.min(maxH - newH, origBox.y + dy));
    } else {
      // Handle resizing from 8 anchor points
      if (type.includes('e')) {
        newW = Math.max(minSize, Math.min(maxW - origBox.x, origBox.w + dx));
      }
      if (type.includes('s')) {
        newH = Math.max(minSize, Math.min(maxH - origBox.y, origBox.h + dy));
      }
      if (type.includes('w')) {
        const potentialW = origBox.w - dx;
        if (potentialW >= minSize && origBox.x + dx >= 0) {
          newX = origBox.x + dx;
          newW = potentialW;
        } else if (origBox.x + dx < 0) {
          newX = 0;
          newW = origBox.x + origBox.w;
        }
      }
      if (type.includes('n')) {
        const potentialH = origBox.h - dy;
        if (potentialH >= minSize && origBox.y + dy >= 0) {
          newY = origBox.y + dy;
          newH = potentialH;
        } else if (origBox.y + dy < 0) {
          newY = 0;
          newH = origBox.y + origBox.h;
        }
      }

      // Enforce aspect ratio if locked
      if (fixedRatio) {
        if (type.includes('e') || type.includes('w')) {
          newH = Math.round(newW / fixedRatio);
          if (newY + newH > maxH) {
            newH = maxH - newY;
            newW = Math.round(newH * fixedRatio);
          }
        } else if (type.includes('n') || type.includes('s')) {
          newW = Math.round(newH * fixedRatio);
          if (newX + newW > maxW) {
            newW = maxW - newX;
            newH = Math.round(newW / fixedRatio);
          }
        }
      }
    }

    setBox({ x: Math.round(newX), y: Math.round(newY), w: Math.round(newW), h: Math.round(newH) });
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
  };

  // Keyboard shortcut support
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) applyCropResult();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  // Execute and generate cropped image output
  const applyCropResult = () => {
    const img = imgRef.current;
    if (!img) return;

    const isSwapped = (rotation % 180) !== 0;
    const nw = isSwapped ? naturalSize.h : naturalSize.w;
    const nh = isSwapped ? naturalSize.w : naturalSize.h;

    const scaleX = nw / dispSize.w;
    const scaleY = nh / dispSize.h;

    const sx = Math.max(0, Math.round(box.x * scaleX));
    const sy = Math.max(0, Math.round(box.y * scaleY));
    const sw = Math.min(nw - sx, Math.round(box.w * scaleX));
    const sh = Math.min(nh - sy, Math.round(box.h * scaleY));

    if (sw <= 0 || sh <= 0) return;

    // 1. First canvas: transform source image (rotation + flip)
    const tCanvas = document.createElement('canvas');
    tCanvas.width = nw;
    tCanvas.height = nh;
    const tCtx = tCanvas.getContext('2d');

    tCtx.translate(nw / 2, nh / 2);
    if (rotation !== 0) tCtx.rotate((rotation * Math.PI) / 180);
    if (flipH) tCtx.scale(-1, 1);
    if (flipV) tCtx.scale(1, -1);
    tCtx.translate(-naturalSize.w / 2, -naturalSize.h / 2);
    tCtx.drawImage(img, 0, 0);

    // 2. Output canvas: crop slice from transformed image
    const outCanvas = document.createElement('canvas');
    outCanvas.width = sw;
    outCanvas.height = sh;
    const outCtx = outCanvas.getContext('2d');

    // Apply filter if selected
    const filterObj = FILTERS.find((f) => f.id === activeFilter);
    if (filterObj && filterObj.filter) {
      outCtx.filter = filterObj.filter;
    }

    // Apply circle clipping if circle preset
    if (aspect === 'circle') {
      outCtx.beginPath();
      outCtx.ellipse(sw / 2, sh / 2, sw / 2, sh / 2, 0, 0, Math.PI * 2);
      outCtx.clip();
    }

    outCtx.drawImage(tCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

    const croppedDataUrl = outCanvas.toDataURL('image/png');
    onApply(croppedDataUrl, { flipX: false, flipY: false });
  };

  // Real-time crop dimensions calculation
  const cropPixelW = Math.round((box.w / (dispSize.w || 1)) * (rotation % 180 !== 0 ? naturalSize.h : naturalSize.w));
  const cropPixelH = Math.round((box.h / (dispSize.h || 1)) * (rotation % 180 !== 0 ? naturalSize.w : naturalSize.h));

  const filterStyle = FILTERS.find((f) => f.id === activeFilter)?.filter || 'none';

  return (
    <div className="scrim" style={{ zIndex: 9999, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)' }} onMouseDown={onClose}>
      <div
        className="modal"
        style={{
          width: '92vw',
          maxWidth: 920,
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: 14,
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          background: '#ffffff',
        }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Crop and Edit Image"
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 22px',
            borderBottom: '1px solid #e2e8f0',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-flex', padding: 6, borderRadius: 8, background: '#0b5d4b', color: '#fff' }}>
              <Ico name="crop" size={18} />
            </span>
            <div>
              <h2 style={{ fontSize: 16, margin: 0, fontWeight: 700, color: '#0f172a' }}>Crop & Edit Image</h2>
              <span style={{ fontSize: 12, color: '#64748b' }}>Drag the crop box corners or choose an aspect ratio preset</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: 22,
              lineHeight: 1,
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: 6,
            }}
            title="Close (Esc)"
          >
            ×
          </button>
        </div>

        {/* Toolbar: Aspect Ratios, Transforms & Filters */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 12,
            padding: '10px 20px',
            borderBottom: '1px solid #f1f5f9',
            background: '#ffffff',
          }}
        >
          {/* Aspect Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Ratio:</span>
            {ASPECT_RATIOS.map((a) => (
              <button
                key={a.id}
                type="button"
                className={`tb txt ${aspect === a.id ? 'on' : ''}`}
                style={{
                  fontSize: 12,
                  padding: '4px 9px',
                  borderRadius: 6,
                  fontWeight: aspect === a.id ? 700 : 500,
                  background: aspect === a.id ? '#0b5d4b' : '#f1f5f9',
                  color: aspect === a.id ? '#ffffff' : '#334155',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onClick={() => handleSelectAspect(a)}
              >
                {a.label}
              </button>
            ))}
          </div>

          <span style={{ width: 1, height: 20, background: '#e2e8f0' }} />

          {/* Quick Transformations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              type="button"
              className="tb"
              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontSize: 12 }}
              onClick={() => setRotation((r) => (r + 90) % 360)}
              title="Rotate 90° Clockwise"
            >
              <Ico name="rotate" size={14} /> <span style={{ marginLeft: 4 }}>Rotate</span>
            </button>
            <button
              type="button"
              className="tb"
              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: flipH ? '#e6fffa' : '#fff', cursor: 'pointer', fontSize: 12 }}
              onClick={() => setFlipH((f) => !f)}
              title="Flip Horizontal"
            >
              <Ico name="flip-h" size={14} /> <span style={{ marginLeft: 4 }}>Flip H</span>
            </button>
            <button
              type="button"
              className="tb"
              style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #e2e8f0', background: flipV ? '#e6fffa' : '#fff', cursor: 'pointer', fontSize: 12 }}
              onClick={() => setFlipV((f) => !f)}
              title="Flip Vertical"
            >
              <Ico name="flip-v" size={14} /> <span style={{ marginLeft: 4 }}>Flip V</span>
            </button>
            <button
              type="button"
              className="tb txt"
              style={{ fontSize: 12, color: '#d9730d', background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px' }}
              onClick={handleResetCrop}
              title="Reset Crop and Transforms"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Interactive Cropper Stage */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            minHeight: 380,
            maxHeight: 460,
            background: '#090d16',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            userSelect: 'none',
            overflow: 'hidden',
          }}
        >
          {loading && <div style={{ color: '#94a3b8', fontSize: 14 }}>Loading image...</div>}
          {error && <div style={{ color: '#f87171', fontSize: 14 }}>{error}</div>}

          {!loading && !error && (
            <div
              style={{
                width: dispSize.w,
                height: dispSize.h,
                position: 'relative',
                boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              }}
            >
              {/* Underlying Image */}
              <img
                src={srcUrl}
                alt="Crop preview"
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  pointerEvents: 'none',
                  transform: `rotate(${rotation}deg) scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
                  filter: filterStyle,
                  transition: 'filter 0.2s ease',
                }}
              />

              {/* Shaded Backdrop Outside Crop Box (SVG Mask) */}
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
              >
                <defs>
                  <mask id="crop-mask">
                    <rect width="100%" height="100%" fill="white" />
                    {aspect === 'circle' ? (
                      <ellipse
                        cx={box.x + box.w / 2}
                        cy={box.y + box.h / 2}
                        rx={box.w / 2}
                        ry={box.h / 2}
                        fill="black"
                      />
                    ) : (
                      <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="black" />
                    )}
                  </mask>
                </defs>
                <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.65)" mask="url(#crop-mask)" />
              </svg>

              {/* Interactive Crop Box Overlay */}
              <div
                style={{
                  position: 'absolute',
                  left: box.x,
                  top: box.y,
                  width: box.w,
                  height: box.h,
                  boxSizing: 'border-box',
                  border: '2px solid #00e5ff',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
                  borderRadius: aspect === 'circle' ? '50%' : 0,
                  cursor: 'move',
                }}
                onPointerDown={(e) => startDrag(e, 'move')}
              >
                {/* 3x3 Rule of Thirds Grid */}
                {aspect !== 'circle' && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: 1, borderLeft: '1px dashed rgba(255,255,255,0.45)' }} />
                    <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: 1, borderLeft: '1px dashed rgba(255,255,255,0.45)' }} />
                    <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: 1, borderTop: '1px dashed rgba(255,255,255,0.45)' }} />
                    <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: 1, borderTop: '1px dashed rgba(255,255,255,0.45)' }} />
                  </div>
                )}

                {/* 8 Resize Handles */}
                {[
                  { id: 'nw', cursor: 'nwse-resize', x: -6, y: -6 },
                  { id: 'n', cursor: 'ns-resize', x: 'calc(50% - 6px)', y: -6 },
                  { id: 'ne', cursor: 'nesw-resize', x: box.w - 6, y: -6 },
                  { id: 'e', cursor: 'ew-resize', x: box.w - 6, y: 'calc(50% - 6px)' },
                  { id: 'se', cursor: 'nwse-resize', x: box.w - 6, y: box.h - 6 },
                  { id: 's', cursor: 'ns-resize', x: 'calc(50% - 6px)', y: box.h - 6 },
                  { id: 'sw', cursor: 'nesw-resize', x: -6, y: box.h - 6 },
                  { id: 'w', cursor: 'ew-resize', x: -6, y: 'calc(50% - 6px)' },
                ].map((h) => (
                  <div
                    key={h.id}
                    onPointerDown={(e) => startDrag(e, h.id)}
                    style={{
                      position: 'absolute',
                      left: h.x,
                      top: h.y,
                      width: 12,
                      height: 12,
                      background: '#ffffff',
                      border: '2px solid #00b4d8',
                      borderRadius: 2,
                      cursor: h.cursor,
                      boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Filter Presets Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            overflowX: 'auto',
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 }}>
            Filters:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`tb txt ${activeFilter === f.id ? 'on' : ''}`}
              style={{
                fontSize: 12,
                padding: '3px 8px',
                borderRadius: 6,
                fontWeight: activeFilter === f.id ? 700 : 500,
                background: activeFilter === f.id ? '#0f172a' : '#ffffff',
                color: activeFilter === f.id ? '#ffffff' : '#475569',
                border: '1px solid #cbd5e1',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 22px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
          }}
        >
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Cropped Area: <b>{cropPixelW} × {cropPixelH} px</b>
            {aspect !== 'free' && ` (${aspect.toUpperCase()})`}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                background: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: 6,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn primary"
              onClick={applyCropResult}
              style={{
                padding: '8px 20px',
                background: '#0b5d4b',
                color: '#ffffff',
                border: 'none',
                borderRadius: 6,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 4px rgba(11, 93, 75, 0.25)',
              }}
            >
              <Ico name="crop" size={15} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

