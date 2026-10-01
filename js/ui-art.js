// Authored integer-grid phone art. Static glass and metal are code, never downloaded bitmaps.
const C={ink:'#65714f',dark:'#78805a',light:'#c5c69a',cream:'#e2d5a4',pale:'#eddfb1',ochre:'#b4a578',clay:'#bb997e'};
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
  let col=cloud>1?'#ccbaac':cloud<-.8?'#b9a99c':'#c1b1a3';
  if(v>.2&&v<.82&&u<.4&&cloud>.1)col=cloud>1.3?'#dfcec1':'#d4c2b4';
  if(distance<1.05){const edge=distance>.91,shade=(u-v*.24)*3-1.4+Math.sin(v*8)*.15;col=shade>.8?'#a2a69c':shade<-.3?'#8d938b':'#979b92';if(edge&&bayer[(y%4)*4+x%4]>(1.05-distance)*110)col='#c3b6a9';}
  if(u>.57&&v>.76&&cloud<.3)col='#ac9f91';
  r(c,col,x,y,1,1);
 }
 // Large quiet reflections, with a few clustered chips in the aged glass.
 poly(c,'#f1e7db18',[[0,h*.15],[w*.19,0],[w*.4,0],[0,h*.73]].map(([x,y])=>[Math.round(x),Math.round(y)]));
 for(let i=0;i<38;i++){const x=(i*37+i*i*3)%w,y=Math.floor(h*.18)+(i*53)%Math.floor(h*.68);r(c,i%4?'#d2c8bc':'#eee3d8',x,y,1+i%2,1);if(i%5===0){r(c,'#e4d8cb',x+1,y-1,1,3);r(c,'#c0b8ae',x-1,y,3,1);}}
}

function icon(c,type){
 const tones={chat:['#576a56','#839477'],notes:['#927a60','#b4a084'],bag:['#755f55','#a08671'],settings:['#555d58','#889183']},[dark,lit]=tones[type]||tones.settings;
 round(c,'#0b0e0d',1,2,32,31,6);round(c,'#b19e87',1,1,31,30,6);round(c,dark,2,2,29,28,5);
 round(c,lit,3,3,27,12,4);poly(c,'#ffffff20',[[5,4],[25,4],[13,14],[3,14]]);r(c,'#e7d7bd',7,2,19,1);r(c,'#c3b79f',3,8,1,15);
 const glyph='#ece1cd',shade='#c8b9a0';
 if(type==='chat'){round(c,glyph,7,10,20,13,3);poly(c,shade,[[10,21],[10,26],[15,21]]);for(let x=11;x<25;x+=5)r(c,dark,x,15,2,2);}
 if(type==='notes'){r(c,glyph,9,7,16,20);r(c,shade,7,8,3,18);for(let y=10;y<25;y+=4){r(c,dark,12,y,10,1);r(c,'#ead7b2',6,y,4,1);}r(c,'#ab7c62',21,24,3,5);}
 if(type==='bag'){round(c,glyph,11,7,11,6,2);r(c,dark,13,9,7,4);round(c,shade,7,13,20,13,2);r(c,glyph,8,13,18,2);for(const x of [11,22])r(c,glyph,x,14,2,12);r(c,dark,14,18,6,4);}
 if(type==='settings'){for(const [x,y,w,h]of [[14,6,6,4],[14,24,6,4],[6,14,4,6],[24,14,4,6],[8,8,4,4],[22,8,4,4],[8,22,4,4],[22,22,4,4]])r(c,shade,x,y,w,h);circle(c,glyph,17,17,9);circle(c,dark,17,17,5);circle(c,shade,17,17,2);}
}
function homeKey(c,w,h){
 const x=Math.floor(w/2),y=Math.floor(h/2),rad=Math.min(15,Math.floor(h/2)-1);
 circle(c,'#6b4c35',x,y+1,rad);circle(c,'#090c0b',x,y-1,rad-1);
 for(let i=-9;i<=9;i++){const yy=Math.round(Math.sqrt(Math.max(0,(rad-1)*(rad-1)-i*i)));r(c,i<0?'#c0aea0':'#e4d6c6',x+i,y+yy,1,1);}
 round(c,'#e1dfd5',x-5,y-6,11,11,2);round(c,'#111713',x-4,y-5,9,9,1);
}
function shell(c,w,h,small=false){
 const rad=small?7:17;
 round(c,'#231d17',1,2,w-2,h-3,rad);round(c,'#8a6243',2,1,w-4,h-3,rad-1);round(c,'#d3af79',3,2,w-6,h-5,rad-2);round(c,'#473c32',4,4,w-8,h-8,rad-3);round(c,'#1a1916',6,5,w-12,h-10,rad-4);
 r(c,'#a99888',3,rad,w>80?2:1,h-rad*2);r(c,'#e0cbb8',5,rad,1,h-rad*2);r(c,'#9b6c48',w-5,rad,2,h-rad*2);r(c,'#f0d6ac',w-7,rad+3,1,h-rad*2-7);
 poly(c,'#45352b',[[7,rad],[w*.43,7],[w*.59,7],[7,h*.32]].map(([x,y])=>[Math.round(x),Math.round(y)]));poly(c,'#30332e',[[w-7,h*.71],[w-7,h*.94],[w*.6,h-7],[w*.38,h-7]].map(([x,y])=>[Math.round(x),Math.round(y)]));
 for(let i=0;i<12;i++){const x=rad+(i*23)%(Math.max(1,w-2*rad));r(c,i%2?'#6b503d':'#c3ac90',x,3,2+i%3,1);r(c,i%3?'#b3a69b':'#e7d6c5',x,h-5,3+i%4,1);}
 const sy=small?10:36,sh=h-(small?21:76);r(c,'#70685c',8,sy-1,w-16,sh+2);r(c,'#1f241f',9,sy,w-18,sh);
 const speaker=small?10:34;round(c,'#483b31',Math.floor(w/2)-speaker/2,small?6:22,speaker,small?2:5,small?1:2);r(c,'#bbb2a6',Math.floor(w/2)-speaker/2+1,small?7:25,speaker-2,1);
 if(small){c.save();c.translate(10,sy+1);wallpaper(c,w-20,sh-2);for(const [type,x,y]of [['chat',2,14],['notes',13,14],['bag',2,25],['settings',13,25]]){c.save();c.translate(x,y);c.scale(.26,.26);icon(c,type);c.restore();}c.restore();c.save();c.translate(w/2-5,h-11);c.scale(.3,.3);homeKey(c,34,34);c.restore();}
}
function patina(c,w,h){
 const small=w<80,s=small?.38:1,x=w-(small?11:23);c.save();c.translate(x,small?1:3);c.scale(s,s);
 line(c,'#51472a',0,0,-4,28);line(c,'#77633a',-4,28,8,68);line(c,'#433b21',5,10,-8,45);
 for(let i=0;i<11;i++){const yy=4+i*6,xx=i%2?-3:5;poly(c,i%3?'#5b5f38':'#87804b',[[xx,yy],[xx-4,yy-4],[xx-7,yy-2],[xx-6,yy+3],[xx-2,yy+6],[xx+1,yy+3]]);r(c,'#a89454',xx-4,yy-1,2,2);r(c,'#383d27',xx-2,yy+3,2,2);}
 c.restore();
}
function paper(c,w,h){r(c,'cream',0,0,w,h);}
function plaque(c,w,h){edge(c,'dark',0,2,w,h-2,2);edge(c,'ochre',0,0,w-1,h-2,2);edge(c,'cream',1,0,w-3,h-4,2);r(c,'pale',3,1,w-8,2);hatch(c,'light',2,h-8,w-5,4);r(c,'clay',3,3,2,2);r(c,'dark',w-6,h-7,2,2);}
function phonePane(c,w,h,type){
 if(type==='phone-row'){r(c,'#d9cbbc44',25,h-1,w-25,1);return;}
 if(type==='phone-bar'){r(c,'#090c09aa',0,0,w,h);r(c,'#c6b69d55',0,h-1,w,1);return;}
 if(type==='phone-seal'){round(c,'#ab9272',0,0,w,h,4);round(c,'#303d32',1,1,w-2,h-2,3);r(c,'#b9b99a',4,2,w-9,1);return;}
 const mint=type==='phone-message-mi';round(c,mint?'#819079':'#ad9d89',0,0,w,h,4);round(c,mint?'#3c503de8':'#211f1be8',1,1,w-2,h-2,3);r(c,mint?'#a4b29a88':'#d9cab866',4,1,w-9,1);
}
export function drawUI(canvas,type){
 const small=type==='small-phone',ico=type.startsWith('icon-'),w=ico?34:small?48:Math.max(type==='phone-seal'?16:32,Math.round(canvas.clientWidth/2)),h=ico?34:small?100:Math.max(20,Math.round(canvas.clientHeight/2));canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);
 if(ico)icon(c,type.slice(5));else if(small){shell(c,w,h,true);patina(c,w,h);}else if(type==='shell')shell(c,w,h);else if(type==='patina')patina(c,w,h);else if(type==='home-key')homeKey(c,w,h);else if(type==='glass-wallpaper')wallpaper(c,w,h);else if(type.startsWith('phone-')||type==='crystal')phonePane(c,w,h,type);else if(type==='plaque')plaque(c,w,h);else paper(c,w,h);
}
