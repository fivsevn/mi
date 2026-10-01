import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
for(const type of [chromium,webkit]){
 const b=await type.launch(),p=await b.newPage({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 await p.goto(process.env.MI_TEST_URL||'http://127.0.0.1:4173');await p.waitForSelector('.font-ready');
 await p.locator('[data-action=journey]').tap();await p.locator('[data-action=phone]').tap();await p.locator('[data-action=unlock]').tap();
 const input=p.locator('.map-search-input');assert.ok(parseFloat(await input.evaluate(e=>getComputedStyle(e).fontSize))>=16,'Search input must avoid the iOS small-text focus zoom threshold');
 const before=await p.locator('.pixel-phone').boundingBox();
 await input.tap();await input.fill('塞舌尔');await input.press('Enter');await p.waitForTimeout(400);
 assert.equal(await input.evaluate(e=>e===document.activeElement),false);assert.deepEqual(await p.locator('.pixel-phone').boundingBox(),before);
 await input.tap();await input.fill('');await p.locator('[data-action=map-zoom][data-direction="1"]').tap();
 assert.equal(await input.evaluate(e=>e===document.activeElement),false);assert.equal(await p.locator('.navigation-square').evaluate(e=>e.style.getPropertyValue('--map-zoom')),'1.3');
 await input.tap();await p.locator('[data-action=map-search-clear]').tap();assert.equal(await input.evaluate(e=>e===document.activeElement),false);
 console.log('PASS',type.name(),'search focus dismissal, stable phone bounds and independent map zoom; native iOS keyboard requires device QA');await b.close();
}
