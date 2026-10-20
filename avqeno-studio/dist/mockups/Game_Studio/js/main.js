// 픽셀 등장 애니
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.game-row, .member, .log, .join-stats > div').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .6s ease, transform .6s ease';
  io.observe(el);
});

// 키 입력 이스터에그
let buffer = '';
window.addEventListener('keydown', (e) => {
  buffer = (buffer + e.key).slice(-6).toLowerCase();
  if (buffer.endsWith('oak')) {
    document.body.style.transition = 'filter .4s';
    document.body.style.filter = 'hue-rotate(60deg) saturate(1.5)';
    setTimeout(() => document.body.style.filter = '', 1500);
  }
});
