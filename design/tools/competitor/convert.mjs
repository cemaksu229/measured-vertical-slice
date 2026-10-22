import fs from 'fs';import {chromium} from 'playwright';
const out='../../../research/competitor-screens';
const meta=JSON.parse(fs.readFileSync('meta.json'));
const b=await chromium.launch();const p=await b.newPage();
await p.setContent('<canvas id=c></canvas>');
async function conv(buf,mime){return await p.evaluate(async([d,m])=>{const bl=await (await fetch(`data:${m};base64,${d}`)).blob();const bm=await createImageBitmap(bl);const c=document.getElementById('c');c.width=bm.width;c.height=bm.height;c.getContext('2d').drawImage(bm,0,0);return {w:bm.width,h:bm.height,d:c.toDataURL('image/png').split(',')[1]}},[buf.toString('base64'),mime])}
// onboarding = flow idx 0..43 ; paywall-flow idx 59..63
const map=[];
for(let i=0;i<=43;i++){const r=await conv(fs.readFileSync(`raw/${String(i).padStart(2,'0')}.webp`),'image/webp');const n=String(i+1).padStart(2,'0');fs.writeFileSync(`${out}/${n}.png`,Buffer.from(r.d,'base64'));map.push([n,i,r.w,r.h])}
for(let i=59;i<=63;i++){const r=await conv(fs.readFileSync(`raw/${i}.webp`),'image/webp');fs.writeFileSync(`${out}/paywall-flow/pw${i}.png`,Buffer.from(r.d,'base64'))}
for(const f of fs.readdirSync('rawas')){const r=await conv(fs.readFileSync('rawas/'+f),'image/jpeg');fs.writeFileSync(`${out}/appstore/${f.replace('.jpg','.png')}`,Buffer.from(r.d,'base64'));console.log(f,r.w,r.h)}
console.log(map.slice(0,2));
// contact sheet
const cell=480,lab=40,cols=6;const cw=cell/2+0; // thumb width 
const tw=470, th=Math.round(tw*1384/640), W=cols*(tw+10)+10, rows=Math.ceil(44/cols);
const html=`<body style="margin:0;background:#222;width:${W}px;display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:10px;padding:10px;box-sizing:border-box;font:bold 28px sans-serif;color:#fff">`+
[...Array(44)].map((_,i)=>{const n=String(i+1).padStart(2,'0');return `<div style="text-align:center"><img src="data:image/png;base64,${fs.readFileSync(`${out}/${n}.png`).toString('base64')}" style="width:${tw}px;display:block"><div style="padding:6px">${n}</div></div>`}).join('')+'</body>';
await p.setViewportSize({width:W,height:800});await p.setContent(html);await p.waitForTimeout(500);
await p.screenshot({path:`${out}/_contact-sheet.png`,fullPage:true});
await b.close();
