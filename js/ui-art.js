// Small objects are authored on an integer grid; DOM controls keep their original actions.
const C={ink:'#65714f',dark:'#78805a',moss:'#93996c',sage:'#adb388',light:'#c5c69a',cream:'#e2d5a4',pale:'#eddfb1',ochre:'#b4a578',clay:'#bb997e',rose:'#ad8490',sea:'#8fac97'};
function r(c,k,x,y,w,h){c.fillStyle=C[k]||k;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function poly(c,k,p){for(let y=Math.min(...p.map(v=>v[1]));y<Math.max(...p.map(v=>v[1]));y++){const xs=[];for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>y)!==(b[1]>y))xs.push(Math.round(a[0]+(y-a[1])*(b[0]-a[0])/(b[1]-a[1])));}xs.sort((a,b)=>a-b);for(let i=0;i<xs.length;i+=2)r(c,k,xs[i],y,xs[i+1]-xs[i],1);}}
function edge(c,k,x,y,w,h,s=2){r(c,k,x+s,y,w-s*2,h);r(c,k,x,y+s,w,h-s*2);r(c,k,x+1,y+1,w-2,h-2);}
function hatch(c,k,x,y,w,h){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)if((xx+yy)%4===0)r(c,k,xx,yy,1,1);}
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
function shell(c,w,h,small=false){
 const inset=small?2:3;
 edge(c,'ink',1,2,w-3,h-4,4);edge(c,'ochre',1,1,w-4,h-5,4);edge(c,'light',2,2,w-6,h-7,3);edge(c,'moss',3,4,w-8,h-10,3);
 r(c,'sage',4,5,2,h-14);r(c,'light',6,5,w-15,1);r(c,'dark',w-8,9,3,h-19);r(c,'ink',w-5,10,1,h-19);
 hatch(c,'sage',6,h-10,w-16,3);for(let y=14;y<h-18;y+=23){r(c,'light',4,y,1,5);r(c,'sage',w-8,y+7,2,4);}
 if(!small){r(c,'pale',6,7,w-18,1);r(c,'cream',4,10,1,h-29);r(c,'light',w-9,10,1,h-29);poly(c,'light',[[6,h-25],[17,h-25],[6,h-14]]);r(c,'rose',w-12,7,2,2);}
 const sy=small?11:12,sh=h-(small?24:38);
 edge(c,'ink',inset+3,sy-2,w-2*inset-7,sh+3,1);r(c,'sage',inset+4,sy-1,w-2*inset-9,sh+1);r(c,'light',inset+5,sy,w-2*inset-11,sh-2);
 if(small){r(c,'cream',inset+5,sy,w-2*inset-11,2);hatch(c,'sage',inset+5,sy+sh-9,w-2*inset-11,6);const x=Math.floor(w/2)-7,y=Math.floor(h*.51);for(const [dx,dy] of [[0,0],[9,0],[0,9],[9,9]]){r(c,'ochre',x+dx,y+dy+1,6,6);r(c,'pale',x+dx,y+dy,6,5);r(c,'cream',x+dx,y+dy,6,1);}}
 r(c,'ink',Math.floor(w/2)-7,5,14,2);r(c,'sage',Math.floor(w/2)-6,5,12,1);r(c,'dark',Math.floor(w/2)+10,5,2,2);
 if(!small)return;
 edge(c,'ink',Math.floor(w/2)-7,h-10,14,5,1);r(c,'sage',Math.floor(w/2)-6,h-10,12,3);r(c,'cream',Math.floor(w/2)-4,h-9,8,1);
}
function paper(c,w,h){r(c,'cream',0,0,w,h);r(c,'pale',0,0,w,2);for(let y=7;y<h;y+=17){const x=(Math.floor(y/17)*11)%Math.max(1,w-6);r(c,'#d7cea0',x,y,3,1);r(c,'#ded3a3',x+2,y+1,2,1);}r(c,'light',w-2,0,2,h);hatch(c,'#d5cba0',0,h-4,w,3);}
function plaque(c,w,h){edge(c,'dark',0,2,w,h-2,2);edge(c,'ochre',0,0,w-1,h-2,2);edge(c,'cream',1,0,w-3,h-4,2);r(c,'pale',3,1,w-8,2);hatch(c,'light',2,h-8,w-5,4);r(c,'clay',3,3,2,2);r(c,'dark',w-6,h-7,2,2);}
function crystal(c,w,h,mint=false){
 edge(c,'ink',0,2,w,h-2,3);edge(c,'ochre',0,0,w-1,h-2,3);edge(c,mint?'sage':'light',1,0,w-3,h-4,3);
 edge(c,mint?'#bfcbaa':'cream',2,1,w-5,h-6,2);
 r(c,'pale',4,2,w-10,2);r(c,'light',3,4,1,h-10);r(c,mint?'moss':'ochre',w-5,5,2,h-12);
 poly(c,mint?'#d0d5b2':'#eee0b5',[[4,5],[Math.min(w-8,24),5],[Math.min(w-8,16),10],[4,10]]);
 poly(c,mint?'#a6b38d':'#ccc494',[[w-4,h-6],[w-19,h-6],[w-4,h-19]]);
 r(c,'pale',4,h-6,w-24,1);hatch(c,mint?'light':'#d7cfa3',w-18,h-12,10,5);r(c,'rose',w-6,3,2,2);
}
function homeKey(c,w,h){
 edge(c,'ink',1,3,w-2,h-3,4);edge(c,'ochre',1,1,w-3,h-4,4);edge(c,'light',2,1,w-5,h-6,3);edge(c,'cream',3,2,w-7,h-8,2);r(c,'pale',6,3,w-14,2);
 const x=Math.floor(w/2);poly(c,'dark',[[x-6,9],[x,4],[x+6,9],[x+4,9],[x+4,14],[x-4,14],[x-4,9]]);r(c,'cream',x-1,10,2,4);r(c,'sage',5,h-6,w-13,1);
}
export function drawUI(canvas,type){
 const small=type==='small-phone',iconType=type.startsWith('icon-');
 const w=iconType?34:small?48:Math.max(32,Math.round(canvas.clientWidth/2)),h=iconType?34:small?80:Math.max(20,Math.round(canvas.clientHeight/2));
 canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;c.clearRect(0,0,w,h);
 if(iconType)icon(c,type.slice(5));else if(small||type==='shell')shell(c,w,h,small);else if(type==='home-key')homeKey(c,w,h);else if(type.startsWith('crystal'))crystal(c,w,h,type==='crystal-mi');else if(type==='plaque')plaque(c,w,h);else paper(c,w,h);
}
