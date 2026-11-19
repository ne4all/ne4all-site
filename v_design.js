/* ===== DESIGN YOUR REACTOR (physics + UI + 2D fallback) =====
 Simplified but physically grounded model:
 thermal: k_inf = η·ε·p·f  (four-factor formula), fast: one-group fast balance
 k_eff = k_inf · P_NL,  P_NL = 1/(1+M²B²),  B² ≈ 8.25/R² (cylinder H=2R)
 kinetics: dP/dt = P(k-1)/Λ_eff, temperature feedback k(T)=k0·(1+α(T−T_in)) */
(function(A){
const F={ // fuels
 nat:{e:.0072,col:'#8b9099',cost:1,ar:['يورانيوم طبيعي','0.7٪ يورانيوم-235، بدون تخصيب'],en:['Natural uranium','0.7% U-235, no enrichment']},
 leu:{e:.04,col:'#8fd16a',cost:0,ar:['يورانيوم منخفض التخصيب','4٪ يورانيوم-235، وقود أغلب المفاعلات'],en:['Low-enriched uranium','4% U-235, fuel of most reactors']},
 haleu:{e:.1975,col:'#f2d45c',cost:-1,ar:['HALEU','19.75٪، لمفاعلات الجيل الجديد'],en:['HALEU','19.75%, for new-generation reactors']},
 mox:{e:.05,col:'#d39a5a',cost:-1,ar:['وقود MOX','بلوتونيوم معاد تدويره + يورانيوم'],en:['MOX fuel','Recycled plutonium + uranium']},
 th:{e:.03,col:'#c9d0e0',cost:-1,ar:['ثوريوم','ثوريوم-232 مع بذرة يورانيوم-233'],en:['Thorium','Thorium-232 with a U-233 seed']}
};
const MOD={
 lw:{col:'#3b82f6',ar:['ماء عادي','رخيص، يهدّئ بقوة لكنه يمتص نيوترونات'],en:['Light water','Cheap, strong moderator, but absorbs neutrons']},
 hw:{col:'#1e3a8a',ar:['ماء ثقيل','يهدّئ ولا يمتص تقريبًا، لكنه غالٍ'],en:['Heavy water','Moderates with almost no absorption, but costly']},
 gr:{col:'#2b2b30',ar:['جرافيت','كربون صلب، يتحمل حرارة عالية'],en:['Graphite','Solid carbon, withstands high heat']},
 none:{col:'#7c2d12',ar:['بدون مهدّئ','مفاعل سريع: النيوترونات تبقى سريعة'],en:['No moderator','Fast reactor: neutrons stay fast']}
};
const COOL={
 water:{col:'#60a5fa',tin:290,tout:325,tmax:345,bar:155,eff:.33,ar:['ماء مضغوط','يحتاج ضغطًا عاليًا جدًا'],en:['Pressurized water','Needs very high pressure']},
 hwc:{col:'#2563eb',tin:265,tout:310,tmax:330,bar:100,eff:.31,ar:['ماء ثقيل','نفس المهدّئ، كما في CANDU'],en:['Heavy water','Same as the moderator, as in CANDU']},
 gas:{col:'#e5e7eb',tin:250,tout:750,tmax:950,bar:60,eff:.43,ar:['غاز هيليوم','لا يتفاعل، ويصل لحرارة عالية جدًا'],en:['Helium gas','Inert, reaches very high temperature']},
 na:{col:'#cbd5e1',tin:395,tout:545,tmax:650,bar:1,eff:.40,ar:['صوديوم سائل','ينقل الحرارة ممتازًا، لكنه يتفاعل مع الماء'],en:['Liquid sodium','Excellent heat transfer, but reacts with water']},
 salt:{col:'#fb923c',tin:560,tout:700,tmax:760,bar:1,eff:.44,ar:['ملح منصهر','ضغط منخفض وحرارة عالية'],en:['Molten salt','Low pressure, high temperature']},
 pb:{col:'#52525b',tin:420,tout:540,tmax:620,bar:1,eff:.42,ar:['رصاص سائل','ثقيل وخامل، يغلي عند حرارة عالية جدًا'],en:['Liquid lead','Heavy and inert, boils very hot']}
};
A.RD={F,MOD,COOL};
// ---------- physics ----------
function etaU(e){return 2.43*585*e/(681*e+2.68*(1-e));}
function compute(d){
 const fu=F[d.fuel],co=COOL[d.cool];let mod=d.mod,note=null;
 if(mod==='none'&&d.cool==='water'){mod='lw';note='waterMod';}
 if(mod==='none'&&d.cool==='hwc'){mod='hw';note='waterMod';}
 const fast=mod==='none',e=fu.e;let kinf,eta=0,eps=1,p=1,f=1,M2,dens;
 if(!fast){
  if(d.fuel==='mox'){eta=1.87;eps=1.03;}else if(d.fuel==='th'){eta=1.62;eps=1.0;}else{eta=etaU(e);eps=e<.05?1.03:1.02;}
  const Af=d.fuel==='mox'?45:d.fuel==='th'?24.5:(681*e+2.68*(1-e));
  const Ma={lw:.9,hw:.02,gr:.08}[mod];
  const Ca=mod==='lw'&&d.cool==='water'?0:({water:.6,hwc:.02,gas:0,na:.3,salt:.12,pb:.05})[d.cool];
  f=Af/(Af+Ma+Ca+.3);
  p=Math.pow({lw:.75,hw:.9,gr:.88}[mod],(1-e)/.9928);
  kinf=eta*eps*p*f;if(d.fuel==='haleu')kinf*=.82; // HALEU designs use diluted fuel loading
  M2={lw:.006,hw:.024,gr:.06}[mod];
  dens=mod==='lw'?100:mod==='hw'?12:({gas:5,water:4.5,salt:20,na:5,pb:5,hwc:6})[d.cool];
 }else{
  if(d.fuel==='mox')kinf=1.5;else if(d.fuel==='th')kinf=.95;else kinf=(2.5*1.9*e+2.8*.045*(1-e))/(2.4*e+.33*(1-e));
  kinf/=1+.05+({na:.02,pb:.01,gas:0,salt:.04})[d.cool];eta=kinf;
  M2=d.cool==='gas'?.05:d.cool==='pb'?.03:.035;dens=d.cool==='na'?300:100;
 }
 const B2=8.25/(d.R*d.R),PNL=1/(1+M2*B2),k0=kinf*PNL,kRodsIn=k0*(1-.4);
 // temperature coefficient (Δk/k per °C), void behaviour
 const AL={lw:{water:-3e-4},hw:{hwc:-.5e-4,water:.5e-4,gas:-.6e-4,salt:-1e-4,na:-.3e-4,pb:-.3e-4},gr:{water:1.2e-4,gas:-.8e-4,salt:-2e-4,na:-.2e-4,pb:-.3e-4,hwc:-.3e-4},none:{na:-.15e-4,pb:-.25e-4,gas:-.2e-4,salt:-.8e-4}};
 const alpha=(AL[mod]&&AL[mod][d.cool]!==undefined)?AL[mod][d.cool]:-2e-4;
 const V=2*Math.PI*Math.pow(d.R,3),Pth=dens*V,eff=(fast||mod==='lw')&&d.cool==='water'?.33:co.eff,Pe=Pth*eff;
 // scores (1..5)
 const cl=x=>Math.max(1,Math.min(5,Math.round(x)));
 let saf=3;if(alpha<-2e-4)saf+=1;if(alpha>0)saf-=2;if(co.bar>=100)saf-=.5;if(['na','salt','pb'].includes(d.cool))saf+=.5;if(d.cool==='na')saf-=.5;if(d.cool==='gas'&&mod==='gr')saf+=1;if(d.cool==='salt')saf+=1;if(d.cool==='pb')saf+=.5;if(kRodsIn>=1)saf-=3;
 let cost=4+fu.cost;if(mod==='hw')cost-=1;if(mod==='gr'&&d.R>3)cost-=.5;if(['na','pb','gas'].includes(d.cool))cost-=.5;if(d.cool==='salt')cost-=1;
 let waste=2;if(fast)waste+=2;if(d.fuel==='th')waste+=1.5;if(d.fuel==='mox')waste+=1;if(d.fuel==='nat')waste-=.5;if(d.cool==='salt')waste+=.5;
 const effS=cl((eff-.28)/.04+1);
 return {mod,fast,note,kinf,eta,eps,p,f,M2,B2,PNL,k0,kRodsIn,alpha,Pth,Pe,eff,dens,works:k0>=1,canStop:kRodsIn<1,
  safety:cl(saf),cost:cl(cost),waste:cl(waste),effS,tin:co.tin,tout:co.tout,tmax:co.tmax,bar:co.bar};
}
A.rdCompute=compute;
// famous real reactors with similar choices
const REAL=[
 {t:d=>d.fuel==='nat'&&d.mod==='hw'&&['hwc','water'].includes(d.cool),ar:['CANDU','كندا','يشتغل باليورانيوم الطبيعي بدون تخصيب، بفضل الماء الثقيل. يوجد في كندا والهند والأرجنتين ورومانيا.'],en:['CANDU','Canada','Runs on natural uranium without enrichment, thanks to heavy water. Used in Canada, India, Argentina and Romania.']},
 {t:d=>d.fuel==='th'&&d.mod==='hw',ar:['AHWR','الهند','تصميم هندي يستخدم الثوريوم المتوفر بكثرة في الهند.'],en:['AHWR','India','An Indian design using thorium, abundant in India.']},
 {t:d=>['leu','mox'].includes(d.fuel)&&d.mod==='lw'&&d.cool==='water'&&d.R<1.25,ar:['SMART أو NuScale','كوريا وأمريكا','مفاعل صغير معياري. صُمّم SMART الكوري لإنتاج الكهرباء وتحلية المياه، ودرسته المملكة مع كوريا.'],en:['SMART or NuScale','Korea & USA','A small modular reactor. Korea’s SMART was designed for electricity and desalination and studied jointly by Saudi Arabia and Korea.']},
 {t:d=>['leu','mox'].includes(d.fuel)&&d.mod==='lw'&&d.cool==='water',ar:['PWR (مثل APR1400)','كوريا، والإمارات في براكة','مفاعل الماء المضغوط، الأكثر انتشارًا في العالم. محطة براكة في الإمارات فيها 4 مفاعلات APR1400.'],en:['PWR (e.g., APR1400)','Korea; UAE at Barakah','The pressurized water reactor, the most common in the world. The UAE’s Barakah plant has four APR1400 units.']},
 {t:d=>d.mod==='gr'&&d.cool==='water',ar:['RBMK','الاتحاد السوفيتي','نوع مفاعل تشيرنوبل. الماء يبرّد والجرافيت يهدّئ، فلما يغلي الماء يزيد التفاعل بدل ما يقل (معامل فراغ موجب). ⚠️'],en:['RBMK','Soviet Union','The Chernobyl reactor type. Water cools and graphite moderates, so boiling water increases reactivity instead of reducing it (positive void coefficient). ⚠️']},
 {t:d=>d.fuel==='nat'&&d.mod==='gr'&&d.cool==='gas',ar:['Magnox','بريطانيا','أول جيل من المحطات البريطانية: يورانيوم طبيعي وجرافيت وغاز.'],en:['Magnox','UK','The first generation of British plants: natural uranium, graphite and gas.']},
 {t:d=>['leu','haleu'].includes(d.fuel)&&d.mod==='gr'&&d.cool==='gas',ar:['Xe-100 أو HTR-PM','أمريكا والصين','مفاعل غازي عالي الحرارة بوقود كروي. حصل Xe-100 على تصريح بناء في تكساس في نوفمبر 2026، والصين تشغّل HTR-PM.'],en:['Xe-100 or HTR-PM','USA & China','A high-temperature gas reactor with pebble fuel. Xe-100 received a construction permit in Texas in November 2026; China operates HTR-PM.']},
 {t:d=>d.fuel==='th'&&d.cool==='salt',ar:['TMSR-LF1','الصين','مفاعل ملح منصهر تجريبي يعمل بالثوريوم في صحراء غانسو.'],en:['TMSR-LF1','China','An experimental thorium molten-salt reactor in the Gansu desert.']},
 {t:d=>d.mod==='gr'&&d.cool==='salt',ar:['MSRE','أمريكا','مفاعل الملح المنصهر التجريبي في أوك ريدج، اشتغل في الستينات.'],en:['MSRE','USA','The Molten-Salt Reactor Experiment at Oak Ridge, operated in the 1960s.']},
 {t:d=>d.mod==='none'&&d.cool==='na',ar:['BN-800 أو Natrium','روسيا وأمريكا','مفاعل سريع مبرّد بالصوديوم، يقدر يحرق البلوتونيوم ويقلل النفايات طويلة العمر.'],en:['BN-800 or Natrium','Russia & USA','A sodium-cooled fast reactor that can burn plutonium and reduce long-lived waste.']},
 {t:d=>d.mod==='none'&&d.cool==='pb',ar:['BREST-300','روسيا','مفاعل سريع مبرّد بالرصاص، قيد الإنشاء في روسيا.'],en:['BREST-300','Russia','A lead-cooled fast reactor under construction in Russia.']},
 {t:d=>d.mod==='none'&&d.cool==='gas',ar:['ALLEGRO','أوروبا','تصميم أوروبي لمفاعل سريع مبرّد بالغاز.'],en:['ALLEGRO','Europe','A European gas-cooled fast reactor design.']}
];
// challenges
const CH=[
 {id:'first',ar:['أول مفاعل','صمّم أي مفاعل يشتغل ويمكن إيقافه بأمان.'],en:['First reactor','Design any reactor that works and can be shut down safely.'],ok:(d,r)=>r.works&&r.canStop},
 {id:'nat',ar:['بدون تخصيب','شغّل مفاعلًا باليورانيوم الطبيعي.'],en:['No enrichment','Run a reactor on natural uranium.'],ok:(d,r)=>d.fuel==='nat'&&r.works&&r.canStop},
 {id:'desal',ar:['تحلية مياه مدينة ساحلية','قدرة بين 50 و 400 ميغاواط كهرباء، وأمان 4 نجوم أو أكثر.'],en:['Desalinate a coastal city','50–400 MWe, and safety of 4 stars or more.'],ok:(d,r)=>r.works&&r.canStop&&r.Pe>=50&&r.Pe<=400&&r.safety>=4},
 {id:'khor',ar:['محطة خور دويهين','1000 ميغاواط كهرباء أو أكثر، وأمان 3 نجوم أو أكثر.'],en:['Khor Duwaiheen plant','1000 MWe or more, and safety of 3 stars or more.'],ok:(d,r)=>r.works&&r.canStop&&r.Pe>=1000&&r.safety>=3},
 {id:'small',ar:['أصغر مفاعل','قلب نصف قطره 0.8 متر أو أقل، ويشتغل.'],en:['Smallest reactor','A core radius of 0.8 m or less that works.'],ok:(d,r)=>d.R<=.8&&r.works&&r.canStop},
 {id:'waste',ar:['أقل نفايات','تقييم النفايات 4 نجوم أو أكثر.'],en:['Least waste','Waste rating of 4 stars or more.'],ok:(d,r)=>r.works&&r.canStop&&r.waste>=4},
 {id:'eff',ar:['أعلى كفاءة','كفاءة تحويل 43٪ أو أكثر.'],en:['Highest efficiency','Conversion efficiency of 43% or more.'],ok:(d,r)=>r.works&&r.canStop&&r.eff>=.43},
 {id:'safe',ar:['الأكثر أمانًا','أمان 5 نجوم.'],en:['Safest design','5-star safety.'],ok:(d,r)=>r.works&&r.canStop&&r.safety>=5},
 {id:'moon',ar:['مفاعل لقاعدة على القمر','نصف قطر 1 متر أو أقل، وبدون ماء.'],en:['Reactor for a Moon base','Radius of 1 m or less, with no water.'],ok:(d,r)=>d.R<=1&&!['water','hwc'].includes(d.cool)&&d.mod!=='lw'&&d.mod!=='hw'&&r.works&&r.canStop}
];
const T={
 ar:{tag:'🛠️ صمّم مفاعلك',title:['ابنِ مفاعلك ','بنفسك'],sub:'اختر الوقود والمهدّئ والمبرّد وحجم القلب، ثم شغّل المفاعل وشاهد هل يعمل. النتائج مبنية على فيزياء مفاعلات حقيقية مبسّطة.',
  s1:'① الوقود',s2:'② المهدّئ',s3:'③ المبرّد',s4:'④ حجم القلب',rad:'نصف القطر',rods:'قضبان التحكم',auto:'تحكم آلي',manual:'يدوي',
  start:'▶ شغّل المفاعل',scram:'⛔ إيقاف طارئ',reset:'↺ إعادة',free:'🧪 الوضع الحر',chal:'🎯 التحديات',
  pow:'القدرة',temp:'الحرارة',out:'الكهرباء',kL:'معامل التكاثر k',
  st:{off:'متوقف — اضغط "شغّل"',start:'يبدأ التفاعل المتسلسل…',rise:'القدرة ترتفع',steady:'مستقر وحرج ✅',fall:'التفاعل يضعف',sub:'لا يحافظ على التفاعل',scram:'⛔ إيقاف طارئ — القضبان سقطت',hot:'🔥 حرارة زائدة! إيقاف طارئ تلقائي',run:'⚠️ القدرة تنفلت! إيقاف طارئ تلقائي'},
  res:'النتيجة',works:'✅ تصميمك يعمل!',fails:'❌ تصميمك لا يصل للحرجية',noStop:'⚠️ يعمل، لكن قضبان التحكم لا تكفي لإيقافه!',
  sc:['الأمان','الكفاءة','التكلفة','النفايات'],like:'تصميمك يشبه',newIdea:'💡 لا يوجد مفاعل مشهور بهذه التركيبة بالضبط، فكرة جديدة!',
  eng:'🔬 عرض المهندس',why:'لماذا؟',
  R:{fastLow:'المفاعل السريع يحتاج وقودًا غنيًا بالمواد الانشطارية (HALEU أو MOX)، لأن النيوترونات السريعة أقل قدرة على شطر اليورانيوم-235.',natLw:'الماء العادي يمتص نيوترونات كثيرة، واليورانيوم الطبيعي لا يكفي معه. جرّب ماءً ثقيلًا أو جرافيتًا، أو خصّب الوقود.',small:'القلب صغير جدًا: نيوترونات كثيرة تهرب من السطح قبل أن تشطر ذرة. كبّر نصف القطر.',abs:'المواد في القلب تمتص نيوترونات أكثر مما ينتجه الانشطار.',noStop:'الوقود قوي جدًا بالنسبة لقضبان التحكم: حتى لو أُدخلت كلها يبقى k أكبر من 1. صغّر التخصيب أو القلب.',pos:'معامل الحرارة موجب: كلما سخن المفاعل زاد التفاعل، وهذا خطير كما حدث في تشيرنوبل.',neg:'معامل الحرارة سالب: كلما سخن المفاعل ضعف التفاعل تلقائيًا، وهذا يجعله آمنًا بطبيعته.',waterMod:'لاحظ: اخترت بدون مهدّئ لكن المبرّد ماء، والماء نفسه يهدّئ النيوترونات، فصار المفاعل حراريًا.',na:'الصوديوم يشتعل إذا لامس الماء أو الهواء، فيحتاج أنظمة عزل دقيقة.',salt:'في الملح المنصهر لا يوجد ضغط عالٍ، والوقود لا ينصهر لأنه سائل أصلًا.',gasgr:'الجرافيت مع الهيليوم يتحمل حرارة عالية جدًا، فيصعب أن ينصهر القلب.'},
  chalT:'اختر تحديًا',done:'✅ أنجزت التحدي!',notYet:'لم يتحقق بعد',
  engL:{kinf:'k∞ (مفاعل لا نهائي)',eta:'η عامل الإنتاج',eps:'ε الانشطار السريع',p:'p الهروب من الرنين',f:'f الاستفادة الحرارية',pnl:'احتمال عدم التسرب',k0:'k الفعّال (القضبان خارج)',kin:'k (كل القضبان داخل)',alpha:'معامل الحرارة',pth:'القدرة الحرارية',pe:'القدرة الكهربائية',eff:'الكفاءة',bar:'ضغط المبرّد'},
  note:'⚠️ نموذج تعليمي مبسّط: الأرقام تقريبية لتوضيح الفكرة، والاتجاهات صحيحة علميًا، لكنها ليست حسابات تصميم هندسي.'},
 en:{tag:'🛠️ Design Your Reactor',title:['Build your own ','reactor'],sub:'Choose the fuel, moderator, coolant and core size, then start the reactor and see whether it works. Results are based on simplified real reactor physics.',
  s1:'① Fuel',s2:'② Moderator',s3:'③ Coolant',s4:'④ Core size',rad:'Radius',rods:'Control rods',auto:'Auto control',manual:'Manual',
  start:'▶ Start reactor',scram:'⛔ SCRAM',reset:'↺ Reset',free:'🧪 Free mode',chal:'🎯 Challenges',
  pow:'Power',temp:'Temperature',out:'Electricity',kL:'Multiplication factor k',
  st:{off:'Stopped — press “Start”',start:'Chain reaction starting…',rise:'Power rising',steady:'Stable & critical ✅',fall:'Reaction fading',sub:'Can’t sustain a chain reaction',scram:'⛔ SCRAM — rods dropped',hot:'🔥 Overheating! Automatic SCRAM',run:'⚠️ Power runaway! Automatic SCRAM'},
  res:'Result',works:'✅ Your design works!',fails:'❌ Your design can’t reach criticality',noStop:'⚠️ It works, but the control rods can’t shut it down!',
  sc:['Safety','Efficiency','Cost','Waste'],like:'Your design resembles',newIdea:'💡 No famous reactor uses exactly this combination, a new idea!',
  eng:'🔬 Engineer view',why:'Why?',
  R:{fastLow:'A fast reactor needs fuel rich in fissile material (HALEU or MOX), because fast neutrons are less likely to split U-235.',natLw:'Light water absorbs many neutrons, and natural uranium isn’t enough with it. Try heavy water or graphite, or enrich the fuel.',small:'The core is too small: many neutrons leak out of the surface before causing fission. Increase the radius.',abs:'Materials in the core absorb more neutrons than fission produces.',noStop:'The fuel is too strong for the control rods: even fully inserted, k stays above 1. Reduce enrichment or core size.',pos:'Positive temperature coefficient: the hotter it gets, the stronger the reaction. Dangerous, as at Chernobyl.',neg:'Negative temperature coefficient: as it heats up, the reaction weakens by itself, making it inherently safe.',waterMod:'Note: you chose no moderator, but the coolant is water, which moderates neutrons itself, so the reactor became thermal.',na:'Sodium burns on contact with water or air, so it needs careful isolation systems.',salt:'Molten salt runs at low pressure, and the fuel can’t melt because it’s already liquid.',gasgr:'Graphite with helium tolerates very high temperatures, so the core is very hard to melt.'},
  chalT:'Pick a challenge',done:'✅ Challenge complete!',notYet:'Not achieved yet',
  engL:{kinf:'k∞ (infinite reactor)',eta:'η reproduction factor',eps:'ε fast fission',p:'p resonance escape',f:'f thermal utilization',pnl:'Non-leakage probability',k0:'k-eff (rods out)',kin:'k (all rods in)',alpha:'Temperature coefficient',pth:'Thermal power',pe:'Electric power',eff:'Efficiency',bar:'Coolant pressure'},
  note:'⚠️ Simplified educational model: numbers are approximate to illustrate ideas; trends are scientifically correct, but these are not engineering design calculations.'}
};
const L=()=>T[A.LANG],ar=()=>A.LANG==='ar',nm=o=>ar()?o.ar:o.en;
const stars=n=>'★'.repeat(n)+'<i>'+'★'.repeat(5-n)+'</i>';
const fmtP=x=>x>=1000?(x/1000).toFixed(2)+' GW':Math.round(x)+' MW';
A.V.design={html(C){const t=L();
 const chips=(obj,key)=>Object.keys(obj).map(k=>`<button class="rd-ch" data-k="${key}" data-v="${k}"><i style="background:${obj[k].col}"></i><b>${nm(obj[k])[0]}</b><small>${nm(obj[k])[1]}</small></button>`).join('');
 return `<section><div class="wrap">${A.sh(t.tag,t.title,t.sub)}
 <div class="rd-modes"><button class="on" data-m="free">${t.free}</button><button data-m="chal">${t.chal}</button></div>
 <div class="rd-chal hide" id="rdChal"><b>${t.chalT}</b><div class="rd-cl">${CH.map(c=>`<button data-c="${c.id}"><span>${nm(c)[0]}</span><small>${nm(c)[1]}</small><em></em></button>`).join('')}</div></div>
 <div class="rd-grid">
  <div class="rd-ctl">
   <h4>${t.s1}</h4><div class="rd-chips">${chips(F,'fuel')}</div>
   <h4>${t.s2}</h4><div class="rd-chips">${chips(MOD,'mod')}</div>
   <h4>${t.s3}</h4><div class="rd-chips">${chips(COOL,'cool')}</div>
   <h4>${t.s4}</h4><div class="rd-sl"><span>${t.rad}</span><input type="range" id="rdR" min="0.3" max="6" step="0.1"><b id="rdRv"></b></div>
  </div>
  <div class="rd-main">
   <div class="plant rd-stage" id="rdStage"><canvas id="rdCv"></canvas><div class="rd-st" id="rdSt"></div></div>
   <div class="rd-meters"><div><span>${t.pow}</span><b id="rdP">0%</b></div><div><span>${t.temp}</span><b id="rdT">—</b></div><div><span>${t.out}</span><b id="rdE">0 MW</b></div><div><span>${t.kL}</span><b id="rdK">—</b></div></div>
   <div class="rd-kbar"><div class="rd-kz"></div><i id="rdKn"></i><span>0.9</span><span>1.0</span><span>1.1</span></div>
   <div class="rd-run"><button class="btn pri" id="rdStart">${t.start}</button><button class="btn" id="rdScram">${t.scram}</button><button class="btn" id="rdReset">${t.reset}</button></div>
   <div class="rd-sl"><span>${t.rods}</span><input type="range" id="rdRod" min="0" max="100" step="1" value="60"><b id="rdRodv"></b><label class="rd-auto"><input type="checkbox" id="rdAuto" checked> ${t.auto}</label></div>
  </div>
 </div>
 <div class="rd-res" id="rdRes"></div>
 <p class="note" style="margin-top:16px">${t.note}</p>
 </div></section>`;},
 init(){const t=L(),$=id=>document.getElementById(id);
  const d={fuel:'leu',mod:'lw',cool:'water',R:1.7};let r=compute(d),mode='free',chal=null,showEng=false;
  const s={on:false,P:0,T:COOL[d.cool].tin,rods:.6,auto:true,msg:'off',trip:null,neut:[],t:0};
  const host=$('rdStage'),cv=$('rdCv');let v3=null,no3d=false,three=false,dirty3=true;
  const ld=document.createElement('div');ld.className='load3d';ld.textContent=A.C?A.C.load3d:'';host.appendChild(ld);
  A.loadThree().then(()=>{three=true;ld.remove();}).catch(()=>{ld.remove();no3d=true;});
  function sel(){document.querySelectorAll('.rd-ch').forEach(b=>b.classList.toggle('on',d[b.dataset.k]===b.dataset.v));$('rdR').value=d.R;$('rdRv').textContent=d.R.toFixed(1)+' m';}
  function changed(){r=compute(d);sel();dirty3=true;if(!s.on){s.T=COOL[d.cool].tin;}else{s.T=Math.max(s.T,COOL[d.cool].tin);}renderRes();}
  document.querySelectorAll('.rd-ch').forEach(b=>b.onclick=()=>{d[b.dataset.k]=b.dataset.v;changed();});
  $('rdR').oninput=e=>{d.R=+e.target.value;changed();};
  $('rdRod').oninput=e=>{s.rods=+e.target.value/100;if(s.auto){s.auto=false;$('rdAuto').checked=false;}};
  $('rdAuto').onchange=e=>{s.auto=e.target.checked;};
  $('rdStart').onclick=()=>{if(s.trip){s.trip=null;}s.on=true;s.P=Math.max(s.P,.1);s.msg='start';if(s.auto)s.rods=.5;};
  $('rdScram').onclick=()=>{if(s.on){s.trip='scram';s.rods=1;s.auto=false;$('rdAuto').checked=false;}};
  $('rdReset').onclick=()=>{s.on=false;s.P=0;s.T=COOL[d.cool].tin;s.trip=null;s.rods=.6;s.auto=true;$('rdAuto').checked=true;s.msg='off';};
  document.querySelectorAll('.rd-modes button').forEach(b=>b.onclick=()=>{mode=b.dataset.m;document.querySelectorAll('.rd-modes button').forEach(x=>x.classList.toggle('on',x===b));$('rdChal').classList.toggle('hide',mode!=='chal');if(mode!=='chal')chal=null;renderRes();});
  document.querySelectorAll('.rd-cl button').forEach(b=>b.onclick=()=>{chal=CH.find(c=>c.id===b.dataset.c);document.querySelectorAll('.rd-cl button').forEach(x=>x.classList.toggle('on',x===b));renderRes();});
  function reasons(){const R=t.R,out=[];
   if(!r.works){if(r.fast&&['nat','leu','th'].includes(d.fuel))out.push(R.fastLow);else if(d.fuel==='nat'&&r.mod==='lw')out.push(R.natLw);else if(r.PNL<.85)out.push(R.small);else out.push(r.PNL<.95?R.small:R.abs);}
   else if(!r.canStop)out.push(R.noStop);
   if(r.note)out.push(R[r.note]);
   if(r.works){out.push(r.alpha>0?R.pos:R.neg);if(d.cool==='na')out.push(R.na);if(d.cool==='salt')out.push(R.salt);if(d.cool==='gas'&&r.mod==='gr')out.push(R.gasgr);}
   return out;}
  function renderRes(){const real=r.works?REAL.find(x=>x.t(d)):null,rs=reasons();
   let h=`<div class="rd-rc ${r.works?(r.canStop?'ok':'warn'):'bad'}"><h3>${r.works?(r.canStop?t.works:t.noStop):t.fails}</h3><ul>${rs.map(x=>`<li>${x}</li>`).join('')}</ul></div>`;
   if(r.works)h+=`<div class="rd-sc">${t.sc.map((n,i)=>`<div><span>${n}</span><b>${stars([r.safety,r.effS,r.cost,r.waste][i])}</b></div>`).join('')}</div>
    <div class="rd-pw"><div><span>${t.engL.pth}</span><b dir="ltr">${fmtP(r.Pth)}</b></div><div><span>${t.engL.pe}</span><b dir="ltr">${fmtP(r.Pe)}</b></div><div><span>${t.engL.eff}</span><b dir="ltr">${Math.round(r.eff*100)}%</b></div></div>`;
   if(r.works)h+=real?`<div class="rd-like"><small>${t.like}</small><h4>${nm(real)[0]} <em>· ${nm(real)[1]}</em></h4><p>${nm(real)[2]}</p></div>`:`<div class="rd-like"><p>${t.newIdea}</p></div>`;
   if(chal){const ok=chal.ok(d,r);h=`<div class="rd-cg ${ok?'ok':''}"><b>🎯 ${nm(chal)[0]}</b><span>${nm(chal)[1]}</span><em>${ok?t.done:t.notYet}</em></div>`+h;}
   const n=v=>v.toFixed(3);
   h+=`<details class="rd-eng" ${showEng?'open':''}><summary>${t.eng}</summary><div class="rd-eg">${(r.fast?[['kinf',n(r.kinf)]]:[['eta',n(r.eta)],['eps',n(r.eps)],['p',n(r.p)],['f',n(r.f)],['kinf',n(r.kinf)]]).concat([['pnl',n(r.PNL)],['k0',n(r.k0)],['kin',n(r.kRodsIn)],['alpha',(r.alpha*1e5).toFixed(1)+' pcm/°C'],['pth',fmtP(r.Pth)],['pe',fmtP(r.Pe)],['eff',Math.round(r.eff*100)+'%'],['bar',r.bar+' bar']]).map(x=>`<div><span>${t.engL[x[0]]}</span><b dir="ltr">${x[1]}</b></div>`).join('')}</div></details>`;
   $('rdRes').innerHTML=h;const de=$('rdRes').querySelector('.rd-eng');de.ontoggle=()=>{showEng=de.open;};
   document.querySelectorAll('.rd-cl button').forEach(b=>{const c=CH.find(x=>x.id===b.dataset.c);b.querySelector('em').textContent=c.ok(d,r)?'✅':'';});}
  // physics step
  function step(dt){const co=COOL[d.cool];
   const kT=T0=>r.k0*(1+r.alpha*(T0-co.tin));
   if(s.on&&s.auto&&!s.trip){const dl=Math.max(-.004,Math.min(.05,.0006*(100-s.P)));s.rods=Math.max(0,Math.min(1,(1-(1+dl)/kT(s.T))/.4));}
   let k=kT(s.T)*(1-.4*s.rods);s.k=k;
   if(s.on){const rate=Math.max(-1.2,Math.min(.8,(k-1)/.08));s.P+=s.P*rate*dt+(s.P<1e-3&&k>.95?1e-4*dt:0);s.P=Math.max(0,s.P);
    if(s.P<1e-6&&k<1){s.P=0;}
    const Tt=co.tin+(co.tout-co.tin)*Math.min(s.P,400)/100;s.T+=(Tt-s.T)*Math.min(1,dt/3);
    if(!s.trip&&s.T>co.tmax){s.trip='hot';s.rods=1;s.auto=false;$('rdAuto').checked=false;}
    if(!s.trip&&s.P>160){s.trip='run';s.rods=1;s.auto=false;$('rdAuto').checked=false;}
    s.msg=s.trip?s.trip:(s.P<.01&&k<1?'sub':k>1.0015?'rise':k<.9985?'fall':s.P>1?'steady':'start');}
   else{s.T+=(co.tin-s.T)*Math.min(1,dt/3);}
  }
  function hud(){const co=COOL[d.cool];$('rdP').textContent=(s.P<10?s.P.toFixed(2):Math.round(s.P))+'%';$('rdT').textContent=Math.round(s.T)+' °C';
   $('rdE').textContent=fmtP(r.works?r.Pe*Math.min(s.P,150)/100:0);$('rdK').textContent=(s.k||r.k0).toFixed(4);
   const kk=s.k||r.k0,x=Math.max(0,Math.min(1,(kk-.9)/.2));$('rdKn').style.left=(x*100)+'%';$('rdKn').className=kk>1.002?'up':kk<.998?'dn':'eq';
   $('rdRod').value=Math.round(s.rods*100);$('rdRodv').textContent=Math.round(s.rods*100)+'%';
   const st=$('rdSt');st.textContent=t.st[s.msg]||'';st.className='rd-st '+(['scram','hot','run'].includes(s.msg)?'bad':s.msg==='steady'?'ok':'');
   $('rdT').style.color=s.T>co.tmax*.97?'#f87171':'';}
  // 2D fallback drawing
  function draw2d(dt){const W=cv.clientWidth,H=cv.clientHeight;if(!W)return;const dpr=Math.min(2,window.devicePixelRatio||1);if(cv.width!==Math.round(W*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);}
   const g=cv.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle=A.CV().bg;g.fillRect(0,0,W,H);
   const cx=W/2,cy=H/2,Rp=Math.min(W,H)*.36*Math.min(1,.45+d.R/6),mo=MOD[r.mod],co=COOL[d.cool],fu=F[d.fuel],glow=Math.min(1,s.P/100);
   g.fillStyle='#3f3f46';g.beginPath();g.arc(cx,cy,Rp+14,0,7);g.fill();
   g.fillStyle=r.fast?co.col:mo.col;g.globalAlpha=r.fast?.55:.8;g.beginPath();g.arc(cx,cy,Rp,0,7);g.fill();g.globalAlpha=1;
   if(glow>0){const gr=g.createRadialGradient(cx,cy,0,cx,cy,Rp);gr.addColorStop(0,`rgba(96,165,250,${.55*glow})`);gr.addColorStop(1,'rgba(96,165,250,0)');g.fillStyle=gr;g.beginPath();g.arc(cx,cy,Rp,0,7);g.fill();}
   const pitch=Math.max(9,Rp/7);g.fillStyle=fu.col;for(let x=-Rp;x<=Rp;x+=pitch)for(let y=-Rp;y<=Rp;y+=pitch){if(x*x+y*y<(Rp-6)*(Rp-6)){g.beginPath();g.arc(cx+x,cy+y,pitch*.28,0,7);g.fill();}}
   g.fillStyle='#111';for(let i=0;i<8;i++){const a=i/8*6.283,rr=Rp*.55;g.globalAlpha=.4+.6*s.rods;g.beginPath();g.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,pitch*.4,0,7);g.fill();}g.globalAlpha=1;
   // neutrons
   const n=s.neut,want=Math.min(160,Math.round(Math.sqrt(s.P)*16));while(n.length<want)n.push({x:cx+(Math.random()-.5)*Rp,y:cy+(Math.random()-.5)*Rp,vx:(Math.random()-.5)*220,vy:(Math.random()-.5)*220,l:Math.random()*1.2,f:1});
   if(n.length>want)n.length=want;
   n.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;if(!r.fast&&p.f&&Math.random()<dt*2.5){p.f=0;p.vx*=.3;p.vy*=.3;}if(p.l<0||Math.hypot(p.x-cx,p.y-cy)>Rp){p.x=cx+(Math.random()-.5)*Rp;p.y=cy+(Math.random()-.5)*Rp;p.vx=(Math.random()-.5)*220;p.vy=(Math.random()-.5)*220;p.l=.6+Math.random();p.f=1;}
    g.fillStyle=p.f?'#fdba74':'#67e8f9';g.beginPath();g.arc(p.x,p.y,2,0,7);g.fill();});}
  function frame(dt){s.t+=dt;for(let i=0;i<6;i++)step(dt/6);hud();
   if(v3){try{if(dirty3){v3.build(d,r);dirty3=false;}v3.update(dt,s,d,r);}catch(e){console.error(e);try{v3.dispose();}catch(_){}v3=null;no3d=true;host.classList.remove('is3d');}}
   else{draw2d(dt);if(three&&!no3d&&A.design3d){try{v3=A.design3d(host);host.classList.add('is3d');dirty3=true;}catch(e){console.error(e);no3d=true;}}}}
  changed();
  return {frame,destroy(){if(v3)try{v3.dispose();}catch(e){}}};}
};
})(APP);
