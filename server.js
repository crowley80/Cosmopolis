const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400);
    return res.end('Solicitud incorrecta');
  }

  if (pathname === '/') pathname = '/index.html';

  const file = path.resolve(root, '.' + pathname);

  if (file !== root && !file.startsWith(root + path.sep)) {
    res.writeHead(403);
    return res.end('Acceso denegado');
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404);
      return res.end('Archivo no encontrado');
    }

    res.writeHead(200, {
      'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream'
    });

    fs.createReadStream(file).pipe(res);
  });
}).listen(8080, '127.0.0.1', () => {
  console.log('Athun disponible en http://127.0.0.1:8080');
});
