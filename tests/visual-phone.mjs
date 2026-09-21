import assert from 'node:assert/strict';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
for(const name of ['chromium','webkit']){
 const browser=await (name==='webkit'?webkit:chromium).launch({headless:true,...(name==='chromium'?{executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'}:{})});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [width,height]of [[320,568],[390,844],[1440,900]]){
  await page.setViewportSize({width,height});await page.goto(process.env.MI_TEST_URL||'http://127.0.0.1:4173');await page.waitForSelector('.font-ready');
  assert.equal(await page.locator('#world-map').evaluate(c=>getComputedStyle(c).objectFit),'contain');assert.equal(await page.locator('.map-hit').getAttribute('preserveAspectRatio'),'xMidYMid meet');
  await page.screenshot({path:`/tmp/mi-${name}-${width}-map.png`});
  await page.locator('[data-action=journey]').click();await page.locator('[data-action=phone]').click();
  await page.locator('#lock-selfie').waitFor();assert.ok(await page.locator('#lock-selfie').evaluate(c=>new Set(c.getContext('2d').getImageData(0,0,c.width,c.height).data).size>25));
  assert.ok(await page.locator('.unlock').isVisible());await page.screenshot({path:`/tmp/mi-${name}-${width}-selfie.png`});await page.locator('.unlock').click();await page.locator('[data-app=notes]').click();assert.equal(await page.locator('.phone-note').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight));
 }
 assert.deepEqual(errors,[]);console.log('PASS',name,'map proportions, Africa entry, selfie, unlock, empty notes, fixed viewport at 320/390/1440');await browser.close();
}
