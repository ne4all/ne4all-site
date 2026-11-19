/* ===== HOME ===== */
(function(A){
function visHTML(k,V){
  if(k==='scale')return `<div class="scale"><div><div class="b" style="width:70px;height:70px;font-size:1.8rem">🍎</div>${V.apple}</div><span class="arr">${A.C.dir==='rtl'?'←':'→'}</span><div><div class="b" style="width:52px;height:52px">🧬</div>${V.cell}</div><span class="arr">${A.C.dir==='rtl'?'←':'→'}</span><div><div class="b" style="width:36px;height:36px;font-size:.7rem">H₂O</div>${V.molecule}</div><span class="arr">${A.C.dir==='rtl'?'←':'→'}</span><div><div class="b" style="width:22px;height:22px;background:radial-gradient(circle,#f0abfc,#ec4899)"></div>${V.atom}</div></div>`;
  if(k==='atom')return `<svg viewBox="0 0 300 300"><defs><radialGradient id="ng"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#ec4899"/><stop offset="1" stop-color="#7c3aed"/></radialGradient></defs><g fill="none" stroke="rgba(196,150,255,.35)" stroke-width="1.5"><circle cx="150" cy="150" r="70"/><circle cx="150" cy="150" r="115"/></g><circle cx="150" cy="150" r="16" fill="url(#ng)"><animate attributeName="r" values="15;17;15" dur="2s" repeatCount="indefinite"/></circle><g><animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="4s" repeatCount="indefinite"/><circle cx="220" cy="150" r="7" fill="#22d3ee"/><circle cx="80" cy="150" r="7" fill="#22d3ee"/></g><g><animateTransform attributeName="transform" type="rotate" from="360 150 150" to="0 150 150" dur="7s" repeatCount="indefinite"/><circle cx="150" cy="35" r="7" fill="#22d3ee"/><circle cx="150" cy="265" r="7" fill="#22d3ee"/><circle cx="265" cy="150" r="7" fill="#22d3ee"/></g><text x="150" y="190" fill="#fbcfe8" font-size="13" text-anchor="middle">${V.nucleus}</text><text x="232" y="132" fill="#a5f3fc" font-size="12" text-anchor="middle">${V.electron}</text></svg>`;
  if(k==='nucleus')return `<svg viewBox="0 0 300 260"><g><circle cx="135" cy="120" r="20" fill="#ec4899"/><circle cx="165" cy="118" r="20" fill="#64748b"/><circle cx="150" cy="95" r="20" fill="#64748b"/><circle cx="120" cy="145" r="20" fill="#64748b"/><circle cx="150" cy="145" r="20" fill="#ec4899"/><circle cx="178" cy="145" r="20" fill="#ec4899"/><circle cx="125" cy="98" r="20" fill="#ec4899"/><circle cx="175" cy="95" r="20" fill="#64748b"/><circle cx="150" cy="122" r="20" fill="#ec4899" opacity=".95"/><animateTransform attributeName="transform" type="translate" values="0 0;1 -1;-1 1;0 0" dur=".3s" repeatCount="indefinite"/></g><g font-size="14"><circle cx="70" cy="220" r="9" fill="#ec4899"/><text x="86" y="225" fill="#fbcfe8">${V.proton}</text><circle cx="180" cy="220" r="9" fill="#64748b"/><text x="196" y="225" fill="#cbd5e1">${V.neutron}</text></g></svg>`;
  if(k==='decay')return `<svg viewBox="0 0 300 260"><circle cx="150" cy="130" r="38" fill="url(#ng2)"><animate attributeName="r" values="36;40;36" dur=".8s" repeatCount="indefinite"/></circle><defs><radialGradient id="ng2"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#ec4899"/><stop offset="1" stop-color="#7c3aed"/></radialGradient></defs><g stroke-width="3" stroke-linecap="round"><line x1="150" y1="130" x2="270" y2="60" stroke="#f472b6" stroke-dasharray="8 10"><animate attributeName="stroke-dashoffset" from="36" to="0" dur=".7s" repeatCount="indefinite"/></line><line x1="150" y1="130" x2="30" y2="70" stroke="#a855f7" stroke-dasharray="8 10"><animate attributeName="stroke-dashoffset" from="36" to="0" dur=".9s" repeatCount="indefinite"/></line><line x1="150" y1="130" x2="240" y2="230" stroke="#22d3ee" stroke-dasharray="8 10"><animate attributeName="stroke-dashoffset" from="36" to="0" dur=".5s" repeatCount="indefinite"/></line></g><g font-size="15" font-weight="700"><text x="272" y="52" fill="#f472b6">α</text><text x="16" y="66" fill="#c084fc">β</text><text x="244" y="248" fill="#67e8f9">γ</text></g></svg>`;
  if(k==='chain')return `<canvas id="chainCanvas" style="width:100%;aspect-ratio:4/3;border-radius:14px;cursor:pointer"></canvas><button class="btn pri" id="chainBtn" style="margin-top:10px">${V.chainBtn}</button>`;
  if(k==='life')return `<div class="grid" style="grid-template-columns:1fr 1fr;width:100%;gap:10px">${V.life.map(x=>`<div class="card" style="padding:16px;text-align:center;font-weight:800;font-size:1.05rem">${x}</div>`).join('')}</div>`;
  return '';
}
A.V.home={
 html(C){const H=C.home,V=H.vis;
  return `<header class="hero"><div class="wrap">
   <div class="badge">${H.badge}</div>
   <div class="atom"><div class="ow"><div class="orb o1"></div></div><div class="ow"><div class="orb o2"></div></div><div class="ow"><div class="orb o3"></div></div><div class="nuc"></div></div>
   <h1>${H.h1[0]}<span class="gt">${H.h1[1]}</span>${H.h1[2]}</h1>
   <div class="sub">${H.sub}</div>
   <p class="lead">${H.lead}</p>
   <div class="sim-btns"><a href="#reactors" class="btn pri">${H.btns[0]}</a><a href="#radiation" class="btn pri">${H.btns[1]}</a><a href="#emergency" class="btn pri">${H.btns[2]}</a></div>
   <div class="stats">${H.stats.map(s=>`<div class="stat"><b>${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
   <div class="scroll-hint">${H.scroll}</div></div></header>
  <section style="padding-top:10px"><div class="wrap">${A.sh(H.jTag,H.jTitle,H.jSub)}
   ${H.stations.map((s,i)=>`<div class="story"><div><div class="num">${H.st} ${i+1}</div><h3>${s.t}</h3>${s.p.map(p=>`<p>${p}</p>`).join('')}${s.eq?`<div class="eq">${s.eq}</div>`:''}<div class="tip">${s.tip}</div></div><div class="vis">${visHTML(s.vis,V)}</div></div>`).join('')}
  </div></section>
  <section><div class="wrap">${A.sh(H.exTag,H.exTitle)}<div class="cta-grid">${H.explore.map(e=>`<a href="#${e[0]}" class="cta"><div class="ic">${e[1]}</div><h4>${e[2]}</h4><p>${e[3]}</p></a>`).join('')}</div></div></section>
  <section><div class="wrap">${A.sh(H.myTag,H.myTitle)}<div class="myths">${H.myths.map(m=>`<div class="flip"><div class="in"><div class="fc"><b>"${m[0]}"</b><small>${H.myHint}</small></div><div class="bc"><div class="v ${m[1]?'t':'f'}">${m[1]?H.T:H.F}</div>${m[2]}</div></div></div>`).join('')}</div></div></section>`;},
 init(C){
  document.querySelectorAll('.flip').forEach(f=>f.onclick=()=>f.classList.toggle('on'));
  const V=C.home.vis,c=document.getElementById('chainCanvas');
  let U=[],N=[],F=[],running=false,count=0;
  function setup(){const {w,h}=A.fitCanvas(c);U=[];N=[];F=[];count=0;const cols=9,rows=6;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++)U.push({x:w*0.1+i*(w*0.8/(cols-1))+(j%2?w*0.04:0),y:h*0.12+j*(h*0.76/(rows-1)),alive:true});}
  function fire(){setup();const {h}=A.fitCanvas(c);N.push({x:0,y:h/2,vx:3,vy:(Math.random()-.5)*.6,l:400});running=true;}
  document.getElementById('chainBtn').onclick=fire;c.onclick=fire;
  return {frame(){
   if(!A.visible(c))return;const {ctx,w,h}=A.fitCanvas(c);if(!U.length)setup();
   ctx.fillStyle=A.CV().bg;ctx.fillRect(0,0,w,h);const rr=Math.min(w,h)*0.035;
   for(const u of U){if(!u.alive)continue;ctx.beginPath();ctx.arc(u.x,u.y,rr,0,7);const g=ctx.createRadialGradient(u.x-3,u.y-3,1,u.x,u.y,14);g.addColorStop(0,'#f0abfc');g.addColorStop(1,'#7c3aed');ctx.fillStyle=g;ctx.fill();}
   for(const f of F){f.r+=2;f.a-=0.02;ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,7);ctx.strokeStyle=`rgba(251,191,36,${Math.max(f.a,0)})`;ctx.lineWidth=3;ctx.stroke();ctx.fillStyle=`rgba(236,72,153,${Math.max(f.a,0)})`;ctx.beginPath();ctx.arc(f.x-f.r*.4,f.y,5,0,7);ctx.arc(f.x+f.r*.4,f.y,4,0,7);ctx.fill();}
   F=F.filter(f=>f.a>0);
   for(const n of N){n.x+=n.vx;n.y+=n.vy;n.l--;for(const u of U){if(u.alive&&Math.hypot(u.x-n.x,u.y-n.y)<rr){u.alive=false;n.l=0;count++;F.push({x:u.x,y:u.y,r:4,a:1});const k=2+(Math.random()<.5?1:0);for(let i=0;i<k;i++){const a=Math.random()*6.283;N.push({x:u.x+Math.cos(a)*rr*1.3,y:u.y+Math.sin(a)*rr*1.3,vx:Math.cos(a)*2.6,vy:Math.sin(a)*2.6,l:260});}break;}}
    if(n.x<0||n.x>w||n.y<0||n.y>h)n.l=0;ctx.fillStyle='#67e8f9';ctx.beginPath();ctx.arc(n.x,n.y,3,0,7);ctx.fill();}
   N=N.filter(n=>n.l>0);
   ctx.fillStyle=A.CV().acc;ctx.font='bold 14px IBM Plex Sans Arabic, Inter, sans-serif';ctx.textAlign='center';
   ctx.fillText(running?(V.fissions+count):V.chainStart,w/2,22);
   if(running&&!N.length&&!F.length)ctx.fillText(V.chainEnd,w/2,42);
  }};
 }
};
})(APP);

/* ===== ATOMS ===== */
(function(A){
const Y=31557600,D=86400,HR=3600,MI=60;
// [Z,sym,ar,en,[ [A,halfLife_s|0(stable),mode] ]]
const EL=[
 [1,'H','هيدروجين','Hydrogen',[[1,0],[2,0],[3,12.32*Y,'β-']]],
 [2,'He','هيليوم','Helium',[[3,0],[4,0],[6,0.807,'β-']]],
 [6,'C','كربون','Carbon',[[11,20.36*MI,'β+'],[12,0],[13,0],[14,5730*Y,'β-']]],
 [7,'N','نيتروجين','Nitrogen',[[13,9.97*MI,'β+'],[14,0],[15,0],[16,7.13,'β-']]],
 [8,'O','أكسجين','Oxygen',[[15,122.2,'β+'],[16,0],[17,0],[18,0]]],
 [9,'F','فلور','Fluorine',[[18,109.77*MI,'β+'],[19,0]]],
 [11,'Na','صوديوم','Sodium',[[22,2.602*Y,'β+'],[23,0],[24,14.96*HR,'β-']]],
 [19,'K','بوتاسيوم','Potassium',[[39,0],[40,1.248e9*Y,'β-'],[41,0],[42,12.36*HR,'β-']]],
 [26,'Fe','حديد','Iron',[[54,0],[55,2.74*Y,'EC'],[56,0],[57,0],[58,0],[59,44.5*D,'β-']]],
 [27,'Co','كوبالت','Cobalt',[[57,271.7*D,'EC'],[58,70.86*D,'β+'],[59,0],[60,5.271*Y,'β-']]],
 [38,'Sr','سترونشيوم','Strontium',[[86,0],[87,0],[88,0],[89,50.6*D,'β-'],[90,28.79*Y,'β-']]],
 [43,'Tc','تكنيشيوم','Technetium',[[97,4.21e6*Y,'EC'],[98,4.2e6*Y,'β-'],[99,2.11e5*Y,'β-']]],
 [53,'I','يود','Iodine',[[123,13.22*HR,'EC'],[125,59.4*D,'EC'],[127,0],[129,1.57e7*Y,'β-'],[131,8.02*D,'β-']]],
 [55,'Cs','سيزيوم','Cesium',[[133,0],[134,2.065*Y,'β-'],[135,2.3e6*Y,'β-'],[137,30.08*Y,'β-']]],
 [86,'Rn','رادون','Radon',[[220,55.6,'α'],[222,3.8235*D,'α']]],
 [88,'Ra','راديوم','Radium',[[223,11.43*D,'α'],[226,1600*Y,'α'],[228,5.75*Y,'β-']]],
 [90,'Th','ثوريوم','Thorium',[[230,75380*Y,'α'],[232,1.405e10*Y,'α'],[234,24.1*D,'β-']]],
 [92,'U','يورانيوم','Uranium',[[233,1.592e5*Y,'α'],[234,2.455e5*Y,'α'],[235,7.04e8*Y,'α'],[238,4.468e9*Y,'α'],[239,23.45*MI,'β-']]],
 [94,'Pu','بلوتونيوم','Plutonium',[[238,87.7*Y,'α'],[239,24110*Y,'α'],[240,6561*Y,'α'],[241,14.3*Y,'β-']]],
 [95,'Am','أمريسيوم','Americium',[[241,432.2*Y,'α'],[243,7370*Y,'α']]]];
const USES={'H-3':['إضاءة اللافتات الذاتية ووقود الاندماج','Self-lit signs and fusion fuel'],'C-14':['تأريخ الآثار والعظام والخشب','Dating ancient bones and wood'],'C-11':['تصوير PET للدماغ','PET brain imaging'],'F-18':['تصوير PET للكشف عن السرطان','PET cancer imaging'],'K-40':['موجود طبيعيًا في الموز وفي جسمك','Naturally in bananas and your body'],'Co-60':['العلاج الإشعاعي وتعقيم الأدوات الطبية','Radiotherapy and sterilizing medical tools'],'Sr-90':['ناتج انشطار، ويُستخدم في بطاريات نووية صغيرة','Fission product; used in small nuclear batteries'],'Tc-99':['ناتج تحلل التكنيشيوم-99m الطبي','Product of medical technetium-99m'],'I-131':['علاج الغدة الدرقية','Thyroid treatment'],'I-123':['تصوير الغدة الدرقية','Thyroid imaging'],'I-125':['زراعة بذور مشعة لعلاج سرطان البروستاتا','Seed implants for prostate cancer'],'Cs-137':['أجهزة القياس الصناعية، وأحد أهم ملوثات حوادث المفاعلات','Industrial gauges; a key contaminant after reactor accidents'],'Rn-222':['غاز طبيعي يتجمع في المنازل، وأكبر مصدر للجرعة الطبيعية','Natural gas building up in homes; the largest natural dose source'],'Ra-226':['استُخدم قديمًا في الطلاء المضيء','Once used in glow-in-the-dark paint'],'Th-232':['وقود محتمل لمفاعلات المستقبل','Possible fuel for future reactors'],'U-235':['وقود المفاعلات النووية','Nuclear reactor fuel'],'U-238':['أكثر نظائر اليورانيوم وجودًا في الطبيعة (99.3%)','The most abundant uranium isotope (99.3%)'],'Pu-238':['بطاريات المسابير الفضائية','Batteries for space probes'],'Pu-239':['يتكوّن في المفاعلات ويُستخدم وقودًا','Formed in reactors and used as fuel'],'Am-241':['كواشف الدخان المنزلية','Household smoke detectors'],'Na-24':['تتبع التسربات في الأنابيب','Tracing leaks in pipelines'],'Fe-59':['دراسة امتصاص الحديد في الجسم','Studying iron uptake in the body']};
function hlTxt(s,U){if(s<60)return A.fmt(s,2)+' '+U.s;if(s<HR)return A.fmt(s/MI,2)+' '+U.min;if(s<D)return A.fmt(s/HR,2)+' '+U.h;if(s<Y)return A.fmt(s/D,2)+' '+U.d;return A.fmt(s/Y,3)+' '+U.y;}
const CHAIN=[['U-238','4.47×10⁹ y'],['α'],['Th-234','24.1 d'],['β'],['Pa-234m','1.17 min'],['β'],['U-234','2.46×10⁵ y'],['α'],['Th-230','7.5×10⁴ y'],['α'],['Ra-226','1600 y'],['α'],['Rn-222','3.82 d'],['α'],['Po-218','3.1 min'],['α'],['Pb-214','26.8 min'],['β'],['Bi-214','19.9 min'],['β'],['Po-214','164 µs'],['α'],['Pb-210','22.2 y'],['β'],['Bi-210','5.01 d'],['β'],['Po-210','138 d'],['α'],['Pb-206','✔']];
A.V.atoms={
 html(C){const T=C.atoms;
  return `<section><div class="wrap">${A.sh(T.tag,T.title,T.sub)}${A.simple(T.simple)}
  <div class="panel" style="margin-top:22px"><h3 style="margin-bottom:4px">${T.exTitle}</h3><p class="note" style="margin:0 0 14px">${T.exHint}</p>
   <div class="ptable" id="ptable">${EL.map((e,i)=>`<button class="el${e[1]==='U'?' on':''}" data-i="${i}"><small>${e[0]}</small><b>${e[1]}</b><small>${A.LANG==='ar'?e[2]:e[3]}</small></button>`).join('')}</div>
   <div class="iso-wrap"><div class="iso-vis"><canvas id="isoCanvas"></canvas></div>
    <div><div class="ctrl"><label>${T.neutrons} <span id="nVal"></span></label><input type="range" id="nSl"></div><div class="isocard" id="isoCard"></div></div></div>
  </div>
  <div class="panel mt" style="margin-top:22px"><h3 style="margin-bottom:4px">${T.dTitle}</h3><p class="note" style="margin:0 0 14px">${T.dHint}</p>
   <div class="iso-wrap"><div><canvas id="dGrid" style="width:100%;aspect-ratio:1/1;border-radius:16px;background:#07030f;border:1px solid var(--line);display:block"></canvas></div>
    <div><div class="meters"><div class="meter"><small>${T.dRemain}</small><b id="dN">400</b></div><div class="meter"><small>${T.dTime}</small><b id="dT">0.0 s</b></div><div class="meter"><small>${T.dHls}</small><b id="dH">0.0</b></div><div class="meter"><small>%</small><b id="dP">100%</b></div></div>
     <div class="ctrl"><label>${T.dHl} <span id="dHlV">3 s</span></label><input type="range" id="dHl" min="1" max="10" step="0.5" value="3"></div>
     <div class="row" style="margin-bottom:10px"><button class="btn pri" id="dStart">${T.dStart}</button><button class="btn" id="dReset">${T.dReset}</button></div>
     <canvas class="chart" id="dChart" style="height:150px"></canvas></div></div></div>
  <div class="panel" style="margin-top:22px"><h3 style="margin-bottom:4px">${T.cTitle}</h3><p class="note" style="margin:0 0 12px">${T.cSub}</p>
   <div class="chain" id="chain">${CHAIN.map((c,i)=>c.length===1?`<div class="ar"><i>→</i>${c[0]}</div>`:`<div class="nd" data-i="${i}"><b>${c[0]}</b><small>${c[1]==='✔'?T.cEnd:c[1]}</small></div>`).join('')}</div>
   <button class="btn pri" id="cPlay">${T.cPlay}</button></div>
  <div class="grid" style="margin-top:22px">${T.cards.map(c=>A.card(c[0],c[1],'',c[2])).join('')}</div>
  </div></section>`;},
 init(C){
  const T=C.atoms;let ei=EL.findIndex(e=>e[1]==='U'),N=146,jig=0,emit=null,emitT=0;
  const sl=document.getElementById('nSl'),cv=document.getElementById('isoCanvas');
  function setEl(i){ei=i;const e=EL[i];const As=e[4].map(x=>x[0]);const nmin=Math.max(0,Math.min(...As)-e[0]-2),nmax=Math.max(...As)-e[0]+2;sl.min=nmin;sl.max=nmax;
   const PREF={U:238,Pu:239,Th:232,Ra:226,Rn:222,Tc:99,Am:241};const pref=(PREF[e[1]]&&e[4].find(x=>x[0]===PREF[e[1]]))||e[4].find(x=>x[1]===0)||e[4][e[4].length-1];N=pref[0]-e[0];sl.value=N;
   document.querySelectorAll('#ptable .el').forEach(b=>b.classList.toggle('on',+b.dataset.i===i));info();}
  function info(){const e=EL[ei],Z=e[0],Am=Z+N,iso=e[4].find(x=>x[0]===Am);document.getElementById('nVal').textContent=N;
   const name=(A.LANG==='ar'?e[2]:e[3])+'-'+Am,key=e[1]+'-'+Am,use=USES[key];
   let b,extra='';
   if(!iso){b=`<span class="badge2 b-no">${T.unbound}</span>`;extra=`<p style="color:var(--mut);margin-top:8px">${T.unboundTxt}</p>`;}
   else if(iso[1]===0){b=`<span class="badge2 b-ok">${T.stable}</span>`;extra=`<div class="kv"><div><small>${T.hl}</small><b>∞</b></div><div><small>${T.mode}</small>${T.never}</div></div>`;}
   else {b=`<span class="badge2 b-rad">${T.radioactive}</span>`;extra=`<div class="kv"><div><small>${T.hl}</small><b>${hlTxt(iso[1],T.units)}</b></div><div><small>${T.mode}</small>${T.modes[iso[2]]}</div></div>`;}
   if(use)extra+=`<p style="margin-top:10px"><b>${T.uses}</b> <span style="color:var(--mut)">${use[A.LANG==='ar'?0:1]}</span></p>`;
   document.getElementById('isoCard').innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div><span class="sym"><sup style="font-size:1rem">${Am}</sup>${e[1]}</span><div style="font-weight:800">${name}</div></div>${b}</div><div class="kv"><div><small>${T.protons}</small><b>${Z}</b></div><div><small>${T.neutronsS}</small><b>${N}</b></div><div><small>${T.mass}</small><b>${Am}</b></div><div><small>N/Z</small><b>${(N/Z).toFixed(2)}</b></div></div>${extra}`;
   A.state=iso?(iso[1]===0?0:1):2;emit=null;}
  document.querySelectorAll('#ptable .el').forEach(b=>b.onclick=()=>setEl(+b.dataset.i));
  sl.oninput=()=>{N=+sl.value;info();};
  setEl(ei);
  // order of nucleons (deterministic)
  function drawNuc(t){
   const {ctx,w,h}=A.fitCanvas(cv),e=EL[ei],Z=e[0],tot=Z+N;ctx.fillStyle=A.CV().bg;ctx.fillRect(0,0,w,h);
   const cx=w/2,cy=h/2,R=Math.min(w,h)*0.36,s=R/Math.sqrt(tot+1),st=A.state;
   const glow=ctx.createRadialGradient(cx,cy,2,cx,cy,R*1.4);glow.addColorStop(0,st===0?'rgba(52,211,153,.18)':st===1?'rgba(251,191,36,.22)':'rgba(244,63,94,.25)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
   const amp=st===0?0.3:st===1?1.2:3;
   let seed=Z*7+N*13;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
   const types=[];let p=Z,n=N;for(let i=0;i<tot;i++){const pick=rnd()<p/(p+n)?1:0;if(pick&&p>0){types.push(1);p--;}else if(n>0){types.push(0);n--;}else{types.push(1);p--;}}
   for(let i=tot-1;i>=0;i--){const r=s*Math.sqrt(i+0.5),a=i*2.39996;const jx=Math.sin(t*0.02+i)*amp,jy=Math.cos(t*0.017+i*1.3)*amp;
    const x=cx+Math.cos(a)*r+jx,y=cy+Math.sin(a)*r+jy,rr=Math.max(2,s*0.92);
    const g=ctx.createRadialGradient(x-rr*0.3,y-rr*0.3,rr*0.1,x,y,rr);
    if(types[i]){g.addColorStop(0,'#fbcfe8');g.addColorStop(1,'#db2777');}else{g.addColorStop(0,'#e2e8f0');g.addColorStop(1,'#475569');}
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rr,0,7);ctx.fill();}
   // emission animation for radioactive
   if(st===1){emitT+=1;if(!emit&&emitT>90){emitT=0;const iso=e[4].find(x=>x[0]===Z+N);emit={a:Math.random()*6.28,d:R,m:iso?iso[2]:'β-'};}
    if(emit){emit.d+=4;const x=cx+Math.cos(emit.a)*emit.d,y=cy+Math.sin(emit.a)*emit.d;const col=emit.m==='α'?'#f472b6':emit.m==='EC'?'#38bdf8':'#c084fc';ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,emit.m==='α'?6:3.5,0,7);ctx.fill();ctx.shadowBlur=0;ctx.font='bold 13px Inter, sans-serif';ctx.fillText(emit.m==='EC'?'ν':emit.m,x+10,y-8);if(emit.d>Math.max(w,h))emit=null;}}
   ctx.fillStyle=A.CV().txt;ctx.font='bold 12px IBM Plex Sans Arabic, Inter, sans-serif';ctx.textAlign='left';
   ctx.fillStyle='#f9a8d4';ctx.fillText('● '+T.protons+' '+Z,10,h-26);ctx.fillStyle=A.CV().txt2;ctx.fillText('● '+T.neutronsS+' '+N,10,h-10);
  }
  // decay demo
  const G=20,NA=G*G;let alive,t=0,run=false,hist=[];
  const dg=document.getElementById('dGrid'),dc=document.getElementById('dChart'),hlS=document.getElementById('dHl');
  function dreset(){alive=new Array(NA).fill(1);t=0;run=false;hist=[[0,NA]];upd();}
  function upd(){const n=alive.reduce((a,b)=>a+b,0),T2=+hlS.value;document.getElementById('dN').textContent=n;document.getElementById('dT').textContent=t.toFixed(1)+' s';document.getElementById('dH').textContent=(t/T2).toFixed(2);document.getElementById('dP').textContent=(n/NA*100).toFixed(1)+'%';document.getElementById('dHlV').textContent=hlS.value+' s';}
  hlS.oninput=()=>{dreset();};
  document.getElementById('dStart').onclick=()=>{if(!alive.some(x=>x))dreset();run=true;};
  document.getElementById('dReset').onclick=dreset;dreset();
  // chain
  let ci=-1,ct=0,cplay=false;const nodes=[...document.querySelectorAll('#chain .nd')];
  document.getElementById('cPlay').onclick=()=>{ci=0;ct=0;cplay=true;};
  let frameN=0;
  return {frame(dt){
   frameN++;if(A.visible(cv))drawNuc(frameN);
   if(run){const T2=+hlS.value,p=1-Math.pow(0.5,dt/T2);for(let i=0;i<NA;i++)if(alive[i]&&Math.random()<p)alive[i]=0;t+=dt;const n=alive.reduce((a,b)=>a+b,0);hist.push([t,n]);if(n===0)run=false;upd();}
   if(A.visible(dg)){const {ctx,w,h}=A.fitCanvas(dg),cs=w/G;ctx.fillStyle=A.CV().bg;ctx.fillRect(0,0,w,h);
    for(let i=0;i<NA;i++){const x=(i%G)*cs,y=Math.floor(i/G)*cs;if(alive[i]){const g=ctx.createRadialGradient(x+cs/2,y+cs/2,1,x+cs/2,y+cs/2,cs*0.5);g.addColorStop(0,'#fde68a');g.addColorStop(1,'#d97706');ctx.fillStyle=g;}else ctx.fillStyle=A.CV().cell;ctx.beginPath();ctx.arc(x+cs/2,y+cs/2,cs*0.38,0,7);ctx.fill();}}
   if(A.visible(dc)){const {ctx,w,h}=A.fitCanvas(dc),T2=+hlS.value,tmax=Math.max(T2*5,t);ctx.clearRect(0,0,w,h);
    ctx.strokeStyle=A.CV().grid;ctx.fillStyle=A.CV().mut;ctx.font='10px Inter, sans-serif';ctx.textAlign='center';
    for(let k=0;k<=Math.floor(tmax/T2);k++){const x=8+(k*T2/tmax)*(w-16);ctx.beginPath();ctx.moveTo(x,6);ctx.lineTo(x,h-14);ctx.stroke();ctx.fillText(k+'T½',x,h-3);}
    ctx.setLineDash([4,4]);ctx.strokeStyle=A.CV().line;ctx.beginPath();for(let i=0;i<=100;i++){const tt=i/100*tmax,x=8+(tt/tmax)*(w-16),y=6+(1-Math.pow(.5,tt/T2))*(h-20);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.setLineDash([]);
    const lg=ctx.createLinearGradient(0,0,w,0);lg.addColorStop(0,'#22d3ee');lg.addColorStop(.5,'#a855f7');lg.addColorStop(1,'#ec4899');ctx.strokeStyle=lg;ctx.lineWidth=2.5;ctx.beginPath();hist.forEach((p,i)=>{const x=8+(p[0]/tmax)*(w-16),y=6+(1-p[1]/NA)*(h-20);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();ctx.lineWidth=1;}
   if(cplay){ct+=dt;if(ct>0.8){ct=0;ci++;if(ci>=nodes.length){cplay=false;}}nodes.forEach((n,i)=>n.classList.toggle('on',i===Math.min(ci,nodes.length-1)));
    const on=nodes[Math.min(ci,nodes.length-1)];if(on&&on.parentElement){const p=on.parentElement;p.scrollLeft=on.offsetLeft-p.clientWidth/2+on.clientWidth/2;}}
  }};
 }
};
})(APP);
