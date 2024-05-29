const fs = require('fs-extra');
const path = require('path');

// Define source files and destination directory
const srcFiles = [
  './node_modules/tabulator-tables/dist/css/tabulator.min.css',
  './node_modules/tabulator-tables/dist/css/tabulator.min.css.map',
  './node_modules/tabulator-tables/dist/js/tabulator.min.js',
  './node_modules/tabulator-tables/dist/js/tabulator.min.js.map'
];
const destDir = './public/vendor/';

// Copy files
srcFiles.forEach(srcFile => {
  const filename = path.basename(srcFile);
  const destPath = path.join(destDir, filename);

  fs.copy(srcFile, destPath)
    .then(() => console.log(`File copied successfully: ${srcFile} moved to: ${destPath}`))
    .catch(err => console.error(err));
});
