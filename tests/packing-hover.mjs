import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.MI_TEST_URL||'http://127.0.0.1:4173';
for(const [name,engine]of Object.entries({chromium,webkit})){
 const b=await engine.launch(),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin);await p.waitForSelector('.font-ready');for(const a of ['journey','phone','unlock'])await p.locator(`[data-action=${a}]`).click();await p.locator('.route-pin.ready').click();await p.locator('[data-action=reason]').first().click();
 const lock=p.locator('.suitcase-zipper'),glow=p.locator('.lock-glow');await p.mouse.move(2,2);assert.equal(await glow.evaluate(e=>getComputedStyle(e).opacity),'0');
 await lock.hover();assert.equal(await lock.evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0)');assert.equal(await glow.evaluate(e=>getComputedStyle(e).opacity),'1');
 const mask=await glow.evaluate(c=>{const d=c.getContext('2d').getImageData(0,0,c.width,c.height).data;let count=0;for(let i=3;i<d.length;i+=4)if(d[i])count++;return {count,total:c.width*c.height};});assert.ok(mask.count>100&&mask.count<mask.total*.01,'only the small prop contour glows, not the hit rectangle or suitcase');
 if(name==='chromium')await p.screenshot({path:'/tmp/mi-hover34-lock.png'});await p.mouse.move(2,2);assert.equal(await glow.evaluate(e=>getComputedStyle(e).opacity),'0');
 const slot=p.locator('.packing-slot').first(),normal=await slot.evaluate(e=>getComputedStyle(e).backgroundColor);await slot.hover();assert.equal(await slot.evaluate(e=>getComputedStyle(e).backgroundColor),normal);assert.match(await slot.locator('canvas').evaluate(e=>getComputedStyle(e).filter),/drop-shadow/);
 await lock.click();for(const [action,klass]of [['packing-confirm','confirm-glow'],['packing-edit','edit-glow']]){const key=p.locator(`[data-action=${action}]`);await key.hover();assert.equal(await key.evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0)');assert.equal(await p.locator(`.${klass}`).evaluate(e=>getComputedStyle(e).opacity),'1');}
 await p.locator('[data-action=packing-edit]').click();assert.equal(await p.locator('.packing-scale').count(),0);await lock.click();await p.locator('[data-action=packing-confirm]').click();await p.locator('.suitcase-handle').hover();assert.equal(await p.locator('.handle-glow').evaluate(e=>getComputedStyle(e).opacity),'1');await lock.click();assert.equal(await p.locator('.packing-screen:not(.case-closed)').count(),1);
 await p.mouse.move(2,2);await lock.focus();assert.equal(await lock.evaluate(e=>getComputedStyle(e).outlineStyle),'none');await p.keyboard.press('Enter');assert.equal(await p.locator('.packing-review').count(),1);assert.deepEqual(errors,[]);await b.close();console.log(`PASS ${name}: contour-only lock/handle/key glow, no hover rectangles, unchanged item cells, keyboard and mouse open/close`);
}
