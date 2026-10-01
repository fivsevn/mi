import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
for(const browser of [chromium,webkit]){
 const b=await browser.launch(),p=await b.newPage({viewport:{width:390,height:844}});
 await p.clock.install({time:new Date('2026-10-02T03:40:00')});
 await p.goto('http://localhost:4173');await p.waitForSelector('.font-ready');
 assert.equal(await p.locator('.atlas-hint').count(),0);assert.equal(await p.locator('.desk-phone').evaluate(e=>getComputedStyle(e,'::after').content),'none');
 await p.locator('[data-action=phone]').click();assert.equal(await p.locator('.back-link').count(),0);assert.equal(await p.locator('[data-action=close-phone]').count(),1);
 assert.equal(await p.locator('.phone-status [data-clock]').innerText(),'03:40');await p.locator('.phone-home').click();assert.equal(await p.locator('.phone-scene').count(),0);
 await p.locator('[data-action=journey]').click();await p.locator('.route-pin.ready').click();await p.locator('[data-action=phone]').click();await p.locator('.unlock').click();
 await p.locator('[data-app=settings]').click();await p.clock.fastForward(60000);assert.equal(await p.locator('.phone-status [data-clock]').innerText(),'03:41');assert.equal(await p.locator('.settings-app').count(),1);assert.equal(await p.locator('.settings-app [data-action=map],.settings-app [data-action=continue]').count(),0);
 await p.locator('[data-action=phone-home]').click();await p.locator('[data-app=chat]').click();assert.equal(await p.locator('.contact>.crystal-surface').count(),6);await p.locator('[data-action=contact]').first().click();assert.ok(await p.locator('.bubble>.crystal-surface').count());
 for(const [width,height]of [[320,568],[390,844],[1440,1000]]){await p.setViewportSize({width,height});const rect=await p.locator('.phone-home').boundingBox();assert.ok(rect.height>=44&&rect.y+rect.height<=height);assert.ok(await p.locator('.pixel-phone').evaluate(e=>e.getBoundingClientRect().top>=0));}
 await p.locator('.phone-home').click();assert.ok(await p.locator('.play-screen').count());assert.equal(await p.locator('.phone-scene').count(),0);
 console.log('PASS',browser.name(),'clock ticks without rerender, sole exit Home from lock and apps, play restored, crystal contacts and bubbles, wide/narrow Home reachable');await b.close();
}
