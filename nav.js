/* ===== Sidebar toggle: one menu button for desktop + mobile ===== */
(function(A){
const ICO='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
const wide=()=>window.innerWidth>=1100;
let hide=false;try{hide=localStorage.getItem('ne4all-side')==='0';}catch(e){}
function apply(){document.body.classList.toggle('side-hide',hide&&wide());const b=document.getElementById('sideTg');if(b){const open=wide()?!hide:document.body.classList.contains('side-open');b.setAttribute('aria-expanded',open?'true':'false');}}
function toggle(){if(wide()){hide=!hide;try{localStorage.setItem('ne4all-side',hide?'0':'1');}catch(e){}apply();}else{document.body.classList.toggle('side-open');apply();}}
function ensure(){let b=document.getElementById('sideTg');if(!b){b=document.createElement('button');b.id='sideTg';b.type='button';b.className='side-tg';b.innerHTML=ICO;b.onclick=toggle;document.body.appendChild(b);}
 b.setAttribute('aria-label',A.LANG==='ar'?'القائمة':'Menu');
 const bg=document.getElementById('burger');if(bg&&!bg.dataset.nv){bg.dataset.nv=1;bg.innerHTML=ICO;bg.onclick=e=>{e.preventDefault();toggle();};}
 apply();}
const s0=A.shell;if(s0)A.shell=function(){const o=s0.apply(this,arguments);try{ensure();}catch(e){}return o;};
const r0=A.route;A.route=function(){const o=r0.apply(this,arguments);try{ensure();if(!wide())document.body.classList.remove('side-open');apply();}catch(e){}return o;};
window.addEventListener('resize',apply);
document.addEventListener('click',e=>{if(!wide()&&document.body.classList.contains('side-open')&&e.target.id==='shade'){document.body.classList.remove('side-open');apply();}});
if(document.readyState!=='loading')ensure();else document.addEventListener('DOMContentLoaded',ensure);
})(APP);
