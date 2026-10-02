import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../templates/source/sample-to-insight.html');
const fabricDistPath = path.resolve(__dirname, '../client/node_modules/fabric/dist/index.min.js');
const templateJsonPath = path.resolve(__dirname, '../templates/sample-to-insight.json');
const reportsDir = path.resolve(__dirname, '../reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function verify() {
  console.log('--- Step 5: Verification ---');
  console.log('Launching Playwright Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security'],
  });

  const page = await browser.newPage({
    viewport: { width: 1123, height: 2200 },
    deviceScaleFactor: 1,
  });

  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addScriptTag({ path: fabricDistPath });

  // 1. Screenshot each HTML sheet
  const sheets = await page.$$('.sheet');
  if (sheets.length < 2) throw new Error('Expected 2 sheets in HTML');

  console.log('Capturing HTML screenshots...');
  for (let i = 0; i < sheets.length; i++) {
    const sRect = await sheets[i].boundingBox();
    await page.screenshot({
      path: path.join(reportsDir, `html-page${i + 1}.png`),
      clip: {
        x: Math.round(sRect.x),
        y: Math.round(sRect.y),
        width: 1123,
        height: 794,
      },
    });
  }

  // 2. Render Fabric canvas for both pages
  console.log('Rendering Fabric canvas for Page 1 and Page 2...');
  const templatePages = JSON.parse(fs.readFileSync(templateJsonPath, 'utf-8'));

  const fabricRenders = await page.evaluate(async (pagesJson) => {
    const { fabric } = window;
    if (fabric.util && fabric.util.clearFabricFontCache) {
      fabric.util.clearFabricFontCache();
    }

    const dataUrls = [];
    for (let i = 0; i < pagesJson.length; i++) {
      const cvsEl = document.createElement('canvas');
      cvsEl.width = 1123;
      cvsEl.height = 794;
      document.body.appendChild(cvsEl);

      const canvas = new fabric.Canvas(cvsEl, {
        width: 1123,
        height: 794,
        backgroundColor: '#ffffff',
      });

      await canvas.loadFromJSON(pagesJson[i]);
      canvas.renderAll();

      dataUrls.push(cvsEl.toDataURL('image/png'));
      cvsEl.remove();
    }
    return dataUrls;
  }, templatePages);

  // Save fabric images
  fs.writeFileSync(path.join(reportsDir, 'fabric-page1.png'), Buffer.from(fabricRenders[0].split(',')[1], 'base64'));
  fs.writeFileSync(path.join(reportsDir, 'fabric-page2.png'), Buffer.from(fabricRenders[1].split(',')[1], 'base64'));

  // 3. String assertions
  console.log('Asserting text strings and single-line cont. heading...');
  let foundContHeading = false;
  let contHeadingOnOneLine = false;

  for (const pageJson of templatePages) {
    for (const obj of pageJson.objects) {
      if (obj.text && obj.text.includes('Sequencing Services (cont.)')) {
        foundContHeading = true;
        if (!obj.text.includes('\n')) {
          contHeadingOnOneLine = true;
        }
      }
    }
  }

  if (!foundContHeading) {
    throw new Error('FAILED assertion: "Sequencing Services (cont.)" not found in template JSON');
  }
  if (!contHeadingOnOneLine) {
    throw new Error('FAILED assertion: "Sequencing Services (cont.)" wrapped onto multiple lines');
  }
  console.log('✅ Assertion PASSED: "Sequencing Services (cont.)" renders on one line');

  // 4. Bounding box difference check
  console.log('Measuring text bounding box offsets against DOM...');
  const textOffsets = await page.evaluate((pagesJson) => {
    const textSelectors = 'h1, h2, h3, p, li, dt, dd, .kicker, .step, .pill, .grp, .num, .dot, .pn, .foot';
    const sheets = Array.from(document.querySelectorAll('.sheet'));
    const offsets = [];

    function getTextRect(el) {
      let targetNode = null;
      function walk(n) {
        if (targetNode) return;
        if (n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0) {
          targetNode = n;
          return;
        }
        for (const child of n.childNodes) walk(child);
      }
      walk(el);
      if (targetNode) {
        const r = document.createRange();
        r.selectNode(targetNode);
        const rects = r.getClientRects();
        if (rects.length > 0) return rects[0];
      }
      return el.getBoundingClientRect();
    }

    for (let pIdx = 0; pIdx < sheets.length; pIdx++) {
      const sheet = sheets[pIdx];
      const sRect = sheet.getBoundingClientRect();
      const pageObjs = pagesJson[pIdx].objects.filter((o) => o.type === 'Textbox' || o.type === 'Text');

      for (const obj of pageObjs) {
        if (!obj.name) continue;
        const candidates = Array.from(sheet.querySelectorAll(textSelectors)).filter((el) => {
          const t1 = el.innerText.trim().slice(0, 15).toUpperCase();
          const t2 = obj.text.trim().slice(0, 15).toUpperCase();
          return t1 === t2;
        });

        if (candidates.length > 0) {
          let best = candidates[0];
          let bestDist = Infinity;
          for (const cand of candidates) {
            const m = cand.getBoundingClientRect();
            const d = Math.hypot((m.left - sRect.left) - obj.left, (m.top - sRect.top) - obj.top);
            if (d < bestDist) {
              bestDist = d;
              best = cand;
            }
          }
          const tRect = getTextRect(best);
          const domLeft = tRect.left - sRect.left;
          const domTop = tRect.top - sRect.top;
          const diffX = Math.abs(obj.left - domLeft);
          const diffY = Math.abs(obj.top - domTop);
          offsets.push({
            name: obj.name,
            text: obj.text.slice(0, 25).replace(/\n/g, ' '),
            diffX,
            diffY,
            offset: Math.max(diffX, diffY),
          });
        }
      }
    }
    return offsets;
  }, templatePages);

  let worstOffset = 0;
  let worstObj = null;
  for (const o of textOffsets) {
    if (o.offset > worstOffset) {
      worstOffset = o.offset;
      worstObj = o;
    }
  }

  console.log(`Worst text bounding box offset: ${worstOffset.toFixed(2)} px (${worstObj?.name}: "${worstObj?.text}")`);

  await browser.close();

  // 5. Run Python pixel diff & report generation
  console.log('Running pixel diff analysis with Python...');
  const pyScript = `
import sys
from PIL import Image, ImageChops, ImageFilter

def compare(page_num):
    html_img = Image.open(f'reports/html-page{page_num}.png').convert('RGB')
    fabric_img = Image.open(f'reports/fabric-page{page_num}.png').convert('RGB')
    
    # Ensure same size
    if html_img.size != fabric_img.size:
        fabric_img = fabric_img.resize(html_img.size)
        
    diff = ImageChops.difference(html_img, fabric_img)
    diff.save(f'reports/diff-page{page_num}.png')
    
    # Create side-by-side
    w, h = html_img.size
    side = Image.new('RGB', (w * 2 + 10, h), (220, 220, 220))
    side.paste(html_img, (0, 0))
    side.paste(fabric_img, (w + 10, 0))
    side.save(f'reports/comparison-page{page_num}.png')
    
    # Count pixels that differ structurally (anti-aliasing tolerance via MinFilter)
    mask = diff.convert('L').point(lambda p: 255 if p > 30 else 0)
    eroded = mask.filter(ImageFilter.MinFilter(3))
    
    total_pixels = w * h
    diff_pixels = sum(1 for p in eroded.getdata() if p > 0)
    pct = (diff_pixels / total_pixels) * 100
    print(f'PAGE_{page_num}_DIFF: {pct:.2f}% ({diff_pixels}/{total_pixels} differing pixels)')
    return pct

p1_diff = compare(1)
p2_diff = compare(2)
`;

  const pyOutput = execSync(`python3 -c "${pyScript.replace(/"/g, '\\"')}"`, { encoding: 'utf-8' });
  console.log(pyOutput.trim());

  return {
    worstOffset,
    worstObj,
  };
}

verify().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
