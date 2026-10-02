const API_BASE = import.meta.env.VITE_API_URL ?? '';

const json = async (r) => {
  if (!r.ok) {
    let msg = r.statusText;
    try { msg = (await r.json()).error || msg; } catch { /* keep statusText */ }
    throw new Error(msg);
  }
  return r.json();
};
const send = (url, method, body) =>
  fetch(API_BASE + url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(json);

export const listDesigns = () => fetch(API_BASE + '/api/designs').then(json);
export const getDesign = (id) => fetch(API_BASE + `/api/designs/${id}`).then(json);
export const saveDesign = (d) => (d.id ? send(`/api/designs/${d.id}`, 'PUT', d) : send('/api/designs', 'POST', d));
export const deleteDesign = (id) => fetch(API_BASE + `/api/designs/${id}`, { method: 'DELETE' }).then(json);
export const listUploads = () => fetch(API_BASE + '/api/uploads').then(json);
export const uploadImage = (file) => {
  const f = new FormData();
  f.append('image', file);
  return fetch(API_BASE + '/api/upload', { method: 'POST', body: f }).then(json);
};
