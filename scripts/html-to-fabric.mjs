import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../templates/source/sample-to-insight.html');
const fabricDistPath = path.resolve(__dirname, '../client/node_modules/fabric/dist/index.min.js');
const outputPath = path.resolve(__dirname, '../templates/sample-to-insight.json');

async function main() {
  console.log('Launching Chromium with Google Chrome...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security'],
  });

  const page = await browser.newPage({
    viewport: { width: 1123, height: 2200 },
    deviceScaleFactor: 1,
  });

  console.log(`Loading HTML from: ${htmlPath}`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  console.log('Injecting Fabric.js...');
  await page.addScriptTag({ path: fabricDistPath });

  console.log('Measuring DOM and generating Fabric canvas JSON...');
  const result = await page.evaluate(async () => {
    const { fabric } = window;
    if (!fabric) throw new Error('Fabric not loaded');

    if (fabric.util && fabric.util.clearFabricFontCache) {
      fabric.util.clearFabricFontCache();
    }

    const sheets = Array.from(document.querySelectorAll('.sheet'));
    const pagesOutput = [];

    function parseColor(str) {
      if (!str || str === 'transparent' || str === 'none') return null;
      return str;
    }

    // Extract exact visual lines and formatting using Range
    function extractVisualLines(el) {
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

      return lineGroups;
    }

    for (let sheetIdx = 0; sheetIdx < sheets.length; sheetIdx++) {
      const sheet = sheets[sheetIdx];
      const sRect = sheet.getBoundingClientRect();
      const sLeft = sRect.left;
      const sTop = sRect.top;
      const pagePrefix = `page${sheetIdx + 1}`;

      const cvsEl = document.createElement('canvas');
      cvsEl.width = 1123;
      cvsEl.height = 794;
      document.body.appendChild(cvsEl);

      const canvas = new fabric.StaticCanvas(cvsEl, {
        width: 1123,
        height: 794,
        backgroundColor: '#ffffff',
      });

      const panels = Array.from(sheet.querySelectorAll('.panel'));

      // 1. Panel Backgrounds & Dividers
      for (let pIdx = 0; pIdx < panels.length; pIdx++) {
        const panel = panels[pIdx];
        const pRect = panel.getBoundingClientRect();
        const pStyle = window.getComputedStyle(panel);
        const panelName = `${pagePrefix}.panel${pIdx + 1}`;

        // Panel Background
        const pBg = parseColor(pStyle.backgroundColor);
        if (pBg && pBg !== 'rgb(255, 255, 255)' && pBg !== 'rgba(0, 0, 0, 0)') {
          canvas.add(
            new fabric.Rect({
              name: `${panelName}.bg`,
              left: pRect.left - sLeft,
              top: pRect.top - sTop,
              width: pRect.width,
              height: pRect.height,
              fill: pBg,
              selectable: false,
            })
          );
        }

        // Dashed Divider (panel::before)
        const pBefore = window.getComputedStyle(panel, '::before');
        if (pBefore && pBefore.content && pBefore.content !== 'none' && pBefore.borderLeftWidth && parseFloat(pBefore.borderLeftWidth) > 0) {
          const bLeft = pRect.left - sLeft;
          const bTop = pRect.top - sTop + parseFloat(pBefore.top || '0');
          const bHeight = pRect.height - parseFloat(pBefore.top || '0') - parseFloat(pBefore.bottom || '0');
          canvas.add(
            new fabric.Line([bLeft, bTop, bLeft, bTop + bHeight], {
              name: `${panelName}.divider`,
              stroke: pBefore.borderLeftColor || '#D5E3EF',
              strokeWidth: parseFloat(pBefore.borderLeftWidth) || 1,
              strokeDashArray: [4, 4],
              selectable: false,
            })
          );
        }
      }

      // 2. Cover Art Background and Helix SVG (Front Cover on Page 1)
      const coverArt = sheet.querySelector('.cover-art');
      if (coverArt) {
        const cRect = coverArt.getBoundingClientRect();
        const cStyle = window.getComputedStyle(coverArt);
        const caBg = parseColor(cStyle.backgroundColor);
        if (caBg) {
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.coverArt.bg`,
              left: cRect.left - sLeft,
              top: cRect.top - sTop,
              width: cRect.width,
              height: cRect.height,
              fill: caBg,
              selectable: false,
            })
          );
        }

        const svgEl = coverArt.querySelector('svg.helix');
        if (svgEl) {
          const svgString = new XMLSerializer().serializeToString(svgEl);
          const { objects, options } = await fabric.loadSVGFromString(svgString);
          if (objects && objects.length) {
            objects.forEach((obj) => {
              if (!obj.fill || obj.fill === 'none' || obj.fill === '') obj.fill = null;
            });
            const svgGroup = fabric.util.groupSVGElements(objects, options);
            const sx = cRect.width / 100;
            const sy = cRect.height / 92;
            svgGroup.set({
              name: `${pagePrefix}.coverArt.helix`,
              left: (cRect.left - sLeft) + svgGroup.left * sx,
              top: (cRect.top - sTop) + svgGroup.top * sy,
              scaleX: sx,
              scaleY: sy,
              selectable: true,
            });
            canvas.add(svgGroup);
          }
        }
      }

      // 3. Bottom Tri-Bars (z-index: 3 in CSS, drawn on top of panel backgrounds and cover-art)
      for (let pIdx = 0; pIdx < panels.length; pIdx++) {
        const panel = panels[pIdx];
        const pRect = panel.getBoundingClientRect();
        const panelName = `${pagePrefix}.panel${pIdx + 1}`;
        const pAfter = window.getComputedStyle(panel, '::after');
        if (pAfter && pAfter.content && pAfter.content !== 'none') {
          const barH = parseFloat(pAfter.height) || 8.3;
          const barY = pRect.bottom - sTop - barH;
          const barW = pRect.width;
          const segW = barW / 3;
          const segs = [
            { col: '#E23B32', x: pRect.left - sLeft },
            { col: '#0793EB', x: pRect.left - sLeft + segW },
            { col: '#33A015', x: pRect.left - sLeft + 2 * segW },
          ];
          segs.forEach((seg, sIdx) => {
            canvas.add(
              new fabric.Rect({
                name: `${panelName}.tribarBottom.${sIdx + 1}`,
                left: seg.x,
                top: barY,
                width: Math.ceil(segW),
                height: barH,
                fill: seg.col,
                selectable: false,
              })
            );
          });
        }
      }

      // 3. Process all remaining elements in sheet DOM order
      const domElements = Array.from(sheet.querySelectorAll('*'));

      for (let elIdx = 0; elIdx < domElements.length; elIdx++) {
        const el = domElements[elIdx];
        if (el.classList.contains('sheet') || el.classList.contains('panel') || el.classList.contains('cover-art')) continue;
        if (el.tagName === 'SVG' || el.closest('svg')) continue;

        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const relX = rect.left - sLeft;
        const relY = rect.top - sTop;

        // A. Tribar Accent (red | blue | green)
        if (el.classList.contains('tribar')) {
          const segW = rect.width / 3;
          const segs = [
            { col: '#E23B32', x: relX },
            { col: '#0793EB', x: relX + segW },
            { col: '#33A015', x: relX + 2 * segW },
          ];
          segs.forEach((seg, sIdx) => {
            canvas.add(
              new fabric.Rect({
                name: `${pagePrefix}.tribar.${elIdx}.${sIdx + 1}`,
                left: seg.x,
                top: relY,
                width: segW,
                height: rect.height,
                fill: seg.col,
                selectable: true,
              })
            );
          });
          continue;
        }

        // B. Card Box and Card Accent Bar (.card and .card::before)
        if (el.classList.contains('card')) {
          const rx = parseFloat(style.borderRadius) || 11.34;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.card.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#ffffff',
              stroke: style.borderColor || '#D5E3EF',
              strokeWidth: parseFloat(style.borderWidth) || 0.8,
              rx,
              ry: rx,
              selectable: true,
            })
          );

          const cBefore = window.getComputedStyle(el, '::before');
          if (cBefore && cBefore.backgroundColor) {
            const barW = parseFloat(cBefore.width) || 6.8;
            const barH = rect.height;
            const arcR = Math.min(rx, barW);
            const d = `M ${relX + barW} ${relY} L ${relX + arcR} ${relY} A ${arcR} ${arcR} 0 0 0 ${relX} ${relY + arcR} L ${relX} ${relY + barH - arcR} A ${arcR} ${arcR} 0 0 0 ${relX + arcR} ${relY + barH} L ${relX + barW} ${relY + barH} Z`;
            canvas.add(
              new fabric.Path(d, {
                name: `${pagePrefix}.card.${elIdx}.accent`,
                fill: cBefore.backgroundColor,
                selectable: true,
              })
            );
          }
          continue;
        }

        // C. Module Box (.module in back cover)
        if (el.classList.contains('module')) {
          const rx = parseFloat(style.borderRadius) || 11.3;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.module.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#F3F8FC',
              rx,
              ry: rx,
              selectable: true,
            })
          );
          continue;
        }

        // D. Dot Circle (.dot in module)
        if (el.classList.contains('dot')) {
          canvas.add(
            new fabric.Circle({
              name: `${pagePrefix}.dot.${elIdx}.circle`,
              left: relX,
              top: relY,
              radius: rect.width / 2,
              fill: style.backgroundColor,
              selectable: true,
            })
          );

          const r = document.createRange();
          r.selectNodeContents(el);
          const tRect = r.getClientRects()[0] || rect;

          canvas.add(
            new fabric.Textbox(el.innerText.trim(), {
              name: `${pagePrefix}.dot.${elIdx}.text`,
              left: tRect.left - sLeft,
              top: tRect.top - sTop,
              width: tRect.width + 4,
              fontSize: parseFloat(style.fontSize) || 10.7,
              fontWeight: '700',
              fontFamily: 'Poppins',
              fill: '#ffffff',
              selectable: true,
            })
          );
          continue;
        }

        // E. Horizontal Rule (hr)
        if (el.tagName === 'HR') {
          canvas.add(
            new fabric.Line([relX, relY, relX + rect.width, relY], {
              name: `${pagePrefix}.hr.${elIdx}`,
              stroke: style.borderTopColor || '#D5E3EF',
              strokeWidth: parseFloat(style.borderTopWidth) || 0.8,
              selectable: true,
            })
          );
          continue;
        }

        // F. Pill Badges
        if (el.classList.contains('pill')) {
          const rx = rect.height / 2;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.pill.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#ffffff',
              stroke: style.borderColor,
              strokeWidth: parseFloat(style.borderWidth) || 1.2,
              rx,
              ry: rx,
              selectable: true,
            })
          );

          const dotEl = el.querySelector('i');
          if (dotEl) {
            const dRect = dotEl.getBoundingClientRect();
            const dStyle = window.getComputedStyle(dotEl);
            canvas.add(
              new fabric.Circle({
                name: `${pagePrefix}.pill.${elIdx}.dot`,
                left: dRect.left - sLeft,
                top: dRect.top - sTop,
                radius: dRect.width / 2,
                fill: dStyle.backgroundColor,
                selectable: true,
              })
            );
          }

          const pText = el.innerText.trim();
          const r = document.createRange();
          const textNode = Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) || el;
          r.selectNodeContents(textNode);
          const tRect = r.getClientRects()[0] || rect;

          canvas.add(
            new fabric.Textbox(pText, {
              name: `${pagePrefix}.pill.${elIdx}.text`,
              left: tRect.left - sLeft,
              top: tRect.top - sTop,
              width: tRect.width + 4,
              fontSize: parseFloat(style.fontSize) || 10,
              fontWeight: '500',
              fontFamily: 'Poppins',
              fill: style.color || '#10243E',
              selectable: true,
            })
          );
          continue;
        }

        // G. Service Number Badges (.num)
        if (el.classList.contains('num')) {
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.num.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor,
              rx: 6,
              ry: 6,
              selectable: true,
            })
          );

          const r = document.createRange();
          r.selectNodeContents(el);
          const tRect = r.getClientRects()[0] || rect;

          canvas.add(
            new fabric.Textbox(el.innerText.trim(), {
              name: `${pagePrefix}.num.${elIdx}.text`,
              left: tRect.left - sLeft,
              top: tRect.top - sTop,
              width: tRect.width + 4,
              fontSize: parseFloat(style.fontSize) || 9.6,
              fontWeight: '700',
              fontFamily: 'Poppins',
              fill: '#ffffff',
              selectable: true,
            })
          );
          continue;
        }

        // H. Service List Bullet Dots (li::before)
        if (el.tagName === 'LI') {
          const lBefore = window.getComputedStyle(el, '::before');
          if (lBefore && lBefore.width && parseFloat(lBefore.width) > 0) {
            const dotW = parseFloat(lBefore.width) || 4.9;
            const dotLeft = relX + parseFloat(lBefore.left || '0');
            const dotTop = relY + parseFloat(lBefore.top || '0');
            canvas.add(
              new fabric.Circle({
                name: `${pagePrefix}.bullet.${elIdx}`,
                left: dotLeft,
                top: dotTop,
                radius: dotW / 2,
                fill: lBefore.backgroundColor,
                selectable: true,
              })
            );
          }
        }

        // I. Workflow Line (.steps::before)
        if (el.classList.contains('steps')) {
          const sBefore = window.getComputedStyle(el, '::before');
          if (sBefore && sBefore.height) {
            const lineH = parseFloat(sBefore.height) || 1.9;
            const lineLeft = relX + rect.width * 0.125;
            const lineWidth = rect.width * 0.75;
            const lineTop = relY + parseFloat(sBefore.top || '0');
            canvas.add(
              new fabric.Rect({
                name: `${pagePrefix}.howItWorks.line`,
                left: lineLeft,
                top: lineTop,
                width: lineWidth,
                height: lineH,
                fill: sBefore.backgroundColor || '#D5E3EF',
                selectable: true,
              })
            );
          }
        }

        // J. Workflow Step Circles (step b)
        if (el.tagName === 'B' && el.parentElement?.classList.contains('step')) {
          canvas.add(
            new fabric.Circle({
              name: `${pagePrefix}.stepCircle.${elIdx}`,
              left: relX,
              top: relY,
              radius: rect.width / 2,
              fill: style.backgroundColor,
              selectable: true,
            })
          );

          const r = document.createRange();
          r.selectNodeContents(el);
          const tRect = r.getClientRects()[0] || rect;

          canvas.add(
            new fabric.Textbox(el.innerText.trim(), {
              name: `${pagePrefix}.stepNum.${elIdx}`,
              left: tRect.left - sLeft,
              top: tRect.top - sTop,
              width: tRect.width + 4,
              fontSize: parseFloat(style.fontSize) || 9.3,
              fontWeight: '700',
              fontFamily: 'Poppins',
              fill: '#ffffff',
              selectable: true,
            })
          );
          continue;
        }

        // K. Product Group Header (.grp)
        if (el.classList.contains('grp')) {
          const rx = parseFloat(style.borderRadius) || 5.3;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.grp.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor,
              rx,
              ry: rx,
              selectable: true,
            })
          );

          const r = document.createRange();
          r.selectNodeContents(el);
          const tRect = r.getClientRects()[0] || rect;

          canvas.add(
            new fabric.Textbox(el.innerText.trim().toUpperCase(), {
              name: `${pagePrefix}.grp.${elIdx}.text`,
              left: tRect.left - sLeft,
              top: tRect.top - sTop,
              width: tRect.width + 4,
              fontSize: parseFloat(style.fontSize) || 9.6,
              fontWeight: '700',
              fontFamily: 'Poppins',
              charSpacing: 40,
              fill: '#ffffff',
              selectable: true,
            })
          );
          continue;
        }

        // L. Logo Images
        if (el.tagName === 'IMG' && el.classList.contains('logo')) {
          const imgObj = new fabric.FabricImage(el);
          imgObj.set({
            name: `${pagePrefix}.logo.${elIdx}`,
            left: relX,
            top: relY,
            scaleX: rect.width / imgObj.width,
            scaleY: rect.height / imgObj.height,
            selectable: true,
          });
          imgObj.src = 'logo.png';
          canvas.add(imgObj);
          continue;
        }

        // M. Text Elements (h1, h2, h3, p, li, dt, dd, .kicker, .foot, .pn, .step)
        const isTextTag = ['H1', 'H2', 'H3', 'P', 'LI', 'DT', 'DD'].includes(el.tagName);
        const isTextClass = ['kicker', 'foot', 'pn'].some((c) => el.classList.contains(c));
        const isStepText = el.classList.contains('step');

        if (isTextTag || isTextClass || isStepText) {
          if (el.tagName === 'LI' && el.querySelector('h1, h2, h3, p')) continue;
          if (el.tagName === 'DIV' && el.querySelector('h1, h2, h3, p')) continue;

          let targetText = el.innerText.trim();
          if (isStepText) {
            const bEl = el.querySelector('b');
            targetText = bEl ? el.innerText.replace(bEl.innerText, '').trim() : el.innerText.trim();
          }

          if (!targetText) continue;

          const fSize = parseFloat(style.fontSize) || 12;
          const fWeight = style.fontWeight || '400';
          const fStyle = style.fontStyle || 'normal';
          const fColor = parseColor(style.color) || '#10243E';
          const lHeight = parseFloat(style.lineHeight) ? parseFloat(style.lineHeight) / (fSize * 1.13) : 1.35;
          const lSpacing = style.letterSpacing && style.letterSpacing !== 'normal' ? (parseFloat(style.letterSpacing) / fSize) * 1000 : 0;
          const tAlign = style.textAlign || 'left';

          const visualLines = extractVisualLines(el);

          let textLeft = relX;
          let textTop = relY;
          let textWidth = rect.width;

          if (isStepText) {
            const bEl = el.querySelector('b');
            if (bEl) {
              const bRect = bEl.getBoundingClientRect();
              textTop = bRect.bottom - sTop + 5;
            }
          }

          // Build exact multiline text with \n and styles per line
          let fullText = '';
          const styles = {};

          if (isStepText) {
            fullText = targetText;
          } else if (visualLines.length > 0) {
            textLeft = visualLines[0].left - sLeft;
            textTop = visualLines[0].top - sTop;

            visualLines.forEach((lg, lIdx) => {
              if (lIdx > 0) fullText += '\n';
              styles[lIdx] = {};
              let lineStr = lg.chars.map((c) => c.char).join('');
              if (style.textTransform === 'uppercase') lineStr = lineStr.toUpperCase();
              fullText += lineStr.trimEnd();

              for (let cIdx = 0; cIdx < lg.chars.length; cIdx++) {
                const c = lg.chars[cIdx];
                if (Object.keys(c.format).length > 0) {
                  styles[lIdx][cIdx] = { ...c.format };
                }
              }
            });
          } else {
            fullText = style.textTransform === 'uppercase' ? targetText.toUpperCase() : targetText;
          }

          const tb = new fabric.Textbox(fullText, {
            name: `${pagePrefix}.text.${elIdx}`,
            left: textLeft,
            top: textTop,
            width: Math.max(textWidth + 8, 20), // slight buffer so explicit \n lines never soft-wrap
            fontSize: fSize,
            fontWeight: fWeight,
            fontStyle: fStyle,
            fontFamily: 'Poppins',
            fill: fColor,
            lineHeight: lHeight,
            charSpacing: lSpacing,
            textAlign: isStepText ? 'center' : tAlign,
            splitByGrapheme: false,
            styles: isStepText ? {} : styles,
            selectable: true,
          });

          canvas.add(tb);
        }
      }

      const pageJson = canvas.toObject(['name', 'selectable', 'evented']);
      // Ensure image sources are clean relative path 'logo.png'
      if (pageJson.objects) {
        pageJson.objects.forEach((obj) => {
          if (obj.type === 'Image' && obj.src && obj.src.includes('logo.png')) {
            obj.src = 'logo.png';
          }
        });
      }

      pagesOutput.push(pageJson);
      cvsEl.remove();
    }

    return pagesOutput;
  });

  console.log(`Fabric pages generated: ${result.length}`);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Saved Fabric JSON to ${outputPath}`);

  await browser.close();
}

main().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
