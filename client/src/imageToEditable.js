// Converts baked-in text inside an image into real, directly-editable Fabric Textbox
// objects, grouped by line for cleaner results. Can only run once per image object.
import { createWorker } from 'tesseract.js';
import { Rect, Textbox } from 'fabric';

// Fabric v6 removed bringObjectToFront – shim works with both v5 and v6
const bringToFront = (canvas, obj) => {
  if (typeof canvas.bringObjectToFront === 'function') {
    canvas.bringObjectToFront(obj);
  } else {
    canvas.moveObjectTo(obj, canvas.getObjects().length - 1);
  }
};

/**
 * Run OCR on a FabricImage and replace the baked-in text with real editable Textboxes.
 * The original image stays as a background layer (locked).
 *
 * @param {fabric.Canvas} canvas
 * @param {fabric.Image}  imgObject   – the image that contains the text
 * @param {function}      [onStatus]  – optional status callback (string)
 * @returns {Promise<number>} number of text objects created
 */
export async function makeImageTextEditable(canvas, imgObject, onStatus) {
  if (imgObject._textExtracted) {
    onStatus?.('This image has already been converted to editable text.');
    return 0;
  }

  onStatus?.('Reading image…');
  const worker = await createWorker('eng');
  const { data } = await worker.recognize(imgObject.getSrc());
  await worker.terminate();

  const lines = (data.lines || []).filter((l) => l.text.trim());
  if (!lines.length) {
    onStatus?.('No readable text found in this image.');
    return 0;
  }

  // Live position/scale – read fresh (not cached)
  imgObject.setCoords();
  const scaleX = imgObject.getScaledWidth() / imgObject.width;
  const scaleY = imgObject.getScaledHeight() / imgObject.height;
  const bound = imgObject.getBoundingRect(); // top-left corner on canvas
  const toCanvas = (x, y) => ({
    x: bound.left + x * scaleX,
    y: bound.top + y * scaleY,
  });

  // Cover the original text areas with white rectangles so the baked text disappears
  // (works best on flat/solid backgrounds)
  const covers = [];
  const textboxes = [];

  for (const line of lines) {
    const bbox = line.bbox; // { x0, y0, x1, y1 }
    const w = (bbox.x1 - bbox.x0) * scaleX;
    const h = (bbox.y1 - bbox.y0) * scaleY;
    const pos = toCanvas(bbox.x0, bbox.y0);

    // White cover over the original text
    const cover = new Rect({
      left: pos.x,
      top: pos.y,
      width: w,
      height: h + 2,
      fill: '#ffffff',
      selectable: false,
      evented: false,
      excludeFromExport: false,
    });
    covers.push(cover);

    // Editable Textbox that sits on top of the cover
    const tb = new Textbox(line.text.trim(), {
      left: pos.x,
      top: pos.y,
      width: Math.max(w, 40),
      fontSize: Math.max(10, Math.round(h * 0.85)),
      fontFamily: 'Poppins, Arial, sans-serif',
      fill: '#0b5d4b',          // match your brand green – change if needed
      textAlign: 'left',
      originX: 'left',
      originY: 'top',
      editable: true,
      selectable: true,
    });
    textboxes.push(tb);
  }

  // Lock the original image so it can’t be accidentally moved
  imgObject.set({
    selectable: false,
    evented: false,
    lockMovementX: true,
    lockMovementY: true,
    _textExtracted: true,
  });

  // Add covers first, then textboxes (so text is on top)
  covers.forEach((c) => canvas.add(c));
  textboxes.forEach((t) => {
    canvas.add(t);
    bringToFront(canvas, t);
  });

  canvas.requestRenderAll();
  onStatus?.(`Done – ${textboxes.length} editable text blocks created. Click any text to edit.`);
  return textboxes.length;
}