// QA captures for extra states. Usage: node capture-qa.mjs  (after node build.mjs)
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '..', 'package.json'));
const { chromium } = require('playwright');

const dist = path.join(here, '.web-dist');
const out = path.join(here, 'shots');
mkdirSync(out, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.otf': 'font/otf', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
const server = createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(dist, p);
  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = path.join(dist, 'index.html');
  res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const demo = {
  goal: 'reach-potential', unit: 'metric',
  profile: { sex: 'male', ageYears: 14, currentHeightCm: 160, motherHeightCm: 163, fatherHeightCm: 177 },
  habits: { sleepHours: '7-8', activity: 'medium', diet: 'ok' },
  completedHabitIds: [], isPro: false, onboardingCompleted: false, notificationsAsked: false,
};
const S = (patch, profile = {}) => ({ ...demo, ...patch, profile: { ...demo.profile, ...(patch.profile || {}), ...profile } });
const child = S({ goal: 'track-child', habits: { sleepHours: '9+', activity: 'high', diet: 'good' } }, { sex: 'female', ageYears: 10, currentHeightCm: 138, motherHeightCm: 165, fatherHeightCm: 168 });
const unknownDad = S({}, { fatherHeightCm: null });
const bothUnknown = S({}, { fatherHeightCm: null, motherHeightCm: null });
const imperial = S({ unit: 'imperial' }, { currentHeightCm: 167.6 });
const girl17 = S({ goal: 'know-final-height', habits: { sleepHours: '<7', activity: 'medium', diet: 'low' } }, { sex: 'female', ageYears: 17, currentHeightCm: 168, motherHeightCm: 170, fatherHeightCm: 181 });
const boy19 = S({}, { ageYears: 19, currentHeightCm: 180 });
const freeHome = S({ onboardingCompleted: true, isPro: false });
const proHome = S({ onboardingCompleted: true, isPro: true, completedHabitIds: ['nutrition-protein'] });
const shortBoy = S({}, { ageYears: 16, currentHeightCm: 185, motherHeightCm: 155, fatherHeightCm: 165 });
const fresh = { ...demo, goal: null, profile: { ...demo.profile, sex: null }, habits: { sleepHours: null, activity: null, diet: null } };

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const browser = await chromium.launch();
const log = [];

async function shot(name, route, state, { scheme = 'light', w = 390, h = 844, wait = 2600, act } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: UA, colorScheme: scheme });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push('pageerror: ' + String(e.message).split('\n')[0]));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text().split('\n')[0].slice(0, 200)); });
  await page.addInitScript((st) => {
    try {
      if (!sessionStorage.getItem('seeded')) {
        localStorage.setItem('app-store', JSON.stringify({ state: st, version: 2 }));
        sessionStorage.setItem('seeded', '1');
      }
    } catch {}
  }, state);
  try {
    await page.goto(base + route, { waitUntil: 'load', timeout: 30000 });
    await page.waitForTimeout(wait);
    if (act) await act(page);
    await page.screenshot({ path: path.join(out, name + '.png') });
    const text = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 1800);
    const url = new URL(page.url()).pathname;
    const store = await page.evaluate(() => localStorage.getItem('app-store'));
    log.push({ name, ok: true, url, errs, text, store });
    console.log('ok', name, url, errs.length ? JSON.stringify(errs.slice(0, 3)) : '');
  } catch (e) {
    log.push({ name, ok: false, errs: [String(e.message)] });
    console.log('FAIL', name, e.message.split('\n')[0]);
  }
  await ctx.close();
}
const click = (text) => async (page) => { await page.getByText(text, { exact: true }).last().click(); await page.waitForTimeout(1800); };

for (const r of ['goal', 'about', 'height', 'parents', 'building', 'reveal', 'habits', 'plan', 'priming', 'paywall'])
  await shot(`child-${r}`, `/onboarding/${r}`, child, { wait: r === 'building' ? 2000 : 2600 });
await shot('child-home-free', '/home', { ...child, onboardingCompleted: true });
await shot('final-plan', '/onboarding/plan', girl17);
await shot('final-paywall', '/onboarding/paywall', girl17);
await shot('girl17-reveal-tall', '/onboarding/reveal', girl17, { wait: 3200, h: 1400 });
await shot('girl17-home', '/home', { ...girl17, onboardingCompleted: true });
await shot('boy19-reveal-tall', '/onboarding/reveal', boy19, { wait: 3200, h: 1400 });
await shot('shortparents-reveal-tall', '/onboarding/reveal', shortBoy, { wait: 3200, h: 1400 });
await shot('unknowndad-parents', '/onboarding/parents', unknownDad);
await shot('unknowndad-building', '/onboarding/building', unknownDad, { wait: 2000 });
await shot('unknowndad-reveal-tall', '/onboarding/reveal', unknownDad, { wait: 3200, h: 1500 });
await shot('bothunknown-reveal-tall', '/onboarding/reveal', bothUnknown, { wait: 3200, h: 1500 });
for (const r of ['height', 'parents', 'building', 'reveal'])
  await shot(`imperial-${r}`, `/onboarding/${r}`, imperial, { wait: r === 'building' ? 2000 : 3000 });
await shot('imperial-home', '/home', { ...imperial, onboardingCompleted: true });
await shot('home-free', '/home', freeHome);
await shot('home-free-tall', '/home', freeHome, { h: 1700 });
await shot('home-pro-tall', '/home', proHome, { h: 2600 });
await shot('home-free-seepro', '/home', freeHome, { act: click('See Pro') });
await shot('home-seepro-X', '/home', freeHome, { act: async (p) => { await click('See Pro')(p); await p.getByLabel('Close').last().click(); await p.waitForTimeout(1500); } });
await shot('home-open-reveal', '/home', proHome, { act: async (p) => { await p.getByLabel('Open your prediction').click(); await p.waitForTimeout(3000); } });
await shot('home-reset', '/home', proHome, { h: 2600, act: async (p) => { await p.getByText('Reset demo').click(); await p.waitForTimeout(2500); } });
await shot('paywall-X-first', '/onboarding/paywall', demo, { act: async (p) => { await p.getByLabel('Close').last().click(); await p.waitForTimeout(2000); } });
await shot('paywall-weekly', '/onboarding/paywall', demo, { act: click('Weekly') });
await shot('paywall-cta-welcome', '/onboarding/paywall', demo, { act: click('Start my free week') });
await shot('reveal-share-toast', '/onboarding/reveal', demo, { wait: 3000, act: async (p) => { await p.getByText('Share my range').click(); await p.waitForTimeout(500); } });
await shot('reveal-howcalc', '/onboarding/reveal', demo, { wait: 3000, h: 1500, act: async (p) => { await p.getByText('How we calculate this').click(); await p.waitForTimeout(800); } });
await shot('reveal-tap-units', '/onboarding/reveal', demo, { wait: 3000, act: async (p) => { await p.getByText('Tap to switch between cm and ft.').click(); await p.waitForTimeout(800); } });
await shot('nosex-reveal', '/onboarding/reveal', S({}, { sex: null }));
await shot('nosex-home', '/home', S({ onboardingCompleted: true }, { sex: null }));
await shot('index-fresh', '/', fresh);
await shot('habits-empty', '/onboarding/habits', S({ habits: { sleepHours: null, activity: null, diet: null } }));
await shot('goal-empty', '/onboarding/goal', S({ goal: null }));
await shot('parents-off', '/onboarding/parents', S({}, { motherHeightCm: 110 }));
for (const r of ['promise', 'goal', 'about', 'height', 'parents', 'reveal', 'habits', 'plan', 'priming', 'paywall', 'welcome'])
  await shot(`small-${r}`, `/onboarding/${r}`, demo, { w: 360, h: 740, wait: 3000 });
await shot('small-home', '/home', proHome, { w: 360, h: 740 });
await shot('dark-unknowndad-reveal-tall', '/onboarding/reveal', unknownDad, { scheme: 'dark', wait: 3200, h: 1500 });
await shot('dark-home-free-tall', '/home', freeHome, { scheme: 'dark', h: 1700 });
await shot('dark-child-plan', '/onboarding/plan', child, { scheme: 'dark' });
await shot('dark-parents-off', '/onboarding/parents', S({}, { motherHeightCm: 110 }), { scheme: 'dark' });

writeFileSync(path.join(out, 'log.json'), JSON.stringify(log, null, 2));
await browser.close();
server.close();
