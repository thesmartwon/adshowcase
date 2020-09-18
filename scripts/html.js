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

function writeTemplate(templateFile) {
  const out = pug.renderFile(templateFile, { pretty: true });
  const outPath = getOutPath(templateFile);
  console.log(outPath)
  fs.outputFileSync(outPath, out);
}

function renderFiles() {
  glob.sync(inGlob).forEach(writeTemplate);
}

function watchFiles() {
  chokidar.watch(inGlob)
    .on('change', writeTemplate)
    .on('add', writeTemplate)
    .on('unlink', templateFile => fs.unlinkSync(getOutPath(templateFile)));
}

watchFiles();
