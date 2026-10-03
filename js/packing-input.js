// Pointer capture keeps a held object attached to mouse, pen or finger.
// Tap is handled by the ordinary buttons, including keyboard activation.
export function installPackingInput(onDrop,onEdgePan,onInspect){
 let drag=null,suppress=null,edgeFrame=0,edgeDirection=0,edgeSince=0;
 document.addEventListener('pointerdown',e=>{
  const button=e.target.closest('[data-pack-id]');if(!button||e.button!==0||button.closest('.case-closed'))return;
  if(button.dataset.packZone==='floor'&&!e.target.matches('canvas'))return;
  drag={button,id:button.dataset.packId,pointer:e.pointerId,x:e.clientX,y:e.clientY,source:button.dataset.packZone,moved:false};
  if(e.pointerType==='touch'&&button.dataset.packZone==='floor'){
   const bounds=button.querySelector('canvas').getBoundingClientRect();
   // Mobile browsers can retarget a tap in the slot margin onto its nearby icon.
   // Use the actual contact point so that blank margins still scroll the shelf.
   if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom){drag.shelf=button.closest('.packing-shelf');drag.scrollTop=drag.shelf.scrollTop;}
  }
  edgeDirection=0;edgeSince=0;button.setPointerCapture(e.pointerId);
 });
 document.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==drag.pointer)return;
  if(!drag.moved&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)<7)return;
  e.preventDefault();
  if(drag.shelf){drag.moved=true;drag.shelf.scrollTop=drag.scrollTop+drag.y-e.clientY;return;}
  if(!drag.moved){
   drag.moved=true;onInspect?.(drag.id);const original=drag.button.querySelector('canvas'),ghost=document.createElement('canvas');ghost.width=32;ghost.height=32;ghost.getContext('2d').drawImage(original,0,0);ghost.className='packing-ghost';document.body.append(ghost);drag.ghost=ghost;drag.button.classList.add('packing-held');
  }
  drag.ghost.style.left=e.clientX+'px';drag.ghost.style.top=e.clientY+'px';drag.point={x:e.clientX,y:e.clientY};
  if(!edgeFrame)edgeFrame=requestAnimationFrame(edgePan);
  const target=dropTarget(e.clientX,e.clientY);
  document.querySelectorAll('[data-pack-drop]').forEach(el=>el.classList.toggle('drop-ready',el===target));
 });
 function dropTarget(x,y){
  const hit=document.elementFromPoint(x,y)?.closest('[data-pack-drop]');if(hit)return hit;
  const viewport=document.querySelector('.packing-panorama')?.getBoundingClientRect();
  if(!viewport||x<viewport.left||x>viewport.right||y<viewport.top||y>viewport.bottom)return null;
  return [...document.querySelectorAll('.packing-bay')].find(el=>{const b=el.getBoundingClientRect();return x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;});
 }
 function edgePan(){
  edgeFrame=0;if(!drag?.moved)return;
  const view=document.querySelector('.packing-panorama')?.getBoundingClientRect(),p=drag.point;
  if(view&&p.y>view.top&&p.y<view.bottom){const band=Math.min(64,view.width*.18),direction=p.x>=view.left&&p.x<view.left+band?-1:p.x<=view.right&&p.x>view.right-band?1:0;if(direction!==edgeDirection){edgeDirection=direction;edgeSince=performance.now();}if(direction&&performance.now()-edgeSince>200)onEdgePan?.(direction);}else{edgeDirection=0;edgeSince=0;}
  edgeFrame=requestAnimationFrame(edgePan);
 }
 function finish(e,cancel=false){
  if(!drag||e.pointerId!==drag.pointer)return;const d=drag;drag=null;
  cancelAnimationFrame(edgeFrame);edgeFrame=0;d.ghost?.remove();d.button.classList.remove('packing-held');document.querySelectorAll('.drop-ready').forEach(el=>el.classList.remove('drop-ready'));
  if(!d.moved)return;
  suppress=d.button;setTimeout(()=>suppress=null,350);
  if(d.shelf)return;
  const target=!cancel&&dropTarget(e.clientX,e.clientY);
  if(target)onDrop(d.id,target.dataset.packDrop,d.source,{x:e.clientX,y:e.clientY});
 }
 document.addEventListener('pointerup',e=>finish(e));document.addEventListener('pointercancel',e=>finish(e,true));
 document.addEventListener('click',e=>{if(suppress&&e.target.closest('[data-pack-id]')===suppress){e.preventDefault();e.stopImmediatePropagation();suppress=null;}},true);
 document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-pack-id]'))e.preventDefault();});
}

// The camera slides over a full-size, two-sided case. Items keep their own capture.
export function installSuitcaseInput(onPan){
 let slide=null,suppress=null;
 document.addEventListener('pointerdown',e=>{
  const view=e.target.closest('.packing-panorama');
  if(!view||e.button!==0||view.closest('.case-closed')||e.target.closest('button'))return;
  slide={view,pointer:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,moved:false};
 });
 document.addEventListener('pointermove',e=>{
  if(!slide||e.pointerId!==slide.pointer)return;
  const dx=e.clientX-slide.x,dy=e.clientY-slide.y;
  if(!slide.moved&&Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){clear();return;}
  if(!slide.moved&&Math.abs(dx)<7)return;
  e.preventDefault();if(!slide.moved)slide.view.setPointerCapture(e.pointerId);slide.moved=true;slide.view.classList.add('case-sliding');
  onPan((slide.lastX-e.clientX)/slide.view.clientWidth);slide.lastX=e.clientX;
 },{passive:false});
 function clear(){
  if(!slide)return;slide.view.classList.remove('case-sliding');if(slide.view.hasPointerCapture(slide.pointer))slide.view.releasePointerCapture(slide.pointer);slide=null;
 }
 function finish(e){if(!slide||e.pointerId!==slide.pointer)return;if(slide.moved){suppress=slide.view;setTimeout(()=>suppress=null,350);}clear();}
 document.addEventListener('pointerup',finish);document.addEventListener('pointercancel',finish);
 document.addEventListener('click',e=>{if(suppress&&e.target.closest('.packing-panorama')===suppress){e.preventDefault();e.stopImmediatePropagation();suppress=null;}},true);
}


// Completing an upward pull is the departure gesture. Taps do nothing.
export function installSuitcasePullInput(getState,onPull){
 let pull=null;
 document.addEventListener('pointerdown',e=>{
  const button=e.target.closest('[data-pull-handle]'),state=getState();if(!button||e.button!==0||!state)return;
  e.preventDefault();button.setPointerCapture(e.pointerId);pull={button,pointer:e.pointerId,y:e.clientY,distance:state.distance,progress:0,moved:false};
 });
 document.addEventListener('pointermove',e=>{
  if(!pull||e.pointerId!==pull.pointer)return;const delta=pull.y-e.clientY;if(!pull.moved&&Math.abs(delta)<5)return;
  e.preventDefault();pull.moved=true;const progress=Math.round(Math.max(0,Math.min(1,delta/pull.distance))*16)/16;
  if(progress!==pull.progress){pull.progress=progress;onPull(progress,false);}
 },{passive:false});
 function finish(e,cancel){
  if(!pull||e.pointerId!==pull.pointer)return;const p=pull;pull=null;if(p.button.hasPointerCapture(e.pointerId))p.button.releasePointerCapture(e.pointerId);
  if(!p.moved)return;onPull(!cancel&&p.progress===1?1:0,!cancel&&p.progress===1);
 }
 document.addEventListener('pointerup',e=>finish(e,false));document.addEventListener('pointercancel',e=>finish(e,true));
}
