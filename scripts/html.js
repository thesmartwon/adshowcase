const path = require('path');
const fs = require('fs-extra');
const pug = require('pug');
const glob = require('glob');
const chokidar = require('chokidar');

const inFolder = 'src/pages';
const inGlob = `${inFolder}/**/*.pug`;
const outFolder = 'public';

function getOutPath(templateFile) {
  return path.join(outFolder, templateFile.replace(inFolder, '').replace('.pug', '.html'));
}

function writeTemplate(templateFile, isDev) {
  const out = pug.renderFile(templateFile, { pretty: true, isDev });
  const outPath = getOutPath(templateFile);
  console.log(outPath)
  fs.outputFileSync(outPath, out);
}

function renderHTML() {
  glob.sync(inGlob).forEach(writeTemplate);
}

const entryWatchers = {};
const includeRegex = /include\s+(.*)/g;

function onPugChange(filename) {
  const content = fs.readFileSync(filename, 'utf-8');
  let match;
  while (match = includeRegex.exec(content)) {
    let includedFile = path.join(inFolder, match[1]);
    if (!includedFile.endsWith('.pug')) {
      includedFile += '.pug';
    }
    if (!entryWatchers[filename]) {
      entryWatchers[filename] = chokidar.watch().on('change', () => onPugChange(filename));
    }
    entryWatchers[filename].add(includedFile);
  }
  writeTemplate(filename, true);
}

function watchHTML() {
  chokidar.watch(inGlob)
    .on('change', onPugChange)
    .on('add', onPugChange)
    .on('unlink', templateFile => fs.unlinkSync(getOutPath(templateFile)));
}

module.exports = {
  watchHTML,
  renderHTML
};
