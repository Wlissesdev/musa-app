/**
 * MUSA — ações do usuário
 * Handlers chamados pelos elementos da interface (via funções globais).
 */

import { TAGS, RIT, PROMPTS, SEC } from './data.js';
import { S, ui, save, freshDraft, clearAll } from './store.js';
import { $, today, ach, toast } from './dom.js';
import { render } from './views.js';
import { showPin } from './pin.js';

// --- Registro do dia -------------------------------------------------------

export function selectMood(i) {
  ui.draft.mood = i;
  render(0);
}

export function setEnergy(v) {
  ui.draft.energy = +v;
  const el = document.getElementById("enLabel");
  if (el) el.textContent = "Energia: " + v + "/5";
}

export function setSleep(v) {
  ui.draft.sleep = +v;
  const el = document.getElementById("slLabel");
  if (el) el.textContent = "Qualidade do sono: " + v + "/5";
}

export function setNote(v) {
  ui.draft.note = v;
}

export function toggleTag(i) {
  const t = TAGS[i];
  const a = ui.draft.tags;
  const k = a.indexOf(t);
  if (k < 0) a.push(t); else a.splice(k, 1);
  render(0);
}

export function toggleRitual(i) {
  const id = RIT[i][0];
  ach(() => {
    const a = S.rit[today] || (S.rit[today] = []);
    const k = a.indexOf(id);
    if (k < 0) a.push(id); else a.splice(k, 1);
    if (!a.length) delete S.rit[today];
  });
  render(0);
}

export function saveLog() {
  if (ui.draft.mood === null) {
    toast("Escolha como você está");
    return;
  }
  ach(() => {
    S.log[today] = { ...ui.draft, tags: [...ui.draft.tags] };
  });
  ui.draft = freshDraft();
  toast("Registro salvo 💛");
  render();
}

export function undoToday() {
  delete S.log[today];
  save();
  render(0);
}

// --- Diário ----------------------------------------------------------------

export function addJournal(i) {
  const el = $("#jt");
  const t = (el && el.value ? el.value : "").trim();
  if (!t) { el && el.focus(); return; }
  ach(() => S.journal.unshift({ id: Date.now(), d: new Date().toLocaleDateString("pt-BR"), p: PROMPTS[i], t }));
  toast("Texto salvo");
  render(0);
}

export function delJournal(id) {
  if (confirm("Apagar este texto?")) {
    S.journal = S.journal.filter((j) => j.id != id);
    save();
    render(0);
  }
}

// --- Plano de apoio --------------------------------------------------------

export function setPlan(field, value) {
  if (!S.plan) S.plan = {};
  if (field === "phone") S.plan.phone = String(value || "").replace(/[^0-9+]/g, "");
  else S.plan[field] = value;
  save();
  if (field === "people" || field === "phone") render(0);
}

// --- Dados -----------------------------------------------------------------

export function copyData() {
  try {
    navigator.clipboard
      .writeText(JSON.stringify({ ...S, art: [], pin: null }, null, 1))
      .then(() => toast("Dados copiados"), () => toast("Não foi possível copiar"));
  } catch (e) {
    toast("Não foi possível copiar");
  }
}

export function wipeAll() {
  if (confirm("Apagar todos os seus registros? Isso não pode ser desfeito.")) {
    clearAll();
    ui.tab = "hoje";
    ui.draft = freshDraft();
    render();
  }
}

// --- PIN -------------------------------------------------------------------

export function openPinCreate() {
  if (!SEC) { toast("PIN indisponível neste navegador"); return; }
  ui.pm = "new";
  ui.fst = "";
  ui.buf = "";
  showPin("Criar PIN", "Escolha 4 números.");
}

export function openPinRemove() {
  ui.pm = "off";
  ui.buf = "";
  showPin("Remover PIN", "Digite o PIN atual.");
}
