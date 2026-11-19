/* ===== NEWS ===== */
(function(A){
// r: me = Saudi / Arab region, w = world. Updated: 14 Nov 2026
const N=[
 {d:'2026-11-13',r:'w',c:'safe',u:'https://world-nuclear-news.org/',
  ar:['الوكالة الدولية تطالب إيران بإعادة التفتيش','في تقرير وُزّع على الدول الأعضاء، دعت الوكالة الدولية للطاقة الذرية طهران إلى إعادة وصول مفتشيها، وقالت إن غياب المعلومات عن المواقع والمواد النووية "مصدر قلق" يجب علاجه بسرعة. وردّت إيران بأن الوضع الأمني الحالي لا يسمح بذلك.'],
  en:['IAEA urges Iran to restore inspections','In a report circulated to member states, the IAEA asked Tehran to restore access for its inspectors, calling the lack of information on Iranian sites and material a proliferation concern. Iran said the current security situation does not allow it.'],s:'IAEA / AP'},
 {d:'2026-11-13',r:'w',c:'energy',u:'https://world-nuclear-news.org/',
  ar:['الصناعة النووية تطالب بمكان في تعهد COP31','طالبت جهات الصناعة النووية بالاعتراف بالطاقة النووية ضمن تعهد "35 بحلول 35" في مؤتمر المناخ COP31.'],
  en:['Industry seeks a place in COP31’s 35-by-35 pledge','Nuclear industry groups urged that nuclear power be recognised in the "35-by-35" pledge at the COP31 climate conference.'],s:'World Nuclear News'},
 {d:'2026-11-13',r:'w',c:'industry',u:'https://world-nuclear-news.org/',
  ar:['اكتمال توسعة مصنع BWXT في كندا','استثمار بنحو 80 مليون دولار كندي في مصنع كامبريدج بأونتاريو يرفع قدرة الشركة على تصنيع المكونات النووية الكبيرة للمفاعلات التقليدية والمتقدمة.'],
  en:['BWXT completes Ontario factory expansion','A CAD 80 million investment in the Cambridge, Ontario plant expands BWXT’s capacity to make large components for conventional and advanced reactors.'],s:'World Nuclear News'},
 {d:'2026-11-12',r:'w',c:'waste',u:'https://www.ans.org/news/',
  ar:['جامعة مانشستر تطور طرقًا جديدة لمعالجة النفايات المشعة','أعلن باحثون في جامعة مانشستر البريطانية عن أساليب جديدة لمعالجة النفايات المشعة.'],
  en:['University of Manchester develops new waste-treatment methods','Researchers at the University of Manchester reported new methods for treating radioactive waste.'],s:'ANS Nuclear Newswire'},
 {d:'2026-11-09',r:'w',c:'reactors',u:'https://www.nrc.gov/',
  ar:['أول تصريح بناء لمفاعل غازي عالي الحرارة منذ نحو 60 عامًا','منحت هيئة الرقابة النووية الأمريكية (NRC) تصريح بناء لمشروع Long Mott التابع لشركتي Dow وX-energy في تكساس، وهو مفاعل مبرَّد بغاز الهيليوم داخل موقع صناعي. ولا يُتوقع تشغيله قبل أوائل الثلاثينيات.'],
  en:['First HTGR construction permit in nearly 60 years','The US NRC issued a construction permit for the Dow/X-energy Long Mott project in Texas, a helium-cooled reactor at an industrial site. Operation is not expected before the early 2030s.'],s:'NRC / ANS'},
 {d:'2026-10-19',r:'w',c:'reactors',u:'https://world-nuclear-news.org/',
  ar:['روساتوم توقع صفقة محطة نووية عائمة لإندونيسيا','وقّعت روساتوم الروسية اتفاقًا لتوفير محطة طاقة نووية عائمة لإندونيسيا.'],
  en:['Rosatom signs floating-plant deal for Indonesia','Rosatom signed an agreement to supply a floating nuclear power plant to Indonesia.'],s:'World Nuclear News'},
 {d:'2026-10-15',r:'w',c:'reactors',u:'https://www.ans.org/news/',
  ar:['مفاعل موخوفتسي-4 في سلوفاكيا يتصل بالشبكة','اتصل المفاعل (من نوع VVER-440 بقدرة 471 ميغاواط) بالشبكة في 15 أكتوبر، بعد مشروع بدأ بناؤه عام 1986 وتوقف سنوات طويلة.'],
  en:['Slovakia’s Mochovce-4 connects to the grid','The VVER-440 unit (471 MWe) was connected on 15 October; construction began in 1986 and stalled for years.'],s:'ANS / WNN'},
 {d:'2026-10-15',r:'w',c:'reactors',u:'https://world-nuclear-news.org/',
  ar:['بولندا: مشروع مشترك لست مفاعلات صغيرة واتفاق لمحطة ثانية','تأسس مشروع مشترك لمحطة من ست وحدات مفاعلات صغيرة معيارية (SMR)، ووُقّع اتفاق على محطة نووية بولندية ثانية.'],
  en:['Poland: six-unit SMR venture and a second plant','A joint venture was formed for a six-unit SMR plant, and an agreement was signed on Poland’s second nuclear power plant.'],s:'World Nuclear News'},
 {d:'2026-10-12',r:'w',c:'reactors',u:'https://world-nuclear-news.org/',
  ar:['مفاعل روبور-1 في بنغلاديش يصل إلى الحرجية','وصل أول مفاعل في أول محطة نووية في بنغلاديش إلى حالة الحرجية، أي بدء التفاعل المتسلسل المستقر.'],
  en:['Bangladesh’s Rooppur-1 reaches criticality','The first unit of Bangladesh’s first nuclear plant reached criticality, a sustained chain reaction.'],s:'World Nuclear News'},
 {d:'2026-10-08',r:'w',c:'reactors',u:'https://world-nuclear-news.org/articles/chinese-reactors-start-up-milestones',
  ar:['الصين تتجاوز فرنسا في القدرة النووية','بعد ربط تيانوان-7 بالشبكة، وصلت القدرة النووية المركّبة في الصين إلى نحو 64 غيغاواط، متقدمة على فرنسا لأول مرة وخلف الولايات المتحدة فقط.'],
  en:['China overtakes France in nuclear capacity','With Tianwan-7 on the grid, China’s installed nuclear capacity reached about 64 GWe, ahead of France for the first time and second only to the USA.'],s:'World Nuclear News'},
 {d:'2026-10-01',r:'w',c:'reactors',u:'https://world-nuclear-news.org/',
  ar:['أمريكا وكوريا الجنوبية تستهدفان 8 مفاعلات كبيرة','يستهدف البلدان بناء ست وحدات AP1000 ووحدتين APR1400.'],
  en:['USA and South Korea target eight large units','The two countries are targeting six AP1000 and two APR1400 units.'],s:'World Nuclear News'},
 {d:'2026-10-23',r:'w',c:'reactors',u:'https://www.ans.org/news/',
  ar:['بدء الاختبارات الساخنة لمفاعل Linglong One الصغير','بدأت الصين الاختبارات الوظيفية الساخنة لمفاعل ACP100 الصغير المعياري، تمهيدًا لتحميل الوقود خلال العام القادم.'],
  en:['Hot tests begin for China’s Linglong One SMR','Hot functional tests started on the ACP100 small modular reactor, with fuel loading targeted within the coming year.'],s:'ANS Nuclear Newswire'},
 {d:'2026-09-01',r:'me',c:'reactors',u:'https://guest.meed.com/gulf-nuclear-revival-takes-shape/',
  ar:['مصر: تركيب وعاء ضغط المفاعل في الوحدة 2 بالضبعة','تتقدم محطة الضبعة (4 وحدات، 4.8 غيغاواط) مع روساتوم، وتم تركيب وعاء الضغط للوحدة الثانية في يوليو، ويُتوقع إنتاج أول كهرباء في 2028.'],
  en:['Egypt: reactor vessel installed at El-Dabaa Unit 2','The four-unit, 4.8 GW El-Dabaa plant with Rosatom installed Unit 2’s pressure vessel in July; first power is expected in 2028.'],s:'MEED'},
 {d:'2026-09-01',r:'me',c:'energy',u:'https://guest.meed.com/gulf-nuclear-revival-takes-shape/',
  ar:['الخليج: براكة تغطي ربع كهرباء الإمارات والبحرين تدرس المفاعلات الصغيرة','محطة براكة (5.6 غيغاواط) توفر نحو ربع كهرباء الإمارات، والسعودية تستهدف حتى 17 غيغاواط نووية بحلول 2040، والبحرين تدرس تقنيات المفاعلات الصغيرة المعيارية.'],
  en:['Gulf: Barakah supplies a quarter of UAE power, Bahrain studies SMRs','The 5.6 GW Barakah plant supplies about a quarter of UAE electricity; Saudi Arabia targets up to 17 GW by 2040, and Bahrain is evaluating SMRs.'],s:'MEED'},
 {d:'2026-07-22',r:'me',c:'policy',u:'https://www.ans.org/news/article-8238/saudi-arabia-us-sign-civil-nuclear-energy-deal/',
  ar:['السعودية وأمريكا توقعان اتفاق تعاون نووي سلمي','وقّع البلدان اتفاقًا للتعاون في الاستخدام السلمي للطاقة النووية واتفاق ضمانات ثنائيًا، ويُعرض الاتفاق على الكونغرس للمراجعة.'],
  en:['Saudi Arabia and the US sign civil nuclear deal','The two countries signed an agreement on peaceful nuclear cooperation and a bilateral safeguards agreement; Congress has a review period.'],s:'ANS / MEED'},
 {d:'2026-07-23',r:'me',c:'reactors',u:'https://guest.meed.com/saudi-arabia-and-us-sign-nuclear-energy-agreement/',
  ar:['أول محطة نووية سعودية: خور دويهين نحو مرحلة الطرح','الموقع المختار لمحطة بقدرة 2.8 غيغاواط (مفاعلان بنحو 1.4 غيغاواط لكل منهما) يتجه نحو مرحلة الشراء، ضمن رؤية 2030.'],
  en:['Saudi Arabia’s first plant: Khor Duwaiheen moves to procurement','The lead site for a planned 2.8 GW plant (two ~1.4 GW reactors) is moving towards procurement under Vision 2030.'],s:'MEED / IPS'}
];
A.NEWS=N;
const T={
 ar:{tag:'📰 الأخبار',title:['آخر ','الأخبار النووية'],sub:'أبرز ما يحدث في العالم النووي: مفاعلات جديدة، سياسات، أبحاث، وأخبار السعودية والمنطقة، مع رابط المصدر لكل خبر.',
  all:'الكل',me:'🇸🇦 السعودية والمنطقة',w:'🌍 العالم',src:'المصدر',read:'اقرأ الخبر ←',
  cat:{reactors:'مفاعلات',energy:'طاقة',policy:'سياسات',safe:'ضمانات',waste:'نفايات',industry:'صناعة'},
  note:'📌 نُحدِّث هذه الصفحة دوريًا. آخر تحديث: 14 نوفمبر 2026. الملخصات مكتوبة بأسلوبنا، والتفاصيل الكاملة في المصدر الأصلي.'},
 en:{tag:'📰 News',title:['Latest ','Nuclear News'],sub:'Key developments in the nuclear world: new reactors, policy, research, plus Saudi and regional news, each with a source link.',
  all:'All',me:'🇸🇦 Saudi & region',w:'🌍 World',src:'Source',read:'Read more →',
  cat:{reactors:'Reactors',energy:'Energy',policy:'Policy',safe:'Safeguards',waste:'Waste',industry:'Industry'},
  note:'📌 This page is updated periodically. Last update: 14 November 2026. Summaries are our own; full details are in the original source.'}
};
const fd=d=>{try{return new Date(d+'T12:00:00').toLocaleDateString(A.LANG==='ar'?'ar-SA-u-ca-gregory-nu-latn':'en-GB',{day:'numeric',month:'long',year:'numeric'});}catch(e){return d;}};
const card=(n,t)=>{const x=n[A.LANG];return `<article class="ncard" data-r="${n.r}"><div class="nm"><span class="tag${n.r==='me'?' me':''}">${t.cat[n.c]}</span><span>${fd(n.d)}</span></div><h3>${x[0]}</h3><p>${x[1]}</p><div class="nm"><span>${t.src}: ${n.s}</span><a href="${n.u}" target="_blank" rel="noopener">${t.read}</a></div></article>`;};
A.V.news={html(C){const t=T[A.LANG];const L=N.slice().sort((a,b)=>b.d.localeCompare(a.d));
 return `<section><div class="wrap">${A.sh(t.tag,t.title,t.sub)}
 <div class="news-f"><button class="on" data-f="all">${t.all}</button><button data-f="me">${t.me}</button><button data-f="w">${t.w}</button></div>
 <div class="news-g">${L.map(n=>card(n,t)).join('')}</div><div class="nnote">${t.note}</div></div></section>`;},
 init(){const bs=document.querySelectorAll('.news-f button');bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>x.classList.toggle('on',x===b));const f=b.dataset.f;document.querySelectorAll('.ncard').forEach(c=>c.style.display=(f==='all'||c.dataset.r===f)?'':'none');});return null;}};
})(APP);
