/**
 * Brochure Studio API client with resilient IndexedDB + LocalStorage fallback
 * Ensures full permanent saving and gallery access in both local and static live environments (e.g. Vercel).
 */

const DB_NAME = 'BrochureStudioDB';
const DB_VERSION = 2;
const STORE_NAME = 'designs';
const STORE_UPLOADS = 'uploads';
const LS_META_KEY = 'brochure_designs_meta';

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
      if (!db.objectStoreNames.contains(STORE_UPLOADS)) {
        const uStore = db.createObjectStore(STORE_UPLOADS, { keyPath: 'id' });
        uStore.createIndex('createdAt', 'createdAt', { unique: false });
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

async function idbGetUploads() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_UPLOADS, 'readonly');
      const req = tx.objectStore(STORE_UPLOADS).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    return [];
  }
}

async function idbPutUpload(item) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_UPLOADS, 'readwrite');
      const req = tx.objectStore(STORE_UPLOADS).put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function idbDeleteUpload(id) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_UPLOADS, 'readwrite');
      const req = tx.objectStore(STORE_UPLOADS).delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

function lsGetMeta() {
  try {
    return JSON.parse(localStorage.getItem(LS_META_KEY) || '[]');
  } catch {
    return [];
  }
}

function lsSaveMeta(item) {
  try {
    // Only store metadata + small thumbnail to avoid localStorage 5MB quota errors
    const meta = {
      id: item.id,
      name: item.name,
      width: item.width,
      height: item.height,
      folds: item.folds,
      pageCount: Array.isArray(item.pages) ? item.pages.length : 1,
      thumbnail: typeof item.thumbnail === 'string' && item.thumbnail.length < 50000 ? item.thumbnail : '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    const list = lsGetMeta().filter((d) => d.id !== item.id);
    list.unshift(meta);
    localStorage.setItem(LS_META_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // Quota reached; IndexedDB remains primary
  }
}

function lsDeleteMeta(id) {
  try {
    const list = lsGetMeta().filter((d) => d.id !== id);
    localStorage.setItem(LS_META_KEY, JSON.stringify(list));
  } catch {}
}

const safeJsonFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
};

export const listDesigns = async () => {
  // 1. Get all local designs from IndexedDB
  const localItems = await idbGetAll();
  const localMap = new Map();

  localItems.forEach((d) => {
    if (d && d.id) {
      const pageCount = Array.isArray(d.pages) ? d.pages.length : (d.pageCount || 1);
      localMap.set(d.id, {
        id: d.id,
        name: d.name || 'Untitled design',
        width: d.width,
        height: d.height,
        folds: d.folds,
        pageCount,
        thumbnail: d.thumbnail || '',
        createdAt: d.createdAt || Date.now(),
        updatedAt: d.updatedAt || Date.now(),
      });
    }
  });

  // 2. Fallback to localStorage meta if IndexedDB was empty
  if (localMap.size === 0) {
    lsGetMeta().forEach((m) => {
      if (m && m.id) localMap.set(m.id, m);
    });
  }

  // 3. Attempt server fetch (e.g. if local backend server is running on port 4001)
  const serverItems = await safeJsonFetch('/api/designs');
  if (Array.isArray(serverItems)) {
    serverItems.forEach((d) => {
      if (d && d.id) {
        const existing = localMap.get(d.id);
        if (!existing || (d.updatedAt || 0) >= (existing.updatedAt || 0)) {
          localMap.set(d.id, d);
        }
      }
    });
  }

  return Array.from(localMap.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
};

export const getDesign = async (id) => {
  // 1. Check local IndexedDB first
  const local = await idbGet(id);
  if (local && local.pages && local.pages.length) {
    return local;
  }

  // 2. Check server
  const serverDesign = await safeJsonFetch(`/api/designs/${id}`);
  if (serverDesign && serverDesign.pages && serverDesign.pages.length) {
    await idbPut(serverDesign);
    lsSaveMeta(serverDesign);
    return serverDesign;
  }

  // 3. Fallback to any local item matching id
  if (local) return local;

  throw new Error('Design not found in gallery');
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
    thumbnail: typeof d.thumbnail === 'string' ? d.thumbnail : '',
    createdAt: d.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  // 1. Save locally to IndexedDB & localStorage immediately
  await idbPut(record);
  lsSaveMeta(record);

  // 2. Attempt background sync to backend server if available
  const payload = JSON.stringify(record);
  const syncUrl = d.id ? `/api/designs/${d.id}` : '/api/designs';
  const syncMethod = d.id ? 'PUT' : 'POST';

  try {
    const srvRes = await safeJsonFetch(syncUrl, {
      method: syncMethod,
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    });
    if (srvRes && srvRes.id) {
      if (srvRes.id !== id) {
        await idbDelete(id);
        lsDeleteMeta(id);
        record.id = srvRes.id;
        record.updatedAt = srvRes.updatedAt || Date.now();
        await idbPut(record);
        lsSaveMeta(record);
      }
      return { id: record.id, updatedAt: record.updatedAt };
    }
  } catch {
    // Backend offline / Vercel static host; local save is already complete and safe
  }

  // 3. Return local success response
  return { id: record.id, updatedAt: record.updatedAt };
};

export const deleteDesign = async (id) => {
  await idbDelete(id);
  lsDeleteMeta(id);

  try {
    await fetch(`/api/designs/${id}`, { method: 'DELETE' });
  } catch {
    // Offline / static host ignored
  }

  return { ok: true };
};

export const listUploads = async () => {
  // 1. Load from IndexedDB
  const localUploads = await idbGetUploads();
  const map = new Map();

  localUploads.forEach((u) => {
    if (u && (u.id || u.url)) {
      const key = u.id || u.url;
      map.set(key, {
        id: u.id || key,
        url: u.url || u.dataUrl,
        dataUrl: u.dataUrl || u.url,
        name: u.name || 'image',
        createdAt: u.createdAt || Date.now(),
      });
    }
  });

  // 2. Fetch server uploads if available and merge
  const serverUploads = await safeJsonFetch('/api/uploads');
  if (Array.isArray(serverUploads)) {
    serverUploads.forEach((srv) => {
      if (srv && srv.url) {
        let existingKey = null;
        for (const [k, v] of map.entries()) {
          if (v.url === srv.url || (v.name && v.name === srv.name)) {
            existingKey = k;
            break;
          }
        }
        if (!existingKey) {
          const srvId = 'srv_' + (srv.name || Math.random().toString(36).slice(2, 8));
          map.set(srv.url, {
            id: srvId,
            url: srv.url,
            dataUrl: srv.url,
            name: srv.name || 'image',
            createdAt: srv.mtime || Date.now(),
          });
        }
      }
    });
  }

  return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const uploadImage = async (file) => {
  // Read as data URL so it's always immediately usable and can be stored in IndexedDB
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });

  let serverUrl = null;
  try {
    const f = new FormData();
    f.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: f });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) serverUrl = data.url;
    }
  } catch {}

  const uploadId = 'upl_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
  const record = {
    id: uploadId,
    url: serverUrl || dataUrl,
    dataUrl: dataUrl,
    name: file.name || 'image',
    createdAt: Date.now(),
  };

  // Persist permanently in IndexedDB
  await idbPutUpload(record);

  return record;
};

export const deleteUpload = async (itemOrId) => {
  const id = typeof itemOrId === 'object' ? itemOrId?.id : itemOrId;
  const url = typeof itemOrId === 'object' ? itemOrId?.url : null;
  const dataUrl = typeof itemOrId === 'object' ? itemOrId?.dataUrl : null;

  // 1. Delete from IndexedDB by id
  if (id) {
    await idbDeleteUpload(id);
  }

  // 2. Also ensure deletion by url / dataUrl if id was different
  try {
    const all = await idbGetUploads();
    for (const u of all) {
      if ((url && u.url === url) || (dataUrl && u.dataUrl === dataUrl)) {
        await idbDeleteUpload(u.id);
      }
    }
  } catch {}

  // 3. Delete from backend server if it has a server filename
  const targetUrl = url || (typeof itemOrId === 'string' ? itemOrId : null);
  if (targetUrl && targetUrl.startsWith('/uploads/')) {
    const filename = targetUrl.replace('/uploads/', '');
    try {
      await fetch(`/api/uploads/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    } catch {}
  }

  return { ok: true };
};
