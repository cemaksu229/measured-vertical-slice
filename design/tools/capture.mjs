// Builds the Expo web bundle (read-only from mobile/), serves it as SPA, screenshots every route.
// Usage: node capture.mjs [--skip-build] [--only light|dark]
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const mobile = path.join(root, 'mobile');
const dist = path.join(here, '.web-dist');
const shadow = path.join(here, '.web-src');
const outDir = path.join(root, 'design', 'export');
const shots = path.join(outDir, 'screens');

const args = process.argv.slice(2);
const skipBuild = args.includes('--skip-build');
const onlyIdx = args.indexOf('--only');
const only = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const schemes = only ? [only] : ['light', 'dark'];

// ---------- build ----------
// mobile/app.json has web.output = "server" (SSR crashes on AsyncStorage: "window is not defined"
// and yields no static index.html). We build from a shadow copy with output "single" so mobile/ is untouched.
if (!skipBuild) {
  rmSync(shadow, { recursive: true, force: true });
  mkdirSync(shadow, { recursive: true });
  for (const f of ['package.json', 'tsconfig.json', 'app.json']) cpSync(path.join(mobile, f), path.join(shadow, f));
  for (const d of ['src', 'assets']) cpSync(path.join(mobile, d), path.join(shadow, d), { recursive: true });
  symlinkSync(path.join(mobile, 'node_modules'), path.join(shadow, 'node_modules'), 'junction');
  const app = JSON.parse(readFileSync(path.join(shadow, 'app.json'), 'utf8'));
  app.expo.web = { ...(app.expo.web || {}), output: 'single' };
  writeFileSync(path.join(shadow, 'app.json'), JSON.stringify(app, null, 2));
  rmSync(dist, { recursive: true, force: true });
  console.log('> expo export --platform web (single) ...');
  const r = spawnSync('npx', ['expo', 'export', '--platform', 'web', '--output-dir', dist], {
    cwd: shadow,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, CI: '1' },
  });
  rmSync(path.join(shadow, 'node_modules'), { recursive: true, force: true }); // removes junction only
  if (r.status !== 0) {
    console.error('Expo web export FAILED (see output above).');
    process.exit(1);
  }
}
if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('No index.html in ' + dist + ' (run without --skip-build).');
  process.exit(1);
}

// ---------- SPA static server ----------
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.otf': 'font/otf', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.map': 'application/json' };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = path.join(dist, p);
  if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) file = path.join(dist, 'index.html');
  res.writeHead(200, { 'content-type': mime[path.extname(file)] || 'application/octet-stream' });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// ---------- state ----------
const demo = {
  goal: 'reach-potential',
  unit: 'metric',
  profile: { sex: 'male', ageYears: 14, currentHeightCm: 160, motherHeightCm: 163, fatherHeightCm: 177 },
  habits: { sleepHours: '7-8', activity: 'medium', diet: 'ok' },
  completedHabitIds: [],
  isPro: false,
  onboardingCompleted: false,
  notificationsAsked: false,
};
const homeState = { ...demo, isPro: true, onboardingCompleted: true, completedHabitIds: ['sleep-duration', 'nutrition-protein'] };

const steps = [
  ['promise', '/onboarding/promise'],
  ['goal', '/onboarding/goal'],
  ['about', '/onboarding/about'],
  ['height', '/onboarding/height'],
  ['parents', '/onboarding/parents'],
  ['building', '/onboarding/building', 1000],
  ['reveal', '/onboarding/reveal'],
  ['habits', '/onboarding/habits'],
  ['plan', '/onboarding/plan'],
  ['priming', '/onboarding/priming'],
  ['paywall', '/onboarding/paywall'],
  ['welcome', '/onboarding/welcome'],
  ['home', '/home', 2500, homeState],
].map(([name, route, wait = 2500, state = demo], i) => ({ n: String(i + 1).padStart(2, '0'), name, route, wait, state }));

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
mkdirSync(shots, { recursive: true });

const browser = await chromium.launch();
const results = [];
for (const scheme of schemes) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: UA,
    colorScheme: scheme,
  });
  for (const s of steps) {
    const file = `${s.n}-${s.name}-${scheme}.png`;
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e.message).split('\n')[0]));
    await page.addInitScript((state) => {
      try {
        localStorage.setItem('app-store', JSON.stringify({ state, version: 2 }));
      } catch {}
    }, s.state);
    try {
      await page.goto(base + s.route, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(s.wait);
      await page.screenshot({ path: path.join(shots, file) });
      const finalPath = new URL(page.url()).pathname;
      results.push({ file, ok: true, finalPath, errs });
      console.log(`ok  ${file}${finalPath !== s.route ? '  (landed on ' + finalPath + ')' : ''}${errs.length ? '  errors: ' + errs[0] : ''}`);
    } catch (e) {
      results.push({ file, ok: false, errs: [e.message] });
      console.log(`FAIL ${file}: ${e.message.split('\n')[0]}`);
    }
    await page.close();
  }
  await ctx.close();
}

// ---------- board-ours.png (light screens in one row) ----------
if (schemes.includes('light')) {
  const cells = steps
    .filter((s) => results.find((r) => r.file === `${s.n}-${s.name}-light.png` && r.ok))
    .map(
      (s) => `<figure><img src="${pathToFileURL(path.join(shots, `${s.n}-${s.name}-light.png`)).href}"><figcaption>${s.n} ${s.name}</figcaption></figure>`,
    )
    .join('');
  const fonts = ['GeneralSans-Semibold'].map((n) => `@font-face{font-family:'${n}';src:url('${pathToFileURL(path.join(mobile, 'assets/fonts', n + '.otf')).href}')}`).join('');
  const boardHtml = path.join(here, '.board.html');
  writeFileSync(
    boardHtml,
    `<!doctype html><meta charset="utf-8"><style>${fonts}
    body{margin:0;background:#F6F4EF;display:flex;gap:40px;padding:40px;width:max-content}
    figure{margin:0;width:390px}img{width:390px;height:844px;display:block;border-radius:24px;box-shadow:0 0 0 1px #E3E0D8}
    figcaption{font:600 22px 'GeneralSans-Semibold',sans-serif;color:#141414;margin-top:20px;text-align:center;text-transform:capitalize}</style>${cells}`,
  );
  const bp = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 2 });
  await bp.goto(pathToFileURL(boardHtml).href);
  await bp.waitForTimeout(500);
  await bp.screenshot({ path: path.join(outDir, 'board-ours.png'), fullPage: true });
  await bp.close();
  rmSync(boardHtml, { force: true });
  console.log('board -> ' + path.join(outDir, 'board-ours.png'));
}
await browser.close();
server.close();
const bad = results.filter((r) => !r.ok);
console.log(`\nDone: ${results.length - bad.length}/${results.length} captured -> ${shots}`);
process.exit(bad.length ? 2 : 0);
