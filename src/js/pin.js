/**
 * MUSA - PIN Module
 * PIN lock screen: drawPad, key handling, hash verification
 */

import { IMG, $, SEC } from './constants.js';
import { S, saveState } from './state.js';
import { hx, toast } from './utils.js';
import { pm, fst, buf, pt, fails, until, hid, cl, shk, drawPad, sp, key } from './render.js';

// Re-export PIN functions
export { pm, fst, buf, pt, fails, until, hid, cl, shk, drawPad, sp, key };

// Show PIN pad
export function sp(t, s) {
  pt = [t, s || ""];
  drawPad();
}

// Draw PIN keypad
export function drawPad() {
  const e = $("#lk");
  if (!e) return;
  e.className = "on";
  e.innerHTML = `<div class="in2"><img class="lkimg" src="${IMG}" alt=""><h2 style="margin-top:14px">${pt[0]}</h2><p class="mute">${pt[1]}</p><div class="dots">${[0, 1, 2, 3].map(i => `<i class="${i < buf.length ? "f" : ""}"></i>`).join("")}</div><div class="keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map(k => `<button ${k === "" ? "disabled style='visibility:hidden'" : ""} onclick="key('${k}")">${k}</button>`).join("")}</div>${pm === "unlock" ? "" : `<button class="lnk" onclick="pm=null;buf='';$('#lk').className=''">Cancelar</button>`}</div>`;
}

// Shake animation on error
export const shk = () => {
  const d = $(".dots");
  d && d.classList.add("shake");
};

// Close PIN modal
export const cl = () => {
  pm = null;
  const lk = $("#lk");
  if (lk) lk.className = "";
};

// Handle keypad input
export async function key(k) {
  if (k === "⌫") buf = buf.slice(0, -1);
  else if (buf.length < 4) buf += k;

  if (buf.length < 4) {
    drawPad();
    return;
  }

  const b = buf;
  buf = "";

  if (pm === "unlock" || pm === "off") {
    if (Date.now() < until) {
      sp("Aguarde um pouco", "Muitas tentativas. Tente em 30 segundos.");
      shk();
      return;
    }
    if (await hx(b, S.pin.s) === S.pin.h) {
      fails = 0;
      const o = pm === "off";
      cl();
      if (o) {
        S.pin = null;
        saveState();
        toast("PIN removido");
      }
      import('./render.js').then(m => m.render());
    } else {
      if (++fails >= 5) {
        until = Date.now() + 30000;
        fails = 0;
      }
      sp("PIN incorreto", "Tente novamente.");
      shk();
    }
  } else if (pm === "new") {
    fst = b;
    pm = "conf";
    sp("Confirme o PIN", "Digite novamente.");
  } else if (pm === "conf") {
    if (b === fst) {
      const s = [...crypto.getRandomValues(new Uint8Array(12))].join("");
      S.pin = { s, h: await hx(b, s) };
      cl();
      ach(() => {});
      toast("PIN ativado 💚");
    } else {
      pm = "new";
      sp("Não coincidiu", "Crie o PIN novamente.");
      shk();
    }
  }
}

// Visibility change handler for PIN lock
document.addEventListener("visibilitychange", () => {
  if (document.hidden) hid = Date.now();
  else if (S.pin && S.name && pm !== "unlock" && Date.now() - hid > 30000) {
    pm = "unlock";
    buf = "";
    sp("Bem-vinda de volta", "Digite seu PIN.");
  }
});
