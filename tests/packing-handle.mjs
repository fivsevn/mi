import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
async function enter(p){await p.goto(process.env.MI_TEST_URL||'http://127.0.0.1:4173');await p.waitForSelector('.font-ready');for(const a of ['journey','phone','unlock'])await p.locator(`[data-action=${a}]`).click();await p.locator('.route-pin.ready').click();await p.locator('[data-action=reason]').first().click();await p.locator('.suitcase-zipper').click();await p.locator('[data-action=packing-confirm]').click();}
const state=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('mi-v02')).run);
const height=p=>p.locator('[data-suitcase]').evaluate(c=>c.height);
async function pull(p,delta,finish=true){const a=await p.locator('[data-pull-handle]').boundingBox();await p.mouse.move(a.x+a.width/2,a.y+26);await p.mouse.down();await p.mouse.move(a.x+a.width/2,a.y+26-delta,{steps:10});if(finish)await p.mouse.up();}
for(const [name,engine]of Object.entries({chromium,webkit})){
 const b=await engine.launch(),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await enter(p);
 assert.equal(await height(p),572);assert.equal(await p.locator('.suitcase-leave,[data-action=depart]').count(),0);
 const stage=await p.locator('.packing-stage').boundingBox();await p.mouse.click(stage.x+stage.width*.595,stage.y+stage.height*.245);assert.equal((await state(p)).stage,'packing');
 await p.locator('[data-pull-handle]').click();await p.locator('[data-pull-handle]').press('Enter');assert.equal((await state(p)).stage,'packing');assert.equal(await height(p),572);
 if(name==='chromium')await p.screenshot({path:'/tmp/mi-packing-handle-23-closed.png'});
 await pull(p,7);assert.equal((await state(p)).stage,'packing');assert.equal(await height(p),572);
 await pull(p,stage.width*.16+2,false);assert.equal(await height(p),700);await p.locator('[data-pull-handle]').dispatchEvent('pointercancel',{pointerId:1});await p.mouse.up();assert.equal((await state(p)).stage,'packing');assert.equal(await height(p),572);
 assert.equal(await p.locator('.packing-floor,.packing-scale,.packing-weighing').count(),0);
 const bag=(await state(p)).bag;await p.locator('.suitcase-zipper').click();assert.equal(await p.locator('.packing-screen:not(.case-closed)').count(),1);assert.deepEqual((await state(p)).bag,bag);await p.locator('.suitcase-zipper').click();await p.locator('[data-action=packing-confirm]').click();const saved=await state(p);await p.reload();assert.deepEqual(await state(p),saved);assert.equal(await height(p),572);
 await pull(p,stage.width*.16+2,false);assert.equal((await state(p)).stage,'packing');assert.equal(await height(p),700);const centered=await p.locator('.packing-viewbox').boundingBox();assert.ok(Math.abs(centered.y+centered.height/2-422)<1);assert.equal(await p.evaluate(()=>document.documentElement.scrollHeight>innerHeight),false);
 if(name==='chromium')await p.screenshot({path:'/tmp/mi-packing-handle-23.png'});
 await p.mouse.up();assert.equal((await state(p)).stage,'event');await p.locator('[data-action=choose]').first().click();await p.locator('[data-action=next]').click();assert.equal(await p.locator('.play-screen').count(),1);assert.deepEqual(errors,[]);await b.close();console.log(`PASS ${name}: decorative tag, inert taps/keyboard, partial/cancelled pull, reopen/reload, full pull into story`);
}
const b=await chromium.launch(),ctx=await b.newContext({viewport:{width:320,height:568},isMobile:true,hasTouch:true}),p=await ctx.newPage();await enter(p);const cdp=await ctx.newCDPSession(p),a=await p.locator('[data-pull-handle]').boundingBox(),x=a.x+a.width/2,y=a.y+26,distance=(await p.locator('.packing-stage').boundingBox()).width*.16+2;
await p.locator('[data-pull-handle]').tap();assert.equal((await state(p)).stage,'packing');
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-distance*i/8}]});await p.waitForTimeout(20);}assert.equal(await height(p),700);assert.equal((await state(p)).stage,'packing');assert.equal(await p.evaluate(()=>scrollY),0);assert.equal(await p.locator('.packing-floor,.packing-scale').count(),0);await p.screenshot({path:'/tmp/mi-packing-handle-23-touch.png'});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.equal((await state(p)).stage,'event');await b.close();console.log('PASS native touch: trolley pull at 320px enters next stage; tap stays put');
