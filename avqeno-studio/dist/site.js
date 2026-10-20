(() => {
 'use strict';
 const root=document.documentElement,media=matchMedia('(prefers-reduced-motion: reduce)'),toggle=document.querySelector('#motion-toggle');
 let preference;
 try{preference=localStorage.getItem('avqeno-motion');}catch{}
 let motion=preference?preference==='on':!media.matches;
 function applyMotion(){
   const enabled=motion&&!media.matches;
   root.dataset.motion=enabled?'on':'off';
   root.classList.toggle('js-motion',enabled);
   toggle.setAttribute('aria-checked',String(enabled));
   toggle.querySelector('.motion-label').textContent=enabled?'MOTION ON':'MOTION OFF';
   toggle.title=media.matches?'기기의 움직임 줄이기 설정이 적용되어 있습니다.':'애니메이션 켜기 / 끄기';
   window.AVQENO?.setMotion(enabled);
   document.dispatchEvent(new CustomEvent('avqeno:motion',{detail:{enabled}}));
 }
 applyMotion();
 toggle.addEventListener('click',()=>{motion=!motion;try{localStorage.setItem('avqeno-motion',motion?'on':'off');}catch{}applyMotion();});
 media.addEventListener('change',applyMotion);
 // Relative fetch is replaced with inline SVG by the packaging script for file:// support.
 document.querySelectorAll('svg[data-avqeno]').forEach(svg=>{svg.dataset.theme='light';window.AVQENO.mount(svg);});
 applyMotion();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('seen');observer.unobserve(e.target);}}),{threshold:.08});
 document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mobile-nav');
 function closeMenu(){nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','메뉴 열기');}
 menu.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')!=='true';nav.hidden=!opened;menu.setAttribute('aria-expanded',String(opened));menu.setAttribute('aria-label',opened?'메뉴 닫기':'메뉴 열기');});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!nav.hidden){closeMenu();menu.focus();}});
 matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
 const brief=document.querySelector('#brief-dialog');
 document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});});
 document.querySelector('#open-brief').addEventListener('click',()=>brief.showModal());
 const briefForm=document.querySelector('#brief-form');
 function briefText(){
   const f=new FormData(briefForm);
   return {brand:f.get('brand'),text:`AVQENO 웹사이트 제작 상담\n\n브랜드 / 사업명: ${f.get('brand')}\n분야: ${f.get('industry')}\n\n웹사이트로 하고 싶은 일\n${f.get('story')}\n`};
 }
 briefForm.addEventListener('input',()=>{
   const {brand,text}=briefText();
   briefForm.dataset.emailHref='mailto:KJHrlawlgns02@gmail.com?subject='+encodeURIComponent(`[AVQENO 제작 문의] ${brand}`)+'&body='+encodeURIComponent(text);
 });
 briefForm.addEventListener('submit',e=>{
   e.preventDefault();const {brand,text}=briefText();
   location.href='mailto:KJHrlawlgns02@gmail.com?subject='+encodeURIComponent(`[AVQENO 제작 문의] ${brand}`)+'&body='+encodeURIComponent(text);
   document.querySelector('#form-status').textContent='이메일 앱에서 내용을 확인한 뒤 보내기를 눌러주세요. 앱이 열리지 않으면 위 이메일 주소나 카카오톡을 이용해 주세요.';
 });
 document.querySelector('#download-brief').addEventListener('click',()=>{
   if(!briefForm.reportValidity())return;
   const {text}=briefText();
   const url=URL.createObjectURL(new Blob(['\uFEFF',text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='AVQENO-상담준비서.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
   document.querySelector('#form-status').textContent='상담 준비서를 내려받았습니다. 이메일이나 카카오톡으로 전달해 주세요. 아직 전송되지 않았습니다.';
 });
})();
