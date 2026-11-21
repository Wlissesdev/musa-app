const fs = require('fs');
const css = fs.readFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/src/css/desktop.css', 'utf8');
const fixed = css.replace(/#app\.desktop/g, 'html.desktop #app');
fs.writeFileSync('C:/Users/Wlisses/OneDrive/Documentos/musa-app-extracted/musa/src/css/desktop.css', fixed, 'utf8');
console.log('desktop.css fixed - selectors updated');
