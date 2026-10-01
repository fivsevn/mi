import { finishPaper } from './paper.js?v=atlas-12';
import { CONTEXT_MAPS } from '../assets/context-maps.js?v=atlas-12';
import { geographyFor,routePins } from '../data/geography.js?v=atlas-12';
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
export const MAP_INK='#53664e',MAP_PAPER='#ded3a3',MAP_WATER='#7eaa98';
const LAND_TONES=['#77835b','#9c9c69','#bcb584','#d4c794','#e4d5a5'];
const WATER_TONES=['#638e80','#729e8d','#82ad98','#a0bca1'];
const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
export function paintTerrain(c,width,height,mask,cell=2,inverse=null){
 const nx=Math.ceil(width/cell),ny=Math.ceil(height/cell),land=new Uint8Array(nx*ny),dist=new Int16Array(nx*ny).fill(99),queue=[];
 const inside=(x,y)=>x>=0&&y>=0&&x<nx&&y<ny;
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*nx+x;land[i]=mask[(Math.min(height-1,y*cell)*width+Math.min(width-1,x*cell))*4]>180?1:0;}
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*nx+x;if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>inside(x+dx,y+dy)&&land[(y+dy)*nx+x+dx]!==land[i])){dist[i]=0;queue.push(i);}}
 for(let q=0;q<queue.length;q++){const i=queue[q],x=i%nx,y=Math.floor(i/nx);if(dist[i]>=13)continue;for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])if(inside(x+dx,y+dy)){const j=(y+dy)*nx+x+dx;if(dist[j]>dist[i]+1){dist[j]=dist[i]+1;queue.push(j);}}}
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
  const i=y*nx+x,d=dist[i],[lon,lat]=inverse?inverse(x*cell,y*cell):[x/nx*360-180,90-y/ny*180];let col;
  if(land[i]){
   const desert=(lat>15&&lat<34&&lon>-18&&lon<65)||(lon>110&&lon<150&&lat<-18)||(lon>12&&lon<25&&lat<-19);
   const ridge=Math.sin(lon*.27+lat*.31)+Math.sin(lon*.55-lat*.19)*.55+Math.cos(lat*.38)*.35;
   const height=2.5+ridge*.8+(desert?.7:-.25);let index=Math.max(1,Math.min(4,Math.floor(height)));
   if(bayer[(y%4)*4+x%4]/16<height-Math.floor(height))index=Math.min(4,index+1);
   col=d===0?'#697b59':d===1?'#a4a574':LAND_TONES[index];
   if(!desert&&ridge<-.65&&d>2)col=(x+y)%4===0?'#a5ac7d':'#8d9968';
   // Deliberate connected mountain chevrons on a geographic ridge field.
   if(d>3&&ridge>.95&&x%9<6&&y%7<3)col=y%7===0?'#e7d9a9':x%9<3?'#8c8b5d':'#b1ab78';
  }else{col=WATER_TONES[d<2?3:d<5?2:d<9?1:0];if(d>5&&y%9===0&&x%13<5)col='#88ad96';if(d>8&&y%17===1&&x%19<3)col='#527e73';}
  c.fillStyle=col;c.fillRect(x*cell,y*cell,cell,cell);
 }
 c.fillStyle='#647f6b';const grid=width>200?60:24;
 for(let x=grid;x<width;x+=grid)for(let y=0;y<height;y+=6)c.fillRect(x,y,1,3);
 for(let y=grid;y<height;y+=grid)for(let x=0;x<width;x+=6)c.fillRect(x,y,3,1);
}
export function coordinate(c,x,y,size=7,filled=false){x=Math.round(x-size/2);y=Math.round(y-size/2);c.fillStyle=MAP_INK;c.fillRect(x-1,y-1,size+2,size+2);c.fillStyle=filled?'#c18483':'#eaddab';c.fillRect(x,y,size,size);c.fillStyle=filled?'#f3dfac':'#a69464';c.fillRect(x+2,y+2,size-4,size-4);}
export function compass(c,x,y,size=16){
 const r=(col,a,b,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(a),Math.round(b),w,h);};
 for(let dy=-size;dy<=size;dy++){const half=Math.floor(Math.sqrt(size*size-dy*dy));r('#7a8054',x-half,y+dy,half*2,1);if(half>2)r(dy<0?'#929467':'#8c815b',x-half+2,y+dy,half*2-4,1);}
 for(let i=-size+3;i<size-2;i++){const thick=Math.max(1,Math.floor((size-Math.abs(i))/4));r(i<0?'#e3d59b':'#b9ab78',x-thick,y+i,thick*2+1,1);r(i<0?'#d9c991':'#e2d39c',x+i,y-thick,1,thick*2+1);}
 r('#d8b58c',x-3,y-3,7,7);r('#af7f99',x-1,y-1,3,3);c.fillStyle='#d9cf99';c.font='9px Pixel,monospace';c.fillText('N',x-3,y-size-5);c.fillText('S',x-3,y+size+12);c.fillText('W',x-size-12,y+3);c.fillText('E',x+size+5,y+3);
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
 coordinate(c,x,y,9,true);finishPaper(canvas,{mini:true});
 canvas.dataset.location=geo.key;canvas.dataset.coordinate=geo.coord.join(',');
}
