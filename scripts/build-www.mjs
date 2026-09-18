// Copies the web app into www/ for Capacitor. The site itself has no build step;
// this only leaves out repo-only files (tools, store assets, docs, service worker).
import { cpSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const OUT = 'www';
const INCLUDE = ['index.html', 'privacy.html', 'manifest.webmanifest', 'css', 'js', 'fonts', 'icons', 'media', 'content'];

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);
for (const item of INCLUDE) {
  cpSync(item, join(OUT, item), {
    recursive: true,
    filter: (src) => !src.endsWith('SCHEMA.md'),
  });
}
console.log(`Copied ${INCLUDE.length} entries into ${OUT}/`);
