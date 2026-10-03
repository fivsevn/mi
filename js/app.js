import {HANDLE_TRAVEL,drawSuitcase,drawSuitcaseLid,drawScale,drawPackingItem} from './packing-art.js?v=packing-scale-29';
import {installPackingInput,installSuitcaseInput,installSuitcasePullInput} from './packing-input.js?v=packing-scale-29';
import {drawFoldedTitle} from './folded-paper.js?v=paper-study-30';
import {paintStoryPapers} from './paper-art.js?v=paper-layer-5';
import {drawUI} from './ui-art.js?v=paper-study-31';
import {paintSurface} from './scene.js?v=paper-study-32';
import { geographyFor,routePins } from '../data/geography.js?v=atlas-64';
import { drawJourneyMap,drawLocalMap,drawPhoneMap,pinPosition } from './maps.js?v=paper-study-30';
import { placeFor } from '../data/routes/africa-stories.js?v=atlas-64';
import { ROUTES } from '../data/routes/index.js?v=atlas-64';
import { ITEMS,itemById,BAG_LIMIT,HAND_LIMIT } from '../data/items.js?v=atlas-64';
import { CONTACTS,SOCIAL_PROMPT } from '../data/contacts.js?v=atlas-64';
import { ENDINGS,returnQuestions } from '../data/endings.js?v=atlas-64';
import * as E from './engine.js?v=atlas-64';
import { drawMap,africaHitPath,scene,avatar } from './art.js?v=story-pixel-6';
const $=s=>document.querySelector(s),app=$('#app'),modal=$('#modal');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'¥ '+Math.round(n).toLocaleString('zh-CN'),kg=n=>Number(n||0).toFixed(1);
let africaSelected=false,phoneAwake=false,phoneSignal=0,mapZoom=1,mapQuery='',mapFocus='';
const atlasFocus=routePins.find(p=>p.id==='safari').coord,atlasAnchorX=(atlasFocus[0]+180)/360,atlasAnchorY=(30+(90-atlasFocus[1])*3)/600;
let atlasPan=0,atlasDrag=null,suppressAtlasClick=false;
let storageOK=true,view='map',phoneApp='home',phoneUnlocked=false,phoneReturn='map',selectedContact=null,caseOpen=false,notesRegion=null,toastTimer,locationTimer;
function readProfile(){try{const raw=localStorage.getItem(E.SAVE_KEY);return raw?E.parseSave(raw)||E.freshProfile():E.freshProfile();}catch{storageOK=false;return E.freshProfile();}}
let profile=readProfile();
const run=()=>profile.run,active=()=>run()&&run().stage!=='ending';
const current=()=>run()&&['event','result','social','chat'].includes(run().stage)?E.currentNode(run()):null;
const clockTime=()=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
function save(){try{localStorage.setItem(E.SAVE_KEY,JSON.stringify(profile));storageOK=true;}catch{storageOK=false;}updateSaveStatus();}
function updateSaveStatus(){$('#save-status').textContent=storageOK?'':'暂时无法存档 · 请勿关闭本页';}
function toast(t){$('#toast').textContent=t;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2400);}
const arrow='<i class="px-arrow" aria-hidden="true"></i>';
function btn(label,action,extra='',kind=''){return `<button class="btn ${kind}" data-action="${action}" ${extra}>${label}${arrow}</button>`;}
function openModal(title,body,actions=''){modal.classList.toggle('phone-modal',view==='phone');modal.innerHTML=`<div class="modal-head"><h2 id="modal-title">${title}</h2><button class="close-btn" data-action="close" aria-label="关闭">×</button></div><div class="modal-body">${body}</div><div class="modal-actions">${actions}</div>`;if(!modal.open)modal.showModal();drawCanvases();}
function closeModal(){modal.close();}
let phoneBackdrop=null;
function capturePhoneBackdrop(){
 const layer=document.createElement('div');layer.className='phone-backdrop';layer.inert=true;layer.setAttribute('aria-hidden','true');
 const source=app.querySelector(':scope > section');if(!source)return;
 const copy=source.cloneNode(true),originals=source.querySelectorAll('canvas');
 copy.querySelectorAll('canvas').forEach((canvas,i)=>{const original=originals[i],style=getComputedStyle(original);canvas.width=original.width;canvas.height=original.height;canvas.style.width=style.width;canvas.style.height=style.height;canvas.getContext('2d').drawImage(original,0,0);for(const attr of [...canvas.attributes])if(attr.name.startsWith('data-'))canvas.removeAttribute(attr.name);});
 copy.querySelectorAll('[id]').forEach(el=>el.removeAttribute('id'));layer.dataset.scroll=source.querySelector('.paper-stack,.packing-shelf')?.scrollTop||source.scrollTop;layer.append(copy);phoneBackdrop=layer;
}
function activeScroller(){return app.querySelector(':scope > .play-screen > .paper-stack, :scope > .packing-screen .packing-shelf, :scope > .phone-scene .phone-scroll');}
function render({sync=true,keepScroll=false}={}){
 const oldScroll=keepScroll?activeScroller()?.scrollTop||0:0;
 if(view==='phone'&&!app.querySelector('.phone-scene')){if(!app.querySelector(':scope > section'))renderMap();capturePhoneBackdrop();}
 clearTimeout(locationTimer);document.body.dataset.view=view;
 if(view==='play'&&!run())view='map';
 if(sync&&location.hash!==viewHash())history.pushState(null,'',viewHash());
 if(view==='map')renderMap();else if(view==='route-map'){phoneReturn='map';phoneApp='maps';phoneUnlocked=false;view='phone';renderPhone();}else if(view==='phone')renderPhone();else renderPlay();
 if(view==='phone'&&phoneBackdrop){app.prepend(phoneBackdrop);const paperScroll=phoneBackdrop.querySelector('.paper-stack,.packing-shelf')||phoneBackdrop.firstElementChild;paperScroll.scrollTop=Number(phoneBackdrop.dataset.scroll||0);}
 if(keepScroll){const scroller=activeScroller();if(scroller)scroller.scrollTop=oldScroll;}
 drawCanvases();startMini();updateSaveStatus();
}
function drawCanvases(){document.querySelectorAll('.choice,.mini-controls .btn,.paper-title:not(.folded-title)').forEach(el=>{if(!el.querySelector('canvas[data-ui]'))el.insertAdjacentHTML('afterbegin',`<canvas class=control-paper data-ui="${el.classList.contains('paper-title')?'title-strip':'plaque'}" aria-hidden=true></canvas>`);});document.querySelectorAll('.phone-screen .btn,.phone-screen .contact,.phone-screen .bubble,.phone-screen .outfit-btn,.phone-screen .phone-note,.phone-screen .contact-avatar,.phone-screen .chat-bar,.phone-screen .phone-status,.phone-screen .avatar-row,.phone-modal,.phone-modal .btn,.phone-modal .close-btn').forEach(el=>{if(!el.querySelector(':scope > canvas[data-ui]'))el.insertAdjacentHTML('afterbegin',`<canvas class=crystal-surface data-ui="${el.classList.contains('contact')?'phone-row':el.classList.contains('contact-avatar')?'phone-seal':el.classList.contains('bubble')?(el.classList.contains('mi')?'phone-message-mi':'phone-message'):el.classList.contains('phone-note')?'phone-note':el.classList.contains('chat-bar')||el.classList.contains('phone-status')?'phone-bar':'phone-control'}" aria-hidden=true></canvas>`);});document.querySelectorAll('canvas[data-ui]').forEach(c=>drawUI(c,c.dataset.ui));paintSurface($("#surface")); document.querySelectorAll('canvas[data-scene]').forEach(c=>scene(c,c.dataset.scene,{...run()?.outfit,goggles:run()?.flags.goggles},0,c.dataset.story));document.querySelectorAll('canvas[data-avatar]').forEach(c=>avatar(c,{...run()?.outfit,goggles:run()?.flags.goggles}));if($('#world-map'))drawMap($('#world-map'),E.visibleNotes(run()).map(n=>placeFor(n.day).id));if($('#africa-map'))drawJourneyMap($('#africa-map'),visitedPlaces());if($('#phone-africa-map'))drawPhoneMap($('#phone-africa-map'),visitedPlaces());document.querySelectorAll('canvas[data-minimap]').forEach(c=>drawLocalMap(c,mapNode()));document.querySelectorAll('canvas[data-folded-title]').forEach(drawFoldedTitle);resizePhoneMap();paintStoryPapers();paintPacking();}
function renderMap(){app.innerHTML=`<section class="desk" aria-label="米的桌面"><canvas id="atlas-rose" class="atlas-rose" aria-hidden="true"></canvas><button class="desk-phone ${phoneAwake?'phone-alert':''}" data-action="phone" aria-label="${phoneAwake?'手机亮了，打开非洲地图':'拿起手机'}"><canvas data-ui="${phoneAwake?'small-phone-lit':'small-phone'}" aria-hidden="true"></canvas><span class="mini-clock-face" data-clock>${clockTime()}</span></button><div class="map-paper"><a class="paper-title folded-title" href="#map" data-action="map" aria-label="米的地图 MI’S MAP"><canvas data-folded-title aria-hidden="true"></canvas></a><div class="map-view" style="--pan-x:${atlasPan}px;--focus-x:${atlasAnchorX*100}%;--focus-y:${atlasAnchorY*100}%"><canvas id="world-map" role="img" aria-label="米的世界地图"></canvas><svg class="map-hit" viewBox="0 0 1080 600" preserveAspectRatio="xMidYMid meet"><a href="#map" data-action="journey" aria-label="在手机上查看非洲地图"><path d="${africaHitPath()}"/><text x="592" y="258">AFRICA</text></a></svg></div></div></section>`;}
function mapNode(){const r=run();return current()||(r?.stage==='rest'?ROUTES[0].nodes[r.node-1]:r&&['return-pack','reflect'].includes(r.stage)?ROUTES[0].nodes.at(-1):null);}
function visitedPlaces(){
 const r=run();if(!r)return [];
 const nodes=E.visibleNotes(r).map(note=>ROUTES[0].nodes.find(n=>n.id===note.nodeId));if(current())nodes.push(current());
 return routePins.filter(p=>nodes.some(n=>n?.location===p.id&&geographyFor(n).key!=='shanghai'&&!(p.id==='seychelles'&&n.id==='flight-island'))).map(p=>p.id);
}
function nextPlace(){const r=run();if(!r||['reason','packing'].includes(r.stage))return 'safari';if(r.stage==='ending')return null;return E.segmentFor(r)?.id||'mauritius';}
function continueJourney(){const r=run();if(!r)startRun();else{if(r.stage==='rest')E.resumeSegment(r);view='play';save();render();}}
function phoneMapApp(){const visited=visitedPlaces(),next=nextPlace();return `<div class="navigation-app"><div class="navigation-square" style="--map-zoom:${mapZoom}"><canvas id="phone-africa-map" role="img" aria-label="非洲旅行导航地图"></canvas>${routePins.map(pin=>{const [x,y]=pinPosition(pin,384),on=visited.includes(pin.id),ready=next===pin.id;return `<button class="route-pin ${on?'visited':''} ${ready?'ready':''} ${mapFocus===pin.id?'search-match':''}" data-action="visit-place" data-place="${pin.id}" style="left:${x/384*100}%;top:${y/384*100}%" aria-label="${esc(pin.label)}${ready?'，下一站':on?'，已到访':'，尚未到访'}" ${on||ready?'':'disabled'}><i aria-hidden="true"></i><span class="pin-label">${esc(pin.label)}</span></button>`;}).join('')}</div><div class="map-search-area"><div class="map-search-bar"><button data-action="phone-home" class="map-back" aria-label="返回手机桌面">‹</button><span class="map-search-symbol" aria-hidden="true"></span><input class="map-search-input" type="search" placeholder="" aria-label="搜索旅行地点" value="${esc(mapQuery)}" autocomplete="off"><button data-action="map-search-clear" class="map-clear" aria-label="清除搜索">×</button></div><div class="map-search-results" hidden></div></div><div class="map-controls"><button data-action="map-zoom" data-direction="1" aria-label="放大地图">+</button><button data-action="map-zoom" data-direction="-1" aria-label="缩小地图">−</button><button data-action="map-center" aria-label="显示全部旅行地点">⌖</button></div></div>`;}
function resizePhoneMap(){const canvas=$('#phone-africa-map');if(!canvas)return;const square=canvas.parentElement,height=Math.round(384*square.clientHeight/square.clientWidth);canvas.dataset.height=height;drawPhoneMap(canvas,visitedPlaces());square.querySelectorAll('.route-pin').forEach(button=>{const pin=routePins.find(p=>p.id===button.dataset.place),[x,y]=pinPosition(pin,height);button.style.left=x/384*100+'%';button.style.top=y/height*100+'%';});}
function searchMap(){const box=$('.map-search-results');if(!box)return;const q=mapQuery.trim().toLowerCase();box.hidden=!q;const aliases={safari:'kenya tanzania 肯尼亚 坦桑尼亚 内罗毕 草原',seychelles:'seychelles 马埃 mahe',falls:'victoria falls 津巴布韦 赞比亚',chobe:'chobe 博茨瓦纳',namibia:'namibia 温得和克',cape:'cape town 南非 开普敦',mauritius:'mauritius 毛里求斯'};const matches=routePins.filter(p=>(p.label+' '+aliases[p.id]).toLowerCase().includes(q));box.innerHTML=q?(matches.length?matches.map(p=>`<button data-action="map-focus" data-place="${p.id}"><i aria-hidden="true"></i>${esc(p.label)}</button>`).join(''):'<p role="status">没有匹配地点</p>'):'';}
function scenePanel(type,overlay=''){
 const place=geographyFor(mapNode()).label;
 return `<div class="scene-panel"><div class="scene-view"><canvas data-scene="${type}" data-story="${esc(mapNode()?.id||run()?.stage||type)}" role="img" aria-label="米的像素场景"></canvas>${overlay}</div><div class="scene-dock"><button class="pocket-phone" data-action="phone" aria-label="拿起手机"><canvas data-ui="scrap-phone" aria-hidden="true"></canvas></button><button class="location-whisper" data-action="hide-location" hidden>${esc(place)}</button><button class="pocket-map map-paper" data-action="location" aria-label="查看当前位置" aria-expanded="false"><canvas data-minimap aria-hidden="true"></canvas></button></div></div>`;
}
function gameScreen(type,title,text,choices,{overlay='',className='',extra=''}={}){return `<section class="play-screen ${className}">${scenePanel(type,overlay)}<div class="paper-stack" tabindex="0" aria-label="故事纸条"><div class="paper-pile"><div class="story-copy"><h1>${esc(title)}</h1><p class="prose ${className?'mini-text':''}">${esc(text)}</p>${extra}</div><div class="choice-scroll" tabindex="0" aria-label="选项">${choices}</div></div></div></section>`;}
function choiceButtons(n){const r=run();return n.choices.map((c,i)=>{if(c.requires&&!r.bag.includes(c.requires)||c.condition&&!c.condition(r))return '';const cost=E.choiceCost(r,c);return `<button class="choice" data-action="choose" data-index="${i}" ${E.canAfford(r,cost)?'':'disabled'}><span class="choice-number">${String(i+1).padStart(2,'0')}</span><span><b>${esc(c.label)}</b>${c.detail?`<small>${esc(c.detail)}</small>`:''}</span><span class="price">${cost?money(cost):arrow}</span></button>`;}).join('');}
function renderPlay(){const r=run();
 if(r.stage==='rest'){const s=E.completedSegment(r),next=E.segmentFor(r);app.innerHTML=gameScreen(s.scene,'这一段先到这里。',s.closing,`${btn('回到桌上，下次再走','map')}${btn(next?'接着走':'收拾回家的箱子','resume-segment')}`);return;}

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
function returnItems(){const r=run();return `<p class="micro">随身包 ${kg(E.carryWeight(r))} / ${HAND_LIMIT} kg</p>${r.bag.map(id=>{const i=itemById[id];return `<div class="inventory-row"><strong>${esc(i.name)}</strong><small>${kg(i.weight)} kg${r.carry.includes(id)?' · 随身':r.worn.includes(id)?' · 穿着':''}</small><div class="item-actions"><button data-action="carry" data-id="${id}" ${i.carryOnly?'disabled':''}>${r.carry.includes(id)?'放回':'随身带'}</button>${i.slot?`<button data-action="wear" data-id="${id}">${r.worn.includes(id)?'脱下':'穿上'}</button>`:''}<button data-action="discard" data-id="${id}">留下</button></div></div>`;}).join('')}${r.removed.length?btn('放回刚才取出的东西','restore'):''}`;}
function renderPacking(){if(run().stage==='packing'){renderPackingScene();return;}const r=run(),ret=r.stage==='return-pack',over=E.checkedWeight(r)>20,fee=E.overweightFee(r);app.innerHTML=gameScreen(ret?'airport':'home',ret?'什么跟米一起回家？':'箱子摊开了。',ret?`秤上 ${kg(E.checkedWeight(r))} kg。\n箱子还是那个箱子。`:packingThought(r),`${btn(caseOpen?'合上箱子看看':'打开行李箱','open-case')}${caseOpen?returnItems():''}${btn(ret?(over?`付 ${money(fee)}，带回家`:'拉上箱子，回家'):'关上箱子，出发',ret?'return-finish':'depart',over&&(!ret||!E.canAfford(r,fee))?'disabled':'')}`,{overlay:`<button class="case-hotspot" data-action="open-case" aria-label="打开地上的行李箱"></button>`});}
const FLOOR_COLUMNS=6;
let packingPan=.7,packingSelected=null,packingPull=0;
function packingObject(id,zone){const i=itemById[id];return `<button class="packing-object" data-action="pack-item" data-pack-id="${id}" data-pack-zone="${zone}" data-id="${id}" aria-label="${esc(i.name)}，查看物品" aria-pressed="${packingSelected===id}"><canvas data-pack-art="${id}" aria-hidden="true"></canvas></button>`;}
function packingInfoContent(){const i=itemById[packingSelected];return i?`<div class="packing-info-name"><strong>${esc(i.name)}</strong></div><p>${esc(i.note)}</p>`:'';}
function selectPackingItem(id){
 if(!itemById[id]||run()?.packingClosed)return;packingSelected=id;const info=document.querySelector('.packing-info');if(!info)return;
 info.innerHTML=packingInfoContent();info.hidden=false;document.querySelectorAll('[data-pack-id]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.packId===id)));
}

function clearPackingInfo(){
 packingSelected=null;const info=document.querySelector('.packing-info');if(info)info.hidden=true;
 document.querySelectorAll('[data-pack-id]').forEach(b=>b.setAttribute('aria-pressed','false'));
}

function constrainPackingPosition(x,y){
 const left=x<.5;return {x:Math.round(Math.max(left ? .1125 : .6025,Math.min(left ? .3975 : .8875,x))*10000)/10000,y:Math.round(Math.max(.178,Math.min(.727,y))*10000)/10000};
}
function freePackingItems(r){
 if(!r.packingPositions||typeof r.packingPositions!=='object'||Array.isArray(r.packingPositions))r.packingPositions={};
 const packed=r.bag.filter(id=>!r.carry.includes(id)&&!r.worn.includes(id)&&id!=='phone');
 for(const id of Object.keys(r.packingPositions))if(!packed.includes(id))delete r.packingPositions[id];
 packed.forEach((id,index)=>{
  const p=r.packingPositions[id];
  if(p&&Number.isFinite(p.x)&&Number.isFinite(p.y)){r.packingPositions[id]={...constrainPackingPosition(p.x,p.y),z:Number.isFinite(p.z)?p.z:index+1};return;}
  const legacy=Number.isInteger(r.packingSlots?.[id])?r.packingSlots[id]:index;
  r.packingPositions[id]={...constrainPackingPosition(.625+(legacy%3)*.12,.21+(Math.floor(legacy/3)%4)*.16),z:index+1};
 });
 return packed;
}
function renderPackingScene(){
 const r=run(),closed=r.packingClosed===true,ready=closed&&r.packingReady===true,weight=E.checkedWeight(r),tone=weight>=25?'danger':weight>=20?'warning':'normal',packed=freePackingItems(r),floor=ITEMS.filter(i=>!i.souvenir&&i.id!=='phone'&&!r.bag.includes(i.id));
 const objects=packed.map(id=>{const p=r.packingPositions[id];return `<div class="packing-free-object" data-pack-drop="case" style="left:${p.x*100}%;top:${p.y*100}%;z-index:${p.z}">${packingObject(id,'case')}</div>`;}).join('');
 app.innerHTML=`<section class="packing-screen ${closed?'case-closed':''} ${ready?'packing-ready':closed?'packing-review':''}" style="${packingPullStyle(closed?packingPull:0)}" aria-label="整理行李"><div class="packing-viewbox"><div class="packing-panorama" tabindex="0" aria-label="左右滑动查看行李箱"><div class="packing-stage"><canvas class="suitcase-art" data-suitcase aria-hidden="true"></canvas>${ready?`<button class="suitcase-handle" data-pull-handle aria-label="向上拉满拉杆，出发"></button>`:closed?'':`<div class="packing-lid"><canvas class="suitcase-lid-art" data-suitcase-lid aria-hidden="true"></canvas><div class="packing-lid-objects"><button class="packing-phone" data-action="phone" aria-label="拿起手机"><canvas data-ui="scrap-phone" aria-hidden="true"></canvas></button><button class="packing-map" data-action="phone-maps" aria-label="打开旅行地图"><canvas data-minimap aria-hidden="true"></canvas></button></div></div><div class="packing-bay packing-bay-left" data-pack-drop="case" aria-label="左侧箱内"></div><div class="packing-bay packing-bay-right" data-pack-drop="case" aria-label="右侧箱内"></div><div class="packing-free-objects">${objects}</div>`}<button class="suitcase-zipper" data-action="packing-close" aria-label="${closed?'打开行李箱':'合上行李箱'}"></button></div></div>${closed&&!ready?`<div class="packing-weighing"><div class="packing-scale ${tone}" role="status" aria-label="${kg(weight)} 公斤"><canvas data-scale data-tone="${tone}" aria-hidden="true"></canvas><output>${kg(weight)}<small>kg</small></output><div class="packing-decisions"><button data-action="packing-confirm" ${weight>BAG_LIMIT?'disabled':''}>就带这些</button><button data-action="packing-edit">继续整理</button></div></div></div>`:''}${!closed&&r.carry.filter(id=>id!=='phone').length?`<div class="packing-carry" aria-label="随身物品">${r.carry.filter(id=>id!=='phone').map(id=>packingObject(id,'carry')).join('')}</div>`:''}</div>${!ready?`<div class="packing-floor" data-pack-drop="floor" aria-label="箱外物品栏" ${closed?'inert aria-hidden="true"':''}><aside class="packing-info" aria-label="物品说明" role="status" ${packingSelected&&!closed?'':'hidden'}>${packingInfoContent()}</aside><div class="packing-shelf" tabindex="0" aria-label="待装入的物品">${floor.map(i=>`<div class="packing-slot" data-pack-drop="floor">${packingObject(i.id,'floor')}</div>`).join('')}${Array.from({length:(FLOOR_COLUMNS-floor.length%FLOOR_COLUMNS)%FLOOR_COLUMNS},()=>'<div class="packing-slot" data-pack-drop="floor"></div>').join('')}</div></div>`:''}</section>`;
}
function paintPacking(){
 const viewport=document.querySelector('.packing-screen:not(.case-closed) .packing-panorama');if(viewport)panPacking(packingPan);
 document.querySelectorAll('[data-suitcase]').forEach(c=>drawSuitcase(c,run()?.packingClosed===true,packingPull));document.querySelectorAll('[data-suitcase-lid]').forEach(drawSuitcaseLid);document.querySelectorAll('[data-scale]').forEach(c=>drawScale(c,c.dataset.tone));document.querySelectorAll('[data-pack-art]').forEach(c=>drawPackingItem(c,itemById[c.dataset.packArt]));
}
function packingPullStyle(progress){
 const extra=Math.round(progress*HANDLE_TRAVEL),height=286+extra;
 return `--handle-extension:${extra/HANDLE_TRAVEL};--lock-top:${(100+extra)/height*100}%;--lock-height:${60/height*100}%`;
}
function pullPackingHandle(progress,commit=false){
 const r=run(),screen=document.querySelector('.packing-screen.case-closed');if(!r||r.stage!=='packing'||!r.packingReady||!screen)return;
 packingPull=progress;screen.style.cssText=packingPullStyle(progress);drawSuitcase(screen.querySelector('[data-suitcase]'),true,progress);
 if(commit&&progress===1){
  if(E.checkedWeight(r)>BAG_LIMIT){pullPackingHandle(0);return;}
  dispatch('depart',null);
 }
}
function panPacking(value){
 if(run()?.packingClosed)return;
 const viewport=document.querySelector('.packing-panorama');if(!viewport)return;
 const range=viewport.scrollWidth-viewport.clientWidth;if(range<=0)return;
 packingPan=Math.max(0,Math.min(1,value));viewport.scrollLeft=packingPan*range;
}
function scrollPackingBy(delta){
 const viewport=document.querySelector('.packing-panorama');if(!viewport)return;
 const range=viewport.scrollWidth-viewport.clientWidth;if(range>0)panPacking((viewport.scrollLeft+delta)/range);
}
document.addEventListener('scroll',e=>{
 const viewport=e.target;if(!viewport.matches?.('.packing-panorama')||viewport.closest('.case-closed'))return;
 const range=viewport.scrollWidth-viewport.clientWidth;if(range>0)packingPan=viewport.scrollLeft/range;
},true);
function movePackingItem(id,destination,point){
 const r=run(),i=itemById[id];if(!r||r.stage!=='packing'||r.packingClosed||!i)return;
 const adding=destination==='case',present=r.bag.includes(id);freePackingItems(r);
 if(adding){
  if(!present)E.addItem(r,id);freePackingItems(r);
  if(!i.carryOnly&&point){const box=document.querySelector('.packing-stage').getBoundingClientRect();r.packingPositions[id]={...constrainPackingPosition((point.x-box.left)/box.width,(point.y-box.top)/box.height),z:Math.max(0,...Object.values(r.packingPositions).map(p=>p.z))+1};}
 }else if(present){E.removeItem(r,id);delete r.packingPositions[id];}else return;
 freePackingItems(r);save();render({keepScroll:true});
}
installPackingInput((id,destination,source,point)=>movePackingItem(id,destination,point),direction=>panPacking(packingPan+direction*.02),selectPackingItem);
installSuitcaseInput(scrollPackingBy);
installSuitcasePullInput(()=>{const r=run(),stage=document.querySelector('.packing-ready .packing-stage');return r?.stage==='packing'&&r.packingReady&&stage?{distance:stage.clientWidth*HANDLE_TRAVEL/400}:null;},pullPackingHandle);
// Keyboard camera control and focus reveal the same large panorama.
document.addEventListener('keydown',e=>{if(!e.target.closest('.packing-panorama')||e.target.closest('[data-pack-id]'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();panPacking(packingPan+(e.key==='ArrowLeft'?-.2:.2));}});
document.addEventListener('focusin',e=>{if(e.target.closest('.packing-phone,.packing-map'))panPacking(0);else if(e.target.closest('.suitcase-zipper'))panPacking(1);});
const greetings={he:['出门记得吃饭。','刚才吃过了。','那就好。下次拍给我看。'],lan:['看到好看的天，发给我。','刚才想起你了。','我在。慢慢说。'],you:['替我看看路边的小动物。','路上遇到什么再告诉你。','好，我等着。'],qi:['护照带了吧？','带了，放在最里面。','那就放心了。'],wu:['路上有怪东西记得叫我。','什么才算怪东西？','你犹豫的时候就算。'],blank:['到了说一声。','只是想跟你说一下。','嗯，我在。']};
function allMessages(){return run()?.messages||[];}
function chatHTML(lines,c){return lines.map(l=>`<div class="bubble ${l.from==='mi'?'mi':''}"><span class="chat-speaker">${l.from==='mi'?'米':esc(c.name)}</span>${esc(l.text)}</div>`).join('');}
function chatApp(){const r=run(),social=r?.stage==='social',chat=r?.stage==='chat'?r.messages.at(-1):null;const c=CONTACTS.find(c=>c.id===(chat?.contact||selectedContact));
 if(c){const messages=allMessages().filter(m=>m.contact===c.id);return `<div class="phone-scroll"><div class="chat-thread">${chatHTML([{from:'friend',text:greetings[c.id][0]}],c)}${messages.map(m=>chatHTML(m.lines,c)).join('')}</div></div>${!chat&&r&&!messages.some(m=>m.event==='hello')?btn(esc(greetings[c.id][1]),'hello',`data-contact="${c.id}"`):''}`;}
 return `<div class="phone-scroll">${social?`<p class="social-quote">${SOCIAL_PROMPT}</p>`:''}<div class="contact-list">${CONTACTS.map(c=>{const last=allMessages().filter(m=>m.contact===c.id).at(-1)?.lines.at(-1)?.text||greetings[c.id][0];return `<button class="contact" data-action="${social?'send':'contact'}" data-contact="${c.id}"><span class="contact-avatar"><canvas data-ui="friend-${CONTACTS.indexOf(c)}" aria-hidden="true"></canvas></span><span><b>${esc(c.name)}</b><small>${esc(last)}</small></span></button>`;}).join('')}</div></div>`;
}
function notesApp(){const r=run(),notes=E.visibleNotes(r).filter(n=>!notesRegion||ROUTES[0].nodes.find(node=>node.id===n.nodeId)?.location===notesRegion),record=!notesRegion&&r?.stage==='ending'&&r.notebookVersion===1?profile.records.find(x=>x.runId===r.id):null,end=ENDINGS.find(e=>e.id===record?.endingId);return `<div class="phone-scroll notes-app">${notes.length?notes.map(n=>`<article class="phone-note"><small>第 ${n.day} 天 · ${esc(n.place)}</small><p>${esc(n.text)}</p></article>`).join(''):'<p class="empty-notes">还没写下什么。</p>'}${end?`<article class="phone-note ending-note"><small>回家以后</small><h2>${esc(end.title)}</h2><p>${esc(end.text)}</p><p>${esc(record.returnReason)}</p>${(r.itemHistory||[]).map(x=>`<p>${esc(itemById[x.id]?.name)} · ${esc(x.text)}</p>`).join('')}</article>`:''}</div>`;}
function bagApp(){const r=run();return `<div class="phone-scroll">${r?`<div class="avatar-row"><canvas data-avatar aria-label="米的穿搭"></canvas><p>${packingThought(r)}</p></div>${outfitControls(r)}<div class="case-items">${r.bag.map(id=>btn(esc(itemById[id].name),'inspect',`data-id="${id}"`)).join('')}</div>`:'<p class="empty-notes">箱子还在房间里。</p>'}</div>`;}
function phoneAppIcon(id,name){return `<button ${['photos','bills'].includes(id)?'aria-disabled="true"':id==='mi'?'data-action="map"':'data-action="phone-app"'} data-app="${id}"><canvas class="app-icon" data-ui="icon-${id}" aria-hidden="true"></canvas><span>${name}</span></button>`;}
function renderPhone(){const labels={home:'',chat:'消息',notes:'笔记',bag:'行李',settings:'设置',maps:'旅行地图'};const body=phoneApp==='maps'?phoneMapApp():phoneApp==='chat'?chatApp():phoneApp==='notes'?notesApp():phoneApp==='bag'?bagApp():phoneApp==='settings'?`<div class="phone-scroll settings-app">${run()?btn('重新收拾行李','restart'):''}<button class="btn" data-action="sound">${soundOn?'声音开':'声音关'}</button></div>`:`<div class="phone-apps"><div class="phone-launch-grid">${[['settings','设置'],['bag','行李'],['maps','旅行地图'],['photos','相册'],['bills','57pay']].map(([id,name])=>phoneAppIcon(id,name)).join('')}</div><div class="phone-dock"><canvas class="dock-paper" data-ui="phone-dock" aria-hidden="true"></canvas>${[['mi','米的地图'],['chat','消息'],['notes','笔记']].map(([id,name])=>phoneAppIcon(id,name)).join('')}</div></div>`;
 app.innerHTML=`<section class="phone-scene ${phoneUnlocked&&phoneApp==='maps'?'phone-map-open':''}"><div class="pixel-phone"><canvas class="phone-casing" data-ui="shell" aria-hidden="true"></canvas><div class="phone-hardware"><i></i></div><div class="phone-screen"><canvas class="phone-glass" data-ui="glass-wallpaper" aria-hidden="true"></canvas><div class="phone-status"><span class="phone-network"><span class="phone-signal" aria-label="信号充足"><i></i><i></i><i></i><i></i></span><span>57Signal</span></span>${phoneUnlocked?`<span data-clock>${clockTime()}</span>`:''}<span class="phone-power"><span>35%</span><canvas class="battery-pixel" data-ui="battery" aria-label="电量35%"></canvas></span></div>${phoneUnlocked?`${phoneApp==='maps'?'':`<div class="chat-bar"><button data-action="${phoneApp==='chat'&&selectedContact?'contacts':'phone-home'}" aria-label="返回手机桌面">返回</button>${phoneApp!=='home'?`<canvas class="phone-app-mark" data-ui="icon-${phoneApp}" aria-hidden="true"></canvas>`:''}<h1>${labels[phoneApp]}</h1></div>`}${body}`:`<div class="lock-screen"><div class="lock-clock"><div class="lock-time" data-clock>${clockTime()}</div><div class="lock-date" data-clock-date>${new Intl.DateTimeFormat('zh-CN',{month:'long',day:'numeric',weekday:'long'}).format(new Date())}</div></div><button class="tap-unlock" data-action="unlock">轻按解锁</button></div>`}</div><button class="phone-home" data-action="close-phone" aria-label="退出手机" title="退出手机"><canvas data-ui="home-key" aria-hidden="true"></canvas></button></div></section>`;
}
function startRun(){packingSelected=null;profile.run=E.createRun();profile.contacts={};profile.messages=[];phoneApp='home';selectedContact=null;caseOpen=false;view='play';closeModal();save();render();}
function openPhone(){phoneAwake=false;notesRegion=null;phoneReturn=view==='play'?'play':view==='route-map'?'route-map':'map';phoneApp=phoneReturn==='map'&&africaSelected?'maps':'home';phoneUnlocked=false;selectedContact=null;view='phone';render();}
function closePhone(){const advance=phoneReturn==='play'&&['social','chat'].includes(run()?.stage),paperScroll=Number(phoneBackdrop?.dataset.scroll||0);if(advance){E.advance(run());save();}view=phoneReturn;render();if(view==='play'&&!advance&&activeScroller())activeScroller().scrollTop=paperScroll;}
function dispatch(action,b){const r=run();
 if(miniAction(action,b))return;
 if(action==='map-zoom'){mapZoom=Math.max(1,Math.min(2.2,mapZoom+Number(b.dataset.direction)*.3));$('.navigation-square').style.setProperty('--map-zoom',mapZoom);return;}
 if(action==='map-center'){mapZoom=1;mapFocus='';mapQuery='';$('.navigation-square').style.setProperty('--map-zoom',1);$('.map-search-input').value='';document.querySelectorAll('.search-match').forEach(e=>e.classList.remove('search-match'));searchMap();return;}
 if(action==='map-search-clear'){mapQuery='';$('.map-search-input').value='';$('.map-search-input').blur();searchMap();return;}
 if(action==='map-focus'){mapFocus=b.dataset.place;mapZoom=1;mapQuery=routePins.find(p=>p.id===mapFocus).label;$('.map-search-input').value=mapQuery;$('.map-search-input').blur();$('.map-search-results').hidden=true;$('.navigation-square').style.setProperty('--map-zoom',1);document.querySelectorAll('.navigation-app .route-pin').forEach(e=>e.classList.toggle('search-match',e.dataset.place===mapFocus));return;}
 if(action==='journey'){africaSelected=true;phoneAwake=true;const phone=$('.desk-phone');if(phone){phone.classList.add('phone-alert');phone.setAttribute('aria-label','手机亮了，打开非洲地图');phone.querySelector('canvas').dataset.ui='small-phone-lit';drawUI(phone.querySelector('canvas'),'small-phone-lit');phone.classList.remove('phone-buzz');void phone.offsetWidth;phone.classList.add('phone-buzz');clearTimeout(phoneSignal);phoneSignal=setTimeout(()=>phone.classList.remove('phone-buzz'),1700);}return;}
 if(action==='visit-place'){
  const id=b.dataset.place;if(id===nextPlace()){continueJourney();return;}if(!visitedPlaces().includes(id))return;
  notesRegion=id;phoneApp='notes';phoneUnlocked=true;view='phone';render();return;
 }
 if(action==='resume-segment'){if(r&&E.resumeSegment(r)){view='play';closeModal();save();render();}return;}
 if(action==='phone-maps'){openPhone();phoneApp='maps';phoneUnlocked=true;render();return;}
 if(action==='phone'){openPhone();return;}
 if(action==='close-phone'){closePhone();return;}
 if(action==='unlock'){phoneUnlocked=true;render();return;}
 if(action==='phone-home'){phoneApp='home';selectedContact=null;render();return;}
 if(action==='phone-app'){notesRegion=null;phoneApp=b.dataset.app;selectedContact=null;render();return;}
 if(action==='map'){view='map';closeModal();render();return;}
 if(action==='continue'){view='play';closeModal();render();return;}
 if(action==='close'){closeModal();return;}
 if(action==='location'||action==='hide-location'){const el=$('.location-whisper'),map=$('.pocket-map');if(!el)return;el.hidden=action==='hide-location'||!el.hidden;map?.setAttribute('aria-expanded',String(!el.hidden));return;}
 if(action==='restart'){openModal('重新收拾这次的行李？','手机里的这本笔记，也会从空白开始。',btn('重新出发','confirm-start')+btn('先不换','close'));return;}
 if(action==='confirm-start'){startRun();return;}
 if(action==='contact'){selectedContact=b.dataset.contact;render();return;}
 if(action==='contacts'){selectedContact=null;render();return;}
 if(action==='inspect'){const i=itemById[b.dataset.id];if(!r||!r.bag.includes(i?.id))return;openModal(esc(i.name),`<p class="prose">${esc(i.note)}</p>${r.used?.[i.id]?`<p class="micro">这一路，拿出来用过 ${r.used[i.id]} 次。</p>`:''}`);return;}
 if(!r)return;
 if(action==='hello'){const c=CONTACTS.find(x=>x.id===b.dataset.contact);if(c&&!allMessages().some(m=>m.contact===c.id&&m.event==='hello')){r.messages.push({id:crypto.randomUUID(),contact:c.id,event:'hello',day:current()?.day||0,lines:[{from:'mi',text:greetings[c.id][1]},{from:'friend',text:greetings[c.id][2]}]});save();render();}return;}
 if(action==='reason'&&r.stage==='reason'){r.reason=['想看没见过的东西。','一直想去。','不知道。','票都买了。'][Number(b.dataset.id)];r.stage='packing';r.packingClosed=false;save();render();return;}
 if(action==='packing-close'&&r.stage==='packing'){r.packingClosed=!r.packingClosed;r.packingReady=false;packingPull=0;delete r.packingHandleExtended;save();render({keepScroll:true});return;}
 if(action==='packing-edit'&&r.stage==='packing'&&!r.packingReady){r.packingClosed=false;r.packingReady=false;packingPull=0;save();render({keepScroll:true});return;}
 if(action==='packing-confirm'&&r.stage==='packing'&&r.packingClosed&&E.checkedWeight(r)<=BAG_LIMIT){r.packingReady=true;packingSelected=null;packingPull=0;save();render();return;}
 if(action==='pack-item'){selectPackingItem(b.dataset.id);return;}
 if(action==='open-case'){caseOpen=!caseOpen;render();return;}
 if(action==='equip'){const i=itemById[b.dataset.id];if(i&&E.equip(r,i.slot,i.id)){save();render({keepScroll:true});}return;}
 if(action==='depart'&&r.stage==='packing'){if(!r.packingClosed||!r.packingReady)return;if(!r.bag.includes('passport'))E.addItem(r,'passport');if(E.depart(r)){save();render();}else{r.packingClosed=false;save();render();}return;}
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
function viewHash(){return view==='phone'?`#phone/${phoneApp}/${phoneReturn}${notesRegion?'/'+notesRegion:selectedContact?'/'+selectedContact:''}`:'#'+view;}
function readLocation(){const [v,a,b,c]=location.hash.slice(1).split('/');view=v==='route-map'?'route-map':v==='play'&&run()?'play':v==='phone'||['journal','records','record'].includes(v)?'phone':'map';if(view==='phone'){phoneApp=['home','chat','notes','bag','settings','maps'].includes(a)?a:['journal','records','record'].includes(v)?'notes':'home';phoneReturn=b==='play'&&run()?'play':'map';selectedContact=CONTACTS.some(x=>x.id===c)?c:null;notesRegion=phoneApp==='notes'&&routePins.some(p=>p.id===c)?c:null;}if(v==='route-map'){view='phone';phoneReturn='map';phoneApp='maps';}if(phoneApp==='maps')africaSelected=true;closeModal();render({sync:false});}
function dimDeskPhone(){phoneAwake=false;const phone=$('.desk-phone');if(!phone)return;phone.classList.remove('phone-alert','phone-buzz');phone.setAttribute('aria-label','拿起手机');const canvas=phone.querySelector('canvas');canvas.dataset.ui='small-phone';drawUI(canvas,'small-phone');clearTimeout(phoneSignal);}
document.addEventListener('click',e=>{if(view==='map'&&!e.target.closest('[data-action=journey],.desk-phone'))dimDeskPhone();},true);
// Leave iOS focus scrolling behind when the keyboard closes; keep map zoom independent.
function restoreSearchPosition(){requestAnimationFrame(()=>{if(!document.activeElement?.matches('.map-search-input')&&(window.visualViewport?.scale||1)<=1.01){window.scrollTo(0,0);resizePhoneMap();}});}
document.addEventListener('focusout',e=>{if(e.target.matches('.map-search-input')){restoreSearchPosition();setTimeout(restoreSearchPosition,350);}});
document.addEventListener('keydown',e=>{if(e.target.matches('.map-search-input')&&e.key==='Enter'&&!e.isComposing){e.preventDefault();e.target.blur();}});
document.addEventListener('pointerdown',e=>{const input=document.activeElement;if(input?.matches('.map-search-input')&&!e.target.closest('.map-search-area'))input.blur();});
window.visualViewport?.addEventListener('resize',()=>{if(!document.activeElement?.matches('.map-search-input'))restoreSearchPosition();});
document.addEventListener('input',e=>{if(e.target.matches('.map-search-input')){mapQuery=e.target.value;searchMap();}});
document.addEventListener('click',e=>{if(view==='play'&&run()?.stage==='packing'&&!e.target.closest('[data-pack-id]'))clearPackingInfo();const b=e.target.closest('[data-action]');if(!b||b.disabled)return;e.preventDefault();dispatch(b.dataset.action,b);});
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
setInterval(()=>{if(document.hidden)return;animFrame=(animFrame+1)%128;document.querySelectorAll('canvas[data-scene]').forEach(c=>scene(c,c.dataset.scene,c.dataset.recordOutfit?JSON.parse(c.dataset.recordOutfit):{...run()?.outfit,goggles:run()?.flags.goggles},animFrame,c.dataset.story));},240);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopSound();});
document.fonts.load('12px Pixel').then(()=>{document.documentElement.classList.add('font-ready');drawCanvases();}).catch(()=>document.documentElement.classList.add('font-ready'));
setTimeout(()=>document.documentElement.classList.add('font-ready'),2500);
readLocation();

window.addEventListener("resize",()=>{if(view==='route-map')render({sync:false});else {resizePhoneMap();paintSurface($("#surface"));document.querySelectorAll('canvas[data-ui]').forEach(c=>drawUI(c,c.dataset.ui));}});

// Directly move the atlas sheet. Only a real drag suppresses the map link.

document.addEventListener('pointerdown',e=>{const sheet=e.target.closest('.desk .map-view');if(!sheet||e.button!==0)return;atlasDrag={id:e.pointerId,x:e.clientX,start:atlasPan,sheet,moved:false};});
document.addEventListener('pointermove',e=>{if(!atlasDrag||e.pointerId!==atlasDrag.id)return;const a=atlasDrag,dx=e.clientX-a.x;if(Math.abs(dx)<5&&!a.moved)return;a.moved=true;a.sheet.classList.add('dragging');const width=a.sheet.offsetWidth,stage=a.sheet.parentElement.clientWidth,base=stage/2-width*atlasAnchorX;atlasPan=Math.max(stage-width-base,Math.min(-base,a.start+dx));a.sheet.style.setProperty('--pan-x',atlasPan+'px');});
function finishAtlasDrag(){if(!atlasDrag)return;if(atlasDrag.moved){suppressAtlasClick=true;setTimeout(()=>suppressAtlasClick=false,350);}atlasDrag.sheet.classList.remove('dragging');atlasDrag=null;}
document.addEventListener('pointerup',finishAtlasDrag);document.addEventListener('pointercancel',finishAtlasDrag);
document.addEventListener('click',e=>{if(suppressAtlasClick&&e.target.closest('.desk .map-view')){e.preventDefault();e.stopImmediatePropagation();suppressAtlasClick=false;}},true);
document.addEventListener('dragstart',e=>{if(e.target.closest('.desk .map-view'))e.preventDefault();});

// Wall-clock updates never rerender the phone or disturb the active conversation.
setInterval(()=>{document.querySelectorAll("[data-clock]").forEach(el=>{el.textContent=clockTime();});document.querySelectorAll("[data-clock-date]").forEach(el=>{el.textContent=new Intl.DateTimeFormat("zh-CN",{month:"long",day:"numeric",weekday:"long"}).format(new Date());});},1000);

document.addEventListener('contextmenu',e=>{if(e.target.closest('.phone-scene'))e.preventDefault();});
document.addEventListener('dragstart',e=>{if(e.target.closest('.phone-scene'))e.preventDefault();});
