const cnt=document.getElementById('cnt');
let n=8420318;setInterval(()=>{n+=Math.floor(Math.random()*8+2);cnt.textContent=n.toLocaleString('en-US')},900);
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.style.opacity='1';e.target.style.transform='translateY(0)';io.unobserve(e.target)}})},{threshold:.1});
document.querySelectorAll('.sv,.net-grid article,.stg').forEach((el,i)=>{el.style.opacity='0';el.style.transform='translateY(18px)';el.style.transition=`opacity .55s ease ${i*40}ms,transform .55s ease ${i*40}ms`;io.observe(el)});
