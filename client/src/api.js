/**
 * Brochure Studio API client with resilient IndexedDB + LocalStorage fallback
 * Ensures full permanent saving and gallery access in both local and static live environments (e.g. Vercel).
 */

import { TEMPLATES } from './brochureTemplates.js';

const DB_NAMES = ['BrochureStudioDB', 'brochure_studio_db'];
const PRIMARY_DB_NAME = 'BrochureStudioDB';
const STORE_NAME = 'designs';
const LS_META_KEY = 'brochure_designs_meta';
const LS_FULL_KEY = 'brochure_designs_full';
const LS_OLD_BACKUP_KEY = 'brochure_studio_designs_backup';

function openDBByName(name) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    // Open without version parameter so it NEVER throws VersionError against existing database versions!
    const req = window.indexedDB.open(name);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => { try { db.close(); } catch {} };
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Upgrade by 1 if the object store doesn't exist in an older DB schema
        const nextVer = (db.version || 1) + 1;
        db.close();
        const upReq = window.indexedDB.open(name, nextVer);
        upReq.onupgradeneeded = (e2) => {
          const db2 = e2.target.result;
          if (!db2.objectStoreNames.contains(STORE_NAME)) {
            const store = db2.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
          }
        };
        upReq.onsuccess = () => {
          const db2 = upReq.result;
          db2.onversionchange = () => { try { db2.close(); } catch {} };
          resolve(db2);
        };
        upReq.onerror = () => reject(upReq.error || new Error(`Failed to upgrade ${name}`));
        upReq.onblocked = () => reject(new Error(`${name} upgrade blocked`));
      } else {
        resolve(db);
      }
    };
    req.onerror = () => reject(req.error || new Error(`Failed to open ${name}`));
    req.onblocked = () => reject(new Error(`${name} blocked`));
  });
}

function openDB() {
  return openDBByName(PRIMARY_DB_NAME);
}

async function idbGet(id) {
  for (const dbName of DB_NAMES) {
    try {
      const db = await openDBByName(dbName);
      if (!db.objectStoreNames.contains(STORE_NAME)) continue;
      const res = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
      if (res && res.id) return res;
    } catch {}
  }
  return null;
}

async function idbGetAll() {
  const map = new Map();
  for (const dbName of DB_NAMES) {
    try {
      const db = await openDBByName(dbName);
      if (!db.objectStoreNames.contains(STORE_NAME)) continue;
      const list = await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      if (Array.isArray(list)) {
        list.forEach((item) => {
          if (item && item.id) map.set(item.id, item);
        });
      }
    } catch {}
  }
  return Array.from(map.values());
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
  for (const dbName of DB_NAMES) {
    try {
      const db = await openDBByName(dbName);
      if (!db.objectStoreNames.contains(STORE_NAME)) continue;
      await new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const req = tx.objectStore(STORE_NAME).delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      });
    } catch {}
  }
  return true;
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
    const meta = {
      id: item.id,
      name: item.name,
      width: item.width,
      height: item.height,
      folds: item.folds,
      templateId: item.templateId || null,
      pageCount: Array.isArray(item.pages) ? item.pages.length : 1,
      thumbnail: typeof item.thumbnail === 'string' && item.thumbnail.length < 50000 ? item.thumbnail : '',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    const list = lsGetMeta().filter((d) => d.id !== item.id);
    list.unshift(meta);
    localStorage.setItem(LS_META_KEY, JSON.stringify(list.slice(0, 50)));
  } catch {}
}

function lsDeleteMeta(id) {
  try {
    const list = lsGetMeta().filter((d) => d.id !== id);
    localStorage.setItem(LS_META_KEY, JSON.stringify(list));
  } catch {}
}

function lsGetFullDesigns() {
  const res = [];
  try {
    const l1 = JSON.parse(localStorage.getItem(LS_FULL_KEY) || '[]');
    if (Array.isArray(l1)) res.push(...l1);
  } catch {}
  try {
    const l2 = JSON.parse(localStorage.getItem(LS_OLD_BACKUP_KEY) || '[]');
    if (Array.isArray(l2)) res.push(...l2);
  } catch {}
  return res;
}

function lsSaveFullDesign(item) {
  try {
    const clone = {
      id: item.id,
      name: item.name,
      width: item.width,
      height: item.height,
      folds: item.folds,
      pages: item.pages,
      templateId: item.templateId || null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
    const list = lsGetFullDesigns().filter((d) => d && d.id !== item.id);
    list.unshift(clone);
    localStorage.setItem(LS_FULL_KEY, JSON.stringify(list.slice(0, 20)));
    localStorage.setItem(LS_OLD_BACKUP_KEY, JSON.stringify(list.slice(0, 20)));
  } catch {}
}

function lsDeleteFullDesign(id) {
  try {
    const l1 = lsGetFullDesigns().filter((d) => d && d.id !== id);
    localStorage.setItem(LS_FULL_KEY, JSON.stringify(l1));
    localStorage.setItem(LS_OLD_BACKUP_KEY, JSON.stringify(l1));
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
        templateId: d.templateId || null,
        createdAt: d.createdAt || Date.now(),
        updatedAt: d.updatedAt || Date.now(),
      });
    }
  });

  // 2. Fallback to localStorage meta & full designs if missing
  lsGetMeta().forEach((m) => {
    if (m && m.id && !localMap.has(m.id)) localMap.set(m.id, m);
  });
  lsGetFullDesigns().forEach((f) => {
    if (f && f.id && !localMap.has(f.id)) {
      localMap.set(f.id, {
        id: f.id,
        name: f.name || 'Untitled design',
        width: f.width,
        height: f.height,
        folds: f.folds,
        pageCount: Array.isArray(f.pages) ? f.pages.length : 1,
        thumbnail: '',
        templateId: f.templateId || null,
        createdAt: f.createdAt || Date.now(),
        updatedAt: f.updatedAt || Date.now(),
      });
    }
  });

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
  // 1. Check local IndexedDB first (both databases)
  const local = await idbGet(id);
  if (local && Array.isArray(local.pages) && local.pages.length) {
    return local;
  }

  // 2. Check localStorage full backups
  const lsFull = lsGetFullDesigns().find((d) => d && (d.id === id || String(d.id) === String(id)));
  if (lsFull && Array.isArray(lsFull.pages) && lsFull.pages.length) {
    await idbPut(lsFull);
    return lsFull;
  }

  // 3. Check server (if backend is running)
  const serverDesign = await safeJsonFetch(`/api/designs/${id}`);
  if (serverDesign && Array.isArray(serverDesign.pages) && serverDesign.pages.length) {
    await idbPut(serverDesign);
    lsSaveMeta(serverDesign);
    lsSaveFullDesign(serverDesign);
    return serverDesign;
  }

  // 4. If local item exists with pages
  if (local && Array.isArray(local.pages) && local.pages.length) return local;

  // 5. Check if the gallery item matches any template by name or id as ultimate safety net
  const metaItem = lsGetMeta().find((m) => m && (m.id === id || String(m.id) === String(id)));
  const designName = metaItem?.name || local?.name;
  if (designName) {
    const matchingTpl = TEMPLATES.find((t) => t.name === designName || t.id === id || t.id === metaItem?.templateId);
    if (matchingTpl) {
      return {
        id,
        name: matchingTpl.name,
        width: matchingTpl.w,
        height: matchingTpl.h,
        folds: matchingTpl.folds || 0,
        pages: [],
        templateId: matchingTpl.id,
        isTemplate: true,
      };
    }
  }

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
    templateId: d.templateId || null,
    createdAt: d.createdAt || Date.now(),
    updatedAt: Date.now(),
  };

  // 1. Save locally to IndexedDB & localStorage immediately
  await idbPut(record);
  lsSaveMeta(record);
  lsSaveFullDesign(record);

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
        lsDeleteFullDesign(id);
        record.id = srvRes.id;
        record.updatedAt = srvRes.updatedAt || Date.now();
        await idbPut(record);
        lsSaveMeta(record);
        lsSaveFullDesign(record);
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
  lsDeleteFullDesign(id);

  try {
    await fetch(`/api/designs/${id}`, { method: 'DELETE' });
  } catch {
    // Offline / static host ignored
  }

  return { ok: true };
};

// ---------- Uploaded Images Storage (IndexedDB + LocalStorage dual fallback) ----------
const UPLOADS_DB_NAME = 'BrochureStudioUploadsDB';
const UPLOADS_DB_VERSION = 1;
const UPLOADS_STORE = 'uploads';
const LS_UPLOADS_KEY = 'brochure_uploads_meta_v1';

function openUploadsDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const req = window.indexedDB.open(UPLOADS_DB_NAME, UPLOADS_DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(UPLOADS_STORE)) {
        db.createObjectStore(UPLOADS_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => { try { db.close(); } catch {} };
      resolve(db);
    };
    req.onerror = () => reject(req.error || new Error('Failed to open uploads database'));
    req.onblocked = () => reject(new Error('Uploads database blocked'));
  });
}

async function idbGetUploads() {
  try {
    const db = await openUploadsDB();
    return new Promise((resolve) => {
      const tx = db.transaction(UPLOADS_STORE, 'readonly');
      const req = tx.objectStore(UPLOADS_STORE).getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn('idbGetUploads error:', err);
    return [];
  }
}

async function idbPutUpload(item) {
  try {
    const db = await openUploadsDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(UPLOADS_STORE, 'readwrite');
      const req = tx.objectStore(UPLOADS_STORE).put(item);
      req.onsuccess = () => resolve(item);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('idbPutUpload error:', err);
    return null;
  }
}

async function idbDeleteUpload(id) {
  try {
    const db = await openUploadsDB();
    return new Promise((resolve) => {
      const tx = db.transaction(UPLOADS_STORE, 'readwrite');
      const req = tx.objectStore(UPLOADS_STORE).delete(id);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

function lsGetUploads() {
  try {
    return JSON.parse(localStorage.getItem(LS_UPLOADS_KEY) || '[]');
  } catch {
    return [];
  }
}

function lsSaveUpload(item) {
  try {
    const list = lsGetUploads().filter((u) => u.id !== item.id && u.url !== item.url);
    const canFit = typeof item.dataUrl === 'string' && item.dataUrl.length < 2500000;
    list.unshift({
      id: item.id,
      name: item.name,
      url: item.url,
      dataUrl: canFit ? item.dataUrl : (item.url || ''),
      createdAt: item.createdAt || Date.now(),
    });
    localStorage.setItem(LS_UPLOADS_KEY, JSON.stringify(list.slice(0, 30)));
  } catch {}
}

function lsDeleteUpload(id, url) {
  try {
    const list = lsGetUploads().filter((u) => u.id !== id && u.url !== url);
    localStorage.setItem(LS_UPLOADS_KEY, JSON.stringify(list));
  } catch {}
}

export const listUploads = async () => {
  const map = new Map();

  // 1. Fetch from IndexedDB
  try {
    const idbList = await idbGetUploads();
    if (Array.isArray(idbList)) {
      idbList.forEach((u) => {
        if (u && (u.id || u.url)) {
          const key = u.id || u.url;
          map.set(key, {
            id: u.id || key,
            url: u.url || u.dataUrl,
            dataUrl: u.dataUrl || u.url,
            name: u.name || 'Image',
            createdAt: u.createdAt || Date.now(),
          });
        }
      });
    }
  } catch {}

  // 2. Fallback / merge from localStorage
  try {
    const lsList = lsGetUploads();
    if (Array.isArray(lsList)) {
      lsList.forEach((u) => {
        if (u && (u.id || u.url)) {
          const key = u.id || u.url;
          if (!map.has(key)) {
            map.set(key, {
              id: u.id || key,
              url: u.url || u.dataUrl,
              dataUrl: u.dataUrl || u.url,
              name: u.name || 'Image',
              createdAt: u.createdAt || Date.now(),
            });
          }
        }
      });
    }
  } catch {}

  // 3. Fetch from backend server if running locally
  try {
    const serverUploads = await safeJsonFetch('/api/uploads');
    if (Array.isArray(serverUploads)) {
      serverUploads.forEach((srv) => {
        if (srv && srv.url) {
          let found = false;
          for (const item of map.values()) {
            if (item.url === srv.url || (item.name && item.name === srv.name)) {
              found = true;
              break;
            }
          }
          if (!found) {
            const srvId = 'srv_' + (srv.name || Math.random().toString(36).slice(2, 8));
            map.set(srv.url, {
              id: srvId,
              url: srv.url,
              dataUrl: srv.url,
              name: srv.name || 'Image',
              createdAt: srv.mtime || Date.now(),
            });
          }
        }
      });
    }
  } catch {}

  return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const uploadImage = async (file) => {
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
    name: file.name || 'Image',
    createdAt: Date.now(),
  };

  try {
    await idbPutUpload(record);
  } catch {}

  try {
    lsSaveUpload(record);
  } catch {}

  return record;
};

export const deleteUpload = async (itemOrId) => {
  const id = typeof itemOrId === 'object' ? itemOrId?.id : itemOrId;
  const url = typeof itemOrId === 'object' ? itemOrId?.url : (typeof itemOrId === 'string' && itemOrId.startsWith('/') ? itemOrId : null);
  const dataUrl = typeof itemOrId === 'object' ? itemOrId?.dataUrl : null;

  if (id) {
    await idbDeleteUpload(id);
  }

  try {
    const all = await idbGetUploads();
    for (const u of all) {
      if ((url && u.url === url) || (dataUrl && u.dataUrl === dataUrl)) {
        await idbDeleteUpload(u.id);
      }
    }
  } catch {}

  lsDeleteUpload(id, url);

  if (url && url.startsWith('/uploads/')) {
    const filename = url.replace('/uploads/', '');
    try {
      await fetch(`/api/uploads/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    } catch {}
  }

  return { ok: true };
};
