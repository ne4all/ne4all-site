/* ===== REACTORS ===== */
(function(A){
const SRC=0.01,SPEED=2;
const CFG={
 pwr:{rated:1000,Lambda:0.02,T0:290,meltT:650,hA:0.12,cB:0.36,
  controls:[{k:'rod',min:0,max:100,v:80,u:'%'},{k:'boron',min:0,max:1500,v:500,u:' ppm'},{k:'flow',min:10,max:100,v:100,u:'%'}],
  rho(s,c){return 0.01-0.01*c.rod/100-0.006*c.boron/1000-0.0002*(s.T-this.T0)+s.extra;},
  trip(s,M){return s.P>150?A.tpl(M.trP,{v:150}):s.T>400?A.tpl(M.trT,{v:400}):null;},
  warn(s){return s.P>115||s.T>350;},
  reads(s,c,m){return [[m.coolT,s.T.toFixed(1)+' °C'],[m.press,(155+(s.T-310)*0.35).toFixed(1)+' bar']];},
  cold:{rod:100,boron:500,flow:10}},
 bwr:{rated:1100,Lambda:0.02,T0:286,meltT:650,hA:0.12,cB:1.2,
  controls:[{k:'rod',min:0,max:100,v:100,u:'%'},{k:'flow',min:30,max:100,v:100,u:'%'}],
  rho(s,c){const f=Math.min(c.flow/100,s.flowMax);const v=Math.min(Math.max(0.45*(s.P/100)/(0.5+0.5*f),0),0.8);s.v=v;return 0.012-0.015*c.rod/100-0.02*v-0.0001*(s.T-this.T0)+s.extra;},
  trip(s,M){return s.P>125?A.tpl(M.trP,{v:125}):s.T>420?A.tpl(M.trT,{v:420}):null;},
  warn(s){return s.P>110||s.T>330;},
  reads(s,c,m){return [[m.voidF,((s.v||0)*100).toFixed(0)+' %'],[m.coolT,s.T.toFixed(1)+' °C']];},
  cold:{rod:100,flow:30}},
 candu:{rated:700,Lambda:0.03,T0:265,meltT:600,hA:0.12,cB:0.27,
  controls:[{k:'zone',min:0,max:100,v:50,u:'%'},{k:'flow',min:10,max:100,v:100,u:'%'}],
  rho(s,c){return 0.008-0.008*c.zone/100-(s.adj?0.005:0)-s.burn-0.0002*(s.T-this.T0)+s.extra;},
  trip(s,M){return s.P>150?A.tpl(M.trP,{v:150}):s.T>370?A.tpl(M.trT,{v:370}):null;},
  warn(s){return s.P>115||s.T>330;},
  reads(s,c,m){return [[m.coolT,s.T.toFixed(1)+' °C'],[m.burn,(s.burn*10000).toFixed(1)+m.units]];},
  cold:{zone:100,flow:10}}
};
  function rr(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();}
  function gH(ctx,x,w,stops){const g=ctx.createLinearGradient(x,0,x+w,0);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g;}
  function gV(ctx,y,h,stops){const g=ctx.createLinearGradient(0,y,0,y+h);stops.forEach((c,i)=>g.addColorStop(i/(stops.length-1),c));return g;}
  const STEEL=['#2f353c','#8b949e','#d5dbe1','#9aa3ad','#3a4149'];
  const CONC=['#5d6268','#a9aeb3','#cfd3d6','#9ea3a8','#55595e'];
  function capsule(ctx,x,y,w,h,stops){ctx.fillStyle=gH(ctx,x,w,stops||STEEL);rr(ctx,x,y,w,h,w/2);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1;ctx.stroke();}
  function hcyl(ctx,x,y,w,h,stops){ctx.fillStyle=gV(ctx,y,h,stops||STEEL);rr(ctx,x,y,w,h,h/2.2);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1;ctx.stroke();}
  function tube(ctx,pts,wd,kind,phase,flowOn){
    const mid={hot:'#9a7660',cold:'#62758c',steam:'#a3abb4',water:'#5d7896'}[kind];
    const path=()=>{ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));};
    ctx.lineJoin='round';ctx.lineCap='round';
    path();ctx.strokeStyle='#15181c';ctx.lineWidth=wd+3;ctx.stroke();
    path();ctx.strokeStyle=mid;ctx.lineWidth=wd;ctx.stroke();
    path();ctx.strokeStyle='rgba(255,255,255,.28)';ctx.lineWidth=Math.max(1,wd*0.28);ctx.stroke();
    if(flowOn){path();ctx.setLineDash([wd*1.1,wd*3.2]);ctx.lineDashOffset=-phase;ctx.strokeStyle=kind==='hot'?'rgba(255,170,110,.55)':kind==='steam'?'rgba(255,255,255,.5)':'rgba(140,200,255,.5)';ctx.lineWidth=Math.max(1,wd*0.45);ctx.stroke();ctx.setLineDash([]);}
  }
  let CHF=11;function chip(ctx,t,x,y,col){ctx.font='bold '+CHF+'px IBM Plex Sans Arabic, Inter, sans-serif';const tw=ctx.measureText(t).width+CHF;const LT=A.isDark&&!A.isDark();ctx.fillStyle=LT?'rgba(255,255,255,.95)':'rgba(8,5,18,.72)';rr(ctx,x-tw/2,y-CHF*0.9,tw,CHF*1.75,6);ctx.fill();if(LT){ctx.strokeStyle=col||'#94A3B8';ctx.lineWidth=1.5;ctx.stroke();}ctx.fillStyle=LT?'#0E1526':(col||'#f5f3ff');ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t,x,y);ctx.textBaseline='alphabetic';}

  function drawPlant(sim){
    const {ctx,w,h}=A.fitCanvas(sim.canvas),s=sim.s,id=sim.id,L=A.C.reactors.lbl;CHF=Math.max(8,Math.min(11,w/52));const small=w<480;
    const X=f=>f*w,Y=f=>f*h,GY=Y(0.8);
    const g=Math.min(s.P/100,1.3),e=(s.scram||s.sbo)?0.05:Math.min(s.P/100,1);
    const flow=(sim.c.flow||100)/100;
    sim.phase+=0.5+1.6*flow; sim.ang+=0.02+0.35*Math.min(s.P/100,1.4);
    const t=performance.now()/1000;
    // ---- sky & ground
    ctx.fillStyle=gV(ctx,0,GY,['#141a35','#2c2a55','#5b3c6e','#b0627a','#e79a7a']);ctx.fillRect(0,0,w,GY);
    const sun=ctx.createRadialGradient(X(0.7),GY,2,X(0.7),GY,X(0.35));sun.addColorStop(0,'rgba(255,190,140,.55)');sun.addColorStop(1,'rgba(255,190,140,0)');ctx.fillStyle=sun;ctx.fillRect(0,0,w,GY);
    ctx.fillStyle='rgba(40,30,60,.85)';ctx.beginPath();ctx.moveTo(0,GY);
    for(let i=0;i<=20;i++){const xx=i/20*w;ctx.lineTo(xx,GY-Y(0.04)-Math.sin(i*1.7)*Y(0.018)-Math.sin(i*0.6)*Y(0.025));}ctx.lineTo(w,GY);ctx.fill();
    ctx.fillStyle=gV(ctx,GY,h-GY,['#2a2c2a','#1b1d1c','#121313']);ctx.fillRect(0,GY,w,h-GY);
    ctx.fillStyle='rgba(80,84,90,.5)';ctx.fillRect(0,GY+Y(0.07),w,Y(0.035));
    ctx.strokeStyle='rgba(230,220,160,.35)';ctx.setLineDash([X(0.02),X(0.02)]);ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,GY+Y(0.0875));ctx.lineTo(w,GY+Y(0.0875));ctx.stroke();ctx.setLineDash([]);

    // ---- right side: cooling tower (PWR/BWR) or lake (CANDU)
    if(id==='candu'){
      ctx.fillStyle=gV(ctx,GY,Y(0.07),['#2f4f75','#1d3554']);ctx.beginPath();ctx.ellipse(X(0.9),GY+Y(0.03),X(0.13),Y(0.035),0,0,7);ctx.fill();
      ctx.strokeStyle='rgba(255,200,170,.35)';ctx.lineWidth=1;for(let i=0;i<5;i++){const yy=GY+Y(0.012+i*0.01),off=Math.sin(t*1.5+i)*X(0.01);ctx.beginPath();ctx.moveTo(X(0.84)+off,yy);ctx.lineTo(X(0.9)+off,yy);ctx.stroke();}
      chip(ctx,L.lake,X(0.9),GY+Y(0.1),'#bae6fd');
    }else{
      // pylon behind tower
    }
    // pylon
    const px=X(0.835),pTop=Y(0.38);
    ctx.strokeStyle='#6b7280';ctx.lineWidth=1.4;ctx.beginPath();
    ctx.moveTo(px-X(0.018),GY);ctx.lineTo(px-X(0.004),pTop);ctx.moveTo(px+X(0.018),GY);ctx.lineTo(px+X(0.004),pTop);
    for(let i=0;i<6;i++){const y1=GY-(GY-pTop)*i/6,y2=GY-(GY-pTop)*(i+1)/6,a1=X(0.018)-X(0.014)*i/6,a2=X(0.018)-X(0.014)*(i+1)/6;ctx.moveTo(px-a1,y1);ctx.lineTo(px+a2,y2);ctx.moveTo(px+a1,y1);ctx.lineTo(px-a2,y2);}
    ctx.moveTo(px-X(0.022),pTop+Y(0.04));ctx.lineTo(px+X(0.022),pTop+Y(0.04));ctx.moveTo(px-X(0.016),pTop+Y(0.08));ctx.lineTo(px+X(0.016),pTop+Y(0.08));ctx.stroke();
    ctx.strokeStyle=`rgba(${120+130*e},${120+90*e},${140-60*e},${0.5+0.4*e})`;ctx.lineWidth=1;
    [0.04,0.08].forEach(o=>{ctx.beginPath();ctx.moveTo(X(0.80),Y(0.62));ctx.quadraticCurveTo(px-X(0.03),pTop+Y(o)+Y(0.06),px-X(0.022),pTop+Y(o));ctx.stroke();ctx.beginPath();ctx.moveTo(px+X(0.022),pTop+Y(o));ctx.quadraticCurveTo(X(0.93),pTop+Y(o)+Y(0.05),w,pTop+Y(o)-Y(0.02));ctx.stroke();});
    if(id!=='candu'){
      const cx=X(0.905),top=Y(0.27),bw=X(0.075),ww=X(0.045),tw=X(0.052),wy=Y(0.47);
      ctx.fillStyle=gH(ctx,cx-bw,bw*2,CONC);ctx.beginPath();ctx.moveTo(cx-tw,top);ctx.quadraticCurveTo(cx-ww*0.85,wy,cx-bw,GY-Y(0.02));ctx.lineTo(cx+bw,GY-Y(0.02));ctx.quadraticCurveTo(cx+ww*0.85,wy,cx+tw,top);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(0,0,0,.08)';ctx.lineWidth=1;for(let i=1;i<9;i++){const yy=top+(GY-top)*i/9;ctx.beginPath();ctx.moveTo(cx-bw,yy);ctx.lineTo(cx+bw,yy);ctx.stroke();}
      ctx.fillStyle='#3a3d41';ctx.beginPath();ctx.ellipse(cx,top,tw,Y(0.012),0,0,7);ctx.fill();
      ctx.strokeStyle='#2b2e32';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<10;i++){const x1=cx-bw+i*(bw*2/10);ctx.moveTo(x1,GY);ctx.lineTo(x1+bw/10,GY-Y(0.02));ctx.lineTo(x1+bw/5,GY);}ctx.stroke();
      if(Math.floor(t*1.2)%2===0){ctx.fillStyle='#ff3b3b';ctx.shadowColor='#ff3b3b';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(cx+tw*0.8,top-2,2.2,0,7);ctx.fill();ctx.shadowBlur=0;}
      // plume
      sim.plume=sim.plume||[];
      if(s.P>2&&Math.random()<0.25+0.6*e)sim.plume.push({x:cx+(Math.random()-.5)*tw,y:top,r:tw*0.5,a:0.35+0.4*e,vx:0.25+Math.random()*0.3,vy:-(0.5+Math.random()*0.4)});
      for(const p of sim.plume){p.x+=p.vx;p.y+=p.vy;p.r+=0.35;p.a-=0.0035;const gr=ctx.createRadialGradient(p.x,p.y,1,p.x,p.y,p.r);gr.addColorStop(0,`rgba(250,240,245,${Math.max(p.a,0)})`);gr.addColorStop(1,'rgba(250,240,245,0)');ctx.fillStyle=gr;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();}
      sim.plume=sim.plume.filter(p=>p.a>0&&p.y>-p.r);if(sim.plume.length>140)sim.plume.splice(0,sim.plume.length-140);
      chip(ctx,L.tower,cx,GY-Y(0.06));
    }

    // ---- turbine hall
    const hx=X(0.44),hw=X(0.36),hy=Y(0.47);
    ctx.fillStyle=gV(ctx,hy,GY-hy,['#2b2f36','#1d2026']);ctx.fillRect(hx,hy,hw,GY-hy);
    ctx.fillStyle=gV(ctx,hy-Y(0.035),Y(0.035),['#7d8691','#59616b']);ctx.fillRect(hx-X(0.005),hy-Y(0.035),hw+X(0.01),Y(0.035));
    for(let i=0;i<9;i++){const wx=hx+X(0.012)+i*(hw-X(0.024))/9;ctx.fillStyle=`rgba(255,205,130,${0.12+0.6*e})`;ctx.fillRect(wx,hy-Y(0.027),(hw-X(0.024))/9-X(0.006),Y(0.018));}
    ctx.fillStyle=gH(ctx,hx,X(0.02),['#4a525c','#7a838d','#4a525c']);ctx.fillRect(hx,hy,X(0.02),GY-hy);ctx.fillRect(hx+hw-X(0.02),hy,X(0.02),GY-hy);
    ctx.strokeStyle='#e0b43a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx+X(0.02),hy+Y(0.025));ctx.lineTo(hx+hw-X(0.02),hy+Y(0.025));ctx.stroke();
    ctx.fillStyle='#e0b43a';ctx.fillRect(hx+hw*0.35,hy+Y(0.02),X(0.02),Y(0.015));
    // turbine casings
    const ty=Y(0.6),th=Y(0.085);
    const segs=[[0.49,0.045,0.7],[0.54,0.06,1],[0.605,0.06,1]];
    // shaft
    ctx.fillStyle='#9aa3ad';ctx.fillRect(X(0.48),ty+th/2-2,X(0.27),4);
    segs.forEach(sg=>{const sx=X(sg[0]),sw=X(sg[1]),sh=th*sg[2],sy=ty+(th-sh)/2;hcyl(ctx,sx,sy,sw,sh,['#2f3f3a','#5f7a70','#9bb5aa','#5f7a70','#26332f']);
      ctx.save();rr(ctx,sx,sy,sw,sh,sh/2.2);ctx.clip();ctx.strokeStyle='rgba(255,255,255,.22)';ctx.lineWidth=2;
      for(let i=0;i<6;i++){const yy=sy+((i/6*sh+sim.ang*12)%sh);ctx.beginPath();ctx.moveTo(sx,yy);ctx.lineTo(sx+sw,yy);ctx.stroke();}ctx.restore();});
    chip(ctx,L.turb,X(0.57),ty-Y(0.03));
    // generator
    const gx=X(0.675),gw=X(0.075);
    hcyl(ctx,gx,ty+th*0.08,gw,th*0.84,['#3b2f55','#7b62b0','#c4b0f0','#7b62b0','#2e2445']);
    const gg=ctx.createRadialGradient(gx+gw/2,ty+th/2,2,gx+gw/2,ty+th/2,gw);gg.addColorStop(0,`rgba(255,215,120,${0.55*e})`);gg.addColorStop(1,'rgba(255,215,120,0)');ctx.fillStyle=gg;ctx.fillRect(gx-gw/2,ty-th,gw*2,th*3);
    chip(ctx,L.gen,gx+gw/2,ty-Y(0.03),'#fde68a');chip(ctx,sim.mwe+' MWe',gx+gw/2,ty+th+Y(0.035),'#fde68a');
    // condenser
    const kx=X(0.53),ky=Y(0.7),kw=X(0.14),kh=Y(0.07);
    ctx.fillStyle=gV(ctx,ky,kh,['#55606c','#3a424b','#2a3037']);ctx.fillRect(kx,ky,kw,kh);ctx.strokeStyle='rgba(0,0,0,.5)';ctx.strokeRect(kx,ky,kw,kh);
    ctx.fillStyle='rgba(140,190,255,.15)';for(let i=0;i<6;i++)ctx.fillRect(kx+X(0.008)+i*kw/6,ky+Y(0.012),kw/6-X(0.008),kh-Y(0.024));
    chip(ctx,L.cond,kx+kw/2,ky+kh+Y(0.035),'#bae6fd');
    // transformer
    ctx.fillStyle=gV(ctx,Y(0.66),Y(0.14),['#5b6470','#3a4048']);ctx.fillRect(X(0.785),Y(0.66),X(0.035),GY-Y(0.66));
    ctx.strokeStyle='#2a2f35';for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(X(0.79)+i*X(0.006),Y(0.67));ctx.lineTo(X(0.79)+i*X(0.006),GY-Y(0.01));ctx.stroke();}

    // ---- containment (cutaway)
    const c0=X(0.035),c1=X(0.405),wt=Y(0.36),wthk=X(0.016),cxm=(c0+c1)/2,rx=(c1-c0)/2,ry=Y(0.2);
    ctx.save();ctx.beginPath();ctx.moveTo(c0,GY);ctx.lineTo(c0,wt);ctx.ellipse(cxm,wt,rx,ry,0,Math.PI,0);ctx.lineTo(c1,GY);ctx.closePath();
    ctx.fillStyle=gV(ctx,wt-ry,GY-wt+ry,['#1f2228','#2a2e35','#33373f']);ctx.fill();ctx.clip();
    // interior glow
    const glow=ctx.createRadialGradient(X(0.14),Y(0.6),5,X(0.14),Y(0.6),X(0.28));glow.addColorStop(0,`rgba(90,170,255,${0.05+0.35*Math.min(g,1)})`);glow.addColorStop(1,'rgba(90,170,255,0)');ctx.fillStyle=glow;ctx.fillRect(c0,wt-ry,c1-c0,GY);
    // polar crane
    ctx.strokeStyle='#e0b43a';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(c0+wthk,wt+Y(0.01));ctx.lineTo(c1-wthk,wt+Y(0.01));ctx.stroke();
    ctx.strokeStyle='#888';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cxm+X(0.03),wt+Y(0.01));ctx.lineTo(cxm+X(0.03),wt+Y(0.06));ctx.stroke();
    // floor slab
    ctx.fillStyle=gV(ctx,Y(0.745),Y(0.02),['#8d9298','#5d6267']);ctx.fillRect(c0,Y(0.745),c1-c0,Y(0.02));
    ctx.restore();

    const P=s.P,ins=((sim.c.rod!==undefined?sim.c.rod:sim.c.zone)||0)/100;
    function water(x,y,ww,hh,boil){
      ctx.save();rr(ctx,x,y,ww,hh,4);ctx.clip();
      ctx.fillStyle=gV(ctx,y,hh,['#0b2a4a','#0a1f3a']);ctx.fillRect(x,y,ww,hh);
      const cg=ctx.createRadialGradient(x+ww/2,y+hh*0.6,2,x+ww/2,y+hh*0.6,Math.max(ww,hh)*0.8);cg.addColorStop(0,`rgba(110,190,255,${0.08+0.8*Math.min(g,1)})`);cg.addColorStop(1,'rgba(60,120,255,0)');ctx.fillStyle=cg;ctx.fillRect(x,y,ww,hh);
      ctx.restore();
    }
    if(id==='candu'){
      // calandria horizontal
      const kx0=X(0.075),ky0=Y(0.53),kw0=X(0.2),kh0=Y(0.15);
      ctx.fillStyle=gV(ctx,ky0-Y(0.03),kh0+Y(0.06),CONC);ctx.fillRect(kx0-X(0.02),ky0+kh0*0.5,kw0+X(0.04),Y(0.745)-ky0-kh0*0.5);
      hcyl(ctx,kx0,ky0,kw0,kh0);
      water(kx0+X(0.012),ky0+kh0*0.15,kw0-X(0.024),kh0*0.7);
      for(let j=0;j<5;j++){const yy=ky0+kh0*(0.24+j*0.13);ctx.strokeStyle='#1c2430';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(kx0-X(0.012),yy);ctx.lineTo(kx0+kw0+X(0.012),yy);ctx.stroke();
        ctx.strokeStyle=`rgba(140,210,255,${0.15+0.7*Math.min(g,1)})`;ctx.lineWidth=1.2;ctx.stroke();}
      // zone controllers & adjusters
      for(let i=0;i<3;i++){const xx=kx0+kw0*(0.3+i*0.2);ctx.fillStyle='rgba(56,189,248,.18)';ctx.fillRect(xx-3,ky0-Y(0.03),6,kh0);ctx.fillStyle='#38bdf8';const lv=kh0*ins;ctx.fillRect(xx-3,ky0-Y(0.03)+kh0-lv,6,lv);}
      const adjIn=s.adj||s.scram;ctx.fillStyle=gH(ctx,0,1,['#9aa3ad','#9aa3ad']);
      [0.4,0.6].forEach(f=>{const xx=kx0+kw0*f;ctx.fillStyle='#b8c0c8';ctx.fillRect(xx-2,ky0-Y(0.09),4,adjIn?kh0*0.85+Y(0.06):Y(0.05));});
      // fuelling machines
      sim.fm=Math.max(0,(sim.fm||0)-0.01);const fo=X(0.02)*(1-Math.sin(Math.min(sim.fm,1)*Math.PI));
      [[kx0-X(0.035)-fo,1],[kx0+kw0+X(0.005)+fo,-1]].forEach(m=>{ctx.fillStyle=gV(ctx,ky0+kh0*0.2,kh0*0.6,['#e0b43a','#a8821f']);rr(ctx,m[0],ky0+kh0*0.25,X(0.03),kh0*0.5,3);ctx.fill();ctx.fillStyle='#555';ctx.fillRect(m[0]+X(0.01),ky0+kh0*0.75,X(0.01),Y(0.745)-ky0-kh0*0.75);});
      chip(ctx,L.cal,kx0+kw0/2,ky0-Y(0.11));
      if(sim.fm>0)chip(ctx,L.fm,cxm,Y(0.785),'#fde68a');
    }else{
      const vx=X(0.095),vw=X(0.07),vy=id==='bwr'?Y(0.37):Y(0.43),vh=Y(0.745)-vy-Y(0.01);
      // bio shield
      ctx.fillStyle=gH(ctx,vx-X(0.03),X(0.03),CONC);ctx.fillRect(vx-X(0.025),vy+vh*0.45,X(0.022),vh*0.55);
      ctx.fillStyle=gH(ctx,vx+vw,X(0.03),CONC);ctx.fillRect(vx+vw+X(0.003),vy+vh*0.45,X(0.022),vh*0.55);
      capsule(ctx,vx,vy,vw,vh);
      // CRDM nozzles (PWR, top)
      if(id==='pwr'){ctx.fillStyle='#9aa3ad';for(let i=0;i<4;i++)ctx.fillRect(vx+vw*(0.25+i*0.16)-1.5,vy-Y(0.035),3,Y(0.04));}
      const wx=vx+vw*0.16,ww=vw*0.68,wy=vy+vh*0.17,wh=vh*0.72;
      water(wx,wy,ww,wh);
      ctx.save();rr(ctx,wx,wy,ww,wh,4);ctx.clip();
      if(id==='bwr'){
        // steam dryer/separators
        ctx.fillStyle='#6b7480';ctx.fillRect(wx,wy,ww,wh*0.22);ctx.strokeStyle='#4a525c';for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(wx+i*ww/5,wy);ctx.lineTo(wx+i*ww/5,wy+wh*0.22);ctx.stroke();}
        ctx.strokeStyle='rgba(200,230,255,.5)';ctx.beginPath();ctx.moveTo(wx,wy+wh*0.3);ctx.lineTo(wx+ww,wy+wh*0.3);ctx.stroke();
        const nb=Math.round((s.v||0)*70);ctx.fillStyle='rgba(235,245,255,.75)';
        for(let i=0;i<nb;i++){const bx=wx+((i*37)%100)/100*ww;const by=wy+wh-(((i*53+sim.phase*1.2)%100)/100)*wh*0.68;ctx.beginPath();ctx.arc(bx,by,1.6+(i%3)*0.5,0,7);ctx.fill();}
      }
      // fuel assemblies
      const fy=wy+wh*0.42,fh=wh*0.5;
      for(let i=0;i<4;i++){const fx=wx+ww*(0.1+i*0.22);ctx.fillStyle='#1c2533';ctx.fillRect(fx,fy,ww*0.14,fh);ctx.strokeStyle=`rgba(150,215,255,${0.2+0.8*Math.min(g,1)})`;ctx.lineWidth=1;ctx.strokeRect(fx,fy,ww*0.14,fh);}
      // control rods
      ctx.fillStyle='#c7ced6';
      for(let i=0;i<3;i++){const rx0=wx+ww*(0.255+i*0.22)-1.5;
        if(id==='bwr'){const len=fh*ins;ctx.fillRect(rx0,fy+fh-len,3,len+wh);}
        else{const len=fh*ins;ctx.fillRect(rx0,wy-2,3,fy-wy+len);}}
      ctx.restore();
      chip(ctx,L.reactor,vx+vw/2,vy-Y(0.065));
      if(id==='pwr'){
        // steam generator
        const sx=X(0.235),sw=X(0.045),sy=Y(0.42),sh=Y(0.31);
        capsule(ctx,sx,sy,sw,sh);capsule(ctx,sx-X(0.008),Y(0.3),sw+X(0.016),Y(0.15));
        if(!small)chip(ctx,L.sg,sx-X(0.03),Y(0.33));
        // pressurizer
        capsule(ctx,X(0.315),Y(0.42),X(0.026),Y(0.13));if(!small)chip(ctx,L.pzr,X(0.328),Y(0.395));
        // primary loop
        tube(ctx,[[vx+vw,Y(0.56)],[sx,Y(0.56)]],X(0.012),'hot',sim.phase,s.P>1);
        tube(ctx,[[sx+sw*0.5,sy+sh],[sx+sw*0.5,Y(0.71)],[vx+vw,Y(0.71)]],X(0.012),'cold',sim.phase,true);
        tube(ctx,[[X(0.328),Y(0.55)],[X(0.328),Y(0.56)],[sx+sw,Y(0.56)]],X(0.005),'hot',0,false);
        // RCP
        hcyl(ctx,X(0.18),Y(0.69),X(0.03),Y(0.04),['#24485f','#3f7aa0','#7fb3d5','#3f7aa0','#1d3a4c']);
        if(!small)chip(ctx,L.pump,X(0.195),Y(0.67),'#bae6fd');
      }else{
        // recirculation pump
        tube(ctx,[[vx+vw,Y(0.66)],[vx+vw+X(0.05),Y(0.66)],[vx+vw+X(0.05),Y(0.72)],[vx+vw,Y(0.72)]],X(0.008),'water',sim.phase,true);
        hcyl(ctx,vx+vw+X(0.035),Y(0.68),X(0.03),Y(0.035),['#24485f','#3f7aa0','#7fb3d5','#3f7aa0','#1d3a4c']);
        chip(ctx,L.rpump,vx+vw+X(0.06),Y(0.785),'#bae6fd');
      }
    }
    if(id==='candu'){
      const sx=X(0.31),sw=X(0.04),sy=Y(0.42),sh=Y(0.3);
      capsule(ctx,sx,sy,sw,sh);capsule(ctx,sx-X(0.007),Y(0.3),sw+X(0.014),Y(0.15));if(!small)chip(ctx,L.sg,sx-X(0.035),Y(0.33));
      tube(ctx,[[X(0.285),Y(0.6)],[sx,Y(0.6)]],X(0.01),'hot',sim.phase,s.P>1);
      tube(ctx,[[sx+sw/2,sy+sh],[sx+sw/2,Y(0.73)],[X(0.285),Y(0.73)],[X(0.285),Y(0.68)]],X(0.01),'cold',sim.phase,true);
    }
    // outer containment shell (concrete, cut)
    ctx.fillStyle=gH(ctx,c0,wthk,CONC);ctx.fillRect(c0,wt,wthk,GY-wt);
    ctx.fillStyle=gH(ctx,c1-wthk,wthk,CONC);ctx.fillRect(c1-wthk,wt,wthk,GY-wt);
    ctx.strokeStyle=gH(ctx,c0,c1-c0,CONC);ctx.lineWidth=wthk;ctx.beginPath();ctx.ellipse(cxm,wt,rx-wthk/2,ry-wthk/2,0,Math.PI,0);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cxm,wt,rx,ry,0,Math.PI,0);ctx.stroke();
    if(s.scram&&Math.floor(t*3)%2===0||Math.floor(t*1.2)%2===0){ctx.fillStyle=s.scram?'#ff3b3b':'#ff6b6b';ctx.shadowColor='#ff3b3b';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(cxm,wt-ry-2,2.5,0,7);ctx.fill();ctx.shadowBlur=0;}
    if(!small)chip(ctx,L.cont,cxm,wt-ry-Y(0.035),'#e9d5ff');
    // steam line & feedwater (outside)
    const steamFrom=id==='bwr'?[[X(0.13),Y(0.37)],[X(0.13),Y(0.33)],[X(0.2),Y(0.33)]]:id==='pwr'?[[X(0.2575),Y(0.3)],[X(0.2575),Y(0.25)]]:[[X(0.33),Y(0.3)],[X(0.33),Y(0.25)]];
    const sl=steamFrom.concat([[X(0.33),steamFrom[steamFrom.length-1][1]],[X(0.47),steamFrom[steamFrom.length-1][1]],[X(0.47),Y(0.5)],[X(0.47),ty+th/2],[X(0.49),ty+th/2]]);
    tube(ctx,sl,X(0.011),'steam',sim.phase,s.P>2);
    const fwEnd=id==='bwr'?[X(0.165),Y(0.6)]:id==='pwr'?[X(0.28),Y(0.66)]:[X(0.35),Y(0.66)];
    tube(ctx,[[kx,ky+kh/2],[X(0.45),ky+kh/2],[X(0.45),Y(0.64)],[X(0.39),Y(0.64)],[fwEnd[0],Y(0.64)],fwEnd],X(0.007),'water',sim.phase,s.P>2);
    tube(ctx,[[X(0.63),ty+th],[X(0.63),ky]],X(0.009),'steam',sim.phase*0.5,s.P>2);
    if(s.scram){ctx.fillStyle='rgba(255,40,60,.08)';ctx.fillRect(0,0,w,h);}
    if(s.dmg){const dg=ctx.createRadialGradient(X(0.13),Y(0.6),5,X(0.13),Y(0.6),X(0.3));dg.addColorStop(0,'rgba(255,90,30,'+(0.5+0.2*Math.sin(t*6))+')');dg.addColorStop(1,'rgba(255,40,20,0)');ctx.fillStyle=dg;ctx.fillRect(0,0,w,h);}
  }


function drawChart(sim,label){
 const C=A.fitCanvas(sim.chart),c=C.ctx,H=sim.s.hist;c.clearRect(0,0,C.w,C.h);
 c.strokeStyle='rgba(200,160,255,.12)';c.lineWidth=1;c.fillStyle='rgba(185,168,217,.7)';c.font='10px Inter, sans-serif';c.textAlign='left';
 [50,100,150].forEach(v=>{const y=C.h-6-(v/160)*(C.h-12);c.beginPath();c.moveTo(0,y);c.lineTo(C.w,y);c.stroke();c.fillText(v+'%',4,y-2);});
 if(H.length>1){const lg=c.createLinearGradient(0,0,C.w,0);lg.addColorStop(0,'#22d3ee');lg.addColorStop(.5,'#a855f7');lg.addColorStop(1,'#ec4899');c.strokeStyle=lg;c.lineWidth=2.5;c.beginPath();H.forEach((v,i)=>{const x=C.w-(H.length-1-i)*(C.w/300),y=C.h-6-(Math.min(v,160)/160)*(C.h-12);i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();}
 c.fillStyle='#f0abfc';c.font='bold 11px IBM Plex Sans Arabic, Inter, sans-serif';c.textAlign='right';c.fillText(label,C.w-6,13);
}
A.V.reactors={
 html(C){const R=C.reactors;
  return `<section><div class="wrap">${A.sh(R.tag,R.title,R.sub)}${A.simple(R.simple)}
  <div class="panel" style="margin:22px 0 26px"><h3 style="margin-bottom:10px">${R.howTitle}</h3><div class="grid g-how">${R.how.map(h=>A.card(h[0],h[1],h[2],h[3])).join('')}</div>
   <div class="card" style="margin-top:14px"><h3>${R.wordsTitle}</h3><p>${R.words}</p></div></div>
  <div class="rtabs" id="rtabs">${['pwr','bwr','candu'].map((k,i)=>`<button class="rtab${i?'':' on'}" data-r="${k}">${k.toUpperCase()}<small>${R.types[k].tab}</small></button>`).join('')}</div>
  <div id="rpanels"></div>
  <div class="panel" style="margin-top:26px"><h3 style="margin-bottom:10px">${R.cmpTitle}</h3>${A.table(R.cmp)}</div>
  ${A.sh('',R.otherTitle,'','margin-top:46px')}<div class="grid">${R.other.map(o=>A.card('',o[0],o[1],o[2])).join('')}</div>
  <p class="note">${R.note}</p></div></section>`;},
 init(C){
  const R=C.reactors,M=R.m,host=document.getElementById('rpanels'),sims={};
  ['pwr','bwr','candu'].forEach(id=>{
   const cfg=CFG[id],T=R.types[id];
   const d=document.createElement('div');d.className='rpanel'+(id==='pwr'?'':' hide');d.dataset.r=id;
   d.innerHTML=`<div class="panel rinfo"><div><h3 style="font-size:1.35rem">${T.name}</h3><p style="color:var(--mut);margin-top:6px">${T.desc}</p></div><div class="facts">${T.facts.map(f=>`<div><small>${f[0]}</small><b>${f[1]}</b></div>`).join('')}</div></div>
   <div class="panel simbox"><div><div class="plant"><canvas></canvas><div class="status">${R.st.safe}</div><div class="damage hide"></div></div>
     <div class="hint3d">${C.hint3d}</div><div class="hint3d" style="color:#67e8f9;font-weight:700">${R.clickHint}</div><div class="legend">${R.legend.map(l=>`<span>${l}</span>`).join('')}</div>
     <div class="scen"><b style="width:100%;font-size:.9rem">${R.scTitle}</b><button class="chip" data-s="pump">${R.sc.pump}</button><button class="chip" data-s="rod">${R.sc.rod}</button><button class="chip" data-s="sbo">${R.sc.sbo}</button><button class="chip hide" data-s="eccs" style="background:#6D28D9;color:#fff">${R.sc.eccs}</button></div>
     <div class="mission hide"></div></div>
    <div><div class="meters">
      <div class="meter"><small>${M.power}</small><b data-m="pow">0%</b></div><div class="meter"><small>${M.mwe}</small><b data-m="mwe">0 MWe</b></div>
      <div class="meter"><small>${M.k}</small><b data-m="k">1.0000</b></div><div class="meter"><small>${M.state}</small><b data-m="crit" style="font-size:1rem;direction:${C.dir}">—</b></div>
      <div class="meter"><small data-ml="0"></small><b data-m="r0"></b></div><div class="meter"><small data-ml="1"></small><b data-m="r1"></b></div><div class="meter" style="grid-column:1/3"><small>${M.decay}</small><b data-m="dh">0 %</b></div></div>
     ${cfg.controls.map(c=>`<div class="ctrl"><label>${T.controls[c.k][0]} <span data-cv="${c.k}">${c.v}${c.u}</span></label><input type="range" data-c="${c.k}" min="${c.min}" max="${c.max}" value="${c.v}"><div class="hint">${T.controls[c.k][1]}</div></div>`).join('')}
     ${T.btns?`<div class="row" style="margin-bottom:10px">${Object.keys(T.btns).map(k=>`<button class="btn" data-b="${k}">${T.btns[k]}</button>`).join('')}</div>`:''}
     <div class="row"><button class="btn red" data-b="scram">${R.scram}</button><button class="btn" data-b="reset">${R.reset}</button></div>
     <button class="btn" data-b="mission" style="width:100%;margin-top:8px;background:rgba(34,211,238,.12);border-color:rgba(34,211,238,.4)">${R.mis.btn}</button>
     <canvas class="chart"></canvas><div class="log"></div></div></div>`;
   host.appendChild(d);
   const sim={id,cfg,el:d,canvas:d.querySelector('.plant canvas'),chart:d.querySelector('.chart'),st:d.querySelector('.status'),log:d.querySelector('.log'),dmgEl:d.querySelector('.damage'),misEl:d.querySelector('.mission'),eccsBtn:d.querySelector('[data-s=eccs]'),c:{},s:null,phase:0,ang:0,mwe:0};
   sims[id]=sim;
   const inputs=[...d.querySelectorAll('input[data-c]')];
   function readC(){inputs.forEach(i=>{sim.c[i.dataset.c]=+i.value;const cc=cfg.controls.find(x=>x.k===i.dataset.c);d.querySelector(`[data-cv="${i.dataset.c}"]`).textContent=i.value+cc.u;});}
   inputs.forEach(i=>i.oninput=readC);
   sim.setLog=h=>{sim.log.innerHTML=h;};
   sim.reset=(cold)=>{sim.s={P:0.1,D:0,T:cfg.T0,scram:false,burn:0,adj:true,hist:[],v:0,extra:0,ramp:false,flowMax:1,sbo:false,eccs:false,dmg:false,mission:0,hold:0};
    inputs.forEach(i=>{const cc=cfg.controls.find(x=>x.k===i.dataset.c);i.value=cold&&cfg.cold[cc.k]!==undefined?cfg.cold[cc.k]:cc.v;i.disabled=false;});readC();
    sim.dmgEl.classList.add('hide');sim.eccsBtn.classList.add('hide');sim.misEl.classList.add('hide');sim.setLog(T.tip);sim.plume=[];};
   sim.scram=(why)=>{if(sim.s.scram)return;sim.s.scram=true;sim.s.ramp=false;sim.s.extra=0;inputs.forEach(i=>{if(i.dataset.c==='rod'||i.dataset.c==='zone')i.value=100;i.disabled=i.dataset.c!=='flow';});readC();sim.setLog(A.tpl(R.scramMsg,{r:why}));};
   d.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{const k=b.dataset.b,s=sim.s;
    if(k==='scram')sim.scram(R.byOp);
    else if(k==='reset')sim.reset();
    else if(k==='mission'){sim.reset(true);sim.s.mission=1;sim.misEl.classList.remove('hide');}
    else if(k==='adj'&&!s.scram){s.adj=!s.adj;sim.setLog(s.adj?T.adjIn:T.adjOut);}
    else if(k==='refuel'&&!s.scram){sim.fm=1;s.burn=Math.max(0,s.burn-0.0015);sim.setLog(T.refuelMsg);}});
   d.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{const k=b.dataset.s,s=sim.s;if(s.dmg)return;
    if(k==='pump'&&!s.scram){s.flowMax=0.25;sim.setLog(R.scMsg.pump);}
    else if(k==='rod'&&!s.scram){s.ramp=true;sim.setLog(R.scMsg.rod);}
    else if(k==='sbo'){s.sbo=true;s.eccs=false;sim.scram(R.sc.sbo);sim.setLog(R.scMsg.sbo);sim.eccsBtn.classList.remove('hide');}
    else if(k==='eccs'&&s.sbo){s.eccs=true;sim.setLog(R.scMsg.eccs);sim.eccsBtn.classList.add('hide');}});
   sim.reset();
  });
  document.querySelectorAll('#rtabs .rtab').forEach(b=>b.onclick=()=>{document.querySelectorAll('#rtabs .rtab').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.rpanel').forEach(p=>p.classList.toggle('hide',p.dataset.r!==b.dataset.r));});
  function step(sim,dt){
   const s=sim.s,cfg=sim.cfg,c=sim.c;
   if(s.ramp)s.extra=Math.min(0.004,s.extra+0.0006*dt);
   let rho=cfg.rho(s,c);if(s.scram)rho=Math.min(rho,0)-0.03;s.rho=rho;
   s.P+=((rho/cfg.Lambda)*s.P+SRC)*dt;s.P=Math.min(Math.max(s.P,1e-4),400);
   const tgt=0.066*s.P;s.D+=(tgt-s.D)*dt/(tgt>s.D?20:150);
   let fe=Math.min(c.flow/100,s.flowMax),mult=1;if(s.sbo){fe=s.eccs?0.5:0.001;mult=6;}
   s.T+=mult*(cfg.hA*(s.P+s.D)-cfg.cB*fe*(s.T-cfg.T0))*dt;
   if(sim.id==='candu')s.burn+=0.0000006*s.P*dt;
   if(!s.scram){const t=cfg.trip(s,R);if(t)sim.scram(t);}
   if(!s.dmg&&s.T>cfg.meltT){s.dmg=true;sim.dmgEl.textContent=R.st.dmg;sim.dmgEl.classList.remove('hide');sim.setLog(R.dmgMsg);sim.eccsBtn.classList.add('hide');}
   if(s.mission===1&&c.flow>=90)s.mission=2;
   else if(s.mission===2&&s.rho>-2e-5&&s.P>0.3)s.mission=3;
   else if(s.mission===3){if(s.P>=90&&Math.abs(s.rho)<1.5e-4)s.hold+=dt;else s.hold=0;if(s.hold>3){s.mission=4;sim.setLog(R.mis.done);}}
  }
  function misHTML(sim){const s=sim.s,st=[R.mis.s1,R.types[sim.id].step2,R.mis.s3];
   return `<b>${R.mis.title}</b>`+st.map((x,i)=>{const n=i+1,cls=s.mission>n?'ok':s.mission===n?'now':'';return `<div class="stp ${cls}">${s.mission>n?'✅':s.mission===n?'👉':'⬜'} <span>${x}</span></div>`;}).join('')+(s.mission===4?`<div class="stp ok">${R.mis.done}</div>`:'');}
  let three=false;
  function make3d(sim){const pl=sim.el.querySelector('.plant');try{sim.p3=A.plant3d(sim,pl);pl.classList.add('is3d');}catch(err){console.error(err);sim.no3d=true;sim.p3=null;}}
  const ld=document.createElement('div');ld.className='load3d';ld.textContent=C.load3d;
  document.querySelectorAll('.rpanel .plant').forEach(p=>p.appendChild(ld.cloneNode(true)));
  A.loadThree().then(()=>{three=true;document.querySelectorAll('.load3d').forEach(x=>x.remove());}).catch(()=>{document.querySelectorAll('.load3d').forEach(x=>x.remove());});
  return {destroy(){Object.values(sims).forEach(s=>{if(s.p3)try{s.p3.dispose();}catch(e){}});A.tex.clear();},frame(dt){
   const onPage=A.visible(host);
   Object.values(sims).forEach(sim=>{
    for(let i=0;i<15;i++)step(sim,dt*SPEED/15);
    const s=sim.s;s._t=(s._t||0)+dt;if(s._t>0.1){s._t=0;s.hist.push(s.P+s.D);if(s.hist.length>300)s.hist.shift();}
    sim.mwe=(s.scram||s.sbo||s.dmg)?0:Math.round(Math.max(0,s.P-1)/100*sim.cfg.rated);
    if(!onPage||!A.visible(sim.el))return;
    const el=sim.el,k=1/(1-s.rho),Pt=s.P+s.D;
    el.querySelector('[data-m="pow"]').textContent=(Pt<1?Pt.toFixed(2):Pt.toFixed(1))+'%';
    el.querySelector('[data-m="mwe"]').textContent=sim.mwe+' MWe';el.querySelector('[data-m="dh"]').textContent=(s.D||0).toFixed(2)+' %';
    el.querySelector('[data-m="k"]').textContent=k.toFixed(4);
    const crit=s.rho>2e-5?M.sup:s.rho<-2e-5?M.sub:M.crit;el.querySelector('[data-m="crit"]').textContent=crit;
    sim.cfg.reads(s,sim.c,M).forEach((r,i)=>{el.querySelector(`[data-ml="${i}"]`).textContent=r[0];el.querySelector(`[data-m="r${i}"]`).textContent=r[1];});
    let cls='',txt='';
    if(s.dmg){cls='bad';txt=R.st.dmg;}else if(s.scram){cls='bad';txt=R.st.scram;}else if(sim.cfg.warn(s)){cls='warn';txt=R.st.warn;}else txt=(s.P>5?R.st.run:R.st.safe)+' · '+crit;
    sim.st.className='status '+cls;sim.st.textContent=txt;
    if(s.mission)sim.misEl.innerHTML=misHTML(sim);
    if(sim.p3){try{sim.p3.update(dt);}catch(err){console.error(err);try{sim.p3.dispose();}catch(_){}sim.p3=null;sim.no3d=true;sim.el.querySelector('.plant').classList.remove('is3d');drawPlant(sim);}}else{drawPlant(sim);if(three&&!sim.no3d&&!sim.p3)make3d(sim);}
    drawChart(sim,R.chart);
   });
  }};
 }
};
})(APP);
