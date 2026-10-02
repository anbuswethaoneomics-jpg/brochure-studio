# Brochure Studio

A Canva-style editor for brochures, posters, flyers and social posts.
Everything on the page is editable: text (font, size, color, bold/italic/underline, alignment,
line and letter spacing), images (upload from your computer), shapes, icons, colors, opacity,
layer order, page background. It also has multi-page designs, tri-fold guides, undo/redo,
templates, save/open, and PNG/PDF export.

- **Frontend:** React + Vite, editing engine is [Fabric.js v6](https://fabricjs.com) (canvas), PDF via jsPDF
- **Backend:** Node + Express (designs API + image uploads). Data goes in `server/data/designs.json`, images in `server/uploads/`

## Run it

Needs Node 18+. Open two terminals:

```bash
# terminal 1: API on http://localhost:4000
cd server
npm install
npm run dev

# terminal 2: editor on http://localhost:5173
cd client
npm install
npm run dev
```

Open http://localhost:5173, pick a size (or start from a template in the left panel).
Google Fonts load from the internet, so the first load needs a connection.

## How to use

| Do this | How |
| --- | --- |
| Edit text | Double-click it. Corner handles resize it (font size changes). Use the top bar for font, size, color, alignment |
| Add an image | Images tab, Upload images, then click a thumbnail to place it again |
| Move / resize / rotate | Drag it or its handles. Arrow keys nudge (Shift = 10px) |
| Undo / redo | Ctrl+Z, Ctrl+Y |
| Duplicate / delete | Ctrl+D, Delete |
| Multi-page | Add page / Duplicate / Delete under the canvas |
| Export | Download menu: PNG (current page) or PDF (all pages) |

## Project layout

```
server/index.js               API: /api/designs, /api/upload, /api/uploads, /uploads
client/src/useEditor.js       All canvas logic: add/edit/undo/export
client/src/objects.js         Builds text, shapes, icons and images from specs
client/src/templates.js       Templates (edit or add your own here)
client/src/icons.js           Icon library (add SVG paths here)
client/src/fonts.js           Font list (add Google Fonts names here)
client/src/App.jsx            Layout, pages, save/open, export
client/src/components/        Sidebar (tools) and PropsBar (contextual toolbar)
```

## About the Canva API

You don't need it, and it wouldn't get you a Canva-like editor. Canva's Connect API lets your app
create and export designs *inside Canva* (with a user's Canva account), and the Apps SDK lets you build
add-ons that run *inside Canva's* editor. Neither gives you an embeddable editor for your own site.
That is why this project uses Fabric.js for the editing surface.

## Ideas for next steps

1. **Accounts:** add login (e.g. JWT) and store `ownerId` on each design; filter `/api/designs` by owner.
2. **Real database:** replace `readAll` / `writeAll` in `server/index.js` with Postgres or MongoDB. Move uploads to S3.
3. **Snapping guides and rulers:** Fabric has no built-in snapping; add on `object:moving`.
4. **Crop and image filters:** Fabric supports `clipPath` and `filters` on images.
5. **Print-ready PDF:** the current PDF is a 2x raster. For vector text/CMYK, render server-side (Puppeteer) or convert Fabric objects to SVG (`canvas.toSVG()`).
6. **Stock photos:** call the Unsplash or Pexels API from the server and show results in the Images tab.
7. **Self-host fonts** so the editor works offline and avoids Google requests.

## Notes

- SVG uploads are blocked on purpose (an SVG served from your domain can run scripts). Convert to PNG first.
- In production, serve the client build (`npm run build`) and the API from the same origin, or set a proxy so `/api` and `/uploads` reach the server.
