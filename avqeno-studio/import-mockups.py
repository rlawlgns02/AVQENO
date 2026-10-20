"""Import authored mockups without modifying the user's web/ source directory."""
from pathlib import Path
from html.parser import HTMLParser
import html, re, json, shutil

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT.parent/'web'/'web-mockup'
DEST=ROOT/'dist'/'mockups'
DEST.mkdir(parents=True,exist_ok=True)
(ROOT/'dist'/'thumbs').mkdir(exist_ok=True)
GROUPS={
 'Shop':('shop','매장 · 쇼핑'), 'Corp':('corp','기업 · 테크'),
 'Food':('food','식음료'), 'Game':('game','게임 · e스포츠'),
 'Ent':('ent','엔터테인먼트'), 'Port':('port','개인 · 포트폴리오'),
 'Life':('life','라이프스타일'), 'Other':('other','공간 · 교육 · 여행')
}
LABELS={
 'Art_Gallery':'아트 갤러리','Corp_Consulting':'컨설팅','Corp_Fintech':'핀테크',
 'Corp_IT':'IT · SaaS','Corp_Logistics':'물류','Corp_Manufacturing':'제조업','Corp_Security':'사이버 보안',
 'Edu_Platform':'교육 플랫폼','Ent_Music':'뮤직 플랫폼','Ent_OTT':'OTT · 콘텐츠','Ent_Webtoon':'웹툰',
 'Food_Restaurant':'파인다이닝','Food_Vegan':'비건 · 푸드','Game_Console':'콘솔 게임','Game_Esports':'e스포츠',
 'Game_Mobile':'모바일 게임','Game_Studio':'게임 스튜디오','Life_Pet':'반려동물','Life_Wedding':'웨딩',
 'Life_Yoga':'요가 스튜디오','Media_News':'디지털 매거진','Port_Designer':'디자이너','Port_Photo':'포토그래퍼',
 'RealEstate':'공간 · 부동산','Shop_Budget':'라이프 쇼핑','Shop_Fashion':'패션 브랜드','Shop_Handmade':'공방 · 핸드메이드',
 'Shop_Luxury':'럭셔리 브랜드','Travel':'여행'
}
ALIASES=['MAISON ÉTERNELLE','MAISON&nbsp;ÉTERNELLE','Maison Éternelle','NORTHFIELD & PARTNERS','Northfield & Partners',
 'NORTHFIELD','BLUE CAPITAL','Blue Capital','Flowmark','MERIDIAN LOGIX','Meridian Logix','HANJIN PRECISION',
 '한진정밀','SENTRYX','CodeRiver','WAVE','BLACKLINE','STREAM+','두루뭉','NARU','나루','SPROUT & SOIL',
 'SPROUT &amp; SOIL','Drifters of Aelin','DRIFTERS','AELIN','NEXUS GAMING','NEXUS Gaming','NEXUS',
 '이클립스 사가','ECLIPSE SAGA','Eclipse Saga','PIXEL OAK STUDIO','Pixel Oak Studio','달리','EVERMORE','STILL',
 'THE LEDGER','JIWON LEE','JIWON','SOO HYUN PARK','soo hyun park','SEOUL RIDGE','땡큐몰','UNFOLD','손담','SONDAM','WAVERLY','HORIZON']
class Rebrand(HTMLParser):
 def __init__(self,source):
  super().__init__(convert_charrefs=False); self.source=source; self.offsets=[0]; self.edits=[]; self.stack=[]
  for line in source.splitlines(True): self.offsets.append(self.offsets[-1]+len(line))
 def pos(self): line,col=self.getpos(); return self.offsets[line-1]+col
 def handle_starttag(self,tag,attrs):
  attr=dict(attrs); classes=attr.get('class','').split()
  selected=tag in ('a','p','h1','h2','span') and ('brand' in classes or 'logo' in classes)
  if selected:self.stack.append((tag,self.pos()+len(self.get_starttag_text())))
 def handle_endtag(self,tag):
  if self.stack and self.stack[-1][0]==tag:
   _,start=self.stack.pop(); self.edits.append((start,self.pos(),'AVQENO'))
 def handle_data(self,data):
  if self.stack:return
  result=data
  for alias in sorted(ALIASES,key=len,reverse=True):
   result=re.sub(re.escape(html.unescape(alias)), 'AVQENO',result,flags=re.I)
  if result!=data:self.edits.append((self.pos(),self.pos()+len(data),result))
 def output(self):
  result=self.source
  for a,b,text in sorted(self.edits,reverse=True):result=result[:a]+text+result[b:]
  return result

items=[]
for folder in sorted(SOURCE.iterdir()):
 if not folder.is_dir() or not (folder/'index.html').exists():continue
 name=folder.name; group,label=GROUPS.get(name.split('_')[0],GROUPS['Other']); kind=LABELS[name]
 target=DEST/name;target.mkdir(exist_ok=True)
 for p in folder.rglob('*'):
  if p.is_file() and p.suffix in ('.html','.css','.js'):
   dest=target/p.relative_to(folder);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(p,dest)
 source=(target/'index.html').read_text(encoding='utf-8')
 parser=Rebrand(source);parser.feed(source);source=parser.output()
 source=re.sub(r'<title>.*?</title>',f'<title>AVQENO — {kind} 목업</title>',source,flags=re.S)
 banner='<aside class="avq-demo-notice">AVQENO / '+kind+' 디자인 목업 <span>화면 속 수치·상품·서비스는 예시입니다.</span><a href="../../index.html#possibilities">스튜디오로 돌아가기 ↗</a></aside>'
 source=source.replace('</head>','<link rel="stylesheet" href="../demo.css"></head>').replace('</body>',banner+'<script src="../demo.js"></script></body>')
 (target/'index.html').write_text(source,encoding='utf-8')
 still=re.sub(r'<script\b[^>]*>.*?</script>','',source,flags=re.S|re.I)
 still=still.replace(banner,'').replace('</head>','<style>*,*:before,*:after{animation:none!important;transition:none!important}body{padding-bottom:0!important}</style></head>')
 (target/'still.html').write_text(still,encoding='utf-8')
 image=f'thumbs/{name}.png'
 items.append({'id':name,'name':'AVQENO','kind':kind,'group':group,'category':label,'image':image,'url':f'mockups/{name}/index.html'})
(ROOT/'dist'/'mockups-data.js').write_text('window.AVQENO_MOCKUPS = '+json.dumps(items,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
(DEST/'demo.css').write_text('''.avq-demo-notice{position:fixed;z-index:99999;bottom:0;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:15px;padding:12px 20px;background:#172820;color:#f4f8ee;font:11px/1.5 Arial,sans-serif;box-shadow:0 -1px 0 #bada9733}.avq-demo-notice span{opacity:.6}.avq-demo-notice a{color:#d9f57c;text-decoration:none}body{padding-bottom:50px}@media(max-width:650px){.avq-demo-notice{font-size:9px;padding:10px 12px}.avq-demo-notice span{display:none}}html[data-motion=off] *,html[data-motion=off] *:before,html[data-motion=off] *:after{animation:none!important;transition:none!important}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation:none!important;transition:none!important}}''',encoding='utf-8')
(DEST/'demo.js').write_text("""(()=>{function apply(){let off=matchMedia('(prefers-reduced-motion: reduce)').matches;try{off ||=localStorage.getItem('avqeno-motion')==='off'}catch{}document.documentElement.dataset.motion=off?'off':'on'}apply();addEventListener('storage',apply);matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',apply)})();""",encoding='utf-8')
print(f'Imported {len(items)} authored mockups, rebranded AVQENO; original web/ unchanged.')
