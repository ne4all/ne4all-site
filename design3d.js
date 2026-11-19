/* ===== 3D view for "Design Your Reactor" ===== */
(function(A){
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=4;return t;}
A.design3d=function(host){
 const T=THREE,st=A.stage3d(host,{az:-0.75,el:0.38,dist:14,minD:3,maxD:60,fov:36,exposure:1.05,maxPR:1.75});
 const S=st.scene;S.background=new T.Color(A.isDark&&!A.isDark()?0xEEF2F8:0x0a0716);S.fog=null;
 const hemi=new T.HemisphereLight(0xc7d2fe,0x1b1430,.55);S.add(hemi);
 const sun=new T.DirectionalLight(0xffffff,1.15);sun.position.set(-8,14,10);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);S.add(sun);S.add(sun.target);
 const rim=new T.DirectionalLight(0x8b5cf6,.45);rim.position.set(10,6,-10);S.add(rim);
 const coreLight=new T.PointLight(0x60a5fa,0,30,2);S.add(coreLight);
 const conc=A.tex.concrete();
 const M={
  steel:new T.MeshStandardMaterial({color:0xa3acb8,metalness:.85,roughness:.3,side:T.DoubleSide}),
  steelIn:new T.MeshStandardMaterial({color:0x5b6573,metalness:.7,roughness:.45,side:T.DoubleSide}),
  dark:new T.MeshStandardMaterial({color:0x1d1d22,metalness:.35,roughness:.55}),
  conc:new T.MeshStandardMaterial({map:conc,color:0xbfc3c8,roughness:.95,side:T.DoubleSide}),
  floor:new T.MeshStandardMaterial({map:conc,color:0x8e939a,roughness:.9})
 };
 const floorTex=conc.clone();floorTex.needsUpdate=true;floorTex.repeat.set(10,10);M.floor.map=floorTex;
 let G=null,rods=null,rodInfo=null,neut=null,glowSpr=null,flows=[],fill=null,lastRods=-1,geo={};
 const tmp=new T.Object3D();
 function clearLabels(){st.lbl.forEach(l=>l.d.remove());st.lbl.length=0;}
 function disposeGroup(g){const keep=[conc,floorTex,rodTex,stripeTex,A.tex._glow];g.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(!Object.values(M).includes(m)){if(m.map&&!keep.includes(m.map))m.map.dispose();m.dispose();}});}});}
 const rodTex=canvasTex(128,128,(x,w,h)=>{x.fillStyle='#3a3f47';x.fillRect(0,0,w,h);const n=17,p=w/n;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const gt=(i%4===2&&j%4===2);x.fillStyle=gt?'#1a1d22':'#c9ced6';x.beginPath();x.arc(p*(i+.5),p*(j+.5),p*.38,0,7);x.fill();}});
 const stripeTex=canvasTex(64,4,(x,w,h)=>{for(let i=0;i<16;i++){x.fillStyle=i%2?'#aeb5bf':'#7d858f';x.fillRect(i*4,0,4,h);}});stripeTex.wrapS=T.RepeatWrapping;
 function holeTex(col){return canvasTex(64,64,(x,w,h)=>{x.fillStyle='#26262b';x.fillRect(0,0,w,h);x.strokeStyle='#36363c';x.strokeRect(1,1,w-2,h-2);x.fillStyle=col;x.beginPath();x.arc(w/2,h/2,w*.22,0,7);x.fill();});}
 function build(d,r){
  if(G){S.remove(G);disposeGroup(G);}clearLabels();flows=[];G=new T.Group();S.add(G);
  const R=d.R,H=2*R,mo=A.RD.MOD[r.mod],co=A.RD.COOL[d.cool],fu=A.RD.F[d.fuel];
  const kind=r.mod==='lw'?'pwr':r.mod==='hw'?'candu':r.mod==='gr'?((d.cool==='gas'&&d.fuel!=='nat')?'pebble':'blocks'):'hex';
  const Rv=R*1.18+.18,Hv=H*1.18+.4;
  // camera-facing cutaway
  const thc=Math.atan2(Math.sin(st.az),Math.cos(st.az)),ts0=thc+Math.PI/4,tl=Math.PI*1.5;
  const horiz=kind==='candu',ts=ts0,tsC=horiz?Math.atan2(Math.sin(st.el),Math.cos(st.el)*Math.cos(st.az))+Math.PI/4:ts0;
  // floor + biological shield
  const fl=new T.Mesh(new T.PlaneGeometry(Rv*24,Rv*24),M.floor);fl.rotation.x=-Math.PI/2;fl.position.y=-Hv/2-Rv*.72;fl.receiveShadow=true;G.add(fl);
  const shield=new T.Mesh(new T.CylinderGeometry(Rv*1.75,Rv*1.75,Hv*.85,64,1,true,ts,tl),M.conc);shield.position.y=fl.position.y+Hv*.425;shield.receiveShadow=true;G.add(shield);
  const shTop=new T.Mesh(new T.RingGeometry(Rv*1.75,Rv*2.05,64,1,ts,tl),M.conc);shTop.rotation.x=-Math.PI/2;shTop.position.y=fl.position.y+Hv*.85;G.add(shTop);
  const shIn=new T.Mesh(new T.CylinderGeometry(Rv*2.05,Rv*2.05,Hv*.85,64,1,true,ts,tl),M.conc);shIn.position.y=shield.position.y;G.add(shIn);
  const core=new T.Group();G.add(core);
  if(horiz){core.rotation.z=Math.PI/2;}
  // vessel (double wall, cut open)
  const ves=new T.Mesh(new T.CylinderGeometry(Rv,Rv,Hv,72,1,true,tsC,tl),M.steel);ves.castShadow=true;ves.receiveShadow=true;
  const vesIn=new T.Mesh(new T.CylinderGeometry(Rv*.96,Rv*.96,Hv,72,1,true,tsC,tl),M.steelIn);
  const vg=new T.Group();vg.add(ves,vesIn);
  if(!horiz){const top=new T.Mesh(new T.SphereGeometry(Rv,48,16,ts,tl,0,Math.PI/2),M.steel);top.position.y=Hv/2;top.scale.y=.55;const bot=top.clone();bot.rotation.x=Math.PI;bot.position.y=-Hv/2;vg.add(top,bot);
   const fl2=new T.Mesh(new T.CylinderGeometry(Rv*1.08,Rv*1.08,.12*R+.05,72,1,false,ts,tl),M.steel);fl2.position.y=Hv/2;vg.add(fl2);}
  else{const e1=new T.Mesh(new T.CylinderGeometry(Rv,Rv,.2*R+.1,72,1,false,tsC,tl),M.steelIn);e1.position.y=Hv/2;const e2=e1.clone();e2.position.y=-Hv/2;vg.add(e1,e2);}
  if(horiz){const og=new T.Group();og.rotation.z=Math.PI/2;og.add(vg);G.add(og);}else G.add(vg);
  // moderator / coolant fill
  const fillCol=r.fast?co.col:mo.col;let op=.32,met=0,rough=.15,emi=0x000000;
  if(r.mod==='hw')op=.42;if(r.mod==='gr')op=0;if(r.fast&&d.cool==='na'){op=.55;met=.9;rough=.25;}if(r.fast&&d.cool==='pb'){op=.7;met=.8;rough=.4;}if(d.cool==='salt'){op=.45;emi=0xff6a00;}if(d.cool==='gas'&&r.fast)op=0;
  fill=null;
  if(op>0){fill=new T.Mesh(new T.CylinderGeometry(Rv*.94,Rv*.94,H*1.06,64,1,false,tsC,tl),new T.MeshStandardMaterial({color:fillCol,transparent:true,opacity:op,metalness:met,roughness:rough,emissive:emi,emissiveIntensity:0,depthWrite:false,side:T.DoubleSide}));fill.renderOrder=2;core.add(fill);}
  // fuel structures
  const fcol=new T.Color(fu.col);let inst=null,count=0;const pos=[];
  if(kind==='pwr'){let a=.215;while(Math.pow(2*R/a,2)*.785>1400)a*=1.15;for(let x=-R;x<=R;x+=a)for(let z=-R;z<=R;z+=a){if(x*x+z*z<(R-a*.4)*(R-a*.4))pos.push([x,0,z]);}
   const mats=[new T.MeshStandardMaterial({map:stripeTex,color:0xffffff,metalness:.6,roughness:.4}),new T.MeshStandardMaterial({map:stripeTex,color:0xffffff,metalness:.6,roughness:.4}),new T.MeshStandardMaterial({map:rodTex,color:fcol.clone().lerp(new T.Color(0xffffff),.6),metalness:.5,roughness:.4}),new T.MeshStandardMaterial({map:rodTex,metalness:.5,roughness:.4}),new T.MeshStandardMaterial({map:stripeTex,metalness:.6,roughness:.4}),new T.MeshStandardMaterial({map:stripeTex,metalness:.6,roughness:.4})];
   inst=new T.InstancedMesh(new T.BoxGeometry(a*.93,H,a*.93),mats,pos.length);}
  else if(kind==='candu'){let a=.286;while(Math.pow(2*R/a,2)*.785>1200)a*=1.15;for(let x=-R;x<=R;x+=a)for(let z=-R;z<=R;z+=a){if(x*x+z*z<(R-a*.4)*(R-a*.4))pos.push([x,0,z]);}
   inst=new T.InstancedMesh(new T.CylinderGeometry(a*.2,a*.2,H*1.12,12),new T.MeshStandardMaterial({color:fcol.clone().lerp(new T.Color(0xb8c0cc),.55),metalness:.75,roughness:.35}),pos.length);}
  else if(kind==='pebble'){const rp=Math.max(.06,Math.min(.22,R/13)),dd=rp*2.05;let n=0;for(let y=-H/2+rp;y<H/2-rp&&n<3500;y+=dd*.82)for(let x=-R;x<=R;x+=dd)for(let z=-R;z<=R;z+=dd){const ox=(Math.round(y/dd)%2)*dd*.5;const X=x+ox,Z=z+ox;if(X*X+Z*Z<(R-rp)*(R-rp)&&n<3500){pos.push([X+(Math.random()-.5)*rp*.3,y,Z+(Math.random()-.5)*rp*.3]);n++;}}
   inst=new T.InstancedMesh(new T.SphereGeometry(rp,14,10),new T.MeshStandardMaterial({color:0x202024,metalness:.25,roughness:.5}),pos.length);}
  else if(kind==='blocks'){let a=.25;while(Math.pow(2*R/a,2)*.785>1600)a*=1.15;for(let x=-R;x<=R;x+=a)for(let z=-R;z<=R;z+=a){if(x*x+z*z<(R-a*.4)*(R-a*.4))pos.push([x,0,z]);}
   const hc=d.cool==='salt'?'#ff7a1a':d.cool==='water'?'#4fa3ff':d.cool==='na'?'#cbd5e1':d.cool==='pb'?'#6b7280':fu.col;const ht=holeTex(hc);
   const side=new T.MeshStandardMaterial({color:0x2a2a2f,metalness:.2,roughness:.75}),topm=new T.MeshStandardMaterial({map:ht,metalness:.2,roughness:.6,emissive:d.cool==='salt'?0xff5a00:0x000000,emissiveMap:d.cool==='salt'?ht:null,emissiveIntensity:0});
   inst=new T.InstancedMesh(new T.BoxGeometry(a*.97,H,a*.97),[side,side,topm,topm,side,side],pos.length);geo.blockTop=topm;}
  else{const a=.17,rh=a/Math.sqrt(3)*.98;for(let j=-40;j<=40;j++)for(let i=-40;i<=40;i++){const x=(i+j*.5)*a,z=j*a*Math.sqrt(3)/2;if(x*x+z*z<(R-a*.45)*(R-a*.45))pos.push([x,0,z]);if(pos.length>1500)break;}
   inst=new T.InstancedMesh(new T.CylinderGeometry(rh,rh,H,6),new T.MeshStandardMaterial({color:fcol.clone().lerp(new T.Color(0x9aa3ad),.6),metalness:.8,roughness:.3}),pos.length);}
  pos.forEach((p,i)=>{tmp.position.set(p[0],p[1],p[2]);tmp.rotation.set(0,kind==='hex'?Math.PI/6:0,0);tmp.updateMatrix();inst.setMatrixAt(i,tmp.matrix);});
  inst.castShadow=true;inst.receiveShadow=true;core.add(inst);count=pos.length;
  // control rods
  const nc=Math.max(4,Math.min(48,Math.round(R*R*5))),rr=Math.max(.03,Math.min(.13,R*.035));rodInfo=[];
  for(let i=0;i<nc;i++){const ring=i<6?.35:i<18?.62:.85,nr=i<6?6:i<18?12:30,k=i<6?i:i<18?i-6:i-18;const a=k/nr*Math.PI*2+(ring*3);rodInfo.push([Math.cos(a)*R*ring,Math.sin(a)*R*ring]);}
  rods=new T.InstancedMesh(new T.CylinderGeometry(rr,rr,H,12),new T.MeshStandardMaterial({color:0x131317,metalness:.5,roughness:.5,emissive:0x000000}),nc);rods.castShadow=true;
  if(horiz){rods.userData.H=Rv*2;G.add(rods);}else{rods.userData.H=H;G.add(rods);}rods.userData.horiz=horiz;rods.userData.R=R;lastRods=-1;
  const drv=new T.InstancedMesh(new T.CylinderGeometry(rr*1.6,rr*1.6,R*.5,10),M.steel,nc);
  rodInfo.forEach((p,i)=>{tmp.position.set(horiz?p[0]*.0:p[0],(horiz?Rv:Hv/2+Rv*.5)+R*.25,horiz?p[1]:p[1]);if(horiz)tmp.position.set((i/(nc-1)-.5)*H*.9,Rv+R*.25,(i%2?1:-1)*R*.3);tmp.rotation.set(0,0,0);tmp.updateMatrix();drv.setMatrixAt(i,tmp.matrix);});
  G.add(drv);
  if(horiz)rodInfo=rodInfo.map((p,i)=>[(i/(nc-1)-.5)*H*.9,(i%2?1:-1)*R*.3]);
  // coolant loops: steam generators & pumps
  const base=fl.position.y;const sgH=Hv*1.1,sgR=Math.max(.35,R*.32);
  const lc=new T.Color(co.col),pipeM=new T.MeshStandardMaterial({color:0xb7bec8,metalness:.85,roughness:.28});
  [-1,1].forEach(sd=>{const ang=thc+Math.PI+sd*.75,dist=Rv*3.1;const x=Math.sin(ang)*dist,z=Math.cos(ang)*dist;
   const sg=A.g3.capsule(T,sgR,sgH,M.steel,32);sg.position.set(x,base+sgH/2+sgR,z);G.add(sg);
   const px=Math.sin(ang+sd*.35)*Rv*2.2,pz=Math.cos(ang+sd*.35)*Rv*2.2;
   const pump=A.g3.capsule(T,sgR*.55,sgR*1.2,M.steelIn,24);pump.position.set(px,base+sgR*1.3,pz);G.add(pump);
   const vx=Math.sin(ang)*Rv*.98,vz=Math.cos(ang)*Rv*.98,yh=horiz?0:H*.3,yc=horiz?-R*.5:-H*.15;
   const hot=A.g3.tube(T,[[vx,yh,vz],[(vx+x)/2,yh+.2,(vz+z)/2],[x*.92,base+sgH*.25,z*.92],[x,base+sgR*.6,z]],Math.max(.07,R*.07),pipeM);G.add(hot);
   const cold=A.g3.tube(T,[[x,base+sgR*.4,z],[px,base+sgR*1.3,pz],[Math.sin(ang)*Rv*.98,yc,Math.cos(ang)*Rv*.98]],Math.max(.06,R*.06),pipeM);G.add(cold);
   const f1=A.g3.flow(T,hot.userData.curve,26,lc,Math.max(.12,R*.12)),f2=A.g3.flow(T,cold.userData.curve,26,lc,Math.max(.12,R*.12));G.add(f1,f2);flows.push(f1,f2);});
  // neutrons
  const NN=420,ng=new T.BufferGeometry(),np=new Float32Array(NN*3),nc2=new Float32Array(NN*3);ng.setAttribute('position',new T.BufferAttribute(np,3));ng.setAttribute('color',new T.BufferAttribute(nc2,3));
  neut=new T.Points(ng,new T.PointsMaterial({size:Math.max(.05,R*.055),map:A.tex.glow(),vertexColors:true,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));neut.renderOrder=5;
  neut.userData={v:new Float32Array(NN*3),life:new Float32Array(NN),fastF:new Uint8Array(NN),n:0,R,H,horiz};core.add(neut);
  // core glow
  glowSpr=new T.Sprite(new T.SpriteMaterial({map:A.tex.glow(),color:d.cool==='salt'?0xff8a3d:r.fast?0xffb86b:0x5aa9ff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending}));glowSpr.scale.set(R*3.4,R*3.4,1);G.add(glowSpr);
  coreLight.color.set(d.cool==='salt'?0xff8a3d:r.fast?0xffb86b:0x5aa9ff);coreLight.distance=R*10;
  // labels
  const ar=A.LANG==='ar';
  st.label((ar?'الوقود: ':'Fuel: ')+(ar?fu.ar[0]:fu.en[0]),new T.Vector3(horiz?-R*.2:0,horiz?R*.2:H*.18,0));
  st.label((ar?'قضبان التحكم':'Control rods'),new T.Vector3(rodInfo[0][0],horiz?Rv+R*.6:Hv/2+Rv*.5+R*.55,rodInfo[0][1]));
  if(!r.fast)st.label((ar?'المهدّئ: ':'Moderator: ')+(ar?mo.ar[0]:mo.en[0]),new T.Vector3(Math.sin(thc+Math.PI*.9)*R*.9,horiz?-R*.6:-H*.3,Math.cos(thc+Math.PI*.9)*R*.9));
  st.label((ar?'المبرّد: ':'Coolant: ')+(ar?co.ar[0]:co.en[0]),new T.Vector3(Math.sin(thc+Math.PI+.75)*Rv*3.1,base+sgH+sgR*2.4,Math.cos(thc+Math.PI+.75)*Rv*3.1));
  // camera framing
  st.target.set(0,horiz?0:-R*.1,0);const dist=Rv*6.4+3;st.dist=dist;st.minD=Rv*1.4;st.maxD=dist*3.5;st.home={az:st.az,el:st.el,dist};
  sun.position.set(-Rv*6,Rv*10,Rv*6);sun.target.position.set(0,0,0);const sc=sun.shadow.camera;sc.left=sc.bottom=-Rv*5;sc.right=sc.top=Rv*5;sc.near=.5;sc.far=Rv*40;sc.updateProjectionMatrix();
  st.camera.near=Math.max(.02,Rv*.05);st.camera.far=Rv*120;st.camera.updateProjectionMatrix();
  geo.count=count;geo.kind=kind;geo.fast=r.fast;
 }
 function update(dt,s,d,r){if(!G)return;
  const P=Math.min(s.P,150),g=Math.min(1,P/100);
  // rods
  if(Math.abs(s.rods-lastRods)>.001){lastRods=s.rods;const R=rods.userData.R,H=rods.userData.H,hz=rods.userData.horiz;
   rodInfo.forEach((p,i)=>{const yc=hz?(R+.2)*1.18+R*.1-s.rods*(2*R)+R*.0:H*(1-s.rods)+(-0);tmp.position.set(p[0],hz?yc:yc,p[1]);if(!hz)tmp.position.set(p[0],H*(1-s.rods),p[1]);else tmp.position.set(p[0],(R*1.18+.18)+R-s.rods*2*R,p[1]);tmp.rotation.set(0,0,0);tmp.updateMatrix();rods.setMatrixAt(i,tmp.matrix);});rods.instanceMatrix.needsUpdate=true;}
  // glow & light
  glowSpr.material.opacity=.75*g;coreLight.intensity=g*(r.fast?2.2:3.2);
  if(fill&&fill.material.emissive){fill.material.emissiveIntensity=d.cool==='salt'?.25+.9*g:0;}
  if(geo.blockTop)geo.blockTop.emissiveIntensity=d.cool==='salt'?.3+1.2*g:0;
  // coolant flow
  flows.forEach(f=>{A.g3.stepFlow(f,dt*(.02+.25*g));f.material.opacity=s.on?.9:.25;});
  // neutrons
  const u=neut.userData,p=neut.geometry.attributes.position.array,c=neut.geometry.attributes.color.array,N=u.life.length;
  const want=s.on?Math.min(N,Math.round(Math.sqrt(Math.max(0,s.P))*40)):0,R=u.R,H=u.H,sp=R*2.2;
  for(let i=0;i<N;i++){const j=i*3;
   if(i>=want){p[j+1]=1e5;continue;}
   if(u.life[i]<=0){const a=Math.random()*6.283,rr=Math.sqrt(Math.random())*R*.95;p[j]=Math.cos(a)*rr;p[j+2]=Math.sin(a)*rr;p[j+1]=(Math.random()-.5)*H*.9;
    const th=Math.random()*6.283,ph=Math.acos(2*Math.random()-1);u.v[j]=Math.sin(ph)*Math.cos(th)*sp;u.v[j+1]=Math.cos(ph)*sp;u.v[j+2]=Math.sin(ph)*Math.sin(th)*sp;u.life[i]=.4+Math.random()*.9;u.fastF[i]=1;}
   if(!geo.fast&&u.fastF[i]&&Math.random()<dt*3){u.fastF[i]=0;u.v[j]*=.28;u.v[j+1]*=.28;u.v[j+2]*=.28;}
   p[j]+=u.v[j]*dt;p[j+1]+=u.v[j+1]*dt;p[j+2]+=u.v[j+2]*dt;u.life[i]-=dt;
   if(p[j]*p[j]+p[j+2]*p[j+2]>R*R*1.1||Math.abs(p[j+1])>H*.55)u.life[i]=0;
   if(u.fastF[i]){c[j]=1;c[j+1]=.62;c[j+2]=.25;}else{c[j]=.35;c[j+1]=.85;c[j+2]=1;}}
  neut.geometry.attributes.position.needsUpdate=true;neut.geometry.attributes.color.needsUpdate=true;
  st.render();}
 return {build,update,dispose(){if(G)disposeGroup(G);clearLabels();st.dispose();}};
};
})(APP);
