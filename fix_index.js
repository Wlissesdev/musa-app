const fs = require('fs');
const h = fs.readFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/index.html', 'utf8');
const f = h.replace(/document\.documentElement\.classList/g, 'document.getElementById(\'app\').classList');
fs.writeFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/index.html', f, 'utf8');
console.log('fixed');
