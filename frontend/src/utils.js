// Small UI helpers shared by pages
const palette = ['#0f766e', '#7c3aed', '#db2777', '#0369a1', '#b45309', '#15803d', '#4338ca', '#be123c'];

export function initials(...parts) {
  return parts.filter(Boolean).map(p => String(p).trim()[0] || '').join('').slice(0, 2).toUpperCase();
}

export function colorFor(seed = '') {
  let h = 0;
  for (const ch of String(seed)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}

export function money(value) {
  const n = Number(value || 0);
  return n.toLocaleString('en-US').replace(/,/g, ' ') + ' \u20B4';
}

export function duration(minutes) {
  const m = Number(minutes || 0);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

export function age(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d)) return null;
  const now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) a--;
  return a;
}

export function formatDate(date) {
  if (!date) return '—';
  const d = new Date(date);
  if (isNaN(d)) return date;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
