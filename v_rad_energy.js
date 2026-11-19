/* ===== RADIATION ===== */
(function(A){
A.V.radiation={
 html(C){const R=C.radiation;
  const dq=R.dcQ;
  return `<section><div class="wrap">${A.sh(R.tag,R.title,R.sub)}${A.simple(R.simple)}
  <div class="panel" style="margin-top:20px"><h3 style="margin-bottom:4px">${R.simTitle}</h3><p class="note" style="margin:0 0 14px">${R.simHint}</p>
   <div class="radsim"><div><div class="field" id="radField" style="aspect-ratio:16/10"><canvas id="radCanvas"></canvas><div class="load3d">${C.load3d}</div></div><div class="hint3d">${C.hint3d}</div><div class="ctrl" style="margin-top:12px"><label>${R.dist} <span id="rDist">1.00 m</span></label><input type="range" id="rSlider" min="0" max="1000" value="500"></div></div>
    <div><div class="gauge"><small style="color:var(--mut)">${R.rate}</small><div class="val" id="rRate">0</div><div class="lvl" id="rLvl"></div><div class="gbar"><i id="rBar"></i></div></div>
     <div class="f"><label>${R.type}</label><div class="chips" id="rType">${Object.keys(R.types).map(k=>`<button class="chip${k==='gamma'?' on':''}" data-v="${k}">${R.types[k]}</button>`).join('')}</div></div>
     <div class="f"><label>${R.shield}</label><div class="chips" id="rShield">${Object.keys(R.shields).map(k=>`<button class="chip${k==='none'?' on':''}" data-v="${k}">${R.shields[k]}</button>`).join('')}</div></div>
     <div class="row"><button class="btn" id="rSound">${R.soundOn}</button></div><div class="log" id="rMsg"></div></div></div></div>
  ${A.sh('',R.tTitle,'','margin-top:46px')}<div class="grid">${R.tcards.map(c=>A.card(c[0],c[1],c[2],c[3])).join('')}</div>
  <div class="panel" style="margin-top:16px">${A.table(R.pen.map((r,i)=>i===0?r:r.map((c,j)=>j===0?c:`<span class="${c==='y'?'yes':c==='n'?'no':'part'}">${R.penW[c]}</span>`)),'pen-tbl')}</div>
  ${A.sh('',R.pTitle,R.pSub,'margin-top:46px')}<div class="grid">${R.pcards.map(c=>`<div class="card" style="text-align:center"><div class="ic" style="margin:0 auto 10px">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p><div class="eq">${c[3]}</div></div>`).join('')}</div>
  <div class="panel" style="margin-top:46px"><h3 style="margin-bottom:4px">${R.dcTitle}</h3><p class="note" style="margin:0 0 14px">${R.dcSub}</p>
   <div class="calc"><div class="dq">
    <div class="f"><label>${dq.alt}</label><select id="dc_alt">${dq.altO.map((o,i)=>`<option value="${i}">${o}</option>`).join('')}</select></div>
    <div class="f"><label>${dq.home}</label><select id="dc_home">${dq.homeO.map((o,i)=>`<option value="${i}"${i===1?' selected':''}>${o}</option>`).join('')}</select></div>
    <div class="f"><label>${dq.fly}</label><input type="number" id="dc_fly" value="10" min="0"></div>
    <div class="f"><label>${dq.xr}</label><input type="number" id="dc_xr" value="1" min="0"></div>
    <div class="f"><label>${dq.ct}</label><input type="number" id="dc_ct" value="0" min="0"></div>
    <div class="f"><label>${dq.npp}</label><select id="dc_npp"><option value="0">${dq.no}</option><option value="1">${dq.yes}</option></select></div>
    <div class="f"><label>${dq.coal}</label><select id="dc_coal"><option value="0">${dq.no}</option><option value="1">${dq.yes}</option></select></div>
   </div><div class="dres"><small style="color:var(--mut)">${R.dcRes}</small><br><span class="big" id="dc_tot">—</span><div class="stack" id="dc_stack"></div><div class="stk-l" id="dc_leg"></div><p id="dc_cmp" style="margin-top:10px"></p><p class="note">${R.dcAvg}</p></div></div></div>
  ${A.sh('',R.dlTitle,R.dlSub,'margin-top:46px')}<div class="panel">${(()=>{const lmin=Math.log10(0.00005),lmax=Math.log10(2000);return R.doses.map(d=>{const v=d[1],s=v<1?(v*1000).toFixed(v<0.001?1:0)+' µSv':v+' mSv';return `<div class="dose-row"><span>${d[0]}</span><div class="db"><i style="width:${((Math.log10(v)-lmin)/(lmax-lmin)*100).toFixed(1)}%"></i></div><span class="dv">${s}</span></div>`;}).join('');})()}</div>
  <div class="grid" style="margin-top:16px">${R.ucards.map(c=>A.card('',c[0],c[1],c[2],`<div class="eq">${c[3]}</div>`)).join('')}</div>
  ${A.sh('',R.detTitle,'','margin-top:46px')}<div class="grid">${R.det.map(c=>A.card(c[0],c[1],c[2],c[3])).join('')}</div>
  <p class="note">${R.note}</p></div></section>`;},
 init(C){
  const R=C.radiation,cv=document.getElementById('radCanvas'),sl=document.getElementById('rSlider');
  const S={type:'gamma',shield:'none',d:1,sound:false};
  const STR={alpha:3000,beta:40,gamma:60,neutron:30};
  const TR={alpha:{none:1,paper:0,al:0,pb:0,water:0,con:0},beta:{none:1,paper:0.75,al:0.02,pb:0,water:0.01,con:0},gamma:{none:1,paper:1,al:0.9,pb:0.25,water:0.6,con:0.45},neutron:{none:1,paper:1,al:0.95,pb:0.85,water:0.08,con:0.15}};
  const COL={alpha:'#f472b6',beta:'#c084fc',gamma:'#818cf8',neutron:'#67e8f9'};
  const DMIN=0.05,DMAX=10,s2d=v=>DMIN*Math.pow(DMAX/DMIN,v/1000),d2s=d=>1000*Math.log(d/DMIN)/Math.log(DMAX/DMIN);
  function rate(){const d=S.d,t=S.type,tr=TR[t][S.shield];if(t==='alpha')return d<=0.06?STR.alpha*tr:0;let r=STR[t]/(d*d)*tr;if(t==='beta'){if(d>3)r=0;else r*=Math.max(0,1-d/3);}return r;}
  function chips(id,key){document.querySelectorAll('#'+id+' .chip').forEach(b=>b.onclick=()=>{S[key]=b.dataset.v;document.querySelectorAll('#'+id+' .chip').forEach(x=>x.classList.toggle('on',x===b));msg();});}
  chips('rType','type');chips('rShield','shield');
  sl.oninput=()=>{S.d=s2d(+sl.value);msg();};S.d=s2d(+sl.value);
  let drag=false;function px2d(x,w){const x0=w*0.16,x1=w*0.94;return s2d(Math.min(Math.max((x-x0)/(x1-x0),0),1)*1000);}
  function onMove(e){if(!drag)return;const r=cv.getBoundingClientRect();S.d=px2d(e.clientX-r.left,r.width);sl.value=d2s(S.d);msg();}
  cv.addEventListener('pointerdown',e=>{drag=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}onMove(e);});cv.addEventListener('pointermove',onMove);cv.addEventListener('pointerup',()=>drag=false);cv.addEventListener('pointercancel',()=>drag=false);
  let actx=null;const sb=document.getElementById('rSound');
  sb.onclick=function(){try{if(!actx){const AC=window.AudioContext||window.webkitAudioContext;actx=new AC();}actx.resume&&actx.resume();}catch(e){sb.textContent=R.noSound;return;}S.sound=!S.sound;sb.textContent=S.sound?R.soundOff:R.soundOn;};
  function click(){if(!actx)return;try{const t=actx.currentTime,o=actx.createOscillator(),g=actx.createGain();o.type='square';o.frequency.value=1800+Math.random()*600;g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.015);o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+0.02);}catch(e){}}
  const LC=['#34d399','#a3e635','#fbbf24','#f97316','#f43f5e'];
  function level(r){const i=r<0.5?0:r<10?1:r<100?2:r<1000?3:4;return [R.lv[i],LC[i]];}
  function msg(){const t=S.type,sh=S.shield,M=R.msg,sn=R.shields[sh];let x='';
   if(t==='alpha')x=S.d>0.06?M.a_far:(sh==='none'?M.a_none:M.a_sh);
   else if(t==='beta')x=sh==='none'?M.b_none:(TR.beta[sh]<0.05?A.tpl(M.b_ok,{s:sn}):M.b_paper);
   else if(t==='gamma')x=sh==='none'?M.g_none:A.tpl(M.g_sh,{s:sn,p:Math.round(TR.gamma[sh]*100)})+(sh==='pb'?M.g_pb:'');
   else x=sh==='none'?M.n_none:((sh==='water'||sh==='con')?A.tpl(M.n_good,{s:sn}):A.tpl(M.n_bad,{s:sn}));
   document.getElementById('rMsg').textContent='💡 '+x;}
  msg();
  // dose calculator
  const ids=['dc_alt','dc_home','dc_fly','dc_xr','dc_ct','dc_npp','dc_coal'];
  const PC={cos:'#818cf8',ter:'#a16207',food:'#22c55e',rn:'#a855f7',fly:'#38bdf8',med:'#ec4899',ind:'#fbbf24'};
  function dcalc(){const g=id=>+document.getElementById(id).value||0;
   const P={cos:[0.30,0.38,0.55][g('dc_alt')],ter:0.48,food:0.29,rn:[0.8,1.26,2.0][g('dc_home')],fly:Math.max(0,g('dc_fly'))*0.004,med:Math.max(0,g('dc_xr'))*0.02+Math.max(0,g('dc_ct'))*7,ind:g('dc_npp')*0.0001+g('dc_coal')*0.0003};
   const tot=Object.values(P).reduce((a,b)=>a+b,0);document.getElementById('dc_tot').textContent=tot.toFixed(2)+' mSv';
   document.getElementById('dc_stack').innerHTML=Object.keys(P).map(k=>`<i style="width:${(P[k]/tot*100).toFixed(2)}%;background:${PC[k]}" title="${R.dcParts[k]}"></i>`).join('');
   document.getElementById('dc_leg').innerHTML=Object.keys(P).filter(k=>P[k]>0).map(k=>`<span><i style="background:${PC[k]}"></i>${R.dcParts[k]} ${P[k]<0.01?P[k].toExponential(0):P[k].toFixed(2)}</span>`).join('');
   document.getElementById('dc_cmp').textContent=tot<2.5?R.dcLow:tot<3.6?R.dcMid:R.dcHigh;}
  ids.forEach(id=>document.getElementById(id).addEventListener('input',dcalc));dcalc();
  let parts=[],r3=null,no3=false;const fld=document.getElementById('radField');
  const K={S,TR,COL,s2d,d2s,setD(d){S.d=d;sl.value=d2s(d);msg();}};
  A.loadThree().then(()=>{try{r3=A.rad3d(fld,K);fld.classList.add('is3d');}catch(e){console.error(e);no3=true;}const l=fld.querySelector('.load3d');if(l)l.remove();}).catch(()=>{const l=fld.querySelector('.load3d');if(l)l.remove();});
  return {destroy(){if(r3)try{r3.dispose();}catch(e){}A.tex.clear();},frame(dt){
   const r=rate();if(S.sound&&actx){const cps=Math.min(r*1.5,80)+0.3;if(Math.random()<cps*dt)click();}
   if(r3){try{r3.update(dt,r,level(r)[1]);}catch(e){console.error(e);try{r3.dispose();}catch(_){}r3=null;fld.classList.remove('is3d');}}
   else if(A.visible(cv)){const {ctx,w,h}=A.fitCanvas(cv);ctx.fillStyle=A.CV().bg;ctx.fillRect(0,0,w,h);
    const x0=w*0.16,x1=w*0.94,cy=h*0.55;ctx.font='10px Inter, sans-serif';ctx.textAlign='center';
    [0.1,0.5,1,2,5,10].forEach(d=>{const x=x0+(d2s(d)/1000)*(x1-x0);ctx.strokeStyle=A.CV().grid;ctx.beginPath();ctx.moveTo(x,h*0.12);ctx.lineTo(x,h*0.92);ctx.stroke();ctx.fillStyle=A.CV().mut;ctx.fillText(d+' m',x,h*0.97);});
    const sx=w*0.08,hal=ctx.createRadialGradient(sx,cy,4,sx,cy,w*0.5);hal.addColorStop(0,COL[S.type]+'88');hal.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=hal;ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(sx,cy,16,0,7);ctx.fill();ctx.fillStyle=A.CV().bg;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(sx,cy);ctx.arc(sx,cy,13,i*2.094-0.5,i*2.094+0.5);ctx.fill();}ctx.fillStyle='#fbbf24';ctx.beginPath();ctx.arc(sx,cy,3.5,0,7);ctx.fill();
    ctx.fillStyle=A.CV().warn;ctx.font='bold 11px IBM Plex Sans Arabic, Inter, sans-serif';ctx.textAlign='center';ctx.fillText(R.src,sx,cy-28);ctx.textAlign='start';
    const shx=w*0.13;if(S.shield!=='none'){const sc={paper:'#f8fafc',al:'#cbd5e1',pb:'#64748b',water:'#38bdf8',con:'#a8a29e'}[S.shield],sw={paper:2,al:5,pb:10,water:14,con:14}[S.shield];ctx.fillStyle=sc;ctx.globalAlpha=S.shield==='water'?0.6:1;ctx.fillRect(shx-sw/2,h*0.2,sw,h*0.7);ctx.globalAlpha=1;ctx.fillStyle=A.CV().acc;ctx.fillText(R.shields[S.shield],shx,h*0.17);}
    const spawn=S.type==='alpha'?3:5;for(let i=0;i<spawn;i++){const a=(Math.random()-.5)*1.3,sp=S.type==='alpha'?2:4.5;parts.push({x:sx+14,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,dead:false,passed:false});}
    const tr=TR[S.type][S.shield],aX=x0+(d2s(0.06)/1000)*(x1-x0),bX=x0+(d2s(3)/1000)*(x1-x0);ctx.fillStyle=COL[S.type];
    for(const p of parts){p.x+=p.vx;p.y+=p.vy;if(!p.passed&&p.x>=shx){p.passed=true;if(S.shield!=='none'&&Math.random()>tr)p.dead=true;}if(S.type==='alpha'&&p.x>aX)p.dead=true;if(S.type==='beta'&&p.x>bX&&Math.random()<0.15)p.dead=true;if(p.x>w||p.y<0||p.y>h)p.dead=true;if(!p.dead){ctx.beginPath();ctx.arc(p.x,p.y,S.type==='alpha'?3.2:2,0,7);ctx.fill();}}
    parts=parts.filter(p=>!p.dead);if(parts.length>500)parts.splice(0,parts.length-500);
    const px=x0+(d2s(S.d)/1000)*(x1-x0),lv=level(r);ctx.strokeStyle=lv[1];ctx.fillStyle=lv[1];ctx.lineWidth=4;ctx.lineCap='round';const ph=h*0.32;
    ctx.beginPath();ctx.arc(px,cy-ph*0.55,ph*0.13,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(px,cy-ph*0.4);ctx.lineTo(px,cy+ph*0.1);ctx.moveTo(px,cy-ph*0.3);ctx.lineTo(px-ph*0.2,cy-ph*0.05);ctx.moveTo(px,cy-ph*0.3);ctx.lineTo(px+ph*0.2,cy-ph*0.05);ctx.moveTo(px,cy+ph*0.1);ctx.lineTo(px-ph*0.16,cy+ph*0.45);ctx.moveTo(px,cy+ph*0.1);ctx.lineTo(px+ph*0.16,cy+ph*0.45);ctx.stroke();
    ctx.fillStyle=A.CV().acc;ctx.font='bold 12px IBM Plex Sans Arabic, Inter, sans-serif';ctx.fillText(R.drag,px,cy-ph*0.98);}
   const lv=level(r);document.getElementById('rRate').textContent=(r<0.01?r.toFixed(3):r<10?r.toFixed(2):A.fmt(r,0))+' µSv/h';
   const L=document.getElementById('rLvl');L.textContent=lv[0];L.style.background=lv[1]+'33';L.style.color=lv[1];
   document.getElementById('rBar').style.width=Math.min(100,Math.max(0,(Math.log10(r+0.01)+2)/5.5*100))+'%';
   document.getElementById('rDist').textContent=S.d<1?(S.d*100).toFixed(0)+' cm':S.d.toFixed(2)+' m';
  }};
 }
};

/* ===== ENERGY ===== */
function bars(rows,log,hiKey,unit){const vals=rows.map(r=>r[1]);const mx=Math.max(...vals),mn=Math.min(...vals);
 return `<div class="bars">${rows.map(r=>{const v=r[1];const w=log?((Math.log10(v)-Math.log10(mn)+0.3)/(Math.log10(mx)-Math.log10(mn)+0.3)*100):(v/mx*100);const hi=r[0].indexOf('⚛️')===0;return `<div class="br"><span class="${hi?'hl':''}">${r[0]}</span><div class="db"><i style="width:${Math.max(1.5,w).toFixed(1)}%;${hi?'background:#6D28D9':'background:rgba(185,168,217,.45)'}"></i></div><span class="dv">${A.fmt(v,2)}${unit||''}</span></div>`;}).join('')}</div>`;}
A.V.energy={
 html(C){const E=C.energy;
  return `<section><div class="wrap">${A.sh(E.tag,E.title,E.sub)}${A.simple(E.simple)}
  ${A.sh('',E.fcTitle,E.fcSub,'margin-top:40px')}<div class="cycle">${E.fc.map(c=>A.card(c[0],c[1],'',c[2])).join('')}</div>
  ${A.sh('',E.cmpTitle,'','margin-top:46px')}
  <div class="panel"><h3 style="margin-bottom:8px">${E.denT}</h3>${bars(E.den,true)}</div>
  <div class="panel" style="margin-top:14px"><h3 style="margin-bottom:8px">${E.safT}</h3>${bars(E.saf,true)}</div>
  <div class="panel" style="margin-top:14px"><h3 style="margin-bottom:8px">${E.co2T}</h3>${bars(E.co2,false)}</div>
  <p class="note">${E.src}</p>
  ${A.sh('',E.pcTitle,'','margin-top:46px')}<div class="grid"><div class="card"><h3>${E.prosT}</h3><ul>${E.pros.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="card"><h3>${E.consT}</h3><ul>${E.cons.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>
  ${A.sh('',E.wTitle,'','margin-top:46px')}<div class="grid">${E.waste.map(c=>A.card(c[0],c[1],'',c[2])).join('')}</div>
  ${A.sh('',E.fuTitle,E.fuSub,'margin-top:46px')}<div class="grid">${E.fu.map(c=>A.card(c[0],c[1],'',c[2])).join('')}</div>
  <div class="panel" style="margin-top:16px">${A.table(E.fvf)}</div></div></section>`;}
};
})(APP);
