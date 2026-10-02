// Rotate authored sprites by inverse sampling onto an integer grid. The result
// contains opaque pixel clusters and transparent space, never smoothed edges.
export function tiltSprite(target,source,width,height,degrees,scale=1,shadowDepth=2){
 target.width=width;target.height=height;const ctx=target.getContext('2d');ctx.imageSmoothingEnabled=false;
 const src=source.getContext('2d').getImageData(0,0,source.width,source.height),out=ctx.createImageData(width,height);
 const a=degrees*Math.PI/180,cos=Math.cos(a),sin=Math.sin(a);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const dx=x+.5-width/2,dy=y+.5-height/2,sx=Math.floor((cos*dx+sin*dy)/scale+source.width/2),sy=Math.floor((-sin*dx+cos*dy)/scale+source.height/2);
  if(sx<0||sy<0||sx>=source.width||sy>=source.height)continue;
  const i=(sy*source.width+sx)*4,j=(y*width+x)*4;if(!src.data[i+3])continue;
  out.data.set(src.data.subarray(i,i+4),j);
 }
 // A short, sharply stepped contact shadow makes the objects sit on the paper.
 const shadow=ctx.createImageData(width,height);
 for(let y=0;shadowDepth>0&&y<height-shadowDepth;y++)for(let x=0;x<width-1;x++)if(out.data[(y*width+x)*4+3]){const i=((y+shadowDepth)*width+x+1)*4;shadow.data.set([101,113,79,160],i);}
 ctx.putImageData(shadow,0,0);const temp=document.createElement('canvas');temp.width=width;temp.height=height;temp.getContext('2d').putImageData(out,0,0);ctx.drawImage(temp,0,0);
}
