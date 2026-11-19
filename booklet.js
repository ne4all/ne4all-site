/* ===== Printable "Nuclear Reference Booklet" (AR / EN / both) ===== */
(function(A){
const T={ar:{btn:'📘 كتيّب المرجع النووي (طباعة / PDF)',pick:'اختر لغة الكتيّب',ar:'العربية',en:'English',both:'اللغتان',close:'إلغاء',
  title:'كتيّب المرجع النووي',sub:'ملخّص مبسّط ومرتّب للعلوم والهندسة النووية',toc:'المحتويات',by:'إعداد: عبدالمجيد عبدالله الجحني · طالب هندسة نووية، جامعة الملك عبدالعزيز',
  ch:['الذرة والنشاط الإشعاعي','الإشعاع والوقاية منه','النووي في حياتنا','المفاعلات النووية','الطاقة النووية: الوقود والنفايات والاندماج','السلامة والأمن النووي','الثوابت الفيزيائية','المعادلات الأساسية','الوحدات والتحويلات','جداول مرجعية','قاموس المصطلحات'],
  note:'القيم مقرّبة وللاستخدام التعليمي. المصادر: CODATA 2018، ICRP 103، IAEA، NNDC.',hint:'في نافذة الطباعة اختر «حفظ بتنسيق PDF» لحفظ الكتيّب.'},
 en:{btn:'📘 Nuclear Reference Booklet (print / PDF)',pick:'Choose the booklet language',ar:'العربية',en:'English',both:'Both',close:'Cancel',
  title:'Nuclear Reference Booklet',sub:'A simple, organized summary of nuclear science and engineering',toc:'Contents',by:'By Abdulmajeed Abdullah Al-Jahni · Nuclear Engineering student, King Abdulaziz University',
  ch:['Atoms & radioactivity','Radiation & protection','Nuclear in daily life','Nuclear reactors','Nuclear energy: fuel, waste & fusion','Nuclear safety & security','Physical constants','Key equations','Units & conversions','Reference tables','Glossary of terms'],
  note:'Values are rounded for educational use. Sources: CODATA 2018, ICRP 103, IAEA, NNDC.',hint:'In the print dialog choose “Save as PDF” to keep the booklet.'}};
const PAGES=['atoms','radiation','life','reactors','energy','safety'];
const E=s=>String(s||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]));
const noEmoji=s=>String(s||'').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{1F1E6}-\u{1F1FF}\u{2300}-\u{23FF}]/gu,'').replace(/\s+/g,' ').trim();
function summary(v){let h='';try{h=A.V[v].html(A.C);}catch(e){return '';}
 const d=new DOMParser().parseFromString('<div>'+h+'</div>','text/html');let out='';
 const simple=d.querySelector('.simple');if(simple)out+=`<p class="bk-simple">${E(noEmoji(simple.textContent))}</p>`;
 const seen=new Set();let n=0;
 d.querySelectorAll('.card,.panel').forEach(c=>{if(n>=14)return;const t=c.querySelector('h3,h4');if(!t)return;const tt=noEmoji(t.textContent);if(!tt||tt.length>70||seen.has(tt))return;
  const p=[...c.querySelectorAll('p')].map(x=>noEmoji(x.textContent)).filter(x=>x.length>25)[0];if(!p)return;seen.add(tt);n++;
  out+=`<div class="bk-item"><h4>${E(tt)}</h4><p>${E(p.length>320?p.slice(0,317)+'…':p)}</p></div>`;});
 return out;}
function tbl(rows,head=true){return `<table class="bk-t">${rows.map((r,i)=>`<tr>${r.map(c=>i===0&&head?`<th>${E(noEmoji(c))}</th>`:`<td>${E(noEmoji(c))}</td>`).join('')}</tr>`).join('')}</table>`;}
function bookFor(l){const keepL=A.LANG,keepC=A.C;A.LANG=l;A.C=CONTENT[l];const t=T[l],R=(A.RF||{})[l]||{};let body='';
 try{
  const chs=[];PAGES.forEach((v,i)=>chs.push([t.ch[i],summary(v)]));
  if(R.con)chs.push([t.ch[6],tbl([[R.c,'',R.v]].concat(R.con))]);
  if(R.eq)chs.push([t.ch[7],R.eq.map(e=>`<div class="bk-eq"><b>${E(e[0])}</b><div dir="ltr">${E(e[1])}</div></div>`).join('')]);
  if(R.un)chs.push([t.ch[8],tbl(R.un)]);
  if(R.hl)chs.push([t.ch[9],`<h4>${E(R.hlT)}</h4>${tbl(R.hl)}<h4>${E(R.xsT)}</h4>${tbl(R.xs)}<h4>${E(R.wrT)}</h4>${tbl(R.wr)}<h4>${E(R.lmT)}</h4>${tbl(R.lm)}`]);
  const G=(window.GLOSSARY||[]).slice().sort((a,b)=>(l==='ar'?a[0]:a[1]).localeCompare(l==='ar'?b[0]:b[1],l));
  chs.push([t.ch[10],`<div class="bk-gl">${G.map(g=>`<p><b>${E(l==='ar'?g[0]:g[1])}</b> <span>(${E(l==='ar'?g[1]:g[0])})</span>: ${E(l==='ar'?g[2]:g[3])}</p>`).join('')}</div>`]);
  const d=new Date().toLocaleDateString(l==='ar'?'ar-SA-u-ca-gregory':'en-GB',{year:'numeric',month:'long'});
  body=`<section class="bk-lang" dir="${l==='ar'?'rtl':'ltr'}" lang="${l}">
   <div class="bk-cover"><div class="bk-logo">⚛</div><div class="bk-brand">NE for All · ${E(CONTENT[l].brandSub)}</div><h1>${t.title}</h1><p class="bk-sub">${t.sub}</p><p class="bk-by">${t.by}</p><p class="bk-date">${d} · ne4all</p></div>
   <div class="bk-toc"><h2>${t.toc}</h2><ol>${chs.map(c=>`<li>${E(c[0])}</li>`).join('')}</ol><p class="bk-note">${t.note}</p></div>
   ${chs.map((c,i)=>`<div class="bk-ch"><h2><span>${i+1}</span>${E(c[0])}</h2>${c[1]}</div>`).join('')}</section>`;
 }finally{A.LANG=keepL;A.C=keepC;}
 return body;}
function printBook(mode){let box=document.getElementById('booklet');if(!box){box=document.createElement('div');box.id='booklet';document.body.appendChild(box);}
 box.innerHTML=(mode==='both'?bookFor('ar')+bookFor('en'):bookFor(mode));
 document.body.classList.add('print-book');const off=()=>{document.body.classList.remove('print-book');box.innerHTML='';window.removeEventListener('afterprint',off);};
 window.addEventListener('afterprint',off);setTimeout(()=>{try{window.print();}catch(e){}setTimeout(off,2000);},120);}
function picker(){const t=T[A.LANG];let m=document.getElementById('bkPick');if(m)m.remove();m=document.createElement('div');m.id='bkPick';
 m.innerHTML=`<div class="bk-dlg" role="dialog" aria-modal="true"><h3>${t.pick}</h3><div class="bk-btns"><button class="btn pri" data-m="ar">${t.ar}</button><button class="btn pri" data-m="en">${t.en}</button><button class="btn pri" data-m="both">${t.both}</button></div><p class="note">${t.hint}</p><button class="btn" data-m="x">${t.close}</button></div>`;
 document.body.appendChild(m);m.onclick=e=>{const b=e.target.closest('button');if(e.target===m||(b&&b.dataset.m==='x')){m.remove();return;}if(b){m.remove();printBook(b.dataset.m);}};}
A.printBooklet=printBook;
const r0=A.route;A.route=function(){const o=r0.apply(this,arguments);try{const v=(location.hash||'#home').slice(1).split('?')[0];
 if(v==='glossary'){const old=document.getElementById('rfPrint');if(old&&!document.getElementById('bkBtn')){const b=document.createElement('button');b.type='button';b.className='btn pri';b.id='bkBtn';b.textContent=T[A.LANG].btn;b.onclick=picker;old.insertAdjacentElement('afterend',b);b.style.marginInlineStart='8px';}}}catch(e){console.error(e);}return o;};
})(APP);
