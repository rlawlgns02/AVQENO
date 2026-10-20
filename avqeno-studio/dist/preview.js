(() => {
 const svg=document.querySelector('.preview-logo svg');
 const api=AVQENO.mount(svg),range=document.querySelector('#timeline'),out=document.querySelector('#progress');
 svg.addEventListener('avqeno:frame',e=>{range.value=Math.round(e.detail.progress*1000);out.value=Math.round(e.detail.progress*100)+'%';});
 document.querySelector('#play').onclick=()=>api.play();
 document.querySelector('#reverse').onclick=()=>api.reverse();
 range.addEventListener('input',()=>api.seek(+range.value/1000));
 document.querySelector('#theme').onclick=e=>{const dark=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(dark));e.currentTarget.textContent=dark?'라이트 배경':'다크 배경';document.querySelector('.stage').dataset.theme=svg.dataset.theme=dark?'dark':'light';};
 document.querySelector('#motion').onclick=e=>{const on=e.currentTarget.getAttribute('aria-pressed')!=='true';e.currentTarget.setAttribute('aria-pressed',String(on));e.currentTarget.textContent=on?'모션 ON':'모션 OFF';api.setMotion(on);};
 document.querySelectorAll('.state').forEach(state=>{const clone=svg.cloneNode(true);clone.removeAttribute('tabindex');clone.setAttribute('role','img');clone.setAttribute('aria-label',`변형 진행률 ${+state.dataset.state*100}%`);const id=`avq-ink-${state.dataset.state}`;clone.querySelector('linearGradient').id=id;clone.querySelector('[data-paths]').setAttribute('stroke',`url(#${id})`);state.prepend(clone);AVQENO.mount(clone).seek(+state.dataset.state);});
 const report=document.querySelector('#test-status');
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 document.querySelector('#run-tests').onclick=async e=>{
   const button=e.currentTarget;button.disabled=true;report.textContent='검증 중…';
   const results=[];const check=(name,pass)=>results.push(`${pass?'PASS':'FAIL'}  ${name}`);
   const nodes=[...svg.querySelectorAll('[data-ribbon]')];
   api.seek(0);const initial=nodes.map(p=>p.getAttribute('d'));
   api.seek(.5);const middle=nodes.map(p=>p.getAttribute('d'));
   api.seek(1);const final=nodes.map(p=>p.getAttribute('d'));
   check('동일한 6개 SVG path 유지',nodes.length===6&&nodes.every((n,i)=>n===svg.querySelectorAll('[data-ribbon]')[i]));
   check('기본 / 중간 / 완성 좌표가 모두 다름',initial.every((d,i)=>d!==middle[i]&&middle[i]!==final[i]));
   check('모든 상태 M + 16 C 경로 구조 일치',[...initial,...middle,...final].every(d=>(d.match(/C/g)||[]).length===16&&!/NaN|Infinity/.test(d)));
   check('비트맵 / 텍스트 교체 없음',svg.querySelectorAll('image,text,foreignObject').length===0);
   let contained=true;
   for(let i=0;i<=20;i++){api.seek(i/20);const b=svg.querySelector('[data-paths]').getBBox();contained&&=b.x>=15&&b.y>=15&&b.x+b.width<=885&&b.y+b.height<=305;}
   check('21개 중간 프레임에서 SVG 경계 안에 유지',contained);
   api.seek(0);api.play();
   await wait(640);const forward=api.progress;api.reverse();const reversal=api.progress;
   check('중간 역재생 시 위치 연속',Math.abs(forward-reversal)<.001);
   await wait(750);check('역재생 후 정확히 심볼 복귀',api.progress===0);
   if(!api.reduced){api.play();await wait(1550);check('1.4초 재생 후 완성',api.progress===1);}
   if(!api.reduced){
     api.seek(0);svg.dispatchEvent(new PointerEvent('pointerenter',{pointerType:'mouse'}));
     await wait(480);check('마우스 진입 이벤트로 실제 변형 시작',api.progress>0&&api.progress<1);
     svg.dispatchEvent(new PointerEvent('pointerleave',{pointerType:'mouse'}));
     await wait(600);check('마우스 이탈 이벤트로 심볼 복귀',api.progress===0);
     svg.dispatchEvent(new PointerEvent('click',{pointerType:'touch'}));await wait(1550);
     check('터치 탭으로 브랜드명 완성',api.progress===1);
     svg.dispatchEvent(new PointerEvent('click',{pointerType:'touch'}));await wait(1550);
     check('두 번째 터치 탭으로 심볼 복귀',api.progress===0);
   }
   api.setMotion(false);api.play();await wait(80);check('모션 OFF에서 정적 심볼',api.progress===0);
   api.setMotion(true);api.seek(0);
   check('키보드 접근성',svg.getAttribute('tabindex')==='0'&&svg.getAttribute('role')==='button');
   report.textContent=results.join('\n')+(api.reduced?'\nNOTE  OS 움직임 줄이기 적용 중. 재생 길이 검사는 생략.':'');
   document.body.dataset.testResult=results.some(s=>s.startsWith('FAIL'))?'fail':'pass';
   button.disabled=false;
 };
})();
