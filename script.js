// ===== Simple, beginner-friendly JavaScript =====
const nav = document.getElementById('nav');
const menu = document.getElementById('menu');
const menuBtn = document.getElementById('menuBtn');
const toTop = document.getElementById('toTop');

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Mobile menu toggle
menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menu.classList.remove('open'); menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', false);
}));

// Navbar background + back-to-top visibility on scroll
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
  toTop.classList.toggle('show', window.scrollY > 500);
}, { passive: true });
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Reveal sections as they scroll into view + highlight active nav link
const links = [...menu.querySelectorAll('a')];
if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); reveal.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));

  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('section[id]').forEach(s => spy.observe(s));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

// ===== Contact form validation =====
const form = document.getElementById('form');
const status = document.getElementById('status');
const MY_EMAIL = 'vishwjeetchannagire5@gmail.com'; // <-- change to your email

const rules = {
  name: v => v.trim().length >= 2 ? '' : 'Enter your name (at least 2 characters).',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Enter a valid email address, like name@example.com.',
  message: v => v.trim().length >= 10 ? '' : 'Write a message of at least 10 characters.'
};

function check(field) {
  const msg = rules[field.name](field.value);
  field.classList.toggle('invalid', !!msg);
  form.querySelector(`[data-for="${field.name}"]`).textContent = msg;
  return !msg;
}

Object.keys(rules).forEach(n => form[n].addEventListener('blur', () => check(form[n])));

form.addEventListener('submit', e => {
  e.preventDefault();
  status.textContent = '';
  const ok = Object.keys(rules).map(n => check(form[n])).every(Boolean);
  if (!ok) return;
  // Opens the visitor's email app with the message filled in (no server needed).
  const subject = encodeURIComponent('Portfolio message from ' + form.name.value.trim());
  const body = encodeURIComponent(form.message.value.trim() + '\n\nFrom: ' + form.name.value.trim() + ' (' + form.email.value.trim() + ')');
  window.location.href = `mailto:${MY_EMAIL}?subject=${subject}&body=${body}`;
  status.textContent = 'Opening your email app to send the message.';
  form.reset();
});

// ===== Typing effect in the hero (edit the words below) =====
const words = ['C++ programs', 'Python scripts', 'responsive websites', 'data structure projects'];
const typed = document.getElementById('typed');
let w = 0, c = 0, deleting = false;
function type() {
  const word = words[w];
  typed.textContent = word.slice(0, c);
  if (!deleting && c === word.length) { deleting = true; setTimeout(type, 1400); return; }
  if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
  c += deleting ? -1 : 1;
  setTimeout(type, deleting ? 40 : 80);
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) typed.textContent = words[0]; else type();

// ===== Card spotlight follows the mouse =====
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});
