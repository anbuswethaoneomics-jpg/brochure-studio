import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../templates/source/tells-a-story.html');
const fabricDistPath = path.resolve(__dirname, '../client/node_modules/fabric/dist/index.min.js');
const outputPath = path.resolve(__dirname, '../templates/tells-a-story.json');

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

    function getFontFamily(style) {
      const family = style.fontFamily || '';
      if (family.includes('Caladea')) return 'Caladea, Cambria, Georgia, serif';
      if (family.includes('Carlito')) return 'Carlito, Calibri, "Segoe UI", Helvetica, Arial, sans-serif';
      return family.split(',')[0].replace(/['"]/g, '').trim() || 'Carlito, sans-serif';
    }

    // Extract exact visual lines and formatting using Range
    function extractVisualLines(el) {
      const parentStyle = window.getComputedStyle(el);
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
          const cStyle = window.getComputedStyle(node);
          if (cStyle.fontWeight !== parentStyle.fontWeight) fmt.fontWeight = cStyle.fontWeight;
          if (cStyle.fontStyle !== parentStyle.fontStyle) fmt.fontStyle = cStyle.fontStyle;
          if (cStyle.color !== parentStyle.color) fmt.fill = cStyle.color;
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
        backgroundColor: '#FBF7EF',
      });

      const panels = Array.from(sheet.querySelectorAll('.panel'));

      // 1. Panel Backgrounds (like mint-bg)
      for (let pIdx = 0; pIdx < panels.length; pIdx++) {
        const panel = panels[pIdx];
        const pRect = panel.getBoundingClientRect();
        const pStyle = window.getComputedStyle(panel);
        const panelName = `${pagePrefix}.panel${pIdx + 1}`;

        const pBg = parseColor(pStyle.backgroundColor);
        if (pBg && pBg !== 'rgb(251, 247, 239)' && pBg !== 'rgba(0, 0, 0, 0)') {
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
      }

      // 2. SVGs: Front cover arch & ICO icons
      const svgs = Array.from(sheet.querySelectorAll('svg'));
      for (let svgIdx = 0; svgIdx < svgs.length; svgIdx++) {
        const svgEl = svgs[svgIdx];
        const rect = svgEl.getBoundingClientRect();
        const svgString = new XMLSerializer().serializeToString(svgEl);
        const { objects, options } = await fabric.loadSVGFromString(svgString);

        if (objects && objects.length) {
          objects.forEach((obj) => {
            if (!obj.fill || obj.fill === 'none' || obj.fill === '') obj.fill = null;
          });
          const svgGroup = fabric.util.groupSVGElements(objects, options);
          const viewBoxW = options.viewBoxWidth || options.width || rect.width;
          const viewBoxH = options.viewBoxHeight || options.height || rect.height;
          const sx = rect.width / viewBoxW;
          const sy = rect.height / viewBoxH;

          const isArch = svgEl.classList.contains('arch');
          svgGroup.set({
            name: `${pagePrefix}.svg.${isArch ? 'arch' : 'ico'}.${svgIdx}`,
            left: (rect.left - sLeft) + svgGroup.left * sx,
            top: (rect.top - sTop) + svgGroup.top * sy,
            scaleX: sx,
            scaleY: sy,
            selectable: true,
          });
          canvas.add(svgGroup);
        }
      }

      // 3. Process remaining elements in sheet DOM order
      const domElements = Array.from(sheet.querySelectorAll('*'));

      for (let elIdx = 0; elIdx < domElements.length; elIdx++) {
        const el = domElements[elIdx];
        if (el.classList.contains('sheet') || el.classList.contains('panel')) continue;
        if (el.tagName === 'SVG' || el.closest('svg')) continue;

        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const relX = rect.left - sLeft;
        const relY = rect.top - sTop;

        // A. Card Box (.card)
        if (el.classList.contains('card')) {
          const rx = parseFloat(style.borderRadius) || 10.58;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.card.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#ffffff',
              stroke: style.borderColor || '#E4DDCF',
              strokeWidth: parseFloat(style.borderWidth) || 0.8,
              rx,
              ry: rx,
              selectable: true,
            })
          );
          continue;
        }

        // B. Stat Box (.stat in flap)
        if (el.classList.contains('stat')) {
          const rx = parseFloat(style.borderRadius) || 9.45;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.stat.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#ffffff',
              stroke: style.borderColor || '#E4DDCF',
              strokeWidth: parseFloat(style.borderWidth) || 0.8,
              rx,
              ry: rx,
              selectable: true,
            })
          );
          continue;
        }

        // C. Talk Box (.talk in back cover)
        if (el.classList.contains('talk')) {
          const rx = parseFloat(style.borderRadius) || 15.12;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.talk.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#E7F1F1',
              rx,
              ry: rx,
              selectable: true,
            })
          );
          continue;
        }

        // D. Custom Box (.custom in inside panel 2)
        if (el.classList.contains('custom')) {
          const rx = parseFloat(style.borderRadius) || 13.23;
          canvas.add(
            new fabric.Rect({
              name: `${pagePrefix}.custom.${elIdx}.box`,
              left: relX,
              top: relY,
              width: rect.width,
              height: rect.height,
              fill: style.backgroundColor || '#E7F1F1',
              rx,
              ry: rx,
              selectable: true,
            })
          );
          continue;
        }

        // E. Rule Line & Dot (.rule & .rule::after)
        if (el.classList.contains('rule')) {
          // Line
          canvas.add(
            new fabric.Line([relX, relY, relX + rect.width, relY], {
              name: `${pagePrefix}.rule.${elIdx}.line`,
              stroke: style.borderTopColor || '#E2574C',
              strokeWidth: parseFloat(style.borderTopWidth) || 1.87,
              selectable: true,
            })
          );

          // Dot (.rule::after)
          const rAfter = window.getComputedStyle(el, '::after');
          if (rAfter && rAfter.content && rAfter.content !== 'none') {
            const dotW = parseFloat(rAfter.width) || 6.8;
            const dotLeft = relX + parseFloat(rAfter.left || '45.7');
            const dotTop = relY + parseFloat(rAfter.top || '-3.4');
            canvas.add(
              new fabric.Circle({
                name: `${pagePrefix}.rule.${elIdx}.dot`,
                left: dotLeft,
                top: dotTop,
                radius: dotW / 2,
                fill: rAfter.backgroundColor || '#E2574C',
                selectable: true,
              })
            );
          }
          continue;
        }

        // F. Mod Top Border (.mod in back cover)
        if (el.classList.contains('mod')) {
          canvas.add(
            new fabric.Line([relX, relY, relX + rect.width, relY], {
              name: `${pagePrefix}.mod.${elIdx}.borderTop`,
              stroke: style.borderTopColor || '#E4DDCF',
              strokeWidth: parseFloat(style.borderTopWidth) || 0.8,
              selectable: true,
            })
          );
          continue;
        }

        // G. Product Group Line & Dot (.grp .gline, .grp .gdot)
        if (el.classList.contains('gline')) {
          canvas.add(
            new fabric.Line([relX, relY, relX + rect.width, relY], {
              name: `${pagePrefix}.gline.${elIdx}`,
              stroke: style.borderTopColor || '#BFDDE1',
              strokeWidth: parseFloat(style.borderTopWidth) || 0.93,
              selectable: true,
            })
          );
          continue;
        }

        if (el.classList.contains('gdot')) {
          canvas.add(
            new fabric.Circle({
              name: `${pagePrefix}.gdot.${elIdx}`,
              left: relX,
              top: relY,
              radius: rect.width / 2,
              fill: style.backgroundColor || '#E2574C',
              selectable: true,
            })
          );
          continue;
        }

        // H. Legend Colored Dots (.legend i)
        if (el.tagName === 'I' && el.parentElement?.parentElement?.classList.contains('legend')) {
          canvas.add(
            new fabric.Circle({
              name: `${pagePrefix}.legendDot.${elIdx}`,
              left: relX,
              top: relY,
              radius: rect.width / 2,
              fill: style.backgroundColor,
              selectable: true,
            })
          );
          continue;
        }

        // I. Footer Dots (.dots i)
        if (el.tagName === 'I' && el.parentElement?.classList.contains('dots')) {
          canvas.add(
            new fabric.Circle({
              name: `${pagePrefix}.footerDot.${elIdx}`,
              left: relX,
              top: relY,
              radius: rect.width / 2,
              fill: style.backgroundColor,
              selectable: true,
            })
          );
          continue;
        }

        // J. Logo Images
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

        // K. Text Elements (h1, h2, h3, p, .kicker, .foot, .pn, .big, .subs, dt, dd, etc.)
        const isTextTag = ['H1', 'H2', 'H3', 'P', 'DT', 'DD'].includes(el.tagName);
        const isTextClass = ['kicker', 'foot', 'pn', 'big', 'n'].some((c) => el.classList.contains(c));
        const isStatSpan = el.tagName === 'SPAN' && el.parentElement?.classList.contains('stat');
        const isStatB = el.tagName === 'B' && el.parentElement?.classList.contains('stat');
        const isGrpSpan = el.tagName === 'SPAN' && el.parentElement?.classList.contains('grp');
        const isLegendSpan = el.tagName === 'SPAN' && el.parentElement?.classList.contains('legend');
        const isFooterSpan = el.tagName === 'SPAN' && el.parentElement?.classList.contains('footer') && !el.classList.contains('dots');
        const isProdB = el.tagName === 'B' && el.parentElement?.parentElement?.classList.contains('prod');

        if (isTextTag || isTextClass || isStatSpan || isStatB || isGrpSpan || isLegendSpan || isFooterSpan || isProdB) {
          // Skip if parent container will be processed or if container has children that are separate text blocks
          if (el.tagName === 'DIV' && el.querySelector('h1, h2, h3, p, dt, dd')) continue;
          if (el.classList.contains('prod') || el.classList.contains('stat') || el.classList.contains('grp') || el.classList.contains('legend')) continue;

          let targetText = el.innerText.trim();
          if (isLegendSpan) {
            const iEl = el.querySelector('i');
            if (iEl) targetText = el.innerText.replace(iEl.innerText, '').trim();
          }

          if (!targetText) continue;

          const fSize = parseFloat(style.fontSize) || 12;
          const fWeight = style.fontWeight || '400';
          const fStyle = style.fontStyle || 'normal';
          const fColor = parseColor(style.color) || '#34454F';
          const fFamily = getFontFamily(style);
          const lHeight = parseFloat(style.lineHeight) ? parseFloat(style.lineHeight) / (fSize * 1.15) : 1.3;
          const lSpacing = style.letterSpacing && style.letterSpacing !== 'normal' ? (parseFloat(style.letterSpacing) / fSize) * 1000 : 0;
          const tAlign = style.textAlign || 'left';

          const visualLines = extractVisualLines(el);

          let textLeft = relX;
          let textTop = relY;
          let textWidth = rect.width;

          // Build exact multiline text with \n and styles per line
          let fullText = '';
          const styles = {};

          if (visualLines.length > 0) {
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
            width: Math.max(textWidth + 10, 20), // buffer so explicit \n lines never soft-wrap
            fontSize: fSize,
            fontWeight: fWeight,
            fontStyle: fStyle,
            fontFamily: fFamily,
            fill: fColor,
            lineHeight: lHeight,
            charSpacing: lSpacing,
            textAlign: tAlign,
            splitByGrapheme: false,
            styles: styles,
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
