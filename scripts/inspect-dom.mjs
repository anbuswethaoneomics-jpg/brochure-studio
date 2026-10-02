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

  const sheetsInfo = await page.evaluate(() => {
    const sheets = document.querySelectorAll('.sheet');
    return Array.from(sheets).map((s, idx) => {
      const rect = s.getBoundingClientRect();
      const style = window.getComputedStyle(s);
      return {
        idx,
        className: s.className,
        width: rect.width,
        height: rect.height,
        left: rect.left,
        top: rect.top,
        bg: style.backgroundColor,
      };
    });
  });

  console.log('Sheets info:', sheetsInfo);
  await browser.close();
}

main().catch(console.error);
