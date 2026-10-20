const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.unit, .am, .sch, .loc-info article').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = `opacity .8s ease ${i*50}ms, transform .8s ease ${i*50}ms`;
  io.observe(el);
});
