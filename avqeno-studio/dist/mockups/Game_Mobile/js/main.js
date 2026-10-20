// 파티클 캔버스
(function () {
  const c = document.getElementById('particles');
  const ctx = c.getContext('2d');
  let w, h, particles;
  const COUNT = 60;

  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
  }
  function init() {
    particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + .6,
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      color: ['#ff3d7f','#6c4cff','#f9d342','#5ef0ff'][Math.floor(Math.random()*4)]
    }));
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = .6;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); tick();
})();

// 카운트다운
(function () {
  let d = 128, h = 14, m = 22, s = 8;
  setInterval(() => {
    s--;
    if (s < 0) { s = 59; m--; }
    if (m < 0) { m = 59; h--; }
    if (h < 0) { h = 23; d--; }
    document.getElementById('d').textContent = String(d).padStart(3,'0');
    document.getElementById('h').textContent = String(h).padStart(2,'0');
    document.getElementById('m').textContent = String(m).padStart(2,'0');
    document.getElementById('s').textContent = String(s).padStart(2,'0');
  }, 1000);
})();

// 클래스 카드 호버 시 컬러 강조
document.querySelectorAll('.class-card').forEach((card) => {
  const color = card.dataset.color;
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = color;
    card.style.boxShadow = `0 12px 40px ${color}55`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.borderColor = '';
    card.style.boxShadow = '';
  });
});
