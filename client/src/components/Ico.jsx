import { DECOR, UI } from '../icons.js';

const EXTRA = {
  gallery: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="14" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
  crop: '<path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/>',
  rotate: '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>',
  'flip-h': '<path d="m3 7 5 5-5 5V7z"/><path d="m21 7-5 5 5 5V7z"/><path d="M12 20v2"/><path d="M12 14v2"/><path d="M12 8v2"/><path d="M12 2v2"/>',
  'flip-v': '<path d="m7 3 5 5 5-5H7z"/><path d="m7 21 5-5 5 5H7z"/><path d="M20 12h2"/><path d="M14 12h2"/><path d="M8 12h2"/><path d="M2 12h2"/>',
};

export default function Ico({ name, size = 18 }) {
  const inner = UI[name] || DECOR[name] || EXTRA[name] || '';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
