const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>{nav.classList.toggle('on',window.scrollY>60)},{passive:true});
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.ep,.cast figure,.cr-grid article').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(20px)';el.style.transition=`opacity .5s ease ${i*40}ms,transform .5s ease ${i*40}ms`;io.observe(el)});
