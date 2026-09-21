import { placeFor } from '../data/routes/africa-stories.js?v=pocket-1';
import { ROUTES } from '../data/routes/index.js?v=pocket-1';
import { ITEMS,itemById,BAG_LIMIT,HAND_LIMIT } from '../data/items.js?v=pocket-1';
import { CONTACTS,SOCIAL_PROMPT } from '../data/contacts.js?v=pocket-1';
import { ENDINGS,returnQuestions } from '../data/endings.js?v=pocket-1';
import * as E from './engine.js?v=pocket-1';
import { drawMap,drawMiniMap,africaHitPath,scene,avatar } from './art.js?v=pocket-1';
const $=s=>document.querySelector(s),app=$('#app'),modal=$('#modal');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'¥ '+Math.round(n).toLocaleString('zh-CN'),kg=n=>Number(n||0).toFixed(1);
let storageOK=true,view='map',phoneApp='home',phoneUnlocked=false,phoneReturn='map',selectedContact=null,caseOpen=false,tab='衣服',toastTimer,locationTimer;
function readProfile(){try{const raw=localStorage.getItem(E.SAVE_KEY);return raw?E.parseSave(raw)||E.freshProfile():E.freshProfile();}catch{storageOK=false;return E.freshProfile();}}
let profile=readProfile();
const run=()=>profile.run,active=()=>run()&&run().stage!=='ending';
const current=()=>run()&&['event','result','social','chat'].includes(run().stage)?E.currentNode(run()):null;
const clockTime=()=>current()?.time||'18:42';
function save(){try{localStorage.setItem(E.SAVE_KEY,JSON.stringify(profile));storageOK=true;}catch{storageOK=false;}updateSaveStatus();}
function updateSaveStatus(){$('#save-status').textContent=storageOK?'':'暂时无法存档 · 请勿关闭本页';}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);}
const arrow='<i class="px-arrow" aria-hidden="true"></i>';
function btn(label,action,extra='',kind=''){return `<button class="btn ${kind}" data-action="${action}" ${extra}>${label}${arrow}</button>`;}
function openModal(title,body,actions=''){modal.innerHTML=`<div class="modal-head"><h2 id="modal-title">${title}</h2><button class="close-btn" data-action="close" aria-label="关闭">×</button></div><div class="modal-body">${body}</div><div class="modal-actions">${actions}</div>`;if(!modal.open)modal.showModal();drawCanvases();}
function closeModal(){modal.close();}
function render({sync=true,keepScroll=false}={}){
 const oldScroll=keepScroll?$('.choice-scroll')?.scrollTop||$('.phone-scroll')?.scrollTop||0:0;
 clearTimeout(locationTimer);document.body.dataset.view=view;
 if(view==='play'&&!run())view='map';
 if(sync&&location.hash!==viewHash())history.pushState(null,'',viewHash());
 if(view==='map')renderMap();else if(view==='phone')renderPhone();else renderPlay();
 if(keepScroll){const scroller=$('.choice-scroll')||$('.phone-scroll');if(scroller)scroller.scrollTop=oldScroll;}
 drawCanvases();startMini();updateSaveStatus();
}
function drawCanvases(){document.querySelectorAll('canvas[data-scene]').forEach(c=>scene(c,c.dataset.scene,{...run()?.outfit,goggles:run()?.flags.goggles}));document.querySelectorAll('canvas[data-avatar]').forEach(c=>avatar(c,{...run()?.outfit,goggles:run()?.flags.goggles}));if($('#world-map'))drawMap($('#world-map'),E.visibleNotes(run()).map(n=>placeFor(n.day).id));document.querySelectorAll('canvas[data-minimap]').forEach(c=>drawMiniMap(c,current()?placeFor(current().day).coord:null));}
function renderMap(){app.innerHTML=`<section class="desk" aria-label="米的桌面"><button class="desk-phone" data-action="phone" aria-label="拿起手机"><span class="mini-speaker"></span><span class="mini-screen"><span>${clockTime()}</span><i class="tiny-apps" aria-hidden="true"></i></span><span class="mini-home"></span></button><div class="map-paper"><div class="map-view"><canvas id="world-map" role="img" aria-label="米的世界地图"></canvas><svg class="map-hit" viewBox="0 0 720 396"><a href="#play" data-action="journey" aria-label="非洲，${active()?'继续旅行':'出发'}"><path d="${africaHitPath()}"/><text x="353" y="166">AFRICA</text></a></svg></div></div></section>`;}
function scenePanel(type,overlay=''){
 const n=current(),place=n?n.place||placeFor(n.day).name:run()?.stage==='return-pack'?'毛里求斯 · 机场':'家 · 米的房间';
 return `<div class="scene-panel"><div class="scene-view"><canvas data-scene="${type}" role="img" aria-label="米的像素场景"></canvas>${overlay}</div><div class="scene-dock"><button class="pocket-phone" data-action="phone" aria-label="拿起手机"><span>${clockTime()}</span><i aria-hidden="true"></i></button><span class="location-whisper" role="status" hidden>${esc(place)}</span><button class="pocket-map" data-action="location" aria-label="查看当前位置" aria-expanded="false"><canvas data-minimap aria-hidden="true"></canvas></button></div></div>`;
}
function gameScreen(type,title,text,choices,{overlay='',className='',extra=''}={}){return `<section class="play-screen ${className}">${scenePanel(type,overlay)}<div class="story-copy"><h1>${esc(title)}</h1><p class="prose ${className?'mini-text':''}">${esc(text)}</p>${extra}</div><div class="choice-scroll" tabindex="0" aria-label="选项">${choices}</div></section>`;}
function choiceButtons(n){const r=run();return n.choices.map((c,i)=>{if(c.requires&&!r.bag.includes(c.requires)||c.condition&&!c.condition(r))return '';const cost=E.choiceCost(r,c);return `<button class="choice" data-action="choose" data-index="${i}" ${E.canAfford(r,cost)?'':'disabled'}><span class="choice-number">${String(i+1).padStart(2,'0')}</span><span><b>${esc(c.label)}</b>${c.detail?`<small>${esc(c.detail)}</small>`:''}</span><span class="price">${cost?money(cost):arrow}</span></button>`;}).join('');}
function renderPlay(){const r=run();
 if(r.stage==='reason'){app.innerHTML=gameScreen('home','米为什么要出去旅行？','行李箱打开了。\n这个问题倒是没有提前准备。',['想看没见过的东西。','一直想去。','不知道。','票都买了。'].map((x,i)=>btn(x,'reason',`data-id="${i}"`)).join(''));return;}
 if(['packing','return-pack'].includes(r.stage)){renderPacking();return;}
 if(r.stage==='reflect'){app.innerHTML=gameScreen('home','所以，米为什么出去旅行？','箱子摊在地上。\n这次想到的答案，跟出门前不太一样。',returnQuestions(r).map(q=>btn(esc(q.text),'finish',`data-ending="${q.id}"`)).join(''));return;}
 if(r.stage==='ending'){const rec=profile.records.find(x=>x.runId===r.id);const end=ENDINGS.find(e=>e.id===rec?.endingId);app.innerHTML=gameScreen('home','回家，打开箱子。',end?.text||'箱子还在地上。',`<div class="case-items">${r.bag.map(id=>btn(esc(itemById[id].name),'inspect',`data-id="${id}"`)).join('')}</div>${btn('拿起手机','phone')}`);return;}
 if(['social','chat'].includes(r.stage)){if(r.stage==='social')selectedContact=null;phoneReturn='play';phoneApp='chat';view='phone';render();return;}
 const n=E.currentNode(r);if(!n){r.stage='return-pack';save();renderPacking();return;}
 if(r.stage==='result'){app.innerHTML=gameScreen(n.scene,r.pending.label,r.pending.text,btn(n.social?'拿出手机':'继续走','next'),{extra:r.pending.cost?`<p class="receipt-cost">${money(r.pending.cost)} · 记在小票上</p>`:''});return;}
 if(n.mini){app.innerHTML=miniHTML(n);return;}
 app.innerHTML=gameScreen(n.scene,E.value(n.title,r),E.value(n.text,r),choiceButtons(n),{extra:n.kind==='booking'?`<p class="micro">秤上：${kg(E.checkedWeight(r))} kg</p>`:''});
}
function packingThought(r){const volume=r.bag.reduce((v,id)=>v+itemById[id].volume,0);return E.checkedWeight(r)>20?'箱子拎起来，手腕沉了一下。再拿出一点。':volume>40?'拉链有点难拉。换个方向压一压。':volume>20?'还能塞一点。也可以不塞。':'箱子里还有很大一块空地。';}
function outfitControls(r){return `<div class="outfit-list">${r.bag.filter(id=>itemById[id].slot).map(id=>{const i=itemById[id],on=r.outfit[i.slot]===id;return `<button class="outfit-btn ${on?'active':''}" data-action="equip" data-id="${id}" aria-pressed="${on}">${esc(i.name)}</button>`;}).join('')}</div>`;}
function packingItems(){const r=run();return `<div class="tabs">${['衣服','日用','随身物'].map(t=>`<button data-action="tab" data-tab="${t}" aria-pressed="${tab===t}">${t}</button>`).join('')}</div>${btn('先装一套日常行李','preset')}<div class="item-grid">${ITEMS.filter(i=>i.group===tab&&!i.souvenir).map(i=>`<button class="item ${r.bag.includes(i.id)?'selected':''}" data-action="item" data-id="${i.id}" aria-pressed="${r.bag.includes(i.id)}"><b>${esc(i.name)}</b><small>${esc(i.note)}</small></button>`).join('')}</div>`;}
function returnItems(){const r=run();return `<p class="micro">随身包 ${kg(E.carryWeight(r))} / ${HAND_LIMIT} kg</p>${r.bag.map(id=>{const i=itemById[id];return `<div class="inventory-row"><strong>${esc(i.name)}</strong><small>${kg(i.weight)} kg${r.carry.includes(id)?' · 随身':r.worn.includes(id)?' · 穿着':''}</small><div class="item-actions"><button data-action="carry" data-id="${id}" ${i.carryOnly?'disabled':''}>${r.carry.includes(id)?'放回':'随身带'}</button>${i.slot?`<button data-action="wear" data-id="${id}">${r.worn.includes(id)?'脱下':'穿上'}</button>`:''}<button data-action="discard" data-id="${id}">留下</button></div></div>`;}).join('')}${r.removed.length?btn('放回刚才取出的东西','restore'):''}`;}
function renderPacking(){const r=run(),ret=r.stage==='return-pack',over=E.checkedWeight(r)>20,fee=E.overweightFee(r);app.innerHTML=gameScreen(ret?'airport':'home',ret?'什么跟米一起回家？':'箱子摊开了。',ret?`秤上 ${kg(E.checkedWeight(r))} kg。\n箱子还是那个箱子。`:packingThought(r),`${btn(caseOpen?'合上箱子看看':'打开行李箱','open-case')}${caseOpen?(ret?returnItems():packingItems()):''}${btn(ret?(over?`付 ${money(fee)}，带回家`:'拉上箱子，回家'):'关上箱子，出发',ret?'return-finish':'depart',over&&(!ret||!E.canAfford(r,fee))?'disabled':'')}`,{overlay:`<button class="case-hotspot" data-action="open-case" aria-label="打开地上的行李箱"></button>`});}
const greetings={he:['出门记得吃饭。','刚才吃过了。','那就好。下次拍给我看。'],lan:['看到好看的天，发给我。','刚才想起你了。','我在。慢慢说。'],you:['替我看看路边的小动物。','路上遇到什么再告诉你。','好，我等着。'],qi:['护照带了吧？','带了，放在最里面。','那就放心了。'],wu:['路上有怪东西记得叫我。','什么才算怪东西？','你犹豫的时候就算。'],blank:['到了说一声。','只是想跟你说一下。','嗯，我在。']};
function allMessages(){return run()?.messages||[];}
function chatHTML(lines,c){return lines.map(l=>`<div class="bubble ${l.from==='mi'?'mi':''}"><span class="chat-speaker">${l.from==='mi'?'米':esc(c.name)}</span>${esc(l.text)}</div>`).join('');}
function chatApp(){const r=run(),social=r?.stage==='social',chat=r?.stage==='chat'?r.messages.at(-1):null;const c=CONTACTS.find(c=>c.id===(chat?.contact||selectedContact));
 if(c){const messages=allMessages().filter(m=>m.contact===c.id);return `<div class="phone-scroll"><div class="chat-thread">${chatHTML([{from:'friend',text:greetings[c.id][0]}],c)}${messages.map(m=>chatHTML(m.lines,c)).join('')}</div></div>${chat?btn('把手机放进口袋','close-phone'):r&&!messages.some(m=>m.event==='hello')?btn(esc(greetings[c.id][1]),'hello',`data-contact="${c.id}"`):''}`;}
 return `<div class="phone-scroll">${social?`<p class="social-quote">${SOCIAL_PROMPT}</p>`:''}<div class="contact-list">${CONTACTS.map(c=>{const last=allMessages().filter(m=>m.contact===c.id).at(-1)?.lines.at(-1)?.text||greetings[c.id][0];return `<button class="contact" data-action="${social?'send':'contact'}" data-contact="${c.id}"><span class="contact-avatar" style="background:${c.color}">${c.mark}</span><span><b>${esc(c.name)}</b><small>${esc(last)}</small></span></button>`;}).join('')}</div></div>`;
}
function notesApp(){const r=run(),notes=E.visibleNotes(r),record=r?.stage==='ending'?profile.records.find(x=>x.runId===r.id):null,end=ENDINGS.find(e=>e.id===record?.endingId);return `<div class="phone-scroll notes-app">${notes.length?notes.map(n=>`<article class="phone-note"><small>第 ${n.day} 天 · ${esc(n.place)}</small><p>${esc(n.text)}</p></article>`).join(''):'<p class="empty-notes">还没写下什么。</p>'}${end?`<article class="phone-note ending-note"><small>回家以后</small><h2>${esc(end.title)}</h2><p>${esc(end.text)}</p><p>${esc(record.returnReason)}</p>${(r.itemHistory||[]).map(x=>`<p>${esc(itemById[x.id]?.name)} · ${esc(x.text)}</p>`).join('')}</article>`:''}</div>`;}
function bagApp(){const r=run();return `<div class="phone-scroll">${r?`<div class="avatar-row"><canvas data-avatar aria-label="米的穿搭"></canvas><p>${packingThought(r)}</p></div>${outfitControls(r)}<div class="case-items">${r.bag.map(id=>btn(esc(itemById[id].name),'inspect',`data-id="${id}"`)).join('')}</div>`:'<p class="empty-notes">箱子还在房间里。</p>'}</div>`;}
function renderPhone(){const labels={home:'',chat:'聊天',notes:'记事本',bag:'行李',settings:'设置'};const body=phoneApp==='chat'?chatApp():phoneApp==='notes'?notesApp():phoneApp==='bag'?bagApp():phoneApp==='settings'?`<div class="phone-scroll settings-app">${btn('回到桌上','map')}${run()?btn(active()?'继续旅行':'回到房间','continue'):''}${btn(run()?'重新收拾行李':'去看看地图',run()?'restart':'map')}<button class="btn" data-action="sound">${soundOn?'声音开':'声音关'}</button></div>`:`<div class="phone-apps">${[['chat','聊天'],['notes','记事本'],['bag','行李'],['settings','设置']].map(([id,name])=>`<button data-action="phone-app" data-app="${id}"><i class="app-icon icon-${id}" aria-hidden="true"></i><span>${name}</span></button>`).join('')}</div>`;
 app.innerHTML=`<section class="phone-scene"><button class="back-link" data-action="close-phone"><i class="px-arrow back-arrow"></i> ${phoneReturn==='play'?'收起手机':'放回桌上'}</button><div class="pixel-phone"><div class="phone-hardware"><i></i></div><div class="phone-screen"><div class="phone-status"><span>${clockTime()}</span><i class="battery-icon" aria-label="电量充足"></i></div>${phoneUnlocked?`<div class="chat-bar"><button data-action="${phoneApp==='chat'&&selectedContact?'contacts':'phone-home'}" aria-label="返回手机桌面"><i class="px-arrow back-arrow"></i></button><h1>${labels[phoneApp]}</h1></div>${body}`:`<div class="lock-screen"><div class="lock-time">${clockTime()}</div><div class="lock-landscape" aria-hidden="true"><i></i></div><button class="unlock" data-action="unlock"><span>轻触解锁</span></button></div>`}</div><button class="phone-home" data-action="${phoneUnlocked?'phone-home':'unlock'}" aria-label="手机主屏幕"></button></div></section>`;
}
function startRun(){profile.run=E.createRun();profile.contacts={};profile.messages=[];phoneApp='home';selectedContact=null;caseOpen=false;view='play';closeModal();save();render();}
function openPhone(){phoneReturn=view==='play'?'play':'map';phoneApp='home';phoneUnlocked=false;selectedContact=null;view='phone';render();}
function closePhone(){if(phoneReturn==='play'&&['social','chat'].includes(run()?.stage)){E.advance(run());save();}view=phoneReturn;render();}
function dispatch(action,b){const r=run();
 if(miniAction(action,b))return;
 if(action==='journey'){if(active()){view='play';render();}else startRun();return;}
 if(action==='phone'){openPhone();return;}
 if(action==='close-phone'){closePhone();return;}
 if(action==='unlock'){phoneUnlocked=true;render();return;}
 if(action==='phone-home'){phoneApp='home';selectedContact=null;render();return;}
 if(action==='phone-app'){phoneApp=b.dataset.app;selectedContact=null;render();return;}
 if(action==='map'){view='map';closeModal();render();return;}
 if(action==='continue'){view='play';closeModal();render();return;}
 if(action==='close'){closeModal();return;}
 if(action==='location'){const el=$('.location-whisper');if(!el)return;el.hidden=false;b.setAttribute('aria-expanded','true');clearTimeout(locationTimer);locationTimer=setTimeout(()=>{el.hidden=true;b.setAttribute('aria-expanded','false');},3200);return;}
 if(action==='restart'){openModal('重新收拾这次的行李？','手机里的这本记事本，也会从空白开始。',btn('重新出发','confirm-start')+btn('先不换','close'));return;}
 if(action==='confirm-start'){startRun();return;}
 if(action==='contact'){selectedContact=b.dataset.contact;render();return;}
 if(action==='contacts'){selectedContact=null;render();return;}
 if(action==='inspect'){const i=itemById[b.dataset.id];if(!r||!r.bag.includes(i?.id))return;openModal(esc(i.name),`<p class="prose">${esc(i.note)}</p>${r.used?.[i.id]?`<p class="micro">这一路，拿出来用过 ${r.used[i.id]} 次。</p>`:''}`);return;}
 if(!r)return;
 if(action==='hello'){const c=CONTACTS.find(x=>x.id===b.dataset.contact);if(c&&!allMessages().some(m=>m.contact===c.id&&m.event==='hello')){r.messages.push({id:crypto.randomUUID(),contact:c.id,event:'hello',day:current()?.day||0,lines:[{from:'mi',text:greetings[c.id][1]},{from:'friend',text:greetings[c.id][2]}]});save();render();}return;}
 if(action==='reason'&&r.stage==='reason'){r.reason=['想看没见过的东西。','一直想去。','不知道。','票都买了。'][Number(b.dataset.id)];r.stage='packing';save();render();return;}
 if(action==='open-case'){caseOpen=!caseOpen;render();return;}
 if(action==='tab'){tab=b.dataset.tab;render();return;}
 if(action==='item'&&r.stage==='packing'){E.toggleItem(r,b.dataset.id);save();render({keepScroll:true});return;}
 if(action==='preset'&&r.stage==='packing'){E.preset(r);save();render({keepScroll:true});return;}
 if(action==='equip'){const i=itemById[b.dataset.id];if(i&&E.equip(r,i.slot,i.id)){save();render({keepScroll:true});}return;}
 if(action==='depart'&&r.stage==='packing'){if(!r.bag.includes('passport')){E.addItem(r,'passport');toast('摸了摸口袋。护照忘了，回头拿上。');}if(E.depart(r)){save();render();}return;}
 if(action==='choose'){if(E.choose(r,Number(b.dataset.index))){save();render();}return;}
 if(action==='next'){E.afterResult(r);phoneUnlocked=false;save();render();return;}
 if(action==='send'){if(E.sendMessage(profile,b.dataset.contact)){selectedContact=b.dataset.contact;save();render();}return;}
 if(r.stage==='return-pack'){
  if(action==='carry'||action==='wear'){if(!E.relocate(r,b.dataset.id,action==='carry'?'carry':'worn'))toast('随身包放不下了。');save();render({keepScroll:true});return;}
  if(action==='discard'){E.removeItem(r,b.dataset.id,true);save();render({keepScroll:true});return;}
  if(action==='restore'){openModal('还在箱子旁边',r.removed.map(id=>btn(esc(itemById[id].name),'restore-item',`data-id="${id}"`)).join(''));return;}
  if(action==='restore-item'){E.addItem(r,b.dataset.id);r.removed=r.removed.filter(x=>x!==b.dataset.id);save();closeModal();render();return;}
  if(action==='return-finish'){if(E.beginReflection(r,true)){save();render();}return;}
 }
 if(action==='finish'&&r.stage==='reflect'){if(E.finish(profile,b.dataset.ending)){save();render();}}
}
function viewHash(){return view==='phone'?`#phone/${phoneApp}/${phoneReturn}${selectedContact?'/'+selectedContact:''}`:'#'+view;}
function readLocation(){const [v,a,b,c]=location.hash.slice(1).split('/');view=v==='play'&&run()?'play':v==='phone'||['journal','records','record'].includes(v)?'phone':'map';if(view==='phone'){phoneApp=['home','chat','notes','bag','settings'].includes(a)?a:['journal','records','record'].includes(v)?'notes':'home';phoneReturn=b==='play'&&run()?'play':'map';selectedContact=CONTACTS.some(x=>x.id===c)?c:null;}closeModal();render({sync:false});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b||b.disabled)return;e.preventDefault();dispatch(b.dataset.action,b);});
// The title is a title, not a second navigation menu.
document.querySelector('.brand').addEventListener('click',e=>e.preventDefault());
window.addEventListener('popstate',readLocation);
window.addEventListener('storage',e=>{if(e.key!==E.SAVE_KEY||!e.newValue)return;const p=E.parseSave(e.newValue);if(p){profile=p;closeModal();render();}});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
function miniAction(a,b){const r=run(),n=current();
 if(a==='sound'){soundOn=!soundOn;if(!soundOn)stopSound();render();return true;}
 if(a==='mini-tap'&&n?.mini){const m=r.mini[n.id];if(!m||m.done)return true;if(n.mini==='glasses'){m.taps=(m.taps||0)+1;$('.escaping-glasses').style.marginLeft=-(m.taps%3)*3+'px';}else if(n.mini==='falls'){m.steps=Math.min(3,(m.steps||0)+1);waterSound(m.steps);m.done=m.steps===3;}else m.action=b.dataset.kind;save();updateMini();return true;}
 if(a==='mini-finish'&&n?.mini){if(r.mini[n.id]?.done&&E.choose(r,0)){save();render();}return true;}
 return false;
}
function miniHTML(n){run().mini[n.id]??={elapsed:0,steps:0,taps:0,done:false};return gameScreen(n.scene,E.value(n.title,run()),E.value(n.text,run()),`<div class="mini-controls">${n.mini==='bus'?['继续等','往前走一站','重新看 App'].map((t,i)=>btn(t,'mini-tap',`data-kind="${i}"`)).join(''):btn(n.mini==='glasses'?'抓住眼镜':'再走近一点','mini-tap')}</div><button class="btn mini-done" data-action="mini-finish" hidden>${n.mini==='bus'?'上车':n.mini==='falls'?'抖一抖':'打开箱子'}</button>`,{className:`mini-game ${n.mini}`,extra:'<span class="mini-clock" role="status"></span>',overlay:'<div class="mini-stage" aria-hidden="true"><i class="escaping-glasses"></i><i class="waiting-person"></i><i class="arriving-bus"></i><div class="pixel-rain"></div></div>'});}
let miniTimer,animFrame=0,soundOn=false,audioContext,soundSource,soundGain;
function stopSound(){try{soundSource?.stop();}catch{}soundSource=null;}
function waterSound(level){if(!soundOn)return;try{audioContext??=new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();if(!soundSource){const buffer=audioContext.createBuffer(1,audioContext.sampleRate*2,audioContext.sampleRate);const samples=buffer.getChannelData(0);for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.3;soundSource=audioContext.createBufferSource();soundSource.buffer=buffer;soundSource.loop=true;const filter=audioContext.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;soundGain=audioContext.createGain();soundSource.connect(filter);filter.connect(soundGain);soundGain.connect(audioContext.destination);soundSource.start();}soundGain.gain.value=level*.13;}catch{}}
function updateMini(){const r=run(),n=r&&E.currentNode(r),el=document.querySelector('.mini-game');if(!el||!n)return;const m=r.mini[n.id];
 if(n.mini==='glasses'){el.style.setProperty('--escape',Math.min(108,m.elapsed/12*108)+'%');el.querySelector('.mini-text').textContent=m.done?'眼镜被抢走了。':'抓住眼镜。';}
 if(n.mini==='bus'){el.classList.toggle('npc-here',m.elapsed>=9);el.classList.toggle('bus-here',m.done);el.querySelector('.mini-clock').textContent=m.done?'17:02':m.elapsed<5?'16:41':m.elapsed<9?'16:47':'16:54';el.querySelector('.mini-text').textContent=m.done?'车来了。':m.elapsed>=9?'有人来了。站在旁边。':m.action==='2'?'BUS 16:42。屏幕没有改口。':m.action==='1'?'又一个白框。还是这片海。':'手机写着 BUS 16:42。';}
 if(n.mini==='falls'){el.style.setProperty('--wet',m.steps/3);el.querySelector('.mini-text').textContent=['轰——\n树后面还没有水。','树后面亮了一大片。','水汽到了脸上。','整个人都进了水里。'][m.steps];document.body.classList.toggle('soaked',m.steps===3);}
 el.querySelector('.mini-done').hidden=!m.done;el.querySelector('.mini-controls').hidden=m.done;
}
function startMini(){clearInterval(miniTimer);stopSound();document.body.classList.remove('soaked');const r=run(),n=view==='play'&&r?.stage==='event'?E.currentNode(r):null;if(!n?.mini)return;updateMini();if(n.mini==='falls')return;
 miniTimer=setInterval(()=>{if(document.hidden||modal.open)return;const m=r.mini[n.id];if(m.done)return;m.elapsed+=.5;if(m.elapsed>=(n.mini==='glasses'?12:22)){m.done=true;clearInterval(miniTimer);}save();updateMini();},500);
}
setInterval(()=>{if(document.hidden||matchMedia('(prefers-reduced-motion: reduce)').matches)return;animFrame=(animFrame+1)%4;document.querySelectorAll('canvas[data-scene]').forEach(c=>scene(c,c.dataset.scene,c.dataset.recordOutfit?JSON.parse(c.dataset.recordOutfit):{...run()?.outfit,goggles:run()?.flags.goggles},animFrame));},650);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();});
document.fonts.load('12px Pixel').then(()=>{document.documentElement.classList.add('font-ready');drawCanvases();}).catch(()=>document.documentElement.classList.add('font-ready'));
setTimeout(()=>document.documentElement.classList.add('font-ready'),2500);
readLocation();
