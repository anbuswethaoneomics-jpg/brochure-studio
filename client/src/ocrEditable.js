import { Rect, Textbox } from 'fabric';

const bringToFront = (canvas, obj) => {
  if (typeof canvas.bringObjectToFront === 'function') {
    canvas.bringObjectToFront(obj);
  } else {
    canvas.moveObjectTo(obj, canvas.getObjects().length - 1);
  }
};

export async function makeImageTextEditable(canvas, imgObject, onStatus) {
  if (imgObject._textExtracted) {
    onStatus?.('This image has already been converted.');
    return 0;
  }

  onStatus?.('Preparing image…');

  try {
    // ---- Convert Fabric image → Blob the reliable way ----
    const dataURL = imgObject.toDataURL({ format: 'png', quality: 1, multiplier: 1 });
    const res = await fetch(dataURL);
    const blob = await res.blob();

    onStatus?.('Sending to OCR…');

    const formData = new FormData();
    formData.append('image', blob, 'image.png');

    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('OCR RESPONSE:', result);

    if (!response.ok || result.error || result.IsErroredOnProcessing || !result.ParsedResults?.[0]) {
      const msg = result.error || result.ErrorMessage?.[0] || result.ErrorMessage || 'Unknown error';
      onStatus?.('OCR failed: ' + msg);
      return 0;
    }

    const textOverlay = result.ParsedResults[0].TextOverlay;

    if (!textOverlay?.Lines?.length) {
      onStatus?.('No readable text found.');
      return 0;
    }

    // Position mapping
    imgObject.setCoords();
    const scaleX = imgObject.getScaledWidth() / imgObject.width;
    const scaleY = imgObject.getScaledHeight() / imgObject.height;
    const bound = imgObject.getBoundingRect();

    const covers = [];
    const textboxes = [];

    for (const line of textOverlay.Lines) {
      if (!line.LineText?.trim()) continue;

      const left = line.MinLeft ?? line.Words?.[0]?.Left ?? 0;
      const top = line.MinTop ?? line.Words?.[0]?.Top ?? 0;
      const width = line.MaxWidth ?? 120;
      const height = line.MaxHeight ?? 24;

      const posX = bound.left + left * scaleX;
      const posY = bound.top + top * scaleY;
      const w = width * scaleX;
      const h = height * scaleY;

      covers.push(new Rect({
        left: posX - 2,
        top: posY - 2,
        width: w + 4,
        height: h + 4,
        fill: '#ffffff',
        selectable: false,
        evented: false,
      }));

      textboxes.push(new Textbox(line.LineText.trim(), {
        left: posX,
        top: posY,
        width: Math.max(w, 40),
        fontSize: Math.max(12, Math.round(h * 0.9)),
        fontFamily: 'Poppins, Arial, sans-serif',
        fill: '#1a1a1a',
        originX: 'left',
        originY: 'top',
        editable: true,
        selectable: true,
      }));
    }

    // Lock original image
    imgObject.set({
      selectable: false,
      evented: false,
      lockMovementX: true,
      lockMovementY: true,
      _textExtracted: true,
    });

    covers.forEach((c) => canvas.add(c));
    textboxes.forEach((t) => {
      canvas.add(t);
      bringToFront(canvas, t);
    });

    canvas.requestRenderAll();
    onStatus?.(`Done! ${textboxes.length} editable text blocks created.`);
    return textboxes.length;

  } catch (err) {
    console.error(err);
    onStatus?.('OCR error: ' + err.message);
    return 0;
  }
}