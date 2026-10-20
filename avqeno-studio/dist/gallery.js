(() => {
 const data=window.AVQENO_MOCKUPS||[];
 const lanes=document.querySelector('.mockup-lanes');
 if(!lanes)return;
 const featured=['Shop_Handmade','Corp_Security','Food_Restaurant','Port_Designer','Game_Esports','Life_Yoga','Shop_Luxury','Travel'];
 const ordered=[...featured.map(id=>data.find(m=>m.id===id)).filter(Boolean),...data.filter(m=>!featured.includes(m.id))];
 const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const card=(m,duplicate=false)=>`<a class="flow-card" href="${escape(m.url)}" target="_blank" rel="noopener" ${duplicate?'tabindex="-1" aria-hidden="true"':''} aria-label="AVQENO ${escape(m.kind)} 목업 전체 보기"><div class="flow-browser"><span></span><span></span><span></span><small>AVQENO / ${escape(m.kind)}</small></div><div class="flow-image"><img src="${escape(m.image)}" alt="AVQENO ${escape(m.kind)} 웹 디자인 목업" loading="lazy" width="900" height="600"></div><div class="flow-caption"><div><span>${escape(m.category)}</span><h3>AVQENO <small>${escape(m.kind)}</small></h3></div><b>↗</b></div></a>`;
 function render(group='all'){
   const list=group==='all'?ordered:data.filter(m=>m.group===group);
   const rows=list.length>3?[list.filter((_,i)=>i%2===0),list.filter((_,i)=>i%2===1)]:[list];
   lanes.innerHTML=rows.map((row,i)=>`<div class="flow-lane lane-${i}"><div class="flow-track" style="--flow-duration:${Math.max(40,row.length*9)}s"><div class="flow-group">${row.map(m=>card(m)).join('')}</div><div class="flow-group" aria-hidden="true">${row.map(m=>card(m,true)).join('')}</div></div></div>`).join('');
   document.querySelector('#mockup-count').textContent=group==='all'?`${data.length}가지 웹사이트 목업 · 8개 업종`:`${list.length}가지 ${list[0]?.category||''} 목업`;
 }
 document.querySelectorAll('[data-mockup-filter]').forEach(button=>button.addEventListener('click',()=>{
   document.querySelectorAll('[data-mockup-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   render(button.dataset.mockupFilter);
 }));
 render();
 lanes.addEventListener('focusin',e=>{if(e.target.matches(':focus-visible'))document.querySelector('.mockup-section').classList.add('keyboard-gallery');});
 const gallery=document.querySelector('#all-mockups');
 document.querySelector('#browse-all-mockups').addEventListener('click',()=>{
   const grid=gallery.querySelector('.all-mockups-grid');
   if(!grid.children.length)grid.innerHTML=data.map(m=>`<a href="${escape(m.url)}" target="_blank" rel="noopener"><img src="${escape(m.image)}" alt="AVQENO ${escape(m.kind)} 미리보기" width="900" height="600" loading="lazy"><span>${escape(m.category)}</span><strong>AVQENO</strong><small>${escape(m.kind)} ↗</small></a>`).join('');
   gallery.showModal();
 });
 // A controlled drift on section surfaces; content remains stable and legible.
 const art=document.querySelector('.hero-art');
 const deck=document.createElement('div');deck.className='hero-preview-deck';deck.setAttribute('aria-hidden','true');
 deck.innerHTML=['Shop_Handmade','Corp_Security','Port_Designer'].map((id,i)=>{const m=data.find(m=>m.id===id);return m?`<div class="hero-preview plane-${i}"><div class="plane-bar"><i></i><i></i><i></i></div><img src="${escape(m.image)}" alt="" width="900" height="600"></div>`:'';}).join('');
 art.prepend(deck);
})();
