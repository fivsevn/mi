// Integer scanline artwork. A shared twelve-colour ramp and selective ordered dithering.
export const P={ink:'#435644',shadow:'#788562',leaf:'#a1ad7c',light:'#c4c79a',paper:'#e4d7aa',warm:'#c6b681',clay:'#b98b78',water:'#99b9a3',deep:'#6f9584',sky:'#c0cbae',skin:'#d3af85',hair:'#666a4a',shirt:'#eee0b4'};
export const block=(c,k,x,y,w,h)=>{c.fillStyle=P[k]||k;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
const B=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
function setup(canvas,w=256,h=160){if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);return c;}
function shape(c,col,p){for(let y=Math.floor(Math.min(...p.map(a=>a[1])));y<Math.max(...p.map(a=>a[1]));y++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y))xs.push(Math.round(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)block(c,col,xs[i],y,xs[i+1]-xs[i],1);}}
function dither(c,col,x,y,w,h,density=.3){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if(B[(yy%4)*4+xx%4]<density*16)block(c,col,xx,yy,1,1);}
export function grain(c,x,y,w,h,col='light',density=55){for(let yy=y;yy<y+h;yy+=7)for(let xx=x+(yy%3)*3;xx<x+w-5;xx+=17){block(c,col,xx,yy,4,1);if((xx+yy)%3===0)block(c,col,xx+2,yy+1,2,1);}}
function line(c,col,x,y,xx,yy){const steps=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let i=0;i<=steps;i++)block(c,col,x+(xx-x)*i/steps,y+(yy-y)*i/steps,1,1);}
// Short connected clusters follow each material's silhouette, rather than covering a rectangle.
function material(c,col,polygon,gap=7){
 const hit=(x,y)=>{let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;};
 const minY=Math.min(...polygon.map(p=>p[1])),maxY=Math.max(...polygon.map(p=>p[1]));
 for(let y=minY+3;y<maxY;y+=gap)for(let x=3+(y%11);x<256;x+=gap+5){if(hit(x,y)&&hit(x+4,y)){block(c,col,x,y,3,1);if(hit(x+2,y+1))block(c,col,x+2,y+1,2,1);}}
}
function iso(c,x,y,w,d,h,col){const top=[[x,y],[x+w,y+w/2],[x+w-d,y+(w+d)/2],[x-d,y+d/2]];shape(c,'shadow',[top[2],top[3],[top[3][0],top[3][1]+h],[top[2][0],top[2][1]+h]]);shape(c,col,[top[1],top[2],[top[2][0],top[2][1]+h],[top[1][0],top[1][1]+h]]);shape(c,col,top);line(c,'#e8dcad',x,y,x+w,y+w/2);}
function tree(c,x,y,s=1,palm=false){
 c.save();c.translate(Math.round(x),Math.round(y));c.scale(s,s);
 shape(c,'shadow',[[0,-2],[4,-2],[3,33],[-2,33]]);line(c,'warm',1,4,0,31);line(c,'ink',3,17,2,31);
 if(palm){for(const [dx,dy]of [[-25,8],[-22,-8],[-10,-17],[9,-16],[24,-8],[28,8]]){shape(c,'shadow',[[1,0],[dx,dy],[dx+3,dy+5],[4,3]]);line(c,'leaf',2,0,dx,dy);for(let i=5;i<23;i+=4){const t=i/25;line(c,'leaf',dx*t,dy*t,dx*t-3,dy*t+5);}}}
 else{
  for(const [dx,dy]of [[-20,-8],[-10,-13],[18,-10],[25,-4]]){line(c,'shadow',2,16,dx,dy);line(c,'warm',1,14,dx,dy+1);}
  const crowns=[[-25,-5,12,5],[-17,-9,15,6],[-6,-12,17,7],[9,-9,17,7],[22,-4,9,5]];
  for(const [xx,yy,w,h]of crowns){shape(c,'shadow',[[xx-2,yy+2],[xx+2,yy-2],[xx+w-3,yy-3],[xx+w+2,yy+1],[xx+w,yy+h],[xx,yy+h+1]]);block(c,'leaf',xx,yy,w,h-1);block(c,'light',xx+2,yy-1,w-5,1);for(let i=0;i<w;i+=4){block(c,'#b2b98b',xx+i,yy+1+(i%3),3,1);block(c,'shadow',xx+i+1,yy+h-2,2,2);}}
 }c.restore();
}
function cloud(c,x,y){block(c,'paper',x,y,29,2);block(c,'shirt',x+6,y-2,16,2);block(c,'light',x+10,y+2,23,1);}
export function person(c,x,y,outfit={},frame=0,s=1){c.save();c.translate(x,y);c.scale(s,s);block(c,'shadow',-3,28,24,2);shape(c,'hair',[[3,1],[6,-1],[13,0],[16,4],[16,18],[13,19],[12,8],[5,8],[4,18],[1,17],[1,5]]);block(c,'skin',5,5,8,9);block(c,'warm',5,11,2,3);block(c,'ink',11,7,1,2);block(c,'skin',7,14,3,2);const top=outfit.top==='linen'?'water':outfit.top==='stripe'?'clay':'shirt';shape(c,top,[[4,15],[12,15],[15,19],[14,24],[3,24],[1,19]]);block(c,'light',4,15,2,8);if(outfit.top==='stripe')for(let y=18;y<24;y+=3)block(c,'paper',5,y,8,1);if(outfit.outer){block(c,outfit.outer==='coat'?'clay':'leaf',2,16,4,9);block(c,'shadow',11,16,4,9);}block(c,'skin',1,22,3,4);block(c,'skin',14,22,3,4);block(c,'shadow',4,24,5,4);block(c,'hair',10,24,4,4);block(c,outfit.shoes==='boots'?'ink':'paper',3,28+frame%2,6,2);block(c,'warm',10,28-frame%2,6,2);if(outfit.hat){block(c,'warm',-1,3,20,2);block(c,'paper',4,-2,11,5);block(c,'clay',4,2,11,1);}if(outfit.goggles){block(c,'deep',4,7,10,3);block(c,'water',5,7,3,1);block(c,'water',10,7,3,1);}c.restore();}
function caseArt(c,x,y,open=false){block(c,'shadow',x-1,y+2,25,19);block(c,'warm',x,y,23,18);block(c,'paper',x+2,y+1,18,2);block(c,'clay',x+5,y+3,2,15);block(c,'shadow',x+17,y+3,2,15);block(c,'ink',x+8,y-3,9,3);block(c,'paper',x+10,y+7,6,5);if(open){block(c,'shadow',x-22,y,21,18);block(c,'leaf',x-20,y+2,17,13);block(c,'shirt',x-18,y+4,12,8);}}
function vehicle(c,x,y,bus=false){
 c.save();c.translate(x,y);
 shape(c,'shadow',[[1,27],[54,27],[59,30],[3,31]]);
 for(const xx of [9,45]){shape(c,'ink',[[xx-5,19],[xx-3,17],[xx+4,17],[xx+6,21],[xx+5,28],[xx-3,29],[xx-5,26]]);block(c,'shadow',xx-2,20,5,5);block(c,'light',xx,21,2,2);}
 shape(c,'shadow',[[0,8],[6,4],[10,-7],[41,-7],[47,4],[58,9],[59,23],[0,23]]);
 shape(c,'leaf',[[1,10],[7,6],[47,6],[57,10],[57,19],[2,19]]);
 shape(c,'light',[[10,-7],[39,-7],[46,5],[6,5]]);block(c,'paper',12,-7,26,2);
 shape(c,'deep',[[12,-4],[24,-4],[24,3],[9,3]]);shape(c,'water',[[27,-4],[37,-4],[42,3],[27,3]]);line(c,'light',29,-3,36,2);
 block(c,'warm',2,11,8,4);block(c,'paper',3,11,5,2);block(c,'warm',49,11,7,4);block(c,'shirt',50,11,4,2);
 block(c,'shadow',16,11,29,6);for(let xx=18;xx<44;xx+=4)block(c,'light',xx,12,1,3);block(c,'paper',25,19,12,3);
 block(c,'ink',0,23,59,2);block(c,'light',1,22,57,1);line(c,'light',4,7,47,7);block(c,'shadow',26,6,1,5);
 if(bus){block(c,'leaf',0,-12,58,32);block(c,'paper',1,-12,56,2);for(let i=0;i<5;i++){block(c,'deep',4+i*10,-7,8,12);block(c,'water',5+i*10,-6,6,9);block(c,'light',6+i*10,-5,3,1);}block(c,'warm',2,10,54,2);block(c,'shadow',45,7,10,13);line(c,'light',47,8,47,18);}
 c.restore();
}
function giraffe(c,x,y,frame=0){
 c.save();c.translate(x,y);shape(c,'shadow',[[-2,22],[21,22],[24,25],[-4,25]]);
 shape(c,'warm',[[0,2],[5,0],[16,1],[19,-17],[22,-19],[25,-18],[25,-13],[22,-12],[20,8],[4,9],[0,6]]);
 shape(c,'paper',[[1,2],[14,2],[17,4],[5,5],[1,4]]);line(c,'light',20,-15,18,3);
 for(const [xx,yy]of [[3,4],[8,2],[12,6],[18,-5],[20,-11]]){block(c,'clay',xx,yy,2,2);block(c,'shadow',xx+1,yy+1,1,1);}
 for(const [i,xx]of [3,6,15,18].entries()){line(c,'shadow',xx,8,xx+(i%2?frame:0),22);block(c,'ink',xx,22,2,1);}
 line(c,'shadow',1,3,-3,12);block(c,'ink',-4,11,2,3);line(c,'shadow',22,-18,22,-22);block(c,'warm',21,-22,2,1);block(c,'ink',24,-17,1,1);c.restore();
}
function base(c,frame,sea=false){
 block(c,'sky',0,0,256,160);cloud(c,22+frame,22);cloud(c,173-frame,35);block(c,'paper',219,18,13,12);
 shape(c,'light',[[0,80],[27,65],[53,67],[79,57],[113,76],[151,62],[180,74],[216,60],[256,72],[256,111],[0,111]]);
 shape(c,'leaf',[[0,94],[39,86],[77,94],[126,82],[172,95],[213,84],[256,94],[256,116],[0,116]]);
 for(let i=0;i<35;i++){const x=(i*31)%256,y=91+(i*7)%15;block(c,i%3?'#b2b88b':'shadow',x,y,3+i%4,1);}
 block(c,sea?'water':'warm',0,104,256,56);
 for(let i=0;i<115;i++){const x=(i*53+i*i*3)%253,y=108+(i*17)%51;
  if(sea){block(c,i%4?'light':'deep',x+frame%2,y,3+i%8,1);if(i%7===0)block(c,'paper',x+2,y-1,3,1);}
  else{const col=i%5?'light':'shadow';block(c,col,x,y,2+i%3,1);if(i%3===0){line(c,'shadow',x+1,y,x,y-3);block(c,'paper',x-1,y-3,2,1);}}
 }
}
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
 if(type==='island'){for(let y=107;y<140;y+=9){block(c,'paper',40+frame*2+(y%3)*20,y,42,1);block(c,'light',169-frame,y+3,33,1);}shape(c,'paper',[[0,131],[36,137],[83,132],[126,140],[173,145],[214,136],[256,140],[256,160],[0,160]]);material(c,'warm',[[0,137],[83,137],[173,148],[256,140],[256,160],[0,160]],7);tree(c,35,76,1.4,true);tree(c,7,95,.8,true);shape(c,'shadow',[[190,135],[198,117],[209,111],[225,117],[231,138]]);shape(c,'light',[[198,117],[209,111],[222,119],[218,133],[194,133]]);material(c,'shadow',[[198,117],[209,111],[222,119],[218,133],[194,133]],5);line(c,'paper',201,118,207,115);block(c,'paper',190,139,44,2);}
 if(['savanna','camp'].includes(type)){shape(c,'paper',[[44,160],[109,110],[125,110],[160,160]]);tree(c,46,76,1.25);tree(c,222,88,.72);tree(c,174,96,.4);if(type==='camp'){block(c,'deep',0,0,256,14);shape(c,'shadow',[[173,103],[145,143],[201,143]]);shape(c,'warm',[[173,103],[197,103],[226,143],[201,143]]);shape(c,'ink',[[173,116],[158,142],[188,142]]);block(c,'clay',216,146,3,6);block(c,frame%2?'paper':'warm',214,142,7,6);}else{vehicle(c,57,127);for(const x of [178,209])giraffe(c,x,106,frame);}}
 if(type==='desert'){shape(c,'clay',[[0,137],[73,63],[153,142]]);shape(c,'warm',[[73,63],[93,108],[153,142],[91,124]]);shape(c,'paper',[[83,160],[196,86],[256,127],[256,160]]);material(c,'#c49a80',[[0,137],[73,63],[91,124],[153,142]],6);material(c,'light',[[83,160],[196,86],[256,127],[256,160]],8);for(let i=0;i<4;i++)line(c,'#ad8975',15+i*12,133-i*13,54+i*7,126-i*16);tree(c,214,105,.55);}
 if(type==='falls'){shape(c,'shadow',[[0,89],[34,85],[58,91],[81,87],[174,86],[199,82],[226,87],[256,84],[256,144],[0,144]]);material(c,'#8e9776',[[0,93],[256,93],[256,142],[0,142]],6);for(let x=5;x<256;x+=19){line(c,'ink',x,108,x+2,123);line(c,'light',x+3,113,x+7,113);}shape(c,'leaf',[[0,89],[65,82],[91,92],[170,87],[201,79],[256,86],[256,101],[0,104]]);block(c,'water',77,90,109,53);for(let i=0;i<22;i++){block(c,i%3?'paper':'shirt',79+i*5,92+(i*7+frame*3)%12,2,29+(i%3)*4);block(c,'light',80+i*5,126+(i+frame)%8,3,10);}block(c,'water',0,144,256,16);for(let i=0;i<38;i++){const x=69+(i*23)%125,y=136+(i*7+frame)%16;block(c,i%3?'light':'shirt',x,y,3+i%4,1);if(i%4===0)block(c,'paper',x+1,y-2,1,3);}tree(c,21,91,.7);}
 if(type==='river'){shape(c,'leaf',[[0,118],[31,110],[72,123],[81,143],[50,160],[0,160]]);tree(c,25,81,.8);block(c,'ink',145+frame,129,34,3);block(c,'warm',150+frame,132,25,2);for(let y=110;y<155;y+=11)block(c,'paper',98+frame,y,29,1);}
 if(type==='coach'){block(c,'shadow',0,0,256,160);block(c,'water',10,17,236,55);shape(c,'leaf',[[10,58],[50,44],[82,60],[131,41],[172,59],[219,42],[246,54],[246,73],[10,73]]);for(let x=16;x<256;x+=60){block(c,'ink',x,83,43,70);block(c,'leaf',x+3,86,36,60);block(c,'light',x+6,88,27,5);dither(c,'shadow',x+4,119,34,24,.25);}block(c,'paper',10+frame*7,27,49,1);}
 if(['city','cape'].includes(type)){for(let x=8;x<111;x+=25){const y=77+x%11;block(c,'shadow',x,y,23,52);block(c,x%3?'paper':'clay',x+1,y+2,20,49);block(c,'warm',x,y,23,3);for(let yy=y+10;yy<y+40;yy+=14){block(c,'deep',x+4,yy,5,8);block(c,'deep',x+13,yy,5,8);}block(c,'ink',x+8,117,6,12);block(c,'light',x+2,y+3,1,44);for(let yy=y+7;yy<y+44;yy+=9){block(c,'warm',x+2,yy,18,1);block(c,'light',x+4,yy+3,3,1);}block(c,'paper',x-1,y-1,25,2);}if(type==='cape')shape(c,'shadow',[[125,94],[145,64],[190,64],[215,94]]);}
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
export function selfie(canvas){
 const c=setup(canvas,192,288);block(c,'sky',0,0,192,288);cloud(c,22,36);cloud(c,139,58);
 shape(c,'light',[[0,104],[28,88],[65,99],[114,85],[155,98],[192,89],[192,137],[0,137]]);
 block(c,'warm',0,125,192,163);dither(c,'light',0,116,192,18,.28);grain(c,0,148,192,140,'paper');tree(c,28,126,.9);tree(c,158,115,.65);
 // A distant giraffe is drawn separately from the portrait silhouette.
 shape(c,'warm',[[146,156],[166,156],[169,128],[173,127],[175,133],[171,137],[169,163],[147,163]]);
 block(c,'shadow',148,163,2,17);block(c,'shadow',164,163,2,17);block(c,'clay',169,124,2,5);block(c,'ink',173,129,1,1);
 for(const [x,y]of [[151,158],[159,160],[167,151],[168,142],[169,134]])block(c,'clay',x,y,2,3);
 shape(c,'hair',[[65,131],[74,120],[104,121],[119,134],[124,185],[112,208],[64,202],[57,174]]);
 shape(c,'skin',[[72,138],[105,137],[112,150],[108,178],[98,189],[80,185],[69,170]]);
 shape(c,'warm',[[70,144],[77,143],[75,167],[86,183],[80,185],[69,170]]);
 block(c,'paper',80,147,18,2);block(c,'hair',78,155,6,2);block(c,'hair',99,154,5,2);block(c,'ink',82,157,2,2);block(c,'ink',100,156,2,2);
 block(c,'clay',93,166,3,2);block(c,'clay',87,176,12,2);block(c,'paper',89,175,8,1);block(c,'clay',77,167,5,2);
 shape(c,'skin',[[83,184],[98,184],[100,201],[85,205],[79,199]]);
 shape(c,'shirt',[[79,196],[85,202],[96,202],[104,194],[123,205],[139,250],[131,288],[49,288],[45,248],[60,207]]);
 shape(c,'light',[[60,207],[71,201],[64,237],[68,273],[59,288],[49,288],[45,248]]);
 shape(c,'warm',[[117,202],[123,205],[139,250],[131,288],[119,288],[124,249]]);
 shape(c,'skin',[[47,244],[59,246],[62,265],[51,282],[42,282],[39,273]]);shape(c,'skin',[[127,245],[139,249],[149,275],[145,288],[132,288],[131,271]]);
 line(c,'warm',79,199,87,210);line(c,'warm',104,198,96,211);block(c,'warm',89,217,1,47);for(let y=218;y<265;y+=12)block(c,'clay',92,y,1,2);
 shape(c,'warm',[[50,138],[56,131],[69,127],[73,112],[103,110],[112,123],[127,130],[134,137],[124,142],[65,146]]);
 shape(c,'paper',[[54,135],[71,131],[77,114],[101,113],[108,130],[126,135],[119,138],[64,141]]);
 shape(c,'clay',[[73,126],[107,125],[110,131],[71,133]]);line(c,'shirt',79,115,99,114);
 for(let x=61;x<126;x+=4){block(c,'light',x,136,2,1);block(c,'warm',x,139,1,1);}dither(c,'light',78,116,22,8,.22);
}
export function paintSurface(canvas){const c=setup(canvas,Math.ceil(innerWidth/3),Math.ceil(innerHeight/3));const background=getComputedStyle(document.documentElement).getPropertyValue('--page-background').trim()||'#8a9070';block(c,background,0,0,canvas.width,canvas.height);}
