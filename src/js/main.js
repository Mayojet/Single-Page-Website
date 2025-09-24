/* Your JS here. */
const navBar=document.querySelector('.navbar');
const navLinks=[...document.querySelectorAll('.nav__link')];
const sections=[...document.querySelectorAll('section[id]')];

const progress=document.createElement('div');
progress.className='nav__progress';
navBar.appendChild(progress);

let isShrunk = false;
const SHRINK_START = 24; 
const SHRINK_END = 6;    

function updateNavSize(){
  const y = window.scrollY || document.documentElement.scrollTop || 0;
  if (!isShrunk && y > SHRINK_START) {
    navBar.classList.add('shrink');
    isShrunk = true;
  } else if (isShrunk && y < SHRINK_END) {
    navBar.classList.remove('shrink');
    isShrunk = false;
  }
}
  
function updateActiveLink(){
  const navHeight=navBar.getBoundingClientRect().height;
  const checkY=navHeight+2;
  let current=null;
  for(const sec of sections){
    const r=sec.getBoundingClientRect();
    if(r.top<=checkY&&r.bottom>checkY){current=sec.id;break}
  }
  const atBottom=Math.ceil(window.scrollY+window.innerHeight)>=document.documentElement.scrollHeight;
  if(atBottom&&sections.length)current=sections[sections.length-1].id;
  navLinks.forEach(a=>{
    const active=a.getAttribute('href')===`#${current}`;
    a.classList.toggle('active',active);
    if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
  });
}
function updateProgress(){
  const h=document.documentElement;
  const max=h.scrollHeight-h.clientHeight;
  const pct=max>0?(window.scrollY/max)*100:0;
  progress.style.width=pct+'%';
}
document.addEventListener('scroll',()=>{updateNavSize();updateActiveLink();updateProgress()},{passive:true});
window.addEventListener('load',()=>{updateNavSize();updateActiveLink();updateProgress()});

navLinks.forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const id=a.getAttribute('href').slice(1);
    document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

const track=document.querySelector('.carousel__track');
const slides=[...document.querySelectorAll('.slide')];
const prevBtn=document.querySelector('.carousel__btn.prev');
const nextBtn=document.querySelector('.carousel__btn.next');
let index=0;
function setSlide(i){index=(i+slides.length)%slides.length;track.style.transform=`translateX(-${index*100}%)`}
prevBtn?.addEventListener('click',()=>setSlide(index-1));
nextBtn?.addEventListener('click',()=>setSlide(index+1));

const carousel=document.querySelector('.carousel');
if(carousel){
  carousel.setAttribute('tabindex','0');
  carousel.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft')setSlide(index-1);
    if(e.key==='ArrowRight')setSlide(index+1);
  });
}
let startX=0;
track?.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
track?.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(Math.abs(dx)>40){if(dx<0)setSlide(index+1);else setSlide(index-1)}
});

function openModal(sel){
  const m=document.querySelector(sel);
  if(!m)return;
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
}
function closeModal(m){
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
}
let lastFocus=null;
function getFocusable(el){return[...el.querySelectorAll('a,button,input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled&&x.offsetParent!==null)}
document.querySelectorAll('[data-modal-open]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const sel=btn.getAttribute('data-modal-open');
    const m=document.querySelector(sel);
    if(!m)return;
    lastFocus=document.activeElement;
    openModal(sel);
    const f=getFocusable(m);f[0]?.focus();
    m.addEventListener('keydown',e=>{
      if(e.key!=='Tab')return;
      const list=getFocusable(m);if(!list.length)return;
      const first=list[0],last=list[list.length-1];
      if(e.shiftKey&&document.activeElement===first){last.focus();e.preventDefault()}
      else if(!e.shiftKey&&document.activeElement===last){first.focus();e.preventDefault()}
    },{once:true});
  });
});
document.querySelectorAll('[data-modal-close]').forEach(btn=>{
  btn.addEventListener('click',()=>{const m=btn.closest('.modal');closeModal(m);lastFocus?.focus()});
});
document.querySelectorAll('.modal__backdrop').forEach(b=>{
  b.addEventListener('click',()=>{const m=b.closest('.modal');closeModal(m);lastFocus?.focus()});
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.modal.open').forEach(m=>{closeModal(m);lastFocus?.focus()})
});

const imgModal=document.getElementById('imgModal');
const imgEl=imgModal?.querySelector('.modal__img');
document.querySelectorAll('.badge-grid a').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const src=a.getAttribute('href');
    if(!src||!imgModal||!imgEl) return;
    imgEl.src=src;
    openModal('#imgModal');
  });
});
