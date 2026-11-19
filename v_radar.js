/* ===== NUCLEAR OPPORTUNITIES RADAR (reads a public Google Sheet, falls back to built-in data) ===== */
(function(A){
// Google Sheet id (shared "anyone with the link: viewer"). Empty = built-in data only.
A.RADAR_SHEET='1bQf6h6qLXulNuOJQ7hj2lJZbCoQ_-FiMVmEsWsKY4FU';
const COLS=['id','type','title_ar','title_en','org','city','deadline','posted','link','source','notes_ar','notes_en','status','verified'];
A.RADAR_COLS=COLS;
// built-in snapshot (16 Nov 2026), used when the sheet can't be reached
const SEED=[
 ['fakeeh-rso','job','فيزيائي ومسؤول وقاية إشعاعية','Physicist & Radiation Safety Officer','Fakeeh Care (د. سليمان فقيه)','جدة','','2026-11-16','https://to.indeed.com/aah8dqnbfxnj','Indeed','برنامج الوقاية الإشعاعية في المنشأة، والطب النووي، والتعامل مع هيئة الغذاء والدواء. يتطلب خبرة 5 سنوات وترخيص هيئة التخصصات الصحية.','Runs the facility radiation protection program and nuclear-medicine safety, liaising with SFDA. Requires 5 years’ experience and SCFHS licence.','open','2026-11-16'],
 ['rawaj-export','job','مستشار رقابة على تصدير واستيراد المواد النووية','Nuclear Export Control Consultant','جهة حكومية سعودية (عبر رواج)','الرياض','','2026-03-01','https://to.indeed.com/aabxbfg82vch','Indeed','تطوير أنظمة الرقابة على استيراد وتصدير المواد النووية. يتطلب 8–12 سنة خبرة. الإعلان قديم نسبيًا فتأكد أنه ما زال مفتوحًا.','Developing import/export control of nuclear materials. Requires 8–12 years’ experience. Older posting: check it is still open.','open','2026-11-16'],
 ['atkins-coop','intern','تدريب تعاوني (COOP) لدى AtkinsRéalis','COOP Internship at AtkinsRéalis','AtkinsRéalis','الرياض','','2026-09-15','https://to.indeed.com/aaks4zxsgj4w','Indeed','شركة هندسية نووية عالمية، والتدريب في مشروع حديقة الملك سلمان. للسعوديين من جامعات الرياض، بمكافأة 3,500 ريال شهريًا.','A global engineering & nuclear company; placement on the King Salman Park project. Saudis at Riyadh-based universities, SAR 3,500/month stipend.','open','2026-11-16'],
 ['wnu-si-2027','training','معهد الجامعة النووية العالمية الصيفي 2027','World Nuclear University Summer Institute 2027','World Nuclear University','كيب تاون، جنوب أفريقيا','2026-11-27','2026-07-06','https://world-nuclear-university.org/Programmes/Details/summer-institute-programme-2027','World Nuclear University','برنامج قيادي لخمسة أسابيع (30 مايو – 3 يوليو 2027) للمهنيين بخبرة 4 سنوات على الأقل، والرسوم مرتفعة وغالبًا ترعاها جهة العمل.','Five-week leadership programme (30 May – 3 July 2027) for professionals with 4+ years’ experience; fees are high and usually employer-sponsored.','open','2026-11-16'],
 ['iaea-intern','intern','برنامج التدريب في الوكالة الدولية للطاقة الذرية','IAEA Internship Programme','الوكالة الدولية للطاقة الذرية','فيينا، النمسا','','','https://www.iaea.org/about/employment','IAEA','تدريب مدفوع من 3 إلى 12 شهرًا للطلاب وحديثي التخرج، وتنزل الفرص بشكل مستمر في بوابة الوظائف.','Paid 3–12 month internships for students and recent graduates; openings are posted continuously on the careers portal.','open','2026-11-16'],
 ['iaea-mscfp','scholar','منحة ماري كوري من الوكالة الدولية (للطالبات)','IAEA Marie Skłodowska-Curie Fellowship (women)','الوكالة الدولية للطاقة الذرية','دولية','','','https://www.iaea.org/services/key-programmes/marie-sklodowska-curie-fellowship-programme','IAEA','منحة ماجستير في المجالات النووية للطالبات. أُغلقت دورة هذا العام في 31 أكتوبر 2026، والدورة القادمة تفتح عادة في سبتمبر.','Master’s scholarship in nuclear fields for women. This year’s call closed 31 Oct 2026; the next one usually opens in September.','upcoming','2026-11-16'],
 ['nrrc-portal','portal','وظائف هيئة الرقابة النووية والإشعاعية','NRRC careers','هيئة الرقابة النووية والإشعاعية','الرياض','','','https://nrrc.gov.sa','NRRC','تابع صفحة الهيئة وحساباتها لإعلانات الوظائف والتدريب.','Follow the regulator’s site and accounts for job and training announcements.','open','2026-11-16'],
 ['kacare-portal','portal','وظائف ومبادرات K.A.CARE','K.A.CARE careers & programmes','مدينة الملك عبدالله للطاقة الذرية والمتجددة','الرياض','','','https://www.kacare.gov.sa','K.A.CARE','الجهة المشرفة على المشروع الوطني للطاقة الذرية.','The body overseeing the national atomic energy project.','open','2026-11-16'],
 ['jadarat','portal','منصة جدارات للوظائف الحكومية','Jadarat national jobs platform','منصة جدارات','السعودية','','','https://jadarat.sa','Jadarat','ابحث فيها عن: نووي، إشعاع، فيزياء طبية، طب نووي.','Search for: nuclear, radiation, medical physics, nuclear medicine.','open','2026-11-16']
];
const T={
 ar:{tag:'📡 رادار الفرص النووية',title:['كل فرصة نووية ','في مكان واحد'],sub:'وظائف وتدريب ومنح ودورات في المجال النووي في السعودية والعالم، مع آخر موعد للتقديم ورابط المصدر الرسمي. نحدّثها أسبوعيًا.',
  types:{all:'الكل',job:'💼 وظائف',intern:'🎓 تدريب',scholar:'🏅 منح',training:'📚 دورات وبرامج',portal:'🔗 بوابات رسمية'},
  q:'ابحث: مدينة، جهة، تخصص…',dl:'آخر موعد',open:'مفتوح',left:'باقي {n} يوم',today:'آخر يوم اليوم!',upcoming:'قريبًا',newB:'جديد',src:'المصدر',apply:'التقديم ←',ver:'آخر تحقق',
  none:'ما فيه فرص مطابقة حاليًا.',live:'🟢 محدّث من قاعدة البيانات',offline:'📦 نسخة محفوظة',
  sug:'عندك فرصة نووية مو موجودة؟ أرسلها لنا:',
  note:'⚠️ نجمع الفرص من مصادر عامة ونتحقق منها دوريًا، لكن تأكد دائمًا من الشروط والمواعيد في الموقع الرسمي قبل التقديم.'},
 en:{tag:'📡 Nuclear Opportunities Radar',title:['Every nuclear opportunity, ','in one place'],sub:'Jobs, internships, scholarships and courses in the nuclear field in Saudi Arabia and worldwide, with deadlines and official source links. Updated weekly.',
  types:{all:'All',job:'💼 Jobs',intern:'🎓 Internships',scholar:'🏅 Scholarships',training:'📚 Courses & programmes',portal:'🔗 Official portals'},
  q:'Search: city, organization, field…',dl:'Deadline',open:'Open',left:'{n} days left',today:'Last day today!',upcoming:'Coming soon',newB:'New',src:'Source',apply:'Apply →',ver:'Last checked',
  none:'No matching opportunities right now.',live:'🟢 Live from the database',offline:'📦 Saved copy',
  sug:'Know a nuclear opportunity that’s missing? Send it to us:',
  note:'⚠️ We collect opportunities from public sources and check them regularly, but always confirm conditions and dates on the official site before applying.'}
};
function parseCSV(t){const rows=[];let r=[],f='',q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}else if(c==='"')q=true;else if(c===','){r.push(f);f='';}else if(c==='\n'||c==='\r'){if(c==='\r'&&t[i+1]==='\n')i++;r.push(f);rows.push(r);r=[];f='';}else f+=c;}if(f!==''||r.length){r.push(f);rows.push(r);}return rows;}
const toObj=a=>{const o={};COLS.forEach((k,i)=>o[k]=(a[i]||'').trim());return o;};
const esc=s=>String(s||'').replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const days=d=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return null;const t=new Date(d+'T23:59:59');return Math.ceil((t-new Date())/864e5);};
const fd=d=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return d;try{return new Date(d+'T12:00:00').toLocaleDateString(A.LANG==='ar'?'ar-SA-u-ca-gregory-nu-latn':'en-GB',{day:'numeric',month:'short',year:'numeric'});}catch(e){return d;}};
A.V.radar={html(C){const t=T[A.LANG];return `<section><div class="wrap">${A.sh(t.tag,t.title,t.sub)}
 <div class="rr-bar"><input id="rrQ" placeholder="${t.q}"><span id="rrSrc" class="rr-src"></span></div>
 <div class="news-f" id="rrF">${Object.keys(t.types).map((k,i)=>`<button data-f="${k}" class="${i?'':'on'}">${t.types[k]}</button>`).join('')}</div>
 <div class="rr-list" id="rrL"></div>
 <div class="card rr-sug"><span>${t.sug}</span> <a href="mailto:ne4all.sa@gmail.com?subject=${encodeURIComponent(A.LANG==='ar'?'فرصة نووية للرادار':'Opportunity for the radar')}" dir="ltr">ne4all.sa@gmail.com</a></div>
 <p class="note" style="margin-top:14px">${t.note}</p></div></section>`;},
 init(){const t=T[A.LANG],ar=A.LANG==='ar';let data=SEED.map(toObj),f='all',live=false;
  const $=id=>document.getElementById(id);
  function card(o){const n=days(o.deadline),isNew=o.posted&&days(o.posted)!==null&&-days(o.posted)<=14;
   let dl=o.status==='upcoming'?`<b class="rr-up">${t.upcoming}</b>`:n===null?`<b>${t.open}</b>`:n===0?`<b class="rr-hot">${t.today}</b>`:`<b class="${n<=7?'rr-hot':''}">${fd(o.deadline)} · ${t.left.replace('{n}',n)}</b>`;
   return `<article class="rr-c"><div class="rr-top"><span class="rr-t">${t.types[o.type]||o.type}</span>${isNew?`<span class="rr-new">${t.newB}</span>`:''}</div>
    <h3>${esc(ar?o.title_ar||o.title_en:o.title_en||o.title_ar)}</h3><div class="rr-org">🏢 ${esc(o.org)}${o.city?' · 📍 '+esc(o.city):''}</div>
    <p>${esc(ar?o.notes_ar||o.notes_en:o.notes_en||o.notes_ar)}</p>
    <div class="rr-meta"><span>⏰ ${t.dl}: ${dl}</span></div>
    <div class="rr-foot"><small>${t.src}: ${esc(o.source)}${o.verified?' · '+t.ver+': '+fd(o.verified):''}</small><a class="btn pri" href="${esc(o.link)}" target="_blank" rel="noopener">${t.apply}</a></div></article>`;}
  function render(){const q=$('rrQ').value.trim().toLowerCase();
   const L=data.filter(o=>o.id&&o.title_ar+o.title_en&&o.status!=='closed'&&!(days(o.deadline)!==null&&days(o.deadline)<0))
    .filter(o=>f==='all'||o.type===f).filter(o=>!q||Object.values(o).join(' ').toLowerCase().includes(q))
    .sort((a,b)=>{const da=days(a.deadline),db=days(b.deadline);if(da!==null&&db!==null)return da-db;if(da!==null)return -1;if(db!==null)return 1;return (b.posted||'').localeCompare(a.posted||'');});
   $('rrL').innerHTML=L.length?L.map(card).join(''):`<p class="rr-none">${t.none}</p>`;$('rrSrc').textContent=live?t.live:t.offline;}
  $('rrQ').oninput=render;
  document.querySelectorAll('#rrF button').forEach(b=>b.onclick=()=>{f=b.dataset.f;document.querySelectorAll('#rrF button').forEach(x=>x.classList.toggle('on',x===b));render();});
  render();
  if(LIVE){data=LIVE;live=true;render();}else A.radarFetch().then(g=>{if(g){data=g;live=true;if(document.getElementById('rrL'))render();}});
  return null;}
};
A.RADAR_SEED=SEED;
let LIVE=null;const active=o=>o.id&&(o.title_ar||o.title_en)&&o.status!=='closed'&&!(days(o.deadline)!==null&&days(o.deadline)<0);
A.radarData=()=>(LIVE||SEED.map(toObj)).filter(active).sort((a,b)=>(b.posted||'').localeCompare(a.posted||''));
A.radarFetch=function(){if(!A.RADAR_SHEET)return Promise.resolve(null);return fetch(`https://docs.google.com/spreadsheets/d/${A.RADAR_SHEET}/gviz/tq?tqx=out:csv&sheet=Radar&_=${Date.now()}`).then(r=>{if(!r.ok)throw 0;return r.text();}).then(txt=>{const rows=parseCSV(txt).filter(r=>r.length>3);if(rows.length<2)throw 0;const head=rows[0].map(h=>h.trim());const idx=COLS.map(c=>head.indexOf(c));
 const got=rows.slice(1).map(r=>{const o={};COLS.forEach((c,i)=>o[c]=idx[i]>=0?(r[idx[i]]||'').trim():'');return o;}).filter(o=>o.id);if(!got.length)throw 0;LIVE=got;return got;}).catch(()=>null);};
setTimeout(()=>A.radarFetch(),0);
})(APP);
