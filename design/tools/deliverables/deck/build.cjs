const pptxgen=require('pptxgenjs');
const path=require('path');
const {applyTheme}=require('./apply_theme.cjs');
const ROOT=path.resolve(__dirname,'../../../..');
const R=path.join(ROOT,'design/export')+'/';
const I=path.join(__dirname,'img')+'/';
const OUT=path.join(ROOT,'deliverables/demo-deck.pptx');
const P='F6F4EF',K='141414',T='FF5A1F',L='C6F25B',M='6B6B6B';
const F='Arial';
const THEME={name:'Measured',headFontFace:F,bodyFontFace:F,colors:{dk1:K,lt1:'FFFFFF',dk2:K,lt2:P,accent1:T,accent2:L,accent3:M,accent4:'E3E0D8',accent5:'E5484D',accent6:'1E1E1E',hlink:T,folHlink:M}};
const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.theme={headFontFace:F,bodyFontFace:F};
pres.title='Measured demo day';
const W=13.333;
const scr=n=>R+'screens/'+n+'-light.png';
function phone(s,file,x,y,h,dark){const w=h*1170/2532;
 s.addShape(pres.ShapeType.roundRect,{x:x-0.06,y:y-0.06,w:w+0.12,h:h+0.12,rectRadius:0.12,fill:{color:dark?'2A2A2A':'FFFFFF'},line:{color:dark?'3A3A3A':'D9D6CE',width:1}});
 s.addImage({path:file,x,y,w,h});return w;}
function T_(s,t,o){s.addText(t,Object.assign({isTextBox:true,fontFace:F,margin:0,valign:'top',color:K},o));}
function head(s,t,o){T_(s,t,Object.assign({x:0.6,y:0.45,w:W-1.2,h:0.9,fontSize:38,bold:true},o));}
function bg(s,c){s.background={color:c};}

// 1
let s=pres.addSlide();bg(s,K);
T_(s,'MEASURED',{x:0.7,y:0.8,w:7,h:0.4,fontSize:16,bold:true,color:T,charSpacing:6});
T_(s,'Your honest adult height range in 60 seconds',{x:0.7,y:1.6,w:7,h:3.0,fontSize:50,bold:true,color:P});
T_(s,'4 questions. A free result before any paywall.',{x:0.7,y:4.9,w:7,h:0.5,fontSize:20,color:L});
T_(s,'Cem Aksu  ·  Pınar Işıl Şahin  ·  Batu Öncel',{x:0.7,y:6.3,w:6,h:0.4,fontSize:18,bold:true,color:T});
phone(s,scr('01-promise'),8.2,0.9,5.7,true);phone(s,scr('07-reveal'),10.75,1.5,5.2,true);
s.addNotes("Hi, we are [team names]. Our app is Measured, an honest adult height predictor. The promise is on the screen: your adult height range in 60 seconds, with the result shown before any paywall. In the next eight minutes we show what we copied, what we changed, and then a classmate runs the app live.");

// 2
s=pres.addSlide();bg(s,P);
head(s,'The original: GoTall',{w:4.8,fontSize:30});
T_(s,'$57.8k',{x:0.6,y:1.5,w:4.6,h:1.5,fontSize:84,bold:true,color:T});
T_(s,'monthly recurring revenue',{x:0.6,y:3.05,w:4.6,h:0.4,fontSize:18,bold:true});
T_(s,'A height predictor app. 33 screens of questions and claims, then a paywall. The result stays locked.',{x:0.6,y:3.7,w:4.3,h:1.0,fontSize:16});
T_(s,'Source: TrustMRR, Superwall-verified, 22 Oct 2026. Weakness counts: our tally of 119 one-to-three-star App Store reviews (approximate).',{x:0.6,y:6.35,w:4.6,h:0.7,fontSize:11,color:M});
const rows=[['~95','Result locked behind the paywall after a 31-step quiz','"Did the whole questionnaire ... at the last second told me I had to pay"'],
['~43','A long, personal quiz before any value','"Tell me up front so that I don\'t waste my time."'],
['~19','Billing surprises: "$0.67/week" vs $35 to $60 charged','"It said $0.67 per week but it really charged me $35."']];
rows.forEach((r,i)=>{const y=0.55+i*2.15;
 s.addShape(pres.ShapeType.roundRect,{x:5.5,y,w:7.25,h:1.95,rectRadius:0.1,fill:{color:'FFFFFF'},line:{color:'E3E0D8',width:1}});
 s.addShape(pres.ShapeType.roundRect,{x:5.7,y:y+0.25,w:1.7,h:1.45,rectRadius:0.1,fill:{color:K}});
 T_(s,r[0],{x:5.7,y:y+0.25,w:1.7,h:1.45,fontSize:36,bold:true,color:L,align:'center',valign:'middle'});
 T_(s,r[1],{x:7.65,y:y+0.22,w:4.9,h:0.8,fontSize:17,bold:true});
 T_(s,r[2],{x:7.65,y:y+1.1,w:4.9,h:0.7,fontSize:14,italic:true,color:M});});
s.addNotes("GoTall is the app we are up against. TrustMRR, verified through Superwall, shows about $57.8 thousand a month. We read 150 recent App Store reviews and three problems dominate. The result is locked behind a paywall after a 31-step quiz, the quiz is long and personal, and the billing is a surprise: a $0.67 a week price becomes a charge of $35 to $60.");

// 3
s=pres.addSlide();bg(s,P);
head(s,'Our one-line value proposition');
s.addShape(pres.ShapeType.roundRect,{x:0.6,y:1.45,w:8.0,h:2.55,rectRadius:0.12,fill:{color:K}});
T_(s,[{text:'For 13 to 17-year-olds who want to know how tall they will get but hate 30-question quizzes that end in a paywall, ',options:{color:P}},{text:'Measured shows your honest height range in under a minute',options:{color:L,bold:true}},{text:', unlike GoTall, because you see your result before any paywall and the price is never hidden.',options:{color:P}}],{x:0.9,y:1.65,w:7.4,h:2.2,fontSize:19,valign:'middle'});
[['WHO','Teens who wonder how tall they will get'],['PAIN','"Answered 30 questions just to hit a paywall"'],['PROMISE','Your honest adult height range in 60 seconds']].forEach((c,i)=>{const x=0.6+i*2.7;
 s.addShape(pres.ShapeType.roundRect,{x,y:4.3,w:2.6,h:2.5,rectRadius:0.1,fill:{color:'FFFFFF'},line:{color:'E3E0D8',width:1}});
 T_(s,c[0],{x:x+0.2,y:4.5,w:2.2,h:0.35,fontSize:14,bold:true,color:T});
 T_(s,c[1],{x:x+0.2,y:4.95,w:2.2,h:1.7,fontSize:16,bold:true});});
phone(s,scr('01-promise'),9.6,0.9,5.3);
s.addNotes("This is the sentence that every screen has to serve. Who: 13 to 17-year-olds curious about their height. Pain: quizzes that end in a paywall. Promise: an honest range in 60 seconds, shown free before any paywall, which is the difference from GoTall.");

// 4
s=pres.addSlide();bg(s,P);
head(s,'Moodboard and style: Bold Measure');
[['Paper','F6F4EF','141414'],['Ink','141414','F6F4EF'],['Tangerine','FF5A1F','141414'],['Lime','C6F25B','141414']].forEach((c,i)=>{
 const x=0.6+(i%2)*2.6,y=1.6+Math.floor(i/2)*2.0;
 s.addShape(pres.ShapeType.roundRect,{x,y,w:2.4,h:1.8,rectRadius:0.1,fill:{color:c[1]},line:{color:'C9C5BB',width:1}});
 T_(s,c[0],{x:x+0.2,y:y+1.0,w:2,h:0.35,fontSize:16,bold:true,color:c[2]});
 T_(s,'#'+c[1],{x:x+0.2,y:y+1.38,w:2,h:0.3,fontSize:12,color:c[2]});});
T_(s,'Aa 178 cm',{x:0.6,y:5.7,w:5,h:0.8,fontSize:40,bold:true});
T_(s,'Clash Display headings, General Sans body. Rulers, silhouettes, big numbers.',{x:0.6,y:6.5,w:5,h:0.6,fontSize:14,color:M});
s.addImage({path:I+'style_crop.png',x:7.2,y:1.45,w:5.6,h:5.6,sizing:{type:'contain',w:5.6,h:5.6}});
s.addNotes("The style is Bold Measure: warm paper, near-black ink, a tangerine brand colour and a lime accent used for the result range. Headings are Clash Display and body is General Sans. Every screen has a real visual, a ruler, silhouettes or a big number, never a text-only screen. On the right is our style sheet with tokens and components.");

// 5
s=pres.addSlide();bg(s,P);
head(s,'The slice: 13 screens, one flow');
s.addImage({path:R+'board-ours.png',x:0.4,y:1.45,w:12.53,h:12.53*586/3000});
['4 questions','Free result','Plan','Honest paywall'].forEach((t,i)=>{const x=0.6+i*3.1;
 s.addShape(pres.ShapeType.roundRect,{x,y:4.4,w:2.8,h:1.3,rectRadius:0.55,fill:{color:i==1?L:(i==3?T:K)}});
 T_(s,t,{x,y:4.4,w:2.8,h:1.3,fontSize:20,bold:true,color:(i==3||i==1)?K:P,align:'center',valign:'middle'});
 if(i<3)T_(s,'>',{x:x+2.8,y:4.4,w:0.3,h:1.3,fontSize:24,bold:true,color:M,align:'center',valign:'middle'});});
T_(s,'Promise, goal, about, height, parents, building, reveal, habits, plan, priming, paywall, welcome, home.',{x:0.6,y:6.1,w:12,h:0.5,fontSize:14,color:M});
s.addNotes("Here is the whole slice, thirteen screens from promise to home. Four questions lead to the free result, then a plan, then a paywall. If you close the paywall with the X you land on home in free mode and keep your result and week one. Now for the live demo.");

// 6
s=pres.addSlide();bg(s,K);
T_(s,'LIVE DEMO',{x:0.8,y:1.8,w:11.7,h:1.8,fontSize:96,bold:true,color:T});
T_(s,'A classmate does the onboarding cold',{x:0.8,y:4.0,w:11.7,h:1.2,fontSize:44,bold:true,color:P});
s.addShape(pres.ShapeType.rect,{x:0.8,y:6.0,w:11.7,h:0.12,fill:{color:L}});
for(let i=0;i<=40;i++)s.addShape(pres.ShapeType.rect,{x:0.8+i*0.2925-0.01,y:6.12,w:0.02,h:i%5==0?0.4:0.22,fill:{color:L}});
s.addNotes("Hand the phone to a classmate who has never seen the app. Say nothing; let them tap through while we narrate: four questions, the free result, the plan and the paywall. Point out the range on the result and the price box. If the phone fails, play the screen recording.");

// 7
s=pres.addSlide();bg(s,P);
head(s,'Every answer changes a later screen');
const maps=[['Goal','Copy changes: "your child", plan and paywall titles'],['Parents','Silhouettes and range on the result'],['Unknown parent','Range widens, and the app says so'],['Habits','Plan order and week one']];
maps.forEach((m,i)=>{const y=1.6+i*1.35;
 s.addShape(pres.ShapeType.roundRect,{x:0.6,y,w:5.4,h:1.15,rectRadius:0.1,fill:{color:i==2?L:'FFFFFF'},line:{color:'E3E0D8',width:1}});
 T_(s,m[0],{x:0.85,y:y+0.15,w:4.9,h:0.4,fontSize:20,bold:true});
 T_(s,m[1],{x:0.85,y:y+0.6,w:4.9,h:0.45,fontSize:14});});
[['05-parents','Parents in'],['07-reveal','Silhouettes and range out'],['09-plan','Plan shaped by habits']].forEach((p,i)=>{const x=6.5+i*2.2;
 phone(s,scr(p[0]),x,1.5,3.9);
 T_(s,p[1],{x:x-0.1,y:5.65,w:2.1,h:0.7,fontSize:14,bold:true,align:'center'});});
T_(s,'Unit (cm or ft) stays the same on every screen once chosen.',{x:0.6,y:6.9,w:8,h:0.3,fontSize:12,color:M});
s.addNotes("Nothing you answer is wasted. Goal changes the wording, for example 'your child' instead of 'you'. Parents' heights drive the silhouettes and the range. If a parent is unknown, we do not block you: the range gets wider and the screen says why. Sleep, activity and diet decide which habits come first in the plan.");

// 8
s=pres.addSlide();bg(s,P);
T_(s,'Honest by design',{x:3.6,y:0.45,w:9.2,h:0.9,fontSize:38,bold:true});
phone(s,scr('11-paywall'),0.7,0.8,5.9);
['Full billed price, biggest text','Trial end date shown','Cancel path written out','Visible X, top left','No countdown timer','No fake reviews or ratings'].forEach((c,i)=>{const y=1.5+i*0.9;
 s.addShape(pres.ShapeType.ellipse,{x:3.6,y:y+0.05,w:0.5,h:0.5,fill:{color:L}});
 T_(s,String(i+1),{x:3.6,y:y+0.05,w:0.5,h:0.5,fontSize:16,bold:true,align:'center',valign:'middle'});
 T_(s,c,{x:4.3,y:y+0.05,w:4.2,h:0.5,fontSize:17,bold:true,valign:'middle'});});
s.addShape(pres.ShapeType.roundRect,{x:8.8,y:1.5,w:4.0,h:5.3,rectRadius:0.12,fill:{color:K}});
T_(s,'GoTall instead',{x:9.1,y:1.75,w:3.5,h:0.4,fontSize:20,bold:true,color:T});
T_(s,['"$0.67/week" framing for a yearly plan','"Special offer" countdown (2:59:59)','Paywall before the result','Charges of $35 to $60 reported'].map((t,i,a)=>({text:t,options:{bullet:true,breakLine:i<a.length-1}})),{x:9.1,y:2.4,w:3.5,h:4.0,fontSize:16,color:P,paraSpaceAfter:12});
s.addNotes("This is our paywall. The yearly price is the biggest text, the free trial end date is written out, and the cancel path is spelled out. The X is visible, there is no countdown, and the one review is labelled as a placeholder. On the right is what GoTall does instead: a weekly price for a yearly plan, a fake timer, and a paywall before the result.");

// 9
s=pres.addSlide();bg(s,P);
head(s,'Evidence: GoTall vs Measured');
const ph=t=>({text:t,options:{color:T,bold:true}});
const hd=t=>({text:t,options:{bold:true,color:P,fill:{color:K},fontSize:16}});
const rowsT=[[hd('Metric'),hd('GoTall'),hd('Measured')],
 ['Screens before the paywall','33','11'],
 ['Questions before the result','25+ (then locked)','4'],
 ['Seconds to result (est.)','Locked','~45'],
 ['Seconds to paywall (est.)','~150','~75'],
 ['Taps to result','n/a (locked)','7'],
 ['Result before paywall','No','Yes'],
 ['Clarity test (out of 5)',ph('[x/5]'),ph('[x/5]')]];
s.addTable(rowsT.map((r,ri)=>r.map((c,ci)=>{const o=typeof c==='string'?{text:c,options:{}}:c;o.options=Object.assign({fontFace:F,fontSize:20,bold:ci>0,color:K,fill:{color:(ci==2&&ri>0)?'EAF8C2':'FFFFFF'},border:{type:'solid',pt:1,color:'E3E0D8'},valign:'middle',margin:[0,0.15,0,0.15]},o.options);return o;})),{x:0.6,y:1.5,w:8.3,colW:[3.7,2.2,2.4],rowH:0.6});
T_(s,'est. = estimated from the screen count at ~4.5 s per screen. Orange = still to test.',{x:0.6,y:6.45,w:8.3,h:0.35,fontSize:13,bold:true,color:T});
T_(s,'33 vs 7',{x:9.4,y:1.5,w:3.4,h:1.4,fontSize:72,bold:true,color:T});
T_(s,'screens before you see a result (GoTall: still locked)',{x:9.4,y:2.9,w:3.4,h:0.8,fontSize:18,bold:true});
s.addShape(pres.ShapeType.roundRect,{x:9.4,y:4.2,w:3.4,h:2.3,rectRadius:0.1,fill:{color:K}});
T_(s,'What we tested',{x:9.65,y:4.4,w:3,h:0.35,fontSize:14,bold:true,color:L});
T_(s,'Internal QA audit, 22 Oct: every path reaches Home, and the personalisation map was checked screen by screen.',{x:9.65,y:4.85,w:2.95,h:1.55,fontSize:14,color:P});
s.addNotes("Here is the side-by-side. GoTall shows 33 screens before its paywall and the result is still locked; we show the result on screen 7 after 4 questions, free. Screen and tap counts for GoTall come from ScreensDesign's public recording of its onboarding. The seconds marked est. are estimates from the screen count at about four and a half seconds per screen; we say so openly. The clarity score comes from showing only the first screen of each app to five classmates. Our internal QA audit also found no dead ends in the flow.");

// 10
s=pres.addSlide();bg(s,K);
T_(s,'If we fund this, will people understand it, feel the value and pay?',{x:0.7,y:0.8,w:7.4,h:2.4,fontSize:36,bold:true,color:P});
T_(s,[{text:'Understand: ',options:{bold:true,color:L}},{text:'4 questions, one clear promise.',options:{breakLine:true}},{text:'Feel the value: ',options:{bold:true,color:L}},{text:'a free range before any paywall.',options:{breakLine:true}},{text:'Pay: ',options:{bold:true,color:L}},{text:'because the price is honest.'}],{x:0.7,y:3.5,w:7.4,h:2.0,fontSize:22,color:P,paraSpaceAfter:10});
T_(s,'Thank you',{x:0.7,y:6.1,w:6,h:0.8,fontSize:40,bold:true,color:T});
phone(s,scr('13-home'),8.2,0.9,5.5,true);phone(s,scr('11-paywall'),10.7,1.5,5.0,true);
s.addNotes("The question for any funder is: will people understand it, feel the value and pay? Our answer is yes, because the promise fits in one sentence, the value appears in under a minute before any paywall, and paying is a clear, honest choice. Thank you. Questions?");

(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
