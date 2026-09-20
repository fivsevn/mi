import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.MI_TEST_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
for(const name of (process.env.MI_BROWSER||'chromium,webkit').split(',')){
 const browser=await (name==='webkit'?webkit:chromium).launch({headless:true,...(name==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const click=async(a,extra='')=>page.locator(`[data-action="${a}"]${extra}`).first().click();
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mi-v02')));
 const fit=async()=>{assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'viewport overflow');assert.ok(await page.locator('.app-shell').evaluate(e=>e.getBoundingClientRect().width<=440),'portrait width');};
 await page.goto(origin);await page.waitForSelector('.font-ready');assert.ok(await page.evaluate(()=>document.fonts.check('12px Pixel')));await fit();await page.screenshot({path:`test-results/${name}-map.png`});
 assert.equal(await page.locator('.desk-pencil,.coffee-ring,.pencil-circle').count(),0);
 await click('phone');await click('unlock');await click('contact','[data-contact="he"]');await click('hello');await page.reload();await click('unlock');assert.match(await page.locator('.chat-thread').innerText(),/下次拍给我看/);await click('map');
 await click('journey');await click('reason');await click('open-case');await click('preset');await click('item','[data-id="coat"]');await click('tab','[data-tab="随身物"]');await click('item','[data-id="adapter"]');await click('tab','[data-tab="日用"]');await click('item','[data-id="airfryer"]');await fit();await page.screenshot({path:`test-results/${name}-packing.png`,fullPage:true});
 assert.doesNotMatch(await page.locator('#app').innerText(),/\d+\.\d+ kg/);await click('depart');
 let count=0,miniCount=0;
 while((await state()).run.stage!=='return-pack'){
  assert.ok(++count<240);const before=await state(),r=before.run;
  if(r.stage==='event'){
   if(await page.locator('.mini-game').count()){
    miniCount++;const kind=await page.locator('.mini-game').getAttribute('data-game');
    if(kind==='falls'){await click('mini-tap');await click('mini-tap');await click('mini-tap');assert.ok(await page.locator('body.soaked').count());}
    else if(kind==='bus'){await click('mini-tap','[data-kind="2"]');await page.waitForTimeout(1000);await page.reload();await page.locator('.npc-here').waitFor({timeout:15000});assert.match(await page.locator('.mini-text').innerText(),/有人来了/);}
    else{for(let i=0;i<12;i++)await click('mini-tap');}
    await page.locator('.mini-done:not([hidden])').waitFor({timeout:30000});await page.screenshot({path:`test-results/${name}-${kind}.png`});await click('mini-finish');
   }else{
    if(count%7===0){await page.reload();assert.deepEqual(await state(),before);await fit();}
    const fryer=page.getByRole('button',{name:/拿出空气炸锅/});const goggles=page.getByRole('button',{name:/^01\s*戴/});const broken=page.getByRole('button',{name:/换一个/});
    if(await fryer.count())await fryer.click();else if(await goggles.count())await goggles.click();else if(await broken.count())await broken.click();else await page.locator('[data-action="choose"]:not([disabled])').first().click();
   }
  }else if(r.stage==='result'){
   if(count===2){await click('location');assert.match(await page.locator('#modal').innerText(),/DAY 1 \/ 42/);await click('archive');assert.ok(await page.locator('.archive-pages').count());await click('close');}
   await click('next');
  }else if(r.stage==='social'){await click('unlock');await click('send','[data-contact="qi"]');}else if(r.stage==='chat')await click('social-done');else throw Error(r.stage);
 }
 assert.equal(miniCount,3);const r=(await state()).run;assert.ok(r.flags.goggles);assert.equal(r.used.airfryer,1);assert.ok(r.bag.includes('broken-adapter'));assert.ok(!r.bag.includes('adapter'));assert.ok(r.itemHistory.length>=2);
 await click('return-finish');await click('finish','[data-ending="next"]');assert.ok(await page.locator('.home-case').count());await page.screenshot({path:`test-results/${name}-home.png`,fullPage:true});await click('inspect');await page.locator('summary').click();assert.match(await page.locator('#modal').innerText(),/拿出来用过/);await click('close');await click('map');assert.equal(await page.locator('.memory-icon').count(),4);
 await click('journal');await click('archive');assert.ok(await page.locator('.archive-pages').count());await click('close');await click('map');
 for(const width of [320,360,440,768,1440]){await page.setViewportSize({width,height:900});await fit();await click('phone');await click('unlock');await fit();await click('map');}
 await page.screenshot({path:`test-results/${name}-desktop.png`});
 await page.evaluate(()=>localStorage.setItem('mi-v01','untouched'));await page.goto(origin+'/legacy/');await page.waitForSelector('#world-map');assert.equal(await page.evaluate(()=>localStorage.getItem('mi-v01')),'untouched');
 const blocked=await browser.newContext({viewport:{width:320,height:700}});await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('denied')};Storage.prototype.setItem=()=>{throw Error('denied')};});const bp=await blocked.newPage();await bp.goto(origin);await bp.locator('[data-action=journey]').click();await bp.locator('[data-action=reason]').first().click();await bp.locator('[data-action=depart]').click();assert.match(await bp.locator('#save-status').innerText(),/无法存档/);
 assert.deepEqual(errors,[]);console.log(`PASS ${name}: complete 42-day journey, 3 real-time mini games, inventory hooks, save reload, phone, archives, home suitcase, 320–1440px, denied storage, legacy.`);await browser.close();
}
