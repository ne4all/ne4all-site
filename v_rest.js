/* ===== STORIES / LIFE / CAREERS ===== */
(function(A){
A.V.stories={html(C){const S=C.stories;return `<section><div class="wrap">${A.sh(S.tag,S.title,S.sub)}${S.list.map((s,i)=>`<div class="story-card" style="--sc:${s.c}"><div class="story-head"><div class="story-ic">${s.ic}</div><div><div class="story-yr">${s.y} · ${s.p}</div><h3>${i+1}. ${s.t}</h3></div></div><div class="story-body">${s.x.map((x,j)=>`<div><b>${S.h[j]}</b><p>${x}</p></div>`).join('')}</div></div>`).join('')}${''}</div></section>`;},
 init(){document.querySelectorAll('.story-body p').forEach(p=>{p.innerHTML=p.innerHTML.replace(/(محاكي المفاعلات|reactor simulators)/,'<a href="#reactors" style="color:#67e8f9;text-decoration:underline">$1</a>');});}};
A.V.life={html(C){const L=C.life;return `<section><div class="wrap">${A.sh(L.tag,L.title,L.sub)}<div class="grid">${L.cards.map(c=>A.card(c[0],c[1],'',c[2])).join('')}</div>${A.sh('',L.arTitle,'','margin-top:46px')}<div class="grid">${L.ar.map(c=>`<div class="card"><h3>${c[0]}</h3><p>${c[1]}</p></div>`).join('')}</div></div></section>`;}};
A.V.careers={html(C){const K=C.careers;return `<section><div class="wrap">${A.sh(K.tag,K.title,K.sub)}<div class="grid">${K.tracks.map(t=>A.card(t[0],t[1],t[2],t[3],`<div class="track"><div class="meta">${t[4].map(m=>'<span>'+m+'</span>').join('')}</div></div>`)).join('')}</div>
 <div class="panel" style="margin-top:26px"><h3 style="margin-bottom:10px">${K.stTitle}</h3><div class="grid">${K.study.map(s=>`<div class="card"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></div>
 <div class="panel" style="margin-top:20px"><h3 style="margin-bottom:10px">${K.wkTitle}</h3><div class="grid">${K.work.map(s=>`<div class="card"><h3>${s[0]}</h3><p>${s[1]}</p></div>`).join('')}</div></div>${A.jobsHTML?A.jobsHTML(C):''}</div></section>`;}};

/* ===== TOOLS ===== */
const U={s:1,min:60,h:3600,d:86400,y:31557600};
const ISO=[['I-131',8.02,'d',130.906],['Tc-99m',6.01,'h',98.906],['F-18',109.77,'min',18.0009],['Co-60',5.271,'y',59.9338],['Cs-137',30.08,'y',136.907],['Sr-90',28.79,'y',89.9077],['H-3',12.32,'y',3.01605],['Rn-222',3.8235,'d',222.0176],['Ra-226',1600,'y',226.0254],['C-14',5730,'y',14.0032],['Am-241',432.2,'y',241.0568],['Pu-239',24110,'y',239.0522],['U-235',7.04e8,'y',235.0439],['U-238',4.468e9,'y',238.0508],['custom',10,'d',100]];
const MATS=[['U',19.1,238.03],['UO2',10.97,270.03],['H2O',1.0,18.015],['Pb',11.35,207.2],['Fe',7.874,55.845],['C',1.7,12.011],['Zr',6.52,91.224]];
const NUCS=[['H-2',1,1,2.014102],['He-4',2,2,4.002603],['C-12',6,6,12.0],['O-16',8,8,15.994915],['Fe-56',26,30,55.934936],['U-235',92,143,235.04393],['U-238',92,146,238.050788]];
A.V.tools={
 html(C){const T=C.tools,UN=C.atoms.units,P=T.pr;
  const uopt=Object.keys(U).map(k=>`<option value="${k}">${UN[k]}</option>`).join('');
  return `<section><div class="wrap">${A.sh(T.tag,T.title,T.sub)}
  <div class="panel"><div class="tabs" id="ctabs">${T.tabs.map((t,i)=>`<button class="tab${i?'':' on'}" data-t="t${i+1}">${t}</button>`).join('')}</div>
   <div class="calc"><div>
    <div class="f" id="fIso"><label>${T.iso}</label><select id="iso">${ISO.map((r,i)=>`<option value="${i}">${r[0]==='custom'?T.custom:T.isoNames[r[0]]+' ('+r[0]+')'}</option>`).join('')}</select></div>
    <div class="f" id="fHL"><label>${T.hl}</label><div class="two"><input type="number" id="hl" step="any"><select id="hlU">${uopt}</select></div></div>
    <div class="f" id="fN0"><label>${T.n0}</label><input type="number" id="n0" value="100" step="any"></div>
    <div class="f hide" id="fN"><label>${T.n}</label><input type="number" id="n" value="25" step="any"></div>
    <div class="f" id="fT"><label>${T.t}</label><div class="two"><input type="number" id="t" value="24" step="any"><select id="tU">${uopt}</select></div></div>
    <div class="f hide" id="fM"><label>${T.m}</label><input type="number" id="m" value="1" step="any"></div>
    <div class="f hide" id="fMM"><label>${T.M}</label><input type="number" id="mm" step="any"></div>
    <div class="f hide" id="fMat"><label>${T.mat}</label><select id="mat">${MATS.map((m,i)=>`<option value="${i}">${T.mats[m[0]]}</option>`).join('')}</select></div>
    <div class="f hide" id="fRho"><label>${T.rho}</label><input type="number" id="rho" step="any"></div>
    <div class="f hide" id="fNuc"><label>${T.nuc}</label><select id="nucS">${NUCS.map((n,i)=>`<option value="${i}"${n[0]==='Fe-56'?' selected':''}>${n[0]}</option>`).join('')}</select></div>
    <div class="f hide" id="fZ"><label>${T.Z}</label><input type="number" id="zz" step="1"></div>
    <div class="f hide" id="fNN"><label>${T.N}</label><input type="number" id="nn" step="1"></div>
    <div class="f hide" id="fMA"><label>${T.mA}</label><input type="number" id="ma" step="any"></div>
   </div><div><div class="result"><small style="color:var(--mut)" id="rLabel">${T.res}</small><br><span class="big" id="rVal">—</span><div class="steps" id="rSteps"></div></div><canvas class="dcanvas" id="decayCanvas"></canvas></div></div></div>
  <div class="panel" style="margin-top:22px"><h3 style="margin-bottom:14px">${T.prTitle}</h3><div class="calc"><div>
    <div class="f"><label>${P.d1}</label><input type="number" id="p_d1" value="100" step="any"></div>
    <div class="f"><label>${P.r1}</label><input type="number" id="p_r1" value="1" step="any"></div>
    <div class="f"><label>${P.r2}</label><input type="number" id="p_r2" value="3" step="any"></div>
    <div class="f"><label>${P.src}</label><select id="p_src"><option value="co">${T.isoNames['Co-60']} (Co-60)</option><option value="cs">${T.isoNames['Cs-137']} (Cs-137)</option></select></div>
    <div class="f"><label>${P.mat}</label><select id="p_mat"><option value="pb">${P.mats.pb}</option><option value="fe">${P.mats.fe}</option><option value="con">${P.mats.con}</option><option value="none">${P.none}</option></select></div>
    <div class="f"><label>${P.x}</label><input type="number" id="p_x" value="2" step="any"></div>
    <div class="f"><label>${P.t}</label><input type="number" id="p_t" value="0.5" step="any"></div>
   </div><div><div class="result"><small style="color:var(--mut)">${P.res}</small><br><span class="big" id="p_res">—</span><div class="steps" id="p_steps"></div></div><p class="note">${P.note}</p></div></div></div>
  <div class="panel" style="margin-top:22px"><h3 style="margin-bottom:14px">${T.ucTitle}</h3><div class="calc"><div><div class="f"><label>${T.uc.v}</label><input type="number" id="u_v" value="1" step="any"></div><div class="f"><label>${T.uc.from}</label><select id="u_from"></select></div></div><div class="result" id="u_out"></div></div></div>
  </div></section>`;},
 init(C){
  const T=C.tools,UN=C.atoms.units,$=id=>document.getElementById(id),f=A.fmt,LN2=Math.LN2,NA=6.02214076e23;
  let mode='t1',curve=null;
  const FIELDS={t1:['fIso','fHL','fN0','fT'],t2:['fIso','fHL','fN0','fN'],t3:['fN0','fN','fT'],t4:['fIso','fHL','fM','fMM'],t5:['fMat','fRho','fMM'],t6:['fNuc','fZ','fNN','fMA']};
  const ALL=['fIso','fHL','fN0','fN','fT','fM','fMM','fMat','fRho','fNuc','fZ','fNN','fMA'];
  function pickIso(){const r=ISO[+$('iso').value];$('hl').value=r[1];$('hlU').value=r[2];$('mm').value=r[3];$('tU').value=r[2];calc();}
  function pickMat(){const m=MATS[+$('mat').value];$('rho').value=m[1];$('mm').value=m[2];calc();}
  function pickNuc(){const n=NUCS[+$('nucS').value];$('zz').value=n[1];$('nn').value=n[2];$('ma').value=n[3];calc();}
  $('iso').onchange=pickIso;$('mat').onchange=pickMat;$('nucS').onchange=pickNuc;
  document.querySelectorAll('#ctabs .tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('#ctabs .tab').forEach(x=>x.classList.toggle('on',x===b));mode=b.dataset.t;ALL.forEach(id=>$(id).classList.toggle('hide',!FIELDS[mode].includes(id)));
   if(mode==='t5')pickMat();else if(mode==='t6')pickNuc();else if(mode==='t4')pickIso();else calc();});
  ['hl','hlU','n0','n','t','tU','m','mm','rho','zz','nn','ma'].forEach(id=>$(id).addEventListener('input',calc));
  const c=s=>`<code>${s}</code>`,SEP=A.LANG==='ar'?'، ':', ';
  function calc(){
   const Tv=+$('hl').value,Tu=$('hlU').value,n0=+$('n0').value,n=+$('n').value,t=+$('t').value,tu=$('tU').value;
   let lab=T.res,val='—',st=[];curve=null;
   if(mode==='t1'){const tt=t*U[tu]/U[Tu],ratio=tt/Tv,fr=Math.pow(.5,ratio),N=n0*fr;lab=T.remaining;val=f(N);
    st=[`${T.eqn}: ${c('N = N₀ × (½)^(t / T½)')}`,`${T.vals}: ${c('N₀ = '+f(n0))}${SEP}${c('T½ = '+f(Tv)+' '+UN[Tu])}${SEP}${c('t = '+f(t)+' '+UN[tu])}`,tu!==Tu?`${T.unify}: ${c('t = '+f(t)+' '+UN[tu]+' = '+f(tt)+' '+UN[Tu])}`:T.same,`${T.nhl}: ${c('t / T½ = '+f(tt)+' / '+f(Tv)+' = '+f(ratio))}`,`${T.frac}: ${c('(½)^'+f(ratio)+' = '+f(fr))} (${f(fr*100,2)}%)`,`${T.res}: ${c('N = '+f(n0)+' × '+f(fr)+' = '+f(N))}`];curve={m:ratio};}
   else if(mode==='t2'){if(n>0&&n0>0){const r=n0/n,lg=Math.log2(r),tt=lg*Tv;lab=T.elapsed;val=f(tt)+' '+UN[Tu];
     st=[`${T.eqn}: ${c('t = T½ × log₂(N₀ / N)')}`,`${T.vals}: ${c('N₀ = '+f(n0))}${SEP}${c('N = '+f(n))}${SEP}${c('T½ = '+f(Tv)+' '+UN[Tu])}`,`${T.ratio}: ${c('N₀ / N = '+f(r))}`,c('log₂('+f(r)+') = ln('+f(r)+') / ln2 = '+f(Math.log(r))+' / 0.6931 = '+f(lg)),`${T.res}: ${c('t = '+f(Tv)+' × '+f(lg)+' = '+f(tt)+' '+UN[Tu])}`];curve={m:lg};}else st=[T.posErr];}
   else if(mode==='t3'){if(n>0&&n0>n){const r=n0/n,lnr=Math.log(r),T2=t*LN2/lnr;lab=T.half;val=f(T2)+' '+UN[tu];
     st=[`${T.eqn}: ${c('T½ = (t × ln2) / ln(N₀ / N)')}`,`${T.vals}: ${c('N₀ = '+f(n0))}${SEP}${c('N = '+f(n))}${SEP}${c('t = '+f(t)+' '+UN[tu])}`,`${T.num}: ${c('t × ln2 = '+f(t)+' × 0.6931 = '+f(t*LN2))}`,`${T.den}: ${c('ln('+f(r)+') = '+f(lnr))}`,`${T.res}: ${c('T½ = '+f(t*LN2)+' / '+f(lnr)+' = '+f(T2)+' '+UN[tu])}`,`${T.lam}: ${c('λ = ln2 / T½ = '+f(LN2/T2))} ${T.per} ${UN[tu]}`];curve={m:t/T2};}else st=[T.gtErr];}
   else if(mode==='t4'){const m=+$('m').value,M=+$('mm').value,Ts=Tv*U[Tu],N=m*NA/M,lam=LN2/Ts,Aa=lam*N;lab=T.act;val=f(Aa)+' Bq';
    st=[`${T.eqn}: ${c('A = λN')}`,`${c('N = (m × Nₐ) / M')}`,`${T.vals}: ${c('m = '+f(m)+' g')}${SEP}${c('Nₐ = 6.022 × 10^23 mol⁻¹')}${SEP}${c('M = '+f(M)+' g/mol')}`,`${c('N = ('+f(m)+' × 6.022×10^23) / '+f(M)+' = '+f(N))} ${T.nuclei}`,`${T.toSec}: ${c(f(Tv)+' '+UN[Tu]+' = '+f(Ts)+' s')}`,c('λ = ln2 / T½ = 0.6931 / '+f(Ts)+' = '+f(lam)+' s⁻¹'),c('A = '+f(lam)+' × '+f(N)+' = '+f(Aa)+' Bq'),`${T.inCi}: ${c('A = '+f(Aa)+' / (3.7×10^10) = '+f(Aa/3.7e10)+' Ci')}`];}
   else if(mode==='t5'){const rho=+$('rho').value,M=+$('mm').value,N=rho*NA/M;lab=T.dens;val=f(N)+' '+T.atoms;
    st=[`${T.eqn}: ${c('N = (ρ × Nₐ) / M')}`,`${T.vals}: ${c('ρ = '+f(rho)+' g/cm³')}${SEP}${c('Nₐ = 6.022 × 10^23 mol⁻¹')}${SEP}${c('M = '+f(M)+' g/mol')}`,c('N = ('+f(rho)+' × 6.022×10^23) / '+f(M)),`${T.res}: ${c('N = '+f(N)+' cm⁻³')}`,c('N = '+f(N*1e-24)+' (barn·cm)⁻¹')];}
   else if(mode==='t6'){const Z=+$('zz').value,Nn=+$('nn').value,Mx=+$('ma').value,mH=1.007825,mn=1.008665;const dm=Z*mH+Nn*mn-Mx,BE=dm*931.494,Am=Z+Nn;lab=T.be;val=f(BE,3)+' MeV';
    st=[`${T.md}: ${c('Δm = Z·m(¹H) + N·mₙ − M')}`,`${T.vals}: ${c('Z = '+Z)}${SEP}${c('N = '+Nn)}${SEP}${c('m(¹H) = 1.007825 u')}${SEP}${c('mₙ = 1.008665 u')}${SEP}${c('M = '+f(Mx,6)+' u')}`,c('Δm = '+Z+'×1.007825 + '+Nn+'×1.008665 − '+f(Mx,6)+' = '+f(dm,6)+' u'),`${T.eqn}: ${c('BE = Δm × 931.494 MeV/u')}`,`${T.res}: ${c('BE = '+f(dm,6)+' × 931.494 = '+f(BE,3)+' MeV')}`,`${T.bea}: ${c('BE / A = '+f(BE,3)+' / '+Am+' = '+f(BE/Am,3)+' MeV')}`];}
   $('rLabel').textContent=lab;$('rVal').textContent=val;$('rSteps').innerHTML=st.map(s=>'<div>'+s+'</div>').join('');$('decayCanvas').style.display=curve?'block':'none';draw();
  }
  function draw(){const cv=$('decayCanvas');if(!curve||!A.visible(cv))return;const {ctx,w,h}=A.fitCanvas(cv);ctx.clearRect(0,0,w,h);
   const pad=28,maxH=Math.max(5,Math.ceil((curve.m||0)+1));ctx.strokeStyle=A.CV().grid;ctx.fillStyle=A.CV().mut;ctx.font='10px Inter, sans-serif';ctx.textAlign='center';ctx.lineWidth=1;
   const X=k=>pad+(k/maxH)*(w-pad*1.5),Yp=v=>10+(1-v)*(h-pad-10);
   for(let i=0;i<=maxH;i++){ctx.beginPath();ctx.moveTo(X(i),10);ctx.lineTo(X(i),h-pad);ctx.stroke();ctx.fillText(i+'T½',X(i),h-10);}
   ctx.textAlign='left';[1,.5,.25].forEach(v=>{ctx.beginPath();ctx.moveTo(pad,Yp(v));ctx.lineTo(w,Yp(v));ctx.stroke();ctx.fillText(Math.round(v*100)+'%',2,Yp(v)+3);});
   const lg=ctx.createLinearGradient(pad,0,w,0);lg.addColorStop(0,'#22d3ee');lg.addColorStop(.5,'#a855f7');lg.addColorStop(1,'#ec4899');ctx.strokeStyle=lg;ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=200;i++){const k=i/200*maxH;i?ctx.lineTo(X(k),Yp(Math.pow(.5,k))):ctx.moveTo(X(k),Yp(1));}ctx.stroke();
   if(isFinite(curve.m)){ctx.fillStyle='#fbbf24';ctx.shadowColor='#fbbf24';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(X(curve.m),Yp(Math.pow(.5,curve.m)),6,0,7);ctx.fill();ctx.shadowBlur=0;}}
  pickIso();
  // protection
  const HVL={co:{pb:1.2,fe:2.1,con:6.2},cs:{pb:0.65,fe:1.6,con:4.9}},P=T.pr;
  function pc(){const d1=+$('p_d1').value,r1=+$('p_r1').value,r2=+$('p_r2').value,src=$('p_src').value,mat=$('p_mat').value,x=+$('p_x').value,t=+$('p_t').value;
   const d2=d1*Math.pow(r1/r2,2);let st=[`<b>${P.s1}</b> ${c('Ḋ₂ = Ḋ₁ × (r₁/r₂)² = '+f(d1)+' × ('+f(r1)+'/'+f(r2)+')² = '+f(d2,3)+' µSv/h')}`];let d3=d2;
   if(mat!=='none'){const hv=HVL[src][mat],nh=x/hv,fr=Math.pow(.5,nh);d3=d2*fr;st.push(`<b>${P.s2}</b> ${P.hvlFor}${P.mats[mat]} ≈ ${c(hv+' cm')}${SEP}${P.layers} ${c('x/HVL = '+f(x)+'/'+hv+' = '+f(nh,3))}`);st.push(`${c('Ḋ₃ = '+f(d2,3)+' × (½)^'+f(nh,3)+' = '+f(d3,3)+' µSv/h')} (${P.drop} ${f((1-fr)*100,1)}%)`);}else st.push(`<b>${P.s2}</b> ${P.noneS}`);
   const D=d3*t;st.push(`<b>${P.s3}</b> ${c('D = Ḋ × t = '+f(d3,3)+' × '+f(t)+' = '+f(D,3)+' µSv')}`);st.push(A.tpl(P.saved,{v:f(d1*t-D,3),r:f(r1)}));
   $('p_res').textContent=f(D,3)+' µSv';$('p_steps').innerHTML=st.map(s=>'<div>'+s+'</div>').join('');}
  ['p_d1','p_r1','p_r2','p_src','p_mat','p_x','p_t'].forEach(id=>$(id).addEventListener('input',pc));pc();
  // units
  const UNITS={'Bq':['act',1],'kBq':['act',1e3],'MBq':['act',1e6],'GBq':['act',1e9],'Ci':['act',3.7e10],'mCi':['act',3.7e7],'µCi':['act',3.7e4],'Sv':['dose',1],'mSv':['dose',1e-3],'µSv':['dose',1e-6],'rem':['dose',1e-2],'mrem':['dose',1e-5],'Gy':['abs',1],'mGy':['abs',1e-3],'rad':['abs',1e-2],'eV':['en',1.602176634e-19],'keV':['en',1.602176634e-16],'MeV':['en',1.602176634e-13],'J':['en',1]};
  const uf=$('u_from');Object.keys(UNITS).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=k+' · '+T.uc.g[UNITS[k][0]];uf.appendChild(o);});
  function uc(){const v=+$('u_v').value,fu=uf.value,[g,fac]=UNITS[fu],base=v*fac;$('u_out').innerHTML='<small style="color:var(--mut)">'+T.uc.g[g]+'</small><div class="steps">'+Object.keys(UNITS).filter(k=>UNITS[k][0]===g&&k!==fu).map(k=>`<div>${c(f(v)+' '+fu+' = '+f(base/UNITS[k][1])+' '+k)}</div>`).join('')+'</div>';}
  $('u_v').addEventListener('input',uc);uf.addEventListener('input',uc);uc();
  let lw=0;return {frame(){const cv=$('decayCanvas');if(cv&&cv.getBoundingClientRect().width!==lw){lw=cv.getBoundingClientRect().width;draw();}}};
 }
};

/* ===== QUIZ ===== */
A.V.quiz={
 html(C){const Q=C.quiz;return `<section><div class="wrap">${A.sh(Q.tag,Q.title,Q.sub)}<div class="panel qz" id="qz"></div></div></section>`;},
 init(C){const Q=C.quiz,el=document.getElementById('qz');let i=0,score=0,ans=false;
  function render(){if(i>=Q.items.length){const p=score/Q.items.length,m=p<0.4?0:p<0.7?1:p<0.95?2:3;el.innerHTML=`<div style="text-align:center"><small style="color:var(--mut)">${Q.result}</small><div class="score gt">${score} / ${Q.items.length}</div><p style="font-size:1.1rem;margin:10px 0 18px">${Q.msgs[m]}</p><button class="btn pri" id="qAgain">${Q.again}</button>${A.certHTML?A.certHTML(score,Q.items.length):''}</div>`;document.getElementById('qAgain').onclick=()=>{i=0;score=0;render();};if(A.certInit)A.certInit(score,Q.items.length);return;}
   const it=Q.items[i];ans=false;el.innerHTML=`<div class="qprog"><i style="width:${i/Q.items.length*100}%"></i></div><small style="color:var(--mut)">${Q.q} ${i+1} ${Q.of} ${Q.items.length}</small><div class="q">${it[0]}</div>${it[1].map((o,j)=>`<button class="opt" data-j="${j}">${o}</button>`).join('')}<div id="qExp"></div>`;
   el.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{if(ans)return;ans=true;const j=+b.dataset.j;if(j===it[2])score++;el.querySelectorAll('.opt').forEach(x=>{const k=+x.dataset.j;if(k===it[2])x.classList.add('ok');else if(k===j)x.classList.add('bad');});
    document.getElementById('qExp').innerHTML=`<div class="exp">${j===it[2]?'✅':'❌'} ${it[3]}</div><button class="btn pri" id="qNext" style="margin-top:12px">${Q.next}</button>`;document.getElementById('qNext').onclick=()=>{i++;render();};});}
  render();}
};

/* ===== GLOSSARY ===== */
A.V.glossary={
 html(C){const G=C.glossary;return `<section><div class="wrap">${A.sh(G.tag,G.title,G.sub)}<input type="search" id="glq" placeholder="${G.search}"><div class="gl" id="glList"></div></div></section>`;},
 init(C){const G=C.glossary,ar=A.LANG==='ar',el=document.getElementById('glList'),q=document.getElementById('glq');
  function render(){const s=q.value.trim().toLowerCase();const rows=GLOSSARY.filter(g=>!s||g.join(' ').toLowerCase().includes(s));
   el.innerHTML=rows.map(g=>`<div class="card"><h4>${ar?g[0]:g[1]}${ar?` <span class="en2">· ${g[1]}</span>`:''}</h4><p>${ar?g[2]:g[3]}</p></div>`).join('')||`<p style="color:var(--mut)">${G.none}</p>`;}
  q.addEventListener('input',render);render();}
};
})(APP);
