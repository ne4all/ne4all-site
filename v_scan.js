/* ===== RADIATION SCANNER (camera + AI identification + reference library) ===== */
(function(A){
// Address of the Cloudflare Worker that talks to Gemini. Empty = AI off (library mode only).
A.SCAN_API='';
const T={
 ar:{tag:'🔍 ماسح الإشعاع',title:['صوّر أي شيء و','اعرف إشعاعه'],sub:'وجّه الكاميرا على أي شيء حولك، والذكاء الاصطناعي يتعرف عليه ويعطيك ملفه الإشعاعي من مرجع علمي: وش فيه من مواد مشعة طبيعية، وكم نشاطه المعتاد، ومقارنة تفهمها.',
  cam:'🎥 كاميرا مباشرة',snap:'📷 صوّر',pick:'🖼️ من الصور',shot:'التقاط',again:'↺ صورة جديدة',go:'🔍 حلّل الصورة',aim:'وجّه الدائرة على الشيء',tap:'اضغط على الصورة لتغيير الشيء المستهدف 🎯',
  busy:'جارٍ التحليل…',aiOff:'التعرف بالذكاء الاصطناعي غير متاح حاليًا. جرّب لاحقًا 🙏',err:'تعذر التحليل الآن. تأكد من الاتصال وجرّب مرة ثانية.',quota:'وصلنا للحد اليومي للتحليل المجاني. جرّب لاحقًا 🙏',
  libT:'📚 مكتبة الأشياء',libS:'ابحث عن أي شيء...',lvl:'المستوى',iso:'النظائر المشعة',act:'النشاط المعتاد',src1:'📚 من مرجع المنصة',src2:'🤖 تقدير الذكاء الاصطناعي',conf:['ثقة منخفضة','ثقة متوسطة','ثقة عالية'],
  alt:'مو هذا؟ اختر الأدق:',others:'وفي الصورة أيضًا:',scale:'للمقارنة',
  ref:[['🍌 أكل موزة','0.1 µSv'],['🦷 أشعة أسنان','5 µSv'],['🫁 أشعة صدر','20 µSv'],['✈️ رحلة جدة–لندن','≈ 30 µSv'],['🌍 الخلفية الطبيعية سنويًا','≈ 2,400 µSv']],
  disc:'⚠️ هذه أداة تعليمية: تعطيك القيم المعتادة لهذا النوع من الأشياء حسب المراجع العلمية، وليست قياسًا حقيقيًا. الكاميرا لا تقيس الإشعاع، والشيء نفسه قد يختلف حسب مصدره. إذا شككت في شيء، تواصل مع هيئة الرقابة النووية والإشعاعية.',
  priv:'🔒 الصورة تُرسل لخدمة ذكاء اصطناعي خارجية للتحليل، ولا نحفظها نحن. أول مرة قد يُطلب منك تسجيل دخول مجاني في Puter لتشغيل الذكاء الاصطناعي على حسابك. لا تصوّر أشخاصًا أو مستندات خاصة.',camErr:'تعذر فتح الكاميرا المباشرة هنا. استخدم زر "📷 صوّر" أو "🖼️ من الصور".'},
 en:{tag:'🔍 Radiation Scanner',title:['Snap anything, ','know its radiation'],sub:'Point your camera at anything around you. AI identifies it and gives its radiation profile from a scientific reference: which natural radioactive elements it has, its typical activity, and a comparison you can relate to.',
  cam:'🎥 Live camera',snap:'📷 Take photo',pick:'🖼️ From gallery',shot:'Capture',again:'↺ New photo',go:'🔍 Analyze photo',aim:'Aim the circle at the object',tap:'Tap the photo to change the target 🎯',
  busy:'Analyzing…',aiOff:'AI recognition isn’t available right now. Please try later 🙏',err:'Couldn’t analyze right now. Check your connection and try again.',quota:'We hit today’s free analysis limit. Please try later 🙏',
  libT:'📚 Object library',libS:'Search anything...',lvl:'Level',iso:'Radioactive isotopes',act:'Typical activity',src1:'📚 From our reference',src2:'🤖 AI estimate',conf:['Low confidence','Medium confidence','High confidence'],
  alt:'Not this? Pick the closer match:',others:'Also in the photo:',scale:'For comparison',
  ref:[['🍌 Eating a banana','0.1 µSv'],['🦷 Dental X-ray','5 µSv'],['🫁 Chest X-ray','20 µSv'],['✈️ Jeddah–London flight','≈ 30 µSv'],['🌍 Natural background per year','≈ 2,400 µSv']],
  disc:'⚠️ This is an educational tool: it gives typical values for this kind of object from scientific references, not a real measurement. A camera can’t measure radiation, and the same object can vary by origin. If in doubt, contact your national radiation regulator.',
  priv:'🔒 Photos are sent to an external AI service for analysis; we don’t store them. The first time, you may be asked for a free Puter sign-in to run the AI on your own account. Don’t photograph people or private documents.',camErr:'The live camera can’t open here. Use “📷 Take photo” or “🖼️ From gallery”.'}
};
const L=()=>T[A.LANG],ar=()=>A.LANG==='ar',byId=id=>A.SCANLIB.find(r=>r[0]===id);
const md=s=>String(s||'').replace(/[<>&]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c])).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');
function lvlBar(l){const n=A.SCANLVL,c=n.c[l];return `<div class="sc-lv"><div class="sc-bar">${[0,1,2,3,4].map(i=>`<i style="background:${i<=l?n.c[Math.min(i,l)]:'rgba(255,255,255,.1)'}"></i>`).join('')}</div><b style="color:${c}">${n[A.LANG][l]}</b></div>`;}
function libCard(r,extra){const t=L(),a=ar();return `<div class="sc-res"><div class="sc-hd"><span class="sc-em">${r[1]}</span><div><h3>${a?r[3]:r[4]}</h3><small>${t.src1}${extra?' · '+extra:''}</small></div></div>${lvlBar(r[2])}
 <div class="sc-row"><span>${t.iso}</span><b dir="ltr">${r[5]}</b></div><div class="sc-row"><span>${t.act}</span><b>${md(a?r[6]:r[7])}</b></div><p class="sc-note">💡 ${md(a?r[8]:r[9])}</p></div>`;}
function aiCard(o,t){const a=ar(),l=Math.max(0,Math.min(4,o.level|0));return `<div class="sc-res"><div class="sc-hd"><span class="sc-em">${md(o.emoji||'🔎')}</span><div><h3>${md(a?o.name_ar:o.name_en)}</h3><small>${t.src2} · ${t.conf[Math.max(0,Math.min(2,o.confidence|0))]}</small></div></div>${lvlBar(l)}
 <div class="sc-row"><span>${t.iso}</span><b dir="ltr">${md(o.isotopes||'—')}</b></div><div class="sc-row"><span>${t.act}</span><b>${md(a?o.activity_ar:o.activity_en)}</b></div><p class="sc-note">💡 ${md(a?o.note_ar:o.note_en)}</p></div>`;}
let _sm;async function claudeSample(){if(_sm!==undefined)return _sm;_sm=null;try{if(window.claude&&window.claude.use){const sm=await window.claude.use('sample');if(sm){let ok=true;try{if(sm.limits){const l=await sm.limits();ok=!!(l&&l.images);}}catch(e){}if(ok)_sm=sm;}}}catch(e){}return _sm;}
A.SCAN_PROMPT=`You are the vision engine of "NE for All", an educational nuclear-science website. The attached photo shows an everyday object; the TARGET is the object inside or closest to the RED CIRCLE.
Rules: identify the target and its main material from texture, color and context. If it clearly matches a CATALOG item, set library_id to its id, else null; if unsure between catalog items, put the others' ids in alternatives and lower confidence. Describe ONLY natural or well-documented radioactivity typical for that kind of object, with typical ranges or qualitative terms; never invent precise numbers. Phones, Wi-Fi, microwaves and electronics emit non-ionizing waves: level 0. level: 0 negligible, 1 very low, 2 low, 3 notable (don't open/ingest), 4 relatively high (handle with care). Never call a specific item safe or contaminated from a photo. If a person is shown, describe only "human body" generally; never identify people or read private text. others: up to 5 other distinct objects in the photo. Arabic in simple Modern Standard Arabic; each text under 220 characters.
Reply with ONLY this JSON, no other text:
{"focus":{"name_ar":"","name_en":"","emoji":"","library_id":null,"level":0,"confidence":0,"isotopes":"","activity_ar":"","activity_en":"","note_ar":"","note_en":"","alternatives":[]},"others":[{"name_ar":"","name_en":"","emoji":"","library_id":null,"level":0,"isotopes":"","activity_ar":"","activity_en":"","note_ar":"","note_en":""}]}
confidence: 0 low, 1 medium, 2 high.`;
A.V.scan={html(C){const t=L();return `<section><div class="wrap">${A.sh(t.tag,t.title,t.sub)}
 <div class="sc-wrap"><div class="sc-cam" id="scCam"><video id="scVid" playsinline muted></video><canvas id="scCv"></canvas><div class="sc-ret" id="scRet"><span></span></div><div class="sc-hint" id="scHint"></div>
  <div class="sc-ph" id="scPh"><div class="sc-big">📷</div><p>${t.aim}</p></div></div>
  <div class="btns sc-btns" id="scBtns"></div><input type="file" id="scSnap" accept="image/*" capture="environment" hidden><input type="file" id="scFile" accept="image/*" hidden>
  <p class="sc-priv">${t.priv}</p>
  <div id="scOut"></div>
  <div class="card sc-scale"><h4>📏 ${t.scale}</h4>${t.ref.map(r=>`<div class="sc-row"><span>${r[0]}</span><b dir="ltr">${r[1]}</b></div>`).join('')}</div>
  <p class="note" style="margin-top:16px">${t.disc}</p></div></div></section>`;},
 init(){const t=L(),$=id=>document.getElementById(id),vid=$('scVid'),cv=$('scCv'),ret=$('scRet'),out=$('scOut'),btns=$('scBtns'),hint=$('scHint'),ph=$('scPh');let stream=null,img=null,fx=.5,fy=.5;
  const stop=()=>{if(stream){stream.getTracks().forEach(k=>k.stop());stream=null;}vid.style.display='none';};
  const setBtns=mode=>{btns.innerHTML=mode==='live'?`<button class="btn pri" id="scShot">⭕ ${t.shot}</button>`:mode==='photo'?`<button class="btn pri" id="scGo">${t.go}</button><button class="btn" id="scNew">${t.again}</button>`:`<label class="btn pri" for="scSnap">${t.snap}</label><label class="btn" for="scFile">${t.pick}</label>${liveOK()?`<button class="btn" id="scOpen">${t.cam}</button>`:''}`;
   if($('scOpen'))$('scOpen').onclick=openCam;if($('scShot'))$('scShot').onclick=shoot;if($('scGo'))$('scGo').onclick=analyze;if($('scNew'))$('scNew').onclick=()=>{img=null;cv.style.display='none';ret.style.display='none';hint.textContent='';ph.style.display='';out.innerHTML='';setBtns('start');};};
  function liveOK(){if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return false;try{const fp=document.permissionsPolicy||document.featurePolicy;if(fp&&fp.allowsFeature&&!fp.allowsFeature('camera'))return false;}catch(e){}return true;}
  async function openCam(){out.innerHTML='';try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280}},audio:false});vid.srcObject=stream;vid.style.display='block';await vid.play();ph.style.display='none';cv.style.display='none';fx=fy=.5;placeRet();ret.style.display='block';hint.textContent=t.aim;setBtns('live');}catch(e){stop();ph.style.display='';ret.style.display='none';hint.textContent='';out.innerHTML=`<div class="sc-msg">${t.camErr}</div>`;setBtns('start');}}
  function draw(){const W=cv.width,H=cv.height,g=cv.getContext('2d');g.drawImage(img,0,0,W,H);}
  function placeRet(){ret.style.left=(fx*100)+'%';ret.style.top=(fy*100)+'%';}
  function usePhoto(src){img=src;const s=Math.min(1,1024/Math.max(src.width||src.videoWidth,src.height||src.videoHeight));cv.width=Math.round((src.width||src.videoWidth)*s);cv.height=Math.round((src.height||src.videoHeight)*s);draw();cv.style.display='block';ph.style.display='none';ret.style.display='block';placeRet();hint.textContent=t.tap;setBtns('photo');}
  function shoot(){const c=document.createElement('canvas');c.width=vid.videoWidth;c.height=vid.videoHeight;c.getContext('2d').drawImage(vid,0,0);stop();usePhoto(c);}
  $('scSnap').onchange=$('scFile').onchange=e=>{const f=e.target.files&&e.target.files[0];if(!f)return;const im=new Image();im.onload=()=>{stop();fx=fy=.5;usePhoto(im);URL.revokeObjectURL(im.src);};im.src=URL.createObjectURL(f);e.target.value='';};
  cv.onclick=e=>{const r=cv.getBoundingClientRect();fx=(e.clientX-r.left)/r.width;fy=(e.clientY-r.top)/r.height;placeRet();};
  async function analyze(){if(!img)return;
   // image sent to AI: downscaled, with a red ring around the target
   const c=document.createElement('canvas'),s=Math.min(1,768/Math.max(cv.width,cv.height));c.width=Math.round(cv.width*s);c.height=Math.round(cv.height*s);const g=c.getContext('2d');g.drawImage(cv,0,0,c.width,c.height);
   const R=Math.min(c.width,c.height)*0.16;g.strokeStyle='#ff1f1f';g.lineWidth=Math.max(4,R*0.08);g.beginPath();g.arc(fx*c.width,fy*c.height,R,0,Math.PI*2);g.stroke();
   const dataUrl=c.toDataURL('image/jpeg',0.82),catalog=A.SCANLIB.map(r=>r[0]+': '+r[4]).join('; ');
   out.innerHTML=`<div class="sc-msg"><span class="sc-spin"></span> ${t.busy}</div>`;const gb=$('scGo');if(gb)gb.disabled=true;
   try{let j=null;
    if(A.SCAN_API){const res=await fetch(A.SCAN_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:dataUrl.split(',')[1],catalog})});
     if(res.status===429){out.innerHTML=`<div class="sc-msg">${t.quota}</div>`;return;}if(!res.ok)throw new Error('http '+res.status);j=await res.json();}
    else if(!window.claude&&window.puter&&puter.ai){ // Puter.js: each visitor uses their own Puter account (user-pays)
     const r=await puter.ai.chat(A.SCAN_PROMPT+'\n\nCATALOG (id: name): '+catalog,dataUrl,{model:'google/gemini-2.5-flash'});
     let txt=r&&r.message?r.message.content:r;if(Array.isArray(txt))txt=txt.map(x=>x.text||'').join('');txt=String(txt||(r&&r.toString?r.toString():''));
     const m=txt.match(/\{[\s\S]*\}/);if(!m)throw new Error('parse');j=JSON.parse(m[0]);}
    else{const sm=await claudeSample();if(!sm){out.innerHTML=`<div class="sc-msg">${t.aiOff}</div>`;return;}
     const blob=await (await fetch(dataUrl)).blob();
     const r=await sm(A.SCAN_PROMPT+'\n\nCATALOG (id: name): '+catalog,{images:[blob],modelTier:'quick'});
     const m=String(r.text||'').match(/\{[\s\S]*\}/);if(!m)throw new Error('parse');j=JSON.parse(m[0]);}
    render(j);}catch(e){out.innerHTML=`<div class="sc-msg">${e&&e.code==='rate_limited'?t.quota:t.err}</div>`;}finally{if($('scGo'))$('scGo').disabled=false;}}
  function render(j){const f=j.focus||{},lib=f.library_id&&byId(f.library_id);let h='';
   h+=lib?libCard(lib,(ar()?f.name_ar:f.name_en)?md(ar()?f.name_ar:f.name_en):''):aiCard(f,t);
   const alts=(f.alternatives||[]).map(byId).filter(Boolean).filter(r=>!lib||r[0]!==lib[0]);
   if(alts.length)h+=`<div class="sc-alt"><span>${t.alt}</span>${alts.map(r=>`<button class="btn" data-id="${r[0]}">${r[1]} ${ar()?r[3]:r[4]}</button>`).join('')}</div>`;
   const oth=(j.others||[]).slice(0,6);
   if(oth.length)h+=`<div class="sc-oth"><span>${t.others}</span>${oth.map((o,i)=>{const lb=o.library_id&&byId(o.library_id),l=lb?lb[2]:Math.max(0,Math.min(4,o.level|0));return `<button class="sc-it" data-o="${i}"><span>${lb?lb[1]:md(o.emoji||'•')}</span>${md(ar()?o.name_ar:o.name_en)}<i style="background:${A.SCANLVL.c[l]}"></i></button>`;}).join('')}</div>`;
   out.innerHTML=h;
   out.querySelectorAll('.sc-alt .btn').forEach(b=>b.onclick=()=>{out.querySelector('.sc-res').outerHTML=libCard(byId(b.dataset.id));});
   out.querySelectorAll('.sc-oth .sc-it').forEach(b=>b.onclick=()=>{const o=oth[+b.dataset.o],lb=o.library_id&&byId(o.library_id);out.querySelector('.sc-res').outerHTML=lb?libCard(lb):aiCard(Object.assign({confidence:1},o),t);out.scrollIntoView({behavior:'smooth',block:'start'});});
   out.scrollIntoView({behavior:'smooth',block:'start'});}
  setBtns('start');
  if(!window.claude&&!A.SCAN_API&&!window.puter&&!document.getElementById('puterJs')){const sc=document.createElement('script');sc.id='puterJs';sc.src='https://js.puter.com/v2/';sc.async=true;document.head.appendChild(sc);}
  return {destroy(){stop();}};}
};
})(APP);
