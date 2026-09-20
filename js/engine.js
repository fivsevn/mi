import { itemById, DEFAULT_BAG, BAG_LIMIT, CASE_WEIGHT, HAND_LIMIT } from '../data/items.js';
import { routeById } from '../data/routes/index.js';
import { selectEnding, returnQuestions } from '../data/endings.js';
import { conversation } from '../data/contacts.js';
export const SAVE_KEY='mi-v02';
export function freshProfile(){return {version:2,records:[],contacts:{},messages:[],run:null};}
export function createRun(routeId='africa-001',seed=Math.random()){
 if(!routeById[routeId])throw new Error('Unknown route');
 return {id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${seed}`,routeId,revision:3,mini:{},itemHistory:[],used:{},seed,stage:'reason',node:0,bag:[],carry:[],worn:[],outfit:{top:null,outer:null,hat:null,shoes:null},money:routeById[routeId].budget,hidden:{},flags:{},entered:[],notes:[],messages:[],pending:null,reason:'',returnReason:'',departureWeight:0,returnWeight:0,departureBag:[],removed:[],packingFeePaid:false,returnFeePaid:false};
}
export const value=(v,r)=>typeof v==='function'?v(r):v;
export const sumWeight=ids=>Math.round(ids.reduce((sum,id)=>sum+(itemById[id]?.weight||0),0)*10)/10;
export const totalWeight=r=>Math.round((CASE_WEIGHT+sumWeight(r.bag))*10)/10;
export const checkedWeight=r=>Math.round((CASE_WEIGHT+sumWeight(r.bag.filter(id=>!r.carry.includes(id)&&!r.worn.includes(id))))*10)/10;
export const carryWeight=r=>sumWeight(r.carry);
export const overweightFee=(r,limit=BAG_LIMIT)=>Math.max(0,Math.round((checkedWeight(r)-limit)*10))*18;
export const canAfford=(r,amount)=>Number.isFinite(amount)&&amount>=0&&r.money>=Math.ceil(amount);
export function applyEffect(r,e={}){for(const [key,val]of Object.entries(e)){if(key==='flags')Object.assign(r.flags,val);else r.hidden[key]=(r.hidden[key]||0)+val;}}
export function addItem(r,id){if(!r.bag.includes(id)){r.bag.push(id);if(itemById[id]?.carryOnly)r.carry.push(id);}}
export function removeItem(r,id,discard=false){r.bag=r.bag.filter(x=>x!==id);r.carry=r.carry.filter(x=>x!==id);r.worn=r.worn.filter(x=>x!==id);for(const s of Object.keys(r.outfit))if(r.outfit[s]===id)r.outfit[s]=null;if(discard&&!r.removed.includes(id))r.removed.push(id);}
export function toggleItem(r,id){if(!itemById[id]||itemById[id].souvenir)return;if(r.bag.includes(id))removeItem(r,id);else addItem(r,id);}
export function preset(r){r.bag=[];r.carry=[];r.worn=[];DEFAULT_BAG.forEach(id=>addItem(r,id));r.outfit={top:'tee',outer:'jacket',hat:'hat',shoes:'boots'};}
export function equip(r,slot,id){if(id===null){r.outfit[slot]=null;return true;}if(!r.bag.includes(id)||itemById[id]?.slot!==slot)return false;r.outfit[slot]=r.outfit[slot]===id?null:id;return true;}
export function relocate(r,id,location){
 if(!r.bag.includes(id))return false;
 if(location==='carry'){
  if(r.carry.includes(id)){if(itemById[id].carryOnly)return false;r.carry=r.carry.filter(x=>x!==id);return true;}
  if(carryWeight(r)+itemById[id].weight>HAND_LIMIT)return false;
  r.worn=r.worn.filter(x=>x!==id);r.carry.push(id);return true;
 }
 if(location==='worn'){
  const slot=itemById[id].slot;if(!slot)return false;
  if(r.worn.includes(id)){r.worn=r.worn.filter(x=>x!==id);return true;}
  // One actual worn item per slot; unlike preview outfits, these leave the suitcase.
  r.worn=r.worn.filter(x=>itemById[x].slot!==slot);r.carry=r.carry.filter(x=>x!==id);r.worn.push(id);r.outfit[slot]=id;return true;
 }
 return false;
}
export function depart(r){
 if(r.stage!=='packing'||checkedWeight(r)>BAG_LIMIT)return false;
 r.departureWeight=totalWeight(r);r.departureBag=[...r.bag];r.stage='event';enterNode(r);return true;
}
export function currentNode(r){return routeById[r.routeId].nodes[r.node];}
export function enterNode(r){const n=currentNode(r);if(!n){r.stage='return-pack';return;}if(!r.entered.includes(n.id)){applyEffect(r,n.onEnter);r.entered.push(n.id);}}
export function choiceCost(r,c){return Math.ceil((value(c.cost,r)||0)+(c.limit?overweightFee(r,c.limit):0));}
export function choose(r,index){
 if(r.stage!=='event')return false;
 const n=currentNode(r),c=n?.choices[index];if(!c)return false;
 if(c.requires&&!r.bag.includes(c.requires)||c.condition&&!c.condition(r))return false;
 const cost=choiceCost(r,c);if(!canAfford(r,cost))return false;
 if(c.encounter)r.flags.leopard=r.seed>=0.46;
 r.money-=cost;applyEffect(r,c.effect);
 // Result text sees the inventory present at the time of choice.
 const result=value(c.result,r);
 if(c.remove&&r.bag.includes(c.remove)){removeItem(r,c.remove);(r.itemHistory??=[]).push({id:c.remove,text:result,day:n.day});}if(c.use){r.used??={};r.used[c.use]=(r.used[c.use]||0)+1;}
 if(n.memory)r.flags[n.memory]=true;
 if(c.add)addItem(r,c.add);if(c.addIfMissing)addItem(r,c.addIfMissing);
 r.pending={nodeId:n.id,label:c.label,text:result,cost,stamp:c.stamp||n.eyebrow,shared:false};
 r.notes.push({nodeId:n.id,day:n.day,place:n.place,title:n.title?value(n.title,r):n.id,text:result});
 r.stage='result';return true;
}
export function afterResult(r){if(r.stage!=='result')return;const n=currentNode(r);if(n.social&&!r.pending?.shared)r.stage='social';else advance(r);}
export function sendMessage(profile,contactId){
 const r=profile.run;if(r?.stage!=='social'||r.pending.shared||!['he','lan','you','qi','wu','blank'].includes(contactId))return false;
 const event=currentNode(r).social;const chat=conversation(event,contactId,r);
 r.messages.push({id:`${r.id}-${r.node}`,contact:contactId,event,day:currentNode(r).day,lines:chat});
 profile.messages??=[];profile.messages.push(r.messages.at(-1));profile.contacts[contactId]=(profile.contacts[contactId]||0)+1;r.pending.shared=true;r.stage='chat';return true;
}
export function advance(r){r.pending=null;r.node++;r.stage='event';enterNode(r);}
export function beginReflection(r,pay=false){
 if(r.stage!=='return-pack')return false;const fee=Math.ceil(overweightFee(r));if(fee&&(!pay||!canAfford(r,fee)))return false;
 r.money-=fee;r.returnFeePaid=fee>0;r.returnWeight=totalWeight(r);r.stage='reflect';return true;
}
export function finish(profile,reason){
 const r=profile.run;if(!r||r.stage!=='reflect'||!returnQuestions(r).some(q=>q.id===reason))return null;
 r.returnReason=reason;const ending=selectEnding(r);let record=profile.records.find(x=>x.runId===r.id);
 if(!record){record={runId:r.id,routeId:r.routeId,endingId:ending.id,date:new Date().toISOString(),number:profile.records.filter(x=>x.routeId===r.routeId).length+1,reason:r.reason,returnReason:returnQuestions(r).find(q=>q.id===reason).text,departureWeight:r.departureWeight,returnWeight:r.returnWeight,money:r.money,bag:[...r.bag],notes:[...r.notes],messages:[...r.messages],outfit:{...r.outfit,goggles:r.flags.goggles},flags:{...r.flags},used:{...r.used},itemHistory:[...(r.itemHistory||[])],departureBag:[...r.departureBag],visited:routeById[r.routeId].recordStops||routeById[r.routeId].stops.filter(s=>s.available).map(s=>s.id)};profile.records.push(record);}
 r.stage='ending';return record;
}
export function parseSave(raw){
 try{const p=JSON.parse(raw);if(!p||p.version!==2||!Array.isArray(p.records)||!p.contacts||typeof p.contacts!=='object'||Array.isArray(p.contacts))return null;
  if(!Array.isArray(p.messages))p.messages=[];
  p.records=p.records.filter(x=>x&&typeof x.runId==='string'&&routeById[x.routeId]&&typeof x.endingId==='string'&&Array.isArray(x.notes)&&Array.isArray(x.messages)&&Array.isArray(x.bag));
  if(p.run){const r=p.run;
   if(!r.revision&&routeById[r.routeId]&&Number.isInteger(r.node)){const route=routeById[r.routeId],oldId=route.oldNodeIds?.[r.node];r.node=oldId==='interlude'?route.nodes.findIndex(n=>n.id==='sunday'):route.nodes.findIndex(n=>n.id===oldId);if(r.node<0)r.node=route.nodes.length;r.revision=3;}
   r.mini??={};r.itemHistory??=[];r.used??={};const stages=['reason','packing','event','result','social','chat','return-pack','reflect','ending'];
   if(!routeById[r.routeId]||!stages.includes(r.stage)||!Number.isInteger(r.node)||r.node<0||r.node>routeById[r.routeId].nodes.length||!Number.isFinite(r.money)||r.money<0||!Number.isFinite(r.seed)||!r.outfit||!r.hidden||!r.flags||['bag','carry','worn','entered','notes','messages','departureBag','removed'].some(k=>!Array.isArray(r[k]))||r.bag.some(id=>!itemById[id])||['result','social','chat'].includes(r.stage)&&!r.pending)return null;
   if(r.stage==='event'&&!currentNode(r))r.stage='return-pack';
  }return p;
 }catch{return null;}
}
