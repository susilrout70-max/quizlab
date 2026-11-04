import http from 'node:http';
import type { Config, Context } from '@netlify/functions';
import app from '../../server/src/index.js';

let server: http.Server | null = null;
let serverPort: number | null = null;
let initPromise: Promise<number> | null = null;

function ensureServer(): Promise<number> {
  if (serverPort !== null) {
    return Promise.resolve(serverPort);
  }
  if (!initPromise) {
    initPromise = new Promise<number>((resolve, reject) => {
      server = http.createServer(app);
      server.listen(0, '127.0.0.1', () => {
        const addr = server?.address();
        if (addr && typeof addr === 'object') {
          serverPort = addr.port;
          resolve(serverPort);
        } else {
          reject(new Error('Failed to bind server to local port'));
        }
      });
      server.on('error', (err) => {
        initPromise = null;
        reject(err);
      });
    });
  }
  return initPromise;
}

export default async (req: Request, _context: Context): Promise<Response> => {
  const port = await ensureServer();
  const url = new URL(req.url);

  let pathname = url.pathname;
  if (pathname.startsWith('/.netlify/functions/api')) {
    pathname = pathname.replace('/.netlify/functions/api', '') || '/';
  }

  const targetUrl = `http://127.0.0.1:${port}${pathname}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set('host', `127.0.0.1:${port}`);

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = req.body;
    (fetchOptions as any).duplex = 'half';
  }

  return fetch(targetUrl, fetchOptions);
};

export const config: Config = {
  path: ['/api', '/api/*', '/.netlify/functions/api', '/.netlify/functions/api/*'],
  preferStatic: false,
};
