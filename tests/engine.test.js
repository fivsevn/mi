import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../js/engine.js';
import {ITEMS,itemById} from '../data/items.js';
import {africa} from '../data/routes/africa-001.js';
import {ENDINGS,returnQuestions} from '../data/endings.js';

function packed(seed=.1){const p=E.freshProfile();p.run=E.createRun('africa-001',seed);p.run.stage='packing';p.run.reason='不知道。';E.preset(p.run);return p;}
function travel({seed=.1,choice=()=>0,share=true,profile=packed(seed)}={}){
 const r=profile.run;assert.ok(E.depart(r));
 while(r.stage!=='return-pack'){
  if(r.stage==='event'){assert.ok(E.choose(r,choice(E.currentNode(r),r)));}
  else if(r.stage==='result')E.afterResult(r);
  else if(r.stage==='social'){if(share)assert.ok(E.sendMessage(profile,'lan'));else E.advance(r);}
  else if(r.stage==='chat')E.advance(r);else throw Error(r.stage);
  assert.ok(r.money>=0);
 }
 return profile;
}
test('20 kg departure limit, exact weight, and no unlimited packing',()=>{
 const p=packed(),r=p.run;assert.equal(E.checkedWeight(r),12);assert.equal(E.carryWeight(r),.4);assert.equal(E.totalWeight(r),12.4);
 ITEMS.filter(i=>!i.souvenir).forEach(i=>E.addItem(r,i.id));assert.ok(E.checkedWeight(r)>20);assert.equal(E.depart(r),false);
 assert.equal(r.stage,'packing');assert.equal(r.money,42000);
});
test('clothing has physical weight and removing it clears paper doll',()=>{
 const r=packed().run;assert.ok(E.equip(r,'top','stripe'));const before=E.totalWeight(r);E.removeItem(r,'stripe');assert.equal(r.outfit.top,null);assert.equal(E.totalWeight(r),before-.4);assert.equal(E.equip(r,'top','stripe'),false);
});
test('return handling conserves total weight, respects hand limit and one item per slot',()=>{
 const r=packed().run;const before=E.totalWeight(r);assert.ok(E.relocate(r,'boots','worn'));assert.equal(E.totalWeight(r),before);assert.equal(E.checkedWeight(r),10.7);
 assert.ok(E.relocate(r,'sandals','worn'));assert.deepEqual(r.worn,['sandals']);assert.equal(E.checkedWeight(r),11.6);
 assert.equal(E.relocate(r,'powerbank','carry'),false);
 E.addItem(r,'spare');E.addItem(r,'tripod');E.relocate(r,'laundry','carry');E.relocate(r,'spare','carry');assert.equal(E.relocate(r,'tripod','carry'),false);assert.ok(E.carryWeight(r)<=7);
});
test('a complete run survives a reload at every scene and records exactly once',()=>{
 let p=packed(.8);E.depart(p.run);
 while(p.run.stage!=='return-pack'){
  const r=p.run;
  if(r.stage==='event')E.choose(r,0);else if(r.stage==='result')E.afterResult(r);else if(r.stage==='social')E.sendMessage(p,'you');else if(r.stage==='chat')E.advance(r);
  p=E.parseSave(JSON.stringify(p));assert.ok(p);
 }
 assert.equal(p.run.notes.length,africa.nodes.length);assert.equal(p.run.messages.length,3);
 assert.ok(E.beginReflection(p.run));const rec=E.finish(p,'next');assert.equal(rec.number,1);assert.equal(p.records.length,1);assert.equal(E.finish(p,'next'),null);assert.equal(p.records.length,1);
});
test('at least seven distinct RETURN RECORDs are attainable by actual choices',()=>{
 const seen=new Set();
 for(const ending of ENDINGS.filter(e=>e.active)){
  let p=packed(.1);if(ending.id==='sea')p=travel({profile:p,choice:n=>n.id==='beach'?2:0});else p=travel({profile:p,choice:n=>ending.id==='receipts'&&n.kind==='booking'?1:0});
  if(ending.id==='light'){for(const id of ['laundry','wash','boots','hippo','cloth'])E.removeItem(p.run,id,true);}
  E.beginReflection(p.run,true);assert.ok(returnQuestions(p.run).some(q=>q.id===ending.id),ending.id);const record=E.finish(p,ending.id);assert.equal(record.endingId,ending.id);seen.add(record.endingId);
 }
 assert.equal(seen.size,7);
});
test('seeded chance persists; observation and photos do not manufacture a leopard',()=>{
 for(const seed of [.1,.9]){const p=travel({seed,choice:n=>n.id==='safari-moment'?1:0});assert.equal(p.run.flags.leopard,seed>=.46);assert.equal(p.run.flags.missedPhoto,true);}
});
test('sharing is optional, idempotent, and memory carries across runs',()=>{
 const silent=travel({share:false});assert.equal(silent.run.messages.length,0);assert.deepEqual(silent.contacts,{});
 const p=travel();assert.equal(p.contacts.lan,3);assert.equal(p.messages.length,3);assert.equal(E.sendMessage(p,'lan'),false);assert.equal(p.contacts.lan,3);
 E.beginReflection(p.run);E.finish(p,'next');p.run=E.createRun();assert.equal(p.records.length,1);assert.equal(p.contacts.lan,3);assert.equal(p.messages.length,3);
});
test('most expensive itinerary remains solvent and budget never accepts unaffordable choices',()=>{
 const p=travel({choice:n=>n.choices.reduce((best,c,i)=>E.choiceCost(packed().run,c)>E.choiceCost(packed().run,n.choices[best])?i:best,0)});assert.ok(p.run.money>0);
 const r=packed().run;E.depart(r);r.money=1;assert.equal(E.choose(r,0),false);assert.equal(r.stage,'event');assert.equal(r.money,1);
});
test('overweight return requires explicit fee path and exact accounting',()=>{
 const p=travel(),r=p.run;ITEMS.filter(i=>!i.souvenir).forEach(i=>E.addItem(r,i.id));const total=E.totalWeight(r),before=r.money,fee=E.overweightFee(r);
 assert.ok(fee>0);assert.equal(E.beginReflection(r),false);assert.ok(E.beginReflection(r,true));assert.equal(r.money,before-fee);assert.equal(r.returnWeight,total);assert.equal(E.beginReflection(r,true),false);
});
test('malformed storage is rejected; additive schema changes keep earlier v2 saves',()=>{
 for(const raw of ['{','null','{}',JSON.stringify({version:2,records:[],contacts:{},run:{stage:'oops'}})])assert.equal(E.parseSave(raw),null);
 const p=packed();delete p.messages;assert.ok(E.parseSave(JSON.stringify(p)));p.run.bag.push('no-such-item');assert.equal(E.parseSave(JSON.stringify(p)),null);
});
test('route references and all item effects resolve to registered data',()=>{
 const ids=africa.nodes.map(n=>n.id);assert.equal(new Set(ids).size,ids.length);for(const n of africa.nodes)for(const c of n.choices){if(c.add)assert.ok(itemById[c.add]);if(c.addIfMissing)assert.ok(itemById[c.addIfMissing]);}
 assert.equal(ENDINGS.length,11);
});
