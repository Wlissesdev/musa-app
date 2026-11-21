/**
 * MUSA — tela de PIN
 * Modal de 4 dígitos para criar, confirmar, remover e desbloquear.
 */

import { IMG, SEC } from './data.js';
import { S, ui, save } from './store.js';
import { $, toast, hash, ach } from './dom.js';
import { render } from './views.js';

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"];

export function showPin(title, sub) {
  ui.pt = [title, sub || ""];
  drawPad();
}

// Pede o PIN para desbloquear o app
export function promptUnlock() {
  ui.pm = "unlock";
  ui.buf = "";
  showPin("Bem-vinda de volta", "Digite seu PIN.");
}

export function drawPad() {
  const e = $("#lk");
  if (!e) return;
  e.classList.add("on");
  const dots = [0, 1, 2, 3].map((i) => `<i class="${i < ui.buf.length ? "f" : ""}"></i>`).join("");
  const keys = KEYS.map((k) =>
    k === ""
      ? `<button disabled style="visibility:hidden"></button>`
      : `<button onclick="pinKey('${k}')" ${k === "⌫" ? 'aria-label="Apagar"' : ""}>${k}</button>`
  ).join("");
  e.innerHTML = `<div class="in2"><img class="lkimg" src="${IMG}" alt="">` +
    `<h2 style="margin-top:14px">${ui.pt[0]}</h2><p class="mute">${ui.pt[1]}</p>` +
    `<div class="dots">${dots}</div><div class="keys">${keys}</div>` +
    `${ui.pm === "unlock" ? "" : `<button class="lnk" onclick="pinCancel()">Cancelar</button>`}</div>`;
}

export function pinCancel() {
  ui.pm = null;
  ui.buf = "";
  const l = $("#lk");
  if (l) l.classList.remove("on");
}

function shake() {
  const d = $(".dots");
  if (d) {
    d.classList.add("shake");
    setTimeout(() => d.classList.remove("shake"), 400);
  }
}

export async function pinKey(k) {
  if (k === "⌫") ui.buf = ui.buf.slice(0, -1);
  else if (ui.buf.length < 4) ui.buf += k;

  if (ui.buf.length < 4) {
    drawPad();
    return;
  }

  const digitado = ui.buf;
  ui.buf = "";

  if (ui.pm === "unlock" || ui.pm === "off") {
    if (Date.now() < ui.until) {
      showPin("Aguarde um pouco", "Muitas tentativas. Tente em 30 segundos.");
      shake();
      return;
    }
    if (!S.pin) { pinCancel(); render(); return; }
    if ((await hash(digitado, S.pin.s)) === S.pin.h) {
      ui.fails = 0;
      const removing = ui.pm === "off";
      pinCancel();
      if (removing) {
        S.pin = null;
        save();
        toast("PIN removido");
      }
      render();
    } else {
      if (++ui.fails >= 5) {
        ui.until = Date.now() + 30000;
        ui.fails = 0;
      }
      showPin("PIN incorreto", "Tente novamente.");
      shake();
    }
  } else if (ui.pm === "new") {
    ui.fst = digitado;
    ui.pm = "conf";
    showPin("Confirme o PIN", "Digite novamente.");
  } else if (ui.pm === "conf") {
    if (digitado === ui.fst) {
      const salt = [...crypto.getRandomValues(new Uint8Array(12))].join("");
      S.pin = { s: salt, h: await hash(digitado, salt) };
      pinCancel();
      ach(() => {});
      toast("PIN ativado 🔒");
      render(0);
    } else {
      ui.pm = "new";
      showPin("Não coincidiu", "Crie o PIN novamente.");
      shake();
    }
  }
}

// Bloqueia ao voltar depois de um tempo fora
export function initVisibilityLock() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      ui.hid = Date.now();
    } else if (S.pin && S.name && SEC && ui.pm !== "unlock" && Date.now() - ui.hid > 30000) {
      promptUnlock();
    }
  });
}
