import { StaticCanvas } from 'fabric';
import { getDesign } from './api.js';

/**
 * Renders a single page JSON or thumbnail into an image data URL with specific width and height.
 */
async function renderPageData(pageData, defaultWidth, defaultHeight, fallbackThumbnail) {
  const w = Number(defaultWidth) || 1123;
  const h = Number(defaultHeight) || 794;

  if (!pageData) {
    if (fallbackThumbnail) return { imgUrl: fallbackThumbnail, w, h };
    throw new Error('No page data available');
  }

  // If already an image data URL or image path
  if (typeof pageData === 'string') {
    if (pageData.startsWith('data:image/') || pageData.startsWith('http') || pageData.startsWith('/')) {
      return { imgUrl: pageData, w, h };
    }
    try {
      pageData = JSON.parse(pageData);
    } catch {
      if (fallbackThumbnail) return { imgUrl: fallbackThumbnail, w, h };
      throw new Error('Invalid page data string');
    }
  }

  if (pageData.thumbnailOnly && pageData.thumbnail) {
    return { imgUrl: pageData.thumbnail, w, h };
  }

  try {
    const canvasEl = document.createElement('canvas');
    canvasEl.width = w * 2;
    canvasEl.height = h * 2;

    const staticCanvas = new StaticCanvas(canvasEl, {
      width: w,
      height: h,
      renderOnAddRemove: false,
    });

    const bg = pageData.background || pageData.backgroundColor || '#ffffff';
    staticCanvas.backgroundColor = bg;

    if (pageData.objects || pageData.version) {
      let cleanStr = JSON.stringify(pageData);
      cleanStr = cleanStr.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/assets\//g, '/assets/');
      cleanStr = cleanStr.replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/uploads\//g, '/uploads/');
      await staticCanvas.loadFromJSON(JSON.parse(cleanStr));
    }

    staticCanvas.setZoom(2);
    staticCanvas.setDimensions({ width: w * 2, height: h * 2 });
    staticCanvas.renderAll();

    const dataUrl = staticCanvas.toDataURL({ format: 'png', multiplier: 1 });
    staticCanvas.dispose();

    return { imgUrl: dataUrl, w, h };
  } catch (err) {
    console.warn('Canvas render error, falling back to thumbnail:', err);
    if (fallbackThumbnail) {
      return { imgUrl: fallbackThumbnail, w, h };
    }
    throw err;
  }
}

/**
 * Merges multiple selected designs from the gallery into a single multi-page PDF.
 *
 * @param {Array} selectedDesigns - Array of design objects from gallery
 * @param {Function} [onProgress] - Callback (progressObj) => void
 * @returns {Promise<{ pageCount: number, filename: string }>}
 */
export async function mergeDesignsToPDF(selectedDesigns, onProgress) {
  if (!Array.isArray(selectedDesigns) || selectedDesigns.length === 0) {
    throw new Error('Please select at least one design from the gallery.');
  }

  const allRenderedPages = [];

  for (let i = 0; i < selectedDesigns.length; i++) {
    const d = selectedDesigns[i];
    if (onProgress) {
      onProgress({
        currentDesignIndex: i + 1,
        totalDesigns: selectedDesigns.length,
        designName: d.name || 'Untitled design',
        status: `Processing "${d.name || 'Untitled'}" (${i + 1}/${selectedDesigns.length})...`,
      });
    }

    let full = null;
    try {
      full = await getDesign(d.id);
    } catch {
      full = d;
    }

    const w = full?.width || d.width || 1123;
    const h = full?.height || d.height || 794;
    const pages = Array.isArray(full?.pages) && full.pages.length > 0
      ? full.pages
      : (d.thumbnail ? [{ thumbnailOnly: true, thumbnail: d.thumbnail }] : []);

    if (pages.length === 0 && d.thumbnail) {
      allRenderedPages.push({ imgUrl: d.thumbnail, w, h });
      continue;
    }

    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
      if (onProgress) {
        onProgress({
          currentDesignIndex: i + 1,
          totalDesigns: selectedDesigns.length,
          designName: d.name || 'Untitled design',
          status: `Rendering "${d.name || 'Untitled'}" page ${pIdx + 1} of ${pages.length}...`,
        });
      }

      try {
        const pageResult = await renderPageData(pages[pIdx], w, h, d.thumbnail);
        allRenderedPages.push(pageResult);
      } catch (pErr) {
        console.warn(`Could not render page ${pIdx} of ${d.name}:`, pErr);
        if (d.thumbnail) {
          allRenderedPages.push({ imgUrl: d.thumbnail, w, h });
        }
      }
    }
  }

  if (allRenderedPages.length === 0) {
    throw new Error('No pages could be rendered from the selected designs.');
  }

  if (onProgress) {
    onProgress({
      currentDesignIndex: selectedDesigns.length,
      totalDesigns: selectedDesigns.length,
      status: `Assembling ${allRenderedPages.length} pages into PDF...`,
    });
  }

  const { jsPDF } = await import('jspdf');
  let pdf = null;

  for (let idx = 0; idx < allRenderedPages.length; idx++) {
    const { imgUrl, w, h } = allRenderedPages[idx];
    const orientation = w >= h ? 'landscape' : 'portrait';

    if (idx === 0) {
      pdf = new jsPDF({
        orientation,
        unit: 'px',
        format: [w, h],
        hotfixes: ['px_scaling'],
      });
      pdf.addImage(imgUrl, 'PNG', 0, 0, w, h);
    } else {
      pdf.addPage([w, h], orientation);
      pdf.addImage(imgUrl, 'PNG', 0, 0, w, h);
    }
  }

  const dateStr = new Date().toISOString().slice(0, 10);
  const sanitizedName = selectedDesigns.length === 1
    ? (selectedDesigns[0].name || 'design').replace(/[^a-z0-9_-]+/gi, '_')
    : `ONEOMICS_Merged_Brochures_${dateStr}`;
  const filename = `${sanitizedName}.pdf`;

  pdf.save(filename);

  return {
    pageCount: allRenderedPages.length,
    filename,
  };
}

