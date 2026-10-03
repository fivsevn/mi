import {tiltSprite} from './pixel-object.js?v=paper-study-25';
// Instant frame uses a fixed 224 x 272 design grid; slips use one CSS pixel per authored pixel.
// Light comes from the upper left. Palette matches the phone's app sprites.
const P={pale:'#eddfb1',cream:'#e2d5a4',light:'#c5c69a',sage:'#adb388',moss:'#93996c',ink:'#65714f',dark:'#78805a',ochre:'#b4a578',clay:'#bb997e'};
function rect(c,k,x,y,w,h){c.fillStyle=P[k]||k;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function polygon(c,k,points,dx=0,dy=0){
 for(let y=Math.floor(Math.min(...points.map(p=>p[1])));y<Math.max(...points.map(p=>p[1]));y++){
  const xs=[];for(let i=0,j=points.length-1;i<points.length;j=i++){
   const a=points[i],b=points[j];if((a[1]>y)!==(b[1]>y))xs.push(Math.round(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])));
  }xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)rect(c,k,xs[i]+dx,y+dy,xs[i+1]-xs[i],1);
 }
}
function line(c,k,x,y,u,v){let n=Math.max(Math.abs(u-x),Math.abs(v-y));for(let i=0;i<=n;i++)rect(c,k,x+(u-x)*i/(n||1),y+(v-y)*i/(n||1),1,1);}
function instant(c,w,h){
 // A one-pixel illuminated lip and a single warm side seam describe thin stock.
 const p=[[3,1],[w-5,1],[w-4,2],[w-4,h-5],[3,h-5],[2,h-6],[2,2]];
 polygon(c,'dark',p,1,2);polygon(c,'sage',p);
 rect(c,'cream',3,2,w-8,h-8);
 rect(c,'pale',4,2,w-10,1);rect(c,'pale',3,3,1,h-9);
 rect(c,'ochre',w-5,3,1,h-9);rect(c,'light',4,h-7,w-9,1);
 // Official SX-70 / 600 / i-Type dimensions: 88.47 x 107.52 mm;
 // emulsion 78.94 x 76.801 mm. Top placement is visually matched at 5.2 mm.
 // Match parity to the sheet width, so the two side margins are identical.
 const sheetWidth=w-8,scale=sheetWidth/88.47,imageWidth=Math.round(78.94*scale/2)*2,l=3+Math.round((sheetWidth-imageWidth)/2),t=2+Math.round(5.2*scale),r=l+imageWidth,b=t+Math.round(76.801*scale);
 rect(c,'light',l-1,t-1,r-l+2,b-t+2);
 rect(c,'dark',l,t,r-l,b-t);
 c.clearRect(l,t,r-l,b-t);
 rect(c,'moss',l-1,t,1,b-t);rect(c,'dark',l,t-1,r-l,1);
 rect(c,'pale',l,b,r-l,1);rect(c,'light',r,t,1,b-t);
 return {l,t,r,b};
}
function paperContour(w,h,v){
 const b=h-4;
 if(v==='narrative')return [[5,3],[24,2],[29,4],[43,3],[68,4],[75,2],[w-40,2],[w-34,4],[w-22,1],[w-6,2],[w-5,b-9],[w-15,b],[w-34,b-1],[w-41,b-3],[w-59,b-2],[w-70,b-4],[38,b-1],[28,b-3],[7,b-2],[3,b-4],[4,21],[2,18],[4,15],[3,11],[5,9]];
 if(v===0)return [[7,2],[w-12,4],[w-7,7],[w-10,10],[w-6,12],[w-9,16],[w-7,19],[w-10,b-1],[28,b-3],[4,b-4],[6,b-10],[3,b-12],[5,13],[3,10],[6,8]];
 if(v===1)return [[4,5],[w-10,1],[w-6,4],[w-8,b-5],[w-18,b-2],[6,b],[3,b-3]];
 if(v===2)return [[5,2],[w-17,4],[w-6,13],[w-8,b-1],[w-27,b],[3,b-4]];
 return [[7,3],[w-9,1],[w-6,7],[w-8,b-3],[w-16,b],[5,b-1],[3,12],[6,10],[4,7]];
}
// The final pixel-sampled rotation gives long cut edges their natural staircase.
function paperShape(w,h,v){return paperContour(w,h,v);}
function loosePaper(c,w,h,v){
 const p=paperShape(w,h,v),b=h-7;
 // Real journal collage reference: small areas of a differently cut backing leaf
 // remain exposed; these are separate paper pieces, not a uniform frame.
 if(v==='narrative'){
  polygon(c,'ochre',[[16,b-4],[w*.37,b-3],[w*.34,b+2],[20,b+2]]);
 }else if(v===0){
  polygon(c,'ochre',[[13,5],[w-24,3],[w-18,b+3],[11,b+1]]);
 }else if(v===2){
  polygon(c,'clay',[[7,5],[25,6],[23,b+3],[8,b+2]]);
 }
 // A few detached cast-shadow runs under lifted areas; the paper face has
 // no shaded rim or bevel. Most of the sheet rests directly on the pile.
 const outline=document.createElement('canvas');outline.width=w;outline.height=h;
 polygon(outline.getContext('2d'),'#fff',p);
 const silhouette=outline.getContext('2d').getImageData(0,0,w,h).data;
 for(let x=5;x<w-7;x++){
  let bottom=h-1;while(bottom>=0&&!silhouette[(bottom*w+x)*4+3])bottom--;
  if(bottom>=0){
   rect(c,'#65714f78',x,bottom+1,1,2);
   rect(c,'#65714f28',x,bottom+3,1,1);
  }
 }
 const color=v===1?'light':v===2?'cream':'pale';polygon(c,color,p);
 const a=p[0],z=p[1];
 if(v===1)line(c,'sage',a[0]+2,a[1]+1,z[0]-2,z[1]+1);
 else{
  // Pale exposed paper core follows just selected torn runs, with fibres of
  // unequal length. It never becomes a continuous ornamental border.
  const runs=v==='narrative'?[[7,3,22,2],[43,3,67,4],[w-39,3,w-24,2]]:v===0?[[9,3,32,3],[w-36,5,w-13,5]]:[];
  for(const run of runs)line(c,'cream',...run);
  for(const [x,y,n]of v==='narrative'?[[5,9,2],[3,17,1],[28,b-2,4],[w-41,b-2,3]]:v===0?[[5,10,2],[6,16,1],[30,b-3,5],[w-22,b-1,3]]:[])rect(c,'cream',x,y,n,1);
 }
 if(v==='narrative'){
  // Torn notebook leaf: a few fibres, a broad soft crease, a turned corner.
  line(c,'cream',w-18,b-11,w-21,b-17);
  polygon(c,'ochre',[[w-18,b-10],[w-5,b-9],[w-15,b]]);
  polygon(c,'cream',[[w-18,b-11],[w-6,b-10],[w-15,b-1]]);
  line(c,'pale',w-18,b-11,w-15,b-1);
  for(const [x,y]of [[3,12],[4,20],[5,b-9]])rect(c,'cream',x,y,2,1);
 }else if(v===1){
  // Notebook fragment: fine muted ruling and an unbroken free lower edge.
  for(let y=12;y<b-3;y+=8)line(c,'sage',8,y,w-14,y-2);
  line(c,'moss',13,8,12,b-5);
 }else if(v===2){
  // A visibly lifted corner, rather than an ornamental corner notch.
  polygon(c,'ochre',[[w-18,4],[w-6,13],[w-19,14]]);
  polygon(c,'pale',[[w-18,3],[w-7,12],[w-19,12]]);
  line(c,'light',w-19,14,w-20,b-5);line(c,'pale',w-18,15,w-19,b-6);
 }else if(v===3){
  // One irregular torn lower edge, without a regular receipt/button sawtooth.
  const cuts=[[18,3,2],[w-44,4,1],[w-20,3,2]];
  for(const [x,n,d]of cuts){c.clearRect(x,b-1-d,n,d+3);rect(c,'cream',x-1,b-2-d,n-1,1);}
  line(c,'ochre',w-27,7,w-26,b-5);line(c,'cream',w-26,7,w-25,b-5);
 }
}
// Feathering belongs to local torn fibres, not to an all-around light/shadow
// rim. A flat sheet keeps the same body tone right up to its clean cut edges.
function paperMaterial(c,w,h,v){
 const mask=document.createElement('canvas');mask.width=w;mask.height=h;
 polygon(mask.getContext('2d'),'#fff',paperShape(w,h,v));
 const alpha=mask.getContext('2d').getImageData(0,0,w,h).data;
 const inside=(x,y)=>x>=0&&y>=0&&x<w&&y<h&&alpha[(y*w+x)*4+3]>0;
 const spans=v==='narrative'?[[.03,.19,0],[.38,.57,0],[.71,.86,0],[.09,.28,1],[.49,.68,1]]:
  v===0?[[.04,.24,0],[.54,.71,0],[.18,.38,1],[.76,.9,1]]:
  v===1?[[.1,.25,1],[.57,.75,1]]:
  v===2?[[.07,.2,1],[.4,.55,1]]:[[.15,.36,0],[.61,.78,0],[.07,.2,1],[.48,.63,1]];
 const order=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 for(const [from,to,bottom]of spans){
  const left=Math.round(from*w),right=Math.round(to*w);
  for(let x=left;x<right;x++){
   let edge=bottom?h-1:0;while(edge>=0&&edge<h&&!inside(x,edge))edge+=bottom?-1:1;
   if(edge<0||edge>=h)continue;
   const taper=Math.min(1,(x-left)/6,(right-x)/6);
   const depth=Math.round(taper*(2+((Math.floor(x/7)+bottom)%3)));
   for(let d=0;d<depth;d++){
    const y=edge+(bottom?-d:d);
    if(!inside(x,y)||x>w-24&&bottom)continue;
    const coverage=.8-d/(depth+.5);
    const threshold=(order[(y%4)*4+x%4]+.5)/16;
    if(threshold<coverage)rect(c,v===1?'#d8d6ab':'#f3e5bb',x,y,1,1);
    // Exposed fibre ends are occasional warm pixels, never a dark underside.
    if(d===0&&(x+bottom*3)%17===0)rect(c,v===1?'sage':'#d2c598',x,y,1,1);
   }
  }
 }
}
export function drawPaper(canvas){
 const unit=canvas.dataset.paper==='instant'?2:1;
 const w=canvas.dataset.paper==='instant'?224:Math.max(24,Math.round(canvas.clientWidth/unit)),h=canvas.dataset.paper==='instant'?272:Math.max(18,Math.round(canvas.clientHeight/unit));
 canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const type=canvas.dataset.paper;
 if(type==='instant'){
  const {l,t,r,b}=instant(c,w,h),scene=canvas.parentElement.querySelector(':scope > .scene-view');
  if(scene){scene.style.left=`${l/w*100}%`;scene.style.top=`${t/h*100}%`;scene.style.right='auto';scene.style.bottom='auto';scene.style.width=`${(r-l)/w*100}%`;scene.style.height=`${(b-t)/h*100}%`;}
 }else{
  const v=type==='narrative'?'narrative':Number(type.split('-').at(-1))||0;
  const paperH=Math.round(canvas.parentElement.clientHeight);
  const rise=v==='narrative'?-3:[4,-6,3,-5][v];
  const angle=Math.atan(rise/w)*180/Math.PI,pad=Math.ceil(Math.abs(rise)/2)+3,targetH=paperH+pad*2;
  canvas.style.top=`${-pad}px`;canvas.style.height=`${targetH}px`;
  const source=document.createElement('canvas');source.width=w;source.height=paperH;
  const material=source.getContext('2d');loosePaper(material,w,paperH,v);paperMaterial(material,w,paperH,v);
  // Slightly translucent stock; preserve the separately painted cast-shadow alpha.
  const pixels=material.getImageData(0,0,w,paperH);
  for(let i=3;i<pixels.data.length;i+=4)if(pixels.data[i]===255)pixels.data[i]=230;
  material.putImageData(pixels,0,0);
  tiltSprite(canvas,source,w,targetH,angle,1,0);
 }
}
let observer,layoutObserver;
function updatePaperHitArea(stack){
 // Clip only the empty leading spacer, so the native scroller receives swipes
 // on either paper while the uncovered photograph's objects stay clickable.
 const pile=stack.querySelector(':scope > .paper-pile');
 if(pile)stack.style.setProperty('--paper-hit-top',`${Math.max(0,pile.offsetTop-stack.scrollTop-8)}px`);
}
function layoutPaperLayer(screen){
 const scene=screen.querySelector(':scope > .scene-panel'),stack=screen.querySelector(':scope > .paper-stack'),pile=stack?.querySelector(':scope > .paper-pile');
 if(!scene||!stack||!pile)return;
 // Reserve the photograph only at the beginning of the scrollable paper layer.
 const values={'--photo-space':scene.offsetTop+scene.offsetHeight};
 for(const [name,value]of Object.entries(values)){const px=`${value}px`;if(screen.style.getPropertyValue(name)!==px)screen.style.setProperty(name,px);}
 updatePaperHitArea(stack);
}
export function paintStoryPapers(){
 observer?.disconnect();observer??=new ResizeObserver(entries=>entries.forEach(({target})=>drawPaper(target)));
 const scene=document.querySelector('.play-screen .scene-panel');
 if(scene&&!scene.querySelector(':scope > [data-paper]'))scene.insertAdjacentHTML('afterbegin','<canvas class="paper-surface instant-paper" data-paper="instant" aria-hidden="true"></canvas>');
 const copy=document.querySelector('.play-screen .story-copy');
 if(copy&&!copy.querySelector(':scope > [data-paper]')){
  const content=document.createElement('div');content.className='story-writing';while(copy.firstChild)content.append(copy.firstChild);copy.append(content);
  copy.insertAdjacentHTML('afterbegin','<canvas class="paper-surface" data-paper="narrative" aria-hidden="true"></canvas>');
 }
 document.querySelectorAll('.play-screen .choice-scroll > .btn,.play-screen .choice-scroll > .choice,.play-screen .mini-controls > .btn').forEach((el,i)=>{
  el.classList.add('paper-option');el.querySelector(':scope > .control-paper')?.remove();
  if(!el.querySelector(':scope > [data-paper]'))el.insertAdjacentHTML('afterbegin',`<canvas class="paper-surface" data-paper="strip-${i%4}" aria-hidden="true"></canvas>`);
 });
 document.querySelectorAll('canvas[data-paper]').forEach(c=>{drawPaper(c);observer.observe(c);});
 layoutObserver?.disconnect();layoutObserver??=new ResizeObserver(entries=>{const screens=new Set(entries.map(({target})=>target.closest('.play-screen')));for(const screen of screens)if(screen)layoutPaperLayer(screen);});
 document.querySelectorAll('.play-screen').forEach(screen=>{
  layoutPaperLayer(screen);
  const stack=screen.querySelector(':scope > .paper-stack');
  if(stack)stack.onscroll=()=>updatePaperHitArea(stack);
  screen.querySelectorAll(':scope > .scene-panel,:scope > .paper-stack,:scope > .paper-stack > .paper-pile').forEach(el=>layoutObserver.observe(el));
 });
}
