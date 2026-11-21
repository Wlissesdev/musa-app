/**
 * MUSA — utilitários de DOM e domínio
 * Seletores, escape de HTML, datas, sequência (streak), conquistas, hash do PIN e toast.
 */

import { RIT } from './data.js';
import { S, save } from './store.js';

// Seletores
export const $ = (s) => document.querySelector(s);
export const $$ = (s) => Array.from(document.querySelectorAll(s));

// Escapa texto para inserir com segurança em HTML
export function esc(v) {
  return String(v == null ? "" : v).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

// Chave de data: AAAA-MM-DD
export function dk(d) {
  d = d || new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export const today = dk();
export const dayN = Math.floor(Date.now() / 864e5);

// Dias seguidos com registro
export function streak() {
  let n = 0;
  for (let i = 0; i < 400; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (S.log[dk(d)]) n++;
    else if (i > 0) break;
  }
  return n;
}

// Conquistas
export const BD = [
  ["🌱", "Primeiro passo", "1º registro", () => Object.keys(S.log).length >= 1],
  ["🔥", "3 dias", "3 dias seguidos", () => streak() >= 3],
  ["🌟", "7 dias", "7 dias seguidos", () => streak() >= 7],
  ["📖", "Escritora", "1º texto", () => S.journal.length >= 1],
  ["🎨", "Artista", "1º desenho", () => S.art.length >= 1],
  ["🌷", "Dia de cuidado", "6 rituais", () => Object.values(S.rit).some((a) => a.length >= RIT.length)],
  ["🛡️", "Protegida", "PIN ou plano", () => !!S.pin || !!(S.plan && S.plan.people)]
];

export function nb() {
  return BD.filter((b) => b[3]()).length;
}

// Executa uma ação, salva e avisa quando uma nova conquista é desbloqueada
export function ach(f) {
  const before = nb();
  f();
  save();
  if (nb() > before) toast("🏆 Nova conquista desbloqueada");
}

// Aviso flutuante
export function toast(t) {
  const e = $("#toast");
  if (!e) return;
  e.textContent = t;
  e.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("on"), 2400);
}

// Hash do PIN (PBKDF2-SHA256)
export async function hash(pin, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: 150000, hash: "SHA-256" },
    key, 256
  );
  return [...new Uint8Array(bits)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
