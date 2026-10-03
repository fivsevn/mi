import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
async function pullToDepart(p){await p.locator('[data-action=packing-confirm]').click();const stage=await p.locator('.packing-stage').boundingBox(),a=await p.locator('[data-pull-handle]').boundingBox();await p.mouse.move(a.x+a.width/2,a.y+26);await p.mouse.down();await p.mouse.move(a.x+a.width/2,a.y+26-stage.width*.16-2,{steps:10});await p.mouse.up();}
const origin=process.env.MI_TEST_URL||'http://127.0.0.1:4173';
const widths=[[320,568],[375,600],[390,660],[390,844],[560,1000],[900,600]];
await mkdir('/tmp/mi-paper-scroll',{recursive:true});

async function enter(page){
 await page.goto(origin);await page.waitForSelector('.font-ready');
 await page.locator('[data-action=journey]').click();
 await page.locator('[data-action=phone]').click();
 await page.locator('[data-action=unlock]').click();
 await page.locator('.route-pin.ready').click();
 await page.locator('.story-copy').waitFor();
}
async function reset(page){
 await page.locator('.paper-stack').evaluate(e=>e.scrollTop=0);
 await page.waitForTimeout(150);
}
async function scrollTop(page){return page.locator('.paper-stack').evaluate(e=>e.scrollTop);}
async function point(page,selector){
 const r=await page.locator(selector).first().boundingBox();
 return {x:r.x+r.width/2,y:r.y+Math.min(r.height/2,30)};
}
async function wheel(page,selector,delta){
 const {x,y}=await point(page,selector);await page.mouse.move(x,y);
 await page.mouse.wheel(0,delta);await page.waitForTimeout(250);
}
async function swipe(page,cdp,selector,delta){
 const {x,y}=await point(page,selector);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
 for(let i=1;i<=12;i++){
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-delta*i/12}]});
  await page.waitForTimeout(25);
 }
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await page.waitForTimeout(600);
}
async function fixed(page,scene){
 assert.deepEqual(await page.locator('.scene-panel').boundingBox(),scene,'Photograph must stay fixed');
 assert.equal(await page.evaluate(()=>scrollY),0);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
}

for(const name of ['chromium','webkit']){
 const browser=await ({chromium,webkit})[name].launch();
 const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await enter(page);
 for(const [width,height]of widths){
  await page.setViewportSize({width,height});await page.waitForTimeout(150);await reset(page);
  const scene=await page.locator('.scene-panel').boundingBox();
  for(const selector of ['.story-copy','.paper-option']){
   await reset(page);await wheel(page,selector,120);
   const range=await page.locator('.paper-stack').evaluate(e=>e.scrollHeight-e.clientHeight);
   assert.ok(range>0?await scrollTop(page)>10:await scrollTop(page)===0,`${name} ${width}: overflowing ${selector} must scroll up`);
   await fixed(page,scene);await wheel(page,selector,-300);
   assert.ok(await scrollTop(page)<2,`${name} ${width}: ${selector} must scroll back down`);
  }
  // The leading spacer passes clicks through to the photograph's objects.
  for(const selector of ['.pocket-phone','.pocket-map']){
   const {x,y}=await point(page,selector);
   assert.ok(await page.evaluate(({x,y,selector})=>!!document.elementFromPoint(x,y)?.closest(selector),{x,y,selector}));
  }
  await wheel(page,'.paper-option',10000);
  const atEnd=await scrollTop(page);
  await wheel(page,'.paper-option',10000);
  assert.equal(await scrollTop(page),atEnd,'Scroll must have a finite end');
  const pile=await page.locator('.paper-pile').boundingBox();
  assert.ok(pile.y>=-1,'Papers must not scroll away');
  if(atEnd>0)assert.ok(Math.abs(pile.y+pile.height-height+8)<2,'Scrolling stops with all remaining options visible');
  await page.screenshot({path:`/tmp/mi-paper-scroll/${name}-${width}-over-photo.png`});
  await reset(page);
 }
 await page.setViewportSize({width:375,height:600});await reset(page);
 await page.locator('.pocket-map').click();assert.equal(await page.locator('.location-whisper').isVisible(),true);
 await page.locator('.paper-stack').evaluate(e=>e.scrollTop=20);await page.waitForTimeout(150);
 await page.locator('.pocket-phone').click();await page.locator('[data-action=unlock]').click();
 await page.locator('[data-app=chat]').click();await page.locator('[data-action=close-phone]').click();
 assert.equal(await scrollTop(page),20,'Phone return must restore paper position');
 await reset(page);await page.locator('[data-action=reason]').first().click();
 await page.locator('[data-action=packing-close]').first().click();
 await pullToDepart(page);
 assert.equal(await page.locator('.choice[data-action=choose]').count()>0,true);
 await page.locator('.choice[data-action=choose]').first().click();
 await page.locator('[data-action=next]').click();assert.equal(await page.locator('.play-screen').count(),1);
 assert.deepEqual(errors,[]);await browser.close();
 console.log(`PASS ${name}: upper/lower paper wheel scrolling, bounds, fixed photo, exposed phone/map, phone return, packing and story flow at six sizes`);
}

const browser=await chromium.launch();
for(const [width,height]of widths.slice(0,5)){
 const context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
 const page=await context.newPage();await enter(page);
 const cdp=await context.newCDPSession(page),scene=await page.locator('.scene-panel').boundingBox();
 for(const phase of ['opening','airport']){
  if(phase==='airport'){await reset(page);await page.locator('[data-action=reason]').first().click();await page.locator('[data-action=packing-close]').first().click();await pullToDepart(page);}
  const range=await page.locator('.paper-stack').evaluate(e=>e.scrollHeight-e.clientHeight);
  for(const selector of ['.story-copy','.paper-option']){
   await reset(page);await swipe(page,cdp,selector,100);
   assert.ok(range>0?await scrollTop(page)>10:await scrollTop(page)===0,`${width} ${phase}: native swipe on ${selector} must reveal overflow`);
   await fixed(page,scene);await swipe(page,cdp,selector,-150);
   assert.ok(await scrollTop(page)<5,`${width} ${phase}: native swipe must scroll back down`);
  }
 }
 assert.equal(await page.evaluate(()=>getSelection().toString()),'');
 assert.equal(await page.locator('.choice[data-action=choose]').count()>0,true,'Swipe must not activate an airport choice');
 await context.close();console.log(`PASS native touch ${width}×${height}: both papers scroll in both directions, fixed photograph/page, no accidental choice`);
}
await browser.close();
