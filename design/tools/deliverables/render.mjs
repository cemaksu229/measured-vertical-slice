import { chromium } from 'playwright';
import path from 'node:path'; import url from 'node:url'; import fs from 'node:fs';
const here = path.dirname(url.fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../../deliverables');
fs.mkdirSync(out + '/appstore', { recursive: true });
const f = n => url.pathToFileURL(path.join(here, n)).href;
const b = await chromium.launch();
const p = await b.newPage();
for (const [h, o] of [['vp.html', 'value-proposition.pdf'], ['mb.html', 'moodboard-toolstack.pdf']]) {
  await p.goto(f(h));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(800);
  await p.pdf({ path: `${out}/${o}`, preferCSSPageSize: true, printBackground: true });
}
const S = [
  ['01', '07-reveal-light', 'Your height range in 60 seconds', 'A 4-question quiz, then your honest range. Free.', false],
  ['02', '07-reveal-dark', 'See your result before any paywall', 'Method stated. No lock, no sign-up.', true],
  ['03', '09-plan-light', 'Habits that help you reach your range', 'A weekly plan built from your answers.', false],
  ['04', '11-paywall-dark', 'Honest pricing. Cancel anytime.', 'Full price and trial end date, up front.', true],
];
const p2 = await b.newPage({ viewport: { width: 1290, height: 2796 } });
for (const [n, scr, h, s, dark] of S) {
  const hp=path.join(here,'_shot.html');fs.writeFileSync(hp,`<link rel=stylesheet href="${f('common.css')}"><style>
  body{width:1290px;height:2796px;overflow:hidden;background:${dark ? '#141414' : '#F6F4EF'};color:${dark ? '#F6F4EF' : '#141414'};text-align:center}
  h1{font-size:128px;line-height:1.02;padding:170px 110px 0}
  p{font-size:48px;margin-top:36px;color:${dark ? '#A3A3A3' : '#6B6B6B'}}
  .ph{position:absolute;left:165px;top:600px;width:960px;height:2150px;border-radius:110px;border:16px solid ${dark ? '#2a2a2a' : '#141414'};overflow:hidden;background:${dark ? '#141414' : '#F6F4EF'}}
  .ph img{width:100%;display:block;margin-top:40px}
  </style><h1>${h}</h1><p>${s}</p><div class=ph><img src="${f('../../export/screens/' + scr + '.png')}"></div>`);
  await p2.goto(url.pathToFileURL(hp).href);
  await p2.evaluate(() => document.fonts.ready);
  await p2.waitForTimeout(600);
  await p2.screenshot({ path: `${out}/appstore/${n}.png` });
}
await b.close();
