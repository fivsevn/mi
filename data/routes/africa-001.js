import { expandAfrica } from './africa-stories.js';
const choice=(id,label,result,effect={},extra={})=>({id,label,result,effect,...extra});
export const africa={
 id:'africa-001',number:'001',name:'AFRICA',label:'非洲环线',region:'africa',days:42,budget:42000,
 coordinates:'01° S — 34° S',coverText:'从草地到海边。\n出去的时候，箱子还很空。',recordStops:['safari','seychelles'],
 intro:'同一条路线，可以留下不同的东西。',
 stops:[
  {id:'safari',name:'肯尼亚 / 坦桑尼亚',en:'SAFARI',days:'01—12',theme:'看，也被看着',available:true,coord:[35,-3]},
  {id:'seychelles',name:'塞舌尔',en:'SEYCHELLES',days:'13—17',theme:'海没有标价',available:true,coord:[55,-5]},
  {id:'falls',name:'维多利亚瀑布',en:'VICTORIA FALLS',days:'18—21',theme:'身体进入风景',coord:[26,-18]},
  {id:'chobe',name:'博茨瓦纳 · 乔贝',en:'CHOBE',days:'22—24',theme:'它刚好出现',coord:[25,-18]},
  {id:'namibia',name:'纳米比亚',en:'NAMIBIA',days:'25—32',theme:'想象先到了这里',coord:[17,-23]},
  {id:'cape',name:'南非 · 开普敦',en:'CAPE TOWN',days:'33—37',theme:'日常不止一种',coord:[18,-34]},
  {id:'mauritius',name:'毛里求斯',en:'MAURITIUS',days:'38—42',theme:'又一片海',coord:[58,-20]}
 ],
 nodes:[
 {id:'flight-out',kind:'booking',scene:'airport',day:1,place:'出发机场',eyebrow:'DEPARTURE / FLIGHT',title:'两张票，都能到。',text:'凌晨的机场很亮。米还没有。\n护照已经拿在手里了。',choices:[
  choice('red-eye','转机夜航','米在登机口醒了三次。最后一次，确实该登机了。',{fatigue:2,spontaneous:1},{cost:4200,detail:'转机 8 小时 · 托运 20 kg',stamp:'BOARDING PASS'}),
  choice('daytime','日间航班','贵出来的那一部分，米决定先叫它睡眠。',{fatigue:-1,prepared:1,flags:{comfort:true}},{cost:6900,detail:'少一次转机 · 托运 20 kg',stamp:'BOARDING PASS'})]},
 {id:'hotel-safari',kind:'booking',scene:'room',day:1,place:'Safari 营地',eyebrow:'营地的灯亮了',title:'今晚睡在哪里？',text:r=>r.hidden.fatigue>0?'床还没看到，米已经想好了怎么躺。':'米还不困。先看看房间。',choices:[
  choice('camp','基础帐篷','夜里能听见许多声音。米没分清几个，就睡着了。',{fatigue:1,people:1},{cost:1200,detail:'公用洗浴 · 离集合点较远'}),
  choice('lodge','营地小屋','门关上，世界安静了一点。今天买到的安静很合适。',{fatigue:-2,flags:{comfort:true}},{cost:3600,detail:'独立洗浴 · 近集合点'})]},
 {id:'safari-morning',scene:'savanna',day:2,place:'肯尼亚 / 坦桑尼亚',eyebrow:'01 / SAFARI',title:'谁在看谁？',text:r=>`车停了。长颈鹿也停了。\n它看着这一车拿着手机的人。${r.outfit.hat?'米扶了一下帽子。':'米眯起了眼睛。'}`,choices:[
  choice('photo','先拍一张',r=>r.bag.includes('camera')?'相机举起来，长颈鹿正好转身。照片里，是一个很完整的后脑勺。':'手机举起来，长颈鹿正好转身。至少拍到了它的后脑勺。',{photograph:2,observe:1}),
  choice('look','先看一会儿','米把手放下来。长颈鹿嚼着东西。双方暂时都没话说。',{remember:2,observe:2,flags:{looked:true}}),
  choice('ask','问向导：它在看什么','向导说，也许是在看我们。米发现自己刚才没有考虑这个选项。',{people:2,participate:1})]},
 {id:'safari-leopard',scene:'savanna',day:4,place:'Safari · 下午',eyebrow:'SOMEWHERE / 16:20',title:'再往前开一点。',text:'向导放慢了车速。\n草很高。行程表上写着“寻找豹子”。\n豹子没有确认过这份行程表。',choices:[
  choice('wait','继续等',r=>r.flags.leopard?'它真的从草里走了出来。没有通知，也没有音乐。':`风吹动了草。只有草。${r.bag.includes('book')?'米把书翻开，还是同一页。':'米把手机放下了。'}`,{observe:2},{encounter:true}),
  choice('drive','沿着另一条路慢慢开',r=>r.flags.leopard?'在拐弯的地方，它正好走了出来。我们刚好在这里。':'拐弯后，有一群羚羊。米决定今天也可以记住羚羊。',{spontaneous:2,accept:1},{encounter:true})]},
 {id:'safari-moment',scene:'savanna',day:4,place:'Safari · 片刻',eyebrow:'A MOMENT',title:r=>r.flags.leopard?'只有几秒钟。':'太阳慢慢下去了。',text:r=>r.flags.leopard?'豹子在过路。\n它没有打算多留。':'没有豹子的这一天，也快过完了。\n车里的人开始讨论晚饭。',choices:[
  choice('record','拿起相机 / 手机',r=>r.flags.leopard?(r.bag.includes('lens')&&r.bag.includes('camera')?'长焦把它拉近了一点。照片很清楚，米反而想不起当时的风。':'照片里有一个很小的影子。米知道那是什么。'):'拍了一片草地。以后只有米知道，拍的是“没有”。',{photograph:2}),
  choice('remember','先看。回去再说。',r=>r.flags.leopard?'等米想起来拍照，它已经走了。没有照片，也是真的看到了。':'晚风碰到脸上。米没有拍。并没有什么需要补交。',{remember:2,flags:{missedPhoto:true}})],social:'safari'},
 {id:'safari-evening',scene:'camp',day:6,place:'营地 · 晚饭后',eyebrow:'THE SMALL THINGS',title:'天黑以后，还有蚊子。',text:r=>r.bag.includes('repellent')?'驱蚊液就在侧袋。米终于用上了一件“以防万一”。':`米拍了一下手臂。又拍了一下。${r.outfit.outer?'把外套袖口拉下来，好一点。':'前台有驱蚊液卖。'}`,choices:[
  choice('porch','坐在门口一会儿',r=>r.bag.includes('repellent')?'喷完驱蚊液，米继续听大家说今天看到了什么。有人已经来过三次。':'买了一小瓶驱蚊液。这件“以防万一”，是在这里买的。',{people:1},{cost:r=>r.bag.includes('repellent')?0:80,addIfMissing:'repellent'}),
  choice('sleep','今天先睡了',r=>r.hidden.fatigue>1?'鞋都没放整齐。明天再整齐。':'闹钟设好。现在谁也不用看谁了。',{fatigue:-1,accept:1})]},
 {id:'safari-shop',scene:'camp',day:12,place:'离开营地前',eyebrow:'SOMETHING TO TAKE HOME',title:'这个河马，看着挺轻。',text:'拿起来，是另一回事。\n店主没有催。米开始回忆箱子还有多少位置。',choices:[
  choice('hippo','带上木头小河马','河马不在今天见过的动物里，但现在在箱子里了。',{keep:2},{cost:260,add:'hippo',detail:'+ 1.8 kg'}),
  choice('card','一张明信片就好','米写好了地址。决定到下一站再找邮局。',{keep:1},{cost:25,add:'postcard',detail:'+ 0.1 kg'}),
  choice('leave','放回去','又摸了一下。放回原来的位置。',{discard:1,remember:1})]},
 {id:'flight-island',kind:'booking',scene:'airport',day:13,place:'飞往塞舌尔',eyebrow:'TRANSFER / FLIGHT',title:'下一段，换一种蓝。',text:'草地从窗外退了下去。\n到海边之前，先过一次秤。',choices:[
  choice('connection','便宜一点，多等一会儿','转机时买了一杯咖啡。票省下来的钱，先少了一点。',{fatigue:2,spontaneous:1},{cost:2400,detail:'长转机 · 20 kg · 超重费另计',limit:20}),
  choice('short','少转一班，早一点到','今天不想折腾。这个理由已经够长了。',{fatigue:-1,flags:{comfort:true}},{cost:3900,detail:'较短转机 · 23 kg · 超重费另计',limit:23})]},
 {id:'hotel-island',kind:'booking',scene:'island',day:13,place:'塞舌尔 · 马埃岛',eyebrow:'门钥匙有点咸',title:'海在照片的哪一边？',text:'两个住处都写着“靠近海边”。\n一个是窗外。一个要走一段坡。',choices:[
  choice('guesthouse','山坡上的小住处','老板说，没有电梯。米看了看箱子，箱子没有看米。',{fatigue:1,people:1},{cost:1600,detail:'厨房 · 步行上坡'}),
  choice('seaside','海边的房间','米坐在阳台上。今天的路，到这里就够了。',{fatigue:-2,flags:{comfort:true}},{cost:5200,detail:'早餐 · 下楼到海边'})]},
 {id:'beach',scene:'island',day:14,place:'塞舌尔 · 海边',eyebrow:'02 / SEYCHELLES',title:'“天堂”今天有点热。',text:r=>`宣传照里没有拍出这段上坡。\n${r.bag.includes('sunscreen')?'米拧开防晒霜，挤得有点多。':'到小店买防晒霜的时候，米记住了价格。'}\n海确实是那个颜色。`,onEnter:{flags:{sunscreenUsed:true}},choices:[
  choice('sit','先找个阴凉地方坐下','什么也没安排。坐满一小时，还是觉得没有白来。',{remember:2,accept:1},{cost:r=>r.bag.includes('sunscreen')?0:160,addIfMissing:'sunscreen'}),
  choice('swim','去水里试一下',r=>r.bag.includes('swimsuit')?'泳衣终于离开了压缩袋。海水没有滤镜，也有点咸。':'没带泳衣。米卷起裤腿站到水里，裤腿还是湿了。',{participate:2,remember:1},{cost:r=>r.bag.includes('sunscreen')?0:160,addIfMissing:'sunscreen'}),
  choice('angle','找宣传照里的那个角度','往左两步，垃圾桶出了画面。往右两步，价格牌出了画面。米懂了一点。',{photograph:2,compare:2,flags:{compareSea:true}},{cost:r=>r.bag.includes('sunscreen')?0:160,addIfMissing:'sunscreen'})],social:'beach'},
 {id:'lunch',scene:'island',day:15,place:'海边的小店',eyebrow:'LUNCH / NO BIG IDEAS',title:'吃完再想。',text:'菜单翻到最后一页，又翻回第一页。\n不管在哪片海边，中午都会饿。',choices:[
  choice('takeaway','打包，找地方坐着吃','盒子有点烫。风景很好。米主要在想，别把酱洒到裤子上。',{people:1},{cost:85}),
  choice('restaurant','坐下来，好好吃一顿','服务员添了水。米这次没有急着算汇率。',{accept:1,flags:{comfort:true}},{cost:380}),
  choice('market','去小市场看看','买了午饭，还带回一袋香料。用途暂时写“回去研究”。',{spontaneous:1,keep:1},{cost:150,add:'spice',detail:'+ 0.8 kg'})],social:'food'},
 {id:'island-wind',scene:'island',day:16,place:'塞舌尔 · 傍晚',eyebrow:'THE LONG WAY BACK',title:'风比预报里大。',text:r=>`${r.outfit.outer?'外套今天用上了。':'米把手缩进袖子里。'}回程车还有一小时。\n海面一直换颜色。`,choices:[
  choice('stay','坐到该走的时候','车来了。米站起来，觉得这一小时并不空。',{remember:1,accept:2}),
  choice('walk','沿着海岸慢慢走','没有走到尽头。鞋里进了沙。至少鞋来过。',{spontaneous:1,participate:1}),
  choice('compare','和手机里的照片比一下','今天的海，跟昨天也不完全一样。照片没有帮忙选出最好的一片。',{compare:2,flags:{compareSea:true}})]},
 {id:'last-shop',scene:'island',day:17,place:'离开塞舌尔前',eyebrow:'ONE LAST THING',title:'行李箱还有意见吗？',text:'米看到一块印花布。\n可以当桌布，或者别的什么。先拿在手里想一会儿。',choices:[
  choice('cloth','带回去再决定','以后每次看见它，大概都要先想起这张收据。',{keep:2},{cost:210,add:'cloth',detail:'+ 1.2 kg'}),
  choice('nothing','今天不买了','放回去。米的手空了出来。',{discard:1,accept:1})]},
 {id:'interlude',scene:'route',day:18,place:'窗边',eyebrow:'折起来的一角',title:'有些地方，下次再去。',text:'地图被海风吹得卷了边。\n我把还没走到的地方圈起来，没有写日期。\n手机亮了。有人问，什么时候回家。',choices:[choice('home','把地图折好','票根夹进了日记。剩下的空白，也一起带回去。',{},{add:'receipts'})]},
 {id:'flight-home',kind:'booking',scene:'airport',day:42,place:'回程机场',eyebrow:'RETURN / FLIGHT',title:'这一次，目的地叫家。',text:'护照还在。充电线也在。\n米把手机时区调了回去。',choices:[
  choice('home-transfer','再转一次机','已经知道在哪里接热水了。也算一种熟练。',{fatigue:1},{cost:3800,detail:'转机回家 · 托运 20 kg'}),
  choice('home-short','买一段短一点的回程','我决定再买六小时睡眠。回家以后，账单明天看。',{fatigue:-1,flags:{comfort:true}},{cost:6200,detail:'较短转机 · 托运 20 kg'})]}
 ]
};

expandAfrica(africa);
