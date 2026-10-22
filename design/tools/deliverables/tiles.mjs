import { chromium } from 'playwright';
const R = {taller:'https://screensdesign.com/showcase/taller-maximize-your-height',
 calm:'https://screensdesign.com/explore/apps/calm/onboarding/',
 calmpay:'https://screensdesign.com/explore/apps/calm/paywall/',
 iam:'https://screensdesign.com/explore/apps/i-am/onboarding/',
 glow:'https://screensdesign.com/showcase/glow-baby-tracker-growth-app',
 huck:'https://screensdesign.com/showcase/huckleberry-baby-child',
 kinedu:'https://screensdesign.com/showcase/kinedu-baby-development',
 wonder:'https://screensdesign.com/showcase/the-wonder-weeks-baby-leaps'};
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:1280,height:900},deviceScaleFactor:2});
await Promise.all(Object.entries(R).map(async([k,u])=>{
  const p = await ctx.newPage();
  await p.goto(u,{waitUntil:'networkidle',timeout:30000}).catch(()=>{});
  await p.waitForTimeout(1000);
  const imgs = await p.$$('img');
  let n=0;
  for(const im of imgs){
    const bb = await im.boundingBox(); if(!bb||bb.width<120||bb.height<200) continue;
    try{ await im.scrollIntoViewIfNeeded(); await p.waitForTimeout(250);
      await im.screenshot({path:`refs/t-${k}-${n}.png`}); n++; }catch{}
    if(n>=16) break;
  }
  console.log(k,n);
}));
await b.close();
