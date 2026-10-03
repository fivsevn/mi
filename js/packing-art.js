export const HANDLE_TRAVEL=64;
// All artwork is authored on integer pixel grids, in the game's sage/straw palette.
const P={ink:'#435644',deep:'#566650',dark:'#65714f',olive:'#78805a',sage:'#93996c',light:'#adb388',cream:'#e2d5a4',pale:'#eddfb1',clay:'#bb997e',rust:'#ab7560',blue:'#7e9fa2'};
function rect(c,k,x,y,w,h){c.fillStyle=P[k]||k;c.fillRect(x,y,w,h);}
// Pixel clusters are authored around the material and light direction.
// References: cure's Pixel Joint tutorial and Saint11's Fabric tutorial.
const FABRIC=['#657553','#768463','#89946f','#9ba47c','#aab28a','#bcc29a','#d0d2aa'];
const SHELL=['#4f624c','#5e7054','#73815b','#839063','#9ba477','#b4bd8d','#cbd1a4'];
function caseContext(canvas,width,extra=0){canvas.width=width*2;canvas.height=572+extra*2;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.scale(2,2);c.translate(0,extra);return c;}
// A sampled patch has no interpolated edge: each scan row ends on the authored grid.
function patch(c,k,x,y,points,step=.5){
 const low=Math.min(...points.map(p=>p[1])),high=Math.max(...points.map(p=>p[1]));
 for(let v=low;v<high;v+=step){
  const edges=[];
  for(let j=0;j<points.length;j++){const a=points[j],b=points[(j+1)%points.length],at=v+step/2;if((a[1]<=at&&b[1]>at)||(b[1]<=at&&a[1]>at))edges.push(a[0]+(at-a[1])*(b[0]-a[0])/(b[1]-a[1]));}
  edges.sort((a,b)=>a-b);for(let j=0;j+1<edges.length;j+=2){const u=Math.round(edges[j]/step)*step,end=Math.round(edges[j+1]/step)*step;rect(c,k,x+u,y+v,end-u,step);}
 }
}
function caseBody(c,k,x,y,w,h){patch(c,k,x,y,[[10,0],[w-12,0],[w-7,2],[w-3,6],[w,13],[w,h-13],[w-2,h-7],[w-7,h-2],[w-14,h],[12,h],[6,h-2],[2,h-7],[0,h-14],[0,12],[2,6],[6,2]],2);}
function shell(c,x,y,w,h){
 caseBody(c,'#56665055',x+4,y+6,w,h);caseBody(c,SHELL[2],x,y,w,h);
 // Molded walls catch uneven light; corner guards are separate physical pieces.
 patch(c,SHELL[4],x,y,[[7,5],[16,2],[w-17,2],[w-9,5],[w-16,9],[21,8],[9,13]]);
 patch(c,SHELL[3],x,y,[[3,12],[9,9],[12,19],[10,h-23],[6,h-14],[2,h-20]]);
 patch(c,SHELL[1],x,y,[[w-11,13],[w-2,16],[w-1,h-19],[w-7,h-6],[w-13,h-12],[w-12,h-40]]);
 patch(c,SHELL[1],x,y,[[11,h-12],[w-16,h-14],[w-7,h-7],[w-13,h-1],[17,h-1],[7,h-6]]);
 rect(c,SHELL[3],x+11,y+11,w-25,h-25);
 rect(c,SHELL[1],x+13,y+12,w-30,3);rect(c,SHELL[2],x+11,y+20,3,h-43);
 for(const [u,len]of [[20,29],[56,44],[107,27],[141,19]]){rect(c,SHELL[5],x+u,y+3,len,1);rect(c,SHELL[4],x+u+2,y+4,len-5,.5);}
 // Quiet molded stipple, in connected two-pixel islands rather than random noise.
 for(let v=18;v<h-21;v+=4)for(const u of [5,w-6]){rect(c,SHELL[u===5?4:2],x+u,y+v,1,.5);if(v%8===2)rect(c,SHELL[3],x+u+.5,y+v+.5,.5,.5);}
 for(let u=18;u<w-21;u+=2){rect(c,SHELL[1],x+u,y+9,1,.5);rect(c,SHELL[4],x+u+.5,y+9.5,.5,.5);}
 for(const [u,v]of [[8,10],[w-14,10],[8,h-20],[w-14,h-20]]){
  patch(c,SHELL[3],x+u,y+v,[[0,0],[6,1],[8,6],[6,10],[2,10],[0,6]]);
  for(let j=0;j<5;j++){rect(c,SHELL[4],x+u+1+j*.5,y+v+2+j,1.5,.5);if(j<3)rect(c,SHELL[5],x+u+1+j*.5,y+v+2+j,.5,.5);}
  rect(c,SHELL[1],x+u+4,y+v+7,1,.5);
 }
 // Local abrasions break long, perfectly uniform faces.
 for(const [u,v,wid]of [[6,61,2],[7,118,1.5],[w-7,80,2],[w-8,153,1.5],[32,h-6,5],[87,h-7,3],[142,h-8,6]]){rect(c,SHELL[3],x+u,y+v,wid,.5);rect(c,SHELL[4],x+u,y+v,Math.max(.5,Math.floor(wid)/2),.5);}
}
function woven(c,x,y,w,h){
 const b=c.getImageData(Math.round(x*2),Math.round(y*2),w*2,h*2),p=b.data;
 const rgb=FABRIC.map(k=>k.slice(1).match(/../g).map(n=>parseInt(n,16))),lookup=new Map(rgb.map((a,i)=>[a.join(','),i]));
 // Each weave tile has a lit warp and a short under-thread. Shadows stay quieter.
 for(let v=3;v<b.height-3;v++)for(let u=3;u<b.width-3;u++){
  const index=(v*b.width+u)*4,tone=lookup.get([p[index],p[index+1],p[index+2]].join(','));if(tone===undefined||tone<2)continue;
  const row=v%8,col=(u+(Math.floor(v/8)%2)*4)%8;
  const up=(row===1&&col>=1&&col<=3)||(row===2&&col===3),down=(row===5&&col>=5&&col<=6);
  if(!up&&!down)continue;const next=Math.max(0,Math.min(rgb.length-1,tone+(up?1:-1)));
  const color=rgb[next];for(let j=0;j<3;j++)p[index+j]=color[j];
 }
 c.save();c.setTransform(1,0,0,1,0,0);c.putImageData(b,Math.round(x*2),Math.round(y*2));c.restore();
}
function folds(c,x,y){
 rect(c,FABRIC[2],x,y,148,193);
 patch(c,FABRIC[4],x,y,[[10,8],[27,5],[50,9],[86,6],[119,9],[138,6],[142,25],[138,68],[142,109],[137,148],[140,178],[121,185],[94,181],[64,187],[28,183],[10,175],[6,148],[10,111],[6,74],[10,38]]);
 // Fabric gathers toward the four anchors and the strap buckle, not toward a border.
 patch(c,FABRIC[3],x,y,[[7,11],[15,12],[32,35],[42,71],[70,96],[53,92],[29,67],[12,38]]);
 patch(c,FABRIC[5],x,y,[[18,17],[36,32],[43,59],[54,81],[49,76],[31,49],[18,31],[13,30]]);
 patch(c,FABRIC[3],x,y,[[139,13],[134,45],[123,66],[91,91],[79,99],[92,77],[115,50],[132,14]]);
 patch(c,FABRIC[5],x,y,[[128,20],[132,19],[128,42],[108,64],[116,42]]);
 patch(c,FABRIC[3],x,y,[[11,166],[31,146],[49,131],[64,116],[63,124],[47,147],[28,167],[20,179],[9,181]]);
 patch(c,FABRIC[5],x,y,[[16,169],[34,159],[43,152],[31,170],[19,177],[15,175]]);
 patch(c,FABRIC[3],x,y,[[133,177],[113,166],[91,145],[82,127],[91,132],[111,151],[132,160],[141,179]]);
 patch(c,FABRIC[5],x,y,[[130,175],[110,168],[101,157],[113,162],[134,166]]);
 // A relaxed, wide cloth wave crosses the empty space beneath the buckle.
 patch(c,FABRIC[5],x,y,[[29,106],[46,105],[61,111],[88,111],[108,104],[127,101],[119,108],[100,117],[78,120],[55,117],[40,111]]);
 patch(c,FABRIC[3],x,y,[[32,113],[58,121],[81,123],[104,119],[120,111],[112,119],[92,127],[68,128],[48,123]]);
 patch(c,FABRIC[5],x,y,[[38,180],[52,173],[77,174],[96,171],[112,175],[127,180],[114,182],[93,178],[69,181],[49,181]]);
 // Compressed corner folds cast small, tapering deep shadows.
 for(const [u,v,dir]of [[9,11,1],[135,12,-1],[11,177,1],[136,178,-1]]){
  patch(c,FABRIC[1],x+u,y+v,[[0,0],[dir*4,2],[dir*11,17],[dir*7,13],[dir*2,6]]);
  patch(c,FABRIC[5],x+u,y+v,[[dir*4,2],[dir*7,5],[dir*13,17],[dir*11,16]]);
 }
 woven(c,x,y,148,193);
}
function belt(c,x,y,mirror){
 for(let v=0;v<148;v+=.5){
  const bend=v<63?Math.floor(v/16)*.5:v>95?-Math.floor((v-95)/14)*.5:0;
  const shift=Math.round((v/1.05+bend)*2)/2,u=mirror?140-shift:4+shift;
  rect(c,'#71815c66',x+u+2,y+23+v,7,.5);
  rect(c,SHELL[2],x+u,y+21+v,6.5,.5);
  if(v%3<1)rect(c,SHELL[3],x+u+1,y+21+v,4,.5);
  if(v%2===0){rect(c,SHELL[4],x+u,y+21+v,1,.5);rect(c,SHELL[1],x+u+5.5,y+21+v,.5,.5);}
  if(v%7===0)rect(c,SHELL[4],x+u+2,y+21+v,1,.5);
 }
}
function lining(c,x,y,divider){
 folds(c,x,y);
 if(divider){
  // The lid has a softer mesh divider and a draped lower pocket.
  patch(c,FABRIC[3],x,y,[[7,104],[45,108],[80,103],[111,107],[138,103],[139,177],[114,183],[77,180],[42,184],[9,178]]);
  patch(c,FABRIC[4],x,y,[[11,107],[43,111],[78,107],[110,111],[134,107],[133,171],[111,178],[73,174],[43,179],[14,174]]);
  patch(c,FABRIC[5],x,y,[[17,120],[24,141],[21,165],[17,171],[16,147]]);
  patch(c,FABRIC[2],x,y,[[131,119],[127,150],[120,173],[111,178],[120,160],[125,139]]);
  woven(c,x+7,y+105,132,75);
  for(let u=9;u<135;u+=1.5){const sag=(u>35&&u<68?2:u>98?1:0);rect(c,FABRIC[1],x+u,y+103+sag,1,.5);rect(c,FABRIC[5],x+u+.5,y+103.5+sag,.5,.5);}
  rect(c,'#aa9275',x+130,y+104,4,9);rect(c,'#d8cda1',x+130.5,y+104,2.5,1);rect(c,'#877c60',x+131,y+107,1.5,3);
 }else{
  belt(c,x,y,false);belt(c,x,y,true);
  // The metal buckle has broken highlights, a raised tongue and a recessed opening.
  patch(c,'#7b805e',x+63,y+89,[[1,1],[19,2],[21,11],[18,15],[3,14],[0,9]]);
  patch(c,'#b6a17b',x+63,y+88,[[2,0],[17,0],[20,3],[20,10],[17,13],[2,12],[0,9],[0,3]]);
  rect(c,'#ded3a6',x+66,y+88,10,1);rect(c,'#cbbd93',x+78,y+89,3,1.5);rect(c,'#99886a',x+65,y+99,15,1.5);
  rect(c,'#73795a',x+68,y+93,10,3);rect(c,'#d0c49a',x+69,y+92.5,8,.5);rect(c,'#b09d78',x+73,y+93,1.5,3);
  for(const u of [5,133]){patch(c,FABRIC[2],x+u,y+16,[[0,0],[7,0],[10,3],[9,8],[6,10],[1,9],[0,6]]);rect(c,FABRIC[5],x+u+2,y+17,4.5,1);rect(c,FABRIC[1],x+u+3,y+23,3,.5);}
 }
}
// The same inverse pixel sampling as the tilted phone, with a gentler angle.
// Keep fine material pixels, but quantize the silhouette to paired-pixel steps.
function steppedCase(canvas,cx,degrees,extra=0,centerY=136+extra){
 const c=canvas.getContext('2d'),src=c.getImageData(0,0,canvas.width,canvas.height),out=c.createImageData(canvas.width,canvas.height),mid=cx*2,cy=centerY*2;
 const a=degrees*Math.PI/180,cos=Math.cos(a),sin=Math.sin(a);
 for(let y=0;y<canvas.height;y++)for(let x=0;x<canvas.width;x++){
  const dx=x+.5-mid,dy=y+.5-cy,sx=Math.floor(cos*dx+sin*dy+mid),sy=Math.floor(-sin*dx+cos*dy+cy);
  if(sx<0||sy<0||sx>=canvas.width||sy>=canvas.height)continue;
  const i=(sy*canvas.width+sx)*4,j=(y*canvas.width+x)*4;
  // Silhouette coverage uses a 4 x 4 authored edge grid; interior stays detailed.
  const ex=Math.floor(x/4)*4+2-mid,ey=Math.floor(y/4)*4+2-cy,ux=Math.floor(cos*ex+sin*ey+mid),uy=Math.floor(-sin*ex+cos*ey+cy);
  if(ux<0||uy<0||ux>=canvas.width||uy>=canvas.height||!src.data[(uy*canvas.width+ux)*4+3])continue;
  const edge=src.data[i+3]?i:(uy*canvas.width+ux)*4;out.data.set(src.data.subarray(edge,edge+4),j);
 }
 c.save();c.setTransform(1,0,0,1,0,0);c.putImageData(out,0,0);c.restore();
}
function topHandle(c,x,extension=0){
 // Recessed trolley grip and flexible carry handle are both attached at the top.
 const lift=extension*HANDLE_TRAVEL;
 for(const u of [69,108]){rect(c,SHELL[0],x+u-1,9,6,7);rect(c,'#8e9781',x+u,6-lift,4,8+lift);rect(c,'#c5c5a6',x+u,6-lift,1,8+lift);rect(c,'#697865',x+u+3,6-lift,1,8+lift);if(lift>12)rect(c,'#a9af95',x+u,6-lift/2,4,1);}
 patch(c,SHELL[0],x+64,1-lift,[[3,0],[52,0],[55,2],[55,6],[52,8],[3,8],[0,6],[0,2]],1);
 rect(c,SHELL[3],x+68,2-lift,46,2);for(const [u,len]of [[5,13],[23,11],[39,8]])rect(c,SHELL[5],x+64+u,2-lift,len,1);
 patch(c,SHELL[0],x+57,1,[[6,0],[63,0],[69,3],[69,11],[64,14],[58,14],[58,8],[11,8],[11,14],[5,14],[0,11],[0,4]]);
 patch(c,SHELL[3],x+61,1,[[4,0],[58,0],[62,2],[61,5],[2,5],[0,3]]);
 for(const [u,len]of [[5,12],[21,19],[45,9]])rect(c,SHELL[5],x+61+u,2,len,1);
 rect(c,SHELL[2],x+59,6,3,7);rect(c,SHELL[1],x+122,6,3,7);
 rect(c,'#b5b28b',x+59,12,3,2);rect(c,'#929778',x+121,12,3,2);
}
function caseLock(c,x,closed){
 const u=x+170,v=106;
 patch(c,SHELL[0],u+1,v+3,[[3,0],[12,0],[15,3],[15,42],[12,45],[2,45],[0,42],[0,4]]);
 patch(c,'#a68e72',u,v,[[3,0],[12,0],[14,3],[14,42],[11,44],[2,44],[0,41],[0,4]]);
 rect(c,'#cfbc94',u+2,v+1,8,1);rect(c,'#baaa86',u+1,v+5,2,34);rect(c,'#877b60',u+12,v+5,2,35);
 // Three knurled number wheels, separated from the metal body by recesses.
 for(let j=0;j<3;j++){
  const yy=v+12+j*7;rect(c,'#746f56',u+4,yy,7,6);rect(c,'#d0c49b',u+5,yy+1,5,4);
  rect(c,'#958c6c',u+5,yy+1,1,4);rect(c,'#ede0b1',u+7,yy+1,2,1);rect(c,'#7c7c60',u+7,yy+2,2,2);rect(c,'#d0c49b',u+8,yy+2,1,1);
  rect(c,'#dfd2a5',u+10,yy+2,1,1);
 }
 rect(c,'#746f56',u+4,v+35,7,6);rect(c,'#c3b28c',u+5,v+35,6,4);rect(c,'#e3d4a8',u+5,v+35,4,1);
 rect(c,'#81785f',u+5,v+5,2,5);rect(c,'#81785f',u+9,v+5,2,5);
 // Paired zipper tongues dock in the lock when the case is shut.
 for(let j=0;j<2;j++){
  const yy=closed?v+3:v-5-j*3,xx=u+4+j*4;
  patch(c,'#b8a681',xx,yy,[[0,0],[3,0],[3,7],[2,9],[0,8]]);rect(c,'#e0cfa4',xx,yy,2,1);rect(c,'#81785f',xx+1,yy+3,1,3);
 }
 rect(c,'#917b65',u+5,v+42,4,1);
}
export function drawSuitcaseLid(canvas){caseContext(canvas,200);}
function fabricSpine(c){
 // A zipper case bends along one continuous cloth gusset, not two metal hinges.
 patch(c,SHELL[1],186,24,[[4,0],[22,0],[27,6],[27,207],[22,213],[3,213],[0,207],[0,7]],1);
 patch(c,FABRIC[2],189,27,[[4,0],[19,0],[22,5],[22,202],[18,207],[3,207],[0,201],[0,6]],1);
 patch(c,FABRIC[3],193,30,[[0,0],[9,2],[12,35],[9,100],[12,172],[9,201],[1,203],[3,151],[0,88],[3,30]],1);
 patch(c,FABRIC[1],198,32,[[1,0],[3,7],[2,58],[4,111],[2,171],[3,195],[1,201],[0,171],[1,107],[0,52]],1);
 for(let v=35;v<224;v+=4){rect(c,FABRIC[4],194,v,1,1);rect(c,FABRIC[2],205,v+1,1,1);}
 for(const v of [58,183]){rect(c,FABRIC[2],192,v,16,9);rect(c,FABRIC[4],192,v,16,1);rect(c,FABRIC[1],193,v+8,14,1);for(let u=194;u<207;u+=3)rect(c,FABRIC[3],u,v+3,1,3);}
}
function pixelName(c,x,y){
 {
  const glyph=document.createElement('canvas');glyph.width=12;glyph.height=14;const g=glyph.getContext('2d');g.font='12px Pixel';g.textBaseline='top';g.fillText('米',0,0);
  const data=g.getImageData(0,0,12,14).data;var nameGlyph=[];
  for(let v=0;v<14;v++)for(let u=0;u<12;u++)if(data[(v*12+u)*4+3]>=128)nameGlyph.push([u,v]);
 }
 for(const [u,v]of nameGlyph)rect(c,'ink',x+u*1.5,y+v*1.5,1.5,1.5);
}
function luggageTag(c,x){
 // Reference: Woodstock McKenzie. A buckled strap, leather sleeve and name-card window.
 patch(c,'#907659',x+117,9,[[0,0],[5,0],[5,12],[7,20],[14,28],[12,32],[7,29],[2,20],[0,13]],1);
 patch(c,'clay',x+119,12,[[0,0],[4,0],[4,13],[9,22],[10,33],[6,34],[6,24],[1,14]],1);
 rect(c,'#ccb18a',x+120,13,1,11);rect(c,'#a88968',x+123,20,1,8);
 // Small folded buckle wraps around the strap, with leather visible through its opening.
 patch(c,'#847b61',x+118,25,[[1,0],[8,0],[9,1],[9,7],[8,8],[1,8],[0,7],[0,1]],1);
 rect(c,'#d0c2a0',x+119,25,6,1);rect(c,'#b9ad8b',x+118,26,1,6);rect(c,'#b9ad8b',x+126,26,1,6);rect(c,'#bcae8a',x+119,32,6,1);rect(c,'#bb997e',x+120,27,5,4);rect(c,'#e0d4af',x+122,27,1,4);
 patch(c,'#56665066',x+111,43,[[12,0],[24,0],[24,4],[33,6],[37,10],[37,47],[34,51],[3,51],[0,48],[0,10],[4,6],[12,4]],1);
 patch(c,'clay',x+109,40,[[12,0],[24,0],[24,4],[33,6],[37,10],[37,47],[34,51],[3,51],[0,48],[0,10],[4,6],[12,4]],1);
 rect(c,'#cfb28e',x+122,40,10,1);rect(c,'#a38569',x+143,51,2,34);rect(c,'#a38569',x+112,89,30,2);
 // The cream insert sits behind a recessed window; the leather stays visible around it.
 rect(c,'#9a8164',x+113,52,29,34);rect(c,'cream',x+114,54,27,30);rect(c,'pale',x+115,55,25,1);rect(c,'#cbbb92',x+114,82,27,2);
 patch(c,'#eaddb1',x+114,54,[[0,0],[8,0],[0,10]],1);rect(c,'#d3c7a0',x+140,56,1,25);
 for(let u=113;u<142;u+=4){rect(c,'#d0b28b',x+u,48,1,1);rect(c,'#d0b28b',x+u,87,1,1);}
 for(let v=53;v<85;v+=4){rect(c,'#d0b28b',x+111,v,1,1);rect(c,'#d0b28b',x+144,v,1,1);}
 rect(c,'#8e775d',x+125,44,5,3);rect(c,'#b49470',x+126,42,3,5);rect(c,'#d0af87',x+126,42,1,4);
 pixelName(c,x+118.5,58);
}
export function drawSuitcase(canvas,closed,progress=0){
 const extra=closed?Math.round(Math.max(0,Math.min(1,progress))*HANDLE_TRAVEL):0;
 const c=caseContext(canvas,400,extra),x=closed?108:206;
 if(!closed){fabricSpine(c);shell(c,10,12,184,234);lining(c,27,31,true);}
 shell(c,x,12,184,234);
 if(closed){
  rect(c,SHELL[2],x+17,29,149,187);
  for(let u=x+27;u<x+160;u+=25){
   patch(c,SHELL[1],u,36,[[2,0],[6,3],[5,168],[3,176],[0,173],[0,7]]);
   for(let v=41;v<207;v+=3){rect(c,SHELL[3],u+6,v,1.5,2);if(v%6===5)rect(c,SHELL[4],u+6.5,v,.5,1);}
  }
  for(let v=31;v<216;v+=4)for(let u=x+19;u<x+164;u+=4)if((u+v)%8===3){rect(c,SHELL[3],u,v,1,.5);rect(c,SHELL[2],u+.5,v+.5,.5,.5);}
  luggageTag(c,x);

 }else{
  lining(c,x+17,31,false);
 }
 for(const u of [x+20,x+143]){
  patch(c,SHELL[0],u,241,[[4,0],[17,0],[21,4],[21,19],[16,24],[5,24],[0,19],[0,5]]);
  patch(c,SHELL[1],u+4,245,[[2,0],[9,0],[12,3],[12,16],[9,20],[2,20],[0,17],[0,3]]);
  for(let v=248;v<262;v+=2){rect(c,SHELL[2],u+5,v,9,1);rect(c,SHELL[0],u+8,v+1,6,.5);rect(c,SHELL[3],u+5,v,1,.5);}
 }
 topHandle(c,x,closed?extra/HANDLE_TRAVEL:0);caseLock(c,x,closed);
 steppedCase(canvas,closed?x+92:200,3.5,extra);
}
export function drawScale(canvas,tone='normal'){
 canvas.width=256;canvas.height=188;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.scale(2,2);
 // Molded plastic and two inset physical keys belong to one weighing device.
 caseBody(c,'#56665066',7,15,118,75);caseBody(c,'#566650',5,11,118,75);
 caseBody(c,'#a1a87a',3,5,118,76);
 patch(c,'#bcc29a',3,5,[[10,0],[106,0],[113,4],[106,9],[15,8],[4,13],[1,9]],1);
 patch(c,'#939b70',4,15,[[0,0],[7,-4],[7,54],[11,61],[5,61],[0,55]],1);
 patch(c,'#748360',112,15,[[0,-4],[7,2],[8,54],[3,62],[-2,59]],1);
 patch(c,'#849066',10,73,[[0,0],[102,-1],[106,3],[100,8],[8,8],[-3,4]],1);
 // Broken highlights and small joined material clusters avoid a flat vector rim.
 for(const [x,w]of [[15,18],[38,23],[67,15],[88,14]]){rect(c,'#d0d2aa',x,7,w,1);rect(c,'#b3ba8c',x+3,8,w-7,1);}
 for(let x=13;x<111;x+=7){rect(c,'#adb58a',x,51,2,1);if(x%3===0)rect(c,'#87966d',x+2,52,1,1);}
 for(const [x,y]of [[9,21],[11,48],[114,27],[111,69],[22,78],[101,76]]){rect(c,'#bbc19a',x,y,3,1);rect(c,'#8c966e',x+1,y+1,2,1);}
 // A recessed LCD with opaque, stepped corners and a quiet glass reflection.
 patch(c,'#74805a',11,15,[[3,0],[100,0],[103,3],[103,32],[100,35],[3,35],[0,32],[0,3]],1);
 patch(c,'#52634a',14,18,[[1,0],[96,0],[98,2],[98,28],[96,30],[1,30],[0,28],[0,2]],1);
 const lcd=tone==='danger'?'#bd765e':tone==='warning'?'#dfbd65':'#93996c';
 rect(c,lcd,18,21,91,24);rect(c,tone==='normal'?'#a6ad7d':tone==='warning'?'#ebce83':'#cf9174',18,21,91,1);
 patch(c,tone==='normal'?'#a1a87a':lcd,18,22,[[0,0],[23,0],[8,9],[0,9]],1);
 rect(c,'#6f7b57',18,45,91,1);rect(c,'#b5bc92',14,49,92,1);
 for(const x of [11,67]){
  patch(c,'#667553',x,56,[[2,0],[48,0],[50,2],[50,17],[48,20],[2,20],[0,17],[0,2]],1);
  patch(c,'#bac092',x+2,57,[[1,0],[44,0],[46,2],[46,14],[44,16],[1,16],[0,14],[0,2]],1);
  rect(c,'#d1d4aa',x+4,57,41,1);rect(c,'#adb588',x+3,59,1,11);rect(c,'#8e9a6e',x+4,72,42,1);
  rect(c,'#c7cea0',x+6,59,7,1);rect(c,'#a5af81',x+38,69,6,1);
 }
 rect(c,'#4f624c',14,83,12,3);rect(c,'#4f624c',102,83,12,3);
 steppedCase(canvas,64,2,0,47);
}
export function drawPackingItem(canvas,item){
 canvas.width=32;canvas.height=32;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;
 const R=(k,x,y,w,h)=>rect(c,k,x,y,w,h),id=item.id,col=item.color||'cream';
 // Short hard-edged contact shadow, shared lighting with the phone sprites.

 if(/goggles|glasses/.test(id)){
  R('dark',3,13,26,3);R('ink',5,11,9,10);R('ink',18,11,9,10);R('blue',6,12,7,7);R('blue',19,12,7,7);R('pale',7,13,2,2);R('pale',20,13,2,2);R('clay',14,14,4,2);
 }else if(id==='swimsuit'){R('dark',8,7,3,5);R('dark',21,7,3,5);R('blue',7,11,8,6);R('blue',18,11,8,6);R('clay',15,13,3,2);R('blue',9,22,15,3);R('blue',12,25,9,3);R('blue',14,28,5,1);
 }else if(id==='wash'){R('dark',6,12,22,15);R('clay',5,11,22,14);R('cream',7,12,18,1);R('dark',9,13,14,1);R('cream',21,14,2,4);R('pale',8,18,4,3);R('sage',7,24,18,2);
 }else if(id==='towel'){R('dark',6,7,21,21);R('cream',5,6,20,21);R('pale',7,7,2,18);R('clay',5,21,20,2);R('clay',5,24,20,1);R('light',24,9,3,19);
 }else if(id==='powerbank'){R('dark',9,5,15,24);R('cream',8,4,15,24);R('pale',10,5,2,20);R('sage',9,25,13,2);R('dark',12,7,6,2);for(let x=11;x<21;x+=3)R('blue',x,18,1,1);}
 else if(id==='adapter'){R('dark',8,7,16,18);R('light',7,6,16,18);R('pale',9,7,12,2);R('ink',11,11,2,3);R('ink',18,11,2,3);R('ink',14,17,2,3);R('dark',10,25,2,4);R('dark',19,25,2,4);
 }else if(['powerstrip','longstrip'].includes(id)){R('dark',3,10,25,11);R('cream',2,9,25,11);for(const x of [5,12,19]){R('sage',x,11,5,6);R('ink',x+1,12,1,2);R('ink',x+3,12,1,2);}R('clay',24,11,2,3);R('dark',5,21,1,4);R('dark',6,25,13,1);R('dark',18,22,1,3);if(id==='longstrip'){R('dark',21,23,8,6);R('light',23,24,4,3);}
 }else if(id==='airfryer'){R('ink',8,6,18,23);R('olive',7,5,18,23);R('sage',9,6,13,2);R('ink',9,13,13,11);R('light',13,18,6,3);R('clay',13,9,5,1);R('dark',9,29,15,1);
 }else if(id==='tea'){R('clay',2,24,28,3);R('cream',11,11,11,12);R('pale',13,8,7,3);R('dark',15,6,3,2);R('cream',22,13,5,3);R('cream',25,11,3,3);R('dark',7,13,4,8);R('cream',3,20,6,4);R('cream',25,20,5,4);
 }else if(id==='sandals'||id==='slippers'){for(const x of [3,18]){R('dark',x,10,10,18);R('clay',x+1,9,8,17);R('cream',x+1,13,8,3);R('cream',x+3,15,3,7);R('light',x+1,25,8,1);}}
 else if(id==='umbrella'){R('dark',15,7,3,19);R('blue',12,6,8,18);R('light',13,8,2,13);R('clay',11,19,10,2);R('dark',14,26,4,2);R('dark',11,25,3,2);}
 else if(id==='line'){R('dark',6,9,21,17);R('cream',7,8,19,16);R('dark',12,12,9,8);R('sage',14,14,5,4);R('cream',25,22,4,4);R('dark',4,13,3,7);}
 else if(id==='lock'){R('dark',10,5,13,11);R('light',12,7,9,7);R('dark',14,9,5,6);R('clay',8,14,18,14);R('cream',9,15,15,2);R('dark',16,20,2,4);}
 else if(id==='stone'){R('dark',5,16,22,10);R('#979b8d',6,13,20,11);R('#b2b6a4',9,9,15,6);R('#c5c9b3',11,10,5,2);R('#767e70',20,17,6,7);R('#a6ac97',8,22,7,2);}
 else if(id==='tape'){R('clay',6,10,21,16);R('cream',8,7,17,20);R('dark',12,11,9,11);R('sage',14,13,5,7);R('pale',9,9,3,4);R('cream',24,24,5,3);}
 else if(id==='medicine'){R('dark',5,10,23,16);R('clay',4,9,23,16);R('cream',12,12,7,10);R('cream',9,15,13,4);R('light',7,6,17,3);}
 else if(id==='binoculars'){R('ink',4,11,10,16);R('ink',20,11,10,16);R('olive',5,10,8,15);R('olive',21,10,8,15);R('light',6,11,2,9);R('light',22,11,2,9);R('dark',13,15,7,6);R('blue',6,25,6,2);R('blue',22,25,6,2);}
 else if(id==='box'){R('dark',6,14,21,13);R('clay',7,14,19,12);R('cream',3,10,12,5);R('cream',19,10,10,5);R('light',9,8,14,5);R('dark',12,12,10,3);R('pale',8,17,2,7);}
 else if(id==='sewing'){R('clay',5,14,22,13);R('cream',7,15,18,2);R('pale',9,8,5,14);R('clay',10,10,3,10);R('dark',20,5,1,20);R('cream',19,5,3,3);R('dark',23,17,3,1);}
 else if(id==='waterproof'){R('dark',7,8,20,21);R('blue',6,7,20,21);R('light',8,9,16,2);R('dark',8,11,16,2);R('pale',10,16,1,8);R('cream',21,11,2,4);}
 else if(id==='bags'){R('sage',7,7,18,21);R('cream',6,6,18,21);R('dark',10,5,10,8);R('light',12,7,6,4);R('sage',10,18,10,1);R('light',9,25,13,1);}
 else if(id==='paper'){R('light',7,9,20,18);R('cream',6,8,20,18);R('pale',9,6,15,4);R('dark',13,7,6,2);R('sage',25,11,3,17);R('cream',10,24,14,5);}
 else if(id==='guide'||id==='map'){R('dark',4,9,25,19);R('cream',3,8,25,19);R('light',11,9,2,17);R('light',19,9,2,17);R('sage',7,11,3,7);R('sage',13,17,6,4);R('sage',22,12,3,8);R('clay',8,21,13,1);}
 else if(item.slot==='top'||item.slot==='outer'||/tee|spare|laundry|raincoat|suit|cloth/.test(id)){
  R('ink',7,6,18,20);R(col,8,7,16,18);R('ink',3,8,5,9);R(col,4,8,5,8);R('ink',24,8,5,9);R(col,23,8,5,8);R('light',11,5,10,3);R('dark',13,6,6,3);R('pale',9,10,2,13);R('sage',21,10,2,14);
  if(id==='stripe')for(let y=12;y<24;y+=4)R('cream',10,y,12,2);
  if(/jacket|coat|raincoat/.test(id)){R('dark',15,9,1,16);R('pale',17,11,1,11);R('dark',10,18,3,1);R('dark',19,18,3,1);}
  if(/tee3|tee8|spare|laundry/.test(id)){R('sage',9,26,16,2);R('cream',10,28,14,1);}
 }else if(item.slot==='shoes'||/slippers|shoes3/.test(id)){
  for(const x of [3,17]){R('ink',x,12,10,13);R(col,x+1,12,8,11);R('dark',x+1,24,11,2);R('cream',x+3,13,4,3);for(let y=17;y<22;y+=2)R('light',x+2,y,5,1);}
 }else if(item.slot==='hat'){R('ink',3,21,26,4);R(col,4,20,24,3);R('dark',9,11,14,10);R(col,10,10,12,11);R('pale',11,11,3,7);R('clay',10,19,12,2);
 }else if(/camera|instant/.test(id)){R('dark',8,7,9,3);R('ink',4,10,24,15);R(id==='instant'?'cream':'olive',5,11,22,13);R('ink',11,13,10,9);R('blue',13,15,6,5);R('pale',13,15,2,2);R('cream',24,12,2,3);R('clay',6,21,4,2);
 }else if(/phone|backup|console|powerbank/.test(id)){const game=/console/.test(id);R('ink',game?3:9,6,game?26:14,21);R(id==='backup3'?'clay':id==='backup'?'cream':id==='console2'?'blue':'sage',game?4:10,7,game?24:12,19);R('dark',game?9:11,9,game?14:10,13);R('blue',game?10:12,10,game?12:8,10);R('pale',12,10,3,1);R('cream',15,24,3,1);if(game){R('ink',5,15,3,1);R('ink',6,14,1,3);R('clay',25,15,2,2);}
 }else if(/book|guide|novel|map|passport|postcard|receipts/.test(id)){R('dark',7,5,18,23);R(id==='passport'?'rust':'cream',6,4,18,23);R('pale',9,5,13,1);R('dark',8,5,1,20);R(id==='passport'?'cream':'clay',11,10,9,2);R('light',11,17,9,1);R('light',11,20,6,1);if(id==='passport'){R('cream',13,15,5,5);R('rust',15,16,1,3);}
 }else if(/toy|hippo/.test(id)){R('dark',7,7,5,5);R('dark',21,7,5,5);R('clay',8,8,3,3);R('clay',22,8,3,3);R('clay',9,10,15,12);R('ink',12,14,2,2);R('ink',21,14,2,2);R('cream',15,17,6,3);R('dark',17,18,2,1);R('clay',11,22,11,5);R('dark',8,24,5,4);R('dark',21,24,5,4);
 }else if(/ricecooker|airfryer|kettle|tea/.test(id)){R('dark',7,9,18,18);R('cream',8,10,16,15);R('sage',8,24,16,3);R('ink',14,6,6,3);R('pale',10,10,12,2);R('dark',12,17,8,4);R('clay',15,18,2,1);R('ink',25,12,4,9);R('light',26,14,1,5);if(id==='kettle'){R('cream',3,12,5,4);R('cream',5,16,3,3);}
 }else if(/sunscreen|repellent|sauce|spice|medicine|snacks|noodles/.test(id)){R(id==='repellent'?'blue':id==='noodles'?'clay':'dark',11,5,10,4);R(/sauce|spice/.test(id)?'rust':id==='repellent'?'light':id==='snacks'?'clay':'cream',8,10,16,17);R('light',9,11,2,14);R('pale',12,15,9,7);R('clay',14,17,5,2);R('dark',9,25,14,2);
 }else if(id==='lens'){R('ink',10,5,13,23);R('dark',8,7,17,5);R('olive',10,13,13,12);R('sage',11,14,2,9);R('cream',10,18,13,2);
 }else if(/tripod|umbrella|line/.test(id)){R('dark',15,4,3,21);R('cream',13,6,5,14);R('dark',10,23,3,5);R('dark',21,23,3,5);R('dark',13,20,3,5);R('dark',18,20,3,5);
 }else if(/charger|adapter|strip/.test(id)){R('dark',7,6,2,4);R('dark',12,6,2,4);R('cream',5,10,12,10);R('light',6,18,10,2);R('ink',10,20,1,6);R('ink',11,26,13,1);R('ink',24,19,1,7);R('clay',22,16,5,4);
 }else if(/compass|lock|tape|stone/.test(id)){R('dark',8,9,17,16);R('light',10,7,13,20);R('cream',8,11,17,12);R('dark',15,11,2,11);R('clay',13,14,6,2);R('pale',10,10,3,3);
 }else{R('dark',5,11,23,15);R('cream',6,10,21,14);R('clay',6,11,21,3);R('pale',8,15,2,7);R('sage',9,7,14,3);R('dark',11,5,10,3);R('cream',12,6,8,2);R('dark',16,13,2,3);}
 softenItemContour(c);
 // Separate the object from the recessed slot with a short lower contact shadow.
 c.globalCompositeOperation='destination-over';R('#56665055',9,28,17,2);c.globalCompositeOperation='source-over';
}

function softenItemContour(c){
 const pixels=c.getImageData(0,0,32,32),src=new Uint8ClampedArray(pixels.data),out=pixels.data;
 const dark=new Set([P.ink,P.deep,P.dark].map(h=>h.slice(1).match(/../g).map(v=>parseInt(v,16)).join(',')));
 const index=(x,y)=>(y*32+x)*4;
 const visible=(x,y)=>x>=0&&x<32&&y>=0&&y<32&&src[index(x,y)+3]>0;
 for(let y=0;y<32;y++)for(let x=0;x<32;x++){
  const k=index(x,y);if(!src[k+3]||!dark.has(Array.from(src.slice(k,k+3)).join(',')))continue;
  if([[x-1,y],[x+1,y],[x,y-1],[x,y+1]].every(([u,v])=>visible(u,v)))continue;
  let pigment=null;
  // Find the adjacent material face, without changing enclosed graphic details.
  for(let radius=1;radius<=3&&!pigment;radius++)for(let dy=-radius;dy<=radius&&!pigment;dy++)for(let dx=-radius;dx<=radius;dx++){
   const u=x+dx,v=y+dy;if(!visible(u,v))continue;const a=index(u,v),rgb=Array.from(src.slice(a,a+3));
   if(!dark.has(rgb.join(','))){pigment=rgb;break;}
  }
  if(pigment){const shade=(!visible(x,y+1)||!visible(x+1,y)) ? .9 : 1;for(let j=0;j<3;j++)out[k+j]=Math.round(pigment[j]*shade);}
 }
 c.putImageData(pixels,0,0);
}
