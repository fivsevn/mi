import {tiltSprite} from './pixel-object.js?v=paper-study-25';

// The same 64 x 44 stock, cut edges, wear clusters and crease pixels for
// both the geographic miniature and the homepage's folded paper title.
export function drawFoldedPaper(c,toneAt){
 const w=64,h=44;
 for(let y=1;y<h-2;y++)for(let x=1;x<w-2;x++){
  // Broad stains and worn patches are grouped on a 3-5 pixel grid, as in the
  // aged-paper reference. They follow folds and edges rather than random noise.
  const bx=Math.floor(x/4),by=Math.floor(y/3),patch=(bx*13+by*17+bx*by*3)%19;
  const top=x<13?2:x<18?3:x<36?1:x<42?3:2;
  const bottom=h-3-(x>22&&x<28?2:x>49&&x<54?1:0);
  if(y<top||y>bottom||x<2&&y>19&&y<23||x>w-5&&y>17&&y<21)continue;
  const edge=Math.min(x,w-x-2,y-top,bottom-y);
  const fold=Math.min(Math.abs(x-21),Math.abs(x-42),Math.abs(y-22));
  const shade=edge<2?2:fold<2?2:patch<3?2:patch<7?1:0;
  c.fillStyle=toneAt(x,y,shade,patch);c.fillRect(x,y,1,1);
 }
 // Creases break at torn edges; alternate lit and shaded sides imply folded stock.
 for(const x of [21,42]){c.fillStyle='#b4a578';c.fillRect(x,4,1,h-9);c.fillStyle='#eddfb1';c.fillRect(x+1,4,1,h-9);}
 c.fillStyle='#b4a578';c.fillRect(3,22,w-8,1);c.fillStyle='#c5c69a';c.fillRect(4,23,w-9,1);
}

export function drawFoldedTitle(canvas){
 const source=document.createElement('canvas');source.width=64;source.height=44;
 const c=source.getContext('2d'),paper=['#e2d5a4','#d2c79c','#c5c69a','#b4a578'];
 drawFoldedPaper(c,(x,y,shade)=>paper[shade]);
 c.fillStyle='#435644';c.font='12px Pixel,monospace';c.textAlign='center';
 c.fillText('米的地图',32,23);
 c.font='6px Pixel,monospace';c.fillText('MI’S MAP',32,34);
 tiltSprite(canvas,source,96,72,11,1.1,4);
}
