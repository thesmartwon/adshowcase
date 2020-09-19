const path = require('path');
const fs = require('fs');
const http = require('http');
const livereload = require('livereload');
const { watchHTML } = require('./html');
const { watchCopy } = require('./copy');

function requestListener(req, res) {
  let filePath = path.join('public', req.url).replace(/\?.*$/, '');
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath += 'index.html';
  }
  if (!filePath.includes('.')) {
    filePath += '.html';
  }
  if (fs.existsSync(filePath)) {
    const body = fs.readFileSync(filePath, 'utf-8');
    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      ...(filePath.endsWith('.css') && {
        'Content-Type': 'text/css'
      })
    });
    res.end(body);
  }
  res.writeHead(404);
  res.end('Not Found.');
}

function start() {
  const server = http.createServer(requestListener);
  server.listen(8000);
  const liveserver = livereload.createServer();
  liveserver.watch('public');
  watchHTML();
  watchCopy();
}

start();
