// Resilient storage layer: IndexedDB + localStorage + backend API synchronization

const DB_NAME = 'brochure_studio_db';
const DB_VERSION = 1;
const STORE_NAME = 'designs';
const LS_BACKUP_KEY = 'brochure_studio_designs_backup';

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open database'));
  });
}

async function idbGet(id) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function idbGetAll() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function idbPut(item) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function idbDelete(id) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const req = tx.objectStore(STORE_NAME).delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

function lsGetBackup() {
  try {
    return JSON.parse(localStorage.getItem(LS_BACKUP_KEY) || '[]');
  } catch {
    return [];
  }
}

function lsSaveBackup(item) {
  try {
    const list = lsGetBackup().filter((d) => d.id !== item.id);
    list.unshift(item);
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(list.slice(0, 30)));
  } catch {
    // quota limits ignored; idb is primary
  }
}

function lsDeleteBackup(id) {
  try {
    const list = lsGetBackup().filter((d) => d.id !== id);
    localStorage.setItem(LS_BACKUP_KEY, JSON.stringify(list));
  } catch {}
}

const json = async (r) => {
  if (!r.ok) {
    let msg = r.statusText;
    try {
      const parsed = await r.json();
      msg = parsed.error || msg;
    } catch {
      /* keep statusText */
    }
    throw new Error(msg);
  }
  return r.json();
};

const send = (url, method, body) =>
  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(json);

export const listDesigns = async () => {
  let serverDesigns = [];
  try {
    serverDesigns = await fetch('/api/designs').then(json);
    if (!Array.isArray(serverDesigns)) serverDesigns = [];
  } catch (err) {
    console.warn('Backend /api/designs unreachable, falling back to local gallery:', err.message);
  }

  const localDesigns = await idbGetAll();
  const lsBackup = lsGetBackup();

  const map = new Map();

  // 1. Add server designs
  serverDesigns.forEach((d) => {
    if (d && d.id) map.set(d.id, d);
  });

  // 2. Add local IndexedDB designs (takes priority if updated or missing on server)
  localDesigns.forEach(({ pages, ...meta }) => {
    if (!meta.id) return;
    const existing = map.get(meta.id);
    const pageCount = Array.isArray(pages) ? pages.length : meta.pageCount || 1;
    const item = { ...meta, pageCount };
    if (!existing || (item.updatedAt || 0) >= (existing.updatedAt || 0)) {
      map.set(item.id, item);
    }
  });

  // 3. Add localStorage backup designs
  lsBackup.forEach(({ pages, ...meta }) => {
    if (!meta.id) return;
    const existing = map.get(meta.id);
    const pageCount = Array.isArray(pages) ? pages.length : meta.pageCount || 1;
    const item = { ...meta, pageCount };
    if (!existing || (item.updatedAt || 0) >= (existing.updatedAt || 0)) {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
};

export const getDesign = async (id) => {
  // Try server first
  try {
    const srv = await fetch(`/api/designs/${id}`).then(json);
    if (srv && srv.pages) {
      await idbPut(srv);
      lsSaveBackup(srv);
      return srv;
    }
  } catch (err) {
    console.warn(`Backend /api/designs/${id} failed, checking local storage:`, err.message);
  }

  // Fallback to IndexedDB
  const local = await idbGet(id);
  if (local && local.pages) return local;

  // Fallback to localStorage backup
  const ls = lsGetBackup().find((d) => d.id === id);
  if (ls && ls.pages) return ls;

  throw new Error('Design not found');
};

export const saveDesign = async (d) => {
  const id = d.id || ('design_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8));
  const record = {
    id,
    name: String(d.name || 'Untitled design').slice(0, 120),
    width: Number(d.width) || 1123,
    height: Number(d.height) || 794,
    folds: Number(d.folds) || 0,
    pages: Array.isArray(d.pages) ? d.pages : [],
    thumbnail: typeof d.thumbnail === 'string' && d.thumbnail.startsWith('data:image/') ? d.thumbnail : (d.thumbnail || ''),
    createdAt: d.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  // Always save locally to IndexedDB & localStorage immediately
  await idbPut(record);
  lsSaveBackup(record);

  // Attempt to sync to backend API
  try {
    const srvRes = await (d.id ? send(`/api/designs/${d.id}`, 'PUT', record) : send('/api/designs', 'POST', record));
    if (srvRes && srvRes.id) {
      if (srvRes.id !== id) {
        await idbDelete(id);
        lsDeleteBackup(id);
        record.id = srvRes.id;
        record.updatedAt = srvRes.updatedAt || Date.now();
        await idbPut(record);
        lsSaveBackup(record);
      }
      return srvRes;
    }
  } catch (err) {
    console.warn('Backend sync failed (design saved locally to browser):', err.message);
  }

  // Return success from local store
  return { id: record.id, updatedAt: record.updatedAt };
};

export const deleteDesign = async (id) => {
  await idbDelete(id);
  lsDeleteBackup(id);

  try {
    await fetch(`/api/designs/${id}`, { method: 'DELETE' });
  } catch {
    /* ignore offline / server errors */
  }

  return { ok: true };
};

export const listUploads = () => fetch('/api/uploads').then(json);

export const uploadImage = (file) => {
  const f = new FormData();
  f.append('image', file);
  return fetch('/api/upload', { method: 'POST', body: f }).then(json);
};
