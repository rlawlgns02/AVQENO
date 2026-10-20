const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.story, .op, .side-card, .mr-list li').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = `opacity .7s ease ${i*25}ms, transform .7s ease ${i*25}ms`;
  io.observe(el);
});
