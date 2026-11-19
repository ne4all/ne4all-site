/* ===== Realistic 3D nuclear plant (three.js) ===== */
(function(A){
A.plant3d=function(sim,container){
 const T=THREE,id=sim.id,L=A.C.reactors.lbl;
 const st=A.stage3d(container,{target:new T.Vector3(24,7,-2),az:-0.55,el:0.32,dist:96,minD:30,maxD:190,exposure:1.05});
 const S=st.scene;
 S.background=A.tex.sky(A.isDark&&!A.isDark()?['#5b8fd0','#86b3e3','#b6d3ef','#dbe9f6','#eef3f7']:['#141a35','#2c2a55','#5b3c6e','#b0627a','#e79a7a']);
 S.fog=new T.Fog(A.isDark&&!A.isDark()?0xcfdcec:0x6a4a6e,140,460);
 S.add(new T.HemisphereLight(0xbfc8ff,0x3a2a3a,0.65));
 const sun=new T.DirectionalLight(0xffc9a0,1.5);sun.position.set(-60,45,55);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
 const sc=sun.shadow.camera;sc.left=-80;sc.right=90;sc.top=60;sc.bottom=-60;sc.near=10;sc.far=250;sc.updateProjectionMatrix();sun.target.position.set(25,0,-5);S.add(sun);S.add(sun.target);
 const conT=A.tex.concrete();
 const M={
  con:new T.MeshStandardMaterial({color:0xc4c7cb,map:conT,roughness:0.92,metalness:0,side:T.DoubleSide}),
  conIn:new T.MeshStandardMaterial({color:0x7e838a,roughness:0.95,side:T.DoubleSide}),
  steel:new T.MeshStandardMaterial({color:0xcfd6de,roughness:0.32,metalness:0.85,side:T.DoubleSide}),
  steelD:new T.MeshStandardMaterial({color:0x8a939e,roughness:0.45,metalness:0.8}),
  hot:new T.MeshStandardMaterial({color:0xb5805e,roughness:0.4,metalness:0.7}),
  cold:new T.MeshStandardMaterial({color:0x6383ac,roughness:0.4,metalness:0.7}),
  steam:new T.MeshStandardMaterial({color:0xbcc4cc,roughness:0.35,metalness:0.8}),
  yel:new T.MeshStandardMaterial({color:0xe0b43a,roughness:0.5,metalness:0.4}),
  clad:new T.MeshStandardMaterial({color:0x5a6878,roughness:0.6,metalness:0.5}),
  roof:new T.MeshStandardMaterial({color:0x6b7480,roughness:0.7,metalness:0.3}),
  turb:new T.MeshStandardMaterial({color:0x6f9488,roughness:0.35,metalness:0.6}),
  gen:new T.MeshStandardMaterial({color:0x6d5aa8,roughness:0.35,metalness:0.6,emissive:0xffc860,emissiveIntensity:0}),
  fuel:new T.MeshStandardMaterial({color:0x22324a,roughness:0.4,metalness:0.6,emissive:0x8fd6ff,emissiveIntensity:0.3}),
  water:new T.MeshStandardMaterial({color:0x2a6fd6,transparent:true,opacity:0.38,roughness:0.1,metalness:0.1,emissive:0x3d8bff,emissiveIntensity:0.1,side:T.DoubleSide,depthWrite:false}),
  rod:new T.MeshStandardMaterial({color:0xdfe4ea,roughness:0.25,metalness:0.9}),
  win:new T.MeshStandardMaterial({color:0x111111,emissive:0xffd28a,emissiveMap:A.tex.windows(14,2,0.85),emissiveIntensity:0.6,roughness:0.6}),
  alarm:new T.MeshStandardMaterial({color:0x330000,emissive:0xff2a2a,emissiveIntensity:0})
 };
 const add=(geo,mat,x,y,z,o)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;if(o&&o.rx)m.rotation.x=o.rx;if(o&&o.ry)m.rotation.y=o.ry;if(o&&o.rz)m.rotation.z=o.rz;(o&&o.p?o.p:S).add(m);return m;};
 // ground & site
 const gnd=add(new T.PlaneGeometry(900,900),new T.MeshStandardMaterial({color:0x26332a,roughness:1}),0,0,0,{rx:-Math.PI/2});gnd.castShadow=false;
 add(new T.PlaneGeometry(100,56),new T.MeshStandardMaterial({color:0x3a3d42,roughness:0.95}),26,0.02,-3,{rx:-Math.PI/2}).castShadow=false;
 add(new T.PlaneGeometry(900,7),new T.MeshStandardMaterial({color:0x222428,roughness:0.9}),0,0.03,22,{rx:-Math.PI/2}).castShadow=false;
 for(let i=-40;i<40;i++)add(new T.PlaneGeometry(4,0.35),new T.MeshBasicMaterial({color:0xe6dca0}),i*10,0.04,22,{rx:-Math.PI/2});
 // hills
 const hm=new T.MeshStandardMaterial({color:0x2a2238,roughness:1});
 [[-120,-300,90],[40,-330,120],[200,-310,100],[330,-280,80],[-260,-260,110]].forEach(h=>{const m=new T.Mesh(new T.SphereGeometry(h[2],24,12,0,Math.PI*2,0,Math.PI/2),hm);m.position.set(h[0],-h[2]*0.35,h[1]);m.scale.y=0.45;S.add(m);});
 // ===== containment (cutaway) =====
 const R=11,H=15;
 add(new T.CylinderGeometry(R,R,H,56,1,true,Math.PI/2,Math.PI),M.con,0,H/2,0);
 add(new T.CylinderGeometry(R-0.8,R-0.8,H,56,1,true,Math.PI/2,Math.PI),M.conIn,0,H/2,0);
 add(new T.SphereGeometry(R,56,24,Math.PI,Math.PI,0,Math.PI/2),M.con,0,H,0);
 add(new T.SphereGeometry(R-0.8,56,24,Math.PI,Math.PI,0,Math.PI/2),M.conIn,0,H,0);
 add(new T.BoxGeometry(0.8,H,0.06),M.con,R-0.4,H/2,0);add(new T.BoxGeometry(0.8,H,0.06),M.con,-(R-0.4),H/2,0);
 add(new T.RingGeometry(R-0.8,R,56,1,0,Math.PI),M.con,0,H,0);
 add(new T.CylinderGeometry(R+0.6,R+0.6,0.6,56),M.con,0,0.3,0);
 add(new T.CylinderGeometry(R-0.8,R-0.8,0.2,56,1,false,Math.PI/2,Math.PI),M.conIn,0,0.7,0);
 add(new T.BoxGeometry(2*R-2,0.6,0.8),M.yel,0,H-0.6,-3);
 const inL=new T.PointLight(0xffd9a0,0.9,45);inL.position.set(0,13,-4);S.add(inL);
 const alarm=add(new T.SphereGeometry(0.45,16,12),M.alarm,0,H+R+0.3,0);
 const coreL=new T.PointLight(0x6fb7ff,1,22);S.add(coreL);
 const lab={};
 lab.cont=st.label(L.cont,[0,H+R+3,0]);
 // ===== reactor =====
 const rods=[],bubbles={};let core={};
 if(id!=='candu'){
  const vx=-4.5,vz=0.6,vh=id==='bwr'?11:9,vy=2.4+vh/2,vr=2.3;
  // bio shield
  add(new T.BoxGeometry(0.9,6,7),M.con,vx-3.6,3.3,vz-0.6);add(new T.BoxGeometry(0.9,6,7),M.con,vx+3.6,3.3,vz-0.6);add(new T.BoxGeometry(8.1,6,0.9),M.con,vx,3.3,vz-4);
  add(new T.CylinderGeometry(vr,vr,vh,44,1,true,Math.PI/2,Math.PI),M.steel,vx,vy,vz);
  add(new T.SphereGeometry(vr,44,16,Math.PI,Math.PI,Math.PI/2,Math.PI/2),M.steel,vx,vy-vh/2,vz);
  add(new T.SphereGeometry(vr,44,16,Math.PI,Math.PI,0,Math.PI/2),M.steel,vx,vy+vh/2,vz);
  add(new T.BoxGeometry(0.22,vh,0.05),M.steelD,vx+vr-0.1,vy,vz);add(new T.BoxGeometry(0.22,vh,0.05),M.steelD,vx-vr+0.1,vy,vz);
  add(new T.TorusGeometry(vr+0.15,0.25,10,40,Math.PI),M.steelD,vx,vy+vh/2-0.3,vz,{rx:Math.PI/2,rz:Math.PI});
  // water (half volume + cut plane)
  const wh=id==='bwr'?vh*0.62:vh-0.2,wy=vy-vh/2+wh/2;
  add(new T.CylinderGeometry(vr-0.15,vr-0.15,wh,36,1,true,Math.PI/2,Math.PI),M.water,vx,wy,vz).castShadow=false;
  add(new T.PlaneGeometry(2*(vr-0.15),wh),M.water,vx,wy,vz+0.01).castShadow=false;
  // fuel
  const cy=vy-vh/2+3.0,fh=4.2;core={y:cy,h:fh};
  [[-1.35,-0.55],[-0.68,-0.55],[0,-0.55],[0.68,-0.55],[1.35,-0.55],[-0.68,-1.3],[0,-1.3],[0.68,-1.3]].forEach(p=>add(new T.BoxGeometry(0.5,fh,0.5),M.fuel,vx+p[0],cy,vz+p[1]));
  [-1.0,-0.34,0.34,1.0].forEach(dx=>{const g=new T.Group();const r=new T.Mesh(new T.CylinderGeometry(0.09,0.09,fh,10),M.rod);g.add(r);const sh=new T.Mesh(new T.CylinderGeometry(0.05,0.05,8,8),M.rod);sh.position.y=(id==='bwr'?-1:1)*(fh/2+4);g.add(sh);g.position.set(vx+dx,cy,vz-0.55);S.add(g);rods.push(g);});
  coreL.position.set(vx,cy,vz+1.2);
  if(id==='pwr'){[-0.9,-0.3,0.3,0.9].forEach(dx=>add(new T.CylinderGeometry(0.2,0.2,2.2,12),M.steelD,vx+dx,vy+vh/2+vr*0.7,vz-0.5));
   // steam generator
   const sx=3.4,sz=-2.4;
   const lo=A.g3.capsule(T,1.3,8,M.steel);lo.position.set(sx,6.2,sz);S.add(lo);
   add(new T.CylinderGeometry(1.9,1.3,1.4,32),M.steel,sx,10.9,sz);
   const up=A.g3.capsule(T,1.9,3,M.steel);up.position.set(sx,13,sz);S.add(up);
   const pz=A.g3.capsule(T,0.8,3.6,M.steel);pz.position.set(7.2,8,1.6);S.add(pz);
   const pump=A.g3.capsule(T,0.75,1.2,new T.MeshStandardMaterial({color:0x3f7aa0,metalness:0.6,roughness:0.35}));pump.position.set(0.8,2.4,2.4);S.add(pump);
   core.hot=A.g3.tube(T,[[vx+2,cy+1.2,vz+0.2],[0.2,cy+1.1,-1],[2.3,4.6,-2.2],[sx,2.4,sz]],0.55,M.hot);S.add(core.hot);
   core.cold=A.g3.tube(T,[[sx+0.6,2.3,sz+0.9],[2.6,2.4,1.8],[0.8,2.4,2.4],[-1.4,cy+0.4,1.6],[vx+2,cy+0.6,vz+0.6]],0.5,M.cold);S.add(core.cold);
   S.add(A.g3.tube(T,[[7.2,5.4,1.6],[5,5.2,0.6],[1.2,cy+1.1,-0.8]],0.22,M.hot));
   core.steamFrom=[[sx,15,sz],[sx,16.3,-4.2]];core.fwTo=[[4.6,9,sz+0.4]];
   lab.sg=st.label(L.sg,[sx,17.8,sz]);lab.pzr=st.label(L.pzr,[7.2,11.2,1.6]);lab.pump=st.label(L.pump,[0.8,4.1,2.6]);
  }else{
   // dryer / separators
   for(let i=-1;i<=1;i++)for(let j=0;j<2;j++)add(new T.CylinderGeometry(0.32,0.32,2.2,12),M.steelD,vx+i*0.8,vy+vh/2-2.2,vz-0.4-j*0.8);
   // bubbles
   const n=180,g=new T.BufferGeometry(),pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=vx+(Math.random()-.5)*3.4;pos[i*3+1]=cy-fh/2+Math.random()*(wh-1);pos[i*3+2]=vz-Math.random()*1.6;}
   g.setAttribute('position',new T.BufferAttribute(pos,3));
   bubbles.p=new T.Points(g,new T.PointsMaterial({color:0xe8f4ff,size:0.18,transparent:true,opacity:0.85,depthWrite:false}));bubbles.n=n;bubbles.y0=cy-fh/2;bubbles.y1=wy+wh/2;S.add(bubbles.p);
   const rp=A.g3.capsule(T,0.7,1.1,new T.MeshStandardMaterial({color:0x3f7aa0,metalness:0.6,roughness:0.35}));rp.position.set(vx+4.6,2.2,vz+2.2);S.add(rp);
   core.cold=A.g3.tube(T,[[vx+2,cy-1,vz+0.5],[vx+4.6,3.6,vz+2.2],[vx+4.6,1.4,vz+2.2],[vx+2,vy-vh/2+0.6,vz+0.4]],0.35,M.cold);S.add(core.cold);
   core.steamFrom=[[vx,vy+vh/2+vr,vz],[vx,17,-3.5]];core.fwTo=[[vx+2,vy+1,vz-0.5]];
   lab.rpump=st.label(L.rpump,[vx+4.6,4.6,vz+2.6]);
  }
  lab.reactor=st.label(L.reactor,[vx,vy+vh/2+vr+1.6,vz]);
  core.vx=vx;
 }else{
  const cx=-3.6,cyy=6.6,cz=-0.4,cr=3.0,cl=7.2;
  add(new T.BoxGeometry(cl+2,3.6,7),M.con,cx,1.8,cz-0.4);
  const shell=add(new T.CylinderGeometry(cr,cr,cl,44,1,true,Math.PI/2,Math.PI),M.steel,cx,cyy,cz,{rz:Math.PI/2});
  [-1,1].forEach(s=>{add(new T.CylinderGeometry(cr+0.3,cr+0.3,0.7,44),M.steelD,cx+s*(cl/2+0.35),cyy,cz,{rz:Math.PI/2});});
  add(new T.CylinderGeometry(cr-0.12,cr-0.12,cl,36,1,true,Math.PI/2,Math.PI),M.water,cx,cyy,cz,{rz:Math.PI/2}).castShadow=false;
  add(new T.PlaneGeometry(cl,2*(cr-0.12)),M.water,cx,cyy,cz+0.01).castShadow=false;
  for(let i=-2;i<=2;i++)for(let j=0;j<2;j++){if(Math.abs(i)===2&&j===1)continue;add(new T.CylinderGeometry(0.17,0.17,cl+1.6,12),M.fuel,cx,cyy+i*0.95,cz-0.5-j*1.1,{rz:Math.PI/2});}
  core.zone=[];[-2,0,2].forEach(dx=>{add(new T.CylinderGeometry(0.28,0.28,6.4,14),new T.MeshStandardMaterial({color:0x9fd6ff,transparent:true,opacity:0.25,depthWrite:false}),cx+dx,cyy,cz-0.2);const f=add(new T.CylinderGeometry(0.24,0.24,6.2,14),new T.MeshStandardMaterial({color:0x38bdf8,emissive:0x0b5c8a,emissiveIntensity:0.6}),cx+dx,cyy,cz-0.2);core.zone.push(f);});
  [-1,1].forEach(dx=>{const r=add(new T.CylinderGeometry(0.12,0.12,6,10),M.rod,cx+dx,cyy,cz-0.9);rods.push(r);});
  core.fm=[];[-1,1].forEach(s=>{const g=new T.Group();const b=new T.Mesh(new T.BoxGeometry(1.6,1.8,1.8),M.yel);b.castShadow=true;g.add(b);const p=new T.Mesh(new T.BoxGeometry(0.5,cyy-1,0.5),M.steelD);p.position.y=-(cyy-1)/2-0.4;g.add(p);g.position.set(cx+s*(cl/2+2.6),cyy,cz);g.userData.s=s;S.add(g);core.fm.push(g);});
  coreL.position.set(cx,cyy,cz+2);core.y=cyy;core.cx=cx;core.cl=cl;
  const sx=4.2,sz=-2.6;
  const lo=A.g3.capsule(T,1.2,7.6,M.steel);lo.position.set(sx,6.2,sz);S.add(lo);add(new T.CylinderGeometry(1.8,1.2,1.3,32),M.steel,sx,10.7,sz);const up=A.g3.capsule(T,1.8,2.8,M.steel);up.position.set(sx,12.7,sz);S.add(up);
  core.hot=A.g3.tube(T,[[cx+cl/2+0.4,cyy+1,cz-0.6],[1.8,cyy+1.4,-1.8],[3,3.4,sz+0.2],[sx,2.4,sz]],0.45,M.hot);S.add(core.hot);
  core.cold=A.g3.tube(T,[[sx+0.5,2.3,sz+0.9],[2.6,2.2,1.6],[0.4,cyy-1.6,0.6],[cx+cl/2+0.4,cyy-1,cz+0.3]],0.42,M.cold);S.add(core.cold);
  core.steamFrom=[[sx,14.6,sz],[sx,16.3,-4.4]];core.fwTo=[[5.4,8.8,sz+0.3]];
  lab.reactor=st.label(L.cal,[cx,cyy+4.6,cz]);lab.sg=st.label(L.sg,[sx,17.2,sz]);lab.fm=st.label(L.fm,[cx,cyy-4.2,cz+3]);lab.fm.show=false;
 }
 // ===== turbine hall =====
 const hx0=17,hx1=46,hz0=-8.5,hz1=6.5,hH=13,hxc=(hx0+hx1)/2,hw=hx1-hx0;
 add(new T.BoxGeometry(hw,0.4,hz1-hz0),M.con,hxc,0.2,(hz0+hz1)/2);
 add(new T.BoxGeometry(hw,hH,0.4),M.clad,hxc,hH/2,hz0);
 add(new T.PlaneGeometry(hw-2,1.4),M.win,hxc,hH-2.2,hz0+0.22);
 add(new T.BoxGeometry(0.4,hH,hz1-hz0),M.clad,hx1,hH/2,(hz0+hz1)/2);add(new T.BoxGeometry(0.4,hH,hz1-hz0),M.clad,hx0,hH/2,(hz0+hz1)/2);
 add(new T.BoxGeometry(hw+0.8,0.7,8),M.roof,hxc,hH+0.3,hz0+4);
 for(let x=hx0;x<=hx1+0.1;x+=29/4)add(new T.BoxGeometry(0.5,hH,0.5),M.clad,x,hH/2,hz1);
 add(new T.BoxGeometry(hw,0.5,0.5),M.clad,hxc,hH,hz1);
 add(new T.BoxGeometry(hw-1,0.5,0.7),M.yel,hxc,hH-1.6,-1);
 const hallL=new T.PointLight(0xdfe8ff,0.8,40);hallL.position.set(hxc,10,-2);S.add(hallL);
 add(new T.BoxGeometry(24,3,5.2),M.con,31.5,1.7,-1.4);
 const ty=5.2,tz=-1.4;
 const cyl=(r,l,x,mat)=>add(new T.CylinderGeometry(r,r,l,40),mat,x,ty,tz,{rz:Math.PI/2});
 cyl(1.35,4,22.5,M.turb);cyl(1.1,0.6,24.8,M.steelD);cyl(2.3,5,28,M.turb);cyl(2.3,5,34,M.turb);cyl(1.9,5.4,40.6,M.gen);
 add(new T.CylinderGeometry(0.3,0.3,22,12),M.steelD,32,ty,tz,{rz:Math.PI/2});
 const coup=[];[25.6,31,37.2].forEach(x=>{const g=new T.Group();g.position.set(x,ty,tz);const d=new T.Mesh(new T.CylinderGeometry(0.9,0.9,0.35,24),M.steelD);d.rotation.z=Math.PI/2;g.add(d);for(let i=0;i<4;i++){const b=new T.Mesh(new T.BoxGeometry(0.4,1.9,0.18),M.yel);b.rotation.x=i*Math.PI/4;g.add(b);}S.add(g);coup.push(g);});
 const genGlow=new T.Sprite(new T.SpriteMaterial({map:A.tex.glow(),color:0xffd27a,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending}));genGlow.scale.set(12,12,1);genGlow.position.set(40.6,ty,tz+1);S.add(genGlow);
 add(new T.BoxGeometry(11,2.4,3.4),new T.MeshStandardMaterial({color:0x4a535e,metalness:0.6,roughness:0.5}),31,1.4,4);
 lab.turb=st.label(L.turb,[28,9.6,tz]);lab.gen=st.label(L.gen,[40.6,9,tz]);lab.cond=st.label(L.cond,[31,4.2,5]);lab.mwe=st.label('0 MWe',[40.6,1.6,3.8],'mwe');
 // steam & feedwater lines
 const steamPts=core.steamFrom.concat([[9,16.3,-7.5],[15,13,-6.8],[19.5,8,-3],[21,ty,tz]]);
 const steamL=A.g3.tube(T,steamPts,0.45,M.steam);S.add(steamL);
 const fwPts=[[28,1.3,2.4],[22,1.4,-5.5],[12,2,-7],[7,4,-6]].concat(core.fwTo);
 const fwL=A.g3.tube(T,fwPts,0.28,M.cold);S.add(fwL);
 add(new T.CylinderGeometry(0.5,0.5,3,16),M.steam,31,3.2,1.6);
 // transformer & pylon
 add(new T.BoxGeometry(3.2,3,2.6),M.clad,49.5,1.5,3);for(let i=0;i<5;i++)add(new T.BoxGeometry(0.12,2.6,2.8),M.steelD,48.1+i*0.7,1.5,3);
 const lat=[];const P0=[54,0,8],ph=24;const lw=(y)=>2.6-1.9*y/ph;
 for(let i=0;i<8;i++){const y1=ph*i/8,y2=ph*(i+1)/8,a1=lw(y1),a2=lw(y2);[[-1,-1],[1,-1],[1,1],[-1,1]].forEach((c,k,arr)=>{const n=arr[(k+1)%4];lat.push(P0[0]+c[0]*a1,y1,P0[2]+c[1]*a1,P0[0]+c[0]*a2,y2,P0[2]+c[1]*a2);lat.push(P0[0]+c[0]*a1,y1,P0[2]+c[1]*a1,P0[0]+n[0]*a2,y2,P0[2]+n[1]*a2);});}
 [16,20].forEach(y=>{lat.push(P0[0]-5,y,P0[2],P0[0]+5,y,P0[2]);});
 const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lat,3));S.add(new T.LineSegments(lg,new T.LineBasicMaterial({color:0x8a919a})));
 const wireMat=new T.LineBasicMaterial({color:0x9aa0a8});const wires=[];
 [[-4,16],[4,16],[-4,20],[4,20]].forEach(w=>{[[ [49.5,3,3],[P0[0]+w[0],w[1],P0[2]] ],[ [P0[0]+w[0],w[1],P0[2]],[P0[0]+w[0]+160,w[1]+6,P0[2]-60] ]].forEach(seg=>{const a=new T.Vector3(...seg[0]),b=new T.Vector3(...seg[1]),m=a.clone().lerp(b,0.5);m.y-=a.distanceTo(b)*0.04;const c=new T.QuadraticBezierCurve3(a,m,b);const l=new T.Line(new T.BufferGeometry().setFromPoints(c.getPoints(24)),wireMat);S.add(l);wires.push(l);});});
 // cooling tower or lake
 const plume=[];let towerTop=null,beacon=null;
 if(id!=='candu'){
  const pts=[[15,0],[13.6,6],[11.3,14],[9.6,22],[9.3,26],[9.7,32],[10.4,37]].map(p=>new T.Vector2(p[0],p[1]));
  const tw=new T.Mesh(new T.LatheGeometry(pts,64),M.con);tw.position.set(68,1.6,-18);tw.castShadow=true;tw.receiveShadow=true;S.add(tw);
  add(new T.TorusGeometry(10.4,0.35,8,64),M.conIn,68,38.6,-18,{rx:Math.PI/2});
  for(let i=0;i<28;i++){const a=i/28*Math.PI*2;add(new T.CylinderGeometry(0.25,0.25,2.2,6),M.conIn,68+Math.cos(a)*15,0.9,-18+Math.sin(a)*15,{rz:0.5*Math.sin(a*3)});}
  towerTop=new T.Vector3(68,38.6,-18);beacon=add(new T.SphereGeometry(0.4,10,8),M.alarm.clone(),78.4,39,-18);
  lab.tower=st.label(L.tower,[68,44,-18]);
 }else{
  const lake=new T.Mesh(new T.CircleGeometry(30,64),new T.MeshStandardMaterial({color:0x1f3d62,roughness:0.15,metalness:0.35}));lake.rotation.x=-Math.PI/2;lake.position.set(72,0.05,-20);lake.receiveShadow=true;S.add(lake);
  add(new T.BoxGeometry(6,4,5),M.clad,52,2,-10);S.add(A.g3.tube(T,[[52,0.6,-12],[60,0.3,-16],[64,0.2,-18]],0.6,M.cold));
  lab.lake=st.label(L.lake,[72,3,-20]);
 }
 const CK={cont:'cont',reactor:id==='candu'?'cal':'reactor',sg:'sg',pzr:'pzr',pump:'pump',rpump:'rpump',turb:'turb',gen:'gen',cond:'cond',tower:'tower'};
 Object.keys(CK).forEach(k=>{const l=lab[k];if(!l)return;l.d.classList.add('click');l.d.textContent='🔍 '+l.d.textContent;l.d.addEventListener('click',e=>{e.stopPropagation();if(sim.det)sim.det.close();sim.det=A.openDetail(sim,CK[k],container);});});
 const puffMat=new T.SpriteMaterial({map:A.tex.puff(),color:0xf6eef4,transparent:true,depthWrite:false,opacity:0.8});
 // flows
 const flows=[];
 if(core.hot){const f=A.g3.flow(T,core.hot.userData.curve,14,0xffa060,0.55);S.add(f);flows.push([f,'pri','hot']);}
 if(core.cold){const f=A.g3.flow(T,core.cold.userData.curve,14,0x8cc8ff,0.55);S.add(f);flows.push([f,'pri','cold']);}
 {const f=A.g3.flow(T,steamL.userData.curve,26,0xffffff,0.6);S.add(f);flows.push([f,'steam']);}
 {const f=A.g3.flow(T,fwL.userData.curve,20,0x8cc8ff,0.4);S.add(f);flows.push([f,'steam']);}
 const smoke=[];
 const t0=performance.now();
 function update(dt){
  if(sim.det){sim.det.update(dt);return;}
  const s=sim.s,c=sim.c,t=(performance.now()-t0)/1000,g=Math.min(s.P/100,1.3),e=(s.scram||s.sbo||s.dmg)?0:Math.min(s.P/100,1),flow=(c.flow||100)/100;
  M.water.emissiveIntensity=0.05+1.5*Math.min(g,1.2);M.fuel.emissiveIntensity=0.15+2.6*Math.min(g,1.2);coreL.intensity=0.15+3.5*Math.min(g,1.2);
  if(s.dmg){M.fuel.emissive.setHex(0xff5a1f);coreL.color.setHex(0xff6a2a);coreL.intensity=3+Math.sin(t*6);M.fuel.emissiveIntensity=2.5;}else{M.fuel.emissive.setHex(0x8fd6ff);coreL.color.setHex(0x6fb7ff);}
  const ins=((c.rod!==undefined?c.rod:c.zone)||0)/100;
  if(id==='pwr')rods.forEach(r=>r.position.y=core.y+(1-ins)*(core.h+0.3));
  else if(id==='bwr')rods.forEach(r=>r.position.y=core.y-(1-ins)*(core.h+0.3));
  else{rods.forEach(r=>r.position.y=core.y+((s.adj||s.scram)?0:6.4));core.zone.forEach(z=>{const k=Math.max(0.02,c.zone/100);z.scale.y=k;z.position.y=core.y-3.1+3.1*k;});
   const fm=sim.fm||0;core.fm.forEach(m=>{m.position.x=core.cx+m.userData.s*(core.cl/2+2.6-1.4*Math.sin(Math.min(fm,1)*Math.PI));});lab.fm.show=fm>0;if(sim.fm>0)sim.fm=Math.max(0,sim.fm-dt*0.5);}
  if(bubbles.p){const n=Math.round((s.v||0)*bubbles.n);bubbles.p.geometry.setDrawRange(0,n);const a=bubbles.p.geometry.attributes.position;for(let i=0;i<n;i++){let y=a.getY(i)+dt*(1.5+i%5*0.3);if(y>bubbles.y1)y=bubbles.y0;a.setY(i,y);}a.needsUpdate=true;}
  const spin=(s.scram||s.sbo||s.dmg)?Math.max(0,(sim.spin||0)-dt*0.3):0.02+0.32*Math.min(s.P/100,1.4);sim.spin=spin;coup.forEach(cg=>cg.rotation.x+=spin);
  M.gen.emissiveIntensity=0.5*e;genGlow.material.opacity=0.55*e;M.win.emissiveIntensity=0.25+1.1*e;
  wireMat.color.setRGB(0.6+0.4*e,0.62+0.3*e,0.66-0.1*e);
  flows.forEach(f=>{const on=f[1]==='pri'?true:s.P>2&&!s.scram&&!s.sbo;f[0].visible=on;if(on)A.g3.stepFlow(f[0],(f[1]==='pri'?(s.sbo&&!s.eccs?0.0004:0.0015+0.004*flow):0.004)*dt*60);});
  const blink=Math.floor(t*(s.scram||s.dmg?3:1.2))%2===0;M.alarm.emissiveIntensity=(s.scram||s.dmg)?(blink?3:0):(blink?1.2:0);if(beacon)beacon.material.emissiveIntensity=blink?2:0.1;
  if(towerTop){if(e>0.02&&Math.random()<0.3+0.6*e&&plume.length<70){const sp=new T.Sprite(puffMat.clone());sp.position.set(towerTop.x+(Math.random()-.5)*12,towerTop.y,towerTop.z+(Math.random()-.5)*12);sp.userData={a:0.35+0.45*e,s:8+Math.random()*5,vx:1.2+Math.random(),vy:2.5+Math.random()*1.5};sp.scale.set(sp.userData.s,sp.userData.s,1);S.add(sp);plume.push(sp);}
   for(let i=plume.length-1;i>=0;i--){const p=plume[i],u=p.userData;p.position.x+=u.vx*dt*3;p.position.y+=u.vy*dt*3;u.s+=dt*5;u.a-=dt*0.12;p.scale.set(u.s,u.s,1);p.material.opacity=Math.max(0,u.a);if(u.a<=0){S.remove(p);p.material.dispose();plume.splice(i,1);}}}
  if(s.dmg&&Math.random()<0.3&&smoke.length<40){const sp=new T.Sprite(new T.SpriteMaterial({map:A.tex.puff(),color:0x3a3434,transparent:true,depthWrite:false,opacity:0.7}));sp.position.set((core.vx||core.cx||0)+(Math.random()-.5)*3,H+R-1,(Math.random()-.5)*3);sp.userData={a:0.7,s:4};S.add(sp);smoke.push(sp);}
  for(let i=smoke.length-1;i>=0;i--){const p=smoke[i],u=p.userData;p.position.y+=dt*4;p.position.x+=dt*1.5;u.s+=dt*3;u.a-=dt*0.15;p.scale.set(u.s,u.s,1);p.material.opacity=Math.max(0,u.a);if(u.a<=0){S.remove(p);p.material.dispose();smoke.splice(i,1);}}
  lab.mwe.d.textContent=sim.mwe+' MWe';
  st.render();
 }
 return {update,dispose(){if(sim.det){try{sim.det.close();}catch(e){}sim.det=null;}st.dispose();}};
};
})(APP);
