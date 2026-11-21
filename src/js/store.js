/**
 * MUSA — estado e persistência
 * `S` é o estado persistido (localStorage). `ui` é o estado efêmero de interface.
 * Ambos são objetos mutáveis compartilhados — nunca reatribuídos — o que evita
 * problemas de live-binding entre módulos ES.
 */

import { STORAGE_KEY } from './data.js';

function defaults() {
  return { name: "", log: {}, journal: [], rit: {}, art: [], plan: {}, pin: null };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    return Object.assign(defaults(), parsed);
  } catch (e) {
    return defaults();
  }
}

// Estado persistido
export const S = load();

// Salva o estado persistido (silencioso se o storage estiver cheio/indisponível)
export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
    return true;
  } catch (e) {
    return false;
  }
}

export function freshDraft() {
  return { mood: null, energy: 3, sleep: 3, tags: [], note: "" };
}

// Apaga tudo mantendo a mesma referência de objeto
export function clearAll() {
  const d = defaults();
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, d);
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// Estado de interface (não persistido)
export const ui = {
  tab: "hoje",
  draft: freshDraft(),
  pm: null,        // modo do PIN: null | "unlock" | "off" | "new" | "conf"
  fst: "",         // primeiro PIN digitado
  buf: "",         // dígitos atuais
  pt: ["", ""],    // [título, subtítulo] do modal do PIN
  fails: 0,
  until: 0,
  hid: 0,          // timestamp de quando o app foi ocultado
  breath: null,    // timer da respiração
  breathIdx: 0,
  color: "#d9604a",
  size: 10,
  eraser: false,
  cx: null         // contexto 2D do canvas
};
