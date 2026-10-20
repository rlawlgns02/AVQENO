// 글리치 효과 강화 - 마우스 호버 시 일시 트리거
const glitch = document.querySelector('.glitch');
if (glitch) {
  glitch.addEventListener('mouseenter', () => {
    glitch.style.animation = 'none';
    void glitch.offsetWidth;
    glitch.style.textShadow = '3px 0 var(--magenta), -3px 0 var(--cyan), 0 0 30px rgba(0,240,255,.4)';
    setTimeout(() => glitch.style.textShadow = '0 0 30px rgba(0,240,255,.4)', 200);
  });
}

// 등장 페이드
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.player, .match, .stat-card, .merch, .news-item').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .5s ease ${i*30}ms, transform .5s ease ${i*30}ms`;
  io.observe(el);
});

// 라이브 매치 시뮬레이션
let score1 = 2, score2 = 1;
setInterval(() => {
  const liveScoreEl = document.querySelector('.match.live .m-info span:last-child');
  if (liveScoreEl && Math.random() > 0.85) {
    if (Math.random() > 0.5) score1++; else score2++;
    if (score1 > 3 || score2 > 3) { score1 = 2; score2 = 1; }
    liveScoreEl.textContent = `${score1} - ${score2}`;
  }
}, 8000);
