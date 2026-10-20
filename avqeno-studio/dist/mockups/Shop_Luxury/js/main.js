// 네비 스크롤 상태
const nav = document.getElementById('nav');
const onScroll = () => {
  if (window.scrollY > 80) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 컬렉션 가로 휠 스크롤 (마우스 휠로 좌우 이동)
const rail = document.getElementById('rail');
if (rail) {
  rail.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

// 페이드 인 (manifesto, artisans, editorial)
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.style.opacity = '1';
      en.target.style.transform = 'translateY(0)';
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.manifesto, .editorial, .artisans, .newsletter, .piece').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
  io.observe(el);
});
