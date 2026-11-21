/**
 * MUSA - Splash Module
 * Splash screen with rotating literary quotes
 */

import { QT, IMG, $, SEC } from './constants.js';
import { S } from './state.js';
import { esc } from './utils.js';
import { pm, sp } from './render.js';

let splashTimer = null;

export function splash() {
  const q = QT[Math.floor(Math.random() * QT.length)];
  const e = $("#sp");
  if (!e) return;
  
  e.innerHTML = `<div class="in2"><img class="lkimg" src="${IMG}" alt=""><h1 style="font-size:34px;margin-top:14px">MUSA</h1><p class="q">"${esc(q[0])}"</p><p class="mute">${esc(q[1])}${q[1] && q[2] ? " · " : ""}${q[2] ? "<i>" + esc(q[2]) + "</i>" : ""}</p><button class="btn" style="margin-top:22px" onclick="enter()">Entrar</button></div><i class="pg"></i>`;
  e.className = "on";
  splashTimer = setTimeout(enter, 7000);
}

export function enter() {
  clearTimeout(splashTimer);
  const e = $("#sp");
  if (!e || e.className !== "on") return;
  e.className = "out";
  setTimeout(() => e.className = "", 400);
  
  if (S.pin && S.name && SEC) {
    pm = "unlock";
    sp("Bem-vinda de volta", "Digite seu PIN.");
  } else {
    S.pin = SEC ? S.pin : null;
    import('./render.js').then(m => m.render());
  }
}
