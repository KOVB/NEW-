// Сервер для self-hosting (VPS, Render, Railway). На Vercel не потрібен — там працюють api/* напряму.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import telegram from './api/telegram.js';
import select from './api/select.js';
import order from './api/order.js';
import catalog from './api/catalog.js';

const routes = { '/api/telegram': telegram, '/api/select': select, '/api/order': order, '/api/catalog': catalog };

function wrap(res) {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(o)); return res; };
  res.send = (s) => { res.end(String(s)); return res; };
  return res;
}

http.createServer(async (req, res) => {
  wrap(res);
  const url = new URL(req.url, 'http://x');
  const handler = routes[url.pathname];
  if (handler) {
    let raw = '';
    for await (const chunk of req) { raw += chunk; if (raw.length > 1e6) break; }
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = {}; }
    return handler(req, res);
  }
  if (url.pathname === '/' || url.pathname === '/index.html') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(await readFile(new URL('./public/index.html', import.meta.url)));
  }
  res.status(404).send('not found');
}).listen(process.env.PORT || 3000, () => console.log(`WaterHub bot on :${process.env.PORT || 3000}`));
