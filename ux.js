/* ===== Site-wide UX: "next steps" links, site search, "what's new" on home ===== */
(function(A){
const NEXT={home:['design','scan','reactors'],atoms:['radiation','reactors','quiz'],radiation:['scan','tools','life'],life:['scan','radiation','energy'],reactors:['design','energy','saudi'],energy:['reactors','saudi','news'],safety:['emergency','stories','reactors'],emergency:['safety','radiation','stories'],stories:['safety','emergency','quiz'],careers:['radar','saudi','tools'],tools:['radiation','quiz','glossary'],quiz:['glossary','atoms','careers'],glossary:['quiz','atoms','refs'],saudi:['radar','news','careers'],scan:['radiation','life','tools'],design:['reactors','energy','quiz'],radar:['careers','saudi','news'],news:['saudi','radar','energy'],refs:['glossary','careers','about'],about:['radar','saudi','design']};
const D={ar:{home:'الصفحة الرئيسية',atoms:'من الذرة إلى النواة والنشاط الإشعاعي',reactors:'شغّل مفاعلات PWR و BWR و CANDU',radiation:'جرّب الدروع وشاهد الجرعة تتغير',energy:'الوقود والنفايات والمقارنة بالمصادر الأخرى',safety:'الدفاع في العمق والأمن النووي ومقياس INES',emergency:'أدِر حادثًا افتراضيًا على خريطة حقيقية',stories:'أشهر القصص والحوادث النووية',life:'النووي في الطب والزراعة والصناعة',careers:'التخصصات وجهات التوظيف',tools:'حاسبات عمر النصف والجرعة والدروع',quiz:'اختبر نفسك واحصل على شهادة',glossary:'المصطلحات والثوابت والمعادلات والجداول',saudi:'البرنامج الوطني للطاقة الذرية',scan:'صوّر أي شيء واعرف إشعاعه',design:'ابنِ مفاعلك واختبر هل يعمل',radar:'وظائف وتدريب ومنح نووية',news:'آخر أخبار العالم النووي',refs:'المصادر والمراجع الموثوقة',about:'من نحن وتواصل معنا'},
 en:{home:'Home page',atoms:'From the atom to the nucleus and radioactivity',reactors:'Run PWR, BWR and CANDU reactors',radiation:'Try shields and watch the dose change',energy:'Fuel, waste and comparison with other sources',safety:'Defense in depth, nuclear security and the INES scale',emergency:'Manage a hypothetical accident on a real map',stories:'Famous nuclear stories and accidents',life:'Nuclear in medicine, farming and industry',careers:'Specialties and employers',tools:'Half-life, dose and shielding calculators',quiz:'Test yourself and earn a certificate',glossary:'Terms, constants, equations and tables',saudi:'The national atomic energy project',scan:'Snap anything and know its radiation',design:'Build a reactor and test whether it works',radar:'Nuclear jobs, internships and scholarships',news:'Latest news from the nuclear world',refs:'Sources and trusted references',about:'About us and contact'}};
const T={ar:{next:'🧭 أكمل رحلتك',s:'ابحث في الموقع…',sTitle:'البحث في الموقع',none:'لا توجد نتائج',gl:'القاموس',nw:'خبر',rd:'فرصة',hint:'جرّب: يورانيوم، عمر النصف، تدريب، CANDU',newT:'الجديد في الموقع',newN:'📰 آخر الأخبار',newR:'📡 أحدث الفرص',all:'عرض الكل ←',tools:'🛠️ أدوات حصرية'},
 en:{next:'🧭 Continue your journey',s:'Search the site…',sTitle:'Search the site',none:'No results',gl:'Glossary',nw:'News',rd:'Opportunity',hint:'Try: uranium, half-life, internship, CANDU',newT:'New on the site',newN:'📰 Latest news',newR:'📡 Latest opportunities',all:'See all →',tools:'🛠️ Exclusive tools'}};
const L=()=>T[A.LANG],ar=()=>A.LANG==='ar';
const esc=s=>String(s||'').replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const norm=s=>String(s||'').toLowerCase().replace(/[ً-ْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
// ---------- next steps ----------
function nextBlock(v){const n=NEXT[v];if(!n)return '';const d=D[A.LANG];
 return `<section class="nx"><div class="wrap"><h3>${L().next}</h3><div class="nx-g">${n.map(k=>`<a class="nx-c" href="#${k}"><b>${esc(A.C.nav[k])}</b><span>${esc(d[k])}</span><i>${ar()?'←':'→'}</i></a>`).join('')}</div></div></section>`;}

// ---------- featured simulators (home) ----------
const FT={ar:{h:'أدوات حصرية',sub:'ثلاث محاكيات تفاعلية مبنية على فيزياء حقيقية، مجانًا وبالعربي.',go:'ابدأ الآن',
  t:[['design','صمّم مفاعلك','اختر الوقود والمهدّئ والمبرّد، وشغّل مفاعلك وشاهد كيف يتصرّف.',['تصميم','ثلاثي الأبعاد']],
     ['scan','الماسح الإشعاعي','احسب جرعتك السنوية من أكلك وبيتك وسفرك، وقارنها بالحدود الآمنة.',['جرعات','يومي']],
     ['emergency','محاكي الطوارئ الإشعاعية','أنت صاحب القرار: إخلاء أو إيواء أو يود، على خريطة حقيقية.',['قرارات','خريطة حية']]]},
 en:{h:'Exclusive tools',sub:'Three interactive simulators built on real physics — free.',go:'Start now',
  t:[['design','Design your reactor','Pick fuel, moderator and coolant, then run your reactor.',['Design','3D']],
     ['scan','Radiation scanner','Estimate your yearly dose from food, home and travel.',['Dose','Everyday']],
     ['emergency','Radiological emergency simulator','You decide: evacuate, shelter or iodine, on a real map.',['Decisions','Live map']]]}};
const FTART={
 design:`<svg viewBox="0 0 220 130" class="ft-svg" direction="ltr"><defs><radialGradient id="ftg1"><stop offset="0" stop-color="#38BDF8" stop-opacity=".9"/><stop offset="1" stop-color="#38BDF8" stop-opacity="0"/></radialGradient></defs><circle cx="110" cy="65" r="58" fill="url(#ftg1)" class="ft-pulse"/>${Array.from({length:25},(_,i)=>{const x=66+(i%5)*22,y=21+Math.floor(i/5)*22,c=(i===6||i===8||i===16||i===18)?'#F59E0B':'#A78BFA';return `<rect x="${x}" y="${y}" width="16" height="16" rx="3" fill="${c}" opacity=".9"/>`}).join('')}<g class="ft-rod"><rect x="88" y="-40" width="4" height="70" fill="#E2E8F0"/><rect x="132" y="-40" width="4" height="70" fill="#E2E8F0"/></g></svg>`,
 scan:`<svg viewBox="0 0 220 130" class="ft-svg" direction="ltr"><path d="M40 110 A70 70 0 0 1 180 110" fill="none" stroke="#1E3A5F" stroke-width="14" stroke-linecap="round"/><path d="M40 110 A70 70 0 0 1 180 110" fill="none" stroke="url(#ftg2)" stroke-width="14" stroke-linecap="round" stroke-dasharray="220" class="ft-arc"/><defs><linearGradient id="ftg2"><stop offset="0" stop-color="#34D399"/><stop offset=".6" stop-color="#FBBF24"/><stop offset="1" stop-color="#F87171"/></linearGradient></defs><g class="ft-needle" style="transform-origin:110px 110px"><line x1="110" y1="110" x2="110" y2="52" stroke="#F8FAFC" stroke-width="3" stroke-linecap="round"/></g><circle cx="110" cy="110" r="7" fill="#F8FAFC"/><text x="110" y="128" text-anchor="middle" fill="#94A3B8" font-size="11" font-family="IBM Plex Sans Arabic,IBM Plex Sans,sans-serif">2.4 mSv/y</text></svg>`,
 emergency:`<svg viewBox="0 0 220 130" class="ft-svg" direction="ltr"><path d="M0 95 C40 80 60 100 95 88 S160 70 220 80 L220 130 L0 130Z" fill="#0E3B5C" opacity=".8"/><g stroke="#1E3A5F" stroke-width="1">${[30,60,90,120,150,180].map(x=>`<line x1="${x}" y1="0" x2="${x}" y2="130"/>`).join('')}${[30,60,90].map(y=>`<line x1="0" y1="${y}" x2="220" y2="${y}"/>`).join('')}</g><ellipse cx="130" cy="58" rx="70" ry="20" fill="#F87171" opacity=".18" class="ft-plume" style="transform-origin:62px 62px"/><ellipse cx="105" cy="60" rx="42" ry="12" fill="#FBBF24" opacity=".3" class="ft-plume" style="transform-origin:62px 62px"/><circle cx="62" cy="62" r="28" fill="none" stroke="#F87171" stroke-dasharray="4 4"/><circle cx="62" cy="62" r="6" fill="#F43F5E" class="ft-blink"/><circle cx="150" cy="40" r="3" fill="#E2E8F0"/><circle cx="170" cy="78" r="3" fill="#E2E8F0"/><circle cx="118" cy="96" r="3" fill="#E2E8F0"/></svg>`};
function featured(){const f=FT[A.LANG],go=ar()?'←':'→';
 return `<section class="ft"><div class="wrap"><div class="ft-head"><h2>${f.h}</h2><p>${f.sub}</p></div><div class="ft-g">${f.t.map(([k,ti,de,tags],i)=>`<a class="ft-c" href="#${k}" style="--d:${i*.12}s"><div class="ft-scr">${FTART[k]}<span class="ft-n">0${i+1}</span></div><div class="ft-b"><div class="ft-tags">${tags.map(x=>`<span>${x}</span>`).join('')}</div><h3>${ti}</h3><p>${de}</p><span class="ft-go">${f.go} ${go}</span></div></a>`).join('')}</div></div></section>`;}
// ---------- what's new (home) ----------
function newsList(){return (A.NEWS||[]).slice().sort((a,b)=>b.d.localeCompare(a.d)).slice(0,3);}
function radarList(){return (A.radarData?A.radarData():[]).slice(0,3);}
function whatsNew(){const t=L(),N=newsList(),R=radarList();
 return `<section class="wn"><div class="wrap"><h2 class="wn-h">${t.newT}</h2><div class="wn-g">
  <div class="wn-col"><h4>${t.newR}</h4>${R.map(o=>`<a class="wn-it" href="#radar"><b>${esc(ar()?o.title_ar:o.title_en)}</b><span>${esc(o.org)}${o.city?' · '+esc(o.city):''}</span></a>`).join('')}<a class="wn-all" href="#radar">${t.all}</a></div>
  <div class="wn-col"><h4>${t.newN}</h4>${N.map(n=>`<a class="wn-it" href="#news"><b>${esc(n[A.LANG][0])}</b><span>${esc(n.d)}</span></a>`).join('')}<a class="wn-all" href="#news">${t.all}</a></div>
 </div></div></section>`;}
// ---------- search ----------
let IDX=null,IDXL=null;
function txt(el){const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const a=[];let n;while(n=w.nextNode())a.push(n.nodeValue);return a.join(' ').replace(/\s+/g,' ').trim();}
function buildIndex(){const out=[],P=new DOMParser();
 A.ORDER.forEach(v=>{if(!A.V[v]||v==='home')return;let h='';try{h=A.V[v].html(A.C);}catch(e){return;}
  const doc=P.parseFromString(`<div>${h}</div>`,'text/html');const page=A.C.nav[v]||v;
  out.push({v,title:page,sub:D[A.LANG][v]||'',text:norm(page+' '+(D[A.LANG][v]||'')),w:3});
  doc.querySelectorAll('h2,h3,h4').forEach(el=>{const tt=el.textContent.trim();if(!tt||tt.length>90)return;let p='';const nx=el.nextElementSibling;if(nx&&/^(P|UL|DIV)$/.test(nx.tagName))p=txt(nx).slice(0,150);
   out.push({v,title:tt,sub:page+(p?' · '+p:''),text:norm(tt+' '+p),w:2,anchor:tt});});
  doc.querySelectorAll('p').forEach(el=>{const tt=txt(el);if(tt.length>40)out.push({v,title:page,sub:tt.slice(0,160),text:norm(tt),w:1,anchor:tt.slice(0,40)});});});
 (window.GLOSSARY||[]).forEach(g=>out.push({v:'glossary',title:(ar()?g[0]+' · '+g[1]:g[1]),sub:L().gl+' · '+(ar()?g[2]:g[3]).slice(0,140),text:norm(g.join(' ')),w:3,q:ar()?g[0]:g[1]}));
 (A.NEWS||[]).forEach(n=>out.push({v:'news',title:n[A.LANG][0],sub:L().nw+' · '+n.d,text:norm(n[A.LANG].join(' ')+' '+n.s),w:2}));
 (A.radarData?A.radarData():[]).forEach(o=>out.push({v:'radar',title:ar()?o.title_ar:o.title_en,sub:L().rd+' · '+o.org,text:norm(Object.values(o).join(' ')),w:2}));
 return out;}
function search(q){if(!IDX||IDXL!==A.LANG){IDX=buildIndex();IDXL=A.LANG;}const toks=norm(q).split(/\s+/).filter(x=>x.length>1);if(!toks.length)return [];
 const res=[];IDX.forEach(r=>{if(toks.every(t=>r.text.includes(t))){let s=r.w;if(toks.every(t=>norm(r.title).includes(t)))s+=3;res.push([s,r]);}});
 res.sort((a,b)=>b[0]-a[0]);const seen=new Set();return res.map(x=>x[1]).filter(r=>{const k=r.v+'|'+r.title;if(seen.has(k))return false;seen.add(k);return true;}).slice(0,14);}
A.siteIndex=()=>{if(!IDX||IDXL!==A.LANG){IDX=buildIndex();IDXL=A.LANG;}return IDX;};A.normTxt=norm;
function openSearch(){let o=document.getElementById('srch');const t=L();
 if(!o){o=document.createElement('div');o.id='srch';document.body.appendChild(o);}
 o.innerHTML=`<div class="sr-box" role="dialog" aria-label="${t.sTitle}"><div class="sr-top"><input id="srQ" type="search" placeholder="${t.s}" autocomplete="off"><button id="srX" aria-label="close">✕</button></div><div id="srR" class="sr-r"><p class="sr-hint">${t.hint}</p></div></div>`;
 o.classList.add('on');const q=document.getElementById('srQ');setTimeout(()=>q.focus(),30);
 const close=()=>o.classList.remove('on');document.getElementById('srX').onclick=close;o.onclick=e=>{if(e.target===o)close();};
 document.onkeydown=e=>{if(e.key==='Escape')close();};
 q.oninput=()=>{const r=search(q.value),R=document.getElementById('srR');
  R.innerHTML=!q.value.trim()?`<p class="sr-hint">${t.hint}</p>`:r.length?r.map((x,i)=>`<a href="#${x.v}" data-i="${i}" class="sr-it"><b>${esc(x.title)}</b><span>${esc(x.sub)}</span><em>${esc(A.C.nav[x.v]||'')}</em></a>`).join(''):`<p class="sr-hint">${t.none}</p>`;
  R.querySelectorAll('.sr-it').forEach(a=>a.onclick=ev=>{const x=r[+a.dataset.i];close();A._pendingSearch=x;if(location.hash==='#'+x.v){ev.preventDefault();A.route();}});};}
A.openSearch=openSearch;
function afterRoute(v){const x=A._pendingSearch;A._pendingSearch=null;if(!x)return;
 if(x.q&&v==='glossary'){const g=document.getElementById('glq');if(g){g.value=x.q;g.dispatchEvent(new Event('input'));}return;}
 if(x.anchor){const view=document.getElementById('v-'+v);if(!view)return;const els=[...view.querySelectorAll('h2,h3,h4,p,li')];const el=els.find(e=>e.textContent.trim().startsWith(x.anchor));
  if(el){const pn=el.closest('.tab-pane');if(pn&&!pn.classList.contains('on')&&A.tabShow)A.tabShow(pn);}if(el)setTimeout(()=>{el.scrollIntoView({behavior:'smooth',block:'center'});el.classList.add('sr-flash');setTimeout(()=>el.classList.remove('sr-flash'),2200);},120);}}
// ---------- hook into shell & route ----------
const shell0=A.shell;A.shell=function(){shell0.apply(this,arguments);const t=L();
 const side=document.querySelector('#side .side-in');if(side&&!document.getElementById('sideSearch')){const b=document.createElement('button');b.id='sideSearch';b.className='side-search';b.innerHTML=`<span>🔍</span>${t.s}<kbd>/</kbd>`;b.onclick=openSearch;const nl=document.getElementById('navlinks');side.insertBefore(b,nl);}
 const mt=document.querySelector('#nav .mtop');if(mt&&!document.getElementById('mSearch')){const b=document.createElement('button');b.id='mSearch';b.className='m-search';b.setAttribute('aria-label',t.sTitle);b.textContent='🔍';b.onclick=openSearch;mt.insertBefore(b,document.getElementById('langBtnM'));}
 IDX=null;};
document.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test((document.activeElement||{}).tagName||'')){e.preventDefault();openSearch();}});
const route0=A.route;A.route=function(){route0.apply(this,arguments);let v=(location.hash||'#home').slice(1);if(!A.V[v])v='home';
 const view=document.getElementById('v-'+v);if(view){if(v==='home'){const first=view.querySelector('section');const w=document.createElement('div');w.innerHTML=featured()+whatsNew();const kids=[...w.children];kids.forEach(k=>{if(first)view.insertBefore(k,first);else view.appendChild(k);});}
  const nb=document.createElement('div');nb.innerHTML=nextBlock(v);if(nb.firstElementChild)view.appendChild(nb.firstElementChild);}
 afterRoute(v);};
})(APP);
