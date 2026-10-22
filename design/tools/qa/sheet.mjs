// node sheet.mjs out.png name1 name2 ...  -> contact sheet of shots/<name>.png (each 300px wide)
import path from 'node:path';
import { writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', 'package.json'));
const { chromium } = require('playwright');
const [outName, ...names] = process.argv.slice(2);
const cells = names.map((n) => `<figure><img src="${pathToFileURL(path.join(here, 'shots', n + '.png')).href}"><figcaption>${n}</figcaption></figure>`).join('');
const html = path.join(here, '.sheet.html');
writeFileSync(html, `<!doctype html><style>body{margin:0;display:flex;flex-wrap:wrap;gap:12px;padding:12px;width:${Math.min(names.length, 4) * 312 + 12}px;background:#888;align-items:flex-start}figure{margin:0;width:300px}img{width:300px;display:block}figcaption{font:14px sans-serif;color:#fff}</style>${cells}`);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1300, height: 800 } });
await p.goto(pathToFileURL(html).href);
await p.waitForTimeout(400);
await p.screenshot({ path: path.join(here, 'shots', outName), fullPage: true });
await b.close();
