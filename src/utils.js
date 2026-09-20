import { BUNNY_LIBRARY_ID, BUNNY_CDN } from "./config.js";

export function bunnyEmbed(videoId) {
  return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?autoplay=true&preload=true`;
}
export function bunnyThumb(videoId) {
  return `https://${BUNNY_CDN}/${videoId}/thumbnail.jpg`;
}

// Converts SITE.accentColor ('#rrggbb') to an "r, g, b" string so the
// stylesheet below can build translucent tints of it with rgba(var(--accent-rgb), alpha).
export function hexToRgb(hex) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return m ? `${parseInt(m[1],16)}, ${parseInt(m[2],16)}, ${parseInt(m[3],16)}` : '229, 35, 27';
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" });
}
export function formatCount(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1).replace('.0','') + 'M';
  if (n >= 1000) return (n/1000).toFixed(1).replace('.0','') + 'K';
  return n.toString();
}
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}
export function parseDuration(str) {
  const parts = (str||'').trim().split(':').map(p => parseInt(p, 10));
  if (!parts.length || parts.some(isNaN)) return 0;
  return parts.reduce((total, p) => total * 60 + p, 0);
}


// Device token for anonymous view tracking
export function getDeviceToken() {
  let t = localStorage.getItem('device_token');
  if (!t) {
    t = Array.from(crypto.getRandomValues(new Uint8Array(24))).map(b=>b.toString(16).padStart(2,'0')).join('');
    localStorage.setItem('device_token', t);
  }
  return t;
}

export async function api(path, options = {}) {
  const res = await fetch(path, { ...options, credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers||{}) } });
  if (!res.ok) { const msg = await res.text(); throw new Error(msg || 'Request failed'); }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
