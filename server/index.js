// Brochure Studio backend: designs CRUD + image uploads + OCR proxy
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const DB_FILE = path.join(DATA_DIR, 'designs.json');

const readAll = () => {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return []; }
};
const writeAll = (rows) => {
  const tmp = DB_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(rows));
  fs.renameSync(tmp, DB_FILE);
};

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ---------- uploads (disk) ----------
const EXT = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp', 'image/gif': '.gif' };
const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, crypto.randomUUID() + EXT[file.mimetype]),
  }),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(EXT[file.mimetype] ? null : new Error('Only PNG, JPG, WEBP or GIF images'), !!EXT[file.mimetype]),
});

app.use('/uploads', express.static(UPLOAD_DIR, {
  maxAge: '7d',
  setHeaders: (res) => res.setHeader('X-Content-Type-Options', 'nosniff'),
}));

app.post('/api/upload', uploadDisk.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image received' });
  res.json({ url: `/uploads/${req.file.filename}`, name: req.file.originalname });
});

app.get('/api/uploads', (_req, res) => {
  const files = fs.readdirSync(UPLOAD_DIR)
    .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f))
    .map((f) => ({ url: `/uploads/${f}`, name: f, mtime: fs.statSync(path.join(UPLOAD_DIR, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);
  res.json(files);
});

// ---------- OCR proxy (memory) ----------
const uploadMemory = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.post('/api/ocr', uploadMemory.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const form = new FormData();
    form.append('file', req.file.buffer, {
      filename: 'image.png',
      contentType: req.file.mimetype || 'image/png',
    });
    form.append('language', 'eng');
    form.append('isOverlayRequired', 'true');
    form.append('OCREngine', '2');
    form.append('scale', 'true');
    form.append('detectOrientation', 'true');
    form.append('apikey', 'K86054432788957');

    // Optional free API key (get one at https://ocr.space/ocrapi)
    // form.append('apikey', 'YOUR_FREE_KEY_HERE');

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('OCR error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ---------- designs ----------
const clean = (b) => {
  const int = (v, min, max) => Math.min(max, Math.max(min, Math.round(Number(v) || 0)));
  if (!b || !Array.isArray(b.pages) || !b.pages.length) return null;
  return {
    name: String(b.name || 'Untitled design').slice(0, 120),
    width: int(b.width, 50, 10000),
    height: int(b.height, 50, 10000),
    folds: int(b.folds, 0, 6),
    pages: b.pages,
    thumbnail: typeof b.thumbnail === 'string' && b.thumbnail.startsWith('data:image/') ? b.thumbnail : '',
  };
};

app.get('/api/designs', (_req, res) => {
  const rows = readAll()
    .map(({ pages, ...meta }) => ({ ...meta, pageCount: pages.length }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
  res.json(rows);
});

app.get('/api/designs/:id', (req, res) => {
  const row = readAll().find((d) => d.id === req.params.id);
  row ? res.json(row) : res.status(404).json({ error: 'Design not found' });
});

app.post('/api/designs', (req, res) => {
  const data = clean(req.body);
  if (!data) return res.status(400).json({ error: 'Design needs at least one page' });
  const row = { id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now(), ...data };
  writeAll([...readAll(), row]);
  res.status(201).json({ id: row.id, updatedAt: row.updatedAt });
});

app.put('/api/designs/:id', (req, res) => {
  const data = clean(req.body);
  if (!data) return res.status(400).json({ error: 'Design needs at least one page' });
  const rows = readAll();
  const i = rows.findIndex((d) => d.id === req.params.id);
  if (i < 0) {
    const row = { id: req.params.id || crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now(), ...data };
    writeAll([...rows, row]);
    return res.status(201).json({ id: row.id, updatedAt: row.updatedAt });
  }
  rows[i] = { ...rows[i], ...data, updatedAt: Date.now() };
  writeAll(rows);
  res.json({ id: rows[i].id, updatedAt: rows[i].updatedAt });
});

app.delete('/api/designs/:id', (req, res) => {
  writeAll(readAll().filter((d) => d.id !== req.params.id));
  res.json({ ok: true });
});

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  res.status(400).json({ error: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Brochure Studio API on http://localhost:${PORT}`));