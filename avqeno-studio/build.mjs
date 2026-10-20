import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import './build-logo.mjs';
const dist=new URL('./dist/',import.meta.url);
if(fs.existsSync(new URL('../web/web-mockup/',import.meta.url))){
 execFileSync('python',[fileURLToPath(new URL('./import-mockups.py',import.meta.url))],{stdio:'inherit'});
}
const mockups=JSON.parse(fs.readFileSync(new URL('mockups-data.js',dist),'utf8').replace('window.AVQENO_MOCKUPS = ','').replace(/;\s*$/,''));
for(const mockup of mockups){
 for(const asset of [mockup.image,mockup.url]){
  if(!fs.existsSync(new URL(asset,dist)))throw new Error(`Missing mockup asset: ${asset}`);
 }
}
const gallery=fs.readFileSync(new URL('gallery-section.html',import.meta.url),'utf8');
const svg=fs.readFileSync(new URL('logo-inline.svg',dist),'utf8').replace('data-avqeno=""','data-avqeno="" data-theme="light"');
const headerSvg=svg.replace('viewBox="0 0 900 320"','viewBox="150 70 600 180"')
 .replaceAll('avq-ink','avq-header-ink').replace('id="avq-data"','id="avq-header-data"')
 .replace('x="8" y="8" width="884" height="304" rx="24"','x="158" y="78" width="584" height="164" rx="16"');
const indexPath=new URL('index.html',dist);let index=fs.readFileSync(indexPath,'utf8');
const galleryMarker='<!-- AVQENO GALLERY START -->'+gallery+'<!-- AVQENO GALLERY END -->';
if(index.includes('<!-- AVQENO GALLERY START -->'))index=index.replace(/<!-- AVQENO GALLERY START -->[\s\S]*?<!-- AVQENO GALLERY END -->/,()=>galleryMarker);
else index=index.replace(/<section class="possibilities section" id="possibilities">[\s\S]*?<\/section>/,()=>galleryMarker);
const headerMarker='<!-- AVQENO HEADER START -->'+headerSvg+'<!-- AVQENO HEADER END -->';
if(index.includes('<!-- AVQENO HEADER START -->'))index=index.replace(/<!-- AVQENO HEADER START -->[\s\S]*?<!-- AVQENO HEADER END -->/,()=>headerMarker);
else index=index.replace('<div class="brand header-logo-slot"></div>','<div class="brand header-logo-slot">'+headerMarker+'</div>');
fs.writeFileSync(indexPath,index);
for(const [file,selector] of [['index.html','hero-logo logo-host'],['preview.html','preview-logo']]){
 const path=new URL(file,dist);let html=fs.readFileSync(path,'utf8');
 const marker='<!-- AVQENO LOGO START -->'+svg+'<!-- AVQENO LOGO END -->';
 if(html.includes('<!-- AVQENO LOGO START -->'))html=html.replace(/<!-- AVQENO LOGO START -->[\s\S]*?<!-- AVQENO LOGO END -->/,()=>marker);
 else html=html.replace(new RegExp(`(<div class="${selector}"[^>]*>)(</div>)`),(_,a,b)=>a+marker+b);
 fs.writeFileSync(path,html);
}
console.log('Website and motion preview ready.');
