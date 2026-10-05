/**
 * measure-product-onepager.js
 * Renders each product section from product-one-pagers.html
 * and extracts Fabric.js-compatible JSON for all 14 pages.
 *
 * Run: node scripts/measure-product-onepager.js
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HTML_PATH = path.join(ROOT, 'templates', 'source', 'product-one-pagers.html');
const OUT_PATH = path.join(ROOT, 'client', 'src', 'product-onepager.json');

const W = 794;
const H = 1123;

async function measurePage(page, slugIndex) {
  // Scroll so the right section is in view at top
  await page.evaluate((idx) => {
    const pages = document.querySelectorAll('.page');
    if (pages[idx]) pages[idx].scrollIntoView();
  }, slugIndex);

  const objects = await page.evaluate((idx) => {
    const pageEl = document.querySelectorAll('.page')[idx];
    if (!pageEl) return [];
    const pageRect = pageEl.getBoundingClientRect();
    const objs = [];

    function toHex(color) {
      if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') return null;
      const tmp = document.createElement('div');
      tmp.style.color = color;
      document.body.appendChild(tmp);
      const c = getComputedStyle(tmp).color;
      document.body.removeChild(tmp);
      const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (!m) return null;
      return '#' + [m[1],m[2],m[3]].map(x=>parseInt(x).toString(16).padStart(2,'0')).join('');
    }

    function walk(el) {
      const r = el.getBoundingClientRect();
      const rel = {
        left: r.left - pageRect.left,
        top: r.top - pageRect.top,
        width: r.width,
        height: r.height,
      };
      if (rel.width < 2 || rel.height < 2) return;

      const cs = getComputedStyle(el);
      const tag = el.tagName.toLowerCase();
      const text = el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
        ? el.textContent.trim() : null;

      // Background rect
      const bg = toHex(cs.backgroundColor);
      if (bg && bg !== '#ffffff' && bg !== '#fff') {
        objs.push({
          type: 'rect',
          left: rel.left,
          top: rel.top,
          width: rel.width,
          height: rel.height,
          fill: bg,
          stroke: null,
          rx: parseFloat(cs.borderRadius) || 0,
          selectable: true,
        });
      }

      // Text nodes
      if (text && text.length > 0 && ['p','span','h1','h2','h3','h4','li','dt','dd','b','div'].includes(tag)) {
        const fs = parseFloat(cs.fontSize) || 12;
        const fw = cs.fontWeight;
        const fc = toHex(cs.color) || '#2B3A4F';
        objs.push({
          type: 'textbox',
          left: rel.left,
          top: rel.top,
          width: rel.width || 200,
          text: text,
          fontSize: Math.round(fs),
          fontFamily: 'Poppins',
          fontWeight: parseInt(fw) >= 600 ? 'bold' : 'normal',
          fill: fc,
          textAlign: cs.textAlign === 'center' ? 'center' : 'left',
          selectable: true,
        });
        return; // don't recurse into text nodes
      }

      // Recurse
      for (const child of el.children) {
        walk(child);
      }
    }

    walk(pageEl);
    return objs;
  }, slugIndex);

  return objects;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const context = await browser.newContext({ viewport: { width: W, height: H * 16 } });
  const page = await context.newPage();

  const url = 'file://' + HTML_PATH;
  await page.goto(url, { waitUntil: 'networkidle' });

  // Wait for fonts
  await page.waitForTimeout(2000);

  const count = await page.evaluate(() => document.querySelectorAll('.page').length);
  console.log(`Found ${count} pages`);

  const slugs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.page')).map(p => p.dataset.slug || 'page')
  );

  const pages = [];
  for (let i = 0; i < count; i++) {
    console.log(`Measuring page ${i+1}/${count}: ${slugs[i]}`);
    const objects = await measurePage(page, i);

    // Add background
    const fabricPage = {
      version: '6.0.0',
      objects: [
        {
          type: 'rect',
          left: 0, top: 0,
          width: W, height: H,
          fill: '#ffffff',
          stroke: null,
          selectable: false,
          evented: false,
        },
        ...objects,
      ],
    };
    pages.push(fabricPage);
  }

  await browser.close();

  const result = { width: W, height: H, pages };
  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2));
  console.log(`✅ Written to ${OUT_PATH}`);
})();
