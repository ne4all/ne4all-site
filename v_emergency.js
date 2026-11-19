/* ===== RADIOLOGICAL EMERGENCY SIMULATOR =====
 Hypothetical NPP on a real coast. Real map: MapLibre GL + OpenFreeMap (OSM, free, no key) with 3D buildings.
 Physics: Gaussian plume (Pasquill–Gifford stability, Briggs open-country σy/σz, ground reflection, mixing lid).
 Doses: inhalation (ICRP dose coefficients), cloudshine (noble gas), groundshine (deposition).
 Decisions judged against IAEA GSR Part 7 generic criteria and default OILs. Educational estimates only. */
(function(A){
const SITE0={lat:22.60,lon:39.09};
// real places [ar,en,lat,lon,approx population]
const LOC=[['رابغ','Rabigh',22.798,39.034,100000],['مدينة الملك عبدالله الاقتصادية','King Abdullah Economic City',22.45,39.12,10000],['ثُوَل','Thuwal',22.282,39.108,12000],['جامعة كاوست','KAUST',22.309,39.104,7000],['مستورة','Mastoorah',23.11,38.84,8000],['ذهبان','Dhahban',21.93,39.10,30000],['عسفان','Usfan',21.92,39.36,10000],['أبحر الشمالية','North Obhur',21.76,39.10,100000],['جدة','Jeddah',21.54,39.17,1000000],['خليص','Khulais',22.15,39.32,30000]];
// scenarios: total release (Bq), duration (h)
const SC=[{I:4e14,Cs:1e13,Xe:1e17,dur:3},{I:4e15,Cs:2e14,Xe:1e18,dur:6},{I:1.5e17,Cs:1.2e16,Xe:1.1e19,dur:10}];
const STAB={B:{y:.16,z:[.12,0,0],L:1500},C:{y:.11,z:[.08,.0002,.5],L:1000},D:{y:.08,z:[.06,.0015,.5],L:800},F:{y:.04,z:[.016,.0003,1],L:250}};
// dose coefficients
const K={brA:2.57e-4,brC:6.0e-5,eI:7.4e-9,eCs:4.6e-9,thC:1.4e-6,xe:1.5e-15,vdI:.005,vdCs:.002,gI:5.5e-13,gCs:2.1e-12,H:50,hI:126,hCs:168,shIn:.5,shEx:.4};
const T={ar:{
 tag:'محاكٍ تدريبي',title:['محاكي ','الطوارئ الإشعاعية'],
 sub:'أنت صاحب القرار: وقع حادث في محطة نووية افتراضية، وبدأت سحابة مشعة تتحرك مع الرياح. قرّر من يُخلى، ومن يبقى داخل المباني، ومن يتناول أقراص اليود، ثم شاهد النتيجة على خريطة حقيقية.',
 disc:'⚠️ <b>سيناريو تدريبي افتراضي:</b> المحطة الظاهرة على الخريطة غير موجودة في الواقع، والأماكن المحيطة بها حقيقية لزيادة الواقعية فقط. الأرقام تقديرية لأغراض تعليمية، ولا تمثّل تقييمًا لأي منشأة حقيقية. وفي أي طارئ حقيقي اتبع تعليمات الجهات الرسمية.',
 simple:'في الحادث الخطير لا يكون الخطر "انفجارًا نوويًا"، بل <b>سحابة من المواد المشعة</b> قد تتسرب من المحطة وتحملها الرياح. ولحماية الناس ثلاثة إجراءات رئيسية: <b>الإخلاء</b>، و<b>البقاء داخل المباني</b>، و<b>أقراص يوديد البوتاسيوم</b> التي تحمي الغدة الدرقية. والقرار الصحيح يعتمد على ثلاثة أشياء: <b>المسافة، والتوقيت، واتجاه الرياح</b>.',
 s1:'١. السيناريو والطقس',sev:'شدة الحادث',
 sevs:[['حادث محدود','تلف في الوقود وتسرّب صغير لساعات قليلة · قرابة المستوى 5 على مقياس INES'],['حادث خطير','انصهار جزئي للقلب وتسرّب متوسط لعدة ساعات · قرابة المستوى 6'],['حادث كبير','انصهار القلب وتسرّب كبير يشبه فوكوشيما · المستوى 7']],
 wind:'الرياح قادمة من',speed:'سرعة الرياح',ms:'م/ث',stab:'حالة الجو',
 stabs:{B:'نهار مشمس ورياح خفيفة: السحابة تتشتت بسرعة',C:'نهار غائم جزئيًا',D:'جو غائم أو رياح قوية',F:'ليل صافٍ وهادئ: السحابة تبقى مركّزة'},
 dirs:['الشمال','الشمال الشرقي','الشرق','الجنوب الشرقي','الجنوب','الجنوب الغربي','الغرب','الشمال الغربي'],
 rnd:'🎲 طقس واقعي عشوائي',surprise:'مفاجآت الطقس: قد يتغير اتجاه الرياح أثناء التسرب، كما يحدث في الواقع',
 s2:'٢. قراراتك',when:'متى تُصدر الأوامر؟',whens:['فورًا عند إعلان الطوارئ','بعد ساعة (للتأكد أولًا)','بعد 3 ساعات (انتظار القياسات)'],
 evR:'🚌 نصف قطر الإخلاء',km:'كم',none:'بدون',shape:'شكل منطقة الإخلاء',shapes:['دائرة كاملة','ثقب المفتاح: 5 كم حول المحطة + قطاع باتجاه الريح المتوقعة'],
 shR:'🏠 البقاء داخل المباني حتى مسافة',ki:'💊 أقراص يوديد البوتاسيوم',kis:['لا توزَّع','لسكان مناطق الإخلاء والإيواء','لكل من في نطاق 50 كم'],
 oil:'📏 بعد التسرب: طبّق معايير القياس (نقل السكان من المناطق شديدة التلوث، وقيود على الغذاء والماء المحليين)',
 run:'▶ ابدأ المحاكاة',again:'↺ عدّل قراراتك وجرّب مرة أخرى',move:'📍 انقل المحطة',moveHint:'انقر على الخريطة لاختيار موقع المحطة الافتراضية',
 city3d:'🏙️ اقترب من المدينة (3D)',back:'🗺️ المنطقة كاملة',layers:['الجرعة الفعالة (7 أيام)','الغدة الدرقية لطفل','التلوث الأرضي'],
 unit:['ملي سيفرت','ملي سيفرت','ميكروسيفرت/ساعة'],clock:'منذ إعلان الطوارئ',plant:'محطة افتراضية',
 loading:'جارٍ تحميل الخريطة الحقيقية…',fb:'تعذّر تحميل الخريطة الحقيقية هنا، فتُعرض خريطة مبسّطة بالحسابات نفسها. افتح الموقع من المتصفح لرؤية الخريطة الحقيقية ثلاثية الأبعاد.',
 evN:{ge:'إعلان حالة الطوارئ العامة في المحطة',ord:'صدرت أوامرك للسكان',rel:'بدأ تسرّب المواد المشعة',arr:'وصلت السحابة إلى {n}',sh:'تغيّر اتجاه الرياح: صارت قادمة من {d}',end:'توقف التسرّب',done:'انتهت المحاكاة: هذه الجرعات المتوقعة خلال 7 أيام'},
 res:'٣. النتيجة',grades:['ممتاز','جيد','مقبول','يحتاج مراجعة'],score:'تقييم قراراتك',
 th:['المكان','المسافة','بدون حماية','مع قراراتك','الغدة الدرقية (طفل)','الإجراء'],
 act:{ev:'إخلاء',sh:'إيواء',ki:'يود',rl:'نقل لاحق',no:'—'},pop:'السكان (تقديري)',
 sum:[['أعلى جرعة متوقعة لشخص على اليابسة مع قراراتك','ملي سيفرت'],['أقصى مسافة تجاوزت 100 ملي سيفرت بدون حماية','كم'],['أقصى مسافة احتاجت أقراص اليود','كم'],['أماكن أُخليت بلا حاجة','']],
 L:{ok:'✅ قرارات متوازنة: حميت الناس دون إخلاء غير ضروري.',a100:'⛔ مساحة قرابة {a} كم² من اليابسة بقيت بلا حماية كافية وتجاوزت فيها الجرعة 100 ملي سيفرت (قرى ومزارع وطرق بين المدن). كانت الجرعة تتجاوز هذا الحد بدون حماية حتى {r} كم.',aThy:'🦋 مساحة قرابة {a} كم² تجاوزت فيها جرعة الغدة الدرقية للأطفال 50 ملي سيفرت رغم قراراتك. كان اليود مطلوبًا حتى {r} كم تقريبًا.',aUnn:'🚌 أخليت مساحة قرابة {a} كم² لم تصلها السحابة تقريبًا. لا بأس بالإخلاء الاحترازي القريب، لكن الإخلاء الواسع في كل الاتجاهات له ثمن.',hi:'⛔ {n}: الجرعة تجاوزت 100 ملي سيفرت خلال 7 أيام، وهو الحد الذي توصي عنده الوكالة الدولية للطاقة الذرية بالإخلاء أو الإيواء.',mid:'⚠️ {n}: جرعة بين 20 و100 ملي سيفرت. لن تسبب أعراضًا، لكن كان يمكن خفضها بالإيواء.',thy:'🦋 {n}: تجاوزت جرعة الغدة الدرقية لدى الأطفال 50 ملي سيفرت. أقراص اليود تحميهم إذا أُخذت قبل وصول السحابة أو بعدها بقليل.',unn:'🚌 {n}: أُخليت مع أن الجرعة المتوقعة منخفضة. الإخلاء ليس بلا ثمن: في فوكوشيما سُجّلت أكثر من 2,000 وفاة مرتبطة بالكارثة، كثير منها لكبار السن بسبب ظروف الإخلاء والنزوح.',paz:'📏 توصي الوكالة الدولية للطاقة الذرية بإخلاء احترازي لمسافة 3 إلى 5 كم فور إعلان الطوارئ العامة، حتى قبل بدء التسرب.',key:'🌬️ تغيّر اتجاه الرياح فخرجت السحابة من القطاع الذي أخليته. لهذا تجمع الخطط الحقيقية بين الإخلاء القريب والإيواء في جميع الاتجاهات.',late:'⏱️ تأخير القرار جعل السحابة تسبق الناس. في تشيرنوبل أُخليت مدينة بريبيات بعد نحو 36 ساعة من الانفجار.',food:'🥛 التلوث الأرضي في {n} تجاوز 1 ميكروسيفرت/ساعة، وهو المعيار الذي تُقيَّد عنده الأغذية المحلية والحليب. في تشيرنوبل كان الحليب الملوث السبب الرئيسي لسرطان الغدة الدرقية عند الأطفال.'},
 cmpT:'ماذا حدث في الواقع؟',
 cmp:[['☢️','تشيرنوبل 1986','أُخليت بريبيات (قرابة 49 ألف نسمة) بعد نحو 36 ساعة، ثم أُخلي نطاق 30 كم (قرابة 116 ألف شخص) خلال أيام. لم توزَّع أقراص اليود على نطاق واسع، بينما وزّعتها بولندا على نحو 18 مليون شخص.'],['🌊','فوكوشيما 2011','توسّع الإخلاء من 3 كم إلى 10 ثم 20 كم خلال يوم واحد، وطُلب من سكان 20 إلى 30 كم البقاء في المباني. وبسبب الرياح والأمطار تلوثت قرية إيتاتي على بُعد قرابة 40 كم، فأُخليت لاحقًا.'],['🌐','خطط الوكالة الدولية','منطقة إجراءات احترازية 3 إلى 5 كم تُخلى فورًا، ومنطقة إجراءات عاجلة 15 إلى 30 كم للإيواء وأقراص اليود، ثم قرارات لاحقة حسب القياسات.']],
 howT:'🧮 كيف حسبنا الجرعة؟ (اضغط على أي مكان في الجدول)',
 howI:'نموذج الانتشار الغاوسي للسحابة (Gaussian Plume)، يحسب التركيز المتكامل زمنيًا عند سطح الأرض:',
 crit:'المعايير المستخدمة (الوكالة الدولية للطاقة الذرية GSR Part 7 وOILs): إخلاء أو إيواء عند 100 ملي سيفرت خلال 7 أيام · أقراص اليود عند 50 ملي سيفرت للغدة الدرقية · نقل السكان عند 100 ميكروسيفرت/ساعة · قيود الغذاء عند 1 ميكروسيفرت/ساعة.',
 note:'تقديرات تعليمية مبسّطة ومحافظة: لا تشمل التضاريس ولا الأمطار ولا تغيّر الطقس بالتفصيل. البرامج الاحترافية مثل HotSpot وJRODOS تستخدم نماذج أدق.'
},en:{
 tag:'Training simulator',title:['Radiological ','emergency simulator'],
 sub:'You are in charge: an accident has happened at a hypothetical nuclear plant and a radioactive plume is drifting with the wind. Decide who evacuates, who shelters indoors and who takes iodine tablets, then see the outcome on a real map.',
 disc:'⚠️ <b>Hypothetical training scenario:</b> the plant on the map does not exist; the surrounding places are real only to make it realistic. Numbers are educational estimates and are not an assessment of any real facility. In a real emergency, follow official instructions.',
 simple:'In a serious accident the danger is not a "nuclear explosion" but a <b>cloud of radioactive material</b> that may leak and travel with the wind. There are three main ways to protect people: <b>evacuation</b>, <b>sheltering indoors</b> and <b>potassium iodide tablets</b> that protect the thyroid. The right decision depends on <b>distance, timing and wind direction</b>.',
 s1:'1. Scenario and weather',sev:'Accident severity',
 sevs:[['Limited accident','Fuel damage and a small release over a few hours · about INES level 5'],['Serious accident','Partial core melt and a medium release over several hours · about level 6'],['Major accident','Core melt and a large, Fukushima-like release · level 7']],
 wind:'Wind blowing from',speed:'Wind speed',ms:'m/s',stab:'Weather',
 stabs:{B:'Sunny day, light wind: the plume disperses fast',C:'Partly cloudy day',D:'Overcast or strong wind',F:'Clear, calm night: the plume stays concentrated'},
 dirs:['North','Northeast','East','Southeast','South','Southwest','West','Northwest'],
 rnd:'🎲 Random realistic weather',surprise:'Weather surprises: the wind may shift during the release, as happens in reality',
 s2:'2. Your decisions',when:'When do you issue orders?',whens:['Immediately at the emergency declaration','After 1 hour (to confirm first)','After 3 hours (wait for measurements)'],
 evR:'🚌 Evacuation radius',km:'km',none:'None',shape:'Evacuation zone shape',shapes:['Full circle','Keyhole: 5 km around the plant + a downwind sector'],
 shR:'🏠 Shelter indoors out to',ki:'💊 Potassium iodide tablets',kis:['Not distributed','For people in evacuation and shelter zones','For everyone within 50 km'],
 oil:'📏 After the release: apply measurement criteria (relocate people from heavily contaminated areas, restrict local food and water)',
 run:'▶ Start simulation',again:'↺ Change your decisions and try again',move:'📍 Move the plant',moveHint:'Click the map to choose the hypothetical plant location',
 city3d:'🏙️ Zoom into the city (3D)',back:'🗺️ Whole region',layers:['Effective dose (7 days)','Child thyroid','Ground contamination'],
 unit:['mSv','mSv','µSv/h'],clock:'since the emergency declaration',plant:'Hypothetical plant',
 loading:'Loading the real map…',fb:'The real map could not load here, so a simplified map with the same calculations is shown. Open the site in a browser to see the real 3D map.',
 evN:{ge:'General emergency declared at the plant',ord:'Your orders reach the public',rel:'Radioactive release begins',arr:'The plume reaches {n}',sh:'Wind shift: now blowing from the {d}',end:'Release stops',done:'Simulation finished: these are projected 7-day doses'},
 res:'3. Outcome',grades:['Excellent','Good','Fair','Needs review'],score:'Your decision score',
 th:['Place','Distance','Unprotected','With your decisions','Child thyroid','Action'],
 act:{ev:'Evacuated',sh:'Sheltered',ki:'Iodine',rl:'Relocated',no:'—'},pop:'Population (approx.)',
 sum:[['Highest projected dose on land with your decisions','mSv'],['Farthest distance above 100 mSv unprotected','km'],['Farthest distance needing iodine','km'],['Places evacuated unnecessarily','']],
 L:{ok:'✅ Balanced decisions: you protected people without unnecessary evacuation.',a100:'⛔ About {a} km² of land was left without enough protection and got more than 100 mSv (villages, farms and roads between towns). Unprotected, the dose exceeded this level out to {r} km.',aThy:'🦋 About {a} km² had child thyroid doses above 50 mSv despite your decisions. Iodine was needed out to about {r} km.',aUnn:'🚌 You evacuated about {a} km² that the plume barely reached. Nearby precautionary evacuation is fine, but wide evacuation in every direction has a cost.',hi:'⛔ {n}: dose above 100 mSv in 7 days, the level at which the IAEA recommends evacuation or sheltering.',mid:'⚠️ {n}: dose between 20 and 100 mSv. No symptoms, but sheltering would have reduced it.',thy:'🦋 {n}: child thyroid dose above 50 mSv. Iodine tablets protect if taken before, or shortly after, the plume arrives.',unn:'🚌 {n}: evacuated although the projected dose was low. Evacuation has a cost: Fukushima recorded over 2,000 disaster-related deaths, many of them elderly people affected by evacuation and displacement.',paz:'📏 The IAEA recommends precautionary evacuation out to 3–5 km as soon as a general emergency is declared, even before any release.',key:'🌬️ The wind shifted and the plume left the sector you evacuated. That is why real plans combine nearby evacuation with sheltering in all directions.',late:'⏱️ The delay let the plume arrive before people were protected. In Chernobyl, Pripyat was evacuated about 36 hours after the explosion.',food:'🥛 Ground contamination in {n} exceeded 1 µSv/h, the level at which local food and milk are restricted. In Chernobyl, contaminated milk was the main cause of thyroid cancer in children.'},
 cmpT:'What happened in reality?',
 cmp:[['☢️','Chernobyl 1986','Pripyat (about 49,000 people) was evacuated after about 36 hours, then the 30 km zone (about 116,000 people) over the following days. Iodine was not widely distributed, while Poland gave it to about 18 million people.'],['🌊','Fukushima 2011','Evacuation grew from 3 to 10 then 20 km within a day, and people at 20–30 km were told to shelter. Wind and rain contaminated Iitate, about 40 km away, which was evacuated later.'],['🌐','IAEA plans','A precautionary zone of 3–5 km evacuated immediately, an urgent zone of 15–30 km for sheltering and iodine, then later decisions based on measurements.']],
 howT:'🧮 How was the dose calculated? (tap any place in the table)',
 howI:'Gaussian plume model: time-integrated ground-level concentration:',
 crit:'Criteria used (IAEA GSR Part 7 and OILs): evacuate or shelter at 100 mSv in 7 days · iodine at 50 mSv thyroid dose · relocation at 100 µSv/h · food restrictions at 1 µSv/h.',
 note:'Simplified, conservative educational estimates: no terrain, rain or detailed weather changes. Professional codes such as HotSpot and JRODOS use more detailed models.'
}};
const ML_JS=['https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.min.js','https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js','https://cdn.jsdelivr.net/npm/maplibre-gl@4.7.1/dist/maplibre-gl.js'];
const ML_CSS=['https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.min.css','https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css'];
const STYLE='https://tiles.openfreemap.org/styles/liberty';
let mlP=null;
function loadML(){if(window.maplibregl)return Promise.resolve();if(mlP)return mlP;
 mlP=new Promise((res,rej)=>{ML_CSS.forEach(h=>{const l=document.createElement('link');l.rel='stylesheet';l.href=h;document.head.appendChild(l);});
  let i=0;const next=()=>{if(i>=ML_JS.length){mlP=null;return rej(new Error('maplibre'));}const s=document.createElement('script');s.src=ML_JS[i++];s.onload=()=>window.maplibregl?res():next();s.onerror=next;document.head.appendChild(s);};next();});
 return mlP;}
function webgl(){try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'));}catch(e){return false;}}

const COAST=[[21.2,39.16],[21.5,39.15],[21.75,39.09],[21.95,39.05],[22.15,39.05],[22.3,39.09],[22.45,39.08],[22.65,39.05],[22.85,38.98],[23.05,38.88],[23.25,38.76],[23.5,38.6]];
const R=100,N=300; // domain ±R km, grid N×N
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function sig(cl,x){const s=STAB[cl];const sy=s.y*x/Math.sqrt(1+1e-4*x);const z=s.z;const sz=z[2]?z[0]*x/Math.pow(1+z[1]*x,z[2]):z[0]*x;return [sy,sz];}
// χ/Q at ground (s/m³) for downwind s, crosswind c (m)
function chiQ(cl,u,s,c){if(s<50)s=50;const [sy,sz]=sig(cl,s),L=STAB[cl].L;
 if(sz>.8*L)return Math.exp(-c*c/(2*sy*sy))/(Math.sqrt(2*Math.PI)*sy*u*L);
 return Math.exp(-c*c/(2*sy*sy))*Math.exp(-K.H*K.H/(2*sz*sz))/(Math.PI*sy*sz*u);}
// per-unit-TIC dose components
function comps(S,tic){ // tic = χ/Q·fraction (s/m³) → returns per-release doses
 const tI=S.I*tic,tCs=S.Cs*tic,tXe=S.Xe*tic;
 const cloud=tI*K.brA*K.eI+tCs*K.brA*K.eCs+tXe*K.xe; // Sv
 const thy=tI*K.brC*K.thC; // Sv child thyroid
 const dI=K.vdI*tI,dCs=K.vdCs*tCs;const g=dI*K.gI+dCs*K.gCs; // Sv/h initial
 const gd=dI*K.gI*K.hI+dCs*K.gCs*K.hCs; // Sv over 7 d
 return {cloud,thy,g,gd};}

A.V.emergency={
html(){const t=T[A.LANG],dirO=[0,45,90,135,180,225,270,315];
 const opt=(arr,sel)=>arr.map(([v,l])=>`<option value="${v}"${v==sel?' selected':''}>${l}</option>`).join('');
 return `<section class="em"><div class="wrap">${A.sh(t.tag,t.title,t.sub)}${A.simple(t.simple)}<div class="em-disc">${t.disc}</div>
 <div class="em-lay">
  <div class="em-ctl">
   <div class="panel em-p"><h3>${t.s1}</h3>
    <label class="em-l">${t.sev}</label><div class="em-sev" id="emSev">${t.sevs.map((s,i)=>`<button type="button" class="em-sv${i===1?' on':''}" data-i="${i}"><b>${s[0]}</b><span>${s[1]}</span></button>`).join('')}</div>
    <div class="em-row"><label class="em-l">${t.wind}<select id="emDir">${opt(dirO.map((d,i)=>[d,t.dirs[i]]),315)}</select></label>
    <label class="em-l">${t.speed}: <b id="emSpV">3</b> ${t.ms}<input type="range" id="emSp" min="1" max="10" step="0.5" value="3"></label></div>
    <label class="em-l">${t.stab}<select id="emSt">${opt(Object.keys(t.stabs).map(k=>[k,t.stabs[k]]),'D')}</select></label>
    <label class="em-chk"><input type="checkbox" id="emSur" checked> ${t.surprise}</label>
    <button type="button" class="btn" id="emRnd">${t.rnd}</button>
   </div>
   <div class="panel em-p"><h3>${t.s2}</h3>
    <label class="em-l">${t.when}<select id="emWhen">${opt(t.whens.map((w,i)=>[[0,1,3][i],w]),0)}</select></label>
    <label class="em-l">${t.evR}: <b id="emEvV"></b><input type="range" id="emEv" min="0" max="6" step="1" value="2"></label>
    <label class="em-l">${t.shape}<select id="emShape">${opt(t.shapes.map((s,i)=>[i,s]),0)}</select></label>
    <label class="em-l">${t.shR}: <b id="emShV"></b><input type="range" id="emSh" min="0" max="6" step="1" value="3"></label>
    <label class="em-l">${t.ki}<select id="emKi">${opt(t.kis.map((s,i)=>[i,s]),1)}</select></label>
    <label class="em-chk"><input type="checkbox" id="emOil" checked> ${t.oil}</label>
    <button type="button" class="btn pri em-run" id="emRun">${t.run}</button>
   </div>
  </div>
  <div class="em-mapw">
   <div class="em-tools"><div class="em-lyr" id="emLyr">${t.layers.map((l,i)=>`<button type="button" data-i="${i}"${i?'':' class="on"'}>${l}</button>`).join('')}</div>
    <div class="em-btns"><button type="button" id="emMove">${t.move}</button><button type="button" id="emCity">${t.city3d}</button><button type="button" id="emBack">${t.back}</button></div></div>
   <div class="em-mapbox"><div class="em-map" id="emMap" dir="ltr"><div class="em-load" id="emLoad">${t.loading}</div></div>
   <div class="em-hud" dir="${A.C.dir}"><div class="em-clock"><b id="emClk">T+00:00</b><span>${t.clock}</span></div><div class="em-wind"><svg viewBox="0 0 40 40" id="emArr"><circle cx="20" cy="20" r="18"/><path d="M20 6l6 14h-4v14h-4V20h-4z"/></svg><span id="emWtxt"></span></div></div></div>
   <div class="em-leg" id="emLeg"></div>
   <p class="note" id="emFb" hidden>${t.fb}</p>
   <div class="em-log" id="emLog"></div>
  </div>
 </div>
 <div id="emRes"></div>
 <h3 class="em-h3">${t.cmpT}</h3><div class="grid">${t.cmp.map(c=>A.card(c[0],c[1],'',c[2])).join('')}</div>
 <p class="note">${t.crit}</p><p class="note">${t.note}</p>
 </div></section>`;},
init(){
 const t=T[A.LANG],ar=A.LANG==='ar',$=id=>document.getElementById(id);
 const EVR=[0,3,5,10,20,30,40],SHR=[0,10,20,30,40,50,60];
 const st={site:{...SITE0},sev:1,dir:315,u:3,cl:'D',sur:true,when:0,ev:5,shape:0,sh:30,ki:1,oil:true,layer:0,phases:null,res:null,anim:null,moving:false,sel:null};
 let map=null,fbc=null,fbctx=null,dead=false,timers=[],markers=[];
 const img=document.createElement('canvas');img.width=img.height=N;const ictx=img.getContext('2d');
 // ---------- geometry ----------
 const kx=()=>111.32*Math.cos(st.site.lat*Math.PI/180),ky=110.57;
 const toKm=(lat,lon)=>[(lon-st.site.lon)*kx(),(lat-st.site.lat)*ky];
 const toLL=(x,y)=>[st.site.lon+x/kx(),st.site.lat+y/ky];
 const dirName=d=>t.dirs[Math.round(((d%360)+360)%360/45)%8];
 // ---------- plume phases ----------
 function phases(final){const S=SC[st.sev],h=S.dur/2;const p=[{t0:2,dur:h,f:.6,dir:st.dir}];
  let d2=st.dir;if(final&&st.sur){d2=st.dir+(Math.random()<.5?-1:1)*(40+Math.random()*35);}
  p.push({t0:2+h,dur:h,f:.4,dir:d2});return p;}
 // field per cell
 let F=null;
 function computeField(){const S=SC[st.sev],P=st.phases,u=st.u;const n=N*N;
  F={eff:new Float32Array(n),thy:new Float32Array(n),g:new Float32Array(n),c:P.map(()=>({cl:new Float32Array(n),th:new Float32Array(n),gd:new Float32Array(n),gr:new Float32Array(n),ta:new Float32Array(n)}))};
  P.forEach((p,k)=>{const to=(p.dir+180)*Math.PI/180,dx=Math.sin(to),dy=Math.cos(to),C=F.c[k];
   for(let j=0;j<N;j++){const y=R-(j+.5)*2*R/N;for(let i=0;i<N;i++){const x=-R+(i+.5)*2*R/N,id=j*N+i;
    const s=(x*dx+y*dy)*1000,c=(x*dy-y*dx)*1000;if(s<=0){C.ta[id]=1e9;continue;}
    const q=chiQ(st.cl,u,s,c)*p.f;if(q<1e-12){C.ta[id]=1e9;continue;}const d=comps(S,q);
    C.cl[id]=d.cloud;C.th[id]=d.thy;C.gd[id]=d.gd;C.gr[id]=d.g;C.ta[id]=p.t0+s/(u*3600);
    F.eff[id]+=d.cloud+d.gd;F.thy[id]+=d.thy;F.g[id]+=d.g;}}});}
 // value of a layer at time th (h); final => projected 7 d
 function cellVal(id,L,th){if(th==null)return L===0?F.eff[id]*1e3:L===1?F.thy[id]*1e3:F.g[id]*1e6;
  let v=0;F.c.forEach((C,k)=>{const ta=C.ta[id];if(th<=ta)return;const p=st.phases[k],fr=clamp((th-ta)/p.dur,0,1);
   if(L===0)v+=(C.cl[id]*fr+C.gd[id]*fr*Math.min(1,(th-ta)/168))*1e3;else if(L===1)v+=C.th[id]*fr*1e3;else v+=C.gr[id]*fr*1e6;});return v;}
 const SCALE=[[[1,'#fde68a'],[10,'#fbbf24'],[50,'#f97316'],[100,'#ef4444'],[500,'#b91c1c'],[1000,'#7e22ce']],[[10,'#fde68a'],[50,'#fbbf24'],[100,'#f97316'],[500,'#ef4444'],[2000,'#b91c1c'],[10000,'#7e22ce']],[[1,'#fde68a'],[10,'#fbbf24'],[100,'#f97316'],[1000,'#ef4444'],[10000,'#b91c1c'],[100000,'#7e22ce']]];
 const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 const SC_RGB=SCALE.map(s=>s.map(([v,c])=>[v,hex(c)]));
 function paint(th){const L=st.layer,sc=SC_RGB[L],im=ictx.createImageData(N,N),d=im.data;
  if(F)for(let id=0;id<N*N;id++){const v=cellVal(id,L,th);if(v<sc[0][0])continue;let k=0;while(k<sc.length-1&&v>=sc[k+1][0])k++;const c=sc[k][1],o=id*4;d[o]=c[0];d[o+1]=c[1];d[o+2]=c[2];d[o+3]=Math.min(235,150+k*17);}
  ictx.putImageData(im,0,0);
  try{if(map&&map._emOK&&map.getSource('dose'))map.getSource('dose').updateImage({url:img.toDataURL(),coordinates:corners()});}catch(e){}
  if(fbctx)drawFB();}
 function corners(){const nw=toLL(-R,R),ne=toLL(R,R),se=toLL(R,-R),sw=toLL(-R,-R);return [nw,ne,se,sw];}
 function legend(){const L=st.layer;$('emLeg').innerHTML=`<b>${t.layers[L]} (${t.unit[L]})</b>`+SCALE[L].map(([v,c])=>`<span><i style="background:${c}"></i>≥ ${v.toLocaleString('en-US')}</span>`).join('');}
 // ---------- zones ----------
 function circle(r,a0,a1,n){const pts=[];for(let k=0;k<=n;k++){const a=(a0+(a1-a0)*k/n)*Math.PI/180;pts.push(toLL(r*Math.sin(a),r*Math.cos(a)));}return pts;}
 function evacPoly(){const r=st.ev;if(!r)return null;if(st.shape===0||r<=5){const c=circle(r,0,360,72);return [c];}
  const to=st.dir+180;const out=circle(r,to-45,to+45,30);const inn=circle(5,to+45,to+360-45,50);return [[...out,...inn,out[0]]];}
 function zonesGJ(){const f=[];const ep=evacPoly();if(ep)f.push({type:'Feature',properties:{k:'ev'},geometry:{type:'Polygon',coordinates:ep}});
  if(st.sh>0)f.push({type:'Feature',properties:{k:'sh'},geometry:{type:'Polygon',coordinates:[circle(st.sh,0,360,90)]}});
  return {type:'FeatureCollection',features:f};}
 function inEvac(x,y){const r=Math.hypot(x,y);if(!st.ev||r>st.ev)return false;if(st.shape===0||r<=5)return true;
  const b=(Math.atan2(x,y)*180/Math.PI+360)%360,to=(st.dir+180)%360;let d=Math.abs(b-to);d=Math.min(d,360-d);return d<=45;}
 function plantGJ(){const f=[];const box=(x0,y0,w,h)=>{const p=[[x0,y0],[x0+w,y0],[x0+w,y0+h],[x0,y0+h],[x0,y0]];return p.map(([x,y])=>toLL(x,y));};
  [[-.06,0],[.06,0]].forEach(([cx,cy])=>{const pts=[];for(let k=0;k<=24;k++){const a=k/24*2*Math.PI;pts.push(toLL(cx+.024*Math.cos(a),cy+.024*Math.sin(a)));}f.push({type:'Feature',properties:{h:65,c:'#e5e7eb'},geometry:{type:'Polygon',coordinates:[pts]}});});
  f.push({type:'Feature',properties:{h:38,c:'#94a3b8'},geometry:{type:'Polygon',coordinates:[box(-.12,-.11,.24,.06)]}});
  f.push({type:'Feature',properties:{h:22,c:'#cbd5e1'},geometry:{type:'Polygon',coordinates:[box(-.03,.04,.06,.05)]}});
  return {type:'FeatureCollection',features:f};}
 // ---------- map ----------
 function initMap(){if(!webgl())return fallback();const to=setTimeout(()=>{if(!map||!map._emOK)fallback();},12000);timers.push(to);
  loadML().then(()=>{if(dead)return;const ml=window.maplibregl;
   try{if(ml.getRTLTextPluginStatus&&ml.getRTLTextPluginStatus()==='unavailable')ml.setRTLTextPlugin('https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.3.0/dist/mapbox-gl-rtl-text.js',true);}catch(e){}
   try{map=new ml.Map({container:'emMap',style:STYLE,center:[st.site.lon,st.site.lat],zoom:8.4,pitch:40,bearing:0,attributionControl:{compact:true},maxPitch:70});}catch(e){return fallback();}
   map.addControl(new ml.NavigationControl({visualizePitch:true}),'top-left');
   map.on('error',e=>{if(!map._emOK&&e&&e.error&&/style|Failed to fetch|NetworkError/i.test(String(e.error.message||e.error)))fallback();});
   map.on('load',()=>{if(dead)return;map._emOK=true;$('emLoad').remove();
    const sty=map.getStyle(),vsrc=Object.keys(sty.sources).find(k=>sty.sources[k].type==='vector');
    const firstSym=(sty.layers.find(l=>l.type==='symbol')||{}).id;
    if(vsrc&&!sty.layers.some(l=>l.type==='fill-extrusion')){try{map.addLayer({id:'em-b3d',type:'fill-extrusion',source:vsrc,'source-layer':'building',minzoom:13,paint:{'fill-extrusion-color':'#d6d3e0','fill-extrusion-height':['coalesce',['get','render_height'],10],'fill-extrusion-base':['coalesce',['get','render_min_height'],0],'fill-extrusion-opacity':.85}},firstSym);}catch(e){}}
    map.addSource('dose',{type:'image',url:img.toDataURL(),coordinates:corners()});
    map.addLayer({id:'dose',type:'raster',source:'dose',paint:{'raster-opacity':.72,'raster-resampling':'linear','raster-fade-duration':0}},firstSym);
    map.addSource('zones',{type:'geojson',data:zonesGJ()});
    map.addLayer({id:'z-fill',type:'fill',source:'zones',paint:{'fill-color':['match',['get','k'],'ev','#ef4444','#38bdf8'],'fill-opacity':['match',['get','k'],'ev',.10,.05]}},firstSym);
    map.addLayer({id:'z-line',type:'line',source:'zones',paint:{'line-color':['match',['get','k'],'ev','#dc2626','#0284c7'],'line-width':2.2,'line-dasharray':[3,2]}});
    map.addSource('plant',{type:'geojson',data:plantGJ()});
    map.addLayer({id:'plant3d',type:'fill-extrusion',source:'plant',paint:{'fill-extrusion-color':['get','c'],'fill-extrusion-height':['get','h'],'fill-extrusion-opacity':.95}});
    addMarkers();paint(null);zonesUpd();});
   map.on('click',e=>{if(!st.moving)return;st.site={lat:e.lngLat.lat,lon:e.lngLat.lng};st.moving=false;$('emMove').classList.remove('on');siteChanged();});
  }).catch(fallback);}
 function siteChanged(){st.res=null;$('emRes').innerHTML='';$('emLog').innerHTML='';preview();if(map&&map._emOK){map.getSource('plant').setData(plantGJ());addMarkers();map.easeTo({center:[st.site.lon,st.site.lat]});}}
 function addMarkers(){markers.forEach(m=>m.remove());markers=[];if(!map)return;const ml=window.maplibregl;
  const pe=document.createElement('div');pe.className='em-pm';pe.innerHTML=`<i>☢</i><span>${t.plant}</span>`;markers.push(new ml.Marker({element:pe}).setLngLat([st.site.lon,st.site.lat]).addTo(map));
  LOC.forEach((l,i)=>{const [x,y]=toKm(l[2],l[3]);if(Math.abs(x)>R||Math.abs(y)>R)return;const e=document.createElement('div');e.className='em-lm';e.dataset.i=i;e.innerHTML=`<b>${ar?l[0]:l[1]}</b><em></em>`;e.onclick=()=>showCalc(i);markers.push(new ml.Marker({element:e,anchor:'bottom'}).setLngLat([l[3],l[2]]).addTo(map));});
  badge();}
 function badge(){document.querySelectorAll('.em-lm').forEach(e=>{const r=st.res&&st.res.rows.find(x=>x.i==e.dataset.i);const em=e.querySelector('em');
  if(!r){em.textContent='';e.className='em-lm';return;}em.textContent=fx(r.D1)+' mSv';e.className='em-lm '+(r.D1>=100?'b':r.D1>=20?'m':r.D1>=1?'l':'g');});}
 // ---------- fallback 2D ----------
 let fbView={s:1,cx:0,cy:-10};

 function fallback(){if(fbc||dead)return;try{if(map)map.remove();}catch(e){}map=null;markers=[];const el=$('emMap');if(!el)return;el.innerHTML='<canvas id="emFbC"></canvas><div class="em-zm"><button type="button" data-z="1">+</button><button type="button" data-z="-1">−</button></div>';$('emFb').hidden=false;
  fbc=$('emFbC');fbctx=true;el.querySelectorAll('.em-zm button').forEach(b=>b.onclick=()=>{fbView.s=clamp(fbView.s*(b.dataset.z>0?1.5:1/1.5),.6,8);drawFB();});
  let drag=null;fbc.onpointerdown=e=>{drag=[e.clientX,e.clientY,fbView.cx,fbView.cy];fbc.setPointerCapture(e.pointerId);};
  fbc.onpointermove=e=>{if(!drag)return;const k=kmPerPx();fbView.cx=drag[2]-(e.clientX-drag[0])*k;fbView.cy=drag[3]+(e.clientY-drag[1])*k;drawFB();};
  fbc.onpointerup=e=>{if(drag&&Math.hypot(e.clientX-drag[0],e.clientY-drag[1])<5){fbClick(e);}drag=null;};
  window.addEventListener('resize',drawFB);drawFB();}
 function kmPerPx(){const r=fbc.getBoundingClientRect();return 120/(Math.min(r.width,r.height)*fbView.s);}
 function fbClick(e){const r=fbc.getBoundingClientRect(),k=kmPerPx();const x=fbView.cx+(e.clientX-r.left-r.width/2)*k,y=fbView.cy-(e.clientY-r.top-r.height/2)*k;
  if(st.moving){const [lon,lat]=toLL(x,y);st.site={lat,lon};st.moving=false;$('emMove').classList.remove('on');siteChanged();return;}
  let best=-1,bd=1e9;LOC.forEach((l,i)=>{const [lx,ly]=toKm(l[2],l[3]);const d=Math.hypot(lx-x,ly-y);if(d<bd){bd=d;best=i;}});if(bd<4/fbView.s+2)showCalc(best);}
 function drawFB(){if(!fbc||!document.body.contains(fbc))return;const {ctx,w,h}=A.fitCanvas(fbc),k=kmPerPx();const P=(x,y)=>[w/2+(x-fbView.cx)/k,h/2-(y-fbView.cy)/k];
  ctx.fillStyle='#0e4a6e';ctx.fillRect(0,0,w,h);
  ctx.beginPath();COAST.forEach((c,i)=>{const [x,y]=toKm(c[0],c[1]);const p=P(x,y);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});const e1=P(400,toKm(23.5,0)[1]),e2=P(400,toKm(21.2,0)[1]);ctx.lineTo(e1[0],e1[1]);ctx.lineTo(e2[0],e2[1]);ctx.closePath();ctx.fillStyle='#d9cfb4';ctx.fill();ctx.strokeStyle='#7a9bb0';ctx.lineWidth=1.5;ctx.stroke();
  ctx.strokeStyle='rgba(0,0,0,.07)';ctx.lineWidth=1;for(let g=-200;g<=200;g+=10){let a=P(g,-200),b=P(g,200);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();a=P(-200,g);b=P(200,g);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();}
  const a=P(-R,R),b=P(R,-R);ctx.globalAlpha=.75;ctx.imageSmoothingEnabled=true;ctx.drawImage(img,a[0],a[1],b[0]-a[0],b[1]-a[1]);ctx.globalAlpha=1;
  const gj=zonesGJ();gj.features.forEach(f=>{ctx.beginPath();f.geometry.coordinates[0].forEach((ll,i)=>{const [x,y]=toKm(ll[1],ll[0]);const p=P(x,y);i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.closePath();
   ctx.fillStyle=f.properties.k==='ev'?'rgba(239,68,68,.12)':'rgba(56,189,248,.07)';ctx.fill();ctx.setLineDash([7,5]);ctx.strokeStyle=f.properties.k==='ev'?'#dc2626':'#0284c7';ctx.lineWidth=2;ctx.stroke();ctx.setLineDash([]);});
  ctx.font='600 12px IBM Plex Sans Arabic,sans-serif';ctx.textAlign='center';
  LOC.forEach((l,i)=>{const [x,y]=toKm(l[2],l[3]);const p=P(x,y);const r=st.res&&st.res.rows.find(q=>q.i===i);ctx.fillStyle=r?(r.D1>=100?'#b91c1c':r.D1>=20?'#ea580c':r.D1>=1?'#ca8a04':'#15803d'):'#1e1b4b';
   ctx.beginPath();ctx.arc(p[0],p[1],5,0,7);ctx.fill();ctx.fillStyle='#111';ctx.fillText((ar?l[0]:l[1])+(r?' · '+fx(r.D1)+' mSv':''),p[0],p[1]-9);});
  const pp=P(0,0);ctx.fillStyle='#facc15';ctx.strokeStyle='#111';ctx.lineWidth=2;ctx.beginPath();ctx.arc(pp[0],pp[1],9,0,7);ctx.fill();ctx.stroke();ctx.fillStyle='#111';ctx.font='bold 12px sans-serif';ctx.fillText('☢',pp[0],pp[1]+4);
  ctx.font='600 12px IBM Plex Sans Arabic,sans-serif';ctx.fillText(t.plant,pp[0],pp[1]+24);
  const sb=P(fbView.cx-0,fbView.cy),L10=10/k;ctx.fillStyle='#111';ctx.fillRect(16,h-20,L10,4);ctx.textAlign='left';ctx.fillText('10 km',16,h-26);}
 // ---------- simulation ----------
 const fx=v=>v>=100?Math.round(v).toLocaleString('en-US'):v>=10?v.toFixed(0):v>=1?v.toFixed(1):v>=.01?v.toFixed(2):'<0.01';
 function hhmm(h){const m=Math.round(h*60);return 'T+'+String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
 function act(x,y,parts){const dist=Math.hypot(x,y);let D0=0,H0=0,G=0,D1=0,H1=0,tFirst=1e9;
  const ev=inEvac(x,y),sh=!ev&&st.sh>0&&dist<=st.sh,ki=st.ki===2?dist<=50:st.ki===1?(ev||sh):false;
  const tE=st.when+.5+dist*.12,tS=st.when+.5,tK=st.when+(dist<=5?1:2);
  for(const q of parts){G+=q.g;if(q.ta<tFirst&&(q.cloud+q.gd>1e-7||q.thy>1e-6))tFirst=q.ta;}
  const relocate=st.oil&&G*1e6>=100;
  for(const {p,ta,cloud,thy,gd:gd0,g} of parts){D0+=cloud+gd0;H0+=thy;let cl=cloud,th=thy,gd=gd0;const gI=gd0/168;
   if(ev){const f=clamp((tE-ta)/p.dur,0,1);cl*=f;th*=f;gd=g*clamp(tE-ta,0,168);}
   else if(sh){const f=clamp((tS-ta)/p.dur,0,1);cl=cloud*(f+(1-f)*K.shIn);th=thy*(f+(1-f)*K.shIn);const h0=clamp(tS-ta,0,168),hs=clamp(48-h0,0,168);gd=gI*(h0+hs*K.shEx+(relocate?0:Math.max(0,168-h0-hs)));}
   else if(relocate)gd=gI*48;
   D1+=cl+gd;H1+=th;}
  if(ki&&tFirst<1e8){const red=tK<=tFirst?.9:.9*Math.exp(-(tK-tFirst)/6);H1*=1-red;}
  return {dist,D0:D0*1e3,H0:H0*1e3,G:G*1e6,D1:D1*1e3,H1:H1*1e3,ev,sh,ki,rl:relocate&&!ev,tFirst};}
 function evalLoc(i){const l=LOC[i],[x,y]=toKm(l[2],l[3]);const S=SC[st.sev],parts=[];
  st.phases.forEach(p=>{const to=(p.dir+180)*Math.PI/180,dx=Math.sin(to),dy=Math.cos(to);const s=(x*dx+y*dy)*1000,c=(x*dy-y*dx)*1000;if(s<=0)return;
   const q=chiQ(st.cl,st.u,s,c)*p.f,d=comps(S,q);parts.push({p,d,s,c,q,ta:p.t0+s/(st.u*3600),cloud:d.cloud,thy:d.thy,gd:d.gd,g:d.g});});
  const r=act(x,y,parts);r.i=i;r.parts=parts;return r;}
 function coastLon(lat){const C=COAST;if(lat<=C[0][0])return C[0][1];for(let k=1;k<C.length;k++)if(lat<=C[k][0]){const a=C[k-1],b=C[k],f=(lat-a[0])/(b[0]-a[0]);return a[1]+f*(b[1]-a[1]);}return C[C.length-1][1];}
 function gridEval(){const cell=Math.pow(2*R/N,2);let a100=0,aThy=0,aUnn=0,r100=0,r50=0,maxD=0;
  for(let id=0;id<N*N;id++){if(!(F.eff[id]*1e3>=1||F.thy[id]*1e3>=10))continue;const j=Math.floor(id/N),i=id%N,x=-R+(i+.5)*2*R/N,y=R-(j+.5)*2*R/N;
   const [lon,lat]=toLL(x,y);if(lon<coastLon(lat))continue;const parts=[];
   F.c.forEach((C,k)=>{if(C.ta[id]>1e8)return;parts.push({p:st.phases[k],ta:C.ta[id],cloud:C.cl[id],thy:C.th[id],gd:C.gd[id],g:C.gr[id]});});
   const r=act(x,y,parts);if(r.D0>=100)r100=Math.max(r100,r.dist);if(r.H0>=50)r50=Math.max(r50,r.dist);
   if(r.D1>maxD)maxD=r.D1;if(r.D1>=100)a100+=cell;if(r.H1>=50)aThy+=cell;if(r.ev&&r.dist>5&&r.D0<20)aUnn+=cell;}
  // evacuated land with negligible dose (no plume at all)
  const st2=2;for(let j=0;j<N;j+=st2)for(let i=0;i<N;i+=st2){const id=j*N+i;if(F.eff[id]*1e3>=1||F.thy[id]*1e3>=10)continue;const x=-R+(i+.5)*2*R/N,y=R-(j+.5)*2*R/N,d=Math.hypot(x,y);if(d<=5||!inEvac(x,y))continue;const [lon,lat]=toLL(x,y);if(lon<coastLon(lat))continue;aUnn+=cell*st2*st2;}
  return {a100,aThy,aUnn,r100,r50,maxD};}
 function score(){const rows=LOC.map((l,i)=>{const [x,y]=toKm(l[2],l[3]);return Math.abs(x)<=R&&Math.abs(y)<=R?evalLoc(i):null;}).filter(Boolean);
  let s=100;const L=t.L,msg=[],nm=a=>a.map(r=>ar?LOC[r.i][0]:LOC[r.i][1]).join(ar?'، ':', ');
  const hi=rows.filter(r=>r.D1>=100),mid=rows.filter(r=>r.D1>=20&&r.D1<100),thy=rows.filter(r=>r.H1>=50),unn=rows.filter(r=>r.ev&&r.dist>5&&r.D0<20),food=rows.filter(r=>r.G>=1);
  const g=gridEval();s-=hi.length*25+mid.length*8+thy.length*10+unn.length*6+Math.min(30,g.a100/4)+Math.min(20,g.aThy/15)+Math.min(15,g.aUnn/80);if(st.ev<3){s-=10;}if(food.length&&!st.oil)s-=10;
  rows.forEach(r=>{if(r.sh&&r.D0<1)s-=1;});s=clamp(Math.round(s),0,100);
  if(hi.length)msg.push(A.tpl(L.hi,{n:nm(hi)}));if(g.a100>=1)msg.push(A.tpl(L.a100,{a:Math.round(g.a100).toLocaleString('en-US'),r:Math.round(g.r100)}));if(g.aThy>=1)msg.push(A.tpl(L.aThy,{a:Math.round(g.aThy).toLocaleString('en-US'),r:Math.round(g.r50)}));if(g.aUnn>=50)msg.push(A.tpl(L.aUnn,{a:Math.round(g.aUnn).toLocaleString('en-US')}));if(thy.length)msg.push(A.tpl(L.thy,{n:nm(thy)}));if(mid.length)msg.push(A.tpl(L.mid,{n:nm(mid)}));
  if(st.ev<3)msg.push(L.paz);if(unn.length)msg.push(A.tpl(L.unn,{n:nm(unn)}));
  const shifted=Math.abs(st.phases[1].dir-st.phases[0].dir)>20;if(st.shape===1&&shifted&&st.ev>5)msg.push(L.key);
  if(st.when>=3&&(hi.length||mid.length||thy.length))msg.push(L.late);if(food.length&&!st.oil)msg.push(A.tpl(L.food,{n:nm(food)}));
  if(!msg.length)msg.push(L.ok);
  // reach distances along grid
  return {rows,s,msg,r100:g.r100,r50:g.r50,maxD:Math.max(g.maxD,...rows.map(r=>r.D1)),unn:unn.length,g};}
 function preview(){st.phases=phases(false);computeField();paint(null);legend();zonesUpd();windUI();}
 function zonesUpd(){if(map&&map._emOK&&map.getSource('zones'))map.getSource('zones').setData(zonesGJ());if(fbctx)drawFB();}
 function windUI(d){const dd=d==null?st.dir:d;$('emArr').style.transform=`rotate(${dd+180}deg)`;$('emWtxt').textContent=`${dirName(dd)} · ${st.u} ${t.ms}`;}
 function log(h,txt,cls){const el=$('emLog');el.insertAdjacentHTML('afterbegin',`<div class="${cls||''}"><b>${hhmm(h)}</b> ${txt}</div>`);}
 function run(){if(st.anim)return;st.res=null;$('emRes').innerHTML='';$('emLog').innerHTML='';badge();st.phases=phases(true);computeField();
  const ev=[[0,t.evN.ge,'r'],[st.when+.5,t.evN.ord,'b'],[2,t.evN.rel,'r']];const P=st.phases;
  if(Math.abs(P[1].dir-P[0].dir)>1)ev.push([P[1].t0,A.tpl(t.evN.sh,{d:dirName(P[1].dir)}),'y']);ev.push([P[1].t0+P[1].dur,t.evN.end,'']);
  LOC.forEach((l,i)=>{const r=evalLoc(i);if(r.tFirst<30&&(r.D0>=.05||r.H0>=.5))ev.push([r.tFirst,A.tpl(t.evN.arr,{n:ar?l[0]:l[1]}),'y']);});ev.sort((a,b)=>a[0]-b[0]);
  const TMAX=Math.max(12,Math.min(30,P[1].t0+P[1].dur+8)),DUR=14000,t0=performance.now();let k=0,lastP=0;$('emRun').disabled=true;
  st.anim=(now)=>{const h=Math.min(TMAX,(now-t0)/DUR*TMAX);$('emClk').textContent=hhmm(h);while(k<ev.length&&ev[k][0]<=h){log(ev[k][0],ev[k][1],ev[k][2]);k++;}
   windUI(h>=P[1].t0?P[1].dir:P[0].dir);if(now-lastP>110){paint(h);lastP=now;}
   if(h>=TMAX){st.anim=null;$('emRun').disabled=false;paint(null);log(TMAX,t.evN.done,'g');finish();}};}
 function finish(){st.res=score();badge();if(fbctx)drawFB();const r=st.res,g=r.s>=85?0:r.s>=70?1:r.s>=50?2:3,col=['#34d399','#a3e635','#fbbf24','#f43f5e'][g];
  const act=x=>[x.ev?t.act.ev:'',x.sh?t.act.sh:'',x.ki?t.act.ki:'',x.rl?t.act.rl:''].filter(Boolean).join(' + ')||t.act.no;
  const cls=v=>v>=100?'b':v>=20?'m':v>=1?'l':'g';
  $('emRes').innerHTML=`<div class="panel em-resp"><h3>${t.res}</h3><div class="em-sc"><div class="em-ring" style="--p:${r.s};--c:${col}"><b>${r.s}</b><span>/100</span></div><div><small>${t.score}</small><h4 style="color:${col}">${t.grades[g]}</h4></div>
   <div class="em-sum">${[[fx(r.maxD)],[r.r100?Math.round(r.r100):'0'],[r.r50?Math.round(r.r50):'0'],[r.unn]].map((v,i)=>`<div><b><bdi>${v[0]}</bdi> ${t.sum[i][1]}</b><span>${t.sum[i][0]}</span></div>`).join('')}</div></div>
   <ul class="em-msg">${r.msg.map(m=>`<li>${m}</li>`).join('')}</ul>
   <div class="tbl"><table class="compare em-tb"><tr>${t.th.map(h=>`<th>${h}</th>`).join('')}</tr>${r.rows.sort((a,b)=>a.dist-b.dist).map(x=>`<tr data-i="${x.i}"><td><b>${ar?LOC[x.i][0]:LOC[x.i][1]}</b><small>${t.pop}: ${LOC[x.i][4].toLocaleString('en-US')}</small></td><td>${Math.round(x.dist)} ${t.km}</td><td class="${cls(x.D0)}"><bdi dir="ltr">${fx(x.D0)} mSv</bdi></td><td class="${cls(x.D1)}"><bdi dir="ltr">${fx(x.D1)} mSv</bdi></td><td class="${x.H1>=50?'b':x.H1>=10?'m':'g'}"><bdi dir="ltr">${fx(x.H1)} mSv</bdi></td><td>${act(x)}</td></tr>`).join('')}</table></div>
   <details class="em-how" id="emHow"><summary>${t.howT}</summary><div id="emCalc"></div></details>
   <button type="button" class="btn" id="emAgain">${t.again}</button></div>`;
  $('emRes').querySelectorAll('tr[data-i]').forEach(tr=>tr.onclick=()=>showCalc(+tr.dataset.i));
  $('emAgain').onclick=()=>{document.querySelector('.em-ctl').scrollIntoView({behavior:'smooth'});};
  const worst=r.rows.slice().sort((a,b)=>b.D0-a.D0)[0];if(worst)showCalc(worst.i,true);
  setTimeout(()=>$('emRes').scrollIntoView({behavior:'smooth',block:'start'}),300);}
 function showCalc(i,silent){if(!st.phases)return;const el=$('emCalc');if(!el)return;const r=evalLoc(i),S=SC[st.sev],l=LOC[i],name=ar?l[0]:l[1];
  const e=v=>{if(!v)return '0';const ex=Math.floor(Math.log10(Math.abs(v)));return (v/Math.pow(10,ex)).toFixed(2)+'×10^'+ex;};
  const pt=r.parts[0];let h=`<h4>📍 ${name} · ${Math.round(r.dist)} ${t.km}</h4><div class="eq">χ/Q = exp(−y²/2σy²) · exp(−H²/2σz²) / (π · σy · σz · u)</div>`;
  if(!pt){h+=`<p>${ar?'هذا المكان لم يكن في اتجاه السحابة، فالجرعة صفر تقريبًا.':'This place was not downwind of the plume, so the dose is about zero.'}</p>`;}
  else{const [sy,sz]=sig(st.cl,pt.s);h+=`<ul class="em-steps" dir="ltr">
   <li>${ar?'المسافة باتجاه الريح':'Downwind distance'} x = ${(pt.s/1000).toFixed(2)} km · ${ar?'البعد عن محور السحابة':'Crosswind offset'} y = ${(pt.c/1000).toFixed(2)} km</li>
   <li>${ar?'فئة الاستقرار':'Stability class'} ${st.cl}: σy = ${STAB[st.cl].y}·x/√(1+10⁻⁴x) = ${sy.toFixed(0)} m · σz = ${sz.toFixed(0)} m</li>
   <li>u = ${st.u} m/s · H = ${K.H} m · ${ar?'نسبة هذه المرحلة من التسرب':'Fraction of release in this phase'} = ${pt.p.f}</li>
   <li>χ/Q = ${e(pt.q/pt.p.f)} s/m³ → ×${pt.p.f} = ${e(pt.q)} s/m³</li>
   <li>${ar?'التركيز المتكامل لليود-131':'Time-integrated I-131'} = Q × χ/Q = ${e(S.I)} × ${e(pt.q)} = ${e(S.I*pt.q)} Bq·s/m³</li>
   <li>${ar?'جرعة الاستنشاق (بالغ)':'Inhalation (adult)'} = ${e(S.I*pt.q)} × ${K.brA} m³/s × ${K.eI} Sv/Bq = ${fx(S.I*pt.q*K.brA*K.eI*1e3)} mSv</li>
   <li>${ar?'الغدة الدرقية (طفل عمره سنة)':'Thyroid (1-year child)'} = ${e(S.I*pt.q)} × ${K.brC} × ${K.thC} = ${fx(pt.d.thy*1e3)} mSv</li>
   <li>${ar?'الترسّب الأرضي':'Ground deposition'}: I-131 = v_d·TIC = ${K.vdI} × ${e(S.I*pt.q)} = ${e(K.vdI*S.I*pt.q)} Bq/m² · Cs-137 = ${e(K.vdCs*S.Cs*pt.q)} Bq/m² → ${fx(pt.d.g*1e6)} µSv/h</li>
   <li>${ar?'المجموع خلال 7 أيام لكل المراحل (سحابة + أرض)':'7-day total, all phases (cloud + ground)'}: ${fx(r.D0)} mSv → ${ar?'مع قراراتك':'with your decisions'}: ${fx(r.D1)} mSv</li></ul>`;}
  el.innerHTML=h;const d=$('emHow');if(d&&!silent){d.open=true;d.scrollIntoView({behavior:'smooth',block:'center'});}}
 // ---------- controls ----------
 const rangeTxt=(v,arr)=>v?arr[v]+' '+t.km:t.none;
 function sync(){st.ev=EVR[+$('emEv').value];st.sh=SHR[+$('emSh').value];$('emEvV').textContent=rangeTxt(+$('emEv').value,EVR);$('emShV').textContent=rangeTxt(+$('emSh').value,SHR);
  st.shape=+$('emShape').value;st.ki=+$('emKi').value;st.oil=$('emOil').checked;st.when=+$('emWhen').value;st.sur=$('emSur').checked;}
 ['emEv','emSh','emShape','emKi','emOil','emWhen','emSur'].forEach(id=>$(id).addEventListener('input',()=>{sync();zonesUpd();}));
 ['emDir','emSt','emSp'].forEach(id=>$(id).addEventListener('input',()=>{st.dir=+$('emDir').value;st.cl=$('emSt').value;st.u=+$('emSp').value;$('emSpV').textContent=st.u;if(!st.anim)preview();}));
 $('emSev').querySelectorAll('.em-sv').forEach(b=>b.onclick=()=>{$('emSev').querySelectorAll('.em-sv').forEach(x=>x.classList.toggle('on',x===b));st.sev=+b.dataset.i;if(!st.anim)preview();});
 $('emRnd').onclick=()=>{const W=[315,315,0,0,292,270,337,45,180];const d=W[Math.floor(Math.random()*W.length)];const sn=Math.round(d/45)*45%360;$('emDir').value=String(sn);
  $('emSp').value=String((1.5+Math.random()*6).toFixed(1)*1);const night=Math.random()<.4;$('emSt').value=night?(Math.random()<.6?'F':'D'):['B','C','D'][Math.floor(Math.random()*3)];$('emDir').dispatchEvent(new Event('input'));};
 $('emLyr').querySelectorAll('button').forEach(b=>b.onclick=()=>{$('emLyr').querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));st.layer=+b.dataset.i;legend();if(!st.anim)paint(null);});
 $('emRun').onclick=()=>{sync();run();};
 $('emMove').onclick=()=>{st.moving=!st.moving;$('emMove').classList.toggle('on',st.moving);if(st.moving)$('emMove').title=t.moveHint;};
 $('emCity').onclick=()=>{const P=st.phases||phases(false);const to=(P[0].dir+180)*Math.PI/180;let best=null,bs=-1;
  LOC.forEach(l=>{const [x,y]=toKm(l[2],l[3]);const s=x*Math.sin(to)+y*Math.cos(to),c=Math.abs(x*Math.cos(to)-y*Math.sin(to));if(Math.hypot(x,y)>R)return;const sc=(s>0?2:1)/(1+c/8)*Math.log10(l[4]);if(sc>bs){bs=sc;best=l;}});
  if(!best)return;if(map&&map._emOK)map.flyTo({center:[best[3],best[2]],zoom:15.2,pitch:62,bearing:(P[0].dir+180)%360,speed:.9});else if(fbc){const [x,y]=toKm(best[2],best[3]);fbView={s:5,cx:x,cy:y};drawFB();}};
 $('emBack').onclick=()=>{if(map&&map._emOK)map.flyTo({center:[st.site.lon,st.site.lat],zoom:8.4,pitch:40,bearing:0});else if(fbc){fbView={s:1,cx:0,cy:-10};drawFB();}};
 sync();preview();initMap();
 return {frame(dt,now){if(st.anim)st.anim(now);},destroy(){dead=true;timers.forEach(clearTimeout);try{if(map)map.remove();}catch(e){}window.removeEventListener('resize',drawFB);}};
}};
A.EMERG={chiQ,sig,comps,SC,K};A.loadML=loadML;
})(APP);
