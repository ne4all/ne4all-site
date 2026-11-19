/* ===== Shared 3D helpers (three.js r128 from cdnjs) ===== */
(function(A){
const URL='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
let p=null;
A.loadThree=function(){
  if(window.THREE)return Promise.resolve(window.THREE);
  if(p)return p;
  p=new Promise((res,rej)=>{
    let ok=false;
    try{const c=document.createElement('canvas');ok=!!(c.getContext('webgl')||c.getContext('experimental-webgl'));}catch(e){}
    if(!ok){rej(new Error('no webgl'));return;}
    const s=document.createElement('script');s.src=URL;s.async=true;
    const to=setTimeout(()=>rej(new Error('timeout')),9000);
    s.onload=()=>{clearTimeout(to);window.THREE?res(window.THREE):rej(new Error('no THREE'));};
    s.onerror=()=>{clearTimeout(to);rej(new Error('load error'));};
    document.head.appendChild(s);
  });
  p.catch(()=>{p=null;});
  return p;
};
/* Create a 3D stage on a container element (which holds the canvas). */
A.stage3d=function(container,opts){
  const T=window.THREE;opts=opts||{};
  const canvas=document.createElement('canvas');canvas.className='c3d';
  container.appendChild(canvas);
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance',logarithmicDepthBuffer:!!opts.logDepth});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,opts.maxPR||2));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=opts.exposure||1.0;
  const scene=new T.Scene();
  const camera=new T.PerspectiveCamera(opts.fov||40,1,opts.near||0.1,opts.far||2000);
  const labels=document.createElement('div');labels.className='l3d';container.appendChild(labels);
  const st={renderer,scene,camera,canvas,labels,container,target:new T.Vector3().copy(opts.target||new T.Vector3()),az:opts.az||-0.6,el:opts.el||0.35,dist:opts.dist||80,minD:opts.minD||20,maxD:opts.maxD||200,minEl:opts.minEl||0.04,maxEl:opts.maxEl||1.35,lbl:[],w:0,h:0,dirty:true};
  st.home={az:st.az,el:st.el,dist:st.dist};
  // orbit controls (drag rotate, wheel/pinch zoom, double click reset)
  const ptrs=new Map();let pinch0=0,d0=0;
  canvas.style.touchAction='none';
  canvas.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});try{canvas.setPointerCapture(e.pointerId);}catch(_){}
    if(ptrs.size===2){const a=[...ptrs.values()];pinch0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);d0=st.dist;}});
  canvas.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const pr=ptrs.get(e.pointerId);const dx=e.clientX-pr.x,dy=e.clientY-pr.y;ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(ptrs.size===1&&!(opts.onDrag&&opts.onDrag(e))){st.az-=dx*0.006;st.el=Math.min(st.maxEl,Math.max(st.minEl,st.el+dy*0.005));}
    else if(ptrs.size===2){const a=[...ptrs.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(pinch0>0)st.dist=Math.min(st.maxD,Math.max(st.minD,d0*pinch0/d));}});
  const up=e=>{ptrs.delete(e.pointerId);if(opts.onUp)opts.onUp(e);};
  canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  canvas.addEventListener('wheel',e=>{e.preventDefault();st.dist=Math.min(st.maxD,Math.max(st.minD,st.dist*(1+Math.sign(e.deltaY)*0.08)));},{passive:false});
  canvas.addEventListener('dblclick',()=>{st.az=st.home.az;st.el=st.home.el;st.dist=st.home.dist;});
  st.label=function(text,pos,cls){const d=document.createElement('div');d.className='lab '+(cls||'');d.textContent=text;labels.appendChild(d);const o={d,pos:pos.clone?pos.clone():new T.Vector3(pos[0],pos[1],pos[2]),show:true};st.lbl.push(o);return o;};
  const v=new T.Vector3();
  st.render=function(){
    const r=container.getBoundingClientRect();const w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));
    if(w!==st.w||h!==st.h){st.w=w;st.h=h;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
    if(opts.dynClip){const nn=Math.max(0.001,st.dist*0.003),ff=st.dist*80;if(Math.abs(camera.near-nn)>nn*0.05||Math.abs(camera.far-ff)>ff*0.05){camera.near=nn;camera.far=ff;camera.updateProjectionMatrix();}}
    const ce=Math.cos(st.el);camera.position.set(st.target.x+st.dist*ce*Math.sin(st.az),st.target.y+st.dist*Math.sin(st.el),st.target.z+st.dist*ce*Math.cos(st.az));camera.lookAt(st.target);
    renderer.render(scene,camera);
    for(const L of st.lbl){if(!L.show){L.d.style.display='none';continue;}v.copy(L.pos).project(camera);
      if(v.z>1||v.x<-1.1||v.x>1.1||v.y<-1.1||v.y>1.1){L.d.style.display='none';continue;}
      L.d.style.display='block';L.d.style.transform=`translate(-50%,-50%) translate(${((v.x+1)/2*w).toFixed(1)}px,${((1-v.y)/2*h).toFixed(1)}px)`;}
  };
  st.dispose=function(){try{renderer.dispose();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{if(m.map)m.map.dispose();m.dispose();});}});}catch(e){}canvas.remove();labels.remove();};
  return st;
};
/* textures */
A.tex={};
A.tex.puff=function(){if(A.tex._puff)return A.tex._puff;const T=THREE,c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');
  for(let i=0;i<18;i++){const px=64+(Math.random()-.5)*50,py=64+(Math.random()-.5)*50,r=18+Math.random()*30;const g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,r,0,7);x.fill();}
  const g=x.createRadialGradient(64,64,10,64,64,64);g.addColorStop(0,'rgba(255,255,255,.5)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,128,128);
  const t=new T.CanvasTexture(c);A.tex._puff=t;return t;};
A.tex.glow=function(){if(A.tex._glow)return A.tex._glow;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.6)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);A.tex._glow=new THREE.CanvasTexture(c);return A.tex._glow;};
A.tex.sky=function(stops){const c=document.createElement('canvas');c.width=4;c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));x.fillStyle=g;x.fillRect(0,0,4,256);const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;};
A.tex.windows=function(cols,rows,lit){const c=document.createElement('canvas');c.width=128;c.height=256;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,128,256);
  const cw=128/cols,rh=256/rows;for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){if(Math.random()>lit)continue;const b=150+Math.random()*105;x.fillStyle=`rgb(${b},${b*0.82|0},${b*0.55|0})`;x.fillRect(i*cw+cw*0.2,j*rh+rh*0.25,cw*0.6,rh*0.5);}
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return t;};
A.tex.concrete=function(){if(A.tex._con)return A.tex._con;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#b9bcc0';x.fillRect(0,0,256,256);
  for(let i=0;i<4000;i++){const v=170+Math.random()*50|0;x.fillStyle=`rgba(${v},${v},${v+4},.35)`;x.fillRect(Math.random()*256,Math.random()*256,2,2);}
  x.strokeStyle='rgba(90,90,95,.25)';for(let j=0;j<8;j++){x.beginPath();x.moveTo(0,j*32);x.lineTo(256,j*32);x.stroke();}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;A.tex._con=t;return t;};
A.tex.clear=function(){A.tex._puff=null;A.tex._glow=null;A.tex._con=null;};
/* geometry helpers */
A.g3={
  capsule(T,r,h,mat,seg){const g=new T.Group();const c=new T.Mesh(new T.CylinderGeometry(r,r,h,seg||32),mat);g.add(c);const s1=new T.Mesh(new T.SphereGeometry(r,seg||32,16,0,Math.PI*2,0,Math.PI/2),mat);s1.position.y=h/2;g.add(s1);const s2=s1.clone();s2.rotation.x=Math.PI;s2.position.y=-h/2;g.add(s2);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;},
  tube(T,pts,r,mat){const curve=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(p[0],p[1],p[2])),false,'catmullrom',0.05);const m=new T.Mesh(new T.TubeGeometry(curve,Math.max(24,pts.length*16),r,12,false),mat);m.castShadow=true;m.userData.curve=curve;return m;},
  flow(T,curve,n,color,size){const g=new T.BufferGeometry();const pos=new Float32Array(n*3);g.setAttribute('position',new T.BufferAttribute(pos,3));const m=new T.Points(g,new T.PointsMaterial({color,size:size||0.5,map:A.tex.glow(),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));m.userData={curve,n,ph:0};return m;},
  stepFlow(p,speed){const d=p.userData;d.ph=(d.ph+speed)%1;const a=p.geometry.attributes.position;for(let i=0;i<d.n;i++){const q=d.curve.getPointAt(((i/d.n)+d.ph)%1);a.setXYZ(i,q.x,q.y,q.z);}a.needsUpdate=true;}
};
})(APP);
