/* 4Everyone service worker: app shell precache + offline video playback with Range support. */
const VERSION = 'v8';
const SHELL_CACHE = `4e-shell-${VERSION}`;
const MEDIA_CACHE = '4e-media-v1'; // must match js/app.js; videos saved by the user live here

const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/fonts.css',
  'css/app.css',
  'js/app.js',
  'content/v1i1.json',
  'fonts/BebasNeue-400-latin.woff2',
  'fonts/Barlow-400-latin.woff2',
  'fonts/Barlow-400i-latin.woff2',
  'fonts/Barlow-500-latin.woff2',
  'fonts/Barlow-600-latin.woff2',
  'icons/icon-192.png',
  'icons/favicon-64.png',
  'media/img/wordmark-dark.png',
  'media/img/wordmark-light.png',
  'media/img/cover-en.jpg',
  'media/img/cover-es.jpg',
  'media/img/tara-yoga.jpg',
  'media/img/tara-strength.jpg',
  'media/img/tara-headshot.jpg',
  ...['squats', 'arm-raises', 'heel-taps', 'leg-ext'].flatMap((n) => [`media/video/${n}-en.jpg`, `media/video/${n}-es.jpg`])
];

// Precache the shell plus every section's text, so the whole issue reads offline once installed.
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    await cache.addAll(SHELL);
    try {
      const issue = await (await cache.match('content/v1i1.json')).json();
      await cache.addAll(issue.sections.filter((s) => s.src).map((s) => s.src));
    } catch { /* sections are also cached as they are read */ }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('4e-shell-') && k !== SHELL_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.endsWith('.mp4')) {
    e.respondWith(serveVideo(req));
    return;
  }
  // Content and shell: network first so updates show up, cache as fallback.
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(SHELL_CACHE).then((c) => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match('index.html')))
  );
});

// Saved videos are stored whole; browsers (Safari especially) request byte ranges, so slice them here.
async function serveVideo(req) {
  const cached = await caches.match(req.url, { cacheName: MEDIA_CACHE });
  if (!cached) return fetch(req);
  const range = req.headers.get('range');
  if (!range) return cached;
  const buf = await cached.arrayBuffer();
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  const size = buf.byteLength;
  let start = m && m[1] ? Number(m[1]) : 0;
  let end = m && m[2] ? Number(m[2]) : size - 1;
  if (m && !m[1] && m[2]) { start = size - Number(m[2]); end = size - 1; }
  end = Math.min(end, size - 1);
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': cached.headers.get('Content-Type') || 'video/mp4',
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': String(end - start + 1),
      'Accept-Ranges': 'bytes'
    }
  });
}
