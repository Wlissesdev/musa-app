/**
 * MUSA - Actions Module
 * Action handlers: saveLog, tg, rt, etc.
 */

import { S, saveState } from './state.js';
import { draft, ach, toast, esc } from './utils.js';
import { today, MOODS, MOOD_LABELS, TAGS, RIT } from './constants.js';

// Save daily log
export function saveLog() {
  if (draft.mood === null) {
    toast("Escolha como você está");
    return;
  }
  ach(() => {
    S.log[today] = { ...draft };
    draft.mood = null;
    draft.energy = 3;
    draft.sleep = 3;
    draft.tags = [];
    draft.note = "";
  });
  toast("Registro salvo 💺");
}

// Toggle tag
export function tg(t) {
  const a = draft.tags;
  const i = a.indexOf(t);
  i < 0 ? a.push(t) : a.splice(i, 1);
  import('./render.js').then(m => m.render(0));
}

// Toggle ritual
export function rt(id) {
  ach(() => {
    const a = S.rit[today] || (S.rit[today] = []);
    const i = a.indexOf(id);
    i < 0 ? a.push(id) : a.splice(i, 1);
  });
}
