/**
 * MUSA - State Module
 * State management: S (main state), save, load
 */

import { STORAGE_KEY, $ } from './constants.js';

// Main state object
export let S;

export function loadState() {
  try {
    S = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (e) {
    S = null;
  }
  S = S || { name: "", log: {}, journal: [], rit: {}, art: [], plan: {}, pin: null };
}

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));
  } catch (e) {
    toast("Sem espaco para salvar");
  }
}

// Initialize on import
loadState();
