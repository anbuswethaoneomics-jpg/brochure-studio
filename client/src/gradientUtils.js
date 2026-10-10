import { Gradient } from 'fabric';

export const GRADIENT_PRESETS = [
  // Subtle & light gradients (ideal for brochure/flyer reading)
  { id: 'soft-mint', label: 'Soft Mint', colors: ['#f0fdf4', '#dcfce7'], direction: 'to-bottom' },
  { id: 'clean-sky', label: 'Clean Sky', colors: ['#f0f9ff', '#e0f2fe'], direction: 'to-bottom' },
  { id: 'modern-slate', label: 'Modern Slate', colors: ['#f8fafc', '#e2e8f0'], direction: 'to-bottom' },
  { id: 'warm-cream', label: 'Warm Cream', colors: ['#fefce8', '#fef3c7'], direction: 'to-bottom' },
  { id: 'blush-rose', label: 'Blush Rose', colors: ['#fff1f2', '#ffe4e6'], direction: 'to-bottom-right' },
  { id: 'ice-lavender', label: 'Ice Lavender', colors: ['#f5f3ff', '#ede9fe'], direction: 'to-bottom' },

  // OneOmics & Biotech brand gradients
  { id: 'oneomics-teal', label: 'OneOmics Teal', colors: ['#005b76', '#00b4d8'], direction: 'to-bottom-right' },
  { id: 'biotech-emerald', label: 'Biotech Emerald', colors: ['#006837', '#34d399'], direction: 'to-bottom-right' },
  { id: 'teal-lime', label: 'Teal & Lime', colors: ['#006837', '#84cc16'], direction: 'to-right' },
  { id: 'forest-depth', label: 'Forest Depth', colors: ['#064e3b', '#047857'], direction: 'to-bottom' },

  // Modern & vibrant gradients
  { id: 'ocean-deep', label: 'Ocean Deep', colors: ['#0f2027', '#2c5364'], direction: 'to-bottom' },
  { id: 'midnight-navy', label: 'Midnight Navy', colors: ['#0a192f', '#1e3a5f'], direction: 'to-bottom' },
  { id: 'sunset-glow', label: 'Sunset Glow', colors: ['#ff512f', '#dd2476'], direction: 'to-bottom-right' },
  { id: 'warm-amber', label: 'Warm Amber', colors: ['#f59e0b', '#ef4444'], direction: 'to-bottom-right' },
  { id: 'royal-purple', label: 'Royal Purple', colors: ['#4f46e5', '#9333ea'], direction: 'to-bottom-right' },
  { id: 'neon-blue', label: 'Neon Blue', colors: ['#0052d4', '#6fb1fc'], direction: 'to-right' },
];

export const SOLID_PRESETS = [
  { label: 'White', color: '#ffffff' },
  { label: 'Slate 50', color: '#f8fafc' },
  { label: 'Slate 100', color: '#f1f5f9' },
  { label: 'Mint 50', color: '#f0fdf4' },
  { label: 'Sky 50', color: '#f0f9ff' },
  { label: 'Cream', color: '#fefce8' },
  { label: 'Rose 50', color: '#fff1f2' },
  { label: 'OneOmics Teal', color: '#005b76' },
  { label: 'OneOmics Green', color: '#006837' },
  { label: 'Dark Navy', color: '#0f172a' },
];

export const DIRECTIONS = [
  { id: 'to-bottom', label: 'Vertical', icon: '↓' },
  { id: 'to-right', label: 'Horizontal', icon: '→' },
  { id: 'to-bottom-right', label: 'Diagonal ↘', icon: '↘' },
  { id: 'to-top-right', label: 'Diagonal ↗', icon: '↗' },
  { id: 'radial', label: 'Radial', icon: '◎' },
];

export function toCssGradient({ type = 'linear', colors = ['#006837', '#00b4d8'], direction = 'to-bottom-right', colorStops } = {}) {
  const stops = colorStops && colorStops.length
    ? colorStops.map((s) => `${s.color} ${Math.round((s.offset ?? 0) * 100)}%`).join(', ')
    : colors.map((c, i) => `${c} ${Math.round((i / (colors.length - 1 || 1)) * 100)}%`).join(', ');

  if (type === 'radial' || direction === 'radial') {
    return `radial-gradient(circle, ${stops})`;
  }
  const dirMap = {
    'to-bottom': 'to bottom',
    'to-top': 'to top',
    'to-right': 'to right',
    'to-left': 'to left',
    'to-bottom-right': '135deg',
    'to-top-right': '45deg',
  };
  const dirCss = dirMap[direction] || '135deg';
  return `linear-gradient(${dirCss}, ${stops})`;
}

export function toFabricGradient(config, w = 1123, h = 794) {
  const type = (config.type === 'radial' || config.direction === 'radial') ? 'radial' : 'linear';
  const colors = config.colors || ['#006837', '#00b4d8'];
  const stops = config.colorStops && config.colorStops.length
    ? config.colorStops
    : colors.map((c, i) => ({ offset: i / (colors.length - 1 || 1), color: c }));

  let coords;
  if (type === 'radial') {
    coords = {
      x1: w / 2,
      y1: h / 2,
      r1: 0,
      x2: w / 2,
      y2: h / 2,
      r2: Math.max(w, h) / 1.5,
    };
  } else {
    const dir = config.direction || 'to-bottom-right';
    switch (dir) {
      case 'to-bottom':
        coords = { x1: 0, y1: 0, x2: 0, y2: h };
        break;
      case 'to-top':
        coords = { x1: 0, y1: h, x2: 0, y2: 0 };
        break;
      case 'to-right':
        coords = { x1: 0, y1: 0, x2: w, y2: 0 };
        break;
      case 'to-left':
        coords = { x1: w, y1: 0, x2: 0, y2: 0 };
        break;
      case 'to-top-right':
        coords = { x1: 0, y1: h, x2: w, y2: 0 };
        break;
      case 'to-bottom-right':
      default:
        coords = { x1: 0, y1: 0, x2: w, y2: h };
        break;
    }
  }

  return new Gradient({
    type,
    gradientUnits: 'pixels',
    coords,
    colorStops: stops,
  });
}

export function parseBackground(bg) {
  if (!bg) return { isGradient: false, color: '#ffffff', css: '#ffffff' };
  if (typeof bg === 'string') {
    if (bg.startsWith('linear-gradient') || bg.startsWith('radial-gradient')) {
      return {
        isGradient: true,
        css: bg,
        type: bg.startsWith('radial') ? 'radial' : 'linear',
        colors: ['#005b76', '#00b4d8'],
      };
    }
    const clean = /^#[0-9a-f]{3,8}$/i.test(bg) || bg.startsWith('rgb') ? bg : '#ffffff';
    return { isGradient: false, color: clean, css: clean };
  }

  // Fabric Gradient instance or object with colorStops
  if (bg && (bg.colorStops || bg.type || bg.coords)) {
    const type = bg.type === 'radial' ? 'radial' : 'linear';
    const colorStops = bg.colorStops || [];
    const colors = colorStops.map((s) => s.color);
    let direction = 'to-bottom-right';
    if (type === 'radial') {
      direction = 'radial';
    } else if (bg.coords) {
      const { x1 = 0, y1 = 0, x2 = 0, y2 = 0 } = bg.coords;
      if (x1 === x2 && y2 > y1) direction = 'to-bottom';
      else if (x1 === x2 && y1 > y2) direction = 'to-top';
      else if (y1 === y2 && x2 > x1) direction = 'to-right';
      else if (y1 === y2 && x1 > x2) direction = 'to-left';
      else if (x2 > x1 && y1 > y2) direction = 'to-top-right';
      else direction = 'to-bottom-right';
    }
    const safeColors = colors.length >= 2 ? colors : ['#006837', '#00b4d8'];
    const css = toCssGradient({ type, colors: safeColors, direction, colorStops });
    return {
      isGradient: true,
      type,
      direction,
      colors: safeColors,
      colorStops,
      coords: bg.coords,
      css,
    };
  }

  return { isGradient: false, color: '#ffffff', css: '#ffffff' };
}

