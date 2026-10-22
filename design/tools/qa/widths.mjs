// Checks whether big numbers are truncated ("…") at common phone widths.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', 'package.json'));
const { chromium } = require('playwright');
const dist = path.join(here, '.web-dist');
const server = createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(dist, p);
  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = path.join(dist, 'index.html');
  res.writeHead(200, { 'content-type': file.endsWith('.js') ? 'text/javascript' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;
const state = { goal: 'reach-potential', unit: 'metric', profile: { sex: 'male', ageYears: 14, currentHeightCm: 160, motherHeightCm: 163, fatherHeightCm: 177 }, habits: { sleepHours: '7-8', activity: 'medium', diet: 'ok' }, completedHabitIds: [], isPro: false, onboardingCompleted: false, notificationsAsked: false };
const b = await chromium.launch();
for (const w of [360, 375, 384, 393, 412]) {
  for (const route of ['/onboarding/promise', '/onboarding/height']) {
    const ctx = await b.newContext({ viewport: { width: w, height: 800 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.addInitScript((st) => localStorage.setItem('app-store', JSON.stringify({ state: st, version: 2 })), state);
    await page.goto(base + route);
    await page.waitForTimeout(3000);
    const r = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('div[dir], div')) {
        const cs = getComputedStyle(el);
        if (parseFloat(cs.fontSize) >= 64 && el.childElementCount === 0) out.push({ t: el.textContent, sw: el.scrollWidth, cw: el.clientWidth, fs: cs.fontSize });
      }
      return out;
    });
    console.log(w, route, JSON.stringify(r));
    if (w === 375) await page.screenshot({ path: path.join(here, 'shots', `w375-${route.split('/').pop()}.png`) });
    await ctx.close();
  }
}
await b.close();
server.close();
