// Renders deliverables/teardown.pdf from research/teardown-data.json + research/competitor-screens/*.png
// Usage: node deliverables/teardown.mjs [--screens <dir>] [--data <json>] [--out <pdf>] [--png <dir>]
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..', '..');
const argv = process.argv.slice(2);
const arg = (n, d) => { const i = argv.indexOf(n); return i >= 0 ? path.resolve(argv[i + 1]) : d; };
const screensDir = arg('--screens', path.join(root, 'research', 'competitor-screens'));
const dataPath = arg('--data', path.join(root, 'research', 'teardown-data.json'));
const outPdf = arg('--out', path.join(root, 'deliverables', 'teardown.pdf'));
const pngDir = arg('--png', null);
const fontDir = path.join(root, 'design', 'export', 'fonts');

const D = JSON.parse(readFileSync(dataPath, 'utf8'));
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const MAX_SHOTS = 44;

// ---- screenshots ----
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const dataUri = (f) => `data:${mime[path.extname(f).toLowerCase()]};base64,${readFileSync(f).toString('base64')}`;
const files = existsSync(screensDir)
  ? readdirSync(screensDir).filter((f) => /^\d+\.(png|jpe?g|webp)$/i.test(f)).sort((a, b) => parseInt(a) - parseInt(b)).slice(0, MAX_SHOTS)
  : [];
const annByFile = Object.fromEntries((D.annotations || []).map((a) => [a.file, a]));
const annFor = (f) => annByFile[f] || annByFile[f.replace(/\.\w+$/, '.png')] || {};

// placeholder structure (31 steps)
const PH = [];
for (const s of D.placeholderFlow.steps) for (let i = 0; i < (s.count || 1); i++) PH.push({ title: s.title, type: s.type });
while (PH.length < D.placeholderFlow.total) PH.splice(PH.length - 2, 0, { title: s => s, type: 'quiz' });
const steps = files.length
  ? files.map((f, i) => {
      const a = annFor(f);
      return { n: i + 1, img: dataUri(path.join(screensDir, f)), type: a.type || 'other', title: a.title || '', notes: a.notes || [], friction: !!a.friction, frictionNote: a.frictionNote || '', real: true, file: f };
    })
  : PH.slice(0, D.placeholderFlow.total).map((p, i) => ({ n: i + 1, type: p.type, title: typeof p.title === 'string' ? p.title : 'Personal data', notes: [], friction: false, real: false }));
const real = files.length > 0;

// ---- helpers ----
const c = D.counts, m = D.measured;
const pend = (v, unit = "") => (v === null || v === undefined || v === "" ? `<span class="pend">measure pending</span>` : `${esc(v)}${unit}`);
const lc = (v) => (String(v ?? "").length > 6 ? " long" : "");
const TYPE_LABEL = { promise: 'Promise', quiz: 'Quiz', loading: 'Loading', paywall: 'Paywall', result: 'Result', other: 'Other' };
const tag = (t) => `<span class="tag t-${esc(t)}">${TYPE_LABEL[t] || 'Other'}</span>`;
const sec = (v) => (v ? '' : '<span class="sec">SECONDARY</span>');
const frictionCount = steps.filter((s) => s.friction).length;
const verdict = D.verdict || D.verdictFallback;

const frame = (s) => s.real
  ? `<img src="${s.img}">`
  : `<div class="ph"><div class="phn">${s.n}</div><div class="pht">${esc(s.title)}</div></div>`;

const cell = (s) => `
  <div class="cell">
    <div class="shot ${s.friction ? 'fr' : ''}">${frame(s)}
      <div class="num">${s.n}</div>${s.friction ? '<div class="badge">!</div>' : ''}
    </div>
    ${tag(s.type)}
    <div class="ct">${esc(s.title || (s.real ? '' : 'Placeholder'))}</div>
    ${s.friction && s.frictionNote ? `<div class="cf">${esc(s.frictionNote)}</div>` : ''}
    ${s.notes.slice(0, 1).map((n) => `<div class="cn">${esc(n)}</div>`).join('')}
  </div>`;

const PER = 22;
const flowPages = [];
for (let i = 0; i < Math.max(steps.length, 1); i += PER) flowPages.push(steps.slice(i, i + PER));
if (flowPages.length > 2) flowPages.length = 2; // keep <= 6 pages total
const flowHtml = flowPages.map((chunk, pi) => `
  <section class="page">
    ${head(`Flow strip ${pi + 1}/${flowPages.length}`, pi === 0 ? 'Every screen, in order' : 'Every screen, in order (cont.)')}
    ${pi === 0 ? `<p class="lede">${real
      ? `${steps.length} screens captured. Red badge = friction point${frictionCount ? ` (${frictionCount} marked)` : ''}. Tags show screen type.`
      : `No screenshots yet. These frames are a <b>placeholder layout</b> built from the 31-step structure reported by ScreensDesign (secondary source); types are inferred, not observed.`}</p>` : ''}
    <div class="grid">${chunk.map(cell).join('')}</div>
    ${pi === flowPages.length - 1 && steps.length > PER * 2 ? `<p class="small">Showing first ${PER * 2} of ${steps.length} screens.</p>` : ''}
    <p class="small src2">${esc(D.screensSource || "")}</p>
    <div class="legend"><span><i class="lg red"></i>Friction point</span><span>${tag('quiz')} question</span><span>${tag('paywall')} paywall</span><span>${tag('result')} result</span></div>
  </section>`).join('');

function head(kicker, title) {
  return `<header><div class="kick">${esc(kicker)}</div><h2>${esc(title)}</h2></header>`;
}
function foot(n, total) { return ''; }

// ---- cover ----
const stat = (label, g, me, unit) => `
  <div class="stat"><div class="sl">${label}</div>
    <div class="sv"><div class="sg"><small>GoTall</small><b class="${lc(g).trim()}">${pend(g)}</b></div><div class="sm"><small>Measured</small><b class="${lc(me).trim()}">${esc(me)}</b></div></div>
  </div>`;
const cover = `
  <section class="page cover">
    <div class="cv-top"><div class="brand">Measured</div><div class="kick">Competitor teardown</div></div>
    <h1>GoTall<br><span class="vs">vs</span> Measured</h1>
    <p class="sub">An annotated teardown of GoTall's onboarding, and what we did differently.</p>
    <div class="rev"><div class="kick">Competitor</div>
      <b>${esc(D.app.name)}</b> by ${esc(D.app.publisher)}<br>
      ${esc(D.app.revenue)}<br><span class="small">${esc(D.app.appStoreUrl)}</span></div>
    <div class="stats">
      ${stat('Screens to result', c.screensToResult, m.screensToResult)}
      ${stat('Taps to result', c.tapsToResult, m.tapsToResult)}
      ${stat('Seconds to result', c.secondsToResult, m.secondsToResult)}
      ${stat('Screens to paywall', c.screensToPaywall, m.screensToPaywall)}
      ${stat('Taps to paywall', c.tapsToPaywall, '-')}
      ${stat('Seconds to paywall', c.secondsToPaywall, '-')}
    </div>
    <p class="small">GoTall reported flow: ${esc(c.reportedFlowSteps)} steps (${esc(c.reportedFlowSource)}). Measured &ndash; ${esc(m.note)}</p>
    <div class="verdict"><div class="kick" style="color:#141414">Verdict</div>${esc(verdict)}</div>
  </section>`;

// ---- promise page ----
const P = D.promise;
const used = (v) => v === true ? '<span class="yes">Changes a later screen</span>' : v === false ? '<span class="no">Collected, never used</span>' : '<span class="pend">to verify</span>';
const promisePage = `
  <section class="page">
    ${head('Promise and personalisation', 'What screen 1 promises, and what matters')}
    <div class="two">
      <div>
        ${steps[0]?.real ? `<div class="big"><img src="${steps[0].img}"></div>` : `<div class="big"><div class="ph"><div class="phn">1</div><div class="pht">Screenshot slot: screen 1 (01.png)</div></div></div>`}
      </div>
      <div>
        <div class="kick">Screen 1 promise</div>
        <p class="quote">${P.headline ? esc(P.headline) : '<span class="pend">headline pending - copy it from 01.png</span>'}</p>
        <div class="kick">Benefit or feature?</div>
        <p><b>${esc(P.benefitOrFeature)}</b></p>
        <p class="small">${esc(P.benefitOrFeatureNote)}</p>
        <div class="kick" style="margin-top:14px">Measured's promise</div>
        <p>Your honest adult height, in 60 seconds. <span class="small">4 questions, no account, result before any paywall.</span></p>
        <p class="small">${esc(P.measuredAnswer)}</p>
      </div>
    </div>
    <h3>Questions asked vs questions that change later screens</h3>
    <table><thead><tr><th>Question (GoTall)</th><th>Used later?</th><th>Note</th></tr></thead><tbody>
      ${P.askedVsUsed.map((q) => `<tr><td>${esc(q.question)}</td><td>${used(q.changesLater)}</td><td>${esc(q.note)}</td></tr>`).join('')}
    </tbody></table>
    <h3>Measured: every answer changes something</h3>
    <table><thead><tr><th>Answer</th><th>What changes</th></tr></thead><tbody>
      <tr><td>Goal</td><td>Wording on reveal, plan and paywall headlines</td></tr>
      <tr><td>Sex, age</td><td>Growth curve, confidence note, building lines</td></tr>
      <tr><td>Height, unit</td><td>"X cm to go", silhouette, units everywhere</td></tr>
      <tr><td>Parents / "I don't know"</td><td>Silhouette row, range width (+/-8.5 to +/-10.5 cm) and a note</td></tr>
      <tr><td>Sleep, activity, diet</td><td>Which habits appear in the plan, and their order</td></tr>
    </tbody></table>
    <p class="small">Source: design/measured-slice-spec.md section 3. GoTall rows marked "to verify" need a screenshot check.</p>
  </section>`;

// ---- paywall page ----
const pw = D.paywall;
let pwImg = null;
const pwFile = path.join(screensDir, pw.screenshotFile || 'paywall.png');
if (existsSync(pwFile)) pwImg = dataUri(pwFile);
else { const s = steps.find((x) => x.real && x.type === 'paywall'); if (s) pwImg = s.img; }
const paywallPage = `
  <section class="page">
    ${head('Paywall teardown', 'Where the result gets held back')}
    <div class="two pw">
      <div class="big">${pwImg ? `<img src="${pwImg}">` : `<div class="ph"><div class="phn">$</div><div class="pht">Screenshot slot: paywall<br>(paywall.png)</div></div>`}</div>
      <div>
        <table class="facts"><tbody>
          ${pw.facts.map((f) => `<tr><td class="fl">${esc(f.label)}</td><td>${f.value ? esc(f.value) : '<span class="pend">measure pending</span>'}${sec(f.verified)}<div class="src">${esc(f.source)}</div></td></tr>`).join('')}
        </tbody></table>
      </div>
    </div>
    <h3>Dark patterns</h3>
    <ul class="dp">${pw.darkPatterns.map((d) => `<li><i class="lg red"></i>${esc(d)}</li>`).join('')}</ul>
    <div class="verdict ours"><div class="kick" style="color:#141414">How Measured answers it</div>${esc(pw.measuredAnswer)}</div>
  </section>`;

// ---- reviews page ----
const R = D.reviews;
const maxC = Math.max(...R.themes.map((t) => t.count));
const reviewsPage = `
  <section class="page">
    ${head('Reviews to design opportunities', 'What users complain about, and our answer')}
    <p class="lede">${esc(R.sample)}</p>
    <table class="rv"><thead><tr><th style="width:30%">Theme</th><th style="width:7%">Count</th><th style="width:33%">Quote</th><th style="width:30%">How Measured answers it</th></tr></thead><tbody>
      ${R.themes.map((t) => `<tr><td><b>${esc(t.theme)}</b></td><td><div class="cnt">${t.count}</div><div class="bar"><i style="width:${Math.round((t.count / maxC) * 100)}%"></i></div></td><td class="q">"${esc(t.quote)}"</td><td class="ans">${esc(t.answer)}</td></tr>`).join('')}
    </tbody></table>
    <p class="small">Counts are keyword tallies over 119 low-star reviews and overlap; quotes are verbatim from the Apple RSS feed. Source: research/gotall-research.md.</p>
  </section>`;

// ---- html ----
const font = (name, file, w) => `@font-face{font-family:'${name}';font-weight:${w};src:url(data:font/otf;base64,${readFileSync(path.join(fontDir, file)).toString('base64')})}`;
const css = `
${font('Clash', 'ClashDisplay-Medium.otf', 500)}${font('Clash', 'ClashDisplay-Semibold.otf', 600)}
${font('GS', 'GeneralSans-Regular.otf', 400)}${font('GS', 'GeneralSans-Medium.otf', 500)}${font('GS', 'GeneralSans-Semibold.otf', 600)}
:root{--paper:#F6F4EF;--ink:#141414;--brand:#FF5A1F;--lime:#C6F25B;--red:#E5484D;--muted:#6B6B6B;--line:#DAD6CC}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:GS,sans-serif;color:var(--ink);background:var(--paper);font-size:9.5pt;line-height:1.4}
.page{width:210mm;height:297mm;padding:16mm 15mm 14mm;overflow:hidden;page-break-after:always;position:relative;background:var(--paper)}
.page:last-child{page-break-after:auto}
h1{font-family:Clash;font-weight:600;font-size:44pt;line-height:.98;letter-spacing:-.02em}
h2{font-family:Clash;font-weight:600;font-size:21pt;line-height:1.1;letter-spacing:-.01em;margin-bottom:8px}
h3{font-family:Clash;font-weight:600;font-size:12pt;margin:14px 0 6px}
.kick{font-size:7.5pt;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--brand);margin-bottom:3px}
header{border-bottom:2px solid var(--ink);padding-bottom:6px;margin-bottom:10px}
.lede{font-size:9.5pt;margin-bottom:8px;max-width:160mm}
.small{font-size:7.5pt;color:var(--muted)}
.pend{color:var(--red);font-weight:600;font-size:.85em}
.sec{display:inline-block;margin-left:6px;font-size:6pt;font-weight:600;letter-spacing:.08em;border:1px solid var(--muted);color:var(--muted);padding:0 3px;border-radius:3px;vertical-align:middle}
.src{font-size:7pt;color:var(--muted)}
.cover{display:flex;flex-direction:column;gap:8px}
.cv-top{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid var(--ink);padding-bottom:6px}
.brand{font-family:Clash;font-weight:600;font-size:15pt}
.vs{color:var(--brand)}
.sub{font-size:12pt;max-width:140mm}
.rev{background:#fff;border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.stat{background:#fff;border:1px solid var(--line);border-radius:10px;padding:8px 12px}
.sl{font-size:7.5pt;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:4px}
.sv{display:flex;gap:14px}.sv>div{flex:1}.sv small{display:block;font-size:7pt;color:var(--muted)}
.sv b{font-family:Clash;font-weight:600;font-size:17pt;display:inline-block;line-height:1.15}.sv b.long{font-size:8.5pt;font-family:GS;font-weight:600;line-height:1.25}
.sm b{background:var(--lime);padding:0 6px;border-radius:5px}
.sg .pend{font-family:GS;font-size:9pt}
.verdict{background:var(--ink);color:var(--paper);border-radius:10px;padding:10px 14px;font-family:Clash;font-weight:500;font-size:11.5pt;line-height:1.25;margin-top:auto}
.verdict .kick{color:var(--lime)!important}
.verdict.ours{background:var(--lime);color:var(--ink);font-family:GS;font-size:10pt;font-weight:500;margin-top:14px}
.verdict.ours .kick{color:var(--ink)!important}
.grid{display:grid;grid-template-columns:repeat(8,1fr);gap:8px 6px}
.cell{min-width:0}
.shot{position:relative;aspect-ratio:9/19;border:1px solid var(--ink);border-radius:6px;overflow:hidden;background:#fff;margin-bottom:3px}
.shot.fr{border:2px solid var(--red)}
.shot img{width:100%;height:100%;object-fit:cover;display:block}
.num{position:absolute;left:3px;top:3px;background:var(--ink);color:var(--paper);font-weight:600;font-size:6.5pt;padding:0 4px;border-radius:3px}
.badge{position:absolute;right:3px;top:3px;background:var(--red);color:#fff;font-weight:600;font-size:7pt;width:12px;height:12px;border-radius:50%;text-align:center;line-height:12px}
.ph{width:100%;height:100%;min-height:100%;background:repeating-linear-gradient(0deg,transparent 0 7px,rgba(20,20,20,.05) 7px 8px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:5px;text-align:center}
.phn{font-family:Clash;font-weight:600;font-size:18pt;color:var(--line)}
.pht{font-size:6pt;color:var(--muted)}
.tag{display:inline-block;font-size:6pt;font-weight:600;text-transform:uppercase;letter-spacing:.06em;padding:0 4px;border-radius:3px;background:var(--line);color:var(--ink)}
.t-paywall{background:var(--brand);color:#fff}.t-result{background:var(--lime)}.t-quiz{background:#fff;border:1px solid var(--ink)}.t-loading{background:var(--ink);color:var(--paper)}
.ct{font-size:6pt;font-weight:600;line-height:1.2;margin-top:2px}
.cf{font-size:5.6pt;color:var(--red);font-weight:600;line-height:1.2}
.cn{font-size:5.4pt;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:var(--muted);line-height:1.2}
.src2{position:absolute;bottom:18mm;left:15mm;right:15mm}
.legend{position:absolute;bottom:12mm;left:15mm;display:flex;gap:14px;font-size:7.5pt;align-items:center}
.lg{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;vertical-align:middle}.lg.red{background:var(--red)}
.two{display:grid;grid-template-columns:46mm 1fr;gap:16px;align-items:start}
.big{aspect-ratio:9/19;border:1px solid var(--ink);border-radius:10px;overflow:hidden;background:#fff}
.big img{width:100%;height:100%;object-fit:cover}
.big .ph .phn{font-size:34pt}.big .pht{font-size:8pt}
.quote{font-family:Clash;font-weight:500;font-size:14pt;line-height:1.2;margin:2px 0 10px}
table{width:100%;border-collapse:collapse;font-size:8.5pt}
th{text-align:left;font-size:7pt;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);border-bottom:2px solid var(--ink);padding:3px 6px 3px 0}
td{border-bottom:1px solid var(--line);padding:3px 6px 3px 0;vertical-align:top}
.yes{background:var(--lime);padding:0 4px;border-radius:3px;font-weight:600;font-size:8pt}
.no{color:var(--red);font-weight:600}
.facts td{font-size:8.3pt}.fl{font-weight:600;width:30%}
.pw{grid-template-columns:62mm 1fr}
.dp{list-style:none;font-size:9pt}.dp li{padding:3px 0;border-bottom:1px solid var(--line)}
.rv td{font-size:8.3pt;padding:8px 8px 8px 0}.rv .q{font-style:italic}.rv .ans{font-weight:500}
.cnt{font-family:Clash;font-weight:600;font-size:16pt;color:var(--red)}
.bar{height:4px;background:var(--line);border-radius:2px;margin-top:3px}.bar i{display:block;height:100%;background:var(--red);border-radius:2px}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Measured - Competitor teardown</title><style>${css}</style></head><body>
${cover}${flowHtml}${promisePage}${paywallPage}${reviewsPage}</body></html>`;

// ---- render ----
mkdirSync(path.dirname(outPdf), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const overflow = await page.evaluate(() => [...document.querySelectorAll('.page')].map((p, i) => {
  const bad = p.scrollHeight > p.clientHeight + 1;
  // also check children extending beyond the page's bottom padding
  const pr = p.getBoundingClientRect();
  const kids = [...p.children].filter((k) => getComputedStyle(k).position !== 'absolute');
  const last = kids.length ? kids[kids.length - 1].getBoundingClientRect().bottom : 0;
  return { page: i + 1, scrollOver: bad, bottomGapPx: Math.round(pr.bottom - last) };
}));
await page.pdf({ path: outPdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
if (pngDir) {
  mkdirSync(pngDir, { recursive: true });
  const els = await page.$$('.page');
  for (let i = 0; i < els.length; i++) await els[i].screenshot({ path: path.join(pngDir, `p${i + 1}.png`) });
}
await browser.close();
const bad = overflow.filter((o) => o.scrollOver || o.bottomGapPx < 30);
console.log(`teardown: ${overflow.length} pages, ${real ? files.length + ' screenshots' : 'placeholder mode'} -> ${outPdf}`);
if (bad.length) console.warn('WARNING possible overflow:', JSON.stringify(bad));
if (overflow.length > 6) { console.error('More than 6 pages'); process.exit(1); }
