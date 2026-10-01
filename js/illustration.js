// Shared pigments and hand placed pixel clusters for every scene and portrait.
const C={ink:'#586b57',deep:'#6d7d61',leaf:'#899875',moss:'#aab18b',paper:'#cfc69d',light:'#ded0a5',sand:'#c1b689',clay:'#ba9f81',skin:'#d1b594',shade:'#b59b7d',water:'#89a798',wave:'#a4b9a0',sky:'#b5bea0',hair:'#69705a',white:'#ddd6b2'};
const rect=(c,col,x,y,w,h)=>{c.fillStyle=C[col]||col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));};
function poly(c,col,p){c.fillStyle=C[col]||col;c.beginPath();p.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();
 const xs=p.map(a=>a[0]),ys=p.map(a=>a[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
 if(w<35||h<20)return;c.save();c.clip();
 const shadow={moss:'leaf',leaf:'deep',paper:'sand',sand:'clay',clay:'sand',deep:'leaf'}[col]||'moss';
 for(let yy=y+8;yy<y+h;yy+=7)for(let xx=x+3;xx<x+w;xx+=11){const n=(Math.floor(xx/11)*7+Math.floor(yy/7)*13)%9;if(n<3){rect(c,shadow,xx+(n%2)*2,yy,4+n,1);rect(c,shadow,xx+2,yy+1,2+n,1);}}
 c.restore();}
function setup(canvas,w=288,h=180){canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;return c;}
function random(seed=47){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
function surface(c,col,x,y,w,h,kind='grain'){
 rect(c,col,x,y,w,h);const r=random(x*19+y*13+w+79);
 for(let i=0;i<w*h/65;i++){const xx=x+Math.floor(r()*w),yy=y+Math.floor(r()*h);c.globalAlpha=.22;rect(c,i%3?'deep':'light',xx,yy,kind==='water'?4+Math.floor(r()*7):1+Math.floor(r()*3),1);}
 c.globalAlpha=1;
}
function cloud(c,x,y){for(const [a,b,w,h]of [[0,4,24,3],[4,1,13,4],[10,0,7,2],[19,5,9,2]])rect(c,'white',x+a,y+b,w,h);}
function tree(c,x,y,s=1,palm=false){c.save();c.translate(x,y);c.scale(s,s);rect(c,'ink',-1,-3,3,30);rect(c,'sand',0,0,1,27);
 if(palm){for(const [dx,dy]of [[-19,0],[-14,-8],[0,-13],[15,-9],[20,2]]){poly(c,'deep',[[0,0],[dx,dy],[dx+3,dy+5],[2,3]]);rect(c,'leaf',dx,dy,5,2);}}
 else {poly(c,'ink',[[0,12],[-10,-2],[-7,-3],[1,6],[12,-9],[14,-8],[2,16]]);surface(c,'deep',-22,-11,46,7);surface(c,'leaf',-14,-16,31,6);rect(c,'moss',-10,-16,17,2);}
 c.restore();}
function shrub(c,x,y){rect(c,'deep',x,y,13,4);rect(c,'leaf',x+2,y-3,8,4);rect(c,'moss',x+4,y-3,4,1);}
export function person(c,x,y,s=1,outfit={},step=0){const target=c,sprite=document.createElement('canvas');sprite.width=30;sprite.height=42;c=sprite.getContext('2d');c.save();c.translate(4,3);
 rect(c,'deep',-4,35,26,2);rect(c,'hair',3,0,12,3);rect(c,'hair',1,3,16,12);rect(c,'deep',1,6,3,13);rect(c,'hair',14,5,4,15);rect(c,'leaf',3,2,5,1);
 rect(c,'skin',5,5,9,11);rect(c,'shade',5,12,3,4);rect(c,'light',7,6,5,2);rect(c,'ink',11,8,1,2);rect(c,'clay',10,12,3,1);rect(c,'skin',7,15,5,3);
 const top=outfit.top==='stripe'?'clay':outfit.top==='linen'?'water':'white';rect(c,top,3,18,14,11);rect(c,'paper',3,18,3,10);rect(c,'light',7,18,8,2);rect(c,'sand',5,27,10,2);if(outfit.top==='stripe')for(let yy=21;yy<28;yy+=3)rect(c,'sand',6,yy,9,1);
 if(outfit.outer){rect(c,outfit.outer==='coat'?'clay':'deep',2,18,4,12);rect(c,outfit.outer==='coat'?'sand':'leaf',14,18,4,12);rect(c,'moss',14,19,2,7);}
 rect(c,'skin',1,26,3,5);rect(c,'shade',16,27,3,4);rect(c,'deep',5,29,5,6+(step%2));rect(c,'ink',11,29,5,6-(step%2));rect(c,outfit.shoes==='boots'?'ink':'sand',4,34+(step%2),6,2);rect(c,outfit.shoes==='boots'?'deep':'light',11,34-(step%2),6,2);
 rect(c,'sand',15,20,3,2);rect(c,'sand',14,22,2,7);
 if(outfit.hat){rect(c,'sand',0,3,20,3);rect(c,'paper',4,-2,11,5);rect(c,'light',5,-2,7,1);rect(c,'deep',4,2,11,1);}
 if(outfit.goggles){rect(c,'ink',4,8,12,3);rect(c,'water',5,8,4,2);rect(c,'water',11,8,4,2);}c.restore();target.imageSmoothingEnabled=false;target.drawImage(sprite,Math.round(x-4*s),Math.round(y-3*s),Math.round(30*s),Math.round(42*s));}
function caseArt(c,x,y,open=false){rect(c,'ink',x,y,26,24);surface(c,'sand',x+2,y+2,22,19);rect(c,'paper',x+5,y+3,2,17);rect(c,'deep',x+18,y+3,2,17);rect(c,'light',x+9,y+8,8,6);rect(c,'ink',x+7,y-4,12,2);rect(c,'ink',x+7,y-2,2,3);rect(c,'ink',x+17,y-2,2,3);if(open){rect(c,'deep',x-23,y+2,23,21);surface(c,'white',x-20,y+5,17,13);rect(c,'leaf',x-18,y+7,9,6);}}
function giraffe(c,x,y){rect(c,'sand',x,y,17,8);rect(c,'sand',x+13,y-21,4,24);rect(c,'sand',x+11,y-24,10,4);rect(c,'ink',x+18,y-23,1,1);for(let i=0;i<3;i++)rect(c,'clay',x+14,y-17+i*6,2,3);for(let i=0;i<4;i++)rect(c,'deep',x+i*5,y+7,1,13);rect(c,'clay',x+4,y+2,3,3);rect(c,'clay',x+9,y+4,2,2);}
function hills(c,sea=false){poly(c,'moss',[[0,83],[34,61],[60,69],[99,49],[132,68],[159,56],[197,77],[231,64],[288,82],[288,112],[0,112]]);poly(c,'leaf',[[0,93],[47,78],[78,86],[129,73],[186,92],[241,81],[288,93],[288,115],[0,115]]);if(sea)surface(c,'water',0,96,288,84,'water');else surface(c,'sand',0,107,288,73);}
function room(c,open,frame){surface(c,'paper',0,0,288,124);surface(c,'sand',0,124,288,56);
 for(let y=135;y<180;y+=15)rect(c,'deep',0,y,288,1);c.globalAlpha=.25;for(let x=0;x<288;x+=45)rect(c,'ink',x,124,1,56);c.globalAlpha=1;
 rect(c,'deep',191,22,72,63);surface(c,'water',195,26,64,55,'water');poly(c,'leaf',[[195,66],[213,54],[227,61],[249,47],[259,58],[259,81],[195,81]]);rect(c,'light',240,33,9,9);rect(c,'deep',223,24,2,59);rect(c,'deep',193,52,68,2);surface(c,'white',184,19,6,72);surface(c,'white',264,19,6,72);
 rect(c,'deep',16,103,102,34);rect(c,'sand',18,135,4,14);rect(c,'deep',108,135,4,14);surface(c,'white',18,96,99,36);surface(c,'leaf',39,97,76,34);for(let x=42;x<114;x+=7)rect(c,'moss',x,98,1,30);rect(c,'paper',20,99,18,20);rect(c,'light',22,100,13,3);
 rect(c,'sand',28,26,65,37);surface(c,'leaf',31,29,59,31);poly(c,'moss',[[33,56],[47,39],[63,46],[78,36],[88,44],[88,58]]);
 surface(c,'deep',210,104,58,5);rect(c,'deep',214,109,3,33);rect(c,'deep',261,109,3,33);rect(c,'clay',232,92,12,12);shrub(c,231,90);rect(c,'deep',237,79,2,13);
 surface(c,'moss',102,151,58,18);for(let x=105;x<158;x+=7)rect(c,'paper',x,153,2,14);rect(c,'clay',216,99,8,4);rect(c,'light',216,99,8,1);person(c,130,108,1.5,room.outfit,frame);caseArt(c,174,148,open);
 rect(c,'sand',117,61,16,21);rect(c,'light',119,63,12,15);rect(c,'deep',122,65,1,8);rect(c,'deep',121,73,6,1);
}
export function scene(canvas,type='savanna',outfit={},frame=0){const c=setup(canvas);surface(c,'sky',0,0,288,180);cloud(c,32+frame,25);cloud(c,178,39);rect(c,'light',245,25,13,13);
 if(['home','room','route'].includes(type)){room.outfit=outfit;room(c,type==='home',frame);return;}
 if(type==='airport'){surface(c,'paper',0,0,288,180);surface(c,'water',8,17,272,88,'water');surface(c,'moss',8,85,272,20);cloud(c,32+frame*2,35);rect(c,'white',150+frame*2,55,63,5);poly(c,'white',[[157,56],[162,43],[169,43],[169,56],[195,56],[178,70],[171,70],[180,58]]);for(let x=8;x<288;x+=68)rect(c,'deep',x,15,2,92);rect(c,'deep',8,105,272,3);surface(c,'sand',0,137,288,43);for(let x=0;x<288;x+=38)rect(c,'paper',x,137,1,43);rect(c,'paper',0,156,288,1);surface(c,'deep',17,111,73,10);rect(c,'ink',18,121,72,3);rect(c,'deep',24,124,2,14);rect(c,'deep',82,124,2,14);rect(c,'sand',230,28,38,12);rect(c,'deep',237,33,22,2);person(c,136,113,1.6,outfit,frame);caseArt(c,182,151);return;}
 const sea=['island','river','cape','busstop'].includes(type);hills(c,sea);
 if(type==='camp'){surface(c,'deep',0,0,288,57);for(const [x,y]of [[18,14],[84,27],[163,15],[227,32],[264,11]])rect(c,'paper',x,y,1,1);rect(c,'light',245,20,8,8);}
 if(type==='river'){poly(c,'paper',[[0,147],[65,137],[91,146],[81,180],[0,180]]);for(let i=0;i<14;i++){const x=(i*31)%90,y=151+(i*7)%23;rect(c,'deep',x,y-7,1,9);rect(c,'leaf',x+2,y-4,1,6);}tree(c,35,100,.8);rect(c,'deep',160+frame,127,36,3);poly(c,'sand',[[163+frame,126],[170+frame,130],[192+frame,130],[199+frame,126]]);rect(c,'paper',180+frame,118,4,7);}
 if(type==='island'){poly(c,'paper',[[0,137],[49,145],[113,142],[179,154],[241,145],[288,151],[288,180],[0,180]]);surface(c,'sand',0,169,288,11);tree(c,32,91,1.3,true);tree(c,4,118,.8,true);poly(c,'deep',[[221,123],[230,102],[247,109],[257,128]]);rect(c,'light',222,128,35,1);rect(c,'deep',110+frame,119,18,2);poly(c,'white',[[120+frame,102],[120+frame,117],[132+frame,117]]);}
 else if(type==='savanna'||type==='camp'){tree(c,46,84,1.2);tree(c,237,98,.7);tree(c,157,106,.35);for(let i=0;i<22;i++)shrub(c,(i*67)%288,118+(i*17)%60);poly(c,'paper',[[0,167],[86,132],[114,133],[180,180],[0,180]]);if(type==='camp'){poly(c,'deep',[[179,104],[149,146],[209,146]]);poly(c,'sand',[[179,104],[203,104],[232,146],[209,146]]);poly(c,'ink',[[179,115],[162,146],[196,146]]);rect(c,'clay',243,142,5,4);rect(c,'light',244,138-frame,3,6);}else{giraffe(c,219,119);giraffe(c,186,129);}rect(c,'deep',59,144,50,18);surface(c,'leaf',63,134,38,14);rect(c,'water',66,137,15,9);rect(c,'water',84,137,15,9);rect(c,'ink',64,160,8,10);rect(c,'ink',99,160,8,10);}
 else if(type==='desert'){poly(c,'clay',[[0,148],[82,80],[169,151]]);poly(c,'sand',[[82,80],[91,91],[132,151],[169,151]]);poly(c,'paper',[[90,164],[225,89],[288,147],[288,180],[90,180]]);poly(c,'sand',[[225,89],[245,117],[276,180],[288,180],[288,147]]);for(let i=0;i<12;i++)rect(c,'deep',(i*43)%288,145+(i*11)%33,3,1);}
 else if(type==='falls'){surface(c,'deep',0,88,288,65);surface(c,'wave',77,89,126,67,'water');for(let i=0;i<23;i++){const x=80+(i*17)%119,y=92+(i*9+frame*5)%42;rect(c,i%3?'white':'water',x,y,1,10+i%7);}surface(c,'water',0,154,288,26,'water');for(let i=0;i<11;i++)rect(c,'white',79+i*10,151+(i+frame)%6,6,1);tree(c,30,106,.7);}
 else if(type==='coach'){surface(c,'deep',0,0,288,180);surface(c,'water',12,18,264,64,'water');poly(c,'leaf',[[12,69],[50,43],[97,66],[127,51],[183,73],[244,54],[276,65],[276,82],[12,82]]);for(let x=23;x<288;x+=65){rect(c,'ink',x,88,43,68);surface(c,'leaf',x+3,91,37,62);rect(c,'moss',x+7,94,29,9);}rect(c,'paper',7,81,274,2);}
 else if(['city','cape'].includes(type)){for(let x=12;x<124;x+=26){surface(c,x%3?'paper':'clay',x,77+x%19,23,57);rect(c,'deep',x+4,93,5,9);rect(c,'deep',x+13,93,5,9);rect(c,'sand',x+6,119,9,15);}if(type==='cape')poly(c,'deep',[[146,95],[158,67],[215,67],[246,94]]);}
 if(['road','city','cape','busstop'].includes(type)){surface(c,'deep',0,150,288,24);for(let x=0;x<288;x+=32)rect(c,'paper',x+frame*2,161,11,1);}
 if(type==='road'||type==='busstop'){const x=81+frame*2;surface(c,'leaf',x,132,57,22);rect(c,'paper',x+2,129,53,3);rect(c,'water',x+5,135,44,8);for(let xx=x+16;xx<x+50;xx+=12)rect(c,'deep',xx,135,1,8);rect(c,'ink',x+6,153,8,7);rect(c,'ink',x+43,153,8,7);}
 if(type==='busstop'){rect(c,'deep',53,92,2,56);rect(c,'paper',47,85,15,12);rect(c,'deep',51,88,7,2);rect(c,'sand',43,141,34,3);}
 person(c,135,136,1.05,outfit,frame);
}
export function avatar(canvas,outfit={}){const c=setup(canvas,96,120);surface(c,'paper',0,0,96,120);surface(c,'moss',0,99,96,21);person(c,20,10,2.6,outfit);}
export function selfie(canvas){const c=setup(canvas,192,288);surface(c,'sky',0,0,192,288);cloud(c,11,30);surface(c,'sand',0,125,192,163);tree(c,24,109,.8);giraffe(c,147,152);person(c,32,108,5.8,{hat:true});poly(c,'skin',[[131,249],[148,250],[192,273],[192,288],[167,288]]);}
