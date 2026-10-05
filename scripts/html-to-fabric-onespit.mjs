import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, '../templates/source/onespit-flyer.html');
const fabricDistPath = path.resolve(__dirname, '../client/node_modules/fabric/dist/index.min.js');
const outputPath = path.resolve(__dirname, '../client/src/onespit-flyer.json');
const previewPath = path.resolve(__dirname, '../client/public/assets/previews/onespit_flyer.png');

async function main() {
  console.log('Launching Chromium...');
  const browser = await chromium.launch({
    executablePath: '/usr/bin/google-chrome',
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security'],
  });

  const page = await browser.newPage({
    viewport: { width: 794, height: 1123 },
    deviceScaleFactor: 2,
  });

  console.log(`Loading HTML from: ${htmlPath}`);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1000);

  // Take screenshot for preview
  const pageEl = await page.$('.page');
  if (pageEl) {
    console.log(`Saving preview to: ${previewPath}`);
    await pageEl.screenshot({ path: previewPath });
    // Also copy to client/dist if exists
    const distPreviewDir = path.resolve(__dirname, '../client/dist/assets/previews');
    if (fs.existsSync(distPreviewDir)) {
      fs.copyFileSync(previewPath, path.join(distPreviewDir, 'onespit_flyer.png'));
    }
  }

  console.log('Injecting Fabric.js...');
  await page.addScriptTag({ path: fabricDistPath });

  console.log('Measuring DOM and generating Fabric canvas JSON...');
  const result = await page.evaluate(async () => {
    const { fabric } = window;
    if (!fabric) throw new Error('Fabric not loaded');

    if (fabric.util && fabric.util.clearFabricFontCache) {
      fabric.util.clearFabricFontCache();
    }

    const pageSection = document.querySelector('.page');
    const pRect = pageSection.getBoundingClientRect();
    const sLeft = pRect.left;
    const sTop = pRect.top;

    const cvsEl = document.createElement('canvas');
    cvsEl.width = 794;
    cvsEl.height = 1123;
    document.body.appendChild(cvsEl);

    const canvas = new fabric.StaticCanvas(cvsEl, {
      width: 794,
      height: 1123,
      backgroundColor: '#ffffff',
    });

    // Background rect
    canvas.add(
      new fabric.Rect({
        name: 'page.bg',
        left: 0,
        top: 0,
        width: 794,
        height: 1123,
        fill: '#ffffff',
        selectable: false,
        evented: false,
      })
    );

    // 1. Top Logo Image
    const logoImg = pageSection.querySelector('.top img');
    if (logoImg) {
      const lRect = logoImg.getBoundingClientRect();
      const imgObj = await new Promise((resolve) => {
        fabric.Image.fromURL('/assets/oneomics_logo.png', (img) => {
          if (!img || !img.width) {
            // fallback
            resolve(null);
            return;
          }
          const scale = lRect.width / img.width;
          img.set({
            name: 'header.logo',
            left: lRect.left - sLeft,
            top: lRect.top - sTop,
            scaleX: scale,
            scaleY: scale,
            selectable: true,
          });
          resolve(img);
        });
      });
      if (imgObj) canvas.add(imgObj);
    }

    // 2. Kicker
    const kickerEl = pageSection.querySelector('.kicker');
    if (kickerEl) {
      const kRect = kickerEl.getBoundingClientRect();
      const kStyle = window.getComputedStyle(kickerEl);
      canvas.add(
        new fabric.Textbox(kickerEl.textContent.trim(), {
          name: 'header.kicker',
          left: kRect.left - sLeft,
          top: kRect.top - sTop,
          width: kRect.width + 10,
          fontSize: parseFloat(kStyle.fontSize) || 12,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '500',
          fill: '#6B7A8F',
          textAlign: 'right',
          selectable: true,
        })
      );
    }

    // 3. Hero Card Background
    const heroEl = pageSection.querySelector('.hero');
    const hRect = heroEl.getBoundingClientRect();
    const hStyle = window.getComputedStyle(heroEl);
    canvas.add(
      new fabric.Rect({
        name: 'hero.card',
        left: hRect.left - sLeft,
        top: hRect.top - sTop,
        width: hRect.width,
        height: hRect.height,
        fill: '#F3F8FC',
        rx: 23,
        ry: 23,
        selectable: true,
      })
    );

    // 4. Hero SVGs: Helix and Kit
    const svgs = Array.from(heroEl.querySelectorAll('svg'));
    for (let i = 0; i < svgs.length; i++) {
      const svgEl = svgs[i];
      const sRectEl = svgEl.getBoundingClientRect();
      const svgString = new XMLSerializer().serializeToString(svgEl);
      try {
        const { objects, options } = await fabric.loadSVGFromString(svgString);
        if (objects && objects.length) {
          const svgGroup = fabric.util.groupSVGElements(objects, options);
          const viewBoxW = options.viewBoxWidth || options.width || sRectEl.width;
          const viewBoxH = options.viewBoxHeight || options.height || sRectEl.height;
          const sx = sRectEl.width / viewBoxW;
          const sy = sRectEl.height / viewBoxH;

          svgGroup.set({
            name: svgEl.classList.contains('helix') ? 'hero.helix' : 'hero.kit',
            left: sRectEl.left - sLeft + (svgGroup.left || 0) * sx,
            top: sRectEl.top - sTop + (svgGroup.top || 0) * sy,
            scaleX: sx,
            scaleY: sy,
            selectable: true,
          });
          canvas.add(svgGroup);
        }
      } catch (err) {
        console.warn('SVG load failed:', err);
      }
    }

    // 5. Hero Pill (Collect & Stabilize)
    const pillEl = pageSection.querySelector('.pill');
    if (pillEl) {
      const pillRect = pillEl.getBoundingClientRect();
      // pill background
      canvas.add(
        new fabric.Rect({
          name: 'hero.pill.bg',
          left: pillRect.left - sLeft,
          top: pillRect.top - sTop,
          width: pillRect.width,
          height: pillRect.height,
          fill: '#ffffff',
          stroke: '#E23B32',
          strokeWidth: 1.3,
          rx: 99,
          ry: 99,
          selectable: true,
        })
      );
      // pill dot
      const dotEl = pillEl.querySelector('i');
      if (dotEl) {
        const dRect = dotEl.getBoundingClientRect();
        canvas.add(
          new fabric.Circle({
            name: 'hero.pill.dot',
            left: dRect.left - sLeft,
            top: dRect.top - sTop,
            radius: dRect.width / 2,
            fill: '#E23B32',
            selectable: true,
          })
        );
      }
      // pill text
      canvas.add(
        new fabric.Textbox('COLLECT & STABILIZE', {
          name: 'hero.pill.text',
          left: pillRect.left - sLeft + 22,
          top: pillRect.top - sTop + 4.5,
          width: pillRect.width,
          fontSize: 12,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '600',
          fill: '#10243E',
          selectable: true,
        })
      );
    }

    // 6. Hero Title: ONESpit™
    const h1El = heroEl.querySelector('h1');
    if (h1El) {
      const h1Rect = h1El.getBoundingClientRect();
      canvas.add(
        new fabric.Textbox('ONESpit™', {
          name: 'hero.title',
          left: h1Rect.left - sLeft,
          top: h1Rect.top - sTop,
          width: 380,
          fontSize: 50,
          lineHeight: 1.1,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '700',
          fill: '#10243E',
          selectable: true,
        })
      );
    }

    // 7. Hero Subtitle
    const subEl = heroEl.querySelector('.sub');
    if (subEl) {
      const subRect = subEl.getBoundingClientRect();
      canvas.add(
        new fabric.Textbox('Zero-Prep Saliva Collection & Preservation Kit', {
          name: 'hero.subtitle',
          left: subRect.left - sLeft,
          top: subRect.top - sTop,
          width: 440,
          fontSize: 19,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '600',
          fill: '#E23B32',
          selectable: true,
        })
      );
    }

    // 8. Hero Tribar (3-color stripe)
    const tribarEl = heroEl.querySelector('.tribar');
    if (tribarEl) {
      const tRect = tribarEl.getBoundingClientRect();
      const segW = tRect.width / 3;
      canvas.add(
        new fabric.Rect({
          name: 'hero.tribar.red',
          left: tRect.left - sLeft,
          top: tRect.top - sTop,
          width: segW,
          height: tRect.height,
          fill: '#E23B32',
          selectable: true,
        })
      );
      canvas.add(
        new fabric.Rect({
          name: 'hero.tribar.blue',
          left: tRect.left - sLeft + segW,
          top: tRect.top - sTop,
          width: segW,
          height: tRect.height,
          fill: '#0793EB',
          selectable: true,
        })
      );
      canvas.add(
        new fabric.Rect({
          name: 'hero.tribar.green',
          left: tRect.left - sLeft + segW * 2,
          top: tRect.top - sTop,
          width: segW,
          height: tRect.height,
          fill: '#33A015',
          selectable: true,
        })
      );
    }

    // 9. Hero Tagline
    const tagEl = heroEl.querySelector('.tag');
    if (tagEl) {
      const tagRect = tagEl.getBoundingClientRect();
      canvas.add(
        new fabric.Textbox('Non-invasive saliva collection with zero sample preparation.', {
          name: 'hero.tagline',
          left: tagRect.left - sLeft,
          top: tagRect.top - sTop,
          width: tagRect.width + 20,
          fontSize: 15.5,
          fontFamily: 'Poppins, sans-serif',
          fill: '#2B3A4F',
          selectable: true,
        })
      );
    }

    // 10. Applications Card Box (.apps)
    const appsEl = pageSection.querySelector('.apps');
    if (appsEl) {
      const aRect = appsEl.getBoundingClientRect();
      canvas.add(
        new fabric.Rect({
          name: 'apps.card',
          left: aRect.left - sLeft,
          top: aRect.top - sTop,
          width: aRect.width,
          height: aRect.height,
          fill: '#F3F8FC',
          rx: 15,
          ry: 15,
          selectable: true,
        })
      );
    }

    // 11. Section Headings (h2 with indicator bars)
    const h2s = Array.from(pageSection.querySelectorAll('h2'));
    for (let i = 0; i < h2s.length; i++) {
      const h2 = h2s[i];
      const rect = h2.getBoundingClientRect();
      const titleText = h2.textContent.trim();

      // indicator bar (before) unless inside .res where display is none
      if (!h2.closest('.res')) {
        canvas.add(
          new fabric.Rect({
            name: `h2.${i}.bar`,
            left: rect.left - sLeft,
            top: rect.top - sTop + 3,
            width: 6,
            height: 18,
            fill: '#E23B32',
            rx: 3,
            ry: 3,
            selectable: true,
          })
        );
      }

      canvas.add(
        new fabric.Textbox(titleText, {
          name: `h2.${i}.title`,
          left: rect.left - sLeft + (h2.closest('.res') ? 0 : 14),
          top: rect.top - sTop,
          width: rect.width + 50,
          fontSize: 18.5,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '700',
          fill: '#10243E',
          selectable: true,
        })
      );
    }

    // 12. Overview Bullets (.dots li)
    const dots = Array.from(pageSection.querySelectorAll('.dots li'));
    for (let i = 0; i < dots.length; i++) {
      const li = dots[i];
      const rect = li.getBoundingClientRect();
      // bullet dot
      canvas.add(
        new fabric.Circle({
          name: `overview.dot.${i}`,
          left: rect.left - sLeft + 1,
          top: rect.top - sTop + 8,
          radius: 3,
          fill: '#E23B32',
          selectable: true,
        })
      );
      // bullet text
      canvas.add(
        new fabric.Textbox(li.textContent.trim(), {
          name: `overview.text.${i}`,
          left: rect.left - sLeft + 16,
          top: rect.top - sTop,
          width: rect.width - 16,
          fontSize: 15.5,
          lineHeight: 1.5,
          fontFamily: 'Poppins, sans-serif',
          fill: '#2B3A4F',
          selectable: true,
        })
      );
    }

    // 13. Applications Bullets (.sq li)
    const sqs = Array.from(pageSection.querySelectorAll('.sq li'));
    for (let i = 0; i < sqs.length; i++) {
      const li = sqs[i];
      const rect = li.getBoundingClientRect();
      // square bullet
      canvas.add(
        new fabric.Rect({
          name: `apps.sq.${i}`,
          left: rect.left - sLeft,
          top: rect.top - sTop + 7,
          width: 6,
          height: 6,
          fill: '#E23B32',
          rx: 1.5,
          ry: 1.5,
          selectable: true,
        })
      );
      // text
      canvas.add(
        new fabric.Textbox(li.textContent.trim(), {
          name: `apps.text.${i}`,
          left: rect.left - sLeft + 16,
          top: rect.top - sTop,
          width: rect.width - 16,
          fontSize: 14.5,
          lineHeight: 1.42,
          fontFamily: 'Poppins, sans-serif',
          fill: '#2B3A4F',
          selectable: true,
        })
      );
    }

    // 14. Key Benefits Ticks (.ticks li)
    const ticks = Array.from(pageSection.querySelectorAll('.ticks li'));
    for (let i = 0; i < ticks.length; i++) {
      const li = ticks[i];
      const rect = li.getBoundingClientRect();
      // tick circle background
      canvas.add(
        new fabric.Circle({
          name: `benefit.circle.${i}`,
          left: rect.left - sLeft,
          top: rect.top - sTop + 2,
          radius: 7.5,
          fill: '#E23B32',
          selectable: true,
        })
      );
      // checkmark symbol
      canvas.add(
        new fabric.Textbox('✓', {
          name: `benefit.check.${i}`,
          left: rect.left - sLeft + 2.5,
          top: rect.top - sTop + 2,
          width: 15,
          fontSize: 10,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: '700',
          fill: '#ffffff',
          textAlign: 'center',
          selectable: true,
        })
      );
      // text
      canvas.add(
        new fabric.Textbox(li.textContent.trim(), {
          name: `benefit.text.${i}`,
          left: rect.left - sLeft + 24,
          top: rect.top - sTop,
          width: rect.width - 24,
          fontSize: 15.2,
          fontFamily: 'Poppins, sans-serif',
          fill: '#2B3A4F',
          selectable: true,
        })
      );
    }

    // 15. Simple Workflow: Horizontal Line and Steps
    const stepsContainer = pageSection.querySelector('.steps');
    if (stepsContainer) {
      const scRect = stepsContainer.getBoundingClientRect();
      // connecting grey line
      canvas.add(
        new fabric.Rect({
          name: 'workflow.line',
          left: scRect.left - sLeft + 15,
          top: scRect.top - sTop + 14,
          width: scRect.width - 30,
          height: 2,
          fill: '#D5E3EF',
          selectable: true,
        })
      );

      const steps = Array.from(stepsContainer.querySelectorAll('.step'));
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const sRect = step.getBoundingClientRect();
        const bEl = step.querySelector('b');
        const pEl = step.querySelector('p');

        if (bEl) {
          const bRect = bEl.getBoundingClientRect();
          // circle badge
          canvas.add(
            new fabric.Circle({
              name: `workflow.step.circle.${i}`,
              left: bRect.left - sLeft,
              top: bRect.top - sTop,
              radius: 15,
              fill: '#E23B32',
              selectable: true,
            })
          );
          // circle number
          canvas.add(
            new fabric.Textbox(String(i + 1), {
              name: `workflow.step.num.${i}`,
              left: bRect.left - sLeft,
              top: bRect.top - sTop + 5.5,
              width: 30,
              fontSize: 14,
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '700',
              fill: '#ffffff',
              textAlign: 'center',
              selectable: true,
            })
          );
        }

        if (pEl) {
          const pRect = pEl.getBoundingClientRect();
          canvas.add(
            new fabric.Textbox(pEl.textContent.trim(), {
              name: `workflow.step.desc.${i}`,
              left: pRect.left - sLeft,
              top: pRect.top - sTop,
              width: pRect.width,
              fontSize: 13.5,
              lineHeight: 1.4,
              fontFamily: 'Poppins, sans-serif',
              fill: '#2B3A4F',
              selectable: true,
            })
          );
        }
      }
    }

    // 16. Expected Results Card (.res)
    const resEl = pageSection.querySelector('.res');
    if (resEl) {
      const resRect = resEl.getBoundingClientRect();
      // card bg
      canvas.add(
        new fabric.Rect({
          name: 'results.card.bg',
          left: resRect.left - sLeft,
          top: resRect.top - sTop,
          width: resRect.width,
          height: resRect.height,
          fill: '#F3F8FC',
          rx: 15,
          ry: 15,
          selectable: true,
        })
      );
      // red left accent bar
      canvas.add(
        new fabric.Rect({
          name: 'results.card.leftBar',
          left: resRect.left - sLeft,
          top: resRect.top - sTop,
          width: 6,
          height: resRect.height,
          fill: '#E23B32',
          rx: 3,
          ry: 3,
          selectable: true,
        })
      );

      // Result bullet items (.cols li)
      const resLis = Array.from(resEl.querySelectorAll('.cols li'));
      for (let i = 0; i < resLis.length; i++) {
        const li = resLis[i];
        const lRect = li.getBoundingClientRect();
        canvas.add(
          new fabric.Circle({
            name: `results.dot.${i}`,
            left: lRect.left - sLeft,
            top: lRect.top - sTop + 7,
            radius: 3,
            fill: '#E23B32',
            selectable: true,
          })
        );
        canvas.add(
          new fabric.Textbox(li.textContent.trim(), {
            name: `results.text.${i}`,
            left: lRect.left - sLeft + 14,
            top: lRect.top - sTop,
            width: lRect.width - 14,
            fontSize: 14.5,
            lineHeight: 1.42,
            fontFamily: 'Poppins, sans-serif',
            fill: '#2B3A4F',
            selectable: true,
          })
        );
      }
    }

    // 17. CTA Block (.cta)
    const ctaEl = pageSection.querySelector('.cta');
    if (ctaEl) {
      const ctaRect = ctaEl.getBoundingClientRect();
      // background
      canvas.add(
        new fabric.Rect({
          name: 'cta.bg',
          left: ctaRect.left - sLeft,
          top: ctaRect.top - sTop,
          width: ctaRect.width,
          height: ctaRect.height,
          fill: '#F3F8FC',
          selectable: true,
        })
      );

      const h3 = ctaEl.querySelector('h3');
      if (h3) {
        const h3Rect = h3.getBoundingClientRect();
        canvas.add(
          new fabric.Textbox('Interested in ONESpit™?', {
            name: 'cta.h3',
            left: h3Rect.left - sLeft,
            top: h3Rect.top - sTop,
            width: 360,
            fontSize: 22,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '700',
            fill: '#10243E',
            selectable: true,
          })
        );
      }

      const p = ctaEl.querySelector('p');
      if (p) {
        const pRect = p.getBoundingClientRect();
        canvas.add(
          new fabric.Textbox(p.textContent.trim(), {
            name: 'cta.desc',
            left: pRect.left - sLeft,
            top: pRect.top - sTop,
            width: 340,
            fontSize: 14,
            lineHeight: 1.5,
            fontFamily: 'Poppins, sans-serif',
            fill: '#2B3A4F',
            selectable: true,
          })
        );
      }

      // dt / dd list
      const dts = Array.from(ctaEl.querySelectorAll('dt'));
      const dds = Array.from(ctaEl.querySelectorAll('dd'));
      for (let i = 0; i < dts.length; i++) {
        const dt = dts[i];
        const dd = dds[i];
        const dtRect = dt.getBoundingClientRect();
        const ddRect = dd.getBoundingClientRect();

        canvas.add(
          new fabric.Textbox(dt.textContent.trim(), {
            name: `cta.dt.${i}`,
            left: dtRect.left - sLeft,
            top: dtRect.top - sTop,
            width: 48,
            fontSize: 11,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '600',
            fill: '#0793EB',
            selectable: true,
          })
        );
        canvas.add(
          new fabric.Textbox(dd.textContent.trim(), {
            name: `cta.dd.${i}`,
            left: ddRect.left - sLeft,
            top: ddRect.top - sTop - 1,
            width: 220,
            fontSize: 14,
            fontFamily: 'Poppins, sans-serif',
            fill: '#2B3A4F',
            selectable: true,
          })
        );
      }
    }

    // 18. Bottom Bar (3-color full-width stripe)
    const barEl = pageSection.querySelector('.bar');
    if (barEl) {
      const bRect = barEl.getBoundingClientRect();
      const segW = bRect.width / 3;
      canvas.add(
        new fabric.Rect({
          name: 'footer.bar.red',
          left: 0,
          top: 1123 - 11,
          width: segW,
          height: 11,
          fill: '#E23B32',
          selectable: true,
        })
      );
      canvas.add(
        new fabric.Rect({
          name: 'footer.bar.blue',
          left: segW,
          top: 1123 - 11,
          width: segW,
          height: 11,
          fill: '#0793EB',
          selectable: true,
        })
      );
      canvas.add(
        new fabric.Rect({
          name: 'footer.bar.green',
          left: segW * 2,
          top: 1123 - 11,
          width: segW + 2,
          height: 11,
          fill: '#33A015',
          selectable: true,
        })
      );
    }

    return canvas.toObject(['name', 'selectable', 'evented']);
  });

  await browser.close();

  console.log(`Writing JSON with ${result.objects.length} objects to: ${outputPath}`);
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log('✅ Conversion done!');
}

main().catch(console.error);
