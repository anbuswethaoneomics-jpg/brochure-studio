// Google Fonts offered in the editor. To work offline, self-host these instead.
export const FONTS = [
  'Poppins', 'Montserrat', 'Inter', 'Roboto', 'Open Sans', 'Nunito', 'Raleway', 'Space Grotesk',
  'Playfair Display', 'Lora', 'Merriweather', 'DM Serif Display', 'Abril Fatface',
  'Oswald', 'Anton', 'Bebas Neue', 'Archivo Black',
  'Pacifico', 'Caveat', 'Dancing Script',
  'Caladea', 'Carlito',
];

// Fonts that only ship a single weight get no wght axis in the URL.
const SINGLE = new Set(['Anton', 'Bebas Neue', 'Archivo Black', 'Pacifico', 'Abril Fatface', 'DM Serif Display']);

export async function loadFonts() {
  const fam = FONTS.map((f) => {
    const name = f.replace(/ /g, '+');
    return SINGLE.has(f) ? `family=${name}` : `family=${name}:ital,wght@0,400;0,700;1,400;1,700`;
  }).join('&');
  if (!document.getElementById('gf-editor')) {
    const link = document.createElement('link');
    link.id = 'gf-editor';
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fam}&display=swap`;
    document.head.appendChild(link);
    await new Promise((res) => { link.onload = res; link.onerror = res; });
  }
  // Canvas only draws fonts that are already loaded, so request each one explicitly.
  await Promise.all(FONTS.flatMap((f) => [`400 16px "${f}"`, `700 16px "${f}"`].map((s) => document.fonts.load(s).catch(() => null))));
}
