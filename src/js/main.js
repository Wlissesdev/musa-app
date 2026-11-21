/**
 * MUSA — ponto de entrada
 * Monta a abertura, registra as funções usadas pelo HTML e inicializa o app.
 */

import { QT, IMG, SEC } from './data.js';
import { S, ui } from './store.js';
import { $, esc, dayN } from './dom.js';
import * as views from './views.js';
import * as actions from './actions.js';
import * as pin from './pin.js';

// ---- Abertura (splash) ----------------------------------------------------

let splashTimer = null;

function splash() {
  // Frase do dia: mesma durante todo o dia, muda diariamente (não é aleatória).
  const q = QT[((dayN % QT.length) + QT.length) % QT.length];
  const e = $("#sp");
  if (!e) return;
  e.innerHTML = `<div class="in2"><img class="lkimg" src="${IMG}" alt="">` +
    `<h1 style="font-size:34px;margin-top:14px">MUSA</h1>` +
    `<p class="q">“${esc(q[0])}”</p>` +
    `<p class="mute">${esc(q[1])}${q[1] && q[2] ? " · " : ""}${q[2] ? "<i>" + esc(q[2]) + "</i>" : ""}</p>` +
    `<button class="btn" style="margin-top:22px" onclick="enterApp()">Entrar</button></div><i class="pg"></i>`;
  e.classList.add("on");
  splashTimer = setTimeout(enterApp, 7000);
}

function enterApp() {
  clearTimeout(splashTimer);
  const e = $("#sp");
  if (!e || !e.classList.contains("on")) return;
  e.classList.remove("on");
  if (S.pin && S.name && SEC) {
    pin.promptUnlock();
  } else {
    views.render();
  }
}

// ---- Funções globais usadas nos handlers do HTML --------------------------

Object.assign(window, {
  enterApp,
  go: views.go,
  render: views.render,
  startApp: views.startApp,
  selectMood: actions.selectMood,
  setEnergy: actions.setEnergy,
  setSleep: actions.setSleep,
  setNote: actions.setNote,
  toggleTag: actions.toggleTag,
  toggleRitual: actions.toggleRitual,
  saveLog: actions.saveLog,
  undoToday: actions.undoToday,
  addJournal: actions.addJournal,
  delJournal: actions.delJournal,
  setPlan: actions.setPlan,
  copyData: actions.copyData,
  wipeAll: actions.wipeAll,
  openPinCreate: actions.openPinCreate,
  openPinRemove: actions.openPinRemove,
  setColor: views.setColor,
  setBrush: views.setBrush,
  toggleEraser: views.toggleEraser,
  clearArt: views.clearArt,
  saveArt: views.saveArt,
  delArt: views.delArt,
  selectBreath: views.selectBreath,
  toggleBreath: views.toggleBreath,
  pinKey: pin.pinKey,
  pinCancel: pin.pinCancel
});

// ---- Inicialização --------------------------------------------------------

window.addEventListener("error", (e) => console.error("MUSA error:", e.error));
window.addEventListener("unhandledrejection", (e) => console.error("MUSA rejection:", e.reason));

pin.initVisibilityLock();
splash();

try {
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
} catch (e) {}

console.log("MUSA carregado");

// Sinaliza que a inicialização ocorreu (usado pela rede de segurança no index.html)
window.__MUSA_OK = true;
