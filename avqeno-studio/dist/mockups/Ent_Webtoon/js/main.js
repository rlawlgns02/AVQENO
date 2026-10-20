document.querySelectorAll('.rt').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.rt').forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.card,.g,.ed,.rank-list li').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(16px)';el.style.transition=`opacity .5s ease ${i*30}ms,transform .5s ease ${i*30}ms`;io.observe(el)});
