// Optional browser integration checks. Set PLAYWRIGHT_MODULE and CHROME_PATH
// when Playwright / Chrome are provided outside this project.
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {africa} from '../data/routes/africa-001.js';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
const origin=process.env.MI_TEST_URL||'http://127.0.0.1:4173';
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
await context.addInitScript(()=>{Math.random=()=>.2;});
const page=await context.newPage();const errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url());});
const click=async(action,extra='')=>page.locator(`[data-action="${action}"]${extra}`).first().click();
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mi-v02')));
const fit=async()=>assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
await mkdir('test-results',{recursive:true});
await page.goto(origin);await page.waitForSelector('#world-map');await fit();
assert.equal(await page.locator('.region').count(),7);
await click('region','[data-region="asia"]');assert.match(await page.locator('.route-card').innerText(),/NO FIELD RECORD/);
await click('region','[data-region="africa"]');await page.screenshot({path:'test-results/mobile-map.png',fullPage:true});
for(const kind of ['heavy','light','sea']){
 await click('start');await click('reason','[data-id="2"]');assert.match(await page.locator('.pack-heading').innerText(),/18.6/);
 await click('preset');
 if(kind==='heavy'){
  for(const id of ['coat','spare'])await click('item',`[data-id="${id}"]`);
  await click('tab','[data-tab="随身物"]');for(const id of ['lens','tripod'])await click('item',`[data-id="${id}"]`);
  assert.equal((await state()).run.bag.length,20);
  // Cross 20 kg and verify departure is blocked, then take the towel out.
  await click('tab','[data-tab="日用"]');await click('item','[data-id="towel"]');assert.equal(await page.locator('[data-action="depart"]').isDisabled(),true);await click('item','[data-id="towel"]');
 }
 await click('equip','[data-id="stripe"]');assert.equal((await state()).run.outfit.top,'stripe');
 await fit();await page.screenshot({path:`test-results/${kind}-packing.png`,fullPage:true});await click('depart');
 let safety=0;
 while((await state()).run.stage!=='return-pack'){
  assert.ok(++safety<100);let before=await state();const r=before.run;
  // Refresh at each saved phase, then resume through the public map control.
  await page.reload();await click('continue');const after=await state();assert.deepEqual(after,before);
  await fit();assert.doesNotMatch(await page.locator('#app').innerText(),/疲劳值|体力\s*\d|好感度|人格数值/);
  if(r.stage==='event'){
   const n=africa.nodes[r.node];let choice=0;if(kind==='sea'&&(n.id==='beach'||n.id==='island-wind'))choice=2;
   if(n.id==='safari-moment')choice=1;
   if(n.id==='safari-morning'&&kind==='heavy')await page.screenshot({path:'test-results/mobile-safari.png',fullPage:true});
   if(n.id==='beach'&&kind==='heavy')await page.screenshot({path:'test-results/mobile-beach.png',fullPage:true});
   await click('choose',`[data-index="${choice}"]`);
  }else if(r.stage==='result')await click('next');
  else if(r.stage==='social'){assert.match(await page.locator('.social-quote').innerText(),/^不知道为什么，突然想发给TA。$/);await click(kind==='light'?'social-skip':'send',kind==='light'?'':'[data-contact="qi"]');}
  else if(r.stage==='chat'){if(kind==='heavy')await page.screenshot({path:'test-results/mobile-chat.png',fullPage:true});await click('social-done');}
 }
 if(kind==='heavy'){
  assert.match(await page.locator('[data-action="return-finish"]').innerText(),/超重费/);
  await click('wear','[data-id="boots"]');await click('wear','[data-id="coat"]');await click('carry','[data-id="book"]');
  // Taking them back out must restore exactly the same fee.
  await click('wear','[data-id="boots"]');await click('wear','[data-id="coat"]');await click('carry','[data-id="book"]');
 }else if(kind==='light'){
  await click('discard','[data-id="toy"]');await click('restore');await click('restore-item','[data-id="toy"]');assert.ok((await state()).run.bag.includes('toy'));
  for(const id of ['laundry','wash','boots','hippo','cloth'])await click('discard',`[data-id="${id}"]`);
 }
 await page.screenshot({path:`test-results/${kind}-return-pack.png`,fullPage:true});
 await click('return-finish');await click('finish',`[data-ending="${kind}"]`);assert.equal((await state()).records.at(-1).endingId,kind);
 await page.screenshot({path:`test-results/${kind}-ending.png`,fullPage:true});await page.reload();await click('records');await click('record');await click('map');
}
const p=await state();assert.equal(p.records.length,3);assert.equal(p.messages.length,6);assert.equal(p.contacts.qi,6);
await click('phone');await click('contact','[data-contact="qi"]');assert.equal(await page.locator('.chat-thread').count(),6);await click('map');
await click('start');await click('reason');await click('menu');await click('restart');await click('confirm-start');assert.equal((await state()).records.length,3);assert.equal((await state()).messages.length,6);await click('map');
await page.setViewportSize({width:1440,height:1060});await fit();await page.screenshot({path:'test-results/desktop-map.png',fullPage:true});
for(const width of [320,360,768,1024]){await page.setViewportSize({width,height:900});await fit();}
// Existing early-game save is left untouched and the earlier prototype still runs.
await page.evaluate(()=>localStorage.setItem('mi-v01',JSON.stringify({started:false})));
await page.goto(origin+'/legacy/');assert.equal(await page.locator('h1').innerText(),'米米环游世界');await page.goto(origin);assert.ok(await page.locator('a[href="legacy/"]').count());
assert.equal(await page.evaluate(()=>localStorage.getItem('mi-v01')),JSON.stringify({started:false}));
// Denied storage must not stop an in-memory game.
const blocked=await browser.newContext({viewport:{width:390,height:844}});await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new DOMException('denied','SecurityError')};Storage.prototype.getItem=()=>{throw new DOMException('denied','SecurityError')};});
const blockedPage=await blocked.newPage();blockedPage.on('pageerror',e=>errors.push(e.message));await blockedPage.goto(origin);await blockedPage.locator('[data-action="start"]').click();await blockedPage.locator('[data-action="reason"]').first().click();await blockedPage.locator('[data-action="depart"]').click();assert.match(await blockedPage.locator('#save-status').innerText(),/无法存档/);assert.ok(await blockedPage.locator('[data-action="choose"]').count());
assert.deepEqual(errors,[]);console.log('PASS: three complete UI playthroughs, reload every phase, 3 records, chat history, overweight/wardrobe/return handling, 320–1440px, legacy and denied-storage fallback.');
await browser.close();
