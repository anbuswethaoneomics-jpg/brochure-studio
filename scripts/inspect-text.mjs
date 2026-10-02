import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../templates/source/sample-to-insight.html');

async function main() {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1123, height: 794 },
    deviceScaleFactor: 1,
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  const textReport = await page.evaluate(() => {
    const textSelectors = 'h1, h2, h3, p, li, dt, dd, .kicker, .step, .pill, .grp, .num, .dot, .pn, .foot';
    const elements = document.querySelectorAll(textSelectors);
    const results = [];

    for (const el of elements) {
      // ignore container elements that only wrap other text elements
      if (el.tagName === 'LI' && el.querySelector('h1, h2, h3, p')) continue;
      if (el.tagName === 'DIV' && el.querySelector('h1, h2, h3, p')) continue;

      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      // Find lines via Range
      const lines = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const text = node.textContent;
        const words = text.split(/(\s+)/);
        let charIndex = 0;
        for (let i = 0; i < words.length; i++) {
          const w = words[i];
          if (!w.trim()) {
            charIndex += w.length;
            continue;
          }
          const range = document.createRange();
          range.setStart(node, charIndex);
          range.setEnd(node, charIndex + w.length);
          const rRects = range.getClientRects();
          if (rRects.length > 0) {
            const rRect = rRects[0];
            // find which line this belongs to based on Y
            let matchedLine = lines.find((l) => Math.abs(l.top - rRect.top) < 4);
            if (!matchedLine) {
              matchedLine = { top: rRect.top, words: [] };
              lines.push(matchedLine);
            }
            matchedLine.words.push(w);
          }
          charIndex += w.length;
        }
      }

      // Sort lines by vertical position
      lines.sort((a, b) => a.top - b.top);

      results.push({
        tag: el.tagName,
        class: el.className,
        text: el.innerText.trim(),
        lineCount: lines.length,
        lines: lines.map((l) => ({
          first: l.words[0],
          last: l.words[l.words.length - 1],
          text: l.words.join(' '),
        })),
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
        color: style.color,
        width: rect.width,
        height: rect.height,
      });
    }
    return results;
  });

  console.log(`Found ${textReport.length} text elements`);
  for (const item of textReport) {
    if (item.lineCount > 1 || item.tag === 'H1' || item.tag === 'H2') {
      console.log(`[${item.tag}.${item.class}] ${item.fontSize} w:${item.fontWeight} lines:${item.lineCount}`);
      item.lines.forEach((l, idx) => console.log(`   Line ${idx + 1}: "${l.text}" (first: ${l.first}, last: ${l.last})`));
    }
  }

  await browser.close();
}

main().catch(console.error);
