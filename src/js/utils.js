/**
 * MUSA - Utils Module
 * Utility functions: toast, streak, achievements, helpers
 */

import { BD, $, SEC } from './constants.js';
import { S, saveState } from './state.js';

// Toast notification
export function toast(t) {
  const e = $("#toast");
  if (!e) return;
  e.textContent = t;
  e.className = "on";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.className = "", 2400);
}

// Streak calculation
export function streak() {
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dk(d);
    if (S.log[key]) n++;
    else if (i > 0) break;
  }
  return n;
}

// Count achieved badges
export function nb() {
  return BD.filter(b => b[3]()).length;
}

// Achievement check and notification
export function ach(f) {
  const b = nb();
  f();
  saveState();
  if (nb() > b) toast("Conquista desbloqueada");
}

// Date key: YYYY-MM-DD
export function dk(d) {
  d = d || new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export const today = dk();
export const dayN = Math.floor(Date.now() / 864e5);

// Escape HTML
export function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>\"/']/g, c => ({
    "&": "&", "<": "<", ">": ">", "\"": "\"", "'": "'"
  }[c]));
}

// Hash for PIN (PBKDF2)
export async function hx(p, s) {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(p), "PBKDF2", false, ["deriveBits"]);
  const b = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(s), iterations: 150000, hash: "SHA-256" }, k, 256);
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
}
