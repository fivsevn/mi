import { CONTEXT_MAPS } from '../assets/context-maps.js?v=maps-5';
import { geographyFor,routePins } from '../data/geography.js?v=maps-5';
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
function baseMap(canvas,map,width,height,{africa=false,padding=0}={}){
 canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle='#e7e8d7';c.fillRect(0,0,width,height);
 const project=coord=>projectMap(coord,map.bounds,width,height,padding);
 geometry(c,map.land,project,africa?'#ceb969':'#a7b498');
 c.lineWidth=.7;geometry(c,map.water,project,'#e7e8d7');
 // Sample the geographic silhouettes into the same small blocks as the desk map.
 const pixels=c.getImageData(0,0,width,height).data,cell=width>200?4:3;
 c.fillStyle='#e7e8d7';c.fillRect(0,0,width,height);
 for(let y=0;y<height;y+=cell)for(let x=0;x<width;x+=cell){const at=(Math.min(height-1,y+1)*width+Math.min(width-1,x+1))*4;
  const r=pixels[at],g=pixels[at+1],b=pixels[at+2];if(r===231&&g===232&&b===215)continue;c.fillStyle=`rgb(${r},${g},${b})`;c.fillRect(x,y,cell-1,cell-1);}
 geometry(c,map.rivers,project,null,'#d8decb');
 c.lineWidth=.55;geometry(c,map.borders,project,null,'#8b9b7d');
 c.strokeStyle='#d4d8c4';c.lineWidth=.6;const step=width>200?24:12;
 for(let x=0;x<width;x+=step){c.beginPath();c.moveTo(x,0);c.lineTo(x,height);c.stroke();}
 for(let y=0;y<height;y+=step){c.beginPath();c.moveTo(0,y);c.lineTo(width,y);c.stroke();}
 return {c,project};
}
export function drawJourneyMap(canvas,visited=[]){
 const {c,project}=baseMap(canvas,CONTEXT_MAPS.africa,384,420,{africa:true,padding:20});
 const arrived=routePins.filter(p=>visited.includes(p.id));
 c.strokeStyle='#536b50';c.lineWidth=1.7;c.setLineDash([3,6]);c.beginPath();
 arrived.forEach((p,i)=>{const [x,y]=project(p.coord);i?c.lineTo(x,y):c.moveTo(x,y);});c.stroke();c.setLineDash([]);
 // Tiny Indian Ocean islands are too small for this continental scale.
 for(const p of routePins.filter(p=>['seychelles','mauritius'].includes(p.id))){const [x,y]=project(p.coord);c.fillStyle='#b79b55';c.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);}
 for(const p of routePins.filter(p=>p.offset)){const a=project(p.coord),b=pinPosition(p);c.strokeStyle='#82906e';c.lineWidth=.7;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
 c.fillStyle='#7c8e70';c.font='10px Pixel,monospace';c.fillText('ATLANTIC',19,265);c.fillText('INDIAN OCEAN',254,347);
 canvas.dataset.visited=visited.join(',');
}
export function drawLocalMap(canvas,node){
 const geo=geographyFor(node),map=CONTEXT_MAPS[geo.key];
 const {c,project}=baseMap(canvas,map,96,96);const [x,y]=project(geo.coord);
 c.fillStyle='#354e3d';c.fillRect(Math.round(x)-3,Math.round(y)-3,7,7);c.fillStyle='#e4ce86';c.fillRect(Math.round(x)-1,Math.round(y)-1,3,3);
 canvas.dataset.location=geo.key;canvas.dataset.coordinate=geo.coord.join(',');
}
