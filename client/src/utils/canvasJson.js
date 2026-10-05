const TRANSPARENT_1PX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAkeys=';

/**
 * Normalizes canvas JSON to ensure asset URLs are portable across ports, hosts, and deployments.
 * Converts hardcoded origins like http://localhost:5173/assets/foo.png or https://site.vercel.app/assets/foo.png
 * into relative /assets/foo.png so that they always resolve to the current environment.
 */
export function normalizeCanvasJson(input) {
  if (!input) return input;
  const isObj = typeof input !== 'string';
  let str = isObj ? JSON.stringify(input) : input;

  // Rewrite any http(s)://<host>/assets/ into /assets/
  str = str.replace(/https?:\/\/[^\/"'\s]+\/assets\//g, '/assets/');

  // Rewrite http(s)://localhost:<port>/uploads/ into /uploads/
  str = str.replace(/https?:\/\/localhost:\d+\/uploads\//g, '/uploads/');

  return isObj ? JSON.parse(str) : str;
}

/**
 * Safely loads canvas state from JSON into a Fabric canvas.
 * 1. Normalizes asset URLs to relative paths.
 * 2. If any image fails to load (e.g. offline, 404, unreachable host), it gracefully replaces
 *    the failing image with a transparent 1px fallback and completes canvas loading without crashing.
 */
export async function safeLoadFromJSON(canvas, rawJson) {
  if (!canvas || !rawJson) return;
  const normalized = normalizeCanvasJson(rawJson);

  try {
    await canvas.loadFromJSON(normalized);
    return;
  } catch (err) {
    console.warn('safeLoadFromJSON: initial load failed, recovering:', err?.message || err);

    const msg = String(err?.message || '');
    const urlMatch = msg.match(/Error loading (https?:\/\/[^\s]+|\/[^\s]+)/i);

    let parsed = typeof normalized === 'string' ? JSON.parse(normalized) : JSON.parse(JSON.stringify(normalized));

    if (urlMatch && urlMatch[1]) {
      const badUrl = urlMatch[1];
      let jsonStr = JSON.stringify(parsed);
      jsonStr = jsonStr.split(badUrl).join(TRANSPARENT_1PX);
      parsed = JSON.parse(jsonStr);
      try {
        await canvas.loadFromJSON(parsed);
        return;
      } catch (retryErr) {
        console.warn('safeLoadFromJSON: retry failed after replacing', badUrl, retryErr);
      }
    }

    // Secondary fallback: sanitize any localhost image from mismatched port
    if (Array.isArray(parsed?.objects)) {
      parsed.objects = parsed.objects.map((obj) => {
        if ((obj.type === 'Image' || obj.type === 'image') && obj.src) {
          if (obj.src.includes('/assets/')) {
            obj.src = '/assets/' + obj.src.split('/assets/').pop();
          } else if (obj.src.includes('localhost:') && !obj.src.includes(`localhost:${window.location.port || '80'}`)) {
            obj.src = TRANSPARENT_1PX;
          }
        }
        return obj;
      });
    }

    try {
      await canvas.loadFromJSON(parsed);
    } catch (finalErr) {
      console.error('safeLoadFromJSON: all recovery attempts failed:', finalErr);
      throw finalErr;
    }
  }
}
