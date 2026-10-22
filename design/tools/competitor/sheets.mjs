// Builds legible 12-up review sheets (2 rows x 6) of the competitor onboarding screens.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from "node:path";

const dir = path.resolve(process.argv[2] ?? '../../../research/competitor-screens');
const files = fs.readdirSync(dir).filter((f) => /^\d+\.png$/.test(f)).sort();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2460, height: 1900 } });
for (let i = 0; i < files.length; i += 12) {
  const cells = files.slice(i, i + 12).map((f) =>
    `<figure><img src="data:image/png;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}"><figcaption>${f}</figcaption></figure>`).join('');
  await page.setContent(`<style>body{margin:0;background:#fff;font:600 28px sans-serif}
    main{display:grid;grid-template-columns:repeat(6,400px);gap:10px;padding:10px}
    figure{margin:0}img{width:400px;display:block;border:1px solid #ccc}figcaption{text-align:center}</style><main>${cells}</main>`);
  await page.waitForLoadState('networkidle');
  await page.locator('main').screenshot({ path: path.join(dir, `_review-${String(i / 12 + 1)}.png`) });
}
await browser.close();
console.log(files.length, 'screens');
