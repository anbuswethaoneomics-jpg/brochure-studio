import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('templates/source/sample-to-insight.html'));

  const lines = await page.evaluate(() => {
    const el = document.querySelector('.flap p');

    const chars = [];
    function walk(node, format) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          const r = document.createRange();
          r.setStart(node, i);
          r.setEnd(node, i + 1);
          const rects = r.getClientRects();
          if (rects.length > 0) {
            chars.push({ char: text[i], top: rects[0].top, left: rects[0].left, format });
          } else if (text[i] === ' ' || text[i] === '\n') {
            chars.push({ char: text[i], top: null, left: null, format });
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const fmt = { ...format };
        if (node.tagName === 'B' || node.tagName === 'STRONG') fmt.fontWeight = '700';
        if (node.tagName === 'EM' || node.tagName === 'I') fmt.fill = '#0793EB';
        for (const child of node.childNodes) walk(child, fmt);
      }
    }
    walk(el, {});

    const lineGroups = [];
    let currentLine = null;
    let lastTop = -1;

    for (const c of chars) {
      if (c.top !== null) {
        if (!currentLine || Math.abs(c.top - lastTop) > 4) {
          currentLine = { top: c.top, left: c.left, chars: [] };
          lineGroups.push(currentLine);
          lastTop = c.top;
        }
        currentLine.chars.push(c);
      } else if (currentLine) {
        currentLine.chars.push(c);
      }
    }

    return lineGroups.map(lg => ({
      top: lg.top,
      left: lg.left,
      text: lg.chars.map(c => c.char).join(''),
      hasBold: lg.chars.some(c => c.format.fontWeight === '700')
    }));
  });

  console.log('Detected visual lines with formatting:');
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    console.log(` Line ${i+1} (top: ${l.top}, bold: ${l.hasBold}): "${l.text}"`);
  }

  await browser.close();
})();
