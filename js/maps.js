import { finishPaper } from './paper.js?v=atlas-35';
import { CONTEXT_MAPS } from '../assets/context-maps.js?v=atlas-35';
import { geographyFor,routePins } from '../data/geography.js?v=atlas-35';
export function projectMap(coord,bounds,width=384,height=420,padding=20,verticalBias=0){
 const scale=Math.min((width-2*padding)/(bounds[2]-bounds[0]),(height-2*padding)/(bounds[3]-bounds[1]));
 const ox=(width-(bounds[2]-bounds[0])*scale)/2,oy=(height-(bounds[3]-bounds[1])*scale)/2+verticalBias;
 return [ox+(coord[0]-bounds[0])*scale,oy+(bounds[3]-coord[1])*scale];
}
export const pinPosition=(pin,height=420)=>{const [x,y]=projectMap(pin.coord,CONTEXT_MAPS.africa.bounds,384,height,20,-Math.max(0,height-500)*.26);return [x+(pin.offset?.[0]||0),y+(pin.offset?.[1]||0)];};
function geometry(c,g,project,fill,stroke){
 if(!g)return;
 if(g.type==='GeometryCollection'){g.geometries.forEach(child=>geometry(c,child,project,fill,stroke));return;}
 const paths=g.type==='Polygon'?[g.coordinates]:g.type==='MultiPolygon'?g.coordinates:g.type==='LineString'?[[g.coordinates]]:g.type==='MultiLineString'?g.coordinates.map(line=>[line]):[];
 for(const polygon of paths){c.beginPath();for(const ring of polygon){ring.forEach((coord,i)=>{const [x,y]=project(coord);i?c.lineTo(x,y):c.moveTo(x,y);});if(fill)c.closePath();}if(fill){c.fillStyle=fill;c.fill('evenodd');}if(stroke){c.strokeStyle=stroke;c.stroke();}}
}
export const MAP_INK='#53664e',MAP_PAPER='#ded3a3',MAP_WATER='#7eaa98';
const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
// Geographic mountain chains, rather than a repeating noise field.
const ranges=[[[[-130,58],[-119,47],[-110,36],[-103,25]],2],[[[-76,8],[-72,-9],[-69,-26],[-72,-47]],1.6],[[[-12,31],[1,35],[11,33]],1.5],[[[7,45],[15,47],[25,44]],1],[[[66,36],[79,34],[90,29],[101,28]],2.4],[[[31,12],[36,5],[33,-8],[29,-19]],1.3],[[[19,-30],[28,-28],[31,-25]],1],[[[52,65],[61,55],[60,47]],1.4],[[[102,43],[119,42],[130,50]],2]];
function segmentDistance(x,y,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(dx*dx+dy*dy)));return Math.hypot(x-a[0]-t*dx,y-a[1]-t*dy);}
function mountains(lon,lat){let d=99;for(const [line,w] of ranges)for(let i=1;i<line.length;i++)d=Math.min(d,segmentDistance(lon,lat,line[i-1],line[i])/w);return d;}
export function paintTerrain(c,width,height,mask,cell=2,inverse=null){
 const nx=Math.ceil(width/cell),ny=Math.ceil(height/cell),land=new Uint8Array(nx*ny),dist=new Int16Array(nx*ny).fill(99),queue=[];
 const inside=(x,y)=>x>=0&&y>=0&&x<nx&&y<ny;
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*nx+x;land[i]=mask[(Math.min(height-1,y*cell)*width+Math.min(width-1,x*cell))*4]>180?1:0;}
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){const i=y*nx+x;if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>inside(x+dx,y+dy)&&land[(y+dy)*nx+x+dx]!==land[i])){dist[i]=0;queue.push(i);}}
 for(let q=0;q<queue.length;q++){const i=queue[q],x=i%nx,y=Math.floor(i/nx);if(dist[i]>=11)continue;for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]])if(inside(x+dx,y+dy)){const j=(y+dy)*nx+x+dx;if(dist[j]>dist[i]+1){dist[j]=dist[i]+1;queue.push(j);}}}
 for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
  const i=y*nx+x,d=dist[i],[lon,lat]=inverse?inverse(x*cell,y*cell):[x/nx*360-180,90-y/ny*180];let col;
  if(land[i]){
   const desert=(lon>-17&&lon<49&&lat>16&&lat<31)||(lon>39&&lon<61&&lat>16&&lat<29);
   const red=(lon>10&&lon<22&&lat<-19&&lat>-30)||(lon>117&&lon<142&&lat<-20&&lat>-31);
   const forest=(Math.pow((lon+61)/17,2)+Math.pow((lat+3)/9,2)<1)||(Math.pow((lon-21)/12,2)+Math.pow((lat+1)/7,2)<1)||(lon>96&&lon<133&&lat<18&&lat>-8);
   const relief=Math.sin(lon*.21+Math.sin(lat*.22)*2)+Math.cos(lat*.27+lon*.08); const field=Math.sin(lon*.63+lat*.24)+Math.cos(lat*.69-lon*.13);
   col=desert?'#d9c697':red?'#c5a786':forest?'#a4ac7b':'#d6cca1';
   if(d>2&&!forest){if(relief>1.1)col=desert?'#cebd8d':red?'#bd9e7d':'#c3c397';else if(relief<-.8)col=desert?'#e0cda0':'#ded3a4';if(field>1.2&&bayer[(y%4)*4+x%4]<5)col='#b8b68b';}
   if(d===0)col=(x+y)%3===0?'#a3a879':'#879773';else if(d===1)col='#b5ba88';
   const m=mountains(lon,lat),xx=x%7,yy=y%6;
   if(d>2&&m<1.7){col='#b7b58a';if(m<1&&yy<4&&xx>yy&&xx<7-yy)col=xx<4?'#889268':'#e2d3a4';if(m<.7&&yy===4&&xx<5)col='#9ea072';}
   if(forest&&d>2){col=field>0?'#aeb586':'#bac095';const xx=(x+Math.floor(y/7)*3)%8,yy=y%7;if((xx-3)*(xx-3)/9+(yy-3)*(yy-3)/4<1)col=yy<3?'#c1c596':xx<3?'#9da977':'#85976a';}
   // Short hand-shaped marks and selected transitions; most of the land stays quiet.
   if(!forest&&m>2&&d>2&&y%11===0&&(x+Math.floor(y/11)*3)%17<4)col=desert?'#bcb384':red?'#b99179':'#b2b58b';
   if((forest||red)&&d===2&&bayer[(y%4)*4+x%4]<4)col='#ccca98';
  }else{
   col=d<2?'#b1bfa0':d<4?'#9eb59a':d<7?'#8daa91':Math.sin(lon*.12)+Math.cos(lat*.17)>1?'#80a18b':'#7c9f89';
   if(d>0&&d<9&&bayer[(y%4)*4+x%4]<4)col=d<4?'#b3c0a0':'#91ae93';
   if(y%12===0&&(x+Math.floor(y/12)*5)%21<7)col='#9bb398';
   if(y%19===4&&(x+Math.floor(y/19)*3)%17<4)col='#688b77';
  }
  c.fillStyle=col;c.fillRect(x*cell,y*cell,cell,cell);
 }
 // Small directional mountain silhouettes follow the actual mountain chains.
 if(inverse){
  const o=inverse(0,0),ax=inverse(cell,0)[0]-o[0],ay=inverse(0,cell)[1]-o[1];
  const glyph=['...l...','..lls..','.llsss.','llldsss','..ddd..'];
  const tones={l:'#e5d6a5',s:'#92966d',d:'#a7aa7b'};
  for(const [chain] of ranges)for(let k=1;k<chain.length;k++){
   const a=chain[k-1],b=chain[k],length=Math.hypot(b[0]-a[0],b[1]-a[1]),steps=Math.max(1,Math.floor(length/3));
   for(let j=0;j<steps;j++){const t=j/steps,xx=Math.round((a[0]+(b[0]-a[0])*t-o[0])/ax),yy=Math.round((a[1]+(b[1]-a[1])*t-o[1])/ay);
    if(!inside(xx,yy)||!land[yy*nx+xx]||dist[yy*nx+xx]<3)continue;
    for(let sy=0;sy<glyph.length;sy++)for(let sx=0;sx<7;sx++){const key=glyph[sy][sx],x=xx+sx-3,y=yy+sy-2;if(tones[key]&&inside(x,y)&&land[y*nx+x]){c.fillStyle=tones[key];c.fillRect(x*cell,y*cell,cell,cell);}}
   }
  }
 }
 // Thin, uninterrupted ruling belongs to the chart, not to the paper folds.
 c.fillStyle='#879b7e';const grid=width>500?90:width>200?48:24;
 for(let x=grid;x<width;x+=grid)for(let y=0;y<height;y+=4)c.fillRect(x,y,1,2);
 for(let y=grid;y<height;y+=grid)for(let x=0;x<width;x+=4)c.fillRect(x,y,2,1);
}
export function coordinate(c,x,y,size=7,filled=false){x=Math.round(x-size/2);y=Math.round(y-size/2);c.fillStyle=MAP_INK;c.fillRect(x-1,y-1,size+2,size+2);c.fillStyle=filled?'#c18483':'#eaddab';c.fillRect(x,y,size,size);c.fillStyle=filled?'#f3dfac':'#a69464';c.fillRect(x+2,y+2,size-4,size-4);}
export function compass(c,x,y,size=16){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(size/32,size/32);
 const r=(col,a,b,w,h)=>{c.fillStyle=col;c.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h));};
 const poly=(col,p)=>{for(let yy=Math.min(...p.map(v=>v[1]));yy<Math.max(...p.map(v=>v[1]));yy++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>yy)!==(b[1]>yy))xs.push(Math.round(a[0]+(yy-a[1])*(b[0]-a[0])/(b[1]-a[1])));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(col,xs[i],yy,xs[i+1]-xs[i],1);}};
 for(let yy=-32;yy<=32;yy++){const half=Math.floor(Math.sqrt(32*32-yy*yy));r('#85865b',-half,yy,half*2+1,1);if(half>2)r(yy<0?'#b5ad78':'#a19a6a',-half+1,yy,half*2-1,1);if(half>5)r(yy<0?'#89916a':'#8b805f',-half+3,yy,half*2-5,1);}
 // Botanical marks sit in the four quadrants of the field.
 for(const sx of [-1,1])for(const sy of [-1,1]){for(let i=0;i<5;i++){const xx=sx*(11+i*2),yy=sy*(10+i*2);r(sy<0?'#aaa574':'#a89972',xx,yy,2,3);r('#aaa574',xx-sx*3,yy+sy*2,3,1);r('#999467',xx+sx*2,yy-sy*3,2,2);}}
 for(let i=0;i<16;i++){const angle=i*Math.PI/8,xx=Math.round(Math.cos(angle)*28),yy=Math.round(Math.sin(angle)*28);r(i%2?'#b8b080':'#d4c58d',xx,yy,2,2);}
 for(const [dx,dy] of [[-18,-18],[18,-18],[18,18],[-18,18]]){poly('#b7ad78',[[0,0],[dx,dy],[Math.round(dx*.5),Math.round(dy*.8)]]);poly('#9c9469',[[0,0],[dx,dy],[Math.round(dx*.8),Math.round(dy*.5)]]);}
 for(let q=0;q<4;q++){c.save();c.rotate(q*Math.PI/2);poly(q===2?'#c7b183':'#e4d49b',[[0,-29],[-4,-8],[-11,0],[0,-3]]);poly(q===2?'#ac9978':'#b9ad79',[[0,-29],[4,-8],[11,0],[0,-3]]);r('#eadba7',-1,-23,1,15);c.restore();}
 r('#c4ad85',-4,-4,9,9);r('#e4d2a4',-3,-3,7,7);r('#b58c9b',-2,-2,5,5);r('#d9b9ad',-1,-1,2,2);r('#a38189',1,1,2,2);
 c.fillStyle='#ded09b';c.font='9px Pixel,monospace';c.fillText('N',-3,-35);c.fillText('S',-3,43);c.fillText('W',-43,3);c.fillText('E',37,3);c.restore();
}
function baseMap(canvas,map,width,height,{africa=false,padding=0}={}){
 canvas.width=width;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 c.fillStyle='#000';c.fillRect(0,0,width,height);
 const project=coord=>projectMap(coord,map.bounds,width,height,padding,africa?-Math.max(0,height-500)*.26:0);
 geometry(c,map.land,project,'#fff');geometry(c,map.water,project,'#000');
 const mask=c.getImageData(0,0,width,height).data;const origin=project([map.bounds[0],map.bounds[3]]),scale=(project([map.bounds[2],map.bounds[3]])[0]-origin[0])/(map.bounds[2]-map.bounds[0]);
 paintTerrain(c,width,height,mask,2,(x,y)=>[map.bounds[0]+(x-origin[0])/scale,map.bounds[3]-(y-origin[1])/scale]);
 c.lineWidth=1;geometry(c,map.rivers,project,null,'#aec2af');
 c.lineWidth=.6;geometry(c,map.borders,project,null,'#a4ad91');
 return {c,project};
}
export function drawJourneyMap(canvas,visited=[]){
 const height=Number(canvas.dataset.height)||420;
 const {c,project}=baseMap(canvas,CONTEXT_MAPS.africa,384,height,{africa:true,padding:20});
 c.setLineDash([3,6]);
 for(let i=1;i<routePins.length;i++){
  const a=routePins[i-1],b=routePins[i],walked=visited.includes(a.id)&&visited.includes(b.id);
  c.strokeStyle=walked?'#3f5946':'#aeb3a2';c.lineWidth=walked?2:1.2;c.beginPath();c.moveTo(...project(a.coord));c.lineTo(...project(b.coord));c.stroke();
 }c.setLineDash([]);
 // Tiny Indian Ocean islands are too small for this continental scale.
 for(const p of routePins.filter(p=>['seychelles','mauritius'].includes(p.id))){const [x,y]=project(p.coord);c.fillStyle='#b79b55';c.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);}
 for(const p of routePins.filter(p=>p.offset)){const a=project(p.coord),b=pinPosition(p,height);c.strokeStyle='#82906e';c.lineWidth=.7;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
 compass(c,268,height-125,height>600?69:32);c.fillStyle=MAP_INK;c.font='10px Pixel,monospace';c.fillText('ATLANTIC',19,height*.26);c.fillText('INDIAN OCEAN',226,height-235);c.font='18px Pixel,monospace';c.fillText('AFRICA',23,height-132);c.font='9px Pixel,monospace';c.fillText('0°     20° E     40° E',24,height-103);
 canvas.dataset.visited=visited.join(',');
}
export function drawLocalMap(canvas,node){
 const geo=geographyFor(node),map=CONTEXT_MAPS[geo.key];
 const {c,project}=baseMap(canvas,map,96,96);const [x,y]=project(geo.coord);
 coordinate(c,x,y,9,true);finishPaper(canvas,{mini:true});
 canvas.dataset.location=geo.key;canvas.dataset.coordinate=geo.coord.join(',');
}
