import assert from 'node:assert/strict';
import {mkdir,readFile} from 'node:fs/promises';
import {africa} from '../data/routes/africa-001.js';
import {places} from '../data/routes/africa-stories.js';
const {chromium,webkit}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const origin=process.env.MI_TEST_URL||'http://127.0.0.1:4173';
await mkdir('test-results',{recursive:true});
// Background prose is not shipped behind a hidden button either.
for(const p of places)assert.deepEqual(Object.keys(p).sort(),['coord','end','id','name']);
const appSource=await readFile(new URL('../js/app.js',import.meta.url),'utf8');assert.doesNotMatch(appSource,/archive-pages|data-action="atlas"|item\.use|i\.use|profile\.records\.at\(-1\)/);
for(const name of (process.env.MI_BROWSER||'chromium,webkit').split(',')){
 const browser=await (name==='webkit'?webkit:chromium).launch({headless:true,...(name==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 const ctx=await browser.newContext({viewport:name==='webkit'?{width:320,height:568}:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const page=await ctx.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 const click=async(a,extra='')=>page.locator(`[data-action="${a}"]${extra}`).first().click();
 const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('mi-v02')));
 const fit=async()=>{const sizes=await page.evaluate(()=>({width:innerWidth,height:innerHeight,sw:document.documentElement.scrollWidth,sh:document.documentElement.scrollHeight,body:document.body.scrollHeight,shell:document.querySelector('.app-shell').getBoundingClientRect().width}));assert.ok(sizes.sw<=sizes.width,'horizontal page overflow');assert.ok(sizes.sh<=sizes.height&&sizes.body<=sizes.height,'vertical page overflow');assert.ok(sizes.shell<=440);if(await page.locator('.story-copy').count())assert.ok(await page.locator('.story-copy').evaluate(e=>e.scrollHeight<=e.clientHeight+1),'clipped story');};
 const phone=async(app)=>{await click('phone');await click('unlock');await click('phone-app',`[data-app="${app}"]`);};
 await page.goto(origin);await page.waitForSelector('.font-ready');assert.ok(await page.evaluate(()=>document.fonts.check('12px Pixel')));await fit();
 assert.equal(await page.locator('.desk-journal,.memory-strip,.map-entry,[data-action=atlas],[data-action=archive]').count(),0);
 await page.screenshot({path:`test-results/${name}-pocket-map.png`});
 await phone('notes');assert.equal(await page.locator('.phone-note').count(),0);await click('phone-home');await page.screenshot({path:`test-results/${name}-pocket-apps.png`});await click('close-phone');
 // Old bookmark URLs cannot recover cross-run records or background pages.
 await page.goto(origin+'/#record/previous-run');await page.reload();await click('unlock');assert.equal(await page.locator('.phone-note').count(),0);await click('close-phone');
 await click('journey');await click('reason');await click('open-case');await click('preset');await click('item','[data-id="coat"]');await click('tab','[data-tab="随身物"]');await click('item','[data-id="adapter"]');await click('tab','[data-tab="日用"]');await click('item','[data-id="airfryer"]');
 await fit();assert.ok(await page.locator('.choice-scroll').evaluate(e=>e.scrollHeight>e.clientHeight));assert.equal(await page.evaluate(()=>scrollY),0);assert.doesNotMatch(await page.locator('#app').innerText(),/\d+\.\d+ kg/);await page.screenshot({path:`test-results/${name}-pocket-packing.png`});
 await phone('notes');assert.equal(await page.locator('.phone-note').count(),0);await click('close-phone');await click('depart');
 let count=0,miniCount=0;
 while((await state()).run.stage!=='return-pack'){
  assert.ok(++count<240);const before=await state(),r=before.run;await fit();
  if(r.stage==='event'){
   if(await page.locator('.mini-game').count()){
    miniCount++;const n=africa.nodes[r.node],kind=n.mini;
    if(kind==='falls'){for(let i=0;i<3;i++)await click('mini-tap');assert.ok(await page.locator('body.soaked').count());}
    else if(kind==='bus'){await click('mini-tap','[data-kind="2"]');await page.waitForTimeout(1000);await page.reload();await page.locator('.npc-here').waitFor({timeout:15000});assert.match(await page.locator('.mini-text').innerText(),/有人来了/);}
    else for(let i=0;i<12;i++)await click('mini-tap');
    await page.locator('.mini-done:not([hidden])').waitFor({timeout:30000});await fit();await page.screenshot({path:`test-results/${name}-pocket-${kind}.png`});await click('mini-finish');
   }else{
    if(count%9===0){await page.reload();assert.deepEqual(await state(),before);await fit();}
    const n=africa.nodes[r.node];let index=n.id==='kitchen'?n.choices.findIndex(c=>c.requires==='airfryer'):n.id==='broken-plug'?1:0;
    await click('choose',`[data-index="${index}"]`);
   }
  }else if(r.stage==='result'){
   if(count===2){
    assert.equal(await page.locator('.travel-head').count(),0);await click('location');assert.equal(await page.locator('.location-whisper').isVisible(),true);assert.equal(await page.locator('dialog[open]').count(),0);await page.waitForTimeout(3350);assert.equal(await page.locator('.location-whisper').isVisible(),false);
    await phone('notes');assert.equal(await page.locator('.phone-note').count(),1);assert.doesNotMatch(await page.locator('.notes-app').innerText(),/泳镜|花豹|星期日/);await page.reload();await click('unlock');assert.equal(await page.locator('.phone-note').count(),1);await click('close-phone');
   }
   await click('next');
  }else if(r.stage==='social'){await click('unlock');await click('send','[data-contact="qi"]');}else if(r.stage==='chat')await click('close-phone');else throw Error(r.stage);
 }
 assert.equal(miniCount,3);const r=(await state()).run;assert.ok(r.flags.goggles);assert.equal(r.used.airfryer,1);assert.ok(r.bag.includes('broken-adapter'));assert.ok(!r.bag.includes('adapter'));
 await click('return-finish');await click('finish','[data-ending="next"]');await phone('notes');assert.equal(await page.locator('.ending-note').count(),1);assert.equal(await page.locator('.phone-note:not(.ending-note)').count(),48);await fit();await page.screenshot({path:`test-results/${name}-pocket-notes.png`});
 await click('phone-home');await click('phone-app','[data-app="settings"]');await click('restart');await click('confirm-start');assert.ok((await state()).records.length);await phone('notes');assert.equal(await page.locator('.phone-note').count(),0);await click('phone-home');await click('phone-app','[data-app="chat"]');assert.doesNotMatch(await page.locator('.contact-list').innerText(),/豹子|后脑勺/);await click('close-phone');
 // App navigation must return to the exact scene without advancing it.
 await click('reason');await click('open-case');await click('preset');await click('depart');const saved=await state();await phone('bag');await click('inspect');assert.doesNotMatch(await page.locator('#modal').innerText(),/它在充电。米在床上。/);await click('close');await click('close-phone');assert.deepEqual(await state(),saved);
 for(const [width,height] of [[320,568],[360,640],[390,844],[440,956],[768,900],[1440,1000]]){await page.setViewportSize({width,height});await fit();const h=await page.locator('.scene-panel').evaluate(e=>e.getBoundingClientRect().height);assert.ok(h>height*.35);await phone('bag');await fit();await click('close-phone');await fit();}
 await page.screenshot({path:`test-results/${name}-pocket-desktop.png`});
 await page.evaluate(()=>localStorage.setItem('mi-v01','untouched'));await page.goto(origin+'/legacy/');await page.waitForSelector('#world-map');assert.equal(await page.evaluate(()=>localStorage.getItem('mi-v01')),'untouched');
 const blocked=await browser.newContext({viewport:{width:320,height:568}});await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('denied')};Storage.prototype.setItem=()=>{throw Error('denied')};});const bp=await blocked.newPage();await bp.goto(origin);await bp.locator('[data-action=journey]').click();await bp.locator('[data-action=reason]').first().click();await bp.locator('[data-action=depart]').click();assert.match(await bp.locator('#save-status').innerText(),/无法存档/);
 assert.deepEqual(errors,[]);console.log(`PASS ${name}: complete 48 events; all minigames; no pre-run or cross-run notes; no archives; phone apps; fixed scene, internal menu scroll; 320x568–1440x1000; reload, old routes, legacy and denied storage.`);await browser.close();
}
