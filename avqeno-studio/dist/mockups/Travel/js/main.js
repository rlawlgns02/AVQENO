// 카운트다운
(function () {
  const el = document.getElementById('t');
  if (!el) return;
  let h = 14, m = 22, s = 8;
  const pad = (n) => String(n).padStart(2, '0');
  setInterval(() => {
    s--;
    if (s < 0) { s = 59; m--; }
    if (m < 0) { m = 59; h--; }
    if (h < 0) h = 23;
    el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }, 1000);
})();

const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.deal, .dc, .pkg, .st, .mag article').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .6s ease ${i*30}ms, transform .6s ease ${i*30}ms`;
  io.observe(el);
});
