// Sizes are in CSS pixels at 96 dpi (A4 = 794 x 1123).
export const PRESETS = [
  { id: 'trifold', name: 'Tri-fold brochure', note: 'A4 landscape, 3 panels', w: 1123, h: 794, folds: 3 },
  { id: 'bifold', name: 'Bi-fold brochure', note: 'A4 landscape, 2 panels', w: 1123, h: 794, folds: 2 },
  { id: 'a4', name: 'A4 flyer', note: '794 x 1123', w: 794, h: 1123, folds: 0 },
  { id: 'poster', name: 'Poster (A3)', note: '1123 x 1587', w: 1123, h: 1587, folds: 0 },
  { id: 'square', name: 'Social post', note: '1080 x 1080', w: 1080, h: 1080, folds: 0 },
  { id: 'story', name: 'Story', note: '1080 x 1920', w: 1080, h: 1920, folds: 0 },
  { id: 'card', name: 'Business card', note: '1050 x 600', w: 1050, h: 600, folds: 0 },
];
