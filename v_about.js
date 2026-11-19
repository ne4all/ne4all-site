/* ===== ABOUT ===== */
(function(A){
const T={
 ar:{tag:'من نحن',title:['قصة ','NE for All'],sub:'مبادرة سعودية بروح عالمية، هدفها أن تجعل العلوم النووية مفهومة ومتاحة للجميع.',
  me:'عبدالمجيد عبدالله آل جحني',role:'مؤسس المنصة · طالب هندسة نووية في جامعة الملك عبدالعزيز',
  bio:['أنا عبدالمجيد، طالب في قسم الهندسة النووية بجامعة الملك عبدالعزيز. خلال دراستي لاحظت أن المحتوى النووي باللغة العربية قليل ومتفرق، وأن كثيرًا من الناس لا يعرفون عن هذا المجال إلا القنابل والحوادث، مع أنه يدخل في الطب والكهرباء والصناعة وحياتنا اليومية.','من هنا بدأت فكرة NE for All: منصة تجمع العلوم النووية في مكان واحد، وتشرحها بلغة بسيطة، وتتيح لأي شخص أن يجرّب بنفسه عبر محاكيات تفاعلية، بالعربية والإنجليزية.'],
  vTitle:'🎯 رؤيتنا',vision:'أن نبني مجتمعًا نوويًا سعوديًا وعالميًا، يجمع المهتمين والطلاب والمختصين، ويكون مرجعًا موثوقًا لكل من يريد أن يفهم العالم النووي.',
  mTitle:'🚀 رسالتنا',mission:'تبسيط العلوم النووية وتقديمها بمحتوى دقيق وتجارب تفاعلية، تربط المعرفة بالواقع، وتعرّف الشباب بتخصصات الهندسة النووية وفرصها في المملكة والعالم.',
  valTitle:'💎 قيمنا',vals:[['🔬','الدقة','محتوى علمي مبني على مصادر موثوقة ومذكورة.'],['🧩','التبسيط','نشرح لغير المتخصص دون أن نخلّ بالمعنى العلمي.'],['🤝','الانفتاح','منصة مجانية للجميع، بالعربية والإنجليزية.'],['⚖️','الحياد','نعرض المزايا والتحديات بأمانة، دون تهويل أو تهوين.']],
  offTitle:'ماذا نقدّم؟',offer:[['☢️','محاكيات ثلاثية الأبعاد','للمفاعلات والإشعاع والطوارئ الإشعاعية، مع رحلات إلى داخل مكونات المحطة.'],['📚','محتوى متدرّج','من الذرة إلى الطاقة والسلامة والقصص والتخصصات والمراجع.'],['🤖','مساعد ذكي متخصص','يجيب عن أسئلتك النووية في أي وقت.'],['🎓','دليل للطلاب','حاسبات بخطوات الحل، وتعريف بالتخصصات وأماكن التوظيف.']],
  gTitle:'🌱 إلى أين نتجه؟',goals:['بناء مجتمع من الطلاب والمهتمين بالعلوم النووية في المملكة والعالم العربي والعالم.','إضافة محتوى جديد باستمرار: أخبار نووية، ومسارات تعليمية، وشهادات إتمام.','التعاون مع الجامعات والجهات المختصة لدعم الوعي النووي وتأهيل الكوادر.'],
  note:'NE for All مبادرة تعليمية مستقلة، ولا تمثل أي جهة رسمية. المعلومات الرسمية عن البرامج النووية تؤخذ من الجهات المختصة المذكورة في قسم المراجع.',
  join:'شاركنا الرحلة',joinT:'إذا كنت طالبًا أو مختصًا أو مهتمًا وتريد المساهمة في المحتوى أو المراجعة أو التطوير، فنحن نرحب بك.',cT:'✉️ تواصل معنا',cP:'للتواصل والملاحظات والاقتراحات، أو للإبلاغ عن خطأ علمي في المحتوى:',cB:'راسلنا بالبريد'},
 en:{tag:'About us',title:['The story of ','NE for All'],sub:'A Saudi initiative with a global spirit, making nuclear science understandable and accessible to everyone.',
  me:'Abdulmajeed Abdullah Al Jahni',role:'Founder · Nuclear Engineering student at King Abdulaziz University',
  bio:['I’m Abdulmajeed, a student in the Nuclear Engineering department at King Abdulaziz University. During my studies I noticed that nuclear content in Arabic is scarce and scattered, and that many people only associate the field with bombs and accidents, even though it shapes medicine, electricity, industry and our daily lives.','That is where NE for All began: a platform that brings nuclear science together in one place, explains it in simple language, and lets anyone experiment through interactive simulators, in Arabic and English.'],
  vTitle:'🎯 Our vision',vision:'To build a Saudi and global nuclear community that brings together learners, students and professionals, and to become a trusted reference for anyone who wants to understand the nuclear world.',
  mTitle:'🚀 Our mission',mission:'To simplify nuclear science through accurate content and interactive experiences that connect knowledge to reality, and to introduce young people to nuclear engineering careers in Saudi Arabia and worldwide.',
  valTitle:'💎 Our values',vals:[['🔬','Accuracy','Scientific content built on trusted, cited sources.'],['🧩','Simplicity','Explaining for non-specialists without losing scientific meaning.'],['🤝','Openness','A free platform for everyone, in Arabic and English.'],['⚖️','Balance','Presenting benefits and challenges honestly, without exaggeration.']],
  offTitle:'What we offer',offer:[['☢️','3D simulators','Reactors, radiation and radiological emergencies, with trips inside plant components.'],['📚','Structured content','From the atom to energy, safety, stories, careers and references.'],['🤖','Specialized AI assistant','Answers your nuclear questions any time.'],['🎓','A guide for students','Step-by-step calculators, specialties and where to work.']],
  gTitle:'🌱 Where we are heading',goals:['Building a community of students and enthusiasts in Saudi Arabia, the Arab world and beyond.','Adding new content continuously: nuclear news, learning paths and completion certificates.','Partnering with universities and relevant bodies to support nuclear awareness and talent development.'],
  note:'NE for All is an independent educational initiative and does not represent any official body. Official information about nuclear programs comes from the authorities listed in the References section.',
  join:'Join the journey',joinT:'If you are a student, professional or enthusiast and want to contribute content, reviews or development, you are welcome.',cT:'✉️ Contact us',cP:'For contact, feedback and suggestions, or to report a scientific error in the content:',cB:'Email us'}};
A.V.about={html(C){const t=T[A.LANG];
 return `<section><div class="wrap">${A.sh(t.tag,t.title,t.sub)}
 <div class="panel about-hero"><div class="avatar">${A.LANG==="ar"?"ع":"A"}</div><div><h3 style="font-size:1.45rem">${t.me}</h3><p style="color:#f0abfc;font-weight:700;margin-bottom:10px">${t.role}</p>${t.bio.map(p=>`<p style="color:var(--mut);margin-bottom:8px">${p}</p>`).join('')}</div></div>
 <div class="grid" style="margin-top:18px"><div class="card"><h3>${t.vTitle}</h3><p>${t.vision}</p></div><div class="card"><h3>${t.mTitle}</h3><p>${t.mission}</p></div></div>
 ${A.sh('',t.valTitle,'','margin-top:46px')}<div class="grid">${t.vals.map(v=>A.card(v[0],v[1],'',v[2])).join('')}</div>
 ${A.sh('',t.offTitle,'','margin-top:46px')}<div class="grid">${t.offer.map(v=>A.card(v[0],v[1],'',v[2])).join('')}</div>
 <div class="panel" style="margin-top:46px"><h3 style="margin-bottom:10px">${t.gTitle}</h3><ul class="jl" style="font-size:1rem">${t.goals.map(g=>`<li style="font-size:1rem">${g}</li>`).join('')}</ul></div>
 <div class="card" style="margin-top:18px;text-align:center"><h3>🤝 ${t.join}</h3><p>${t.joinT}</p></div>
 <div class="card contact" id="contact" style="margin-top:18px;text-align:center"><h3>${t.cT}</h3><p>${t.cP}</p><p class="mail" dir="ltr">ne4all.sa@gmail.com</p><a class="btn pri" href="mailto:ne4all.sa@gmail.com?subject=NE%20for%20All">${t.cB}</a></div>
 <p class="note">${t.note}</p></div></section>`;}};
})(APP);
