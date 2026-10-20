const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.pr-row, .ins, .cs, .ppl-grid figure, .contact-list li').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .7s ease ${i*30}ms, transform .7s ease ${i*30}ms`;
  io.observe(el);
});

// 메트릭스 카운트업
const numIo = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const text = el.textContent.trim();
    const m = text.match(/^([\d,.]+)(\s*\/\s*[\d,.]+)?$/);
    if (!m) { numIo.unobserve(el); return; }
    const target = parseFloat(m[1].replace(/,/g, ''));
    const suffix = m[2] || '';
    let cur = 0;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / 1500);
      const eased = 1 - Math.pow(1 - t, 3);
      cur = target * eased;
      const formatted = Number.isInteger(target) ? Math.round(cur).toLocaleString('en-US') : cur.toFixed(1);
      el.textContent = formatted + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    numIo.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.metrics-grid strong').forEach((el) => numIo.observe(el));
