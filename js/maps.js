import { CONTEXT_MAPS } from '../assets/context-maps.js?v=atlas-8';
import { geographyFor,routePins } from '../data/geography.js?v=atlas-8';
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
export const MAP_INK='#526457',MAP_PAPER='#ddd9bd',MAP_WATER='#91aaa0';
export function paintTerrain(c,width,height,mask,cell=2){
 c.fillStyle=MAP_WATER;c.fillRect(0,0,width,height);
 const colors=['#c9c49c','#c3be96','#d3cdaa','#b8bb92','#b4b58a'];
 const land=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&mask[(Math.floor(y)*width+Math.floor(x))*4]>180;
 for(let y=0;y<height;y+=cell)for(let x=0;x<width;x+=cell){
 const n=((x*13+y*7)^((x>>4)*31+(y>>4)*17))>>>0;
 const patch=(Math.sin(x/23+Math.sin(y/31))*Math.cos(y/27)+1)*2;
 if(land(x,y)){
  const coast=!land(x-cell,y)||!land(x+cell,y)||!land(x,y-cell)||!land(x,y+cell);
  c.fillStyle=coast?'#78896e':colors[Math.min(4,Math.floor(patch))];c.fillRect(x,y,cell,cell);
  if(!coast&&n%47===0){c.fillStyle='#939e7b';c.fillRect(x,y,cell*2,cell);}
 }else if(n%113===0){c.fillStyle='#7d9b92';c.fillRect(x,y,cell*3,cell);}
 }
 c.strokeStyle='#647e7138';c.lineWidth=1;const step=width>200?48:24;
 for(let x=0;x<width;x+=step){c.beginPath();c.moveTo(x+.5,0);c.lineTo(x+.5,height);c.stroke();}
 for(let y=0;y<height;y+=step){c.beginPath();c.moveTo(0,y+.5);c.lineTo(width,y+.5);c.stroke();}
}
export function coordinate(c,x,y,size=7,filled=false){
 x=Math.round(x-size/2);y=Math.round(y-size/2);
 c.fillStyle=filled?MAP_INK:'#92988a';c.fillRect(x,y,size,size);
 c.fillStyle=filled?'#c8bb83':MAP_PAPER;c.fillRect(x+2,y+2,size-4,size-4);
}
export function compass(c,x,y,size=16){
 c.fillStyle='#718470';c.fillRect(x-size,y-size,size*2,size*2);
 c.fillStyle='#b9bd95';c.fillRect(x-2,y-size+3,4,size*2-6);c.fillRect(x-size+3,y-2,size*2-6,4);
 c.fillStyle='#ddd3a4';c.fillRect(x-1,y-size+1,2,size);c.fillRect(x-size+1,y-1,size,2);
 c.fillStyle=MAP_INK;c.fillRect(x-2,y-2,4,4);
}
function baseMap(canvas,map,width,height,{africa=false,padding=0}={}){
 canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle='#000';c.fillRect(0,0,width,height);
 const project=coord=>projectMap(coord,map.bounds,width,height,padding);
 geometry(c,map.land,project,'#fff');geometry(c,map.water,project,'#000');
 const mask=c.getImageData(0,0,width,height).data;paintTerrain(c,width,height,mask,width>200?2:1);
 c.lineWidth=1;geometry(c,map.rivers,project,null,'#819f93');
 c.lineWidth=.6;geometry(c,map.borders,project,null,'#919876');
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
 canvas.dataset.visited=visited.join(',');
}
export function drawLocalMap(canvas,node){
 const geo=geographyFor(node),map=CONTEXT_MAPS[geo.key];
 const {c,project}=baseMap(canvas,map,96,96);const [x,y]=project(geo.coord);
 coordinate(c,x,y,9,false);
 canvas.dataset.location=geo.key;canvas.dataset.coordinate=geo.coord.join(',');
}
