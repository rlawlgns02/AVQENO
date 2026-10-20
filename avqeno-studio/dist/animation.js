/* AVQENO / dependency-free cubic Bézier path morph.
 * Same six paths throughout. No opacity swapping or embedded bitmap.
 * Direct SVG / <object>: script is bundled in logo-animated.svg.
 * Inline SVG: include this script once, then AVQENO.mount(svg).
 */
(function () {
 'use strict';
 const instances=new WeakMap(), controllers=new Set();
 const clamp=n=>Math.min(1,Math.max(0,n));
 function ease(x) {
   let lo=0,hi=1,t=x;
   for(let i=0;i<16;i++){t=(lo+hi)/2;const v=3*(1-t)**2*t*.65+3*(1-t)*t*t*.35+t**3;if(v<x)lo=t;else hi=t;}
   return 3*(1-t)*t*t+t**3;
 }
 function path(a){let s=`M${a[0].toFixed(3)} ${a[1].toFixed(3)}`;for(let i=2;i<a.length;i+=6)s+='C'+a.slice(i,i+6).map(n=>n.toFixed(3)).join(' ');return s;}
 function mount(svg){
   if(instances.has(svg))return instances.get(svg);
   const data=JSON.parse(svg.querySelector('metadata').textContent);
   const center=a=>{const xs=a.filter((_,i)=>i%2===0),ys=a.filter((_,i)=>i%2===1);return [(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2];};
   const centers=data.map(d=>({from:center(d.from),to:center(d.to)}));
   const paths=[...svg.querySelectorAll('[data-ribbon]')],group=svg.querySelector('[data-paths]');
   const media=matchMedia('(prefers-reduced-motion: reduce)');
   let progress=0,target=0,frame=0,last=0,enabled=true,hover=false,focused=false,latched=false,manual=false;
   function draw(){
     const e=progress===0?0:progress===1?1:ease(progress);
     // The ribbon opens spatially slightly ahead of its letterforms, avoiding
     // collisions between neighboring strokes during the middle of the morph.
     const spread=1-(1-e)**2;
     paths.forEach((p,i)=>p.setAttribute('d',path(data[i].from.map((v,k)=>v+(data[i].to[k]-v)*e+(centers[i].to[k%2]-centers[i].from[k%2])*(spread-e)))));
     group.setAttribute('stroke-width',(22-14.5*spread).toFixed(3));
     svg.dataset.progress=progress.toFixed(4);
     svg.setAttribute('aria-pressed',String(target===1));
     svg.setAttribute('aria-label',target?'AVQENO 로고 접기':'AVQENO 로고 펼치기');
     svg.dispatchEvent(new CustomEvent('avqeno:frame',{detail:{progress,eased:e}}));
   }
   function tick(time){
     frame=0;
     if(!last)last=time;
     const dt=(time-last)/1400;last=time;
     progress=target>progress?Math.min(target,progress+dt):Math.max(target,progress-dt);
     draw();
     if(progress!==target)frame=requestAnimationFrame(tick);else last=0;
   }
   function go(value){
     target=clamp(value);manual=false;
     if(!enabled||media.matches){cancelAnimationFrame(frame);frame=0;last=0;progress=target=0;draw();return;}
     if(!frame&&progress!==target){last=0;frame=requestAnimationFrame(tick);}
     draw();
   }
   const reconcile=()=>go(hover||focused||latched?1:0);
   const enter=e=>{if(e.pointerType==='mouse'||e.pointerType==='pen'){hover=true;reconcile();}};
   const leave=e=>{if(e.pointerType==='touch')return;hover=false;if(manual)return;if(!focused)latched=false;reconcile();};
   const focus=()=>{focused=svg.matches(':focus-visible');if(focused)reconcile();};
   const blur=()=>{focused=false;latched=false;reconcile();};
   const click=e=>{if(e.pointerType==='mouse')return;latched=!latched;go(latched?1:0);};
   const key=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();latched=target!==1;go(latched?1:0);}if(e.key==='Escape'){hover=focused=latched=false;go(0);}};
   function updateMotion(){if(media.matches||!enabled){cancelAnimationFrame(frame);frame=0;last=0;progress=0;target=0;draw();}else if(!manual)reconcile();}
   svg.addEventListener('pointerenter',enter);svg.addEventListener('pointerleave',leave);
   svg.addEventListener('focus',focus);svg.addEventListener('blur',blur);
   svg.addEventListener('click',click);svg.addEventListener('keydown',key);
   media.addEventListener('change',updateMotion);
   const api={
     play:()=>go(1),reverse:()=>go(0),
     seek(v){cancelAnimationFrame(frame);frame=0;last=0;progress=target=clamp(v);manual=true;draw();},
     setMotion(v){enabled=!!v;updateMotion();},
     get progress(){return progress;},
     get reduced(){return media.matches;},
     destroy(){cancelAnimationFrame(frame);[['pointerenter',enter],['pointerleave',leave],['focus',focus],['blur',blur],['click',click],['keydown',key]].forEach(([n,f])=>svg.removeEventListener(n,f));media.removeEventListener('change',updateMotion);instances.delete(svg);controllers.delete(api);}
   };
   instances.set(svg,api);controllers.add(api);draw();return api;
 }
 window.AVQENO={mount,mountAll:(root=document)=>[...root.querySelectorAll('svg[data-avqeno]')].map(mount),setMotion:v=>controllers.forEach(c=>c.setMotion(v))};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>window.AVQENO.mountAll(),{once:true});else window.AVQENO.mountAll();
})();
