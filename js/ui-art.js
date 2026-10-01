// Authored integer-grid phone art. Static glass and metal are code, never downloaded bitmaps.
const C={moss:'#93996c',sage:'#adb388',rose:'#ad8490',sea:'#8fac97',ink:'#65714f',dark:'#78805a',light:'#c5c69a',cream:'#e2d5a4',pale:'#eddfb1',ochre:'#b4a578',clay:'#bb997e'};
function r(c,k,x,y,w,h){c.fillStyle=C[k]||k;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(c,k,p){for(let y=Math.floor(Math.min(...p.map(v=>v[1])));y<Math.max(...p.map(v=>v[1]));y++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y))xs.push(Math.round(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(c,k,xs[i],y,xs[i+1]-xs[i],1);}}
function edge(c,k,x,y,w,h,s=2){r(c,k,x+s,y,w-s*2,h);r(c,k,x,y+s,w,h-s*2);r(c,k,x+1,y+1,w-2,h-2);}
function hatch(c,k,x,y,w,h){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if((xx+yy)%4===0)r(c,k,xx,yy,1,1);}
function round(c,k,x,y,w,h,rad=4){for(let yy=0;yy<h;yy++){const dy=yy<rad?rad-yy-.5:yy>=h-rad?yy-(h-rad)+.5:0,cut=dy?Math.ceil(rad-Math.sqrt(Math.max(0,rad*rad-dy*dy))):0;r(c,k,x+cut,y+yy,w-cut*2,1);}}
function line(c,k,x,y,xx,yy){const n=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let i=0;i<=n;i++)r(c,k,x+(xx-x)*i/n,y+(yy-y)*i/n,1,1);}
function circle(c,k,x,y,rad){for(let yy=-rad;yy<=rad;yy++){const w=Math.floor(Math.sqrt(rad*rad-yy*yy));r(c,k,x-w,y+yy,w*2+1,1);}}
function wallpaper(c,w,h){
 const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=x/w,v=y/h,cloud=Math.sin(u*13+Math.sin(v*9)*2)+Math.cos(v*17-u*5),dx=(u-.82)/.50,dy=(v-.55)/.27,angle=Math.atan2(dy,dx),distance=Math.hypot(dx,dy)+Math.sin(angle*3)*.08+Math.sin(v*36)*.04;
  let col=cloud>1?'#e2d5a4':cloud<-.8?'#cec197':'#d8cba0';
  if(v>.2&&v<.82&&u<.4&&cloud>.1)col=cloud>1.3?'#eddfb1':'#e7d9ac';
  if(distance<1.05){const edge=distance>.91,shade=(u-v*.24)*3-1.4+Math.sin(v*8)*.15;col=shade>.8?'#adb388':shade<-.3?'#93996c':'#a1a77c';if(edge&&bayer[(y%4)*4+x%4]>(1.05-distance)*110)col='#d6c99f';}
  if(u>.57&&v>.76&&cloud<.3)col='#c5b48e';
  r(c,col,x,y,1,1);
 }
 // Large quiet reflections, with a few clustered chips in the aged glass.
 poly(c,'#f1e7db24',[[0,h*.15],[w*.19,0],[w*.4,0],[0,h*.73]].map(([x,y])=>[Math.round(x),Math.round(y)]));
 for(let i=0;i<25;i++){const x=(i*37+i*i*3)%w,y=Math.floor(h*.18)+(i*53)%Math.floor(h*.68);r(c,i%4?'#e2d5a4':'#eddfb1',x,y,1+i%2,1);if(i%5===0){r(c,'#eddfb1',x+1,y-1,1,3);r(c,'#c5c69a',x-1,y,3,1);}}
}

function labelLines(c,x,y,w=14){for(let i=0;i<3;i++){r(c,'ochre',x,y+i*4,w-i%2*3,1);r(c,'light',x+w-3,y+i*4+1,2,1);}}
function icon(c,type){
 r(c,'moss',5,29,25,2);r(c,'sage',8,31,19,1);
 if(type==='chat'){
  edge(c,'ink',3,6,27,20,2);edge(c,'sage',4,5,25,18,2);r(c,'pale',6,6,19,2);r(c,'moss',27,9,2,12);
  poly(c,'cream',[[5,9],[26,9],[26,21],[14,21],[8,27],[8,21],[5,21]]);r(c,'ochre',8,22,1,5);r(c,'pale',6,9,18,2);hatch(c,'light',6,18,18,3);
  for(let i=0;i<3;i++){r(c,'moss',9+i*5,14,2,2);r(c,'light',10+i*5,14,1,1);}
 }else if(type==='notes'){
  edge(c,'ochre',6,3,23,27);edge(c,'clay',5,2,22,27);r(c,'cream',8,3,17,23);r(c,'pale',9,4,13,2);r(c,'ochre',5,3,3,25);r(c,'ink',5,3,1,24);
  for(let y=6;y<26;y+=5){r(c,'light',4,y,4,1);r(c,'dark',5,y+1,2,1);}labelLines(c,11,10,11);poly(c,'light',[[20,25],[25,20],[25,25]]);r(c,'rose',19,26,3,6);r(c,'pale',9,27,10,1);
 }else if(type==='bag'){
  edge(c,'ink',11,3,12,8,1);r(c,'cream',13,4,8,2);r(c,'sage',14,6,6,5);
  edge(c,'dark',4,11,26,19,2);edge(c,'ochre',4,10,24,17,2);r(c,'cream',6,11,19,2);r(c,'clay',7,14,16,10);hatch(c,'ochre',7,21,16,3);
  for(const x of [9,22]){r(c,'dark',x,13,2,14);r(c,'light',x,13,1,8);r(c,'cream',x-1,19,4,3);r(c,'ochre',x,20,2,1);}r(c,'pale',14,15,5,5);r(c,'rose',15,16,3,2);r(c,'ink',7,28,3,3);r(c,'ink',23,28,3,3);
 }else{
  // A small mechanical dial, with eight readable teeth and an inset brass hub.
  const teeth=[[14,3,6,5],[14,25,6,5],[3,14,5,6],[25,14,5,6],[6,6,6,5],[22,6,5,6],[6,22,6,5],[22,22,5,5]];
  for(const p of teeth)r(c,'dark',...p);edge(c,'dark',7,7,21,21,4);edge(c,'sage',7,6,19,19,4);
  for(const [x,y,w,h] of teeth)r(c,'light',x,y,w,1);edge(c,'ochre',11,10,11,12,2);edge(c,'cream',12,10,9,9,2);r(c,'moss',15,13,4,5);r(c,'pale',13,11,5,1);hatch(c,'dark',9,23,13,3);r(c,'rose',24,7,2,2);
 }
}
function homeKey(c,w,h){
 const x=Math.floor(w/2),y=Math.floor(h/2),rad=Math.min(15,Math.floor(h/2)-1);
 circle(c,'#b4a578',x,y+1,rad);circle(c,'#65714f',x,y-1,rad-1);
 for(let i=-9;i<=9;i++){const yy=Math.round(Math.sqrt(Math.max(0,(rad-1)*(rad-1)-i*i)));r(c,i<0?'#c5c69a':'#eddfb1',x+i,y+yy,1,1);}

}
function shell(c,w,h,small=false){
 const rad=small?7:30;
 round(c,'#65714f',1,2,w-2,h-3,rad);round(c,'#a18f6d',2,1,w-4,h-3,rad-1);round(c,'#e2d5a4',3,2,w-6,h-5,rad-2);round(c,'#899263',4,4,w-8,h-8,rad-3);round(c,'#70794f',6,5,w-12,h-10,rad-4);
 r(c,'#c5c69a',3,rad,w>80?2:1,h-rad*2);r(c,'#eddfb1',5,rad,1,h-rad*2);r(c,'#bb997e',w-5,rad,2,h-rad*2);r(c,'#eddfb1',w-7,rad+3,1,h-rad*2-7);
 poly(c,'#899263',[[7,rad],[w*.43,7],[w*.59,7],[7,h*.32]].map(([x,y])=>[Math.round(x),Math.round(y)]));poly(c,'#65714f',[[w-7,h*.71],[w-7,h*.94],[w*.6,h-7],[w*.38,h-7]].map(([x,y])=>[Math.round(x),Math.round(y)]));
 for(let i=0;i<12;i++){const x=rad+(i*23)%(Math.max(1,w-2*rad));r(c,i%2?'#70794f':'#b4a578',x,3,2+i%3,1);r(c,i%3?'#c5c69a':'#eddfb1',x,h-5,3+i%4,1);}
 // Broken silver highlights and warm oxidation give the casing its physical depth.
 for(let i=0;i<17;i++){const yy=rad+7+(i*31)%(h-rad*2-14);r(c,i%3?'#899263':'#e2d5a4',3,yy,2,2+i%4);if(i%4===0)r(c,'#bb997e',w-6,yy+6,2,4);}
 line(c,'#c5c69a',rad,5,w*.48,5);line(c,'#eddfb1',rad+4,h-4,w*.43,h-4);line(c,'#70794f',w*.6,h-4,w-rad,h-4);
 for(const [xx,yy,k,ww] of [[rad+8,4,'#f0e3b7',8],[w-rad-13,3,'#c2ae8e',5],[4,h*.34,'#a7af82',2],[w-5,h*.46,'#ccad92',2],[rad+3,h-5,'#d8cca2',7],[w-rad-18,h-4,'#b39b84',6]])r(c,k,xx,yy,ww,1);
 for(let i=0;i<8;i++){const yy=rad+17+i*(h-2*rad-34)/8;r(c,i%2?'#a3aa7a':'#c8c69d',4,yy,1,3);r(c,i%3?'#b69b81':'#c9b799',w-5,yy+5,1,2);}
 const sy=small?10:36,sh=h-(small?21:76);r(c,'#65714f',8,sy-1,w-16,sh+2);r(c,'#c5c69a',9,sy,w-18,sh);
 const speaker=small?10:34;round(c,'#65714f',Math.floor(w/2)-speaker/2,small?6:22,speaker,small?2:5,small?1:2);r(c,'#e2d5a4',Math.floor(w/2)-speaker/2+1,small?7:25,speaker-2,1);
 if(small){c.save();c.translate(10,sy+1);wallpaper(c,w-20,sh-2);for(const [type,x,y]of [['chat',2,14],['notes',13,14],['bag',2,25],['settings',13,25]]){c.save();c.translate(x,y);c.scale(.26,.26);icon(c,type);c.restore();}c.restore();c.save();c.translate(w/2-5,h-11);c.scale(.3,.3);homeKey(c,34,34);c.restore();}
}
function patina(c,w,h){
 const small=w<80,s=small?.38:1,x=w-(small?11:23);c.save();c.translate(x,small?1:3);c.scale(s,s);
 // Uneven stems and overlapping leaves follow the worn rim, rather than a repeated fern.
 for(const [a,b,d,e] of [[-17,0,-6,13],[-6,13,-3,34],[-3,34,9,67],[2,7,-8,40],[9,24,5,54]]){line(c,'#302d1d',a+1,b+1,d+1,e+1);line(c,'#76613b',a,b,d,e);}
 const leaves=[[-17,2,7,5],[-8,7,5,8],[1,4,6,4],[-5,17,7,6],[3,22,5,8],[-10,27,5,7],[-2,34,6,5],[5,41,4,7],[2,50,5,6],[9,59,4,6],[-8,12,4,5]];
 leaves.forEach(([xx,yy,ww,hh],i)=>{poly(c,'#302f21',[[xx-ww,yy],[xx-ww+2,yy-hh],[xx,yy-hh-1],[xx+2,yy],[xx,yy+hh],[xx-ww+1,yy+2]]);poly(c,i%3?'#626443':'#85805a',[[xx-ww+1,yy-1],[xx-ww+3,yy-hh+1],[xx,yy-hh],[xx+1,yy],[xx-1,yy+hh-2]]);line(c,'#a28d59',xx-ww+3,yy-hh+2,xx-1,yy+2);r(c,'#45492e',xx-1,yy+2,2,3);});
 for(let i=0;i<9;i++){const yy=12+i*5,xx=10-Math.floor(i/3);round(c,'#b18b52',xx,yy,3,4,1);r(c,'#3c3021',xx+1,yy+1,1,2);}
 c.restore();
}
// Dedicated 32 × 52 locked-device sprite; highlights describe surfaces rather than heavy outlines.
function miniPhone(c){
 round(c,'#78805a',1,1,30,51,6);round(c,'#b4a578',2,0,28,51,5);round(c,'#c5c69a',3,1,26,49,4);round(c,'#93996c',4,2,24,47,3);
 r(c,'#e2d5a4',7,1,17,1);r(c,'#eddfb1',5,4,1,13);r(c,'#adb388',3,9,1,30);r(c,'#bb997e',28,9,1,31);r(c,'#b4a578',27,32,1,10);
 r(c,'#adb388',6,3,20,4);round(c,'#65714f',12,4,8,2,1);r(c,'#c5c69a',13,6,6,1);
 round(c,'#3b4437',5,8,22,35,2);round(c,'#252e28',6,9,20,33,1);
 poly(c,'#323a30',[[6,10],[17,10],[6,27]]);poly(c,'#3d4334',[[25,25],[25,41],[14,41]]);r(c,'#515a43',6,12,1,24);r(c,'#68704f',7,9,15,1);
 r(c,'#78805a',7,43,18,5);circle(c,'#65714f',16,46,3);r(c,'#c5c69a',15,45,2,2);r(c,'#93996c',16,46,1,1);r(c,'#e2d5a4',9,49,13,1);r(c,'#bb997e',23,48,3,1);
}
function paper(c,w,h){r(c,'cream',0,0,w,h);}
function plaque(c,w,h){edge(c,'dark',0,2,w,h-2,2);edge(c,'ochre',0,0,w-1,h-2,2);edge(c,'cream',1,0,w-3,h-4,2);r(c,'pale',3,1,w-8,2);hatch(c,'light',2,h-8,w-5,4);r(c,'clay',3,3,2,2);r(c,'dark',w-6,h-7,2,2);}
function phonePane(c,w,h,type){
 if(type==='phone-row'){r(c,'#b4a57877',25,h-1,w-25,1);return;}
 if(type==='phone-bar'){r(c,'#c5c69a88',0,0,w,h);r(c,'#93996c',0,h-1,w,1);return;}
 if(type==='phone-seal'){round(c,'#93996c',0,0,w,h,4);round(c,'#c5c69a',1,1,w-2,h-2,3);r(c,'#eddfb1',4,2,w-9,1);r(c,'#bb997e',2,h-5,2,2);return;}
 const mint=type==='phone-message-mi';round(c,mint?'#93996c':'#b4a578',0,0,w,h,4);round(c,mint?'#c5c69aee':'#eddfb1ee',1,1,w-2,h-2,3);r(c,'#f4e7c488',4,1,w-9,1);
}
export function drawUI(canvas,type){
 const small=type==='small-phone',ico=type.startsWith('icon-'),w=ico?34:small?32:Math.max(type==='phone-seal'?16:32,Math.round(canvas.clientWidth/2)),h=ico?34:small?52:Math.max(20,Math.round(canvas.clientHeight/2));canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);
 if(ico)icon(c,type.slice(5));else if(small)miniPhone(c);else if(type==='shell')shell(c,w,h);else if(type==='patina')patina(c,w,h);else if(type==='home-key')homeKey(c,w,h);else if(type==='glass-wallpaper')wallpaper(c,w,h);else if(type.startsWith('phone-')||type==='crystal')phonePane(c,w,h,type);else if(type==='plaque')plaque(c,w,h);else paper(c,w,h);
}
