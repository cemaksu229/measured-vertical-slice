// Generates design/export/stylesheet.html + stylesheet.png from mobile/src/theme/tokens.ts (read-only).
import { createRequire } from 'node:module';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const out = path.join(root, 'design', 'export');
const fontsSrc = path.join(root, 'mobile', 'assets', 'fonts');

// tokens.ts does require('*.otf'); stub that so it loads outside Metro.
const req = createRequire(import.meta.url);
(req as any).extensions['.otf'] = (m: any, f: string) => {
  m.exports = f;
};
const { register } = req('tsx/cjs/api');
const unregister = register();
const T = req(path.join(root, 'mobile', 'src', 'theme', 'tokens.ts'));
unregister();
const { lightColors, darkColors, fontFamily, spacing, typeScale, radii, motion } = T;

mkdirSync(path.join(out, 'fonts'), { recursive: true });
const fontFiles: Record<string, string> = {};
for (const name of Object.values<string>(fontFamily)) {
  copyFileSync(path.join(fontsSrc, name + '.otf'), path.join(out, 'fonts', name + '.otf'));
  fontFiles[name] = `fonts/${name}.otf`;
}
const fontFace = Object.entries(fontFiles)
  .map(([n, f]) => `@font-face{font-family:'${n}';src:url('${f}') format('opentype');}`)
  .join('\n');

const ts = (k: string) => {
  const t = (typeScale as any)[k];
  return `font-family:'${t.fontFamily}';font-size:${t.fontSize}px;line-height:${t.lineHeight}px;`;
};

const swatch = (name: string, hex: string, c: any) => `
  <div class="sw"><div class="chip" style="background:${hex};${hex.toLowerCase() === c.bg.toLowerCase() ? `outline:1px solid ${c.border};` : ''}"></div>
  <div class="swn">${name}</div><div class="swh">${hex.toUpperCase()}</div></div>`;
const palette = (title: string, c: any) => `
  <div class="pal" style="background:${c.bg};color:${c.text};border-color:${c.border}">
    <div class="cap" style="color:${c.textMuted}">${title}</div>
    <div class="swgrid">${Object.entries(c)
      .map(([k, v]) => swatch(k, v as string, c))
      .join('')}</div>
  </div>`;

const typeSamples: [string, string][] = [
  ['display', '178 cm'],
  ['h1', 'Your projected height'],
  ['h2', 'Tonight’s plan'],
  ['body', 'Measured estimates your adult height from your growth, your parents and your habits.'],
  ['caption', 'Estimate range 170–187 cm. Based on mid-parental height.'],
  ['button', 'Continue'],
];

const L = lightColors;
const D = darkColors;
const html = `<!doctype html><html><head><meta charset="utf-8"><title>Measured — Style sheet</title>
<style>
${fontFace}
*{box-sizing:border-box;margin:0}
body{width:1440px;background:${L.bg};color:${L.text};font-family:'${fontFamily.bodyRegular}';padding:80px 96px 96px;}
h1.title{font-family:'${fontFamily.displaySemibold}';font-size:96px;line-height:96px;letter-spacing:-1px;font-weight:400}
.sub{font-size:20px;color:${L.textMuted};margin-top:16px}
.rule{height:2px;background:${L.text};margin:48px 0 0}
section{padding:40px 0 48px;border-bottom:1px solid ${L.border}}
section:last-of-type{border:0}
.sh{display:flex;gap:32px;align-items:baseline;margin-bottom:28px}
.sh .n{font-family:'${fontFamily.bodySemibold}';font-size:13px;color:${L.brand};width:32px}
.sh h2{font-family:'${fontFamily.displaySemibold}';font-size:30px;font-weight:400}
.sh p{font-size:14px;color:${L.textMuted}}
.cap{font-family:'${fontFamily.bodySemibold}';font-size:12px;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:16px}
.pals{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.pal{border:1px solid;border-radius:${radii.lg}px;padding:28px}
.swgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px 16px}
.chip{height:64px;border-radius:${radii.md}px}
.swn{font-family:'${fontFamily.bodySemibold}';font-size:14px;margin-top:8px}
.swh{font-size:13px;opacity:.7;font-variant-numeric:tabular-nums}
.trow{display:grid;grid-template-columns:200px 1fr;gap:24px;align-items:center;padding:18px 0;border-top:1px solid ${L.border}}
.trow:first-of-type{border-top:0}
.tmeta{font-size:13px;color:${L.textMuted}}.tmeta b{display:block;font-family:'${fontFamily.bodySemibold}';color:${L.text};font-size:15px;font-weight:400}
.fonts{display:flex;gap:48px;margin-top:20px;font-size:14px;color:${L.textMuted}}
.fonts span{font-size:22px;color:${L.text};display:block}
.spr{display:flex;align-items:flex-end;gap:28px}
.sp{font-size:13px;color:${L.textMuted}}.sp i{display:block;background:${L.brand};margin-bottom:8px;height:24px}
.sp b{display:block;color:${L.text};font-family:'${fontFamily.bodySemibold}';font-weight:400}
.rad{display:flex;gap:40px}
.rb{width:200px;height:120px;background:${L.surface};border:2px solid ${L.text};font-size:14px;padding:14px;color:${L.textMuted}}
.rb b{display:block;color:${L.text};font-family:'${fontFamily.bodySemibold}';font-weight:400;font-size:15px}
.mot{display:flex;gap:24px}
.mo{flex:1;border:1px solid ${L.border};background:${L.surface};border-radius:${radii.md}px;padding:20px}
.mo .bar{height:6px;border-radius:3px;background:${L.border};margin:14px 0 10px;position:relative;overflow:hidden}
.mo .bar i{position:absolute;top:0;bottom:0;left:0;background:${L.brand};width:var(--p)}
.mo b{font-family:'${fontFamily.displaySemibold}';font-size:30px;font-weight:400}
.mo span{font-size:13px;color:${L.textMuted}}
.specs{display:grid;grid-template-columns:1fr 1fr;gap:24px}
.spec{border:1px solid ${L.border};border-radius:${radii.lg}px;padding:28px;display:flex;flex-direction:column;gap:16px}
.spec.dk{background:${D.bg};border-color:${D.border}}
.stack{display:flex;flex-direction:column;gap:12px}
.lab{font-size:12px;color:${L.textMuted};margin-bottom:6px}
.btn{display:flex;align-items:center;justify-content:center;min-height:56px;padding:0 ${spacing.lg}px;border-radius:${radii.lg}px;background:${L.brand};color:${L.onBrand};${ts('button')}}
.btn.pressed{transform:scale(.97)}
.btn.disabled{opacity:.5}
.tbtn{display:flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;color:${L.textMuted};${ts('button')}}
.opt{display:flex;align-items:center;gap:${spacing.md}px;min-height:64px;padding:0 ${spacing.md}px;border-radius:${radii.md}px;border:2px solid ${L.border};background:${L.surface};${ts('body')}}
.opt .t{flex:1}.opt .d{width:20px;height:20px;border-radius:10px;border:2px solid ${L.border}}
.opt.sel{border-color:${L.brand}}.opt.sel .d{background:${L.brand};border-color:${L.brand}}
.seg{display:flex;padding:4px;min-height:48px;border-radius:${radii.md + 4}px;background:${L.border}}
.seg div{flex:1;display:flex;align-items:center;justify-content:center;min-height:40px;color:${L.textMuted};font-family:'${fontFamily.bodyMedium}';font-size:17px}
.seg div.on{background:${L.surface};color:${L.text};border-radius:${radii.md}px}
.chips{display:flex;gap:12px}
.pill{display:inline-flex;align-items:center;min-height:32px;padding:0 ${spacing.md}px;border-radius:${radii.pill}px;border:1px solid ${L.border};background:${L.surface};color:${L.text};font-family:'${fontFamily.bodyMedium}';font-size:13px}
.pill.on{background:${L.accent};border-color:${L.accent};color:${L.onAccent}}
.card{background:${L.surface};border:1px solid ${L.border};border-radius:${radii.lg}px;padding:${spacing.lg}px}
.card.hl{border:2px solid ${L.brand}}
.card h3{${ts('h2')};font-weight:400;margin-bottom:6px}
.card p{${ts('body')};color:${L.textMuted}}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.foot{margin-top:40px;font-size:13px;color:${L.textMuted};display:flex;justify-content:space-between}
</style></head><body>
<h1 class="title">Measured — Style sheet</h1>
<div class="sub">Design tokens and component specimens, generated from mobile/src/theme/tokens.ts</div>
<div class="rule"></div>

<section><div class="sh"><span class="n">01</span><h2>Colour</h2><p>Brand and accent are identical in both modes. Success equals accent.</p></div>
<div class="pals">${palette('Light', lightColors)}${palette('Dark', darkColors)}</div></section>

<section><div class="sh"><span class="n">02</span><h2>Typography</h2><p>Clash Display for display and headings, General Sans for text.</p></div>
${typeSamples
  .map(([k, s]) => {
    const t = (typeScale as any)[k];
    return `<div class="trow"><div class="tmeta"><b>${k}</b>${t.fontFamily}<br>${t.fontSize} / ${t.lineHeight}</div><div style="${ts(k)}${k === 'button' ? `background:${L.brand};color:${L.onBrand};display:inline-block;justify-self:start;padding:18px 32px;border-radius:${radii.lg}px` : ''}">${s}</div></div>`;
  })
  .join('')}
<div class="fonts">${Object.values<string>(fontFamily)
  .map((n) => `<div><span style="font-family:'${n}'">Aa 0123</span>${n}</div>`)
  .join('')}</div></section>

<section><div class="sh"><span class="n">03</span><h2>Spacing, radii, motion</h2><p>8pt grid.</p></div>
<div class="cap">Spacing</div>
<div class="spr">${Object.entries(spacing)
  .map(([k, v]) => `<div class="sp"><i style="width:${v}px"></i><b>${k}</b>${v}</div>`)
  .join('')}</div>
<div class="cap" style="margin-top:36px">Radii</div>
<div class="rad">${Object.entries(radii)
  .map(([k, v]) => `<div class="rb" style="border-radius:${Math.min(v as number, 60)}px"><b>${k}</b>${v}</div>`)
  .join('')}</div>
<div class="cap" style="margin-top:36px">Motion</div>
<div class="mot">${Object.entries(motion)
  .map(([k, v]) => `<div class="mo"><b>${v} ms</b><div class="bar"><i style="--p:${Math.round(((v as number) / 800) * 100)}%"></i></div><span>${k}</span></div>`)
  .join('')}
<div class="mo"><b>0.97</b><div class="bar"><i style="--p:97%"></i></div><span>press scale</span></div></div></section>

<section><div class="sh"><span class="n">04</span><h2>Components</h2><p>Drawn in HTML/CSS to match mobile/src/components.</p></div>
<div class="specs">
 <div class="spec">
  <div class="cap">Primary button</div>
  <div class="stack">
   <div><div class="lab">Default</div><div class="btn">Continue</div></div>
   <div><div class="lab">Pressed (scale 0.97)</div><div class="btn pressed">Continue</div></div>
   <div><div class="lab">Disabled (opacity 0.5)</div><div class="btn disabled">Continue</div></div>
   <div><div class="lab">Text button</div><div class="tbtn">Skip for now</div></div>
  </div>
 </div>
 <div class="spec">
  <div class="cap">Option row</div>
  <div class="stack">
   <div><div class="lab">Unselected</div><div class="opt"><span class="t">Reach my potential</span><span class="d"></span></div></div>
   <div><div class="lab">Selected</div><div class="opt sel"><span class="t">Know my final height</span><span class="d"></span></div></div>
  </div>
  <div class="cap" style="margin-top:12px">Segmented</div>
  <div class="seg"><div class="on">Metric</div><div>Imperial</div></div>
  <div class="cap" style="margin-top:12px">Chip</div>
  <div class="chips"><span class="pill">7–8 h sleep</span><span class="pill on">Done</span></div>
 </div>
 <div class="spec" style="grid-column:span 2">
  <div class="cap">Card</div>
  <div class="cards">
   <div class="card"><h3>178 cm</h3><p>Range 170–187 cm</p></div>
   <div class="card hl"><h3>Pro</h3><p>Highlighted card with brand border</p></div>
  </div>
 </div>
 <div class="spec dk" style="grid-column:span 2">
  <div class="cap" style="color:${D.textMuted}">Dark mode specimens</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;align-items:start">
   <div class="stack"><div class="btn">Continue</div><div class="tbtn" style="color:${D.textMuted}">Skip for now</div>
    <div class="seg" style="background:${D.border}"><div class="on" style="background:${D.surface};color:${D.text}">Metric</div><div style="color:${D.textMuted}">Imperial</div></div></div>
   <div class="stack"><div class="opt" style="background:${D.surface};border-color:${D.border};color:${D.text}"><span class="t">Unselected</span><span class="d" style="border-color:${D.border}"></span></div>
    <div class="opt sel" style="background:${D.surface};color:${D.text}"><span class="t">Selected</span><span class="d"></span></div></div>
   <div class="stack"><div class="card" style="background:${D.surface};border-color:${D.border};color:${D.text}"><h3>178 cm</h3><p style="color:${D.textMuted}">Range 170–187 cm</p></div>
    <div class="chips"><span class="pill" style="background:${D.surface};border-color:${D.border};color:${D.text}">Sleep</span><span class="pill on">Done</span></div></div>
  </div>
 </div>
</div></section>
<div class="foot"><span>Measured</span><span>Generated from tokens.ts</span></div>
</body></html>`;

writeFileSync(path.join(out, 'stylesheet.html'), html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(out, 'stylesheet.html')).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(out, 'stylesheet.png'), fullPage: true });
await browser.close();
console.log('stylesheet ok ->', path.join(out, 'stylesheet.png'));
