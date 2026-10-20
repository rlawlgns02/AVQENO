// 숫자 카운트업
function animateCount(el, target, duration = 1400) {
  const start = 0;
  const startT = performance.now();
  const isFloat = !Number.isInteger(target);
  function tick(now) {
    const t = Math.min(1, (now - startT) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = start + (target - start) * eased;
    el.textContent = isFloat ? val.toFixed(1) : Math.round(val).toLocaleString('ko-KR');
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const numEls = document.querySelectorAll('.stat strong, .rd-card strong');
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      const small = en.target.querySelector('small');
      const text = en.target.firstChild.textContent.trim();
      const num = parseFloat(text.replace(/,/g, ''));
      if (!isNaN(num)) {
        en.target.firstChild.textContent = '0';
        animateCount({ textContent: '', set textContent(v) {
          if (small) {
            en.target.innerHTML = v + (small.outerHTML || '');
          } else {
            en.target.textContent = v;
          }
        } }, num);
      }
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.5 });
numEls.forEach((el) => io.observe(el));

// 일반 페이드 인
const io2 = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io2.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.prod, .fac-item, .esg-card, .cn-card').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io2.observe(el);
});
