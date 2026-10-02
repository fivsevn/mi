// Authored integer-grid phone art. Static glass and metal are code, never downloaded bitmaps.
const C={moss:'#93996c',sage:'#adb388',rose:'#ad8490',sea:'#8fac97',ink:'#65714f',dark:'#78805a',light:'#c5c69a',cream:'#e2d5a4',pale:'#eddfb1',ochre:'#b4a578',clay:'#bb997e'};
function r(c,k,x,y,w,h){c.fillStyle=C[k]||k;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(c,k,p){for(let y=Math.floor(Math.min(...p.map(v=>v[1])));y<Math.max(...p.map(v=>v[1]));y++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y))xs.push(Math.round(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(c,k,xs[i],y,xs[i+1]-xs[i],1);}}
function edge(c,k,x,y,w,h,s=2){r(c,k,x+s,y,w-s*2,h);r(c,k,x,y+s,w,h-s*2);r(c,k,x+1,y+1,w-2,h-2);}
function hatch(c,k,x,y,w,h){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if((xx+yy)%4===0)r(c,k,xx,yy,1,1);}
function round(c,k,x,y,w,h,rad=4){for(let yy=0;yy<h;yy++){const dy=yy<rad?rad-yy-.5:yy>=h-rad?yy-(h-rad)+.5:0,cut=dy?Math.ceil(rad-Math.sqrt(Math.max(0,rad*rad-dy*dy))):0;r(c,k,x+cut,y+yy,w-cut*2,1);}}
function line(c,k,x,y,xx,yy){const n=Math.max(Math.abs(xx-x),Math.abs(yy-y));for(let i=0;i<=n;i++)r(c,k,x+(xx-x)*i/n,y+(yy-y)*i/n,1,1);}
function circle(c,k,x,y,rad){for(let yy=-rad;yy<=rad;yy++){const w=Math.floor(Math.sqrt(rad*rad-yy*yy));r(c,k,x-w,y+yy,w*2+1,1);}}
function wallpaper(c,w,h){r(c,'#adb388',0,0,w,h);}

function labelLines(c,x,y,w=14){for(let i=0;i<3;i++){r(c,'ochre',x,y+i*4,w-i%2*3,1);r(c,'light',x+w-3,y+i*4+1,2,1);}}
function icon(c,type){
 r(c,'moss',5,29,25,2);r(c,'sage',8,31,19,1);
 if(type==='mi'){
  edge(c,'ink',4,5,27,25,3);edge(c,'ochre',3,3,27,25,3);edge(c,'sage',4,3,25,23,2);r(c,'light',6,4,20,2);r(c,'moss',6,7,21,18);r(c,'dark',28,8,1,17);r(c,'cream',4,7,1,15);
  const letters=[['10001','11011','10101','10101','10001','10001','10001'],['111','010','010','010','010','010','111']];
  for(let g=0;g<2;g++)for(let y=0;y<7;y++)for(let x=0;x<letters[g][y].length;x++)if(letters[g][y][x]==='1'){r(c,'dark',8+g*12+x*2,10+y*2,2,2);r(c,'pale',7+g*12+x*2,9+y*2,2,2);}
  r(c,'light',6,26,20,1);
 }else if(type==='chat'){
  edge(c,'ink',3,6,27,20,2);edge(c,'sage',4,5,25,18,2);r(c,'pale',6,6,19,2);r(c,'moss',27,9,2,12);
  poly(c,'cream',[[5,9],[26,9],[26,21],[14,21],[8,27],[8,21],[5,21]]);r(c,'ochre',8,22,1,5);r(c,'pale',6,9,18,2);hatch(c,'light',6,18,18,3);
  for(let i=0;i<3;i++){r(c,'moss',9+i*5,14,2,2);r(c,'light',10+i*5,14,1,1);}
 }else if(type==='maps'){
 // Three folded panels, with the same raised paper edges as the notebook.
 poly(c,'dark',[[4,8],[12,5],[21,8],[29,5],[30,28],[22,31],[13,28],[5,31]]);
 poly(c,'ochre',[[3,6],[11,3],[20,6],[28,3],[28,26],[20,29],[11,26],[3,29]]);
 poly(c,'cream',[[4,7],[11,5],[19,8],[27,5],[27,25],[20,27],[11,24],[4,27]]);
 poly(c,'pale',[[4,7],[11,5],[11,24],[4,27]]);
 poly(c,'light',[[11,5],[19,8],[20,27],[11,24]]);
 poly(c,'sage',[[6,12],[9,10],[14,13],[15,17],[10,20],[6,18]]);
 poly(c,'moss',[[18,11],[24,9],[25,16],[22,19],[18,17]]);
 line(c,'ochre',11,6,11,23);line(c,'cream',12,7,12,23);line(c,'ochre',20,8,20,26);
 line(c,'cream',7,23,16,19);line(c,'cream',16,19,23,13);
 r(c,'rose',21,12,3,3);r(c,'pale',21,12,1,1);r(c,'cream',5,8,1,15);r(c,'pale',22,7,4,1);
 }else if(type==='notes'){
  edge(c,'ochre',6,3,23,27);edge(c,'clay',5,2,22,27);r(c,'cream',8,3,17,23);r(c,'pale',9,4,13,2);r(c,'ochre',5,3,3,25);r(c,'ink',5,3,1,24);
  for(let y=6;y<26;y+=5){r(c,'light',4,y,4,1);r(c,'dark',5,y+1,2,1);}labelLines(c,11,10,11);poly(c,'light',[[20,25],[25,20],[25,25]]);r(c,'rose',19,26,3,6);r(c,'pale',9,27,10,1);
 }else if(type==='bag'){
  edge(c,'ink',11,3,12,8,1);r(c,'cream',13,4,8,2);r(c,'sage',14,6,6,5);
  edge(c,'dark',4,11,26,19,2);edge(c,'ochre',4,10,24,17,2);r(c,'cream',6,11,19,2);r(c,'clay',7,14,16,10);hatch(c,'ochre',7,21,16,3);
  for(const x of [9,22]){r(c,'dark',x,13,2,14);r(c,'light',x,13,1,8);r(c,'cream',x-1,19,4,3);r(c,'ochre',x,20,2,1);}r(c,'pale',14,15,5,5);r(c,'rose',15,16,3,2);r(c,'ink',7,28,3,3);r(c,'ink',23,28,3,3);
 }else if(type==='photos'){
  // One instant photograph, with a shaded paper edge.
 edge(c,'dark',5,5,25,25,2);edge(c,'ochre',4,4,24,24,2);
 r(c,'pale',5,5,21,22);r(c,'cream',6,7,19,19);r(c,'sage',7,8,17,14);
 r(c,'light',8,9,15,6);r(c,'pale',19,10,3,3);
 poly(c,'moss',[[7,21],[12,13],[18,21]]);poly(c,'dark',[[15,21],[20,16],[24,21]]);
 r(c,'sea',7,21,17,1);r(c,'pale',7,24,16,1);r(c,'light',27,8,1,18);
 }else if(type==='bills'){
  // One receipt, with a perforated foot and a single total line.
 edge(c,'dark',8,4,20,26,1);r(c,'clay',6,3,20,25);r(c,'cream',7,4,17,23);
 r(c,'pale',8,4,14,2);r(c,'ochre',23,7,1,19);r(c,'pale',8,7,1,17);
 for(const y of [10,14,18]){r(c,'ochre',10,y,8,1);r(c,'moss',20,y,2,1);}
 r(c,'moss',10,23,12,1);for(const x of [7,11,15,19])r(c,'cream',x,27,2,2);
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
 round(c,'#65714f',1,2,w-2,h-3,rad);round(c,'#93996c',2,1,w-4,h-3,rad-1);round(c,'#e2d5a4',3,2,w-6,h-5,rad-2);round(c,'#7b8758',4,4,w-8,h-8,rad-3);round(c,'#626d48',6,5,w-12,h-10,rad-4);
 r(c,'#c5c69a',3,rad,w>80?2:1,h-rad*2);r(c,'#eddfb1',5,rad,1,h-rad*2);r(c,'#93996c',w-5,rad,2,h-rad*2);r(c,'#eddfb1',w-7,rad+3,1,h-rad*2-7);
 
 // Quiet, fine rim glints; no chunky decorative notches.
 line(c,'#d8cda5',rad+5,3,w*.52,3);line(c,'#b3b58a',rad+4,h-4,w*.43,h-4);
 for(const [xx,yy,k] of [[4,h*.29,'#b6bd91'],[w-5,h*.53,'#adb388'],[rad+9,h-5,'#e2d5a4'],[w-rad-9,3,'#a7ad7b']])r(c,k,xx,yy,1,1);
 // Low-contrast metal facets occupy the rim only, preserving the smooth silhouette.
 for(let i=0;i<12;i++){const yy=rad+9+i*(h-2*rad-18)/12;r(c,i%3?'#b2b58b':'#c8c9a1',3,yy,1,2);r(c,i%3?'#8d9570':'#b6bd91',w-5,yy+3,1,2);}
 line(c,'#c4be94',rad+2,4,w-rad-3,4);line(c,'#e5d5af',rad+10,3,w*.43,3);
 const sy=small?10:36,sh=h-(small?21:84);round(c,'#65714f',8,sy-1,w-16,sh+2,5);round(c,'#c5c69a',9,sy,w-18,sh,4);
 const speaker=small?10:34;round(c,'#65714f',Math.floor(w/2)-speaker/2,small?6:18,speaker,small?2:5,small?1:2);r(c,'#e2d5a4',Math.floor(w/2)-speaker/2+1,small?7:21,speaker-2,1);
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
 round(c,'#78805a',1,1,30,51,6);round(c,'#adb388',2,0,28,51,5);round(c,'#c5c69a',3,1,26,49,4);round(c,'#93996c',4,2,24,47,3);
 r(c,'#e2d5a4',7,1,17,1);r(c,'#eddfb1',5,4,1,13);r(c,'#adb388',3,9,1,30);r(c,'#93996c',28,9,1,31);r(c,'#adb388',27,32,1,10);
 r(c,'#adb388',6,3,20,4);round(c,'#65714f',12,4,8,2,1);r(c,'#c5c69a',13,6,6,1);
 round(c,'#3b4437',5,8,22,35,2);round(c,'#252e28',6,9,20,33,1);
 poly(c,'#323a30',[[6,10],[17,10],[6,27]]);poly(c,'#3d4334',[[25,25],[25,41],[14,41]]);r(c,'#515a43',6,12,1,24);r(c,'#68704f',7,9,15,1);
 r(c,'#78805a',7,43,18,5);circle(c,'#65714f',16,46,3);r(c,'#c5c69a',15,45,2,2);r(c,'#93996c',16,46,1,1);r(c,'#e2d5a4',9,49,13,1);r(c,'#93996c',23,48,3,1);
}
function friendIcon(c,id){
 const backgrounds=['#b4b9a3','#afbcb4','#c7baa4','#b7b3bd','#aeb29f','#b7aaa2'];
 r(c,'#6b735e',0,1,24,23);r(c,'#adb388',0,0,23,22);r(c,'#e2d9bd',1,1,21,1);r(c,backgrounds[id%6],2,3,19,17);r(c,'#979b80',22,3,1,18);r(c,'#78805a',2,22,20,1);
 if(id===0){r(c,'#78805a',11,9,1,10);poly(c,'#6b735e',[[11,11],[6,10],[4,6],[8,6],[11,9]]);poly(c,'#979b80',[[12,13],[16,12],[19,7],[15,7],[12,10]]);r(c,'#b2a08e',8,17,7,3);r(c,'#e2d9bd',9,17,5,1);}
 if(id===1){r(c,'#e2d9bd',5,7,9,3);r(c,'#e2d9bd',8,5,5,6);r(c,'#c5c69a',12,9,6,2);r(c,'#b2a08e',16,5,3,3);r(c,'#78805a',4,16,15,2);}
 if(id===2){poly(c,'#6b735e',[[3,19],[9,9],[15,19]]);poly(c,'#979b80',[[10,19],[16,7],[21,19]]);poly(c,'#e2d9bd',[[7,12],[9,9],[11,12]]);r(c,'#b2a08e',4,5,3,3);}
 if(id===3){r(c,'#6b735e',5,10,15,9);r(c,'#e2d9bd',6,11,13,2);circle(c,'#b4a578',12,15,4);circle(c,'#6b735e',12,15,2);r(c,'#b2a08e',7,8,5,2);r(c,'#e2d9bd',17,14,2,1);}
 if(id===4){r(c,'#78805a',10,11,2,8);for(const [x,y] of [[7,7],[12,6],[15,10],[7,12]]){circle(c,'#b2a08e',x,y,3);r(c,'#e2d9bd',x,y,1,1);}r(c,'#6b735e',13,15,5,2);}
 if(id===5){circle(c,'#e2d9bd',11,11,6);circle(c,'#b7aaa2',14,9,5);r(c,'#e2d9bd',18,6,1,3);r(c,'#e2d9bd',17,7,3,1);r(c,'#78805a',5,18,14,1);}
}
function paper(c,w,h){r(c,'cream',0,0,w,h);}
function plaque(c,w,h){edge(c,'dark',0,2,w,h-2,2);edge(c,'ochre',0,0,w-1,h-2,2);edge(c,'cream',1,0,w-3,h-4,2);r(c,'pale',3,1,w-8,2);hatch(c,'light',2,h-8,w-5,4);r(c,'clay',3,3,2,2);r(c,'dark',w-6,h-7,2,2);}
function phonePane(c,w,h,type){
 if(type==='phone-row'){r(c,'#b4a57877',25,h-1,w-25,1);return;}
 if(type==='phone-bar'||type==='phone-dock'){
 const matrix=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],dock=type==='phone-dock';
 const base='#65754f',shade='#596948',light='#7d8a60';
 r(c,base,0,0,w,h);
 // Only a narrow material-light transition uses mixed pixels; the reading area stays quiet.
 const band=dock?6:3;
 for(let y=0;y<band;y++)for(let x=0;x<w;x++){const t=(y+.5)/band;r(c,matrix[(y%4)*4+x%4]/16<t?base:light,x,y,1,1);}
 for(let y=h-3;y<h;y++)for(let x=0;x<w;x++){const t=(y-h+3)/3;r(c,matrix[(y%4)*4+x%4]/16<t?shade:base,x,y,1,1);}
 return;
 }
 if(type==='battery'){edge(c,'#586647',0,1,w-2,h-2,1);r(c,'#aab384',1,2,w-4,h-4);for(let x=2;x<6;x+=2)r(c,'#586647',x,3,1,h-6);r(c,'#78805a',w-2,Math.floor(h/2)-1,2,3);r(c,'#d4d0a6',2,1,w-5,1);return;}
 const mint=type==='phone-message-mi';
 edge(c,'#65714f',1,2,w-1,h-2,2);edge(c,'#adb388',1,1,w-2,h-3,2);
 edge(c,mint?'#c5c69a':'#e2d5a4',2,3,w-4,h-6,1);
 r(c,'#eddfb1',3,1,w-7,1);r(c,'#eddfb1',3,3,w-7,1);
 r(c,'#93996c',w-2,4,1,h-8);r(c,'#c5c69a',3,h-4,w-6,1);
 for(let x=4;x<w-4;x++)if(x%4===0)r(c,mint?'#adb388':'#c5c69a',x,h-5,1,1);
}
export function drawUI(canvas,type){
 const small=type==='small-phone'||type==='small-phone-lit',friend=type.startsWith('friend-'),ico=type.startsWith('icon-'),w=friend?24:type==='battery'?18:ico?34:small?32:Math.max(type==='phone-seal'?16:32,Math.round(canvas.clientWidth/2)),h=friend?24:type==='battery'?10:ico?34:small?52:Math.max(20,Math.round(canvas.clientHeight/2));canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);
 if(friend)friendIcon(c,Number(type.slice(7)));else if(ico)icon(c,type.slice(5));else if(small){miniPhone(c);if(type==='small-phone-lit'){round(c,'#a6b594',6,9,20,33,1);poly(c,'#bcc49e',[[7,10],[25,10],[25,28],[19,25],[12,29],[7,21]]);poly(c,'#8d9e7b',[[7,32],[14,24],[25,26],[25,41],[7,41]]);r(c,'#e9dfba',10,14,4,6);r(c,'#a6b594',11,15,2,4);r(c,'#e9dfba',17,14,4,6);r(c,'#a6b594',18,15,2,4);r(c,'#e9dfba',15,16,1,1);r(c,'#e9dfba',15,18,1,1);r(c,'#dce0b5',11,22,10,1);r(c,'#e4d9b6',13,37,6,1);}}else if(type==='shell')shell(c,w,h);else if(type==='patina')patina(c,w,h);else if(type==='home-key')homeKey(c,w,h);else if(type==='glass-wallpaper')wallpaper(c,w,h);else if(type==='battery')phonePane(c,w,h,type);else if(type.startsWith('phone-')||type==='crystal')phonePane(c,w,h,type);else if(type==='title-strip'){
 // Uneven torn fibres, a gently bowed lower edge, and a single creased corner.
 for(let x=1;x<w-1;x++){
  const tear=(x*17+x*x*3)%19,top=tear<2?2:tear<6?1:0;
  const bottom=h-3-Math.round(Math.sin(x/w*Math.PI)*1.2)-(tear>16?1:0);
  const start=x<3?3+(x%2):top;
  r(c,'#e4d9b6',x,start,1,bottom-start);
  if(x%13===4)r(c,'#daceaa',x,bottom-1,1,1);
  r(c,'#8a8c7066',x+1,bottom+1,1,1);
 }
 r(c,'#eee2c1',4,2,w-12,1);r(c,'#cbbf9b',w-7,2,4,1);r(c,'#f3e8ca',w-6,3,3,2);
 r(c,'#d2c5a1',w-4,5,1,5);r(c,'#d9cead',4,h-7,w-14,1);
 }else if(type==='plaque')plaque(c,w,h);else paper(c,w,h);
}
