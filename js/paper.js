// Folded sheets and shadows are integer pixel geometry, shared at three scales.
export function finishPaper(canvas,{mini=false}={}){
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,source=c.getImageData(0,0,w,h),out=c.createImageData(w,h),e=mini?2:5,p=mini?1:2;
 const put=(x,y,col)=>{if(x<0||x>=w||y<0||y>=h)return;const i=(y*w+x)*4;out.data.set([...col,255],i);};
 for(let y=e;y<h-e;y++)for(let x=e;x<w-e;x++){
  const panel=Math.floor(x/w*(mini?2:4)),left=e+(y<h*.1?p:y>h*.88?2*p:0),right=w-e-(y<h*.24?2*p:y<h*.72?p:0);
  if(x<left||x>=right||(y<e+p*2&&panel%2)||(y>h-e-p*2&&!(panel%2)))continue;
  const i=(y*w+x)*4,margin=mini?2:6,header=mini?0:25;
  let col=x<left+margin||x>right-margin||y<e+header||y>h-e-margin?[217,210,173]:[source.data[i],source.data[i+1],source.data[i+2]];
  const shade=panel%2?0:-3;col=col.map(v=>Math.max(0,v+shade));put(x,y,col);
 }
 for(let y=e+2*p;y<h-e+2*p;y++){const right=w-e-(y<h*.24?2*p:y<h*.72?p:0);for(let x=right;x<Math.min(w,right+2*p);x++)if(!out.data[(y*w+x)*4+3])put(x,y,[177,184,151]);}
 for(let x=e+2*p;x<w-e;x++)for(let y=h-e;y<Math.min(h,h-e+2*p);y++)if(!out.data[(y*w+x)*4+3])put(x,y,[177,184,151]);
 for(const f of mini?[.5]:[.25,.5,.75]){const x=Math.floor(w*f/p)*p;for(let y=e+3*p;y<h-e-3*p;y++)for(let dx=-p;dx<p;dx++)put(x+dx,y,dx<0?[190,193,159]:[224,215,181]);}
 const yy=Math.floor(h*.5/p)*p;for(let x=e+2*p;x<w-e-2*p;x++){const shift=Math.floor(x/w*(mini?2:4))%2?p:0;for(let dy=-p;dy<p;dy++)put(x,yy+shift+dy,dy<0?[190,193,159]:[224,215,181]);}
 c.clearRect(0,0,w,h);c.putImageData(out,0,0);
}
