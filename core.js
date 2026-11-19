/* ===== NE for All · core ===== */
window.APP=(function(){
  const A={};
  A.LANG=(()=>{try{return localStorage.getItem('ne4all-lang')||'ar';}catch(e){return 'ar';}})();
  if(!CONTENT[A.LANG])A.LANG='ar';
  A.C=CONTENT[A.LANG];
  A.V={};          // view definitions
  A.mod=null;      // active module
  A.ORDER=['home','atoms','reactors','radiation','energy','safety','emergency','stories','life','careers','tools','quiz','glossary','saudi','scan','design','radar','news','refs','about'];
  A.fmt=function(x,d){
    if(!isFinite(x))return '—';
    const a=Math.abs(x);
    if(a!==0&&(a<1e-3||a>=1e7)){const e=Math.floor(Math.log10(a));return (x/Math.pow(10,e)).toFixed(3)+' × 10^'+e;}
    return Number(x.toFixed(d===undefined?4:d)).toLocaleString('en-US',{maximumFractionDigits:d===undefined?4:d});
  };
  A.fitCanvas=function(c){
    const r=c.getBoundingClientRect(),dpr=window.devicePixelRatio||1;
    const W=Math.max(1,Math.round(r.width*dpr)),H=Math.max(1,Math.round(r.height*dpr));
    if(c.width!==W||c.height!==H){c.width=W;c.height=H;}
    const ctx=c.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:r.width,h:r.height};
  };
  A.visible=el=>el&&el.offsetParent!==null;
  A.tpl=(s,o)=>s.replace(/\{(\w+)\}/g,(m,k)=>o[k]!==undefined?o[k]:m);
  A.sh=(tag,title,sub,extraStyle)=>`<div class="sh"${extraStyle?` style="${extraStyle}"`:''}>${tag?`<span class="tag">${tag}</span>`:''}<h2>${Array.isArray(title)?title[0]+'<span class="gt">'+title[1]+'</span>'+(title[2]||''):title}</h2>${sub?`<p>${sub}</p>`:''}</div>`;
  A.simple=h=>`<div class="simple"><b>${A.C.simple}</b> ${h}</div>`;
  A.VER={v:'2.0',d:'2026-11-18'};
A.card=(ic,t,en,p,extra)=>`<div class="card">${ic?`<div class="ic">${ic}</div>`:''}<h3>${t}${en?` <span class="en">${en}</span>`:''}</h3><p>${p}</p>${extra||''}</div>`;
  A.table=(rows,cls)=>`<div class="tbl"><table class="compare ${cls||''}">${rows.map((r,i)=>'<tr>'+r.map(c=>i===0?`<th>${c}</th>`:`<td>${c}</td>`).join('')+'</tr>').join('')}</table></div>`;
  A.esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

  let LGN=0;const LOGOF=()=>{const id='lg'+(++LGN);return '<svg viewBox="0 0 40 40"><defs><linearGradient id="'+id+'" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".5" stop-color="#a855f7"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><g fill="none" stroke="url(#'+id+')" stroke-width="2.2"><ellipse cx="20" cy="20" rx="17" ry="6.5"/><ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(60 20 20)"/><ellipse cx="20" cy="20" rx="17" ry="6.5" transform="rotate(-60 20 20)"/></g><circle cx="20" cy="20" r="3.6" fill="#ec4899"/></svg>';};
  A.shell=function(){
    const C=A.C;
    document.documentElement.lang=A.LANG;document.documentElement.dir=C.dir;
    document.title='NE for All | '+C.brandSub;
    const GR=C.navGroups,ICO={radar:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12l6-6"/><circle cx="12" cy="12" r="1"/></svg>',design:'<svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.4-.4-2.4z"/></svg>',home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',scan:'<svg viewBox="0 0 24 24"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><circle cx="12" cy="12" r="3.2"/></svg>',saudi:'<svg viewBox="0 0 24 24"><path d="M5 21V4"/><path d="M5 4h13l-2.5 4L18 12H5"/></svg>',atoms:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)"/></svg>',radiation:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="1.8"/><path d="M12 10.2L9 5a8 8 0 0 1 6 0z"/><path d="M13.6 13l5.4 2.9a8 8 0 0 1-3 5.2z"/><path d="M10.4 13L8 21.1a8 8 0 0 1-3-5.2z"/></svg>',life:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>',reactors:'<svg viewBox="0 0 24 24"><path d="M7 21V9a5 5 0 0 1 10 0v12"/><path d="M4 21h16"/><path d="M10 13h4M10 17h4"/></svg>',energy:'<svg viewBox="0 0 24 24"><path d="M13 3L5 13h6l-1 8 8-10h-6z"/></svg>',safety:'<svg viewBox="0 0 24 24"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',emergency:'<svg viewBox="0 0 24 24"><path d="M9 3l-6 2.5v15.5l6-2.5 6 2.5 6-2.5V3l-6 2.5z"/><path d="M9 3v15.5M15 5.5V21"/></svg>',stories:'<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7"/></svg>',careers:'<svg viewBox="0 0 24 24"><path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2.5 9 2.5 12 0v-5"/></svg>',tools:'<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2"/></svg>',quiz:'<svg viewBox="0 0 24 24"><path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M10 17h4"/></svg>',glossary:'<svg viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/></svg>',news:'<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="15" rx="2"/><path d="M7 9h10M7 13h6M7 16h6M15 13h2v3h-2z"/></svg>',refs:'<svg viewBox="0 0 24 24"><path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="M16.5 4.5l3.8 1-3.6 14.5-3.8-1"/></svg>',about:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>'};
    const GROUPS=[['atoms','radiation','life'],['reactors','energy'],['safety','emergency','stories'],['careers','tools','quiz','glossary']];
    const lk=v=>`<a href="#${v}" data-v="${v}"><span class="si">${ICO[v]}</span>${C.nav[v]}</a>`;
    const NAVH=lk('home')+lk('design')+lk('scan')+lk('saudi')+GROUPS.map((g,i)=>`<div class="sg" data-g="${i}"><button class="sg-t" type="button" aria-expanded="false"><span>${GR[i]}</span><i class="chev">▾</i></button><div class="sg-b"><div class="sg-in">${g.map(lk).join('')}</div></div></div>`).join('')+`<div class="sfix">${['radar','news','refs','about'].map(lk).join('')}</div>`;
    document.getElementById('nav').innerHTML=`<div class="mtop"><button class="burger" id="burger" aria-label="menu">☰</button><a href="#home" class="logo">${LOGOF()}<span><b>NE</b> for All</span></a><button class="langbtn" id="langBtnM">🌐 ${C.langBtn}</button></div>`;
    document.getElementById('side').innerHTML=`<div class="side-in"><a href="#home" class="logo side-logo">${LOGOF()}<span><b>NE</b> for All<small>${C.brandSub}</small></span></a><button class="langbtn" id="langBtn">🌐 ${C.langBtn}</button>
      <div id="navlinks">${NAVH}</div></div>`;
    document.getElementById('footer').innerHTML=`<div class="wrap"><div class="logo" style="justify-content:center">${LOGOF()}<span><b>NE</b> for All · ${C.brandSub}</span></div><p>${C.footer[0]}</p><p style="font-size:.9rem;margin-top:6px">${C.footer[1]}</p><p><span class="ver">v${(A.VER||{}).v||'2.0'} · <b>${A.LANG==='ar'?'آخر تحديث':'Last updated'}</b> ${(A.VER||{}).d||''}</span></p><p style="margin-top:8px"><a href="#about" style="color:#f0abfc;text-decoration:underline">${C.nav.about}</a> · <a href="#refs" style="color:#f0abfc;text-decoration:underline">${C.nav.refs}</a> · <a href="mailto:ne4all.sa@gmail.com" style="color:#f0abfc;text-decoration:underline">✉️ ${C.contactLbl}</a></p><p dir="ltr" style="font-size:.85rem;margin-top:4px;opacity:.8">ne4all.sa@gmail.com</p></div>`;
    document.getElementById('langBtn').onclick=()=>{A.setLang(A.LANG==='ar'?'en':'ar');};
    if(A.aiRender)A.aiRender();
    document.getElementById('langBtnM').onclick=()=>{A.setLang(A.LANG==='ar'?'en':'ar');};
    document.getElementById('burger').onclick=()=>document.body.classList.toggle('side-open');
    document.getElementById('shade').onclick=()=>document.body.classList.remove('side-open');
    document.querySelectorAll('#navlinks .sg-t').forEach(b=>b.onclick=()=>{const g=b.parentNode,o=!g.classList.contains('open');g.classList.toggle('open',o);b.setAttribute('aria-expanded',o);});
  };
  A.setLang=function(l){A.LANG=l;A.C=CONTENT[l];try{localStorage.setItem('ne4all-lang',l);}catch(e){}A.shell();A.route(true);};
  A.route=function(){
    let v=(location.hash||'#home').slice(1);if(!A.V[v])v='home';
    if(A.mod&&A.mod.destroy)try{A.mod.destroy();}catch(e){}
    A.mod=null;
    const app=document.getElementById('app');
    app.innerHTML=`<div class="view on" id="v-${v}">${A.V[v].html(A.C)}</div>`;
    document.querySelectorAll('#navlinks a').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
    const act=document.querySelector('#navlinks a.on');
    if(act){const g=act.closest('.sg');if(g){g.classList.add('open');g.querySelector('.sg-t').setAttribute('aria-expanded','true');}}if(act&&act.scrollIntoView)try{act.scrollIntoView({block:'nearest'});}catch(e){}
    window.scrollTo(0,0);
    if(A.V[v].init)A.mod=A.V[v].init(A.C)||null;
    document.body.classList.remove('side-open');
  };
  let last=performance.now();
  function loop(t){const dt=Math.min((t-last)/1000,0.1);last=t;if(A.mod&&A.mod.frame)try{A.mod.frame(dt,t);}catch(e){console.error(e);}requestAnimationFrame(loop);}
  A.start=function(){A.shell();window.addEventListener('hashchange',()=>A.route());A.route();requestAnimationFrame(t=>{last=t;loop(t);});};
  return A;
})();
