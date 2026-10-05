const json = async (r) => {
  if (!r.ok) {
    let msg = r.statusText;
    try { msg = (await r.json()).error || msg; } catch { /* keep statusText */ }
    throw new Error(msg);
  }
  return r.json();
};
const send = (url, method, body) =>
  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(json);

export const listDesigns = () => fetch('/api/designs').then(json);
export const getDesign = (id) => fetch(`/api/designs/${id}`).then(json);
export const saveDesign = (d) => (d.id ? send(`/api/designs/${d.id}`, 'PUT', d) : send('/api/designs', 'POST', d));
export const deleteDesign = (id) => fetch(`/api/designs/${id}`, { method: 'DELETE' }).then(json);
export const listUploads = () => fetch('/api/uploads').then(json);
export const uploadImage = (file) => {
  const f = new FormData();
  f.append('image', file);
  return fetch('/api/upload', { method: 'POST', body: f }).then(json);
};
