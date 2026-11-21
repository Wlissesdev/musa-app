const fs = require('fs');
const h = fs.readFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/index.html', 'utf8');
const f = h.replace(/document\.getElementById\('app'\)\.classList/g, 'document.documentElement.classList');
fs.writeFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/index.html', f, 'utf8');
console.log('fixed - class on html element');
