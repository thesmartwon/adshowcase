// Copy CSS/JS
const glob = require('glob');
const fs = require('fs-extra');
const chokidar = require('chokidar');

const copyPaths = [
  'src/scripts',
  'src/styles'
];

function getOutPath(folder, file) {
  const path = file.replace(folder, 'public');
  fs.ensureFileSync(path);
  return path;
}

function copyToPublic(folder) {
  glob.sync(`${folder}/*`)
    .map(file => ({
      from: file,
      to: getOutPath(folder, file)
    }))
    .forEach(({ from, to }) => fs.copyFileSync(from, to));
}

function copy() {
  copyPaths.forEach(copyToPublic);
}

function watchCopy() {
  copyPaths.forEach(folder => {
    chokidar.watch(`${folder}/*`)
      .on('change', file => fs.copyFileSync(file, getOutPath(folder, file)))
      .on('add', file => fs.copyFileSync(file, getOutPath(folder, file)))
      .on('unlink', file => fs.unlinkSync(getOutPath(folder, file)));
  })
}

module.exports = {
  copy,
  watchCopy
};
