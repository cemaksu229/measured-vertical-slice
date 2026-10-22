// Regression check for the ruler "going crazy" after a fast drag released outside the ruler.
// Drags the Height ruler, releases far away, then samples the value: it must settle and stay put.
// Uses the web build from `npm run all` (design/tools/.web-dist).
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../.web-dist');
const server = createServer((req, res) => {
  let file = path.join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!existsSync(file) || statSync(file).isDirectory()) file = path.join(dist, 'index.html');
  const type = { '.html': 'text/html', '.js': 'text/javascript', '.otf': 'font/otf', '.png': 'image/png' }[path.extname(file)];
  res.writeHead(200, type ? { 'content-type': type } : {});
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const state = {
  goal: 'reach-potential', unit: 'metric',
  profile: { sex: 'male', ageYears: 14, currentHeightCm: 160, motherHeightCm: 163, fatherHeightCm: 177 },
  habits: { sleepHours: null, activity: null, diet: null },
  completedHabitIds: [], isPro: false, onboardingCompleted: false, notificationsAsked: false,
};
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: false });
await page.addInitScript((s) => localStorage.setItem('app-store', JSON.stringify({ state: s, version: 2 })), state);
await page.goto(`${base}/onboarding/height`);
await page.waitForTimeout(2500);

const ruler = page.locator('[role="slider"], [role="adjustable"]').first();
const box = await ruler.boundingBox();
if (!box) throw new Error('ruler not found');
const read = () => page.evaluate(() => JSON.parse(localStorage.getItem('app-store')).state.profile.currentHeightCm);

let failures = 0;
for (const [label, endX, endY] of [['release far left', 10, 120], ['release far below', box.x + box.width / 2, 830], ['release above', box.x + box.width / 2, 5]]) {
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  for (let i = 1; i <= 6; i++) await page.mouse.move(cx, cy - i * 25, { steps: 1 });
  await page.mouse.move(endX, endY, { steps: 2 });
  await page.mouse.up();
  const samples = [];
  for (let i = 0; i < 16; i++) { await page.waitForTimeout(150); samples.push(await read()); }
  const tail = samples.slice(-6);
  const stable = tail.every((v) => v === tail[0]);
  const reversals = samples.slice(2).filter((v, i) => Math.sign(v - samples[i + 1]) * Math.sign(samples[i + 1] - samples[i]) < 0).length;
  const ok = stable && reversals === 0 && Number.isInteger(tail[0]);
  if (!ok) failures++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${samples.join(' ')} (reversals ${reversals})`);
}
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
