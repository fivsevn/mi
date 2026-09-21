import { LAND, AFRICA } from '../assets/world-grid.js?v=pocket-2';
import { itemById } from '../data/items.js?v=pocket-2';
const P={ink:'#263c37',leaf:'#527252',grass:'#9ba266',sand:'#d8b777',cream:'#f0e8cb',sun:'#f1d779',sky:'#a6c7bc',blue:'#508c91',dark:'#315e60'};
function context(canvas,w,h){canvas.width=w;canvas.height=h;const c=canvas.getContext('2d');c.imageSmoothingEnabled=false;return c;}
function rect(c,color,x,y,w,h){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function poly(c,color,points){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function rng(seed=21){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
function cloud(c,x,y,s=1){rect(c,'#e1e4c9',x,y,28*s,5*s);rect(c,'#e1e4c9',x+5*s,y-4*s,16*s,4*s);}
function acacia(c,x,y,s=1){rect(c,'#544f36',x,y,3*s,28*s);poly(c,'#544f36',[[x,y+17*s],[x-12*s,y-1*s],[x-8*s,y-1*s],[x+2*s,y+9*s],[x+12*s,y-9*s],[x+15*s,y-9*s],[x+3*s,y+19*s]]);rect(c,'#435a3d',x-23*s,y-10*s,48*s,8*s);rect(c,'#435a3d',x-15*s,y-16*s,34*s,8*s);rect(c,'#63744b',x-16*s,y-15*s,21*s,4*s);}
function giraffe(c,x,y,s=1){rect(c,'#a47840',x,y,20*s,10*s);rect(c,'#b68a49',x+16*s,y-28*s,5*s,34*s);rect(c,'#b68a49',x+14*s,y-32*s,12*s,6*s);rect(c,'#775533',x+16*s,y-36*s,2*s,5*s);rect(c,'#6b4c2c',x+23*s,y-31*s,2*s,2*s);for(const dx of [1,6,14,18])rect(c,'#8b6439',x+dx*s,y+9*s,2*s,18*s);for(const [dx,dy]of [[4,2],[10,5],[17,-4],[17,-13],[17,-23]])rect(c,'#775533',x+dx*s,y+dy*s,3*s,4*s);}
function palm(c,x,y,s=1){poly(c,'#796648',[[x,y+55*s],[x+7*s,y+55*s],[x+11*s,y],[x+7*s,y]]);for(let i=0;i<7;i++)rect(c,'#aa8c5b',x+3*s,y+i*8*s,6*s,2*s);for(const [dx,dy]of [[-33,8],[-28,-12],[-14,-23],[24,-20],[38,-5],[35,13]])poly(c,'#405f48',[[x+8*s,y],[x+dx*s,y+dy*s],[x+(dx-6)*s,y+(dy+10)*s],[x+6*s,y+5*s]]);}
export function drawPerson(c,x,y,scale=1,outfit={}){
 c.save();c.translate(x,y);c.scale(scale,scale);
 rect(c,'#38514c44',-1,30,22,3); // shadow
 rect(c,'#344944',3,2,14,14);rect(c,'#344944',1,6,4,15);rect(c,'#344944',16,6,3,16);
 rect(c,'#e4b990',6,7,10,10);rect(c,'#d29e76',6,14,3,4);rect(c,'#344944',12,10,2,2);
 rect(c,itemById[outfit.top]?.color||'#e7ead6',5,17,12,9);
 if(outfit.top==='stripe')for(let i=18;i<25;i+=3)rect(c,'#ebdab2',5,i,12,1);
 if(outfit.outer){const co=itemById[outfit.outer].color;rect(c,co,3,17,4,10);rect(c,co,14,17,5,10);rect(c,co,7,17,7,2);}
 rect(c,'#e4b990',2,24,3,4);rect(c,'#e4b990',17,24,3,4);
 rect(c,'#58665a',6,26,5,5);rect(c,'#58665a',12,26,5,5);
 rect(c,itemById[outfit.shoes]?.color||'#e6d7b1',5,30,6,3);rect(c,itemById[outfit.shoes]?.color||'#e6d7b1',12,30,6,3);
 if(outfit.hat){rect(c,'#d9bd74',2,5,19,3);rect(c,'#d9bd74',6,0,10,6);rect(c,'#8a744c',6,4,10,1);}
 if(outfit.goggles){rect(c,'#3a7f81',4,8,14,5);rect(c,'#afd9c7',5,9,5,3);rect(c,'#afd9c7',12,9,5,3);}
 c.restore();
}
export function avatar(canvas,outfit={}){const c=context(canvas,120,144);rect(c,'#dfe1cc',0,0,120,144);rect(c,'#cbd2b8',0,113,120,31);for(let i=0;i<8;i++)rect(c,'#b7c2a3',i*19,126+(i%2)*8,9,2);drawPerson(c,20,6,4,outfit);}
export function drawMap(canvas,visited=[]){
 const c=context(canvas,720,396);rect(c,'#e7e8d7',0,0,720,396);
 c.strokeStyle='#d3d8c6';c.lineWidth=1;
 for(let x=54;x<=666;x+=102){c.beginPath();c.moveTo(x,34);c.lineTo(x,343);c.stroke();}
 for(let y=36;y<346;y+=51){c.beginPath();c.moveTo(45,y);c.lineTo(674,y);c.stroke();}
 c.setLineDash([3,7]);c.strokeStyle='#a7b5a0';c.beginPath();c.ellipse(360,201,347,183,-.05,0,Math.PI*2);c.stroke();c.setLineDash([]);
 for(let i=0;i<LAND.length;i+=2){const x=LAND[i],y=LAND[i+1],lon=x*2-180,lat=90-y*2;const africa=AFRICA.has(x+y*180);const shade=africa?(x+y)%5===0?'#b99c4d':'#d2b865':(x+y)%5===0?'#8d9d85':'#a5b397';rect(c,shade,54+x*3.4,36+y*3.4,3,3);}
 // Madagascar and tiny ocean islands remain visible at this map scale.
 [[47,-20],[55,-5],[58,-20]].forEach(([lon,lat])=>rect(c,'#bd9144',54+(lon+180)/2*3.4,36+(90-lat)/2*3.4,4,5));
 const stops=[['safari',35,-3],['seychelles',55,-5],['falls',26,-18],['chobe',25,-18],['namibia',17,-23],['cape',18,-34],['mauritius',58,-20]];
 const pts=stops.map(([id,lon,lat])=>[54+(lon+180)/2*3.4-(id==='chobe'?7:0),36+(90-lat)/2*3.4]);
 pts.forEach(([x,y])=>{rect(c,P.ink,x-3,y-3,7,7);rect(c,'#e4cf8c',x-1,y-1,3,3);});
 c.font='12px Pixel, monospace';c.fillStyle='#81917e';c.fillText('90° N',12,44);c.fillText('0°',18,197);c.fillText('90° S',12,344);c.fillText('180° W',48,369);c.fillText('0°',354,369);c.fillText('180° E',623,369);
 c.fillStyle='#687e6b';c.font='12px Pixel, monospace';c.fillText('PACIFIC OCEAN',61,239);c.fillText('ATLANTIC',272,213);c.fillText('INDIAN OCEAN',470,278);
}
export function scene(canvas,type='savanna',outfit={},frame=0){
 const c=context(canvas,384,216),random=rng(42);rect(c,P.sky,0,0,384,216);
 if(type==='savanna'||type==='camp'){
  const camp=type==='camp';rect(c,camp?'#7b9290':'#b7c6ab',0,0,384,105);rect(c,camp?'#e0b565':'#efdb9c',282,26,30,28);rect(c,camp?'#d5b17a':'#bac097',0,92,384,28);
  poly(c,'#899c7a',[[0,109],[0,97],[38,97],[38,92],[75,92],[75,96],[111,96],[111,89],[171,89],[171,96],[226,96],[226,100],[384,100],[384,123]]);
  rect(c,'#bcb477',0,116,384,100);poly(c,'#d1bd83',[[0,183],[104,147],[174,148],[290,216],[0,216]]);
  for(let i=0;i<220;i++){const x=random()*384,y=120+random()*96;rect(c,i%3?'#989f63':'#d2c88b',x,y,2+Math.floor(random()*5),1+(i%4===0?2:0));}
  acacia(c,58,95,1.7);acacia(c,313,112,.7);acacia(c,199,115,.5);
  if(camp){poly(c,'#586d55',[[228,109],[276,163],[187,163]]);poly(c,'#b5ac77',[[228,109],[264,109],[309,163],[276,163]]);poly(c,'#354f45',[[228,122],[251,163],[213,163]]);rect(c,'#665f40',234,163,3,10);rect(c,'#e5bb60',282,153,5,8);}else{giraffe(c,249,137,1.1);giraffe(c,204,132,.65);}
  rect(c,'#364b3e',84,160,68,25);rect(c,'#4e6851',81,157,73,15);rect(c,'#71856b',91,143,47,15);rect(c,'#a9c1ac',94,146,18,11);rect(c,'#a9c1ac',116,146,18,11);rect(c,'#314338',88,179,13,14);rect(c,'#314338',136,179,13,14);rect(c,'#d0c499',87,168,8,4);rect(c,'#d0c499',145,167,7,4);drawPerson(c,167,165,1.25,outfit);
  if(!camp){cloud(c,36+frame*2,36,1.6);cloud(c,150,52,1);}
 }else if(type==='island'){
  rect(c,'#b6d2c6',0,0,384,89);cloud(c,56+frame*2,32,1.6);cloud(c,241,22,1.1);rect(c,'#efdd9c',330,36,20,20);
  poly(c,'#729d8f',[[0,90],[33,67],[51,67],[76,82],[101,81],[127,95],[0,99]]);rect(c,'#5d9fa0',0,95,384,85);rect(c,'#72b9ae',0,126,384,51);rect(c,'#92c9b4',0,151,384,30);
  for(let i=0;i<85;i++){const x=random()*384,y=101+random()*77;rect(c,i%3===0?'#bdded0':'#81bdae',x,y,4+Math.floor(random()*13),1);}
  poly(c,'#f0e3b9',[[0,160],[37,169],[97,166],[162,176],[223,177],[285,170],[336,180],[384,176],[384,216],[0,216]]);
  poly(c,'#d4c99e',[[0,196],[85,192],[176,201],[262,196],[384,205],[384,216],[0,216]]);
  poly(c,'#7f9690',[[295,152],[300,131],[316,120],[334,125],[347,153]]);poly(c,'#a6b3a0',[[316,120],[334,125],[340,143],[308,143]]);rect(c,'#d4dac2',300,153,53,2);
  palm(c,38,85,1.7);palm(c,8,116,1);drawPerson(c,197,164,1.3,outfit);
  for(let i=0;i<35;i++)rect(c,'#bfb78b',random()*384,186+random()*30,2,1);
  rect(c,'#466b65',137,116,22,3);poly(c,'#ece4bd',[[148,94],[148,114],[163,114]]);rect(c,'#657962',147,94,1,22);
 }else if(type==='airport'){
  rect(c,'#ced7c1',0,0,384,216);rect(c,'#99b9b2',18,20,348,114);rect(c,'#becfbb',18,97,348,37);rect(c,'#aab9a5',18,114,348,20);
  cloud(c,39,41,1.5);cloud(c,243,34,1);rect(c,'#e6ddba',192,64,87,8);poly(c,'#e6ddba',[[197,64],[205,50],[215,50],[215,66],[253,66],[233,83],[224,83],[235,69]]);rect(c,'#5b7d72',269,65,8,3);
  for(const x of[18,104,190,276,364])rect(c,'#496861',x,17,3,120);rect(c,'#496861',18,133,349,4);
  rect(c,'#d0c9ad',0,159,384,57);for(let x=0;x<384;x+=48)rect(c,'#b4b69d',x,159,1,57);rect(c,'#b4b69d',0,181,384,1);
  rect(c,'#405c53',26,135,88,17);rect(c,'#405c53',23,151,96,5);rect(c,'#405c53',31,152,3,17);rect(c,'#405c53',106,152,3,17);
  rect(c,'#dfc477',304,33,55,17);rect(c,'#455e52',313,39,12,3);rect(c,'#455e52',331,39,17,3);
  drawPerson(c,186,142,1.7,outfit);suitcase(c,231,171,.9);
 }else if(type==='room'||type==='home'||type==='route'){
  rect(c,'#d8d7bb',0,0,384,151);rect(c,'#b6b393',0,148,384,68);for(let y=158;y<216;y+=18)rect(c,'#a3a587',0,y,384,1);for(let x=30;x<384;x+=73)rect(c,'#a3a587',x,149,1,67);
  rect(c,'#637b67',255,25,90,76);rect(c,'#aac6b5',260,30,80,66);rect(c,'#e5d399',312,37,17,17);rect(c,'#819b73',260,77,80,19);rect(c,'#637b67',298,26,4,75);rect(c,'#637b67',255,62,90,4);rect(c,'#ede0b5',243,21,12,87);rect(c,'#ede0b5',345,21,12,87);
  rect(c,'#7c8060',19,105,141,13);rect(c,'#83876a',19,119,139,53);rect(c,'#f0e6bf',22,107,132,41);rect(c,'#6d8974',52,107,100,43);rect(c,'#87997b',57,111,91,4);rect(c,'#f0e6bf',25,109,25,29);rect(c,'#747756',20,163,7,17);rect(c,'#747756',149,163,7,17);
  rect(c,'#8e8667',277,128,61,5);rect(c,'#8e8667',282,133,4,37);rect(c,'#8e8667',331,133,4,37);rect(c,'#d9c99a',299,99,20,29);rect(c,'#576e53',306,91,6,13);rect(c,'#748765',298,88,10,7);rect(c,'#576e53',310,81,13,9);
  rect(c,'#ede1b6',34,29,87,49);rect(c,'#7f9376',41,36,73,35);rect(c,'#b4bf92',48,42,31,16);rect(c,'#b4bf92',84,51,23,13);
  drawPerson(c,179,119+(frame%2),2,outfit);suitcase(c,222,170,1.1,type==='home');
 }
 if(['falls','river','desert','road','coach','cape','city','busstop'].includes(type)){
  const sea=['cape','river','busstop'].includes(type);rect(c,'#a7bda7',0,0,384,100);cloud(c,45+frame*2,31,1.5);rect(c,'#d6c382',304,29,20,20);
  rect(c,sea?'#719e90':'#bbaa75',0,100,384,116);
  if(sea){for(let i=0;i<18;i++)rect(c,'#afc9aa',i*24+(frame%2)*4,120+(i%3)*9,13,2);poly(c,'#c8bc8e',[[0,155],[150,177],[384,149],[384,216],[0,216]]);}
  if(type==='desert'){poly(c,'#b69255',[[0,166],[122,68],[244,166]]);poly(c,'#c1a465',[[144,173],[300,89],[384,175]]);acacia(c,312,133,.6);}
  if(['road','city','cape','busstop'].includes(type)){rect(c,'#7b8875',0,179,384,24);for(let x=0;x<384;x+=40)rect(c,'#c6c6a0',x+frame*2,190,16,2);}
  if(['cape','city'].includes(type))for(let x=15;x<170;x+=32){rect(c,'#798b71',x,83+(x%3)*12,24,83);rect(c,'#cabf89',x+5,104,7,12);}
  if(type==='road'){const x=120+frame*4;rect(c,'#4e6851',x,158,65,28);rect(c,'#aac0a5',x+8,162,45,9);rect(c,'#354b3c',x+4,184,12,10);rect(c,'#354b3c',x+48,184,12,10);}
  if(type==='busstop'){rect(c,'#64765b',80,92,4,81);rect(c,'#d3cf9f',72,84,24,17);rect(c,'#d7d3ac',70,174,60,3);}
  if(type==='falls'){rect(c,'#637d62',0,95,384,83);rect(c,'#ccddbe',96,95,195,88);for(let i=0;i<24;i++)rect(c,'#edf0cf',104+(i*23)%182,103+(i*13+frame*8)%72,2,12);rect(c,'#859e85',0,183,384,33);}
  if(type==='coach'){rect(c,'#667b65',0,0,384,216);rect(c,'#91a58b',16,22,350,74);for(let x=30;x<384;x+=91){rect(c,'#364f40',x,102,53,80);rect(c,'#a5ad8a',x+8,125,44,56);}rect(c,'#c1c7a1',23+frame*3,47,60,2);}
  drawPerson(c,190,161+(frame%2),1.4,outfit);
 }
 if(type==='home'||type==='room'){rect(c,frame%2?'#e4d09b':'#dfcd9b',316,42,7,7);}
 // A fine inset frame gives every scene the same cartridge-like edge.
 c.strokeStyle='#263c3720';c.lineWidth=2;c.strokeRect(1,1,382,214);
}
function suitcase(c,x,y,s=1,open=false){c.save();c.translate(x,y);c.scale(s,s);rect(c,'#445949',0,0,32,27);rect(c,'#c6a958',3,2,26,21);rect(c,'#9d864d',8,2,3,21);rect(c,'#9d864d',22,2,3,21);rect(c,'#445949',9,-5,15,3);rect(c,'#445949',9,-5,3,6);rect(c,'#445949',21,-5,3,6);rect(c,'#e9dbaa',14,9,9,7);rect(c,'#445949',4,26,4,3);rect(c,'#445949',24,26,4,3);if(open){rect(c,'#7c865e',-27,3,27,23);rect(c,'#e9e5c9',-23,7,18,12);}c.restore();}

export function africaHitPath(){return [...AFRICA].map(v=>{const x=54+(v%180)*3.4,y=36+Math.floor(v/180)*3.4;return `M${x} ${y}h3.4v3.4h-3.4z`;}).join('');}
export function drawMiniMap(canvas,type='home'){
 const c=context(canvas,64,64);rect(c,'#b9c69c',0,0,64,64);
 const water=['island','sea','coast','falls','river'].some(x=>type.includes(x));
 if(water){poly(c,'#839e94',[[0,0],[28,0],[24,13],[35,26],[25,40],[31,64],[0,64]]);for(let y=6;y<64;y+=12)rect(c,'#b1c6ac',4,y,12,2);}
 else {for(let y=8;y<64;y+=16)for(let x=7;x<64;x+=18)rect(c,'#91a579',x,y,3,3);}
 if(type==='home'||type==='room'||type==='hotel'){rect(c,'#7b9069',10,9,43,44);rect(c,'#c8cea8',14,13,35,36);rect(c,'#9bad82',17,17,13,10);rect(c,'#8b9e75',39,15,6,14);rect(c,'#c8cea8',30,46,9,9);}
 else {poly(c,'#d6cb9a',[[39,0],[44,0],[39,20],[47,39],[43,64],[38,64],[42,39],[34,21]]);rect(c,'#718b65',48,13,9,7);rect(c,'#718b65',24,44,7,6);}
 rect(c,'#e7cd7d',32,32,7,7);rect(c,'#354f3b',34,34,3,3);
}
