/* Atmospheric SVG motion. No third-party libraries, video, or bitmap assets.
 * Offscreen scenes pause; reduced motion and the global switch stop all effects.
 */
(() => {
 const sections=[...document.querySelectorAll('main > section')];
 const sceneObserver=new IntersectionObserver(entries=>{
   entries.forEach(e=>e.target.classList.toggle('is-active',e.isIntersecting));
 },{rootMargin:'80px'});
 sections.forEach((section,index)=>{
   const id=`scene-${index}`;
   const scene=document.createElement('div');
   scene.className=`ambient-scene ambient-${index%3}`;scene.setAttribute('aria-hidden','true');
   scene.innerHTML=`<svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" focusable="false">
    <defs>
     <linearGradient id="${id}-trail" x1="0" y1="0" x2="1" y2=".4"><stop stop-color="#6da680" stop-opacity="0"/><stop offset=".4" stop-color="#97c969" stop-opacity=".65"/><stop offset=".65" stop-color="#a4e065"/><stop offset="1" stop-color="#6da680" stop-opacity="0"/></linearGradient>
     <pattern id="${id}-grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="currentColor" stroke-width=".5"/></pattern>
     <radialGradient id="${id}-fade"><stop stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient>
     <mask id="${id}-mask"><ellipse cx="${index%2?250:950}" cy="350" rx="650" ry="500" fill="url(#${id}-fade)"/></mask>
    </defs>
    <rect class="ambient-grid" width="1200" height="800" fill="url(#${id}-grid)" mask="url(#${id}-mask)"/>
    <g class="ambient-orbits" fill="none" stroke="currentColor" stroke-width=".7" transform="translate(${index%2?120:1030} 340)">
     <ellipse rx="290" ry="290"/><ellipse rx="235" ry="235" stroke-dasharray="2 12"/><ellipse rx="175" ry="175"/>
     <g class="orbit-scanner"><path d="M-290 0A290 290 0 0 1 0-290" stroke="#8bb854" stroke-width="2"/><circle cx="0" cy="-290" r="5" fill="#a0d85d" stroke="none"/><path d="M-10 0H10M0-10V10"/></g>
    </g>
    <g fill="none" stroke="url(#${id}-trail)" stroke-width="1.2">
     <path class="ambient-flow flow-one" d="M-150 650C120 650 80 230 400 300S780 650 950 300S1250 100 1350 230"/>
     <path class="ambient-flow flow-two" d="M-150 680C120 680 100 260 420 330S800 680 970 330S1270 130 1370 260"/>
     <path class="ambient-wave" d="M-100 500C240 100 330 760 600 410S1050 100 1300 400"/>
    </g>
    <g class="ambient-particles" fill="currentColor">
     ${Array.from({length:9},(_,i)=>{const x=60+(i*137+index*53)%1100,y=90+(i*89+index*107)%620;return `<g class="ambient-particle" style="--delay:${-i*1.7}s;--drift:${i%2?'-':''}22px"><circle cx="${x}" cy="${y}" r="${i%3===0?3:1.5}"/>${i%3===0?`<path d="M${x-8} ${y}h16M${x} ${y-8}v16" fill="none" stroke="currentColor" stroke-width=".6"/>`:''}</g>`;}).join('')}
    </g>
   </svg><span class="ambient-glow"></span>`;
   section.prepend(scene);sceneObserver.observe(scene);
 });
 const art=document.querySelector('.hero-art');
 const satellites=document.createElement('div');satellites.className='hero-satellites';satellites.setAttribute('aria-hidden','true');
 satellites.innerHTML='<i></i><i></i><i></i><span class="orbital-readout">IDEA → IDENTITY → EXPERIENCE</span>';
 art.prepend(satellites);
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 let scrollFrame=0,pointerFrame=0;
 function updateProgress(){scrollFrame=0;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;}
 addEventListener('scroll',()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(updateProgress);},{passive:true});updateProgress();
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 art.addEventListener('pointermove',e=>{
   if(!fine.matches||document.documentElement.dataset.motion==='off')return;
   const r=art.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
   cancelAnimationFrame(pointerFrame);pointerFrame=requestAnimationFrame(()=>{art.style.setProperty('--tilt-x',`${-y*7}deg`);art.style.setProperty('--tilt-y',`${x*7}deg`);});
 },{passive:true});
 function resetTilt(){cancelAnimationFrame(pointerFrame);art.style.setProperty('--tilt-x','0deg');art.style.setProperty('--tilt-y','0deg');}
 art.addEventListener('pointerleave',resetTilt);
 document.addEventListener('avqeno:motion',e=>{if(!e.detail.enabled)resetTilt();});
 document.addEventListener('visibilitychange',()=>{document.body.classList.toggle('page-inactive',document.hidden);});
})();
