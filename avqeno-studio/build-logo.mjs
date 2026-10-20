import fs from 'node:fs';
const out = new URL('./dist/', import.meta.url);
const line = (a, b) => [a[0]+(b[0]-a[0])/3,a[1]+(b[1]-a[1])/3,a[0]+2*(b[0]-a[0])/3,a[1]+2*(b[1]-a[1])/3,...b];
const poly = pts => ({start:pts[0], curves:pts.slice(1).map((p,i)=>line(pts[i],p))});
const curve = (start, ...curves) => ({start,curves});
const sources = [
  poly([[390,220],[419,157]]),
  curve([419,157],[427,139,437,117,443,104],[446,97,453,97,457,105]),
  poly([[457,105],[501,200]]),
  curve([501,200],[510,219,509,226,492,216]),
  curve([492,216],[471,204,429,180,410,169],[398,162,400,154,414,154]),
  curve([414,154],[434,154,459,154,479,154])
];
const targets = [
  poly([[198,200],[230,120],[262,200],[252,175],[208,175]]),
  curve([288,120],line([288,120],[315,193]),[318,202,322,202,325,193],line([325,193],[352,120])),
  curve([439,189],[445,182,447,172,447,160],[447,132,434,120,414,120],[394,120,381,132,381,160],[381,188,394,200,414,200],[425,200,434,196,439,189],line([439,189],[453,205])),
  poly([[528,120],[478,120],[478,160],[521,160],[478,160],[478,200],[528,200]]),
  poly([[562,200],[562,120],[622,200],[622,120]]),
  curve([688,200],[667,200,655,186,655,160],[655,134,667,120,688,120],[709,120,721,134,721,160],[721,186,709,200,688,200])
];
// Identical M + 16 C topology. Exact subdivision preserves the authored curves.
function normalize(path) {
 const p=structuredClone(path);
 while(p.curves.length<16) {
  let best=0,max=-1,start=p.start;
  p.curves.forEach((c,i)=>{const d=Math.hypot(c[0]-start[0],c[1]-start[1])+Math.hypot(c[2]-c[0],c[3]-c[1])+Math.hypot(c[4]-c[2],c[5]-c[3]);if(d>max){best=i;max=d;}start=c.slice(4);});
  const a=best?p.curves[best-1].slice(4):p.start,c=p.curves[best];
  const b=c.slice(0,2),d=c.slice(2,4),e=c.slice(4);
  const mid=(u,v)=>u.map((n,i)=>(n+v[i])/2);
  const ab=mid(a,b),bd=mid(b,d),de=mid(d,e),x=mid(ab,bd),y=mid(bd,de),m=mid(x,y);
  p.curves.splice(best,1,[...ab,...x,...m],[...y,...de,...e]);
 }
 return [...p.start,...p.curves.flat()];
}
const data=sources.map((s,i)=>({from:normalize(s),to:normalize(targets[i])}));
const d=a=>'M'+a.slice(0,2).join(' ')+' '+Array.from({length:16},(_,i)=>'C'+a.slice(2+i*6,8+i*6).map(v=>+v.toFixed(4)).join(' ')).join(' ');
const defs=`<defs><linearGradient id="avq-ink" x1="320" y1="95" x2="565" y2="235" gradientUnits="userSpaceOnUse"><stop class="ink-a" stop-color="#173f36"/><stop class="ink-b" offset=".53" stop-color="#287b66"/><stop class="ink-c" offset="1" stop-color="#102c27"/></linearGradient></defs>
<style>.ink-a{stop-color:var(--logo-a,#173f36)}.ink-b{stop-color:var(--logo-b,#287b66)}.ink-c{stop-color:var(--logo-c,#102c27)}@media(prefers-color-scheme:dark){svg:not([data-theme="light"]){--logo-a:#b9f5ca;--logo-b:#efffe8;--logo-c:#7cd8b0}}svg[data-theme="dark"]{--logo-a:#b9f5ca;--logo-b:#efffe8;--logo-c:#7cd8b0}svg:focus{outline:none}svg:focus-visible .focus-ring{stroke:#6d9d45;stroke-width:2}.hit{cursor:pointer}</style>`;
const paths=data.map((p,i)=>`<path data-ribbon="${i}" d="${d(p.from)}"/>`).join('\n');
const body=`${defs}<g data-paths="" fill="none" stroke="url(#avq-ink)" stroke-width="22" stroke-linecap="round" stroke-linejoin="round">${paths}</g>`;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 320" data-avqeno="" role="button" tabindex="0" aria-label="AVQENO 로고 펼치기" aria-pressed="false"><title>AVQENO — 연결에서 시작되는 가능성</title><desc>A와 Q를 연결한 리본이 여섯 글자로 펼쳐집니다. 마우스, 포커스, Enter 또는 터치로 조작할 수 있습니다.</desc>${body}<rect class="hit" width="900" height="320" fill="transparent"/><rect class="focus-ring" x="8" y="8" width="884" height="304" rx="24" fill="none" stroke="none" pointer-events="none"/><metadata id="avq-data">${JSON.stringify(data)}</metadata></svg>`;
fs.writeFileSync(new URL('logo.svg',out),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="365 75 170 170" role="img"><title>AVQENO</title>${body}</svg>`);
fs.writeFileSync(new URL('logo-light.svg',out),`<svg xmlns="http://www.w3.org/2000/svg" viewBox="365 75 170 170" data-theme="light" role="img"><title>AVQENO</title>${body}</svg>`);
fs.writeFileSync(new URL('logo-inline.svg',out),svg);
const js=fs.readFileSync(new URL('animation.js',out),'utf8');
fs.writeFileSync(new URL('logo-animated.svg',out),svg.replace('</svg>',`<script><![CDATA[\n${js}\n]]></script></svg>`));
console.log('Built static, inline, and standalone animated SVGs. Six paths × sixteen cubic segments.');
