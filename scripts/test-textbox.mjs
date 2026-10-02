import { chromium } from 'playwright';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
  const page = await browser.newPage();
  await page.goto('file://' + path.resolve('templates/source/sample-to-insight.html'));
  await page.addScriptTag({ path: path.resolve('client/node_modules/fabric/dist/index.min.js') });

  const res = await page.evaluate(() => {
    const { fabric } = window;
    const el = document.querySelector('.flap p');
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    // Extract lines with formatting
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

    // Build multiline text with \n and styles per line/char
    let fullText = '';
    const styles = {};

    lineGroups.forEach((lg, lIdx) => {
      if (lIdx > 0) fullText += '\n';
      styles[lIdx] = {};
      const lineStr = lg.chars.map(c => c.char).join('').trimEnd();
      fullText += lineStr;
      for (let cIdx = 0; cIdx < lg.chars.length; cIdx++) {
        const c = lg.chars[cIdx];
        if (Object.keys(c.format).length > 0) {
          styles[lIdx][cIdx] = { ...c.format };
        }
      }
    });

    const fSize = parseFloat(style.fontSize);
    const lHeight = parseFloat(style.lineHeight) / (fSize * 1.13);

    const tb = new fabric.Textbox(fullText, {
      left: rect.left,
      top: rect.top,
      width: rect.width + 10, // slight buffer so explicit \n lines don't soft-wrap
      fontSize: fSize,
      fontWeight: '400',
      fontFamily: 'Poppins',
      lineHeight: lHeight,
      fill: style.color,
      styles,
      splitByGrapheme: false,
    });

    return {
      fullText,
      textLines: tb.textLines,
      lineCount: tb.textLines.length,
      firstWords: tb.textLines.map(l => l.trim().split(' ')[0]),
      lastWords: tb.textLines.map(l => { const w = l.trim().split(' '); return w[w.length - 1]; })
    };
  });

  console.log('Textbox result:', res);
  await browser.close();
})();
