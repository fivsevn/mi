import { WORLD } from '../assets/world-grid.js?v=atlas-56';
import { elevation } from '../assets/relief-grid.js?v=atlas-56';
import { finishPaper } from './paper.js?v=atlas-56';
import { CONTEXT_MAPS } from '../assets/context-maps.js?v=atlas-56';
import { geographyFor,routePins } from '../data/geography.js?v=atlas-56';
export function projectMap(coord,bounds,width=384,height=420,padding=20,verticalBias=0){
 const scale=Math.min((width-2*padding)/(bounds[2]-bounds[0]),(height-2*padding)/(bounds[3]-bounds[1]));
 const ox=(width-(bounds[2]-bounds[0])*scale)/2,oy=(height-(bounds[3]-bounds[1])*scale)/2+verticalBias;
 return [ox+(coord[0]-bounds[0])*scale,oy+(bounds[3]-coord[1])*scale];
}
const JOURNEY_BOUNDS=[9,-41,64,14];
export const pinPosition=(pin,height=384)=>{const [x,y]=projectMap(pin.coord,JOURNEY_BOUNDS,384,height,18);return [x+(pin.offset?.[0]||0),y+(pin.offset?.[1]||0)];};
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
   const wave=Math.sin(lon*.7+lat*.43)+.6*Math.cos(lat*1.1-lon*.31);
   const grain=Math.sin(lon*3.3+lat*2.7)*Math.cos(lat*2.2-lon*1.7);
   const jungle=Math.max(Math.exp(-((lon-21)**2/160+(lat+1)**2/70)),Math.exp(-((lon+61)**2/260+(lat+3)**2/95)),lon>90&&lon<138?Math.exp(-((lat-3)**2)/160):0);
   const dry=Math.exp(-((lat-24-wave*1.5)**2)/105)*(lon>-20&&lon<62?1:0);
   const clay=Math.exp(-((lon-16)**2/45+(lat+24)**2/55));
   const green=jungle*.7+.13*(wave+1);
   const palette=green>.72?['#929d70','#a2ab7b','#b1b88a']:green>.46?['#a5ac7c','#bbc08f','#ccc797']:dry>.55?['#bbb17f','#d2c48e','#e0cd9a']:clay>.35?['#ba9d7f','#cdb08a','#d7bd93']:['#b3b082','#d1c594','#dfcf9f'];
   col=palette[wave>.6?0:wave<-.4?2:1];
   // Joined diagonal relief fragments replace tiled tree and mountain symbols.
   const ridge=Math.sin(lon*1.5+lat*1.8+Math.sin(lat*.6)*2);
   const height=Math.max(0,elevation(lon,lat));
   const east=elevation(lon+.5,lat),west=elevation(lon-.5,lat),north=elevation(lon,lat+.5),south=elevation(lon,lat-.5);
   const slope=Math.hypot(east-west,north-south),shade=(east-west+south-north)/900;
   const m=mountains(lon,lat);
   // Actual elevation and slope determine relief. Dither only near palette boundaries.
   const threshold=(bayer[((y+Math.floor(x/9))%4)*4+(x+Math.floor(y/11))%4]+.5)/16;
   let tone=1.3+shade*.65-Math.min(1.1,slope/1700);
   if(height>900)tone-=.15;if(height>2300)tone+=.35;
   tone=Math.max(0,Math.min(2.99,tone));
   const rock=['#87936b','#a5ac7d','#c1be8e','#ddcc9b'];
   if(d>2&&slope>160){const low=Math.floor(tone);col=rock[low+(tone-low>threshold?1:0)];}
   else if(d>2){const value=Math.max(0,Math.min(1.99,1+(wave*.25)+grain*.1));const low=Math.floor(value);col=palette[low+(value-low>.68?1:value-low<.32?0:(value-low-.32)/.36>threshold?1:0)];}
   if(d===0)col='#778966';
   else if(d===1)col=green>.5?'#a5b080':'#c3c28f';
  }else{
   const depth=Math.abs(lat)>85||lon < -180||lon>180?4200:Math.max(0,-elevation(lon,lat));
   const sea=['#b7c5a3','#a0bca0','#8bb09b','#7da593','#709889','#62877d','#53766f'];
   const levels=[0,200,1000,2500,4000,5500,7500];
   let level=0;while(level<levels.length-2&&depth>levels[level+1])level++;
   const mix=Math.max(0,Math.min(1,(depth-levels[level])/(levels[level+1]-levels[level])));
   const threshold=(bayer[((y+Math.floor(x/13))%4)*4+(x+Math.floor(y/9))%4]+.5)/16;
   col=sea[Math.min(6,level+(mix>.62?1:mix<.38?0:(mix-.38)/.24>threshold?1:0))];
   if(d===0)col='#aabda0';
   const band=Math.floor(y/5),offset=(band*13)%23;
   if(y%5===offset%3&&(x+offset)%23<5&&depth>300)col=sea[Math.min(6,level+1)];
   if(y%9===2&&(x+band*7)%29<8)col=sea[Math.max(0,level-1)];
   if(y%13===3&&(x+band*11)%31<3)col=sea[Math.min(6,level+1)];
  }
  c.fillStyle=col;c.fillRect(x*cell,y*cell,cell,cell);
 }
 // Thin, uninterrupted ruling belongs to the chart, not to the paper folds.
 c.globalAlpha=.24;c.fillStyle='#5d806f';const grid=width>500?90:width>200?48:24;
 for(let x=grid;x<width;x+=grid)c.fillRect(x,0,1,height);
 for(let y=grid;y<height;y+=grid)c.fillRect(0,y,width,1);
 c.globalAlpha=1;
}
export function coordinate(c,x,y,size=7){const edge=Math.max(3,size-3);c.fillStyle='#b16c89';c.fillRect(Math.round(x-edge/2),Math.round(y-edge/2),edge,edge);}
function chartText(c,text,x,y){const ink=c.fillStyle;c.fillStyle='#e2e2d4';c.fillText(text,x+1,y+1);c.fillStyle=ink;c.fillText(text,x,y);}
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
 const height=384;
 const map={bounds:JOURNEY_BOUNDS,land:{type:'MultiPolygon',coordinates:WORLD},water:CONTEXT_MAPS.africa.water,borders:CONTEXT_MAPS.africa.borders};
 const {c,project}=baseMap(canvas,map,384,384,{padding:18});
 const pixels=c.getImageData(0,0,384,height);for(let i=0;i<pixels.data.length;i+=4){const g=Math.round(pixels.data[i]*.3+pixels.data[i+1]*.59+pixels.data[i+2]*.11);pixels.data[i]=g;pixels.data[i+1]=g+1;pixels.data[i+2]=g;}c.putImageData(pixels,0,0);
 c.setLineDash([3,6]);
 for(let i=1;i<routePins.length;i++){
  const a=routePins[i-1],b=routePins[i],walked=visited.includes(a.id)&&visited.includes(b.id);
  c.strokeStyle=walked?'#3f5946':'#aeb3a2';c.lineWidth=walked?2:1.2;c.beginPath();c.moveTo(...project(a.coord));c.lineTo(...project(b.coord));c.stroke();
 }c.setLineDash([]);
 // Tiny Indian Ocean islands are too small for this continental scale.
 for(const p of routePins.filter(p=>['seychelles','mauritius'].includes(p.id))){const [x,y]=project(p.coord);c.fillStyle='#aaaead';c.fillRect(Math.round(x)-2,Math.round(y)-2,5,5);}
 for(const p of routePins.filter(p=>p.offset)){const a=project(p.coord),b=pinPosition(p,height);c.strokeStyle='#82906e';c.lineWidth=.7;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
 c.fillStyle=MAP_INK;c.font='10px Pixel,monospace';chartText(c,'ATLANTIC',8,150);chartText(c,'INDIAN OCEAN',238,281);c.font='18px Pixel,monospace';chartText(c,'AFRICA',21,358);c.font='9px Pixel,monospace';chartText(c,'20° E     40° E     60° E',24,376);
 canvas.dataset.visited=visited.join(',');
}
export function drawLocalMap(canvas,node){
 const geo=geographyFor(node),map=CONTEXT_MAPS[geo.key];
 const {c,project}=baseMap(canvas,map,96,96);const [x,y]=project(geo.coord);
 coordinate(c,x,y,9,true);finishPaper(canvas,{mini:true});
 canvas.dataset.location=geo.key;canvas.dataset.coordinate=geo.coord.join(',');
}

// A quiet navigation basemap, independent of the printed terrain atlas.
export function drawPhoneMap(canvas,visited=[]){
 const height=Number(canvas.dataset.height)||384;canvas.width=384;canvas.height=height;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const project=coord=>projectMap(coord,JOURNEY_BOUNDS,384,height,18);
 c.fillStyle='#000';c.fillRect(0,0,384,height);geometry(c,{type:'MultiPolygon',coordinates:WORLD},project,'#fff');geometry(c,CONTEXT_MAPS.africa.water,project,'#000');
 const mask=c.getImageData(0,0,384,height).data;
 for(let y=0;y<height;y+=2)for(let x=0;x<384;x+=2){
  const lon=9+(x-18)/348*55,lat=14-(y-(height-348)/2)/348*55;
  const green=((lon-25)**2/170+(lat+3)**2/115)<1||((lon-34)**2/50+(lat+9)**2/120)<1;
  const dry=lon<23&&lat<-17;
  c.fillStyle=mask[(y*384+x)*4]>180?(green?'#adb388':dry?'#d4c398':'#dcd0a5'):'#929d78';c.fillRect(x,y,2,2);
 }
 c.lineWidth=.8;geometry(c,CONTEXT_MAPS.africa.borders,project,null,'#b0ac82');
 geometry(c,CONTEXT_MAPS.africa.water,project,'#929d78');
 const text=(label,coord)=>{const [x,y]=project(coord);c.fillStyle='#65714f';c.font='9px Pixel,monospace';c.textAlign='center';c.fillText(label,x,y);};
 text('KENYA',[37,4]);text('TANZANIA',[33,-7]);text('NAMIBIA',[18,-18]);text('SOUTH AFRICA',[26,-32]);text('MADAGASCAR',[47,-26]);text('INDIAN OCEAN',[53,-31]);
 c.textAlign='start';
 // Leader lines explain displaced points where two destinations almost coincide.
 for(const p of routePins.filter(p=>p.offset)){const a=project(p.coord),b=pinPosition(p,height);c.strokeStyle='#89936e';c.lineWidth=1;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();}
 canvas.dataset.visited=visited.join(',');
}
