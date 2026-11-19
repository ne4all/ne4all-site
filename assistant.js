/* ===== Nuclear AI assistant (docked side panel) ===== */
(function(A){
const TX={
 ar:{title:'🤖 المساعد النووي',sub:'اسألني أي شيء عن العلوم والهندسة النووية',ph:'اكتب سؤالك هنا...',send:'إرسال',tab:'🤖 المساعد النووي',close:'إخفاء',clear:'محادثة جديدة',
  hello:'مرحبًا! أنا المساعد النووي لموقع NE for All. اسألني عن الذرة والإشعاع والمفاعلات والطاقة النووية والتخصصات وفرص العمل في السعودية وخارجها.',
  sugg:['كيف يعمل المفاعل النووي؟','ما الفرق بين الانشطار والاندماج؟','أين يعمل المهندس النووي في السعودية؟','هل الأشعة الطبية خطيرة؟'],
  thinking:'جارٍ التفكير...',na:'المساعد غير متاح في هذا العرض. افتح الموقع عبر رابطه على Claude لاستخدامه.',busy:'الطلبات كثيرة الآن، حاول بعد قليل.',err:'حدث خطأ، حاول مرة أخرى.',note:'قد يخطئ المساعد أحيانًا؛ تحقّق من المعلومات المهمة.'},
 en:{title:'🤖 Nuclear Assistant',sub:'Ask me anything about nuclear science and engineering',ph:'Type your question...',send:'Send',tab:'🤖 Nuclear Assistant',close:'Hide',clear:'New chat',
  hello:'Hi! I am the NE for All nuclear assistant. Ask me about atoms, radiation, reactors, nuclear energy, specialties, and jobs in Saudi Arabia and worldwide.',
  sugg:['How does a nuclear reactor work?','What is the difference between fission and fusion?','Where do nuclear engineers work?','Are medical X-rays dangerous?'],
  thinking:'Thinking...',na:'The assistant is not available in this view. Open the site from its Claude link to use it.',busy:'Too many requests right now, please try again shortly.',err:'Something went wrong, please try again.',note:'The assistant can make mistakes; verify important information.'}
};
const SYS=`You are "NE for All Assistant", the AI assistant built into the NE for All website (nuclear science for everyone, Arabic & English).
SCOPE: answer ONLY questions about nuclear science and engineering and closely related topics: atoms and nuclei, isotopes, radioactivity and decay, radiation types, doses and radiation protection, nuclear reactors and how they work, reactor types and safety, the nuclear fuel cycle, nuclear waste, fusion, nuclear medicine and other applications (industry, agriculture, space), nuclear history and accidents, nuclear weapons only at the level of history, general principles, effects, policy, treaties and non-proliferation, nuclear education, specialties, studying nuclear engineering, careers, employers and job paths in Saudi Arabia and worldwide, and how to use this website.
NEVER give technical details that would help design, build, enrich material for, or acquire a nuclear or radiological weapon.
If the user asks about anything outside this scope (e.g. cooking, sports, general programming, unrelated homework), reply politely in ONE short sentence that this assistant only answers nuclear-related questions on this specialized site, and suggest a related nuclear question instead.
STYLE: reply in the same language as the user's latest message. For Arabic use clear, simple Modern Standard Arabic (فصحى بسيطة), not dialect. Be accurate and beginner-friendly; use short paragraphs or bullet points with **bold** key terms. For calculations, show the equation, the values used and each step. Keep answers under about 220 words unless the user asks for more detail.
For time-sensitive facts (job openings, salaries, program status, current statistics) say they may have changed and point to official sources such as K.A.CARE, the Saudi Nuclear and Radiological Regulatory Commission (NRRC), the IAEA, the World Nuclear Association or university websites.
When useful, point the user to relevant sections of this website: Atoms & Radioactivity, Reactors (3D simulators with fault scenarios), Radiation (simulator and yearly dose calculator), Nuclear Energy, Nuclear Weapons (blast effects simulator), Nuclear Stories, Nuclear in Daily Life, Careers, Calculators, Quiz, Glossary.`;
let msgs=[],busy=false,sample,ready=false,open=true;
try{const sv=localStorage.getItem('ne4all-ai');open=sv?sv==='1':window.innerWidth>1100;}catch(e){open=window.innerWidth>1100;}
if(window.innerWidth<1500)open=false;
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function md(s){let h=esc(s);h=h.replace(/\[\[(.+?)\|(#[a-z]+)\]\]/g,'<a href="$2" class="ai-lk">$1</a>').replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>');
 const lines=h.split('\n');let out='',inL=false;for(const l of lines){const m=l.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)/);if(m){if(!inL){out+='<ul>';inL=true;}out+='<li>'+m[1]+'</li>';}else{if(inL){out+='</ul>';inL=false;}if(/^#{1,4}\s/.test(l))out+='<p><b>'+l.replace(/^#{1,4}\s/,'')+'</b></p>';else if(l.trim())out+='<p>'+l+'</p>';}}if(inL)out+='</ul>';return out;}
const el=()=>document.getElementById('ai');
function apply(){document.body.classList.toggle('ai-open',open);try{localStorage.setItem('ne4all-ai',open?'1':'0');}catch(e){}}
A.aiRender=function(){
 const t=TX[A.LANG],box=el();if(!box)return;
 box.innerHTML=`<button class="ai-tab" id="aiTab">${t.tab}</button>
 <div class="ai-panel"><div class="ai-head"><div><b>${t.title}</b><small>${t.sub}</small></div><div class="ai-hb"><button id="aiClear" title="${t.clear}">↺</button><button id="aiClose" title="${t.close}">✕</button></div></div>
 <div class="ai-msgs" id="aiMsgs"></div>
 <div class="ai-sugg" id="aiSugg">${t.sugg.map(s=>`<button class="chip">${s}</button>`).join('')}</div>
 <form class="ai-in" id="aiForm"><textarea id="aiQ" rows="1" placeholder="${t.ph}"></textarea><button class="btn pri" id="aiSend" type="submit">➤</button></form>
 <div class="ai-note">${t.note}</div></div>`;
 document.getElementById('aiTab').onclick=()=>{open=!open;apply();};
 document.getElementById('aiClose').onclick=()=>{open=false;apply();};
 document.getElementById('aiClear').onclick=()=>{msgs=[];draw();};
 document.querySelectorAll('#aiSugg .chip').forEach(b=>b.onclick=()=>ask(b.textContent));
 const q=document.getElementById('aiQ');
 q.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(q.value);}});
 q.addEventListener('input',()=>{q.style.height='auto';q.style.height=Math.min(120,q.scrollHeight)+'px';});
 document.getElementById('aiForm').onsubmit=e=>{e.preventDefault();ask(q.value);};
 document.getElementById('aiMsgs').addEventListener('click',e=>{if(e.target.closest('.ai-lk')&&window.innerWidth<900){open=false;apply();}});
 apply();draw();
};
function draw(){const t=TX[A.LANG],m=document.getElementById('aiMsgs');if(!m)return;
 let h=`<div class="ai-m bot">${md(t.hello)}</div>`;
 msgs.forEach(x=>{h+=`<div class="ai-m ${x.role==='user'?'me':'bot'}">${x.role==='user'?esc(x.content).replace(/\n/g,'<br>'):(x.content?md(x.content):`<span class="ai-dots">${t.thinking}</span>`)}</div>`;});
 if(ready===null)h+=`<div class="ai-m sys">${t.na}</div>`;
 m.innerHTML=h;m.scrollTop=m.scrollHeight;
 const sg=document.getElementById('aiSugg');if(sg)sg.style.display=msgs.length?'none':'flex';
 const s=document.getElementById('aiSend');if(s)s.disabled=busy||ready===null;}
async function getSample(){if(sample)return sample;if(!window.claude||!window.claude.use){return null;}try{sample=await window.claude.use('sample');}catch(e){sample=null;}return sample;}

// ---- local mode (no AI available, e.g. on Netlify): answer from the site's own content ----
const STOP=new Set(['يعمل','تعمل','يعملون','يشتغل','تشتغل','نووي','نووية','النووي','النووية','ما','ماذا','كيف','هل','لماذا','متى','اين','أين','من','في','على','عن','الى','إلى','او','أو','و','هو','هي','هذا','هذه','ذلك','التي','الذي','مع','كم','يعني','ابي','ابغى','اعرف','وش','ايش','شو','فرق','الفرق','بين','عندي','لو','اذا','إذا','كان','يكون','what','how','is','are','the','a','an','of','in','on','to','do','does','why','when','where','which','and','or','between','difference','can','i','me','about']);
function stem(w){return w.replace(/^(وال|بال|كال|فال|لل|ال|و|ب|ل)(?=..)/,'').replace(/(ات|ون|ين|ية|ه|ة)$/,'');}
function localAnswer(q){const ar=A.LANG==='ar',N=A.normTxt||(x=>x.toLowerCase());const idx=A.siteIndex?A.siteIndex():[];
 const toks=N(q).split(/[^\p{L}\p{N}]+/u).filter(t=>t.length>1&&!STOP.has(t)).map(stem).filter(t=>t.length>1);
 if(!toks.length||!idx.length)return ar?'اكتب سؤالك بكلمات أوضح، مثل: «كيف يعمل المفاعل؟» أو «ما هو عمر النصف؟».':'Try a clearer question, e.g. "How does a reactor work?"';
 const sc=idx.map(r=>{let s=0;const tn=N(r.title);toks.forEach(t=>{if(r.text.includes(t))s+=1;if(tn.includes(t))s+=1.5;});return [s*(r.w||1)*(toks.every(t=>r.text.includes(t))?1.6:1),r];}).filter(x=>x[0]>0).sort((a,b)=>b[0]-a[0]);
 if(!sc.length)return ar?'ما لقيت هذا الموضوع في الموقع. جرّب كلمة أخرى، أو تصفّح «المرجع» من القائمة.':'I could not find that on the site. Try other words, or open the Reference page.';
 const best=sc[0][1],seen=new Set(),links=[];
 for(const [,r] of sc){const k=r.v+'|'+r.title;if(seen.has(k))continue;seen.add(k);links.push(r);if(links.length>=4)break;}
 const snip=(best.sub||'').split(' · ').slice(-1)[0];
 let out=(ar?'**'+best.title+'**\n':'**'+best.title+'**\n')+(snip?snip+(snip.length>=140?'…':'')+'\n':'');
 out+=(ar?'\nتلقى التفاصيل هنا:':'\nRead more here:')+'\n'+links.map(r=>'- [['+r.title+'|#'+r.v+']] '+(A.C&&A.C.nav&&A.C.nav[r.v]&&A.C.nav[r.v]!==r.title?'('+A.C.nav[r.v]+')':'')).join('\n');
 return out;}
async function ask(text){text=(text||'').trim();if(!text||busy)return;const t=TX[A.LANG];const q=document.getElementById('aiQ');if(q){q.value='';q.style.height='auto';}
 msgs.push({role:'user',content:text});const bot={role:'assistant',content:''};msgs.push(bot);busy=true;draw();
 const s=await getSample();if(!s){ready=true;await new Promise(r=>setTimeout(r,250));bot.content=localAnswer(text);busy=false;draw();return;}
 const hist=msgs.slice(0,-1).slice(-12).filter(x=>x.content);while(hist.length&&hist[0].role!=='user')hist.shift();
 const input=hist.map((x,i)=>({role:x.role,content:i===0?SYS+'\n\n---\nUser message:\n'+x.content:x.content}));
 try{const r=await s(input,{cache:false,onText:({text})=>{bot.content=text;draw();}});bot.content=r&&r.text?r.text:bot.content;}
 catch(e){const code=e&&e.code;if(code==='not_granted'){ready=null;bot.content='';msgs.pop();}else bot.content=code==='rate_limited'?t.busy:t.err;}
 busy=false;draw();}
})(APP);
