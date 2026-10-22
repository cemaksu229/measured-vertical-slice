import { chromium } from 'playwright'; import path from 'node:path'; import url from 'node:url';
const here=path.dirname(url.fileURLToPath(import.meta.url));
const b=await chromium.launch();
for(const [h,w,hh] of [['vp.html',794,1123],['mb.html',1123,794]]){
 const p=await b.newPage({viewport:{width:w,height:hh},deviceScaleFactor:2});
 await p.goto(url.pathToFileURL(path.join(here,h)).href);await p.waitForTimeout(800);
 await p.emulateMedia({media:'print'});
 await p.screenshot({path:'refs/_v-'+h+'.png'});
 console.log(h, await p.evaluate(()=>[document.body.scrollHeight,document.body.scrollWidth]));
}
await b.close();
