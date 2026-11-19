/* ===== Inside views of plant components (3D) ===== */
(function(A){
function base(st){const T=THREE,S=st.scene;S.background=A.tex.sky(A.isDark&&!A.isDark()?['#dfe7f3','#eef2f9','#f7f9fc']:['#0b0818','#1a1033','#2a1a44']);
 S.add(new T.HemisphereLight(0xdfe6ff,0x251c33,0.75));const d=new T.DirectionalLight(0xffffff,0.9);d.position.set(6,10,8);S.add(d);
 const fl=new T.Mesh(new T.CircleGeometry(14,64),new T.MeshStandardMaterial({color:0x1d1830,roughness:0.9}));fl.rotation.x=-Math.PI/2;S.add(fl);
 const gr=new T.GridHelper(28,28,0x3b2f5c,0x2a2244);gr.position.y=0.01;S.add(gr);}
const glass=()=>new THREE.MeshStandardMaterial({color:0xbfd7ff,transparent:true,opacity:0.16,roughness:0.05,metalness:0.2,side:THREE.DoubleSide,depthWrite:false});
const steelM=()=>new THREE.MeshStandardMaterial({color:0xcfd6de,roughness:0.3,metalness:0.85,side:THREE.DoubleSide});
function pts(T,n,color,size,tex){const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(new Float32Array(n*3),3));const p=new T.Points(g,new T.PointsMaterial({color,size,map:tex||A.tex.glow(),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));p.frustumCulled=false;return p;}
const B={};
/* ---------- reactor core (PWR/BWR) ---------- */
B.reactor=function(st,sim){const T=THREE,S=st.scene,bwr=sim.id==='bwr';
 const vh=8,vr=3;const ves=new T.Mesh(new T.CylinderGeometry(vr,vr,vh,48,1,true,Math.PI/2,Math.PI),steelM());ves.position.set(0,vh/2+0.5,0);S.add(ves);
 const bot=new T.Mesh(new T.SphereGeometry(vr,48,16,Math.PI,Math.PI,Math.PI/2,Math.PI/2),steelM());bot.position.set(0,0.5,0);S.add(bot);
 const water=new T.Mesh(new T.CylinderGeometry(vr-0.1,vr-0.1,vh*(bwr?0.7:0.97),40,1,false,Math.PI/2,Math.PI),new T.MeshStandardMaterial({color:0x2a6fd6,transparent:true,opacity:0.25,emissive:0x3d8bff,emissiveIntensity:0.3,side:T.DoubleSide,depthWrite:false}));water.position.set(0,0.5+vh*(bwr?0.35:0.485),0);S.add(water);
 const fuelM=new T.MeshStandardMaterial({color:0x22324a,metalness:0.6,roughness:0.4,emissive:0x8fd6ff,emissiveIntensity:0.5});
 const cy=3.2,fh=3.6,fuel=[];for(let i=-2;i<=2;i++)for(let j=0;j<3;j++){const m=new T.Mesh(new T.BoxGeometry(0.7,fh,0.7),fuelM);m.position.set(i*0.95,cy,-j*0.95);S.add(m);fuel.push(m);
}
 const rodM=new T.MeshStandardMaterial({color:0xe5e9ef,metalness:0.9,roughness:0.2});const rods=[];
 [[-0.48,0],[0.48,0],[-0.48,-0.95],[0.48,-0.95],[-1.43,-0.48],[1.43,-0.48]].forEach(p=>{const r=new T.Mesh(new T.CylinderGeometry(0.1,0.1,fh,10),rodM);r.position.set(p[0],cy,p[1]);S.add(r);rods.push(r);});
 const L=new T.PointLight(0x7cc0ff,2,14);L.position.set(0,cy,1.5);S.add(L);
 const neu=pts(T,160,0x7df9ff,0.18);S.add(neu);const nv=[];for(let i=0;i<160;i++)nv.push({x:(Math.random()-.5)*4.6,y:cy+(Math.random()-.5)*fh,z:-Math.random()*2.4,vx:(Math.random()-.5)*6,vy:(Math.random()-.5)*6,vz:(Math.random()-.5)*6});
 const flash=pts(T,40,0xffd27a,0.9);S.add(flash);const fv=[];for(let i=0;i<40;i++)fv.push({x:0,y:-9,z:0,a:0});
 const flow=pts(T,120,0x8cc8ff,0.16);S.add(flow);const wv=[];for(let i=0;i<120;i++)wv.push({x:(Math.random()-.5)*5,y:Math.random()*vh,z:-Math.random()*2.6});
 st.label(A.C.reactors.lblIn.fuel,[2.6,cy+1.2,0.6]);st.label(A.C.reactors.lblIn.rods,[-2.4,cy+fh/2+0.6,0.4]);
 return function(dt){const s=sim.s,g=Math.min(1.3,s.P/100),ins=((sim.c.rod)||0)/100;
  fuelM.emissiveIntensity=0.2+2.4*Math.min(1.2,g);L.intensity=0.4+4*Math.min(1.2,g);water.material.emissiveIntensity=0.1+1.3*Math.min(1.2,g);
  rods.forEach(r=>r.position.y=bwr?cy-(1-ins)*(fh+0.2):cy+(1-ins)*(fh+0.2));
  const a=neu.geometry.attributes.position,act=Math.round(20+140*Math.min(1,g));neu.geometry.setDrawRange(0,act);
  nv.forEach((p,i)=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;if(Math.abs(p.x)>2.5)p.vx*=-1;if(p.y<cy-fh/2||p.y>cy+fh/2)p.vy*=-1;if(p.z>0.3||p.z<-2.6)p.vz*=-1;a.setXYZ(i,p.x,p.y,p.z);});a.needsUpdate=true;
  const fa=flash.geometry.attributes.position;fv.forEach((f,i)=>{f.a-=dt*3;if(f.a<=0&&Math.random()<g*0.25){const fu=fuel[Math.floor(Math.random()*fuel.length)];f.x=fu.position.x+(Math.random()-.5)*0.5;f.y=cy+(Math.random()-.5)*fh;f.z=fu.position.z+0.4;f.a=1;}fa.setXYZ(i,f.x,f.a>0?f.y:-9,f.z);});fa.needsUpdate=true;flash.material.size=0.9;
  const wa=flow.geometry.attributes.position;wv.forEach((p,i)=>{p.y+=dt*(1+(sim.c.flow||100)/40);if(p.y>vh*(bwr?0.7:0.97)+0.5)p.y=0.6;wa.setXYZ(i,p.x,p.y,p.z);});wa.needsUpdate=true;
  const hot=Math.min(1,Math.max(0,(s.T-sim.cfg.T0)/60));flow.material.color.setRGB(0.55+0.45*hot,0.78-0.3*hot,1-0.6*hot);};};
/* ---------- CANDU calandria ---------- */
B.cal=function(st,sim){const T=THREE,S=st.scene;
 const sh=new T.Mesh(new T.CylinderGeometry(3,3,8,48,1,true,Math.PI/2,Math.PI),steelM());sh.rotation.z=Math.PI/2;sh.position.y=3.6;S.add(sh);
 [-1,1].forEach(s=>{const e=new T.Mesh(new T.CylinderGeometry(3.3,3.3,0.6,48),new T.MeshStandardMaterial({color:0x8a939e,metalness:0.8,roughness:0.4}));e.rotation.z=Math.PI/2;e.position.set(s*4.3,3.6,0);S.add(e);});
 const hw=new T.Mesh(new T.CylinderGeometry(2.9,2.9,8,40,1,false,Math.PI/2,Math.PI),new T.MeshStandardMaterial({color:0x1fb5a8,transparent:true,opacity:0.22,emissive:0x2fd0ff,emissiveIntensity:0.3,side:T.DoubleSide,depthWrite:false}));hw.rotation.z=Math.PI/2;hw.position.y=3.6;S.add(hw);
 const tubeM=glass(),bunM=new T.MeshStandardMaterial({color:0x2a3346,metalness:0.6,roughness:0.4,emissive:0x8fd6ff,emissiveIntensity:0.5});const buns=[];
 for(let i=-1;i<=1;i++)for(let j=0;j<2;j++){const y=3.6+i*1.2,z=-0.6-j*1.2;const t=new T.Mesh(new T.CylinderGeometry(0.32,0.32,9.4,16,1,true),tubeM);t.rotation.z=Math.PI/2;t.position.set(0,y,z);S.add(t);
  for(let b=0;b<8;b++){const bn=new T.Mesh(new T.CylinderGeometry(0.25,0.25,0.95,16),bunM);bn.rotation.z=Math.PI/2;bn.position.set(-3.6+b*1.02,y,z);bn.userData={b,y,z};S.add(bn);buns.push(bn);}}
 const fmM=new T.Mesh(new T.BoxGeometry(1.4,1.6,1.6),new T.MeshStandardMaterial({color:0xe0b43a,metalness:0.4,roughness:0.5}));fmM.position.set(6.4,3.6,-0.6);S.add(fmM);
 const L=new T.PointLight(0x7cc0ff,2,14);L.position.set(0,3.6,2);S.add(L);
 st.label(A.C.reactors.lblIn.bundle,[0,5.8,0.2]);st.label(A.C.reactors.lbl.fm.replace(' ⛽',''),[6.4,5,-0.6]);
 let shift=0;return function(dt){const s=sim.s,g=Math.min(1.3,s.P/100);bunM.emissiveIntensity=0.2+2.4*Math.min(1.2,g);L.intensity=0.4+4*Math.min(1.2,g);hw.material.emissiveIntensity=0.1+1.2*Math.min(1.2,g);
  if((sim.fm||0)>0)shift=(shift+dt*1.2)%1.02;fmM.position.x=6.4-Math.sin(Math.min(1,sim.fm||0)*Math.PI)*1.2;
  buns.forEach(b=>{b.position.x=-3.6+((b.userData.b*1.02+shift)%8.16);});};};
/* ---------- steam generator ---------- */
B.sg=function(st,sim){const T=THREE,S=st.scene;
 const shell=new T.Mesh(new T.CylinderGeometry(2,2,7,40,1,true),glass());shell.position.y=4;S.add(shell);
 const dome=new T.Mesh(new T.SphereGeometry(2,40,16,0,Math.PI*2,0,Math.PI/2),glass());dome.position.y=7.5;S.add(dome);
 const plen=new T.Mesh(new T.SphereGeometry(2,40,16,0,Math.PI*2,Math.PI/2,Math.PI/2),steelM());plen.position.y=0.5;S.add(plen);
 const tubeM=new T.MeshStandardMaterial({color:0xffa060,emissive:0xff6a20,emissiveIntensity:0.6,metalness:0.5,roughness:0.4});
 for(let i=0;i<7;i++){const r=0.35+i*0.2,y0=0.7,top=5.2+i*0.18;const pts2=[[-r,y0,0],[-r,top-r,0],[0,top,0],[r,top-r,0],[r,y0,0]].map(p=>new T.Vector3(p[0],p[1],p[2]));const c=new T.CatmullRomCurve3(pts2);const m=new T.Mesh(new T.TubeGeometry(c,40,0.06,8,false),tubeM);m.rotation.y=i*0.45;S.add(m);}
 const bub=pts(T,140,0xe8f4ff,0.16);S.add(bub);const bv=[];for(let i=0;i<140;i++)bv.push({x:(Math.random()-.5)*3.4,y:Math.random()*6,z:(Math.random()-.5)*3.4});
 const stm=pts(T,60,0xffffff,0.35);S.add(stm);const sv=[];for(let i=0;i<60;i++)sv.push({x:(Math.random()-.5)*0.8,y:7.5+Math.random()*3,z:(Math.random()-.5)*0.8});
 const L=st.lbl;st.label(A.C.reactors.lblIn.utubes,[2.6,4,0]);st.label(A.C.reactors.lblIn.steamOut,[0,10.6,0]);st.label(A.C.reactors.lblIn.primary,[0,-0.3,2.4]);
 return function(dt){const s=sim.s,g=Math.min(1,s.P/100);tubeM.emissiveIntensity=0.2+1.5*g;
  const a=bub.geometry.attributes.position;bub.geometry.setDrawRange(0,Math.round(140*g));bv.forEach((p,i)=>{p.y+=dt*(1.5+i%4*0.3);if(p.y>7)p.y=1;a.setXYZ(i,p.x,p.y,p.z);});a.needsUpdate=true;
  const b2=stm.geometry.attributes.position;stm.visible=g>0.03;sv.forEach((p,i)=>{p.y+=dt*3;if(p.y>11)p.y=7.5;b2.setXYZ(i,p.x,p.y,p.z);});b2.needsUpdate=true;};};
/* ---------- pressurizer ---------- */
B.pzr=function(st,sim){const T=THREE,S=st.scene;
 const sh=new T.Mesh(new T.CylinderGeometry(1.4,1.4,6,40,1,true),glass());sh.position.y=3.6;S.add(sh);
 const w=new T.Mesh(new T.CylinderGeometry(1.35,1.35,3.4,40),new T.MeshStandardMaterial({color:0x2a6fd6,transparent:true,opacity:0.45,depthWrite:false}));w.position.y=2.3;S.add(w);
 const hm=new T.MeshStandardMaterial({color:0x552200,emissive:0xff5a1a,emissiveIntensity:1});for(let i=0;i<6;i++){const h=new T.Mesh(new T.CylinderGeometry(0.06,0.06,1.6,8),hm);h.position.set(Math.cos(i)*0.7,1.4,Math.sin(i)*0.7);S.add(h);}
 const steam=pts(T,80,0xffffff,0.35);S.add(steam);const sv=[];for(let i=0;i<80;i++)sv.push({x:(Math.random()-.5)*2.2,y:4+Math.random()*2.4,z:(Math.random()-.5)*2.2});
 const spray=pts(T,60,0x8cc8ff,0.12);S.add(spray);const pv=[];for(let i=0;i<60;i++)pv.push({x:0,y:6.4,z:0,vx:(Math.random()-.5)*1.2,vz:(Math.random()-.5)*1.2,t:Math.random()});
 st.label(A.C.reactors.lblIn.heaters,[1.9,1.4,0]);st.label(A.C.reactors.lblIn.spray,[1.9,6.4,0]);st.label(A.C.reactors.lblIn.steamSpace,[-2.2,5,0]);
 return function(dt){const s=sim.s,p=155+(s.T-310)*0.35;hm.emissiveIntensity=p<154?2:0.3;spray.visible=p>156;
  const a=steam.geometry.attributes.position;sv.forEach((q,i)=>{q.y+=dt*0.4;if(q.y>6.5)q.y=4.05;a.setXYZ(i,q.x+Math.sin(q.y*3+i)*0.05,q.y,q.z);});a.needsUpdate=true;
  const b=spray.geometry.attributes.position;pv.forEach((q,i)=>{q.t+=dt;if(q.t>1){q.t=0;}b.setXYZ(i,q.vx*q.t,6.4-q.t*2.2,q.vz*q.t);});b.needsUpdate=true;};};
/* ---------- pump ---------- */
B.pump=function(st,sim){const T=THREE,S=st.scene;
 const vol=new T.Mesh(new T.TorusGeometry(2,0.9,20,48),glass());vol.position.y=3;S.add(vol);
 const hub=new T.Group();hub.position.y=3;S.add(hub);const bm=new T.MeshStandardMaterial({color:0x3f7aa0,metalness:0.7,roughness:0.3});
 hub.add(new T.Mesh(new T.CylinderGeometry(0.6,0.6,0.5,24),bm));for(let i=0;i<7;i++){const b=new T.Mesh(new T.BoxGeometry(1.8,0.4,0.12),bm);b.position.set(Math.cos(i/7*Math.PI*2)*1.1,0,Math.sin(i/7*Math.PI*2)*1.1);b.rotation.y=-i/7*Math.PI*2+0.5;hub.add(b);}
 const sh=new T.Mesh(new T.CylinderGeometry(0.2,0.2,4,12),steelM());sh.position.y=5;S.add(sh);const mot=new T.Mesh(new T.CylinderGeometry(1.1,1.1,1.8,32),new T.MeshStandardMaterial({color:0x2e4a6b,metalness:0.6,roughness:0.4}));mot.position.y=7.6;S.add(mot);
 const wp=pts(T,120,0x8cc8ff,0.18);S.add(wp);const wv=[];for(let i=0;i<120;i++)wv.push({a:Math.random()*6.28,r:1.6+Math.random()*0.7});
 st.label(A.C.reactors.lblIn.impeller,[2.8,3.6,0]);st.label(A.C.reactors.lblIn.motor,[1.6,7.6,0]);
 return function(dt){const f=(sim.c.flow||100)/100*(sim.s.sbo&&!sim.s.eccs?0:1)*(sim.s.flowMax<1?sim.s.flowMax:1);hub.rotation.y+=dt*12*f;
  const a=wp.geometry.attributes.position;wv.forEach((p,i)=>{p.a+=dt*3*f;a.setXYZ(i,Math.cos(p.a)*p.r,3+Math.sin(p.a*3+i)*0.3,Math.sin(p.a)*p.r);});a.needsUpdate=true;};};
/* ---------- turbine ---------- */
B.turb=function(st,sim){const T=THREE,S=st.scene;
 const cas=new T.Mesh(new T.CylinderGeometry(2.6,1.6,10,40,1,true,0,Math.PI),new T.MeshStandardMaterial({color:0x6f9488,metalness:0.6,roughness:0.35,side:T.DoubleSide}));cas.rotation.z=Math.PI/2;cas.position.y=3.4;S.add(cas);
 const casG=new T.Mesh(new T.CylinderGeometry(2.6,1.6,10,40,1,true,Math.PI,Math.PI),glass());casG.rotation.z=Math.PI/2;casG.position.y=3.4;S.add(casG);
 const rot=new T.Group();rot.position.y=3.4;S.add(rot);const sm=new T.MeshStandardMaterial({color:0xc9d1da,metalness:0.9,roughness:0.25});
 const shaft=new T.Mesh(new T.CylinderGeometry(0.25,0.25,12,16),sm);shaft.rotation.z=Math.PI/2;rot.add(shaft);
 for(let r=0;r<7;r++){const x=-4+r*1.3,R=1.0+r*0.2;const disc=new T.Group();disc.position.x=x;rot.add(disc);for(let i=0;i<14;i++){const b=new T.Mesh(new T.BoxGeometry(0.12,R,0.35),sm);b.position.y=R/2+0.25;const g=new T.Group();g.rotation.x=i/14*Math.PI*2;b.rotation.y=0.5;g.add(b);disc.add(g);}}
 const stm=pts(T,160,0xffffff,0.28);S.add(stm);const sv=[];for(let i=0;i<160;i++)sv.push({x:-5.5+Math.random()*11,a:Math.random()*6.28,r:Math.random()});
 st.label(A.C.reactors.lblIn.steamIn,[-5.6,6,0]);st.label(A.C.reactors.lblIn.blades,[0,6.6,0]);st.label(A.C.reactors.lblIn.toCond,[5.6,1,0]);
 return function(dt){const s=sim.s,sp=(s.scram||s.sbo||s.dmg)?0:Math.min(1.3,s.P/100);rot.rotation.x+=dt*18*sp;
  stm.visible=sp>0.02;const a=stm.geometry.attributes.position;sv.forEach((p,i)=>{p.x+=dt*6*sp;p.a+=dt*3*sp;if(p.x>5.5)p.x=-5.5;const R=(1+((p.x+5.5)/11)*1.3)*p.r;a.setXYZ(i,p.x,3.4+Math.cos(p.a)*R,Math.sin(p.a)*R);});a.needsUpdate=true;};};
/* ---------- generator ---------- */
B.gen=function(st,sim){const T=THREE,S=st.scene;
 const stator=new T.Group();stator.position.y=3.4;S.add(stator);const cm=new T.MeshStandardMaterial({color:0xb87333,metalness:0.8,roughness:0.35,emissive:0xffa040,emissiveIntensity:0});
 for(let i=0;i<12;i++){const c=new T.Mesh(new T.BoxGeometry(5,0.5,0.8),cm);const g=new T.Group();g.rotation.x=i/12*Math.PI*2;c.position.y=2.1;g.add(c);stator.add(g);}
 const ring=new T.Mesh(new T.CylinderGeometry(2.7,2.7,5.2,48,1,true,0,Math.PI),new T.MeshStandardMaterial({color:0x6d5aa8,metalness:0.5,roughness:0.4,side:T.DoubleSide}));ring.rotation.z=Math.PI/2;ring.position.y=3.4;S.add(ring);
 const rotor=new T.Group();rotor.position.y=3.4;S.add(rotor);
 const n=new T.Mesh(new T.CylinderGeometry(1.4,1.4,4.4,32,1,false,0,Math.PI),new T.MeshStandardMaterial({color:0xd94848,metalness:0.4,roughness:0.4}));n.rotation.z=Math.PI/2;rotor.add(n);
 const s=new T.Mesh(new T.CylinderGeometry(1.4,1.4,4.4,32,1,false,Math.PI,Math.PI),new T.MeshStandardMaterial({color:0x3b6fd9,metalness:0.4,roughness:0.4}));s.rotation.z=Math.PI/2;rotor.add(s);
 const sh=new T.Mesh(new T.CylinderGeometry(0.25,0.25,8,16),steelM());sh.rotation.z=Math.PI/2;rotor.add(sh);
 const spark=pts(T,60,0xfde68a,0.3);S.add(spark);const sv=[];for(let i=0;i<60;i++)sv.push({t:Math.random(),y:Math.random()});
 st.label('N',[0,5.2,0],'pole');st.label('S',[0,1.6,0],'pole');st.label(A.C.reactors.lblIn.coils,[0,6.4,-1]);st.label(A.C.reactors.lblIn.grid,[4.5,8,0]);
 return function(dt){const s2=sim.s,e=(s2.scram||s2.sbo||s2.dmg)?0:Math.min(1.2,s2.P/100);rotor.rotation.x+=dt*18*e;cm.emissiveIntensity=0.9*e;
  spark.visible=e>0.03;const a=spark.geometry.attributes.position;sv.forEach((p,i)=>{p.t+=dt*1.5;if(p.t>1)p.t=0;a.setXYZ(i,2.6+p.t*2,5.2+p.t*3+p.y*0.4,(p.y-0.5)*0.6);});a.needsUpdate=true;};};
/* ---------- condenser ---------- */
B.cond=function(st,sim){const T=THREE,S=st.scene;
 const bx=new T.Mesh(new T.BoxGeometry(8,4.4,4),glass());bx.position.y=2.6;S.add(bx);
 const tm=new T.MeshStandardMaterial({color:0x5aa7ff,metalness:0.6,roughness:0.3,emissive:0x1a5aa0,emissiveIntensity:0.5});
 for(let i=0;i<6;i++)for(let j=0;j<5;j++){const t=new T.Mesh(new T.CylinderGeometry(0.1,0.1,7.8,8),tm);t.rotation.z=Math.PI/2;t.position.set(0,1.8+i*0.42,-1.4+j*0.7);S.add(t);}
 const hw=new T.Mesh(new T.BoxGeometry(7.9,0.5,3.9),new T.MeshStandardMaterial({color:0x2a6fd6,transparent:true,opacity:0.6}));hw.position.y=0.65;S.add(hw);
 const stm=pts(T,140,0xffffff,0.3);S.add(stm);const sv=[];for(let i=0;i<140;i++)sv.push({x:(Math.random()-.5)*7,y:Math.random()*5,z:(Math.random()-.5)*3.6});
 st.label(A.C.reactors.lblIn.steamIn,[0,6.2,0]);st.label(A.C.reactors.lblIn.coldTubes,[4.8,3,0]);st.label(A.C.reactors.lblIn.hotwell,[4.8,0.6,0]);
 return function(dt){const s=sim.s,on=s.P>2&&!s.scram&&!s.sbo;stm.visible=on;const a=stm.geometry.attributes.position;
  sv.forEach((p,i)=>{p.y-=dt*(p.y>3.8?1.5:3);if(p.y<0.9)p.y=6;const isW=p.y<3.8;a.setXYZ(i,p.x,p.y,p.z);});a.needsUpdate=true;stm.material.color.setHex(0xcfe6ff);};};
/* ---------- cooling tower ---------- */
B.tower=function(st,sim){const T=THREE,S=st.scene;
 const prof=[[5,0],[4.5,2.4],[3.6,5.5],[3.1,8],[3.0,9.4],[3.3,11.5]].map(p=>new T.Vector2(p[0],p[1]));
 const tw=new T.Mesh(new T.LatheGeometry(prof,48,Math.PI/2,Math.PI),new T.MeshStandardMaterial({color:0xc4c7cb,map:A.tex.concrete(),roughness:0.9,side:T.DoubleSide}));S.add(tw);
 const fill=new T.Mesh(new T.CylinderGeometry(4.2,4.2,0.8,40,1,false,Math.PI/2,Math.PI),new T.MeshStandardMaterial({color:0x6b7280,roughness:0.8}));fill.position.y=1.8;S.add(fill);
 const pool=new T.Mesh(new T.CircleGeometry(4.8,40),new T.MeshStandardMaterial({color:0x2a6fd6,roughness:0.2}));pool.rotation.x=-Math.PI/2;pool.position.y=0.05;S.add(pool);
 const drops=pts(T,200,0x8cc8ff,0.12);S.add(drops);const dv=[];for(let i=0;i<200;i++)dv.push({x:(Math.random()-.5)*7,y:Math.random()*3.2,z:-Math.random()*3.5});
 const air=pts(T,120,0xffffff,0.4);S.add(air);const av=[];for(let i=0;i<120;i++)av.push({x:(Math.random()-.5)*5,y:Math.random()*14,z:-Math.random()*3});
 st.label(A.C.reactors.lblIn.hotWater,[0,3.8,1]);st.label(A.C.reactors.lblIn.air,[0,8,1]);st.label(A.C.reactors.lblIn.plume,[0,13,0]);
 return function(dt){const e=(sim.s.scram||sim.s.sbo)?0.1:Math.min(1,sim.s.P/100);const a=drops.geometry.attributes.position;dv.forEach((p,i)=>{p.y-=dt*4;if(p.y<0.1)p.y=3.2;a.setXYZ(i,p.x,p.y,p.z);});a.needsUpdate=true;
  const b=air.geometry.attributes.position;air.geometry.setDrawRange(0,Math.round(120*e));av.forEach((p,i)=>{p.y+=dt*3;if(p.y>15)p.y=0.5;const sc=1-Math.min(1,p.y/9)*0.35;b.setXYZ(i,p.x*sc,p.y,p.z*sc);});b.needsUpdate=true;};};
/* ---------- containment ---------- */
B.cont=function(st,sim){const T=THREE,S=st.scene;
 const layers=[[6,0xc4c7cb],[5.2,0x9aa0a6],[5.05,0xcfd6de]];
 layers.forEach((l,i)=>{const m=new T.MeshStandardMaterial({color:l[1],roughness:i===2?0.3:0.9,metalness:i===2?0.8:0,side:T.DoubleSide,map:i===0?A.tex.concrete():null});
  const c=new T.Mesh(new T.CylinderGeometry(l[0],l[0],6,48,1,true,Math.PI/2,Math.PI),m);c.position.y=3;S.add(c);const d=new T.Mesh(new T.SphereGeometry(l[0],48,20,Math.PI,Math.PI,0,Math.PI/2),m);d.position.y=6;S.add(d);});
 const v=new T.Group();S.add(v);const cap=A.g3.capsule(T,1.1,3,steelM());cap.position.set(-1.5,2.4,-1);v.add(cap);const sg=A.g3.capsule(T,0.8,4,steelM());sg.position.set(1.8,3,-1.6);v.add(sg);
 st.label(A.C.reactors.lblIn.concrete,[6.6,4,0]);st.label(A.C.reactors.lblIn.liner,[5.2,7.5,0]);st.label(A.C.reactors.lbl.reactor,[-1.5,5,-1]);
 return function(){};};
B.rpump=B.pump;
/* ---------- overlay controller ---------- */
A.openDetail=function(sim,key,plantEl){
 const D=A.C.reactors.det[key]||A.C.reactors.det.reactor;
 const ov=document.createElement('div');ov.className='det3d';
 ov.innerHTML=`<div class="det-stage"></div><div class="det-info"><button class="btn det-back">${A.C.reactors.back}</button><h4>${D.t}</h4><ol>${D.s.map(x=>`<li>${x}</li>`).join('')}</ol><p class="det-fact">💡 ${D.f}</p></div>`;
 plantEl.appendChild(ov);plantEl.classList.add('det-open');
 const stage=ov.querySelector('.det-stage');
 const T=THREE;const st=A.stage3d(stage,{target:new T.Vector3(0,3.4,0),az:-0.5,el:0.25,dist:key==='tower'?28:key==='cont'?22:16,minD:5,maxD:45,near:0.05,far:300,fov:42});
 base(st);let upd=null;try{upd=(B[key]||B.reactor)(st,sim);}catch(e){console.error(e);}
 const api={update(dt){if(upd)upd(dt);st.render();},close(){st.dispose();ov.remove();plantEl.classList.remove('det-open');}};
 ov.querySelector('.det-back').onclick=()=>{sim.det=null;api.close();};
 return api;
};
})(APP);
