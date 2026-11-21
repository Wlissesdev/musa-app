/**
 * MUSA - Main Entry Point
 * Imports all modules and initializes the application
 */

// Import all modules
import { STORAGE_KEY, $, SEC, IMG, QT, TABS, QS } from './constants.js';
import { S, loadState, saveState } from './state.js';
import { toast, streak, nb, ach, dk, today, dayN, esc, hx } from './utils.js';
import { 
  tab, draft, go, render, start, 
  addJ, delJ, setC, artClear, artInit, artSave, delA,
  stopB, breath, cp, wipe,
  pm, fst, buf, pt, fails, until, hid, bi, ac, az, ae, cx,
  sp, drawPad, shk, cl, key
} from './render.js';
import { saveLog, tg, rt } from './actions.js';
import { splash, enter } from './splash.js';

// Load state explicitly (was previously auto-loaded on import)
loadState();

// Make functions globally available for inline onclick handlers
window.go = go;
window.render = render;
window.start = start;
window.saveLog = saveLog;
window.tg = tg;
window.rt = rt;
window.addJ = addJ;
window.delJ = delJ;
window.setC = setC;
window.artClear = artClear;
window.artInit = artInit;
window.artSave = artSave;
window.delA = delA;
window.stopB = stopB;
window.breath = breath;
window.cp = cp;
window.wipe = wipe;
window.sp = sp;
window.drawPad = drawPad;
window.shk = shk;
window.cl = cl;
window.key = key;
window.enter = enter;
window.toast = toast;
window.ach = ach;
window.saveState = saveState;
window.S = S;
window.draft = draft;
window.tab = tab;
window.bi = bi;
window.pm = pm;
window.fst = fst;
window.buf = buf;
window.pt = pt;
window.fails = fails;
window.until = until;
window.hid = hid;
window.ac = ac;
window.az = az;
window.ae = ae;
window.cx = cx;

// Initialize the app
function initApp() {
  // Extend QS with QT quotes for daily rotation
  QS.push(...QT.map(q => [q[0], q[1] + (q[2] ? " · " + q[2] : "")]));
  
  // Register service worker
  try {
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
  } catch (e) {}

  // Global error handlers
  window.addEventListener('error', e => console.error('Global error:', e.error));
  window.addEventListener('unhandledrejection', e => console.error('Unhandled rejection:', e.reason));

  // Show splash screen
  splash();
}

// Run initialization
initApp();

console.log('MUSA main module loaded');
