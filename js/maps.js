import { finishPaper } from './paper.js?v=code-11';
import { CONTEXT_MAPS } from '../assets/context-maps.js?v=code-11';
import { geographyFor,routePins } from '../data/geography.js?v=code-11';
export function projectMap(coord,bounds,width=384,height=420,padding=20){
 const scale=Math.min((width-2*padding)/(bounds[2]-bounds[0]),(height-2*padding)/(bounds[3]-bounds[1]));
 const ox=(width-(bounds[2]-bounds[0])*scale)/2,oy=(height-(bounds[3]-bounds[1])*scale)/2;
 return [ox+(coord[0]-bounds[0])*scale,oy+(bounds[3]-coord[1])*scale];
}
export const pinPosition=pin=>{const [x,y]=projectMap(pin.coord,CONTEXT_MAPS.africa.bounds);return [x+(pin.offset?.[0]||0),y+(pin.offset?.[1]||0)];};
function geometry(c,g,project,fill,stroke){
 if(!g)return;
 if(g.type==='GeometryCollection'){g.geometries.forEach(child=>geometry(c,child,project,fill,stroke));return;}
 const paths=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:g.type==='LineString'?[[g.coordinates]]:g.type==='MultiLineString'?g.coordinates.map(line=>[line]):[];
 for(const polygon of paths){c.beginPath();for(const ring of polygon){ring.forEach((coord,i)=>{const [x,y]=project(coord);i?c.lineTo(x,y):c.moveTo(x,y);});if(fill)c.closePath();}if(fill){c.fillStyle=fill;c.fill('evenodd');}if(stroke){c.strokeStyle=stroke;c.stroke();}}
}
export const MAP_INK='#526453',MAP_PAPER='#d9d2ad',MAP_WATER='#9bb8ab';
const LAND_TONES=['#a4ad91','#b4b79a','#c5c2a2','#d4cbaa','#ddd3b4'];
const GREEN_TONES=['#829b83','#95a68a','#a7b297','#bcc2a4','#ced0b0'];
const WATER_TONES=['#839f93','#8ca89b','#9bb8ab','#aec2af'];
function patch(x,y){const a=Math.floor(x),b=Math.floor(y);return ((a*313+b*199+(a^b)*37)>>>0)%101/100;}
export function paintTerrain(c,width,height,mask,cell=2,inverse=null){
 const isLand=(x,y)=>x>=0&&x<width&&y>=0&&y<height&&mask[(Math.floor(y)*width+Math.floor(x))*4]>180;
 for(let y=0;y<height;y+=cell)for(let x=0;x<width;x+=cell){
  const [lon,lat]=inverse?inverse(x,y):[x/width*360-180,90-y/height*180];
  let color;
  if(isLand(x,y)){
   const tropical=Math.abs(lat)<14||(lon>80&&lat<30&&lat>-15),palette=tropical?GREEN_TONES:LAND_TONES;
   const terrain=patch(lon/6,lat/5)*.7+patch(lon/2,lat/2)*.3,index=Math.min(4,Math.floor(terrain*5));
   const coast=!isLand(x-cell,y)||!isLand(x+cell,y)||!isLand(x,y-cell)||!isLand(x,y+cell);
   color=coast?palette[1]:palette[index];
   // Short joined clusters mark terrain changes; no enclosing coastline outline.
   if(patch(lon*2,lat*2)>.82&&((x+y)/cell)%3===0)color=palette[Math.max(0,index-1)];
   if(lon>11&&lon<23&&lat<-18&&lat>-30&&index<3)color=['#baa994','#c7b8a0','#d3c3a8'][index];
  }else{
   const close=isLand(x-4*cell,y)||isLand(x+4*cell,y)||isLand(x,y-4*cell)||isLand(x,y+4*cell);
   const shelf=isLand(x-10*cell,y)||isLand(x+10*cell,y)||isLand(x,y-10*cell)||isLand(x,y+10*cell);
   color=WATER_TONES[close?3:shelf?2:Math.floor(y/(cell*18))%3===0?1:0];
   if((Math.floor(y/cell)%11===0)&&(Math.floor(x/cell)%17<4))color=WATER_TONES[close?3:2];
  }
  c.fillStyle=color;c.fillRect(x,y,cell,cell);
 }
 // Quiet map ruling is interrupted, with the same pixel weight as scene marks.
 c.fillStyle='#a2b49c';const grid=width>200?48:24;
 for(let x=grid;x<width;x+=grid)for(let y=4;y<height;y+=8)c.fillRect(x,y,1,3);
 for(let y=grid;y<height;y+=grid)for(let x=4;x<width;x+=8)c.fillRect(x,y,3,1);
}
export function coordinate(c,x,y,size=7,filled=false){
 x=Math.round(x-size/2);y=Math.round(y-size/2);
 c.fillStyle=filled?MAP_INK:'#92988a';c.fillRect(x,y,size,size);
 c.fillStyle=filled?'#c8bb83':MAP_PAPER;c.fillRect(x+2,y+2,size-4,size-4);
}
export function compass(c,x,y,size=16){
 c.fillStyle='#a7b296';for(let dy=-size;dy<=size;dy++){const half=Math.floor(Math.sqrt(size*size-dy*dy));c.fillRect(x-half,y+dy,half*2,1);}
 c.fillStyle='#d9d2ad';for(let i=0;i<size-2;i++){const width=i<size/2?Math.max(1,Math.floor(i/3)):Math.max(1,Math.floor((size-i)/2));c.fillRect(x-width,y-size+2+i,width*2,1);c.fillRect(x-size+2+i,y-width,1,width*2);}
 c.fillStyle='#c8bc96';c.fillRect(x-1,y,3,size-2);c.fillRect(x,y-1,size-2,3);c.fillStyle='#baa48b';c.fillRect(x-2,y-2,4,4);
}
function baseMap(canvas,map,width,height,{africa=false,padding=0}={}){
 canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle='#000';c.fillRect(0,0,width,height);
 const project=coord=>projectMap(coord,map.bounds,width,height,padding);
 geometry(c,map.land,project,'#fff');geometry(c,map.water,project,'#000');
 const mask=c.getImageData(0,0,width,height).data;const origin=project([map.bounds[0],map.bounds[3]]),scale=(project([map.bounds[2],map.bounds[3]])[0]-origin[0])/(map.bounds[2]-map.bounds[0]);
 paintTerrain(c,width,height,mask,2,(x,y)=>[map.bounds[0]+(x-origin[0])/scale,map.bounds[3]-(y-origin[1])/scale]);
 c.lineWidth=1;geometry(c,map.rivers,project,null,'#aec2af');
 c.lineWidth=.6;geometry(c,map.borders,project,null,'#a4ad91');
 return {c,project};
}
export function drawJourneyMap(canvas,visited=[]){
 const {c,project}=baseMap(canvas,CONTEXT_MAPS.africa,384,420,{africa:true,padding:20});
 c.setLineDash([3,6]);
 for(let i=1;i<routePins.length;i++){
  const a=routePins[i-1],b=routePins[i],walked=visited.includes(a.id)&&visited.includes(b.id);
  c.strokeStyle=walked?'#3f5946':'#aeb3a2';c.lineWidth=walked?2:1.2;c.beginPath();c.moveTo(...project(a.coord));c.lineTo(...project(b.coord));c.stroke();
 }c.setLineDash([]);
 // Tiny Indian Ocean islands are too small for this continental scale.
 for(const p of routePins.filter(p=>['seychelles','mauritius'].includes(p.id))){const [x,y]=project(p.coord);c.fillStyle='#b79b55';c.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);}
 for(const p of routePins.filter(p=>p.offset)){const a=project(p.coord),b=pinPosition(p);c.strokeStyle='#82906e';c.lineWidth=.7;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
 compass(c,321,369,17);c.fillStyle=MAP_INK;c.font='10px Pixel,monospace';c.fillText('ATLANTIC',19,265);c.fillText('INDIAN OCEAN',254,347);
 finishPaper(canvas);canvas.dataset.visited=visited.join(',');
}
export function drawLocalMap(canvas,node){
 const geo=geographyFor(node),map=CONTEXT_MAPS[geo.key];
 const {c,project}=baseMap(canvas,map,96,96);const [x,y]=project(geo.coord);
 coordinate(c,x,y,9,false);finishPaper(canvas,{mini:true});
 canvas.dataset.location=geo.key;canvas.dataset.coordinate=geo.coord.join(',');
}
