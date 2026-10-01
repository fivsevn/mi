import { CONTEXT_MAPS } from '../assets/context-maps.js?v=field-9';
import { geographyFor,routePins } from '../data/geography.js?v=field-9';
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
const ramps={
 sea:['#779a8d','#85a797','#96b3a0','#a8bea4'],
 dry:['#b8ad82','#c7b88a','#d3c296','#ded0a5'],
 green:['#879b75','#9baa80','#b0b78a','#c3c59a'],
 rose:['#b29c80','#c2aa88','#d0b998','#ded0a5'],
 rock:['#7e8d6b','#98a17a','#b0b18a','#c8be96']
};
const ranges=[[31,-3,3,14],[37,8,3,12],[19,-31,6,4],[-5,31,10,3],[28,-15,9,5],[78,31,22,3],[-70,-22,3,35],[-113,43,7,18],[144,-24,4,15]];
export function paintTerrain(c,width,height,mask,cell=2,inverse=null){
 const land=(x,y)=>x>=0&&y>=0&&x<width&&y<height&&mask[(Math.floor(y)*width+Math.floor(x))*4]>180;
 c.fillStyle=ramps.sea[0];c.fillRect(0,0,width,height);
 for(let y=0;y<height;y+=cell)for(let x=0;x<width;x+=cell){
  const coord=inverse?inverse(x,y):[x/width*360-180,90-y/height*180],lon=coord[0],lat=coord[1];
  const small=Math.sin(lon*2.7+Math.sin(lat*1.9))*Math.cos(lat*3.1-lon*.8);
  const big=Math.sin(lon*.22+Math.sin(lat*.19))*Math.cos(lat*.27+lon*.12);
  const n=Math.floor((small*.28+big*.72+1)*1.7);
  let color;
  if(land(x,y)){
   const dry=(lat>13&&lat<33&&lon>-18&&lon<60)||(lat<-17&&lat>-30&&lon<24&&lon>10)||(lon>112&&lon<140&&lat<-17)||(lon>42&&lon<95&&lat>20&&lat<44);
   const forest=Math.abs(lat)<11||(lon>90&&lat<22&&lat>-15);
   const rose=(lat<-21&&lon>10&&lon<23)||(lat>5&&lat<16&&lon<25&&lon>-14);
   let rock=0;for(const [xx,yy,rx,ry]of ranges)rock=Math.max(rock,Math.max(0,1-((lon-xx)/rx)**2-((lat-yy)/ry)**2));
   const ramp=rock>.4?ramps.rock:rose?ramps.rose:dry?ramps.dry:forest?ramps.green:ramps.dry;
   const coast=!land(x-cell,y)||!land(x+cell,y)||!land(x,y-cell)||!land(x,y+cell);
   const ridge=rock>.4&&Math.sin(lon*4+lat*3+Math.sin(lat*2))>.15;
   color=coast?'#768c70':ramp[Math.min(3,Math.max(0,n+(ridge?-1:0)))];
   if(rock>.55&&small>.25)color=ramps.rock[0];
   // Connected two- and three-pixel clusters define land texture and ridge highlights.
   if(small>.58&&((Math.floor(x/cell)+Math.floor(y/cell))%4<2))color=ramp[Math.min(3,n+1)];
  }else{
   const near=land(x-cell*3,y)||land(x+cell*3,y)||land(x,y-cell*3)||land(x,y+cell*3);
   const mid=land(x-cell*7,y)||land(x+cell*7,y)||land(x,y-cell*7)||land(x,y+cell*7);
   color=ramps.sea[near?3:mid?2:Math.floor(y/(cell*15))%3===0?1:0];
   if(Math.sin(x*.09+y*.15)>.94&&Math.floor(y/cell)%5===0)color=ramps.sea[mid?3:2];
  }
  c.fillStyle=color;c.fillRect(x,y,cell,cell);
 }
 c.strokeStyle='#637d6c38';c.lineWidth=1;const step=width>200?48:24;
 for(let x=0;x<width;x+=step){c.beginPath();c.moveTo(x+.5,0);c.lineTo(x+.5,height);c.stroke();}
 for(let y=0;y<height;y+=step){c.beginPath();c.moveTo(0,y+.5);c.lineTo(width,y+.5);c.stroke();}
}
export function coordinate(c,x,y,size=7,filled=false){
 x=Math.round(x-size/2);y=Math.round(y-size/2);
 c.fillStyle=filled?MAP_INK:'#92988a';c.fillRect(x,y,size,size);
 c.fillStyle=filled?'#c8bb83':MAP_PAPER;c.fillRect(x+2,y+2,size-4,size-4);
}
export function compass(c,x,y,size=16){
 for(let dy=-size;dy<=size;dy++)for(let dx=-size;dx<=size;dx++){
 const rr=dx*dx+dy*dy;if(rr>size*size)continue;
 c.fillStyle=rr>(size-2)**2?'#b6b58b':'#77896c';c.fillRect(x+dx,y+dy,1,1);
 const axis=(Math.abs(dx)<2&&Math.abs(dy)<size-3)||(Math.abs(dy)<2&&Math.abs(dx)<size-3);
 const diagonal=Math.abs(Math.abs(dx)-Math.abs(dy))<2&&Math.abs(dx)<size*.55;
 if(axis||diagonal){c.fillStyle=dx+dy<0?'#ded0a5':'#b9aa7b';c.fillRect(x+dx,y+dy,1,1);}
 }c.fillStyle='#baa28a';c.fillRect(x-2,y-2,5,5);c.fillStyle='#ded0a5';c.fillRect(x,y,1,1);
}
function baseMap(canvas,map,width,height,{africa=false,padding=0}={}){
 canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle='#000';c.fillRect(0,0,width,height);
 const project=coord=>projectMap(coord,map.bounds,width,height,padding);
 geometry(c,map.land,project,'#fff');geometry(c,map.water,project,'#000');
 const mask=c.getImageData(0,0,width,height).data;const origin=project([map.bounds[0],map.bounds[3]]),scale=(project([map.bounds[2],map.bounds[3]])[0]-origin[0])/(map.bounds[2]-map.bounds[0]);
 paintTerrain(c,width,height,mask,2,(x,y)=>[map.bounds[0]+(x-origin[0])/scale,map.bounds[3]-(y-origin[1])/scale]);
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
