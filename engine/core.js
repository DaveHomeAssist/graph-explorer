// Graph Explorer shared engine utilities — used by index.html and issues.html.
export const MAP_STATE_KEY = 'ge-map-states-v1';

export function safeReadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function safeWriteJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function esc(str) {
  const el = document.createElement('span');
  el.textContent = String(str ?? '');
  return el.innerHTML;
}

export function populateSelect(id, values) {
  const el = document.getElementById(id);
  if (!el) return;
  const previous = el.value;
  el.innerHTML = '';
  ['All', ...new Set(values)].forEach((v) => {
    const opt = document.createElement('option');
    opt.value = String(v ?? '');
    opt.textContent = String(v ?? '');
    el.appendChild(opt);
  });
  // Values come from map-pack data. Building options as DOM rather than markup
  // means a layer named `" onmouseover="` cannot break out of the attribute.
  if ([...el.options].some((o) => o.value === previous)) el.value = previous;
}

export function getMapLabel(entry) {
  return entry?.title || entry?.name || entry?.id || 'map';
}

export function getDatasetPath(entry) {
  return entry?.file || `maps/${entry.id}/dataset.json`;
}

export function readMapBookmarks() {
  return safeReadJson(MAP_STATE_KEY, {});
}
