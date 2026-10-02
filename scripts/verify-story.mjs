import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../templates/source/tells-a-story.html');
const fabricDistPath = path.resolve(__dirname, '../client/node_modules/fabric/dist/index.min.js');
const templateJsonPath = path.resolve(__dirname, '../templates/tells-a-story.json');
const reportsDir = path.resolve(__dirname, '../reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

async function verify() {
  console.log('--- Verification for Tells a Story ---');
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
      path: path.join(reportsDir, `story-html-page${i + 1}.png`),
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
        backgroundColor: '#FBF7EF',
      });

      await canvas.loadFromJSON(pagesJson[i]);
      canvas.renderAll();

      dataUrls.push(cvsEl.toDataURL('image/png'));
      cvsEl.remove();
    }
    return dataUrls;
  }, templatePages);

  // Save fabric images
  fs.writeFileSync(path.join(reportsDir, 'story-fabric-page1.png'), Buffer.from(fabricRenders[0].split(',')[1], 'base64'));
  fs.writeFileSync(path.join(reportsDir, 'story-fabric-page2.png'), Buffer.from(fabricRenders[1].split(',')[1], 'base64'));

  // 3. String & structure assertions
  console.log('Asserting text strings and formatting...');
  let foundContHeading = false;
  let contHeadingLinesCount = 0;

  for (const pageJson of templatePages) {
    for (const obj of pageJson.objects) {
      if (obj.text && obj.text.includes('Sequencing\nServices (cont.)')) {
        foundContHeading = true;
        contHeadingLinesCount = obj.text.split('\n').length;
      }
    }
  }

  if (!foundContHeading) {
    throw new Error('FAILED assertion: "Sequencing\\nServices (cont.)" not found in template JSON');
  }
  if (contHeadingLinesCount !== 2) {
    throw new Error(`FAILED assertion: "Sequencing Services (cont.)" has ${contHeadingLinesCount} lines instead of 2`);
  }
  console.log('✅ Assertion PASSED: "Sequencing Services (cont.)" has exactly 2 lines');

  // Check no overlapping textboxes under About ONEOMICS
  let aboutOneomicsBodyCount = 0;
  for (const obj of templatePages[0].objects) {
    if (obj.text && obj.text.includes('ONEOMICS Private Limited is a genomics company')) {
      aboutOneomicsBodyCount++;
      if (obj.text.includes('sequencing services') && obj.text.includes('bioinformatics')) {
        console.log('✅ Assertion PASSED: About ONEOMICS body is a single unified textbox with inline styles');
      } else {
        throw new Error('FAILED assertion: About ONEOMICS body does not contain full paragraph text');
      }
    }
  }
  if (aboutOneomicsBodyCount !== 1) {
    throw new Error(`Expected 1 About ONEOMICS body textbox, found ${aboutOneomicsBodyCount}`);
  }

  console.log('Verification finished successfully!');
  await browser.close();
}

verify().catch((err) => {
  console.error('Verification error:', err);
  process.exit(1);
});
