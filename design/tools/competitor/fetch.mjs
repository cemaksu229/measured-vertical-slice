import fs from 'fs';
const sd=fs.readFileSync('sd.html','utf8'), as=fs.readFileSync('as.html','utf8');
const imgs=(sd.match(/<img[^>]*>/g)||[]).filter(i=>/avs-pr-640|avs-pp-640/.test(i)).map(i=>({u:i.match(/src="([^"]+)"/)[1],a:i.match(/alt="([^"]*)"/)[1].replace(/&#x27;/g,"'")}));
const seen=new Set();const flow=imgs.filter(i=>!seen.has(i.u)&&seen.add(i.u));
fs.mkdirSync('raw',{recursive:true});
const meta=[];
for(let i=0;i<flow.length&&i<66;i++){
  const r=await fetch(flow[i].u);const b=Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(`raw/${String(i).padStart(2,'0')}.webp`,b);meta.push({i,...flow[i]});
}
fs.writeFileSync('meta.json',JSON.stringify(meta,null,1));
// appstore
const bases=[...new Set((as.match(/https:\/\/is\d-ssl\.mzstatic\.com\/image\/thumb\/PurpleSource[^\s"',)]*?\.(?:jpg|png)(?=\/)/g)||[]).filter(x=>!/Placeholder/.test(x)))];
console.log(bases.length);
fs.mkdirSync('rawas',{recursive:true});
let n=0;for(const b of bases){const r=await fetch(b+'/1290x2796bb.jpg');if(!r.ok){console.log('fail',b,r.status);continue}
 fs.writeFileSync(`rawas/${String(++n).padStart(2,'0')}.jpg`,Buffer.from(await r.arrayBuffer()));console.log(n,b.split('/').slice(-2).join('/'))}
console.log((as.match(/Version[^<]{0,80}/g)||[]).slice(0,5), (as.match(/"versionDisplay":"[^"]+"/g)||[]).slice(0,3), as.match(/Grow Labs[^<"]{0,30}/g)?.slice(0,2));
