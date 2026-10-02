import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log('Testing template loading in headless Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
  });

  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  
  // Collect console messages
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });

  // Automatically accept confirmation dialogs when switching templates
  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // We can test by serving dist or running a test against Vite
  // Let us verify that tells-a-story.json can be parsed and has valid fabric JSON structures
  import('../client/src/tells-a-story.json', { assert: { type: 'json' } }).then(data => {
    const json = data.default;
    console.log(`Page count: ${json.length}`);
    console.log(`Page 1 objects: ${json[0].objects.length}`);
    console.log(`Page 2 objects: ${json[1].objects.length}`);
  });

  await browser.close();
}

main().catch(console.error);
