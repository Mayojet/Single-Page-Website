/* Your JS here. */
const navBar = document.querySelector('.navbar');
const navLinks = [...document.querySelectorAll('.nav__link')];
const sections = [...document.querySelectorAll('section[id], section:not([id])')].filter(s => s.id);

function updateNavSize() {
  if (window.scrollY > 10) navBar.classList.add('shrink');
  else navBar.classList.remove('shrink');
}

function updateActiveLink() {
  const navHeight = navBar.getBoundingClientRect().height;
  const checkY = navHeight + 2;
  let current = null;
  for (const sec of sections) {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= checkY && rect.bottom > checkY) { current = sec.id; break; }
  }
  const atBottom = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
  if (atBottom && sections.length) current = sections[sections.length - 1].id;
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
}

document.addEventListener('scroll', () => { updateNavSize(); updateActiveLink(); }, { passive: true });
window.addEventListener('load', () => { updateNavSize(); updateActiveLink(); });

navLinks.forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const track = document.querySelector('.carousel__track');
const slides = [...document.querySelectorAll('.slide')];
const prevBtn = document.querySelector('.carousel__btn.prev');
const nextBtn = document.querySelector('.carousel__btn.next');
let index = 0;
function setSlide(i) {
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}
prevBtn?.addEventListener('click', () => setSlide(index - 1));
nextBtn?.addEventListener('click', () => setSlide(index + 1));

function openModal(sel) {
  const m = document.querySelector(sel);
  if (!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden', 'false');
}
function closeModal(m) {
  m.classList.remove('open');
  m.setAttribute('aria-hidden', 'true');
}
document.querySelectorAll('[data-modal-open]').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.getAttribute('data-modal-open')));
});
document.querySelectorAll('[data-modal-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.closest('.modal')));
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.open').forEach(closeModal);
});

