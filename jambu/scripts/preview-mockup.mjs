// Serve an Expo production export on loopback, without a Metro watcher.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createRequestHandler } = require('expo-server/adapter/http');

process.env.NODE_ENV = 'production';
const root = resolve('dist/mockup-web');
const clientRoot = resolve(root, 'client');
const render = createRequestHandler({ build: resolve(root, 'server') });
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = resolve(clientRoot, '.' + pathname);
    if (!file.startsWith(clientRoot + sep)) {
      if (file !== clientRoot) { response.writeHead(403).end(); return; }
    } else {
      const info = await stat(file).catch(() => null);
      if (info?.isFile()) {
        response.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream', 'Content-Length': info.size });
        if (request.method === 'HEAD') response.end();
        else createReadStream(file).on('error', () => response.destroy()).pipe(response);
        return;
      }
    }
    await render(request, response);
  } catch (error) {
    process.stderr.write(String(error) + '\n');
    if (!response.headersSent) response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Não foi possível abrir o mockup. Confira a exportação web.');
  }
}).listen(8097, '127.0.0.1', () => process.stdout.write('Jambu preview: http://127.0.0.1:8097\n'));
