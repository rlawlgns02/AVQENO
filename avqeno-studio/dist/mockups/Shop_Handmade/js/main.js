// 스크롤 페이드 인
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.work, .cat-card, .letter, .class-row, .artist-feat, .cta-band').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  io.observe(el);
});

// .in 클래스로 활성화
const style = document.createElement('style');
style.textContent = `.in { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// 부드러운 헤더 그림자
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 12) {
    header.style.boxShadow = '0 2px 12px rgba(58,40,24,.08)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });
