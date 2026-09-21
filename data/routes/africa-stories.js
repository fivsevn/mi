import { ITEMS } from '../items.js?v=pocket-3';
const c=(label,result,extra={})=>({label,result,...extra});
const has=(r,id)=>r.bag.includes(id);
const n=(id,day,scene,title,text,choices,extra={})=>({id,day,scene,title,text,choices,eyebrow:'',...extra});
export const places=[
 {id:'safari',end:12,name:'肯尼亚 / 坦桑尼亚',coord:[35,-3]},
 {id:'seychelles',end:17,name:'塞舌尔 · 马埃岛',coord:[55,-5]},
 {id:'falls',end:20,name:'维多利亚瀑布',coord:[26,-18]},
 {id:'chobe',end:21,name:'博茨瓦纳 · 乔贝',coord:[25,-18]},
 {id:'namibia',end:30,name:'纳米比亚',coord:[17,-23]},
 {id:'cape',end:37,name:'南非 · 开普敦',coord:[18,-34]},
 {id:'mauritius',end:42,name:'毛里求斯',coord:[58,-20]}
];
export const placeFor=day=>places.find(p=>day<=p.end)||places.at(-1);
const eventPlaces={"hotel-safari": "肯尼亚 · 奈瓦沙湖营地", "hippo-night": "肯尼亚 · 奈瓦沙湖", "safari-morning": "肯尼亚 · 马赛马拉", "welcome": "肯尼亚 · 马赛马拉营地", "safari-leopard": "肯尼亚 · 马赛马拉", "radio": "肯尼亚 · 马赛马拉", "safari-moment": "肯尼亚 · 马赛马拉", "safari-evening": "坦桑尼亚 · 塞伦盖蒂营地", "socket": "坦桑尼亚 · 曼雅拉湖附近", "small-room": "坦桑尼亚 · 阿鲁沙", "mountain": "肯尼亚 · 安博塞利", "flight-island": "肯尼亚 · 内罗毕机场", "bus-wait": "塞舌尔 · 马埃岛路边", "kitchen": "塞舌尔 · 马埃岛住处", "sunday": "津巴布韦 · 维多利亚瀑布城", "sim-monday": "津巴布韦 · 维多利亚瀑布城", "atm": "津巴布韦 · 维多利亚瀑布城", "falls-walk": "津巴布韦 · 维多利亚瀑布", "wet-clothes": "津巴布韦 · 维多利亚瀑布", "border-one": "津巴布韦 · 边境路上", "border-stamp": "津巴布韦 · 边检口", "border-bridge": "津巴布韦 / 赞比亚 · 桥上", "border-two": "赞比亚 · 利文斯通", "chobe-river": "博茨瓦纳 · 乔贝河", "coach-late": "博茨瓦纳 · 卡萨内", "cold-coach": "开往温得和克的夜车", "quiet-day": "纳米比亚 · 温得和克", "five-hours": "纳米比亚 · 斯皮兹考普", "seal-trip": "纳米比亚 · 鲸湾", "sunrise": "纳米比亚 · 红沙漠路上", "sand-map": "纳米比亚 · 红沙漠", "tree-sunset": "纳米比亚 · 箭袋树林", "cape-glasses": "南非 · 开普敦街头", "goggles": "南非 · 开普敦", "cape-sea": "南非 · 开普敦 Camps Bay", "broken-plug": "南非 · 开普敦住处", "laundry-day": "南非 · 开普敦住处", "island-again": "毛里求斯 · 海边", "whale": "毛里求斯 · 海上", "delay-home": "毛里求斯 · 机场", "flight-home": "毛里求斯 · 机场"};
export function expandAfrica(route){
 const old=route.nodes;route.oldNodeIds=old.map(n=>n.id);route.revision=3;
 const extra=[
 n('hippo-night',1,'camp','院子里的客人。','工作人员问：见过长颈鹿了吗？\n晚上，另一位客人来吃草。',[c('隔着窗看','河马不需要房卡。'),c('拉好窗帘','草声在窗外继续。')]),
 n('welcome',3,'camp','观众已经到齐。','十几个人来唱歌。\n今晚的住客：两位。',[c('认真鼓掌','掌声不多。很用力。'),c('跟着站起来','不知道该站哪。大家挪出了一点地方。')],{hook:'welcome'}),
 n('radio',4,'savanna','草。草。斑马。','无线电突然响了。\n司机掉头。别的车也掉头。',[c('跟着车看',r=>r.flags.leopard?'树上有花豹。它没有看车。':'车都到了。树上的影子已经走了。'),c('放下行程单','纸上写着寻找。今天确实找了。')],{hook:'safari'}),
 n('socket',8,'room','插座在门口。','床在另一边。\n手机只剩一点电。',[c('把手机留在门口','它在充电。米在床上。')],{hook:'socket'}),
 n('small-room',9,'room','33 平方米。','米打开箱子。\n朋友的箱子暂时打不开。',[c('轮流开','米关。她开。配合得越来越好。'),c('看一眼订单','屏幕上还是 33。房间没有变大。')],{hook:'room'}),
 n('mountain',11,'savanna','山今天没来。','云占着整张背景。\n一大群象，从前景经过。',[c('看象','还有两只鬣狗幼崽。都没有在等山。'),c('再等一下','山露出一点。车已经要回去了。')]),
 n('bus-wait',15,'busstop','16:37','手机写着 BUS 16:42。\n路边画了一个白框。',[c('上车','有人来了。车也来了。')],{mini:'bus',memory:'bus',hook:'delay'}),
 n('kitchen',17,'room','店已经关门。','桌上有土豆。\n老板说，可以借厨房和插座。',[c('找老板借锅','锅是借的。饭是热的。'),c('先吃一点零食',r=>has(r,'snacks')?'吃完了。包装折好，箱子轻了一点。':'买来的面包也不错。',{remove:'snacks'})],{hook:'kitchen'}),
 n('sunday',18,'city','CLOSED','机场柜台。CLOSED。\n第一家店。CLOSED。\n第二家店。',[c('再看一眼','今天是星期日。'),c('明天再来','手机安静了一整晚。')]),
 n('sim-monday',19,'city','今天开门了。','付钱。排队。注册。\n回到刚才的柜台。',[c('把套餐打开','接近半小时。消息一下子挤进来。')],{hook:'signal'}),
 n('atm',19,'city','他说，2%。','小票上写着：2.5%。\n米回头看了一眼。经理还在。',[c('回去找他','他真的补了差额。',{effect:{flags:{refund:true}},add:'receipts'}),c('走','把小票折好。上面的数字没有变。',{add:'receipts'})]),
 n('falls-walk',19,'falls','先听见了。','轰——\n树后面还没有水。',[c('抖一抖',r=>has(r,'raincoat')?'雨衣外面湿了。鞋里面也是。':has(r,'bags')||has(r,'waterproof')?'手机在袋子里。米不在。':'湿了。')],{mini:'falls',memory:'wet',hook:'wet'}),
 n('wet-clothes',19,'falls','袜子也看过瀑布了。','翻一翻箱子。\n找个地方放湿衣服。',[c('先拧一拧','水落在地上。没有全部落出来。')],{hook:'wet'}),
 n('border-one',20,'road','到了。','出租车开了一点。\n司机说，到了。',[c('下车','酒店到了边境。还没到另一边。')]),
 n('border-stamp',20,'road','翻到下一页。','柜台前，米摸了摸口袋。',[c('把护照递过去','章盖好了。路还有一段。')],{hook:'border'}),
 n('border-bridge',20,'road','又一辆。','边境。路。桥。\n桥比走到桥的路短。',[c('再坐一段','开了一点。又到了。'),c('走过去','车扬起尘土。鞋收下了。')]),
 n('border-two',20,'road','还得再一辆。','另一边的边境。\n另一辆出租车。',[c('去城里','现在，真的到了。')],{hook:'signal'}),
 n('chobe-river',21,'river','它们过河了。','象群一个接一个下水。\n米把今天的清单收起来。',[c('看完再走','六小时里，还有一只很活跃的花豹。'),c('数一数','数到一半，前面的已经上岸。')],{hook:'safari'}),
 n('coach-late',22,'busstop','票上写 10:05。','九点到了。\n十点到了。\n车没到。',[c('问附近的人','“十一点。”他说得很熟练。'),c('继续坐着','十一点，车来了。')],{hook:'delay'}),
 n('cold-coach',22,'coach','豪华。','腿伸不开。Wi-Fi 连不上。\n外面十五度。里面继续制冷。\n旁边的人打开一床棉被。',[c('打开箱子',r=>has(r,'coat')?'厚羽绒服。终于穿对了地方。':'薄衣服叠了几层。天还没亮。',{effect:{flags:{cold:true}}}),c('把手缩进袖子','袖子不是棉被。今天希望它是。')],{memory:'blanket',hook:'cold'}),
 n('quiet-day',23,'city','今天没有标题。','走了很多路。买了一瓶水。\n回来的时候，天已经黑了。',[c('睡觉','水喝完了。')]),
 n('five-hours',25,'desert','五小时。','车窗。车窗。车窗。\n山到了。',[c('拍十分钟','拍完，上车。'),c('多看一会儿','回程的车还在原来的地方。')]),
 n('seal-trip',26,'island','船长说，看那边。','海狮。\n云很低。蓝天没有上船。',[c('看海狮','它看了一眼船，又躺下了。'),c('问有没有鲸','船继续往前开。')]),
 n('sunrise',28,'desert','日出团。','太阳升起来的时候，车出发了。\n路边停了一下。日出结束。',[c('继续坐车','向导说：这不是 Safari。然后停下来找狐狸。'),c('看窗外','松鼠。剑羚。跳羚。向导比大家先看见。')]),
 n('sand-map',29,'desert','他拿起登山杖。','在沙地上画了一张地图。\n然后讲树、果实、风。',[c('蹲下来听','日出没怎么看到。\n但是知道了沙漠为什么在这里。'),c('用手指补一条线','他说，我们现在就在这里。')],{hook:'wind'}),
 n('tree-sunset',30,'desert','树一直站着。','五点多到。拍到七点。\n太阳走了，树还在。',[c('收起相机','今晚还要赶车。')],{hook:'repair'}),
 n('cape-glasses',33,'cape','抓住眼镜。','一只手伸过来。',[c('……','眼镜被抢走了。',{remove:'glasses',effect:{flags:{lostGlasses:true}}})],{mini:'glasses',memory:'glasses'}),
 n('goggles',33,'cape','打开箱子。',r=>has(r,'goggles')?'里面还有一副泳镜。':'里面没有另一副眼镜。',[c('戴',r=>has(r,'goggles')?'至少看得见了。':'朋友递来备用的泳镜。至少看得见了。',{add:'goggles',effect:{flags:{goggles:true}}}),c('不戴','先慢慢走。')]),
 n('cape-sea',34,'cape','海在这里。','米坐下了。\n海没有问刚才发生了什么。',[c('坐一会儿','又坐了一会儿。'),c('拍一张','照片里只有海。不是今天的全部。')]),
 n('broken-plug',35,'room','插头不亮了。','试了第二个插座。\n还是没有。',[c('问前台借一个','借来的可以用。明早记得还。'),c('换一个','前台借来一个。坏掉的先收好。',{requires:'adapter',remove:'adapter',add:'broken-adapter'})]),
 n('laundry-day',36,'room','有一件洗不回来了。','衣领裂开了。\n其他几件还在晾。',[c('留下旧短袖','箱子少了一件。衣架空了一个。',{remove:'tee'}),c('把它折好','还可以穿着睡觉。')],{hook:'laundry'}),
 n('island-again',38,'island','脚先发现了。','又一片海。\n沙里有碎石。',[c('穿着凉鞋走',r=>has(r,'sandals')?'这次没有脱。':'慢慢挑着落脚的地方。'),c('坐下','坐着的时候，两片海都很好。')],{hook:'rain'}),
 n('whale',40,'river','海面很空。','船停着。\n大家看着同一片水。',[c('继续看','远处翻出一截背。然后又是水。'),c('放下手机','水响了一下。米抬头，刚好。')]),
 n('delay-home',42,'airport','登机时间改了。','改过一次。\n又改了一次。',[c('找个位置坐','坐出了一个下午。'),c('到处走走','又走回同一个登机口。')],{hook:'delay'})
 ];
 route.nodes=[...old.filter(x=>x.id!=='interlude'),...extra].sort((a,b)=>a.day-b.day || (a.id==='flight-home'?1:b.id==='flight-home'?-1:0));
 for(const node of route.nodes){const p=placeFor(node.day);node.place=eventPlaces[node.id]||node.place||p.name;node.location=p.id;node.time=node.time||({sunrise:'06:08','sand-map':'09:24','safari-morning':'08:16','sunday':'13:12','sim-monday':'09:30',atm:'10:05','falls-walk':'14:22','wet-clothes':'15:03','coach-late':'10:05',mountain:'16:12',whale:'09:18'}[node.id])||(node.scene==='airport'?'06:10':node.scene==='camp'?'20:16':node.scene==='coach'?'02:14':node.id==='bus-wait'?'16:37':'18:42');node.eyebrow='';node.choices.forEach(c=>{if(c.detail?.startsWith('+ '))delete c.detail;});
  if(node.hook&&!node.mini)for(const item of ITEMS.filter(i=>i.hooks.includes(node.hook)))node.choices.push(c('拿出'+item.name,item.use,{requires:item.id,use:item.id,remove:['snacks','noodles'].includes(item.id)?item.id:undefined}));
 }
 const kitchen=route.nodes.find(x=>x.id==='kitchen');kitchen.choices.find(x=>x.requires==='airfryer').condition=r=>has(r,'adapter');
 route.nodes.find(n=>n.id==='safari-leopard').day=3;route.nodes.find(n=>n.id==='safari-moment').day=4;route.nodes.sort((a,b)=>a.day-b.day||(a.id==='radio'?-1:b.id==='radio'?1:0));
 route.recordStops=places.map(p=>p.id);route.stops.forEach(s=>s.available=true);
}
