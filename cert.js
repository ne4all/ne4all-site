/* ===== QUIZ CERTIFICATE (canvas -> JPEG -> minimal PDF, no libraries) ===== */
(function(A){
const T={
 ar:{box:'🎓 مبروك! تستحق شهادة إتمام',hint:'اكتب اسمك كما تريد أن يظهر في الشهادة:',ph:'الاسم الكامل',pdf:'⬇️ تحميل الشهادة PDF',png:'🖼️ تحميل كصورة',need:'اكتب اسمك أولًا',
  low:'للحصول على شهادة الإتمام تحتاج 70٪ أو أكثر. أعد المحاولة!',
  title:'شهادة إتمام',sub:'CERTIFICATE OF COMPLETION',certify:'تشهد منصة NE for All · النووي للجميع بأن',
  done:'قد أتمّ بنجاح اختبار «أساسيات العلوم النووية»',score:'بنتيجة {s} من {t} ({p}٪)',grade:['جيد جدًا','ممتاز','ممتاز مع مرتبة الشرف'],gl:'التقدير',
  date:'التاريخ',id:'رقم الشهادة',sign:'عبدالمجيد عبدالله آل جحني',signR:'مؤسس المنصة',site:'NE for All · منصة تعليمية مستقلة للعلوم النووية',file:'NE4All-Certificate'},
 en:{box:'🎓 Congratulations! You earned a certificate',hint:'Type your name as it should appear on the certificate:',ph:'Full name',pdf:'⬇️ Download PDF certificate',png:'🖼️ Download as image',need:'Please enter your name first',
  low:'You need 70% or more to earn the completion certificate. Try again!',
  title:'Certificate of Completion',sub:'شهادة إتمام',certify:'NE for All certifies that',
  done:'has successfully completed the “Nuclear Science Fundamentals” quiz',score:'with a score of {s} out of {t} ({p}%)',grade:['Very good','Excellent','Excellent with honors'],gl:'Grade',
  date:'Date',id:'Certificate No.',sign:'Abdulmajeed Abdullah Al Jahni',signR:'Founder',site:'NE for All · An independent educational platform for nuclear science',file:'NE4All-Certificate'}
};
const W=2339,H=1654;// A4 landscape @200dpi
function draw(name,s,t,lang){
 const L=T[lang],ar=lang==='ar',cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d');
 const F=ar?'IBM Plex Sans Arabic, "Segoe UI", Tahoma, sans-serif':'Inter, "Segoe UI", Arial, sans-serif';
 const P='#5b21b6',P2='#7c3aed',GOLD='#b8860b',INK='#1f1535',MUT='#5b5570';
 g.fillStyle='#ffffff';g.fillRect(0,0,W,H);
 // subtle watermark atom
 g.save();g.translate(W/2,H/2+40);g.globalAlpha=.045;g.strokeStyle=P2;g.lineWidth=14;
 for(const r of [0,60,-60]){g.save();g.rotate(r*Math.PI/180);g.beginPath();g.ellipse(0,0,560,200,0,0,Math.PI*2);g.stroke();g.restore();}
 g.fillStyle=P2;g.beginPath();g.arc(0,0,70,0,Math.PI*2);g.fill();g.restore();
 // borders
 const grd=g.createLinearGradient(0,0,W,H);grd.addColorStop(0,'#22d3ee');grd.addColorStop(.5,'#7c3aed');grd.addColorStop(1,'#ec4899');
 g.strokeStyle=grd;g.lineWidth=26;g.strokeRect(50,50,W-100,H-100);
 g.strokeStyle=GOLD;g.lineWidth=4;g.strokeRect(92,92,W-184,H-184);
 g.strokeStyle='rgba(184,134,11,.45)';g.lineWidth=2;g.strokeRect(108,108,W-216,H-216);
 // corner ornaments
 g.fillStyle=GOLD;for(const [x,y] of [[108,108],[W-108,108],[108,H-108],[W-108,H-108]]){g.save();g.translate(x,y);g.rotate(Math.PI/4);g.fillRect(-14,-14,28,28);g.restore();}
 // logo
 const lx=W/2,ly=250;g.save();g.translate(lx,ly);g.lineWidth=7;g.strokeStyle=grd;
 const lg=g.createLinearGradient(-90,0,90,0);lg.addColorStop(0,'#22d3ee');lg.addColorStop(.5,'#a855f7');lg.addColorStop(1,'#ec4899');g.strokeStyle=lg;
 for(const r of [0,60,-60]){g.save();g.rotate(r*Math.PI/180);g.beginPath();g.ellipse(0,0,88,34,0,0,Math.PI*2);g.stroke();g.restore();}
 g.fillStyle='#ec4899';g.beginPath();g.arc(0,0,17,0,Math.PI*2);g.fill();g.restore();
 g.textAlign='center';g.textBaseline='alphabetic';g.direction=ar?'rtl':'ltr';
 g.fillStyle=P;g.font=`800 52px Inter, Arial, sans-serif`;g.fillText('NE for All',W/2,365);
 // title
 g.fillStyle=INK;g.font=`800 ${ar?118:104}px ${F}`;g.fillText(L.title,W/2,ar?530:520);
 g.fillStyle=GOLD;g.font=`600 ${ar?40:44}px ${ar?'Inter, Arial':'IBM Plex Sans Arabic, Tahoma'}, sans-serif`;g.fillText(L.sub,W/2,ar?600:590);
 // divider
 g.strokeStyle=GOLD;g.lineWidth=3;g.beginPath();g.moveTo(W/2-330,640);g.lineTo(W/2-30,640);g.moveTo(W/2+30,640);g.lineTo(W/2+330,640);g.stroke();
 g.fillStyle=GOLD;g.save();g.translate(W/2,640);g.rotate(Math.PI/4);g.fillRect(-10,-10,20,20);g.restore();
 g.fillStyle=MUT;g.font=`500 50px ${F}`;g.fillText(L.certify,W/2,750);
 // name (auto-fit)
 let fs=128;const nameF=/[؀-ۿ]/.test(name)?'IBM Plex Sans Arabic, Tahoma, sans-serif':'Inter, Arial, sans-serif';
 do{g.font=`800 ${fs}px ${nameF}`;fs-=4;}while(g.measureText(name).width>W-560&&fs>50);
 g.direction=/[؀-ۿ]/.test(name)?'rtl':'ltr';g.fillStyle=P;g.fillText(name,W/2,905);g.direction=ar?'rtl':'ltr';
 const nw=Math.min(g.measureText(name).width+160,W-460);g.strokeStyle='rgba(91,33,182,.35)';g.lineWidth=3;g.beginPath();g.moveTo(W/2-nw/2,945);g.lineTo(W/2+nw/2,945);g.stroke();
 const p=Math.round(s/t*100);
 g.fillStyle=INK;g.font=`500 54px ${F}`;g.fillText(L.done,W/2,1050);
 g.fillStyle=MUT;g.font=`600 48px ${F}`;g.fillText(A.tpl(L.score,{s,t,p}),W/2,1130);
 const gi=p>=95?2:p>=85?1:0;g.fillStyle=P2;g.font=`700 46px ${F}`;g.fillText(`${L.gl}: ${L.grade[gi]}`,W/2,1205);
 // footer: date | seal | signature
 const d=new Date(),ds=d.toLocaleDateString(ar?'ar-SA-u-ca-gregory-nu-latn':'en-GB',{day:'numeric',month:'long',year:'numeric'});
 const id='NE4A-'+d.getFullYear()+'-'+(Math.abs([...name].reduce((h,c)=>(h*31+c.charCodeAt(0))|0,7))%100000).toString().padStart(5,'0')+'-'+String(p).padStart(3,'0');
 const left=430,right=W-430,fy=1400;
 const col=(x,top,bot)=>{g.strokeStyle=INK;g.lineWidth=2.5;g.beginPath();g.moveTo(x-230,fy);g.lineTo(x+230,fy);g.stroke();g.fillStyle=INK;g.font=`700 40px ${F}`;g.fillText(top,x,fy-24);g.fillStyle=MUT;g.font=`500 34px ${F}`;g.fillText(bot,x,fy+50);};
 const [dx,sx]=ar?[right,left]:[left,right];
 col(dx,ds,L.date);
 // signature
 g.fillStyle=P;g.font=`italic 600 46px "Segoe Script","Brush Script MT",cursive`;g.fillText('A. Al Jahni',sx,fy-80);
 col(sx,L.sign,L.signR);
 // seal
 g.save();g.translate(W/2,fy-70);g.scale(.84,.84);
 const sg=g.createRadialGradient(0,0,20,0,0,130);sg.addColorStop(0,'#fde68a');sg.addColorStop(1,'#b8860b');
 g.fillStyle=sg;g.beginPath();for(let i=0;i<48;i++){const a=i/48*Math.PI*2,r=i%2?122:136;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.fill();
 g.strokeStyle='#fff';g.lineWidth=4;g.beginPath();g.arc(0,0,98,0,Math.PI*2);g.stroke();
 g.fillStyle='#fff';g.font='800 40px Inter, Arial, sans-serif';g.direction='ltr';g.fillText('NE',0,-6);g.font='700 22px Inter, Arial, sans-serif';g.fillText('FOR ALL',0,26);g.font='600 18px Inter, Arial';g.fillText('★ '+d.getFullYear()+' ★',0,56);
 g.restore();g.direction=ar?'rtl':'ltr';
 g.fillStyle=MUT;g.font=`500 30px ${F}`;g.fillText(`${L.id}: `+'⁦'+id+'⁩',W/2,1500);
 g.font=`500 28px ${F}`;g.fillStyle='#8a84a0';g.fillText(L.site,W/2,1545);
 return cv;
}
function b64ToBytes(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u;}
function pdfFromJpeg(jpg,iw,ih){
 const pw=842,ph=595,enc=new TextEncoder(),parts=[],offs=[];let len=0;
 const push=x=>{const b=typeof x==='string'?enc.encode(x):x;parts.push(b);len+=b.length;};
 const obj=(n,body)=>{offs[n]=len;push(`${n} 0 obj\n`);body();push('\nendobj\n');};
 push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
 obj(1,()=>push('<< /Type /Catalog /Pages 2 0 R >>'));
 obj(2,()=>push('<< /Type /Pages /Kids [3 0 R] /Count 1 >>'));
 obj(3,()=>push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 5 0 R >> >> /Contents 4 0 R >>`));
 const cs=`q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
 obj(4,()=>push(`<< /Length ${cs.length} >>\nstream\n${cs}\nendstream`));
 obj(5,()=>{push(`<< /Type /XObject /Subtype /Image /Width ${iw} /Height ${ih} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);push(jpg);push('\nendstream');});
 const xref=len;let x=`xref\n0 6\n0000000000 65535 f \n`;for(let i=1;i<=5;i++)x+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
 push(x+`trailer\n<< /Size 6 /Root 1 0 R /Info << /Title (NE for All Certificate) /Producer (NE for All) >> >>\nstartxref\n${xref}\n%%EOF`);
 return new Blob(parts,{type:'application/pdf'});
}
async function save(blob,name){try{if(window.claude&&window.claude.use){const d=await window.claude.use('downloads');if(d){await d.save({filename:name,data:blob});return;}}}catch(e){if(e&&e.code==='declined')return;}const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(u);},4000);}
A.certHTML=function(s,t){const L=T[A.LANG];if(s/t<0.7)return `<p class="cert-low">${L.low}</p>`;
 return `<div class="cert-box"><h3>${L.box}</h3><p>${L.hint}</p><input id="certName" maxlength="60" placeholder="${L.ph}" autocomplete="name"><div class="cert-btns"><button class="btn pri" id="certPdf">${L.pdf}</button><button class="btn" id="certPng">${L.png}</button></div><div id="certPrev"></div></div>`;};
A.certInit=function(s,t){const L=T[A.LANG],inp=document.getElementById('certName');if(!inp)return;
 const go=async kind=>{const name=inp.value.trim().replace(/\s+/g,' ');if(!name){inp.placeholder=L.need;inp.classList.add('err');inp.focus();return;}inp.classList.remove('err');
  try{if(document.fonts&&document.fonts.load)await Promise.race([Promise.all([document.fonts.load('800 60px IBM Plex Sans Arabic'),document.fonts.load('500 40px IBM Plex Sans Arabic'),document.fonts.load('800 60px Inter')]),new Promise(r=>setTimeout(r,1500))]);}catch(e){}
  const cv=draw(name,s,t,A.LANG),url=cv.toDataURL('image/jpeg',0.93);
  document.getElementById('certPrev').innerHTML=`<img src="${url}" alt="certificate">`;
  const fn=L.file+'-'+name.replace(/[^\w؀-ۿ]+/g,'_');
  if(kind==='pdf')save(pdfFromJpeg(b64ToBytes(url.split(',')[1]),W,H),fn+'.pdf');
  else cv.toBlob(b=>save(b,fn+'.png'),'image/png');};
 document.getElementById('certPdf').onclick=()=>go('pdf');document.getElementById('certPng').onclick=()=>go('png');
 inp.onkeydown=e=>{if(e.key==='Enter')go('pdf');};};
A._certDraw=draw;A._certPdf=pdfFromJpeg;
})(APP);
