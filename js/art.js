import { paintTerrain,coordinate,compass,MAP_INK } from './maps.js?v=atlas-30';
import { WORLD } from '../assets/world-grid.js?v=atlas-30';
export {scene,avatar,selfie} from './scene.js?v=atlas-30';
const project=([lon,lat])=>[(lon+180)*3,30+(90-lat)*3];
function trace(c,rings){c.beginPath();for(const ring of rings){ring.forEach((p,i)=>{const [x,y]=project(p);i?c.lineTo(x,y):c.moveTo(x,y);});c.closePath();}}
export function drawMap(canvas,visited=[]){
 canvas.width=1080;canvas.height=600;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.fillStyle='#000';c.fillRect(0,0,1080,600);
 for(const p of WORLD){trace(c,p);c.fillStyle='#fff';c.fill('evenodd');}
 paintTerrain(c,1080,600,c.getImageData(0,0,1080,600).data,2,(x,y)=>[x/3-180,90-(y-30)/3]);
 const stops=[['safari',35.1,-1.45],['seychelles',55.46,-4.67],['falls',25.86,-17.925],['chobe',25.15,-17.82],['namibia',17.08,-22.57],['cape',18.42,-33.93],['mauritius',57.55,-20.2]];
 for(const [id,lon,lat] of stops){const [x,y]=project([lon,lat]);coordinate(c,x,y,7,visited.includes(id));}
 compass(c,project([91,-35])[0],project([91,-35])[1],37);
 c.fillStyle=MAP_INK;c.font='12px Pixel,monospace';c.fillText('ATLANTIC',421,368);c.fillText('PACIFIC OCEAN',120,355);c.fillText('INDIAN OCEAN',728,349);c.fillText('AUSTRALIA',910,370);c.fillText('ASIA',819,151);c.fillText('EUROPE',590,145);
 c.fillStyle='#c5bb87';c.font='10px Pixel,monospace';for(let x=30;x<1080;x+=90)c.fillText(String(x/3-180)+'°',x,590);
}
export function africaHitPath(){return 'M 479 199 L 513 178 L 550 176 L 569 190 L 589 188 L 635 223 L 665 259 L 697 263 L 680 289 L 660 299 L 652 327 L 635 345 L 625 395 L 607 414 L 594 400 L 579 374 L 575 348 L 553 324 L 549 286 L 519 275 L 499 254 L 479 225 Z';}
