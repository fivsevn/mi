import { AFRICA_OUTLINE } from '../assets/africa-outline.js?v=atlas-64';
import { paintTerrain,coordinate,MAP_INK } from './maps.js?v=atlas-64';
import { WORLD } from '../assets/world-grid.js?v=atlas-64';
export {avatar,selfie} from './scene.js?v=atlas-64';
export {storyScene as scene} from './story-art.js?v=story-light-1';
const project=([lon,lat])=>[(lon+180)*3,30+(90-lat)*3];
function trace(c,rings){c.beginPath();for(const ring of rings){ring.forEach((p,i)=>{const [x,y]=project(p);i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();}}
function label(c,text,x,y){const ink=c.fillStyle;c.fillStyle='#e5d9ad';c.fillText(text,x+1,y+1);c.fillStyle=ink;c.fillText(text,x,y);}
export function drawMap(canvas,visited=[]){
 canvas.width=1080;canvas.height=600;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#000';c.fillRect(0,0,1080,600);
 for(const p of WORLD){trace(c,p);c.fillStyle='#fff';c.fill('evenodd');}
 paintTerrain(c,1080,600,c.getImageData(0,0,1080,600).data,2,(x,y)=>[x/3-180,90-(y-30)/3]);
 const stops=[['safari',35.1,-1.45],['seychelles',55.46,-4.67],['falls',25.86,-17.925],['chobe',25.15,-17.82],['namibia',17.08,-22.57],['cape',18.42,-33.93],['mauritius',57.55,-20.2]];
 for(const [id,lon,lat] of stops){const [x,y]=project([lon,lat]);coordinate(c,x,y,7,visited.includes(id));}
 c.fillStyle=MAP_INK;c.font='12px Pixel,monospace';label(c,'ATLANTIC',421,368);label(c,'PACIFIC OCEAN',120,355);label(c,'INDIAN OCEAN',728,349);label(c,'AUSTRALIA',910,370);label(c,'ASIA',819,151);label(c,'EUROPE',590,145);
 c.fillStyle='#c5bb87';c.font='10px Pixel,monospace';for(let x=30;x<1080;x+=90)label(c,String(x/3-180)+'°',x,590);
}
export function africaHitPath(){return AFRICA_OUTLINE.map(ring=>ring.map((coord,i)=>{const [x,y]=project(coord);return (i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1);}).join(' ')+' Z').join(' ');}
