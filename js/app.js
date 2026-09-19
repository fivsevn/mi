import { ROUTES, routeById } from '../data/routes/index.js';
import { ITEMS,itemById,BAG_LIMIT,HAND_LIMIT } from '../data/items.js';
import { CONTACTS,SOCIAL_PROMPT } from '../data/contacts.js';
import { ENDINGS,returnQuestions } from '../data/endings.js';
import * as E from './engine.js';
import { drawMap,scene,avatar } from './art.js';
const $=s=>document.querySelector(s),app=$('#app'),modal=$('#modal');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'¥ '+Math.round(n).toLocaleString('zh-CN');
const kg=n=>Number(n||0).toFixed(1);
let storageOK=true,hadCorrupt=false,phoneUnlocked=false;
function readProfile(){try{const raw=localStorage.getItem(E.SAVE_KEY);if(!raw)return E.freshProfile();const parsed=E.parseSave(raw);if(parsed)return parsed;hadCorrupt=true;localStorage.setItem(E.SAVE_KEY+'-unreadable-backup',raw);return E.freshProfile();}catch{storageOK=false;return E.freshProfile();}}
let profile=readProfile(),view='map',tab='衣服',selectedRegion='africa',selectedRouteId=ROUTES[0].id,selectedContact=null,selectedRecord=null,toastTimer;
const run=()=>profile.run,route=()=>routeById[run()?.routeId]||ROUTES[0],active=()=>run()&&run().stage!=='ending';
function save(){try{localStorage.setItem(E.SAVE_KEY,JSON.stringify(profile));storageOK=true;}catch{storageOK=false;}updateSaveStatus();}
function updateSaveStatus(){const status=$('#save-status');status.textContent=storageOK?'':'暂时无法存档 · 请勿关闭本页';status.className=storageOK?'':'save-error';}
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600);}
function btn(label,action,extra='',kind='primary'){return `<button class="btn ${kind}" data-action="${action}" ${extra}>${label}<span aria-hidden="true">↗</span></button>`;}
function sceneHTML(type,label,small=''){return `<div class="scene-frame"><canvas data-scene="${type}" role="img" aria-label="${esc(label)}的像素旅行场景"></canvas><span class="scene-label">${esc(label)}</span><span class="scene-bottom">${esc(small)}</span></div>`;}
function openModal(title,body,actions=''){modal.innerHTML=`<div class="modal-head"><h2 id="modal-title">${title}</h2><button data-action="close" class="close-btn" aria-label="关闭">×</button></div><div class="modal-body">${body}</div>${actions?`<div class="modal-actions">${actions}</div>`:''}`;if(!modal.open)modal.showModal();drawCanvases();}
function closeModal(){modal.close();}
function render({scroll=true,sync=true}={}){
 document.body.dataset.view=view;
 if(sync){const hash=viewHash();if(location.hash!==hash)history.pushState(null,'',hash);}
 for(const b of document.querySelectorAll('nav button'))b.classList.toggle('active',b.dataset.action===view);
 if(view==='play'&&!run())view='map';
 if(view==='map')renderMap();else if(view==='play')renderPlay();else if(view==='journal')renderJournal();else if(view==='phone')renderPhone();else if(view==='records')renderRecords();else if(view==='record')renderEnding(selectedRecord);else renderMap();
 drawCanvases();updateSaveStatus();
 if(scroll){window.scrollTo({top:0,behavior:'instant'});app.focus({preventScroll:true});}
}
function drawCanvases(){document.querySelectorAll('canvas[data-scene]').forEach(c=>scene(c,c.dataset.scene,c.dataset.recordOutfit?JSON.parse(c.dataset.recordOutfit):run()?.outfit||{}));document.querySelectorAll('canvas[data-avatar]').forEach(c=>avatar(c,run()?.outfit||{}));if($('#world-map'))drawMap($('#world-map'));}
const regions=[{id:'north',name:'北美洲',en:'N. AMERICA',x:24,y:33},{id:'south',name:'南美洲',en:'S. AMERICA',x:34,y:62},{id:'europe',name:'欧洲',en:'EUROPE',x:53,y:28},{id:'asia',name:'亚洲',en:'ASIA',x:74,y:33},{id:'africa',name:'非洲',en:'AFRICA',x:58.3,y:49},{id:'oceania',name:'大洋洲',en:'OCEANIA',x:83,y:69},{id:'antarctica',name:'南极洲',en:'ANTARCTICA',x:52,y:86}];
function renderMap(){
 app.innerHTML=`<section class="desk" aria-label="米的桌面"><div class="desk-objects"><button class="desk-phone" data-action="phone" aria-label="拿起手机"><span class="mini-speaker"></span><span class="mini-screen"><span>18:42</span><i>▤</i></span><span class="mini-home"></span></button><button class="desk-journal" data-action="journal" aria-label="翻开旅行者日记"><span>旅行者<br>日记</span><i>mi</i></button></div><div class="map-paper"><span class="paper-tape" aria-hidden="true"></span><span class="map-signature" aria-hidden="true">mi.</span><div class="map-view"><canvas id="world-map" role="img" aria-label="米的世界地图，非洲被涂成了黄色"></canvas>${regions.map(x=>x.id==='africa'?`<button class="region map-entry" style="left:${x.x}%;top:${x.y}%" data-action="journey" aria-label="非洲，${active()?'继续旅行':'出发'}"><i></i><span>AFRICA</span></button>`:`<span class="region quiet-region" style="left:${x.x}%;top:${x.y}%">${x.en}</span>`).join('')}<span class="pencil-circle" aria-hidden="true"></span></div><div class="map-margin"><span>01° S — 34° S</span><span class="margin-mark" aria-hidden="true">↗</span></div></div><div class="desk-pencil" aria-hidden="true"></div><div class="coffee-ring" aria-hidden="true"></div></section>`;
}

function travelHeader(){const r=run();return `<div class="travel-head"><button class="back" data-action="map">← 世界地图</button>${['reason','packing'].includes(r.stage)?'':`<div class="hud"><div><span>剩余旅费</span>${money(r.money)}</div><div><span>托运行李</span>${kg(E.checkedWeight(r))} kg</div></div>`}</div>`;}
function side(){const r=run();const frequent=CONTACTS.filter(c=>profile.contacts[c.id]).sort((a,b)=>profile.contacts[b.id]-profile.contacts[a.id])[0];const thought=frequent&&profile.contacts[frequent.id]>=2?frequent.thought:(r.notes.at(-1)?.text||'每次出门，都会装进一些“万一”。');return `<aside class="story-side"><div class="field-note"><p>${esc(thought)}</p></div><div class="side-tools">${btn('翻翻行李','wardrobe','','')}${btn('翻开日记','journal','','')}${btn('拿起手机','phone','','')}</div></aside>`;}

function shellStory(content){return `<section class="travel">${travelHeader()}<div class="travel-layout"><div class="story">${content}</div>${side()}</div></section>`;}
function renderPlay(){
 const r=run();
 if(r.stage==='reason'){app.innerHTML=shellStory(`${sceneHTML('home','出发前一天 / 米的房间','BEFORE DEPARTURE')}<div class="story-copy"><p class="kicker">ROUTE 001 / A SMALL QUESTION</p><h1>米为什么要出去旅行？</h1><p class="prose">行李箱打开了。\n这个问题倒是没有提前准备。</p></div><div class="choices">${['想看没见过的东西。','一直想去。','不知道。','票都买了。'].map((x,i)=>`<button class="choice" data-action="reason" data-id="${i}"><span class="choice-number">0${i+1}</span><b>${x}</b><span>↗</span></button>`).join('')}</div>`);return;}
 if(r.stage==='packing'||r.stage==='return-pack'){renderPacking(r.stage==='return-pack');return;}
 if(r.stage==='reflect'){renderReflect();return;}
 if(r.stage==='ending'){renderEnding(profile.records.find(x=>x.runId===r.id));return;}
 if(r.stage==='social'||r.stage==='chat'){renderSocial();return;}
 const n=E.currentNode(r);if(!n){r.stage='return-pack';save();renderPacking(true);return;}
 if(r.stage==='result'){
  app.innerHTML=shellStory(`${sceneHTML(n.scene,n.place,'')}<section class="result-card"><span class="stamp">${esc(r.pending.stamp)}</span><h1>${esc(r.pending.label)}</h1><p class="prose">${esc(r.pending.text)}</p>${r.pending.cost?`<span class="receipt-cost">支出 ${money(r.pending.cost)} · 已记在小票上</span>`:''}</section>${btn(n.social?'拿出手机':'把这一页翻过去','next')}`);return;
 }
 app.innerHTML=shellStory(`${sceneHTML(n.scene,n.place,'')}<div class="story-copy"><p class="kicker">${n.eyebrow}</p><h1>${esc(E.value(n.title,r))}</h1><p class="prose">${esc(E.value(n.text,r))}</p>${['safari-morning','island-wind'].includes(n.id)&&CONTACTS.some(c=>(profile.contacts[c.id]||0)>=2)?`<p class="margin-thought">「${esc([...CONTACTS].sort((a,b)=>(profile.contacts[b.id]||0)-(profile.contacts[a.id]||0))[0].thought)}」</p>`:''}</div><div class="choices">${n.choices.map((c,i)=>{const cost=E.choiceCost(r,c),fee=c.limit?Math.ceil(E.overweightFee(r,c.limit)):0;return `<button class="choice" data-action="choose" data-index="${i}" ${E.canAfford(r,cost)?'':'disabled'}><span class="choice-number">${String(i+1).padStart(2,'0')}</span><span><b>${esc(c.label)}</b>${c.detail||cost?`<small>${esc(c.detail||'')}${fee?' · 含超重费 '+money(fee):''}</small>`:''}</span><span class="price">${cost?money(cost):'↗'}</span></button>`;}).join('')}</div><button class="text-btn mobile-tools" data-action="wardrobe" style="margin-top:10px">行李与换装 ↗</button>`);
}
function outfitControls(r){const clothes=r.bag.filter(id=>itemById[id]?.slot);return `<div class="wardrobe"><h3>今天穿什么</h3><p class="micro">从带上的衣服里选。衣服仍计入行李。</p>${clothes.length?`<div class="outfit-list">${clothes.map(id=>{const item=itemById[id],on=r.outfit[item.slot]===id;return `<button class="outfit-btn ${on?'active':''}" data-action="equip" data-id="${id}" aria-pressed="${on}">${item.name}${on?' ✓':''}</button>`;}).join('')}</div>`:'<p class="micro">米先穿着出门时的衣服。</p>'}</div>`;}
function renderPacking(returning=false){
 const r=run(),weight=E.checkedWeight(r),over=weight>BAG_LIMIT,fee=Math.ceil(E.overweightFee(r));
 const action=returning?'return-finish':'depart';
 const go=over?(returning?`付 ${money(fee)} 超重费，带回家`:`还需取出 ${kg(weight-BAG_LIMIT)} kg`):returning?'拉上箱子，回家':'关上箱子，出发';
 const inventory=returning?`<div><p class="kicker">带出去的 / 带回来的</p><div class="pack-toolbar"><p class="micro">随身包 ${kg(E.carryWeight(r))} / ${HAND_LIMIT} kg。<br>衣服可穿上，每个部位一件。</p><button class="text-btn" data-action="restore">放回刚才取出的物品</button></div>${r.bag.length?r.bag.map(id=>{const i=itemById[id];return `<div class="inventory-row"><div><strong>${i.name}</strong><small>${kg(i.weight)} kg · ${i.souvenir?'路上带来的':'出发时的东西'}${r.worn.includes(id)?' · 穿在身上':r.carry.includes(id)?' · 随身包':''}</small></div><div class="item-actions"><button data-action="carry" data-id="${id}" class="${r.carry.includes(id)?'active':''}" ${i.carryOnly?'disabled':''}>${r.carry.includes(id)?'放回箱子':'放随身包'}</button>${i.slot?`<button data-action="wear" data-id="${id}" class="${r.worn.includes(id)?'active':''}">${r.worn.includes(id)?'脱下':'穿上'}</button>`:''}<button data-action="discard" data-id="${id}">留下</button></div></div>`;}).join(''):'<p class="empty">箱子空了。还剩空箱自己。</p>'}</div>`:`<div><div class="tabs" role="group" aria-label="物品分类">${['衣服','日用','随身物'].map(t=>`<button data-action="tab" data-tab="${t}" class="${t===tab?'active':''}" aria-pressed="${t===tab}">${t}</button>`).join('')}</div><div class="pack-toolbar"><p class="micro">点一下放进箱子，再点一下取出。</p><button class="text-btn" data-action="preset">先装一套日常行李 ↗</button></div><div class="item-grid">${ITEMS.filter(i=>i.group===tab&&!i.souvenir).map(i=>{const on=r.bag.includes(i.id);return `<button class="item ${on?'selected':''}" data-action="item" data-id="${i.id}" aria-pressed="${on}" aria-label="${i.name}，${kg(i.weight)}千克，${on?'已带上':'未带上'}"><b>${i.name}</b><span class="item-weight">${kg(i.weight)} kg</span><span class="item-note">${i.note}</span><span class="check" aria-hidden="true">${on?'✓':''}</span></button>`;}).join('')}</div></div>`;
 app.innerHTML=`<section class="packing">${travelHeader()}<div class="pack-heading"><p class="kicker">${returning?'RETURN / PACKING AGAIN':'出发前'}</p><h1>${returning?'什么跟米一起回家？':'米打开了行李箱。'}</h1><p class="prose">${returning?'箱子还是那个箱子。里面已经不全是原来的东西。':`还剩 ${kg(Math.max(0,BAG_LIMIT-weight))} kg。\n“万一用得上”，好像什么都能带。`}</p></div><div class="pack-layout"><aside class="pack-summary ${over?'over':''}"><div class="avatar-row"><canvas data-avatar role="img" aria-label="米当前的像素穿搭"></canvas><p class="avatar-label">米 / MI<small>READY, MAYBE.</small></p></div><p class="weight-display">${kg(weight)} <small>/ 20 kg</small></p><div class="weight-bar"><i style="width:${weight/BAG_LIMIT*100}%"></i></div><p class="weight-caption"><b>${over?'超出 '+kg(weight-BAG_LIMIT)+' kg':'托运行李还剩 '+kg(BAG_LIMIT-weight)+' kg'}</b><br>空箱 1.4 kg · 随身包 ${kg(E.carryWeight(r))} kg<br>${returning?`出发总重 ${kg(r.departureWeight)} kg · 现在 ${kg(E.totalWeight(r))} kg`:'充电宝随身带，不放托运行李。'}</p>${btn(go,action,over&&(!returning||!E.canAfford(r,fee))?'disabled':'')}<p class="micro">${over?'也可以取出一些东西，再试着关箱子。':returning?'带回家什么，不必解释得很清楚。':'不用准备好一切，才能出发。'}</p>${returning?'':outfitControls(r)}</aside>${inventory}</div></section>`;
}
function phoneFrame(content,{title='聊天',back='map',backLabel='放回桌上',insideBack=''}={}){return `<section class="phone-scene"><button class="back-link" data-action="${back}">← ${backLabel}</button><div class="pixel-phone"><div class="phone-hardware" aria-hidden="true"><i></i><b></b></div><div class="phone-screen"><div class="phone-status"><span>18:42</span><span aria-label="信号与电量">▂▄▆ ▰</span></div>${phoneUnlocked?`<div class="chat-bar">${insideBack?`<button data-action="${insideBack}" aria-label="返回聊天列表">‹</button>`:'<span>▤</span>'}<h1>${esc(title)}</h1><span>···</span></div>${content}`:`<div class="lock-screen"><div class="lock-time">18:42</div><p>星期六</p><div class="lock-landscape" aria-hidden="true"><i></i></div><button class="unlock" data-action="unlock">⌑<span>轻触解锁</span></button></div>`}</div><button class="phone-home" data-action="${phoneUnlocked?'lock':'unlock'}" aria-label="${phoneUnlocked?'锁屏':'解锁'}"></button></div></section>`;}
function chatHTML(lines,c){return lines.map(l=>`<div class="bubble ${l.from==='mi'?'mi':''}"><span class="chat-speaker">${l.from==='mi'?'米':esc(c.name)}</span>${esc(l.text)}</div>`).join('');}
function renderSocial(){const r=run();if(r.stage==='chat'){
 const chat=r.messages.at(-1),c=CONTACTS.find(x=>x.id===chat.contact);app.innerHTML=phoneFrame(`<div class="phone-scroll"><div class="chat-thread">${chatHTML(chat.lines,c)}</div></div><div class="phone-compose">${btn('把手机放进口袋','social-done','','')}</div>`,{title:c.name,back:'social-done',backLabel:'收起手机'});return;}
 app.innerHTML=phoneFrame(`<div class="phone-scroll"><p class="social-quote">${SOCIAL_PROMPT}</p><div class="contact-list">${CONTACTS.map(c=>contactButton(c,'send')).join('')}</div></div><div class="phone-compose">${btn('先留给自己','social-skip','','')}</div>`,{back:'social-skip',backLabel:'收起手机'});
}
const greetings={he:['出门记得吃饭。','刚才吃过了。','那就好。下次拍给我看。'],lan:['看到好看的天，发给我。','刚才想起你了。','我在。慢慢说。'],you:['替我看看路边的小动物。','路上遇到什么再告诉你。','好，我等着。'],qi:['护照带了吧？','带了，放在最里面。','那就放心了。'],wu:['路上有怪东西记得叫我。','什么才算怪东西？','你犹豫的时候就算。'],blank:['到了说一声。','只是想跟你说一下。','嗯，我在。']};
function contactButton(c,action){const last=allMessages().filter(m=>m.contact===c.id).at(-1)?.lines.at(-1)?.text||greetings[c.id][0];return `<button class="contact" data-action="${action}" data-contact="${c.id}"><span class="contact-avatar" style="background:${c.color}">${c.mark}</span><span><b>${esc(c.name)}</b><small>${esc(last)}</small></span></button>`;}

function renderReflect(){const r=run();app.innerHTML=shellStory(`${sceneHTML('home','家 / 还是这个房间','回家以后')}<div class="story-copy"><p class="kicker">THE SAME QUESTION / AGAIN</p><h1>所以，米为什么出去旅行？</h1><p class="prose">箱子摊在地上。\n这次想到的答案，跟出门前不太一样。</p></div><div class="choices">${returnQuestions(r).map((q,i)=>`<button class="choice" data-action="finish" data-ending="${q.id}"><span class="choice-number">${String(i+1).padStart(2,'0')}</span><b>${esc(q.text)}</b><span>↗</span></button>`).join('')}</div>`);}
function renderEnding(record){if(!record){view='map';renderMap();return;}const ending=ENDINGS.find(e=>e.id===record.endingId)||ENDINGS.find(e=>e.id==='next');app.innerHTML=`<section class="ending"><div class="return-paper"><p class="kicker">回家后的第 ${String(record.number)} 页</p><h1>${esc(ending.title)}</h1><p class="prose">${esc(ending.text)}</p><div class="return-scene"><canvas data-scene="home" data-record-outfit="${esc(JSON.stringify(record.outfit||{}))}" role="img" aria-label="回到家中的米，行李箱仍然打开着"></canvas></div><div class="return-qa"><small>出门前，米说</small>${esc(record.reason)}</div><div class="return-qa"><small>回家以后，米说</small>${esc(record.returnReason)}</div><div class="return-stats"><div><span>带出去 → 带回来</span><b>${kg(record.departureWeight)} → ${kg(record.returnWeight)} kg</b></div><div><span>还剩的旅费</span><b>${money(record.money)}</b></div></div><p class="micro">地图还在原来的地方。</p></div><div class="ending-actions">${btn('把这一页放回地图','map')}${btn('同一条路线，再走一次','start','','')}${btn('看看这次的旅行手记','record-notes',`data-record="${record.runId}"`,'')}</div></section>`;}
function allMessages(){const messages=[...(profile.messages||[]),...profile.records.flatMap(x=>x.messages||[]),...(run()?.messages||[])];return messages.filter((m,i)=>messages.findIndex(x=>x.id===m.id)===i);}
function renderPhone(){const c=CONTACTS.find(x=>x.id===selectedContact),messages=c?allMessages().filter(m=>m.contact===c.id):[];app.innerHTML=phoneFrame(c?`<div class="phone-scroll"><div class="chat-thread">${chatHTML([{from:'friend',text:greetings[c.id][0]}],c)}${messages.map(m=>chatHTML(m.lines,c)).join('')}</div></div><div class="phone-compose">${messages.some(m=>m.event==='hello')?'<span class="unsent">光标闪了一会儿。</span>':`<button class="draft-message" data-action="hello" data-contact="${c.id}"><span>${esc(greetings[c.id][1])}</span><b>发送 ↑</b></button>`}</div>`:`<div class="phone-scroll"><div class="contact-list">${CONTACTS.map(c=>contactButton(c,'contact')).join('')}</div></div>`,{title:c?c.name:'聊天',insideBack:c?'contacts':''});}
let journalRecord=null;

function renderJournal(){const source=journalRecord||run()||profile.records.at(-1),notes=source?.notes||[];app.innerHTML=`<section class="notebook-scene"><button class="back-link" data-action="map">← 合上日记</button><div class="open-notebook"><div class="notebook-title"><span>旅行者日记</span><i>mi.</i></div><div class="journal-list">${notes.length?notes.map((n,i)=>`<article class="journal-entry"><span class="journal-place">${esc(n.place)}</span><p class="prose">${esc(n.text)}</p>${i===0?'<span class="ticket-scrap" aria-hidden="true">▥ ▥ ▥<br>一角票根</span>':''}</article>`).join(''):'<article class="journal-entry"><span class="journal-place">出发前，窗边</span><p class="prose">我把地图摊开了。<br>折痕正好穿过一片海。</p><p class="crossed-plan">把每天都安排好。</p><p class="prose">……先把箱子找出来。</p><span class="journal-doodle" aria-hidden="true">〰 ↗ ✳</span></article>'}</div>${profile.records.length?btn('翻到回家后的几页','records','',''):''}${active()?btn('把笔夹好，继续走','continue','','')+btn('重新收拾行李','restart','',''):''}</div></section>`;}

function renderRecords(){app.innerHTML=`<section class="archive"><button class="back-link" data-action="map">← 回到地图</button><p class="kicker">夹在日记里的几页</p><h1>回来以后，剩下什么。</h1>${profile.records.length?`<div class="record-list">${[...profile.records].reverse().map(r=>{const e=ENDINGS.find(e=>e.id===r.endingId);return `<button class="record-tile" data-action="record" data-record="${r.runId}"><span class="kicker">${esc(routeById[r.routeId]?.name)} · ${String(r.number)}</span><h2>${esc(e?.title||'一份归来记录')}</h2><span class="micro">${kg(r.departureWeight)} → ${kg(r.returnWeight)} KG / ↗</span></button>`;}).join('')}</div>`:'<p class="empty">箱子还没有从远方回来。<br>这里不用急着填满。</p>'}</section>`;}
function startRun(){profile.run=E.createRun(selectedRouteId);view='play';selectedRecord=null;journalRecord=null;save();closeModal();render();}
function wardrobeModal(){if(!run()){toast('先打开一条旅行路线。');return;}openModal('行李里的米',`<div class="avatar-row"><canvas data-avatar role="img" aria-label="米当前的穿搭"></canvas><p class="micro">托运行李 ${kg(E.checkedWeight(run()))} kg<br>随身包 ${kg(E.carryWeight(run()))} kg<br>旅费 ${money(run().money)}</p></div>${outfitControls(run())}<p class="micro" style="margin-top:20px">${run().bag.map(id=>esc(itemById[id].name)).join(' · ')||'行李箱还是空的。'}</p>`);}
function menu(){openModal('把书签夹在这里','窗外的光慢慢移了一点。',`${active()?btn('继续旅行','continue'):''}${btn('放回桌上','map','','')}${btn('翻开日记','journal','','')}${run()?btn('重新收拾行李','restart','',''):''}`);}

function restoreModal(){const r=run();if(!r.removed.length){toast('还没有取出任何东西。');return;}openModal('还在箱子旁边',`<p class="micro">最后关箱之前，随时可以放回去。</p><div class="contact-list">${r.removed.map(id=>`<button class="contact" data-action="restore-item" data-id="${id}"><b>${itemById[id].name}</b><span class="arrow">${kg(itemById[id].weight)} kg ＋</span></button>`).join('')}</div>`);}
function dispatch(action,b){
 const r=run();
 if(action==='journey'){selectedRouteId=ROUTES[0].id;if(active()){view='play';render();}else startRun();return;}
 if(action==='unlock'||action==='lock'){phoneUnlocked=action==='unlock';render({scroll:false});return;}
 if(action==='hello'){const c=CONTACTS.find(x=>x.id===b.dataset.contact);if(c&&!allMessages().some(m=>m.contact===c.id&&m.event==='hello')){profile.messages.push({id:crypto.randomUUID(),contact:c.id,event:'hello',day:0,lines:[{from:'mi',text:greetings[c.id][1]},{from:'friend',text:greetings[c.id][2]}]});save();render({scroll:false});}return;}
 if(['map','journal','phone','records'].includes(action)){closeModal();view=action;if(action==='journal')journalRecord=null;if(action==='phone'){selectedContact=null;phoneUnlocked=false;}render();return;}
 if(action==='continue'){closeModal();view='play';render();return;}
 if(action==='close'){closeModal();return;}if(action==='menu'){menu();return;}
 if(action==='region'){selectedRegion=b.dataset.region;render({scroll:false});return;}
 if(action==='select-route'){selectedRouteId=b.dataset.route;render({scroll:false});return;}
 if(action==='start'||action==='restart'){
  if(active()){openModal('重新打包这一次？','这次还没走完的路，要从头再走。日记和聊天都还在。',btn('重新开始这一周目','confirm-start')+btn('继续原来的旅行','continue','',''));}else startRun();return;
 }
 if(action==='confirm-start'){startRun();return;}
 if(action==='record'){selectedRecord=profile.records.find(x=>x.runId===b.dataset.record);view='record';render();return;}
 if(action==='record-notes'){journalRecord=profile.records.find(x=>x.runId===b.dataset.record);view='journal';render();return;}
 if(action==='contact'){selectedContact=b.dataset.contact;render();return;}
 if(action==='contacts'){selectedContact=null;render();return;}
 if(action==='wardrobe'){wardrobeModal();return;}
 if(!r)return;
 if(action==='reason'&&r.stage==='reason'){r.reason=['想看没见过的东西。','一直想去。','不知道。','票都买了。'][Number(b.dataset.id)];r.stage='packing';save();render();return;}
 if(action==='tab'){tab=b.dataset.tab;render({scroll:false});return;}
 if(action==='item'&&r.stage==='packing'){E.toggleItem(r,b.dataset.id);save();render({scroll:false});return;}
 if(action==='preset'&&r.stage==='packing'){E.preset(r);save();render({scroll:false});toast('先装好了这些。随时可以取出来。');return;}
 if(action==='equip'){const i=itemById[b.dataset.id];if(i&&E.equip(r,i.slot,i.id)){save();if(modal.open)wardrobeModal();else render({scroll:false});}return;}
 if(action==='depart'&&r.stage==='packing'){if(E.depart(r)){save();render();}else toast('出发托运上限 20 kg，再拿出一点东西吧。');return;}
 if(action==='choose'){if(E.choose(r,Number(b.dataset.index))){save();render();}return;}
 if(action==='next'){phoneUnlocked=false;E.afterResult(r);save();render();return;}
 if(action==='send'){if(E.sendMessage(profile,b.dataset.contact)){save();render();}return;}
 if((action==='social-skip'&&r.stage==='social')||(action==='social-done'&&r.stage==='chat')){E.advance(r);save();render();return;}
 if(r.stage==='return-pack'){
  if(action==='carry'||action==='wear'){if(!E.relocate(r,b.dataset.id,action==='carry'?'carry':'worn'))toast('随身包最多 7 kg，先腾一点位置。');save();render({scroll:false});return;}
  if(action==='discard'){E.removeItem(r,b.dataset.id,true);save();render({scroll:false});return;}
  if(action==='restore'){restoreModal();return;}
  if(action==='restore-item'){E.addItem(r,b.dataset.id);r.removed=r.removed.filter(x=>x!==b.dataset.id);save();closeModal();render({scroll:false});return;}
  if(action==='return-finish'){if(E.beginReflection(r,true)){save();render();}else toast('旅费不够，再整理一下箱子吧。');return;}
 }
 if(action==='finish'&&r.stage==='reflect'){const rec=E.finish(profile,b.dataset.ending);if(rec){save();render();}return;}
}
document.addEventListener('click',event=>{const b=event.target.closest('[data-action]');if(!b||b.disabled)return;dispatch(b.dataset.action,b);});
document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();closeModal();view='map';render();});
modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal();}});
// A second tab may have progressed further. Adopt its save instead of overwriting it.
window.addEventListener('storage',event=>{if(event.key!==E.SAVE_KEY||!event.newValue)return;const incoming=E.parseSave(event.newValue);if(incoming){profile=incoming;closeModal();render({scroll:false});toast('旅行已与另一个窗口同步。');}});
function viewHash(){return '#'+view+(view==='phone'&&selectedContact?'/'+selectedContact:view==='record'&&selectedRecord?'/'+selectedRecord.runId:'');}
function readLocation(){const [next,id]=location.hash.slice(1).split('/');view=['map','play','journal','phone','records','record'].includes(next)?next:'map';selectedContact=next==='phone'&&CONTACTS.some(c=>c.id===id)?id:null;if(next==='record')selectedRecord=profile.records.find(r=>r.runId===id);closeModal();render({sync:false});}
window.addEventListener('popstate',readLocation);
readLocation();
document.fonts.ready.then(drawCanvases);
if(hadCorrupt)toast('旧存档暂时读不到，已保留备份。可以重新出发。');
if(!storageOK)toast('浏览器暂时不能存档，旅行仍可继续。');
