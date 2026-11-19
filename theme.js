/* Theme helpers: replace emoji with the site's own icon set; light/dark mode. */
(function(A){
const RX=/(?:[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}](?:️|‍|[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F1E6}-\u{1F1FF}])*)/gu;
const KEEP=new Set(['©','®','™']);
const SKIP='svg,canvas,script,style,textarea,.em-pm,.keep-emo,.sf-core,.gi';
const isArrow=s=>{const c=s.codePointAt(0);return (c>=0x2190&&c<=0x21FF)||(c>=0x2194&&c<=0x2199)||KEEP.has(s);};
function frag(text){const f=document.createDocumentFragment();let last=0;RX.lastIndex=0;let m,changed=false;
 while((m=RX.exec(text))){const e=m[0];if(isArrow(e))continue;const name=(A.EMOJI_ICON||{})[e]||(A.EMOJI_ICON||{})[e.replace(/️/g,'')];
  if(m.index>last)f.appendChild(document.createTextNode(text.slice(last,m.index)));
  if(name){const i=document.createElement('i');i.className='gi gi-'+name;i.innerHTML=A.icon(name);f.appendChild(i);}
  let end=m.index+e.length;if(!name&&text[end]===' ')end++;last=end;changed=true;}
 if(!changed)return null;if(last<text.length)f.appendChild(document.createTextNode(text.slice(last)));return f;}
function clean(root){if(!root||!A.icon)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest(SKIP))return NodeFilter.FILTER_REJECT;RX.lastIndex=0;return RX.test(n.data)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;}});
 const list=[];while(w.nextNode())list.push(w.currentNode);
 list.forEach(n=>{const p=n.parentElement;if(p&&(p.tagName==='OPTION'||p.tagName==='TITLE')){RX.lastIndex=0;n.data=n.data.replace(RX,m=>isArrow(m)?m:'').replace(/^\s+/,'');return;}
  const f=frag(n.data);if(f)n.parentNode.replaceChild(f,n);});
 root.querySelectorAll('.ic,[class$="-ic"]').forEach(e=>{if(!e.textContent.trim()&&!e.querySelector('svg,img'))e.remove();});}
A.cleanEmoji=clean;
let pend=0;const run=()=>{pend=0;['app','footer','side','topnav'].forEach(id=>clean(document.getElementById(id)));clean(document.querySelector('nav'));};
const mo=new MutationObserver(()=>{if(!pend)pend=requestAnimationFrame(run);});
function start(){mo.observe(document.body,{childList:true,subtree:true});run();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
/* ---- light / dark mode ---- */
const KEY='ne4all-theme';
A.getTheme=()=>document.documentElement.dataset.theme||'light';
A.setTheme=(t,user)=>{const ch=document.documentElement.dataset.theme!==t;document.documentElement.dataset.theme=t;if(user&&ch&&A.route)setTimeout(()=>A.route(),0);try{localStorage.setItem(KEY,t);}catch(e){}document.querySelectorAll('.thm-btn').forEach(b=>{b.innerHTML=A.icon(t==='dark'?'sun':'moon');b.title=A.LANG==='ar'?(t==='dark'?'الوضع الفاتح':'الوضع الداكن'):(t==='dark'?'Light mode':'Dark mode');b.setAttribute('aria-label',b.title);});};
(function(){let t=null;try{t=localStorage.getItem(KEY);}catch(e){}if(!t)t=(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';document.documentElement.dataset.theme=t;})();
A.ICONS&&(A.ICONS.moon=['<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>','<path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/>']);
function addToggles(){document.querySelectorAll('.langbtn').forEach(lb=>{if(lb.previousElementSibling&&lb.previousElementSibling.classList.contains('thm-btn'))return;
 const b=document.createElement('button');b.type='button';b.className='thm-btn';b.onclick=e=>{e.preventDefault();e.stopPropagation();A.setTheme(A.getTheme()==='dark'?'light':'dark',true);};lb.parentNode.insertBefore(b,lb);});A.setTheme(A.getTheme());}
A.addThemeToggles=addToggles;
A.isDark=()=>A.getTheme()==='dark';
A.CV=()=>A.isDark()?{bg:'#07030f',txt:'rgba(255,255,255,.85)',txt2:'#cbd5e1',mut:'rgba(185,168,217,.8)',grid:'rgba(200,160,255,.13)',acc:'#e9d5ff',line:'rgba(255,255,255,.4)',warn:'#fde68a',cell:'#1e1b2e',gold:'#fbbf24'}
 :{bg:'#F4F6FB',txt:'#0E1526',txt2:'#334155',mut:'#64748B',grid:'rgba(79,70,229,.12)',acc:'#6D28D9',line:'rgba(15,23,42,.35)',warn:'#B45309',cell:'#E5E7EB',gold:'#D97706'};
const mo2=new MutationObserver(()=>{if(document.querySelector('.langbtn:not(.thm-done)')){document.querySelectorAll('.langbtn').forEach(x=>x.classList.add('thm-done'));addToggles();}});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{mo2.observe(document.body,{childList:true,subtree:true});addToggles();});else{mo2.observe(document.body,{childList:true,subtree:true});addToggles();}
})(APP);
