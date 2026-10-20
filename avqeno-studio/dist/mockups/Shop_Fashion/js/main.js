const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.lk,.cat,.story-text').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(20px)';el.style.transition='opacity .8s ease,transform .8s ease';io.observe(el)});
