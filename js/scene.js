// Integer scanline artwork. A shared twelve-colour ramp and selective ordered dithering.
export const P={ink:'#435644',shadow:'#788562',leaf:'#a1ad7c',light:'#c4c79a',paper:'#e4d7aa',warm:'#c6b681',clay:'#b98b78',water:'#99b9a3',deep:'#6f9584',sky:'#c0cbae',skin:'#d3af85',hair:'#666a4a',shirt:'#eee0b4'};
export const block=(c,k,x,y,w,h)=>{c.fillStyle=P[k]||k;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function setup(canvas,w=256,h=160){if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);return c;}
function shape(c,col,p){for(let y=Math.floor(Math.min(...p.map(a=>a[1])));y<Math.max(...p.map(a=>a[1]));y++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y))xs.push(Math.round(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)block(c,col,xs[i],y,xs[i+1]-xs[i],1);}}
function dither(c,col,x,y,w,h,density=.3){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(B[(yy%4)*4+xx%4]<density*16)block(c,col,xx,yy,1,1);}
export function grain(c,x,y,w,h,col='light',density=55){for(let yy=y;yy<y+h;yy+=7)for(let xx=x+(yy%3)*3;xx<x+w-5;xx+=17){block(c,col,xx,yy,4,1);if((xx+yy)%3===0)block(c,col,xx+2,yy+1,2,1);}}
function line(c,col,x,y,xx,yy){const steps=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let i=0;i<=steps;i++)block(c,col,x+(xx-x)*i/steps,y+(yy-y)*i/steps,1,1);}
function iso(c,x,y,w,d,h,col){const top=[[x,y],[x+w,y+w/2],[x+w-d,y+(w+d)/2],[x-d,y+d/2]];shape(c,'shadow',[top[2],top[3],[top[3][0],top[3][1]+h],[top[2][0],top[2][1]+h]]);shape(c,col,[top[1],top[2],[top[2][0],top[2][1]+h],[top[1][0],top[1][1]+h]]);shape(c,col,top);line(c,'#e8dcad',x,y,x+w,y+w/2);}
function tree(c,x,y,s=1,palm=false){c.save();c.translate(x,y);c.scale(s,s);shape(c,'shadow',[[0,0],[4,0],[3,33],[-1,33]]);block(c,'warm',1,3,1,29);if(palm){for(const [dx,dy]of [[-25,8],[-22,-8],[-10,-17],[9,-16],[24,-8],[28,8]]){shape(c,'shadow',[[1,0],[dx,dy],[dx+3,dy+5],[4,3]]);shape(c,'leaf',[[2,0],[dx,dy],[dx+3,dy+2]]);}}else{shape(c,'shadow',[[1,14],[-13,-3],[-9,-3],[3,10],[15,-7],[18,-6],[3,18]]);shape(c,'shadow',[[-29,0],[-26,-6],[-15,-8],[-10,-13],[11,-14],[17,-9],[26,-8],[32,-1],[28,4],[-20,4]]);shape(c,'leaf',[[-25,-4],[-17,-7],[-10,-11],[11,-11],[18,-7],[27,-5],[24,0],[-19,0]]);block(c,'light',-13,-10,20,2);dither(c,'shadow',-18,-3,36,4,.35);}c.restore();}
function cloud(c,x,y){block(c,'paper',x,y,29,2);block(c,'shirt',x+6,y-2,16,2);block(c,'light',x+10,y+2,23,1);}
export function person(c,x,y,outfit={},frame=0,s=1){c.save();c.translate(x,y);c.scale(s,s);block(c,'shadow',-3,28,24,2);shape(c,'hair',[[3,1],[6,-1],[13,0],[16,4],[16,18],[13,19],[12,8],[5,8],[4,18],[1,17],[1,5]]);block(c,'skin',5,5,8,9);block(c,'warm',5,11,2,3);block(c,'ink',11,7,1,2);block(c,'skin',7,14,3,2);const top=outfit.top==='linen'?'water':outfit.top==='stripe'?'clay':'shirt';shape(c,top,[[4,15],[12,15],[15,19],[14,24],[3,24],[1,19]]);block(c,'light',4,15,2,8);if(outfit.top==='stripe')for(let y=18;y<24;y+=3)block(c,'paper',5,y,8,1);if(outfit.outer){block(c,outfit.outer==='coat'?'clay':'leaf',2,16,4,9);block(c,'shadow',11,16,4,9);}block(c,'skin',1,22,3,4);block(c,'skin',14,22,3,4);block(c,'shadow',4,24,5,4);block(c,'hair',10,24,4,4);block(c,outfit.shoes==='boots'?'ink':'paper',3,28+frame%2,6,2);block(c,'warm',10,28-frame%2,6,2);if(outfit.hat){block(c,'warm',-1,3,20,2);block(c,'paper',4,-2,11,5);block(c,'clay',4,2,11,1);}if(outfit.goggles){block(c,'deep',4,7,10,3);block(c,'water',5,7,3,1);block(c,'water',10,7,3,1);}c.restore();}
function caseArt(c,x,y,open=false){block(c,'shadow',x-1,y+2,25,19);block(c,'warm',x,y,23,18);block(c,'paper',x+2,y+1,18,2);block(c,'clay',x+5,y+3,2,15);block(c,'shadow',x+17,y+3,2,15);block(c,'ink',x+8,y-3,9,3);block(c,'paper',x+10,y+7,6,5);if(open){block(c,'shadow',x-22,y,21,18);block(c,'leaf',x-20,y+2,17,13);block(c,'shirt',x-18,y+4,12,8);}}
function vehicle(c,x,y,bus=false){block(c,'ink',x+4,y+20,9,8);block(c,'ink',x+43,y+20,9,8);block(c,'shadow',x,y+8,58,17);block(c,'leaf',x+1,y+6,56,13);block(c,'light',x+7,y-5,40,13);block(c,'deep',x+10,y-3,15,10);block(c,'water',x+28,y-3,16,10);block(c,'paper',x+3,y+12,6,3);block(c,'warm',x+50,y+12,5,3);block(c,'light',x+12,y+9,24,2);if(bus){block(c,'leaf',x,y-12,58,32);for(let i=0;i<5;i++)block(c,'water',x+4+i*10,y-9,8,12);block(c,'paper',x,y-13,57,2);}}
function base(c,frame,sea=false){block(c,'sky',0,0,256,160);dither(c,'light',0,52,256,24,.2);cloud(c,22+frame,22);cloud(c,173-frame,35);block(c,'paper',219,18,13,12);shape(c,'light',[[0,80],[27,65],[53,67],[79,57],[113,76],[151,62],[180,74],[216,60],[256,72],[256,111],[0,111]]);shape(c,'leaf',[[0,94],[39,86],[77,94],[126,82],[172,95],[213,84],[256,94],[256,116],[0,116]]);block(c,sea?'water':'warm',0,104,256,56);dither(c,sea?'deep':'leaf',0,105,256,12,.2);grain(c,0,119,256,41,sea?'paper':'light');}
function paintScene(canvas,type='savanna',outfit={},frame=0){const indoor=['room','home','route'].includes(type),c=setup(canvas,256,indoor?220:160);
 if(indoor){
  block(c,'light',0,0,256,220);
  shape(c,'paper',[[12,43],[132,3],[132,76],[12,121]]);
  shape(c,'warm',[[132,3],[246,44],[246,120],[132,76]]);
  shape(c,'shirt',[[12,40],[132,0],[246,41],[246,45],[132,5],[12,45]]);
  shape(c,'warm',[[12,121],[132,76],[246,120],[128,213]]);
  shape(c,'shadow',[[12,121],[128,210],[246,117],[246,123],[128,218],[12,126]]);
  for(let i=1;i<8;i++){
   const t=i/8;line(c,'#b6a87d',12+(132-12)*t,121+(76-121)*t,128+(246-128)*t,213+(120-213)*t);
   line(c,'#b6a87d',132+(246-132)*t,76+(120-76)*t,12+(128-12)*t,121+(213-121)*t);
  }
  // The open window follows the wall perspective; its planes catch the daylight.
  shape(c,'shadow',[[155,28],[223,52],[223,101],[155,78]]);
  shape(c,'shirt',[[157,29],[221,53],[221,98],[157,76]]);
  shape(c,'water',[[162,35],[216,55],[216,93],[162,73]]);
  shape(c,'leaf',[[162,65],[180,57],[191,74],[205,65],[216,75],[216,93],[162,73]]);
  shape(c,'paper',[[186,43],[189,44],[189,83],[186,82]]);
  shape(c,'paper',[[162,53],[216,74],[216,77],[162,56]]);
  shape(c,'shirt',[[149,26],[156,29],[156,84],[149,82]]);
  shape(c,'paper',[[224,52],[231,55],[231,106],[224,104]]);
  block(c,'paper',201+frame,62,7,2);
  // A small atlas and a shelf on the near wall.
  shape(c,'shadow',[[35,55],[80,40],[80,77],[35,92]]);
  shape(c,'shirt',[[38,57],[77,44],[77,75],[38,88]]);
  shape(c,'deep',[[41,60],[74,49],[74,72],[41,83]]);
  shape(c,'light',[[45,62],[52,57],[57,61],[65,54],[69,61],[63,70],[50,75]]);
  line(c,'#c3c393',55,55,55,76);
  iso(c,89,55,34,10,4,'clay');
  for(let i=0;i<5;i++){block(c,i%2?'leaf':'shirt',94+i*4,44+i,3,12);block(c,'warm',95+i*4,46+i,1,2);}
  // Layered cloth, short structural shadows and distinct lit furniture surfaces.
  iso(c,61,112,66,34,14,'light');
  shape(c,'shirt',[[61,111],[84,123],[50,140],[27,129]]);
  shape(c,'leaf',[[85,124],[126,145],[93,163],[51,140]]);
  shape(c,'shadow',[[51,140],[93,163],[93,174],[51,151]]);
  for(let i=0;i<4;i++)line(c,'#b9c08c',62+i*9,139+i*4,95+i*6,156+i*3);
  iso(c,144,99,41,19,4,'clay');
  block(c,'shadow',128,113,3,25);block(c,'shadow',179,119,3,23);
  iso(c,147,101,15,9,2,'shirt');line(c,'#a7aa80',146,106,155,110);
  iso(c,176,101,8,6,9,'warm');tree(c,177,96,.32,true);
  iso(c,207,107,21,14,44,'leaf');
  line(c,'#c4c79a',210,119,210,158);block(c,'warm',211,138,2,3);
  shape(c,'light',[[106,155],[132,142],[176,165],[148,184]]);
  for(let i=0;i<4;i++)line(c,'#929c72',111+i*8,155+i*4,133+i*8,145+i*4);
  person(c,123,145,outfit,frame,1.2);caseArt(c,157,177,type==='home');
  iso(c,24,148,12,10,13,'clay');tree(c,27,143,.65,true);
  return;
 }
 if(type==='airport'){base(c,frame);block(c,'paper',0,0,256,14);block(c,'shirt',0,98,256,62);block(c,'warm',0,125,256,35);for(let x=8;x<256;x+=60)block(c,'shadow',x,14,3,89);block(c,'shadow',0,100,256,3);block(c,'light',0,144,256,1);shape(c,'shirt',[[129+frame,56],[145+frame,54],[151+frame,42],[155+frame,42],[154+frame,54],[187+frame,56],[174+frame,60],[157+frame,60],[145+frame,69],[140+frame,69],[145+frame,59],[129+frame,59]]);block(c,'shadow',18,112,66,8);block(c,'leaf',18,106,66,7);block(c,'ink',23,120,3,14);block(c,'ink',76,120,3,14);person(c,117,105,outfit,frame);caseArt(c,155,139);return;}
 const sea=['island','river','cape','busstop','falls'].includes(type);base(c,frame,sea);
 if(type==='island'){for(let y=107;y<140;y+=9){block(c,'paper',40+frame*2+(y%3)*20,y,42,1);block(c,'light',169-frame,y+3,33,1);}shape(c,'paper',[[0,131],[36,137],[83,132],[126,140],[173,145],[214,136],[256,140],[256,160],[0,160]]);dither(c,'warm',0,148,256,12,.25);tree(c,35,76,1.4,true);tree(c,7,95,.8,true);shape(c,'shadow',[[190,135],[198,117],[209,111],[225,117],[231,138]]);shape(c,'light',[[198,117],[209,111],[222,119],[218,133],[194,133]]);block(c,'paper',190,139,44,2);}
 if(['savanna','camp'].includes(type)){shape(c,'paper',[[44,160],[109,110],[125,110],[160,160]]);tree(c,46,76,1.25);tree(c,222,88,.72);tree(c,174,96,.4);if(type==='camp'){block(c,'deep',0,0,256,14);shape(c,'shadow',[[173,103],[145,143],[201,143]]);shape(c,'warm',[[173,103],[197,103],[226,143],[201,143]]);shape(c,'ink',[[173,116],[158,142],[188,142]]);block(c,'clay',216,146,3,6);block(c,frame%2?'paper':'warm',214,142,7,6);}else{vehicle(c,57,127);for(const x of [178,209]){block(c,'clay',x,106,16,8);block(c,'warm',x+12,87,4,24);block(c,'warm',x+10,85,11,5);block(c,'ink',x+18,86,1,1);for(const dx of [2,6,12,15])block(c,'shadow',x+dx,113,1,14);for(let i=0;i<4;i++)block(c,'shadow',x+12,92+i*4,2,2);}}}
 if(type==='desert'){shape(c,'clay',[[0,137],[73,63],[153,142]]);shape(c,'warm',[[73,63],[93,108],[153,142],[91,124]]);shape(c,'paper',[[83,160],[196,86],[256,127],[256,160]]);dither(c,'clay',0,141,90,19,.2);tree(c,214,105,.55);}
 if(type==='falls'){block(c,'shadow',0,85,256,59);shape(c,'leaf',[[0,89],[65,82],[91,92],[170,87],[201,79],[256,86],[256,101],[0,104]]);block(c,'water',77,90,109,53);for(let i=0;i<22;i++){block(c,i%3?'paper':'shirt',79+i*5,92+(i*7+frame*3)%12,2,29+(i%3)*4);block(c,'light',80+i*5,126+(i+frame)%8,3,10);}block(c,'water',0,144,256,16);dither(c,'paper',65,137,132,16,.35);tree(c,21,91,.7);}
 if(type==='river'){shape(c,'leaf',[[0,118],[31,110],[72,123],[81,143],[50,160],[0,160]]);tree(c,25,81,.8);block(c,'ink',145+frame,129,34,3);block(c,'warm',150+frame,132,25,2);for(let y=110;y<155;y+=11)block(c,'paper',98+frame,y,29,1);}
 if(type==='coach'){block(c,'shadow',0,0,256,160);block(c,'water',10,17,236,55);shape(c,'leaf',[[10,58],[50,44],[82,60],[131,41],[172,59],[219,42],[246,54],[246,73],[10,73]]);for(let x=16;x<256;x+=60){block(c,'ink',x,83,43,70);block(c,'leaf',x+3,86,36,60);block(c,'light',x+6,88,27,5);dither(c,'shadow',x+4,119,34,24,.25);}block(c,'paper',10+frame*7,27,49,1);}
 if(['city','cape'].includes(type)){for(let x=8;x<111;x+=25){const y=77+x%11;block(c,'shadow',x,y,23,52);block(c,x%3?'paper':'clay',x+1,y+2,20,49);block(c,'warm',x,y,23,3);for(let yy=y+10;yy<y+40;yy+=14){block(c,'deep',x+4,yy,5,8);block(c,'deep',x+13,yy,5,8);}block(c,'ink',x+8,117,6,12);}if(type==='cape')shape(c,'shadow',[[125,94],[145,64],[190,64],[215,94]]);}
 if(['road','city','cape','busstop'].includes(type)){block(c,'shadow',0,138,256,22);block(c,'light',0,137,256,2);for(let x=0;x<256;x+=34)block(c,'paper',x+frame*2,151,13,1);}
 if(type==='road')vehicle(c,68+frame*2,125);if(type==='busstop'){block(c,'ink',43,87,2,48);block(c,'paper',37,80,15,13);block(c,'deep',40,83,9,5);block(c,'warm',29,127,42,3);block(c,'shadow',33,130,2,7);block(c,'shadow',64,130,2,7);}
 person(c,120,126,outfit,frame);
}
const sceneBuffers=new WeakMap();
export function scene(canvas,type='savanna',outfit={},frame=0){
 let buffer=sceneBuffers.get(canvas);if(!buffer){buffer=document.createElement('canvas');sceneBuffers.set(canvas,buffer);}paintScene(buffer,type,outfit,frame);
 const c=setup(canvas,256,220),indoor=['room','home','route'].includes(type);
 if(indoor){c.drawImage(buffer,0,0);return;}
 block(c,type==='coach'?'shadow':'sky',0,0,256,220);
 if(type!=='coach'){cloud(c,47+frame,14);cloud(c,183-frame,27);}
 c.drawImage(buffer,0,40);
 const shore=['island','river','cape','busstop','falls'].includes(type);
 block(c,shore?'paper':type==='coach'?'shadow':type==='desert'?'warm':'leaf',0,200,256,20);
 if(type!=='coach')for(let i=0;i<18;i++){const x=(i*43)%253,y=201+(i*7)%17;block(c,shore?'warm':'shadow',x,y,3,1);if(!shore){block(c,'warm',x+1,y-3,1,3);block(c,'shadow',x+2,y-1,2,1);}}
}
export function avatar(canvas,outfit={}){const c=setup(canvas,64,80);block(c,'paper',0,0,64,80);dither(c,'warm',0,59,64,21,.2);person(c,15,12,outfit,0,2);}
export function selfie(canvas){const c=setup(canvas,128,192);block(c,'sky',0,0,128,192);cloud(c,15,32);block(c,'warm',0,88,128,104);tree(c,21,81,.7);person(c,31,69,{hat:true},0,4);}
export function paintSurface(canvas){const c=setup(canvas,Math.ceil(innerWidth/3),Math.ceil(innerHeight/3));block(c,'shadow',0,0,canvas.width,canvas.height);const stage=Math.max(0,Math.floor((canvas.width-Math.min(innerWidth,560)/3)/2));block(c,'paper',stage,0,Math.min(innerWidth,560)/3,canvas.height);}
