// A narrow paper edge. Folds never cut through the landmarks or coordinates.
export function finishPaper(canvas,{mini=false}={}){
 const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height,e=mini?1:3;
 c.fillStyle='#d6cba0';c.fillRect(0,0,w,e);c.fillRect(0,0,e,h);c.fillStyle='#82916d';c.fillRect(w-e,0,e,h);c.fillRect(0,h-e,w,e);
 c.fillStyle='#ede0b2';c.fillRect(e,e,w-2*e,1);c.fillRect(e,e,1,h-2*e);
}
