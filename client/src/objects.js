import { Rect, Circle, Textbox, FabricImage, Group, loadSVGFromString, util, Gradient } from 'fabric';
import { iconSvg } from './icons.js';

export async function makeIcon(name, size = 96, color = '#0b5d4b') {
  const { objects, options } = await loadSVGFromString(iconSvg(name, color));
  const list = objects.filter(Boolean);
  const g = list.length === 1 ? new Group(list) : util.groupSVGElements(list, options);
  g.scaleToWidth(size);
  return g;
}

export function makeText(s) {
  return new Textbox(s.t, {
    left: s.x ?? 0,
    top: s.y ?? 0,
    width: s.w || 300,
    fontSize: s.size || 24,
    fontFamily: s.font || 'Poppins',
    fontWeight: s.bold ? 'bold' : 'normal',
    fontStyle: s.italic ? 'italic' : 'normal',
    underline: !!s.underline,
    fill: s.color || '#14211d',
    textAlign: s.align || 'left',
    lineHeight: s.lh || 1.2,
    charSpacing: s.sp || 0,
  });
}

// Turns a compact spec (used by templates) into a fabric object.
export async function buildSpec(s) {
  switch (s.k) {
    case 'rect': {
      let fill = s.fill === 'transparent' ? null : (s.fill || '#0b5d4b');
      if (Array.isArray(s.gradient)) {
        fill = new Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: s.gradAngle === 'v' ? 0 : s.w, y2: s.gradAngle === 'v' ? s.h : 0 },
          colorStops: s.gradient.map((c, i, arr) => ({ offset: i / (arr.length - 1), color: c })),
        });
      }
      return new Rect({
        left: s.x, top: s.y, width: s.w, height: s.h, fill,
        rx: s.r || 0, ry: s.r || 0, stroke: s.stroke || null, strokeWidth: s.sw || 0, strokeUniform: true,
      });
    }
    case 'circle': {
      let fill = s.fill === 'transparent' ? null : (s.fill || '#0b5d4b');
      if (Array.isArray(s.gradient)) {
        const d = (s.r || 50) * 2;
        fill = new Gradient({
          type: 'linear',
          coords: { x1: 0, y1: 0, x2: s.gradAngle === 'v' ? 0 : d, y2: s.gradAngle === 'v' ? d : 0 },
          colorStops: s.gradient.map((c, i, arr) => ({ offset: i / (arr.length - 1), color: c })),
        });
      }
      return new Circle({ left: s.x, top: s.y, radius: s.r, fill });
    }
    case 'text':
      return makeText(s);
    case 'icon': {
      const g = await makeIcon(s.name, s.size, s.color);
      g.set({ left: s.x, top: s.y });
      return g;
    }
    case 'image': {
      try {
        const img = await FabricImage.fromURL(s.src, { crossOrigin: 'anonymous' });
        if (s.w) img.scaleToWidth(s.w);
        img.set({ left: s.x, top: s.y });
        return img;
      } catch (err) {
        console.warn('Template image failed to load, skipping:', s.src, err);
        return null;
      }
    }
    default:
      return null;
  }
}