import { finishPaper } from './paper.js?v=code-11';
import { paintTerrain,coordinate,compass,MAP_INK } from './maps.js?v=code-11';
import { LAND, AFRICA } from '../assets/world-grid.js?v=code-11';
export {scene,avatar,selfie} from './scene.js?v=code-11';
function context(canvas,w,h){canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;return c;}
function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
export function drawMap(canvas,visited=[]){
 const c=context(canvas,720,396);rect(c,'#000',0,0,720,396);
 for(let i=0;i<LAND.length;i+=2)rect(c,'#fff',54+LAND[i]*3.4,36+LAND[i+1]*3.4,4,4);
 [[47,-20],[55,-5],[58,-20]].forEach(([lon,lat])=>rect(c,'#fff',54+(lon+180)/2*3.4,36+(90-lat)/2*3.4,4,5));
 paintTerrain(c,720,396,c.getImageData(0,0,720,396).data,3,(x,y)=>[(x-54)/3.4*2-180,90-(y-36)/3.4*2]);
 const stops=[['safari',35,-3],['seychelles',55,-5],['falls',26,-18],['chobe',25,-18],['namibia',17,-23],['cape',18,-34],['mauritius',58,-20]];
 const pts=stops.map(([id,lon,lat])=>[54+(lon+180)/2*3.4-(id==='chobe'?7:0),36+(90-lat)/2*3.4]);
 pts.forEach(([x,y])=>coordinate(c,x,y,7,false));compass(c,616,275,23);
 c.font='12px Pixel, monospace';c.fillStyle=MAP_INK;c.fillText('90° N',12,44);c.fillText('0°',18,197);c.fillText('90° S',12,344);c.fillText('180° W',48,369);c.fillText('0°',354,369);c.fillText('180° E',623,369);
 c.fillStyle=MAP_INK;c.font='12px Pixel, monospace';c.fillText('PACIFIC OCEAN',61,239);c.fillText('ATLANTIC',272,213);c.fillText('INDIAN OCEAN',470,278);finishPaper(canvas);
}
export function africaHitPath(){return [...AFRICA].map(v=>{const x=54+(v%180)*3.4,y=36+Math.floor(v/180)*3.4;return `M${x} ${y}h3.4v3.4h-3.4z`;}).join('');}
