/* ===== SAUDI ARABIA & THE NATIONAL ATOMIC ENERGY PROJECT ===== */
(function(A){
const T={
 ar:{tag:'🇸🇦 السعودية والنووي',title:['المملكة و','البرنامج الوطني للطاقة الذرية'],
  sub:'كيف تبني المملكة قطاعًا نوويًا سلميًا ضمن رؤية 2030؟ صفحة مبسّطة تشرح المشروع الوطني وجهاته ومراحله وأين وصل.',
  stats:[['2.8 GW','قدرة أول محطة نووية مخطط لها (مفاعلان)'],['17 GW','الطموح المعلن للقدرة النووية بحلول 2040'],['100 kW','أقصى قدرة للمفاعل البحثي في كاكست'],['2018','تأسيس هيئة الرقابة النووية والإشعاعية']],
  whyT:'لماذا تتجه المملكة للطاقة النووية؟',
  why:[['⚡','طلب متزايد على الكهرباء','النمو السكاني والصناعي وتحلية المياه يحتاج مصادر كهرباء كبيرة ومستقرة على مدار الساعة.'],['🛢️','توفير النفط والغاز','كل ميغاواط نووي يقلّل حرق النفط والغاز محليًا، فيمكن تصديرهما أو استخدامهما بقيمة أعلى.'],['🌱','خفض الانبعاثات','الطاقة النووية منخفضة الكربون، وتدعم أهداف المملكة البيئية مع الطاقة الشمسية والرياح.'],['🧑‍🔬','توطين المعرفة','بناء كوادر سعودية وصناعة محلية في مجال تقني متقدم.']],
  mapT:'خريطة المواقع الرئيسية',mapN:'المواقع تقريبية للتوضيح.',
  pins:[['الرياض','مدينة الملك عبدالله للطاقة الذرية والمتجددة، هيئة الرقابة، والمفاعل البحثي في كاكست'],['جدة','قسم الهندسة النووية بجامعة الملك عبدالعزيز'],['خور دويهين','الموقع المختار لأول محطة نووية كبيرة (شرق المملكة)']],
  compT:'مكوّنات المشروع الوطني للطاقة الذرية',
  comp:[['🏭','المحطات النووية الكبيرة','تجهيز البنية التحتية لأول محطة، واختيار موقعها، ودراسة تقنيات المفاعلات، وتأسيس الشركة القابضة.'],['🔹','المفاعلات الصغيرة المدمجة (SMR)','مفاعلات أصغر يمكن استخدامها لإنتاج الكهرباء وتحلية المياه والتطبيقات الحرارية.'],['⛏️','دورة الوقود النووي','الخطوة الأولى نحو الاكتفاء الذاتي في إنتاج الوقود، بدءًا من استكشاف خامات اليورانيوم محليًا.'],['🛡️','الرقابة وبناء الكوادر','جهة رقابية مستقلة وأنظمة وتشريعات، مع تأهيل الكفاءات الوطنية لتشغيل المنشآت بأمان.']],
  tlT:'محطات زمنية',
  tl:[['1962','انضمت المملكة إلى الوكالة الدولية للطاقة الذرية.'],['2010','تأسيس مدينة الملك عبدالله للطاقة الذرية والمتجددة (K.A.CARE).'],['2017','الإعلان عن المشروع الوطني للطاقة الذرية بإشراف K.A.CARE.'],['مارس 2018','إقرار السياسة الوطنية للبرنامج وتأسيس هيئة الرقابة النووية والإشعاعية.'],['نوفمبر 2018','تدشين مشروع المفاعل البحثي منخفض الطاقة في كاكست بالرياض.'],['2022','أول بعثة مراجعة رقابية متكاملة من الوكالة الدولية للمملكة.'],['يوليو 2026','توقيع اتفاق تعاون نووي سلمي مع الولايات المتحدة.'],['الآن','مشروع خور دويهين يتجه نحو مرحلة طرح المناقصة.']],
  entT:'الجهات الرئيسية',
  ent:[['K.A.CARE','مدينة الملك عبدالله للطاقة الذرية والمتجددة','تشرف على المشروع الوطني وتخطط لقطاع الطاقة الذرية والمتجددة، ومن مبادراتها مركز "مشكاة" التفاعلي.'],['NRRC','هيئة الرقابة النووية والإشعاعية','الجهة المستقلة التي تنظّم وترخّص كل الأنشطة النووية والإشعاعية لحماية الإنسان والبيئة.'],['KACST','مدينة الملك عبدالعزيز للعلوم والتقنية','تبني المفاعل البحثي منخفض الطاقة (LPRR) للبحث والتدريب.'],['DNEC','شركة دويهين للطاقة النووية','الشركة المعنية بتطوير مشاريع المحطات النووية لإنتاج الكهرباء وتحلية المياه.'],['KAU','جامعة الملك عبدالعزيز · قسم الهندسة النووية','من أهم مصادر تأهيل المهندسين النوويين السعوديين.']],
  lprrT:'المفاعل البحثي منخفض الطاقة (LPRR)',
  lprr:['أول مفاعل نووي بحثي في المملكة، يقع في مدينة الملك عبدالعزيز للعلوم والتقنية (كاكست) بالرياض.','من نوع البركة المفتوحة: قلب المفاعل مغمور في ماء يبرّده ويحجب الإشعاع، ويعتمد على الدوران الطبيعي للتبريد.','قدرته منخفضة جدًا (حتى 100 كيلوواط)، وهذا ما يجعله آمنًا ومناسبًا للتعليم والتجارب والتدريب.','شارك في تصميمه نحو 30 باحثًا ومهندسًا سعوديًا.'],
  plantT:'أول محطة: خور دويهين',
  plant:['الموقع المختار لأول محطة نووية كبيرة، قرب الحدود مع قطر.','قدرة مخططة 2.8 غيغاواط من مفاعلين تقريبًا (نحو 1.4 غيغاواط لكل منهما).','تمثل نحو 5٪ من الكهرباء الحالية للمملكة، وهي بداية برنامج أكبر.','وقّعت المملكة في يوليو 2026 اتفاق تعاون نووي سلمي مع الولايات المتحدة، والمشروع يتجه نحو الطرح.'],
  workT:'هل تريد العمل في هذا المجال؟',work:'تصفّح قسم التخصصات لتعرف التخصصات المطلوبة وجهات التوظيف في المملكة والعالم.',workB:'التخصصات وجهات التوظيف ←',
  region:'في المنطقة: محطة براكة في الإمارات توفر نحو ربع كهرباء الدولة، ومصر تبني محطة الضبعة، والبحرين تدرس المفاعلات الصغيرة.',
  note:'⚠️ هذه صفحة تعليمية مبسّطة من إعداد NE for All، ولا تمثل أي جهة رسمية. للمعلومات الرسمية راجع مواقع الجهات المذكورة.',
  imgN:'الصورتان توضيحيتان لمفاعلات مشابهة، وليستا للمواقع السعودية نفسها. مواقع العلامات على الخريطة تقريبية.',srcT:'مصادر'},
 en:{tag:'🇸🇦 Saudi Arabia & Nuclear',title:['Saudi Arabia & the ','National Atomic Energy Project'],
  sub:'How is the Kingdom building a peaceful nuclear sector under Vision 2030? A simple guide to the national project, its bodies, milestones and current status.',
  stats:[['2.8 GW','Planned capacity of the first nuclear plant (two units)'],['17 GW','Stated nuclear ambition by 2040'],['100 kW','Maximum power of the KACST research reactor'],['2018','Nuclear & Radiological Regulatory Commission founded']],
  whyT:'Why is Saudi Arabia going nuclear?',
  why:[['⚡','Growing power demand','Population, industry and desalination need large, steady, round-the-clock electricity.'],['🛢️','Saving oil and gas','Every nuclear megawatt burns less oil and gas at home, freeing them for export or higher-value use.'],['🌱','Lower emissions','Nuclear is low-carbon and complements solar and wind in meeting climate goals.'],['🧑‍🔬','Local know-how','Building Saudi talent and local industry in an advanced technical field.']],
  mapT:'Key locations',mapN:'Locations are approximate, for illustration.',
  pins:[['Riyadh','K.A.CARE, the regulator (NRRC) and the KACST research reactor'],['Jeddah','Nuclear Engineering Department, King Abdulaziz University'],['Khor Duwaiheen','Lead site for the first large nuclear plant (eastern Saudi Arabia)']],
  compT:'Components of the national project',
  comp:[['🏭','Large nuclear power plants','Infrastructure for the first plant, site selection, reactor technology studies and a holding company.'],['🔹','Small modular reactors (SMR)','Smaller reactors for electricity, seawater desalination and heat applications.'],['⛏️','Nuclear fuel cycle','The first step towards self-sufficiency in fuel, starting with local uranium exploration.'],['🛡️','Regulation & people','An independent regulator, laws and rules, and training national talent to operate facilities safely.']],
  tlT:'Milestones',
  tl:[['1962','Saudi Arabia joins the International Atomic Energy Agency.'],['2010','King Abdullah City for Atomic and Renewable Energy (K.A.CARE) founded.'],['2017','The National Atomic Energy Project announced, overseen by K.A.CARE.'],['Mar 2018','National policy approved and the Nuclear & Radiological Regulatory Commission founded.'],['Nov 2018','Low Power Research Reactor project inaugurated at KACST, Riyadh.'],['2022','First IAEA Integrated Regulatory Review mission to the Kingdom.'],['Jul 2026','Civil nuclear cooperation agreement signed with the United States.'],['Now','The Khor Duwaiheen project is moving towards procurement.']],
  entT:'Key bodies',
  ent:[['K.A.CARE','King Abdullah City for Atomic and Renewable Energy','Oversees the national project and plans the atomic and renewable sector; runs the "Mishkat" interactive center.'],['NRRC','Nuclear & Radiological Regulatory Commission','The independent body that regulates and licenses all nuclear and radiation activities to protect people and the environment.'],['KACST','King Abdulaziz City for Science and Technology','Builds the Low Power Research Reactor (LPRR) for research and training.'],['DNEC','Duwaiheen Nuclear Energy Company','Develops nuclear power projects for electricity and desalination.'],['KAU','King Abdulaziz University · Nuclear Engineering','A key source of Saudi nuclear engineers.']],
  lprrT:'Low Power Research Reactor (LPRR)',
  lprr:['The Kingdom’s first nuclear research reactor, at King Abdulaziz City for Science and Technology (KACST) in Riyadh.','An open-pool reactor: the core sits under water that cools it and shields radiation, using natural circulation.','Very low power (up to 100 kW), which makes it safe and ideal for teaching, experiments and training.','About 30 Saudi researchers and engineers took part in its design.'],
  plantT:'First plant: Khor Duwaiheen',
  plant:['Lead site for the first large nuclear plant, near the border with Qatar.','Planned 2.8 GW from two units (about 1.4 GW each).','About 5% of the Kingdom’s current electricity, as the start of a larger programme.','A civil nuclear cooperation agreement with the US was signed in July 2026; the project is moving towards procurement.'],
  workT:'Want to work in the field?',work:'Visit the Careers section for in-demand specialties and employers in Saudi Arabia and worldwide.',workB:'Careers & employers →',
  region:'In the region: the UAE’s Barakah plant supplies about a quarter of its electricity, Egypt is building El-Dabaa, and Bahrain is studying SMRs.',
  note:'⚠️ This is a simplified educational page by NE for All and does not represent any official body. For official information, see the bodies listed.',
  imgN:'Both photos show similar reactors, not the Saudi sites themselves. Map pins are approximate.',srcT:'Sources'}
};
const SRC=[['Saudipedia – SNAEP','https://saudipedia.com/en/saudi-national-atomic-energy-project-snaep'],['Saudipedia – Low Power Research Reactor','https://saudipedia.com/en/low-power-research-reactor-project'],['Saudipedia – NRRC','https://saudipedia.com/en/article/324/government-and-politics/commissions/nuclear-and-radiological-regulatory-commission'],['IAEA – Saudi Arabia technical cooperation','https://iaea.org/sites/default/files/20/10/tc-saudi-arabia.pdf'],['IAEA – First IRRS mission','https://www.iaea.org/node/129126'],['MEED – Gulf nuclear revival','https://guest.meed.com/gulf-nuclear-revival-takes-shape/'],['ANS – Saudi–US civil nuclear deal','https://www.ans.org/news/article-8238/saudi-arabia-us-sign-civil-nuclear-energy-deal/'],['K.A.CARE','https://www.kacare.gov.sa/'],['NRRC','https://nrrc.gov.sa/']];
// simplified KSA outline (lon,lat)
const KSA=[[36.5,29.4],[34.9,28.1],[35.4,27.0],[36.6,25.7],[38.0,24.1],[39.1,22.4],[40.5,20.0],[41.6,18.0],[42.7,16.5],[43.2,17.3],[44.2,17.4],[46.5,17.2],[47.8,17.6],[49.0,18.6],[52.0,19.0],[55.6,20.0],[55.6,22.0],[55.2,22.7],[52.6,22.9],[51.6,24.1],[51.0,24.6],[50.8,24.8],[50.2,25.6],[50.1,26.4],[49.6,27.1],[48.6,28.0],[48.4,28.5],[47.7,28.5],[46.5,29.1],[44.7,29.2],[42.1,31.1],[40.0,32.0],[39.2,32.2],[37.0,31.5],[38.0,30.5],[37.5,30.0]];
const k=24,px=([lo,la])=>[(lo-33.5)*k,(33.2-la)*k];
function mapSVG(t){const pts=KSA.map(p=>px(p).map(v=>v.toFixed(1)).join(',')).join(' ');
 const pins=[[46.7,24.7,'#22d3ee'],[39.2,21.5,'#a3e635'],[51.35,24.25,'#ec4899']];
 return `<svg viewBox="0 0 560 420" class="ksa-map" role="img" aria-label="${t.mapT}"><defs><linearGradient id="ksaG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e3a2f"/><stop offset="1" stop-color="#14532d"/></linearGradient><filter id="ksaS"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".45"/></filter></defs>
 <rect x="0" y="0" width="560" height="420" rx="18" fill="rgba(56,189,248,.07)"/>
 <polygon points="${pts}" fill="url(#ksaG)" stroke="#4ade80" stroke-width="2" filter="url(#ksaS)"/>
 ${pins.map(([lo,la,c],i)=>{const [x,y]=px([lo,la]);return `<g><circle cx="${x}" cy="${y}" r="16" fill="${c}" opacity=".25"><animate attributeName="r" values="10;22;10" dur="2.4s" begin="${i*.6}s" repeatCount="indefinite"/></circle><circle cx="${x}" cy="${y}" r="7" fill="${c}" stroke="#fff" stroke-width="2"/><text x="${x}" y="${y-16}" text-anchor="middle" fill="#fff" font-size="15" font-weight="800" style="paint-order:stroke" stroke="#0b0618" stroke-width="4">${t.pins[i][0]}</text></g>`;}).join('')}
 </svg>`;}
const poolSVG=`<svg viewBox="0 0 400 240" class="ill"><defs><radialGradient id="chk" cx=".5" cy=".75" r=".6"><stop offset="0" stop-color="#7dd3fc"/><stop offset=".4" stop-color="#2563eb" stop-opacity=".9"/><stop offset="1" stop-color="#0b1a4a"/></radialGradient><linearGradient id="wall" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#64748b"/><stop offset="1" stop-color="#334155"/></linearGradient></defs>
 <rect width="400" height="240" fill="#0f172a"/><rect x="40" y="30" width="320" height="200" fill="url(#wall)"/><rect x="60" y="45" width="280" height="180" fill="url(#chk)"/>
 <g opacity=".5" stroke="#bae6fd" stroke-width="1">${Array.from({length:7},(_,i)=>`<path d="M${60+i*40} 60 q20 8 40 0" fill="none"/>`).join('')}</g>
 <rect x="170" y="150" width="60" height="60" rx="4" fill="#0ea5e9" opacity=".55"/><g fill="#e0f2fe">${Array.from({length:12},(_,i)=>`<rect x="${174+(i%4)*14}" y="${154+Math.floor(i/4)*18}" width="10" height="14" rx="2" opacity=".9"/>`).join('')}</g>
 <circle cx="200" cy="180" r="70" fill="#38bdf8" opacity=".18"/><line x1="200" y1="45" x2="200" y2="150" stroke="#94a3b8" stroke-width="3"/><rect x="40" y="20" width="320" height="12" fill="#facc15"/><text x="200" y="16" fill="#fde68a" font-size="12" text-anchor="middle" font-family="Inter">LPRR · open-pool</text></svg>`;
const plantSVG=`<svg viewBox="0 0 400 240" class="ill"><defs><linearGradient id="skyS" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#f97316"/><stop offset=".55" stop-color="#fbbf24"/><stop offset="1" stop-color="#fde68a"/></linearGradient><linearGradient id="seaS" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#083344"/></linearGradient></defs>
 <rect width="400" height="240" fill="url(#skyS)"/><circle cx="320" cy="70" r="28" fill="#fff7ed" opacity=".9"/><rect y="170" width="400" height="70" fill="url(#seaS)"/><rect y="150" width="400" height="24" fill="#d6b98c"/>
 <g fill="#f1f5f9" stroke="#94a3b8"><path d="M70 150 v-50 a35 35 0 0 1 70 0 v50z"/><path d="M160 150 v-50 a35 35 0 0 1 70 0 v50z"/></g>
 <rect x="240" y="112" width="110" height="38" fill="#e2e8f0" stroke="#94a3b8"/><g fill="#60a5fa">${Array.from({length:6},(_,i)=>`<rect x="${250+i*16}" y="122" width="10" height="8"/>`).join('')}</g>
 <rect x="330" y="78" width="10" height="34" fill="#cbd5e1"/><path d="M335 78 q-12 -18 6 -30 q16 -10 6 -26" stroke="#fff" stroke-width="6" fill="none" opacity=".6"/>
 <text x="200" y="226" fill="#cffafe" font-size="13" text-anchor="middle" font-family="Inter">2 × ~1.4 GW · Arabian Gulf coast (illustration)</text></svg>`;
A.V.saudi={html(C){const t=T[A.LANG];const li=a=>`<ul class="sa-ul">${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
 return `<section><div class="wrap">${A.sh(t.tag,t.title,t.sub)}
 <div class="sa-stats">${t.stats.map(s=>`<div class="sa-stat"><b dir="ltr">${s[0]}</b><span>${s[1]}</span></div>`).join('')}</div>
 <h2 class="sa-h">${t.whyT}</h2><div class="sa-g4">${t.why.map(w=>`<div class="card"><div class="sa-ic">${w[0]}</div><h4>${w[1]}</h4><p>${w[2]}</p></div>`).join('')}</div>
 <h2 class="sa-h">${t.mapT}</h2><div class="sa-map">${mapSVG(t)}<div class="sa-pins">${t.pins.map((p,i)=>`<div class="sa-pin"><i style="background:${['#22d3ee','#a3e635','#ec4899'][i]}"></i><div><b>${p[0]}</b><p>${p[1]}</p></div></div>`).join('')}<small>${t.mapN}</small></div></div>
 <h2 class="sa-h">${t.compT}</h2><div class="sa-g4">${t.comp.map((c,i)=>`<div class="card sa-comp"><span class="sa-n">${i+1}</span><div class="sa-ic">${c[0]}</div><h4>${c[1]}</h4><p>${c[2]}</p></div>`).join('')}</div>
 <div class="sa-two"><div class="card">${poolSVG}<h3>🔬 ${t.lprrT}</h3>${li(t.lprr)}</div><div class="card">${plantSVG}<h3>🏭 ${t.plantT}</h3>${li(t.plant)}</div></div><small class="sa-imgn">${t.imgN}</small>
 <h2 class="sa-h">${t.tlT}</h2><div class="sa-tl">${t.tl.map(x=>`<div class="sa-ti"><b>${x[0]}</b><p>${x[1]}</p></div>`).join('')}</div>
 <h2 class="sa-h">${t.entT}</h2><div class="sa-ent">${t.ent.map(e=>`<div class="card"><span class="sa-ab" dir="ltr">${e[0]}</span><h4>${e[1]}</h4><p>${e[2]}</p></div>`).join('')}</div>
 <div class="card sa-reg">🌍 ${t.region}</div>
 <div class="card sa-work"><h3>🎓 ${t.workT}</h3><p>${t.work}</p><a class="btn pri" href="#careers">${t.workB}</a></div>
 <p class="note" style="margin-top:18px">${t.note}</p>
 <details class="sa-src"><summary>📚 ${t.srcT}</summary><ul>${SRC.map(s=>`<li><a href="${s[1]}" target="_blank" rel="noopener">${s[0]}</a></li>`).join('')}</ul></details>
 </div></section>`;}};
})(APP);
