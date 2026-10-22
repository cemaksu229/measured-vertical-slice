import { chromium } from 'playwright';
const R = {
 taller:'https://screensdesign.com/showcase/taller-maximize-your-height',
 finch:'https://screensdesign.com/articles/finch-app-onboarding-design/',
 calm:'https://screensdesign.com/explore/apps/calm/onboarding/',
 iam:'https://screensdesign.com/explore/apps/i-am/onboarding/',
 height:'https://kombai.com/gallery/inspirations/slider-ios-27/',
 rise:'https://screensdesign.com/apps/rise-sleep-tracker/',
 calmsleep:'https://screensdesign.com/apps/calm-sleep-rest-relax/',
 wonder:'https://screensdesign.com/showcase/the-wonder-weeks-baby-leaps',
 glow:'https://screensdesign.com/showcase/glow-baby-tracker-growth-app',
 huck:'https://screensdesign.com/showcase/huckleberry-baby-child',
 kinedu:'https://screensdesign.com/showcase/kinedu-baby-development',
 bevel:'https://screensdesign.com/apps/bevel-health-performance/',
 noom:'https://screensdesign.com/apps/noom-weight-loss-food-tracker/',
 calmpay:'https://screensdesign.com/explore/apps/calm/paywall/',
 silbe:'https://screensdesign.com/apps/silbe-fitness-for-her/',
 bettersleep:'https://screensdesign.com/apps/bettersleep-relax-and-sleep/',
};
const b = await chromium.launch();
const ctx = await b.newContext({viewport:{width:1280,height:900}});
await Promise.all(Object.entries(R).map(async([k,u])=>{
  const p = await ctx.newPage();
  try{ await p.goto(u,{waitUntil:'networkidle',timeout:30000}).catch(()=>{});
   await p.waitForTimeout(1500);
   await p.screenshot({path:`refs/${k}.png`});
   console.log('ok',k,await p.title());
  }catch(e){console.log('fail',k,e.message.slice(0,60))}
}));
await b.close();
