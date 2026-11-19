/* ===== Realistic 3D radiation laboratory ===== */
(function(A){
function signTex(ar){const c=document.createElement('canvas');c.width=512;c.height=640;const x=c.getContext('2d');
 x.fillStyle='#f6c90e';x.fillRect(0,0,512,640);x.fillStyle='#111';x.fillRect(0,0,512,150);
 x.fillStyle='#f6c90e';x.font='bold 64px IBM Plex Sans Arabic, Inter, sans-serif';x.textAlign='center';x.fillText(ar?'تحذير':'CAUTION',256,100);
 x.fillStyle='#111';const cx=256,cy=330,R=130;for(let i=0;i<3;i++){x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,R,i*2.094-0.52-Math.PI/2,i*2.094+0.52-Math.PI/2);x.fill();}
 x.fillStyle='#f6c90e';x.beginPath();x.arc(cx,cy,40,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(cx,cy,28,0,7);x.fill();
 x.font='bold 46px IBM Plex Sans Arabic, Inter, sans-serif';x.fillText(ar?'منطقة إشعاعية':'RADIATION AREA',256,560);
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;}
function floorTex(){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#c9ccd1';x.fillRect(0,0,512,512);
 for(let i=0;i<9000;i++){const v=185+Math.random()*40|0;x.fillStyle=`rgba(${v},${v},${v+3},.25)`;x.fillRect(Math.random()*512,Math.random()*512,2,2);}
 x.strokeStyle='rgba(120,124,132,.55)';x.lineWidth=2;for(let i=0;i<=4;i++){x.beginPath();x.moveTo(i*128,0);x.lineTo(i*128,512);x.stroke();x.beginPath();x.moveTo(0,i*128);x.lineTo(512,i*128);x.stroke();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(10,5);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;}
function wallTex(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#dfe3e8';x.fillRect(0,0,256,256);
 for(let i=0;i<3000;i++){const v=210+Math.random()*30|0;x.fillStyle=`rgba(${v},${v},${v+4},.3)`;x.fillRect(Math.random()*256,Math.random()*256,2,2);}
 x.strokeStyle='rgba(150,155,165,.4)';x.lineWidth=2;x.strokeRect(1,1,254,254);
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(10,2);t.encoding=THREE.sRGBEncoding;return t;}
A.rad3d=function(container,K){
 const T=THREE,R=A.C.radiation,ar=A.LANG==='ar';
 let dragging=false;
 const ray=new T.Raycaster(),mouse=new T.Vector2(),plane=new T.Plane(new T.Vector3(0,1,0),0),hit=new T.Vector3();
 const st=A.stage3d(container,{target:new T.Vector3(5.5,1.0,0),az:-0.32,el:0.26,dist:13.5,minD:4,maxD:30,near:0.05,far:200,fov:42,exposure:1.05,
  onDrag:e=>{if(!dragging)return false;const r=st.canvas.getBoundingClientRect();mouse.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mouse,st.camera);if(ray.ray.intersectPlane(plane,hit))K.setD(x2d(hit.x));return true;},
  onUp:()=>{dragging=false;}});
 const S=st.scene;S.background=new T.Color(A.isDark&&!A.isDark()?0xE3E8EF:0x1a1d24);
 S.add(new T.HemisphereLight(0xf4f6ff,0x3a3a44,0.55));
 // ceiling lights
 const lm=new T.MeshStandardMaterial({color:0xffffff,emissive:0xffffff,emissiveIntensity:1.4});
 [[1,-1],[7,-1],[13,-1]].forEach((p,i)=>{const pn=new T.Mesh(new T.BoxGeometry(2.2,0.06,0.6),lm);pn.position.set(p[0],4.4,p[1]);S.add(pn);const l=new T.PointLight(0xfff8ee,0.55,16,1.5);l.position.set(p[0],4.2,p[1]);if(i===1){l.castShadow=true;l.shadow.mapSize.set(1024,1024);}S.add(l);});
 const spot=new T.SpotLight(0xffffff,0.9,14,0.55,0.5,1.2);spot.position.set(2,4.3,2);spot.target.position.set(4,0,0);spot.castShadow=true;spot.shadow.mapSize.set(1024,1024);S.add(spot);S.add(spot.target);
 // room
 const floor=new T.Mesh(new T.PlaneGeometry(26,12),new T.MeshStandardMaterial({map:floorTex(),roughness:0.35,metalness:0.05}));floor.rotation.x=-Math.PI/2;floor.position.set(8,0,0);floor.receiveShadow=true;S.add(floor);
 const wt=wallTex(),wm=new T.MeshStandardMaterial({map:wt,roughness:0.85});
 const back=new T.Mesh(new T.PlaneGeometry(26,4.6),wm);back.position.set(8,2.3,-6);back.receiveShadow=true;S.add(back);
 const side=new T.Mesh(new T.PlaneGeometry(12,4.6),wm);side.rotation.y=Math.PI/2;side.position.set(-5,2.3,0);side.receiveShadow=true;S.add(side);
 const base=new T.Mesh(new T.BoxGeometry(26,0.15,0.04),new T.MeshStandardMaterial({color:0x3b3f48}));base.position.set(8,0.075,-5.98);S.add(base);
 const sc=document.createElement('canvas');sc.width=512;sc.height=32;const sx=sc.getContext('2d');for(let i=0;i<34;i++){sx.fillStyle=i%2?'#111':'#f2c230';sx.beginPath();sx.moveTo(i*24,0);sx.lineTo(i*24+16,0);sx.lineTo(i*24,32);sx.lineTo(i*24-16,32);sx.fill();}
 const stripe=new T.Mesh(new T.PlaneGeometry(26,0.18),new T.MeshBasicMaterial({map:new T.CanvasTexture(sc)}));stripe.position.set(8,1.25,-5.97);S.add(stripe);
 const sign=new T.Mesh(new T.PlaneGeometry(0.8,1.0),new T.MeshStandardMaterial({map:signTex(ar),roughness:0.5}));sign.position.set(2.5,2.6,-5.95);S.add(sign);
 const sign2=sign.clone();sign2.position.set(-4.97,2.5,-2);sign2.rotation.y=Math.PI/2;S.add(sign2);
 // furniture: bench, shelf, hood, door, extinguisher
 const steel=new T.MeshStandardMaterial({color:0xb9c0c8,metalness:0.8,roughness:0.35});
 const dark=new T.MeshStandardMaterial({color:0x2e333b,roughness:0.6});
 const add=(g,m,x,y,z,ry)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);if(ry)o.rotation.y=ry;o.castShadow=true;o.receiveShadow=true;S.add(o);return o;};
 add(new T.BoxGeometry(5,0.06,0.9),new T.MeshStandardMaterial({color:0x3a3f47,roughness:0.4}),8,0.92,-5.4);
 add(new T.BoxGeometry(5,0.88,0.85),new T.MeshStandardMaterial({color:0xe8ebef,roughness:0.6}),8,0.45,-5.42);
 for(let i=0;i<4;i++)add(new T.CylinderGeometry(0.09,0.09,0.24,16),new T.MeshStandardMaterial({color:0x50565f,metalness:0.6,roughness:0.4}),6.3+i*0.5,1.07,-5.4);
 add(new T.BoxGeometry(0.4,0.3,0.3),new T.MeshStandardMaterial({color:0xf2c230}),9.8,1.1,-5.4);
 add(new T.BoxGeometry(2.4,2.4,0.9),new T.MeshStandardMaterial({color:0xd5d9de,roughness:0.5}),13.5,1.2,-5.45);
 const glass=new T.MeshStandardMaterial({color:0xa9d3ff,transparent:true,opacity:0.25,roughness:0.05,metalness:0.1});add(new T.BoxGeometry(2.2,1.1,0.02),glass,13.5,1.5,-4.99);
 add(new T.BoxGeometry(1.1,2.3,0.06),new T.MeshStandardMaterial({color:0x5b6b80,roughness:0.5}),17.5,1.15,-5.96);
 add(new T.CylinderGeometry(0.09,0.09,0.5,16),new T.MeshStandardMaterial({color:0xc81e1e,roughness:0.4}),16.4,0.4,-5.8);
 for(let i=0;i<3;i++){add(new T.BoxGeometry(3,0.04,0.4),steel,-1.5,1.6+i*0.6,-5.78);for(let j=0;j<5;j++)add(new T.CylinderGeometry(0.08,0.08,0.18,12),new T.MeshStandardMaterial({color:[0x50565f,0xf2c230,0x8a939e][(i+j)%3],metalness:0.5,roughness:0.45}),-2.7+j*0.6,1.71+i*0.6,-5.75);}
 // distance markers (floor tape)
 const xMin=0.9,xMax=17.5,d2x=d=>xMin+(K.d2s(d)/1000)*(xMax-xMin),x2d=X=>K.s2d(Math.min(1,Math.max(0,(X-xMin)/(xMax-xMin)))*1000);
 const tape=new T.MeshStandardMaterial({color:0xf2c230,roughness:0.6});
 [0.1,0.5,1,2,5,10].forEach(d=>{const X=d2x(d);const m=new T.Mesh(new T.PlaneGeometry(0.06,5),tape);m.rotation.x=-Math.PI/2;m.position.set(X,0.003,0.2);m.receiveShadow=true;S.add(m);st.label(d+' m',[X,0.02,3.0],'dist');});
 // source: lab table + lead pig + capsule
 add(new T.BoxGeometry(0.9,0.05,0.9),new T.MeshStandardMaterial({color:0x3a3f47,roughness:0.35,metalness:0.4}),0,0.95,0);
 [[-0.4,-0.4],[0.4,-0.4],[-0.4,0.4],[0.4,0.4]].forEach(p=>add(new T.CylinderGeometry(0.025,0.025,0.95,8),steel,p[0],0.475,p[1]));
 add(new T.CylinderGeometry(0.16,0.17,0.3,24),new T.MeshStandardMaterial({color:0x4b5058,metalness:0.7,roughness:0.5}),-0.15,1.12,-0.22);
 add(new T.CylinderGeometry(0.17,0.17,0.07,24),new T.MeshStandardMaterial({color:0x4b5058,metalness:0.7,roughness:0.5}),-0.25,1.0,0.25);
 const capsule=add(new T.CylinderGeometry(0.035,0.035,0.12,16),new T.MeshStandardMaterial({color:0xd6dce3,metalness:0.9,roughness:0.2,emissive:0x818cf8,emissiveIntensity:0.6}),0.15,1.04,0);capsule.rotation.z=Math.PI/2;
 const sGlow=new T.Sprite(new T.SpriteMaterial({map:A.tex.glow(),transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:0.85}));sGlow.position.set(0.2,1.05,0);sGlow.scale.set(0.9,0.9,1);S.add(sGlow);
 const sL=new T.PointLight(0x818cf8,0.6,4);sL.position.set(0.3,1.15,0);S.add(sL);
 st.label(R.src,[0.05,2.0,0],'src');
 // shields
 const SHG={};
 {const g=new T.Group();const sheet=new T.Mesh(new T.BoxGeometry(0.004,0.84,0.6),new T.MeshStandardMaterial({color:0xf7f7f2,roughness:0.9}));sheet.position.y=1.2;sheet.castShadow=true;g.add(sheet);const rod=new T.Mesh(new T.CylinderGeometry(0.012,0.012,0.8,8),steel);rod.position.y=0.4;g.add(rod);const bs=new T.Mesh(new T.CylinderGeometry(0.14,0.14,0.02,16),dark);bs.position.y=0.01;g.add(bs);const clip=new T.Mesh(new T.BoxGeometry(0.03,0.04,0.12),dark);clip.position.y=0.8;g.add(clip);SHG.paper=g;}
 {const g=new T.Group();const pl=new T.Mesh(new T.BoxGeometry(0.012,1.2,0.9),new T.MeshStandardMaterial({color:0xd9dee4,metalness:0.92,roughness:0.28}));pl.position.y=0.66;pl.castShadow=true;g.add(pl);[-0.38,0.38].forEach(z=>{const f=new T.Mesh(new T.BoxGeometry(0.3,0.04,0.06),dark);f.position.set(0,0.02,z);g.add(f);});SHG.al=g;}
 {const g=new T.Group();const bm=new T.MeshStandardMaterial({color:0x60666f,metalness:0.75,roughness:0.5});const br=new T.InstancedMesh(new T.BoxGeometry(0.1,0.05,0.2),bm,22*5);let i=0;const m4=new T.Matrix4();for(let r=0;r<22;r++)for(let c=0;c<5;c++){const off=r%2?0.1:0;if(c===4&&!off)continue;m4.makeTranslation(0,0.026+r*0.051,-0.45+off+c*0.201);if(-0.45+off+c*0.2>0.46)continue;br.setMatrixAt(i++,m4);}br.count=i;br.castShadow=true;br.receiveShadow=true;g.add(br);SHG.pb=g;}
 {const g=new T.Group();const tank=new T.Mesh(new T.BoxGeometry(0.42,1.1,0.95),new T.MeshStandardMaterial({color:0xcfe8ff,transparent:true,opacity:0.22,roughness:0.05,metalness:0.1,depthWrite:false}));tank.position.y=0.6;g.add(tank);const w=new T.Mesh(new T.BoxGeometry(0.39,0.95,0.92),new T.MeshStandardMaterial({color:0x2f86d6,transparent:true,opacity:0.5,roughness:0.1,metalness:0.1,depthWrite:false}));w.position.y=0.53;g.add(w);const fr=new T.Mesh(new T.BoxGeometry(0.46,0.05,1.0),dark);fr.position.y=0.03;g.add(fr);const top=fr.clone();top.position.y=1.16;g.add(top);SHG.water=g;}
 {const g=new T.Group();const cm=new T.MeshStandardMaterial({color:0xbfc2c4,map:A.tex.concrete(),roughness:0.95});for(let r=0;r<6;r++)for(let c=0;c<3;c++){const off=r%2?0.2:0;const z=-0.6+off+c*0.41;if(z>0.62)continue;const b=new T.Mesh(new T.BoxGeometry(0.2,0.2,0.4),cm);b.position.set(0,0.1+r*0.205,z);b.castShadow=true;b.receiveShadow=true;g.add(b);}SHG.con=g;}
 Object.values(SHG).forEach(g=>{g.position.set(0.9,0,0);g.visible=false;g.traverse(o=>{if(o.isMesh)o.castShadow=true;});S.add(g);});
 const shLab=st.label('',[0.9,1.75,0],'sh');
 // human figure (lab worker) facing the source (-x)
 const skin=new T.MeshStandardMaterial({color:0xc99272,roughness:0.6});
 const coat=new T.MeshStandardMaterial({color:0xf4f5f7,roughness:0.75});
 const pants=new T.MeshStandardMaterial({color:0x26324a,roughness:0.8});
 const shoe=new T.MeshStandardMaterial({color:0x15171b,roughness:0.5});
 const hair=new T.MeshStandardMaterial({color:0x1d1611,roughness:0.9});
 const person=new T.Group();
 const P=(g,m,x,y,z,o)=>{const mm=new T.Mesh(g,m);mm.position.set(x,y,z);if(o){if(o.rx)mm.rotation.x=o.rx;if(o.rz)mm.rotation.z=o.rz;if(o.sx)mm.scale.set(o.sx,o.sy||1,o.sz||1);}mm.castShadow=true;mm.receiveShadow=true;person.add(mm);return mm;};
 [-1,1].forEach(s=>{const z=s*0.1;
  P(new T.BoxGeometry(0.27,0.08,0.11),shoe,-0.04,0.04,z);
  P(new T.CylinderGeometry(0.058,0.05,0.42,14),pants,0,0.29,z);
  P(new T.SphereGeometry(0.062,14,10),pants,0,0.5,z);
  P(new T.CylinderGeometry(0.085,0.064,0.42,14),pants,0,0.71,z);});
 const tp=[[0.02,0.62],[0.205,0.64],[0.2,0.9],[0.17,1.05],[0.19,1.25],[0.215,1.4],[0.19,1.47],[0.08,1.5],[0.02,1.51]].map(p=>new T.Vector2(p[0],p[1]));
 P(new T.LatheGeometry(tp,28),coat,0,0,0,{sx:0.62,sy:1,sz:1});
 P(new T.CylinderGeometry(0.05,0.055,0.1,12),skin,0,1.55,0);
 const head=P(new T.SphereGeometry(0.105,24,18),skin,0,1.7,0,{sx:0.95,sy:1.15,sz:0.88});
 P(new T.SphereGeometry(0.11,24,12,0,Math.PI*2,0,Math.PI/2.1),hair,0.012,1.72,0,{sx:0.98,sy:1.05,sz:0.92});
 P(new T.ConeGeometry(0.018,0.045,8),skin,-0.105,1.69,0,{rz:Math.PI/2});
 [-1,1].forEach(s=>{P(new T.SphereGeometry(0.012,8,6),new T.MeshStandardMaterial({color:0x111111}),-0.092,1.72,s*0.035);P(new T.SphereGeometry(0.022,10,8),skin,0,1.7,s*0.1);});
 [-1,1].forEach(s=>{const z=s*0.235;
  P(new T.SphereGeometry(0.06,14,10),coat,0,1.42,z);
  P(new T.CylinderGeometry(0.052,0.046,0.3,14),coat,0,1.25,z,{rx:s*0.08});
  P(new T.CylinderGeometry(0.044,0.04,0.27,14),coat,-0.05,0.98,z+s*0.012,{rz:0.18});
  P(new T.SphereGeometry(0.042,12,10),skin,-0.08,0.82,z+s*0.012,{sx:0.7,sy:1.2,sz:0.9});});
 const badgeMat=new T.MeshStandardMaterial({color:0x222222,emissive:0x34d399,emissiveIntensity:1.2});
 P(new T.BoxGeometry(0.02,0.07,0.05),badgeMat,-0.13,1.32,0.08);
 const ringMat=new T.MeshBasicMaterial({color:0x34d399,transparent:true,opacity:0.75,side:T.DoubleSide,depthWrite:false});
 const ring=new T.Mesh(new T.RingGeometry(0.32,0.4,40),ringMat);ring.rotation.x=-Math.PI/2;ring.position.y=0.006;person.add(ring);
 S.add(person);const pLab=st.label(R.drag,[0,2.6,0],'drag');
 const hitBox=new T.Mesh(new T.BoxGeometry(0.8,2,0.8),new T.MeshBasicMaterial({visible:false}));hitBox.position.y=1;person.add(hitBox);
 st.canvas.addEventListener('pointerdown',e=>{const r=st.canvas.getBoundingClientRect();mouse.set(((e.clientX-r.left)/r.width)*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(mouse,st.camera);if(ray.intersectObject(hitBox,false).length)dragging=true;});
 // particles
 const N=420,pg=new T.BufferGeometry(),pos=new Float32Array(N*3);pg.setAttribute('position',new T.BufferAttribute(pos,3));
 const pMat=new T.PointsMaterial({color:0x818cf8,size:0.07,map:A.tex.glow(),transparent:true,depthWrite:false,blending:T.AdditiveBlending});const pts=new T.Points(pg,pMat);pts.frustumCulled=false;S.add(pts);
 const Pp=[];for(let i=0;i<N;i++)Pp.push({x:0,y:-10,z:0,vx:0,vy:0,vz:0,alive:false,passed:false});
 const col=new T.Color();
 function update(dt,r,lvCol){
  const Sx=K.S;col.set(K.COL[Sx.type]);pMat.color.copy(col);sGlow.material.color.copy(col);sL.color.copy(col);capsule.material.emissive.copy(col);
  Object.keys(SHG).forEach(k=>SHG[k].visible=Sx.shield===k);shLab.show=Sx.shield!=='none';if(shLab.show)shLab.d.textContent=R.shields[Sx.shield];
  const px=d2x(Sx.d);person.position.set(px,0,0);pLab.pos.set(px,2.6,0);
  ringMat.color.set(lvCol);badgeMat.emissive.set(lvCol);
  const tr=K.TR[Sx.type][Sx.shield],aX=d2x(0.06),bX=d2x(3),sp=(Sx.type==='alpha'?2.4:8)*dt;let spawn=Sx.type==='alpha'?3:6;
  for(let i=0;i<N;i++){const p=Pp[i];if(!p.alive){if(spawn>0){spawn--;const a=(Math.random()-.5)*1.0,b=(Math.random()-.5)*0.9;p.x=0.22;p.y=1.05;p.z=0;p.vx=Math.cos(a)*Math.cos(b);p.vy=Math.sin(b)*0.6;p.vz=Math.sin(a);p.alive=true;p.passed=false;}else{pos[i*3+1]=-50;continue;}}
   p.x+=p.vx*sp;p.y+=p.vy*sp;p.z+=p.vz*sp;
   if(!p.passed&&p.x>=0.9){p.passed=true;if(Sx.shield!=='none'&&Math.random()>tr)p.alive=false;}
   if(Sx.type==='alpha'&&p.x>aX)p.alive=false;if(Sx.type==='beta'&&p.x>bX&&Math.random()<0.15)p.alive=false;if(p.x>20||Math.abs(p.z)>5.5||p.y<0||p.y>4.4)p.alive=false;
   pos[i*3]=p.x;pos[i*3+1]=p.alive?p.y:-50;pos[i*3+2]=p.z;}
  pg.attributes.position.needsUpdate=true;pMat.size=Sx.type==='alpha'?0.11:0.07;
  st.render();
 }
 return {update,dispose:st.dispose};
};
})(APP);
