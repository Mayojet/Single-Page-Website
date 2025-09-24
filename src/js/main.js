// ===== NAVBAR + SCROLL SPY =====
const navWrap = document.querySelector('.nav-wrap');
const progressBar = document.getElementById('progressBar');
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-links a, .nav__link')];

function onScroll() {
  if (!navWrap) return;

  // Resize state
  if (window.scrollY > 50) {
    navWrap.classList.add('small');
    navWrap.classList.remove('large');
  } else {
    navWrap.classList.add('large');
    navWrap.classList.remove('small');
  }

  // Progress bar
  if (progressBar) {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    progressBar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + '%';
  }

  // Active link (position indicator)
  let active = sections.length - 1;
  const navH = navWrap.getBoundingClientRect().height;

  for (let i = 0; i < sections.length; i++) {
    const sec = sections[i];
    const top = sec.offsetTop - navH - 5;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) { active = i; break; }
  }
  // Ensure last item is active at absolute page bottom
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
    active = sections.length - 1;
  }

  navLinks.forEach(l => l.classList.remove('active'));
  if (navLinks[active]) navLinks[active].classList.add('active');
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
window.addEventListener('load', onScroll);

// Smooth scroll with navbar offset
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target || !navWrap) return;
    const top = target.offsetTop - navWrap.getBoundingClientRect().height + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navLinksContainer = document.getElementById('navLinks');
hamburger?.addEventListener('click', () => navLinksContainer?.classList.toggle('show'));
navLinks.forEach(link => link.addEventListener('click', () => navLinksContainer?.classList.remove('show')));

onScroll(); // init once

// ===== CAROUSEL =====
const track = document.querySelector('.carousel__track');
const slides = track ? [...track.querySelectorAll('.slide')] : [];
const prevBtn = document.querySelector('.carousel__btn.prev');
const nextBtn = document.querySelector('.carousel__btn.next');
let index = 0;

function setSlide(i) {
  if (!track || !slides.length) return;
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}
prevBtn?.addEventListener('click', () => setSlide(index - 1));
nextBtn?.addEventListener('click', () => setSlide(index + 1));

// Keyboard & touch support
const carousel = document.querySelector('.carousel');
if (carousel) {
  carousel.setAttribute('tabindex','0');
  carousel.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') setSlide(index - 1);
    if (e.key === 'ArrowRight') setSlide(index + 1);
  });
}
let startX = 0;
track?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track?.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 40) { dx < 0 ? setSlide(index + 1) : setSlide(index - 1); }
});

// ===== MODALS =====
function openModal(sel){
  const m = document.querySelector(sel);
  if (!m) return;
  m.setAttribute('aria-hidden','false');
  m.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(m){
  m.setAttribute('aria-hidden','true');
  m.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-modal-open]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const sel = btn.getAttribute('data-modal-open');
    if (sel) openModal(sel);
  });
});
document.querySelectorAll('[data-modal-close]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const m = btn.closest('.modal'); if (m) closeModal(m);
  });
});
document.querySelectorAll('.modal .modal-backdrop, .modal__backdrop').forEach(b=>{
  b.addEventListener('click',()=>{
    const m = b.closest('.modal'); if (m) closeModal(m);
  });
});
document.addEventListener('keydown',e=>{
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal[aria-hidden="false"], .modal.open').forEach(m=>closeModal(m));
  }
});

// Badge grid image → modal
const imgModal = document.getElementById('imgModal');
const imgEl = imgModal?.querySelector('.modal__img');
document.querySelectorAll('.badge-grid a').forEach(a=>{
  a.addEventListener('click',e=>{
    const href = a.getAttribute('href');
    if (!href || !imgModal || !imgEl) return;
    e.preventDefault();
    imgEl.src = href;
    openModal('#imgModal');
  });
});
