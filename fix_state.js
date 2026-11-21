const fs = require('fs');
const stateJs = "/**\n * MUSA - State Module\n * State management: S (main state), save, load\n */\n\nimport { STORAGE_KEY } from './constants.js';\n\n// Main state object\nexport let S;\n\nexport function loadState() {\n  try {\n    S = JSON.parse(localStorage.getItem(STORAGE_KEY));\n  } catch (e) {\n    S = null;\n  }\n  S = S || { name: \"\", log: {}, journal: [], rit: {}, art: [], plan: {}, pin: null };\n}\n\nexport function saveState() {\n  try {\n    localStorage.setItem(STORAGE_KEY, JSON.stringify(S));\n  } catch (e) {\n    console.warn(\"Sem espaco para salvar\");\n  }\n}\n";
fs.writeFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/src/js/state.js', stateJs, 'utf8');
console.log('state.js fixed');
