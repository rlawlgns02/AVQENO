// 자산 금액 변동 (실시간 느낌)
(function () {
  const el = document.getElementById('amount');
  if (!el) return;
  let n = 38420580;
  setInterval(() => {
    const delta = Math.floor((Math.random() - .45) * 4000);
    n += delta;
    el.textContent = n.toLocaleString('en-US');
  }, 1800);
})();

// 페이드인
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.prod-card, .trust article, .robo-card').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});

// 차트 호버 시 좌우 탭 활성화 토글
document.querySelectorAll('.pc-tabs span').forEach((s) => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.pc-tabs span').forEach((x) => x.classList.remove('active'));
    s.classList.add('active');
  });
});
