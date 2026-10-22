// Generates the Measured app icon, Android adaptive icon layers, splash image and favicon.
// Run: node design/tools/brand/make-brand.mjs  (uses ../node_modules/playwright)
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', 'package.json'));
const { chromium } = require('playwright');

const out = path.resolve(here, '..', '..', '..', 'mobile', 'assets', 'images');
const font = pathToFileURL(path.resolve(here, '..', '..', '..', 'mobile', 'assets', 'fonts', 'ClashDisplay-Semibold.otf')).href;
const INK = '#141414', BRAND = '#FF5A1F', ACCENT = '#C6F25B', PAPER = '#F6F4EF';

// The mark: a bold "M" standing on a short ruler line (tick marks) - one idea, no gradient.
const mark = (size, { m = BRAND, tick = ACCENT, scale = 1 } = {}) => {
  const fs = size * 0.62 * scale;
  return `<div class="mark" style="width:${size}px;height:${size}px">
    <div class="m" style="font-size:${fs}px;line-height:${fs}px;color:${m}">M</div>
    <div class="ticks" style="width:${size * 0.46 * scale}px;height:${size * 0.06 * scale}px;margin-top:${size * 0.035 * scale}px">
      ${Array.from({ length: 9 }, (_, i) => `<i style="background:${tick};height:${i % 4 === 0 ? 100 : 55}%"></i>`).join('')}
    </div>
  </div>`;
};

const css = `@font-face{font-family:Clash;src:url('${font}')}
*{margin:0;padding:0;box-sizing:border-box}html,body{background:transparent}
.mark{display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Clash}
.m{font-weight:600;letter-spacing:-0.02em;text-align:center}
.ticks{display:flex;justify-content:space-between;align-items:flex-start}
.ticks i{display:block;width:1.1vw;border-radius:2px}.ticks{border-bottom:1.1vw solid transparent}
.wrap{display:flex;align-items:center;justify-content:center}`;

const jobs = [
  { file: 'icon.png', w: 1024, h: 1024, bg: INK, body: mark(1024) },
  { file: 'android-icon-foreground.png', w: 1024, h: 1024, bg: null, body: mark(1024, { scale: 0.62 }) },
  { file: 'android-icon-monochrome.png', w: 1024, h: 1024, bg: null, body: mark(1024, { m: '#fff', tick: '#fff', scale: 0.62 }) },
  { file: 'favicon.png', w: 256, h: 256, bg: INK, body: mark(256, { scale: 0.95 }) },
  {
    file: 'splash-icon.png', w: 1200, h: 380, bg: null,
    body: `<div style="width:1200px;height:380px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Clash">
      <div style="font-size:220px;line-height:240px;font-weight:600;letter-spacing:-0.02em;color:${PAPER}">Measured</div>
      <div style="width:980px;height:10px;margin-top:28px;background:${BRAND};border-radius:5px;position:relative">
        ${Array.from({ length: 11 }, (_, i) => `<i style="position:absolute;top:-${i % 5 === 0 ? 34 : 20}px;left:${i * 9.8}%;width:6px;height:${i % 5 === 0 ? 34 : 20}px;background:${BRAND};border-radius:3px"></i>`).join('')}
      </div></div>`,
  },
];

mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const j of jobs) {
  const html = path.join(here, '_tmp.html');
  writeFileSync(html, `<!doctype html><meta charset="utf-8"><style>${css}</style><body style="width:${j.w}px;height:${j.h}px;${j.bg ? `background:${j.bg}` : ''}"><div class="wrap" style="width:${j.w}px;height:${j.h}px">${j.body}</div>`);
  const page = await browser.newPage({ viewport: { width: j.w, height: j.h }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(html).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(out, j.file), omitBackground: !j.bg });
  await page.close();
  console.log('wrote', j.file);
}
await browser.close();
