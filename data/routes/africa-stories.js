import { ITEMS } from '../items.js';
const c=(label,result,extra={})=>({label,result,...extra});
const has=(r,id)=>r.bag.includes(id);
const n=(id,day,scene,title,text,choices,extra={})=>({id,day,scene,title,text,choices,eyebrow:'',...extra});
export const places=[
 {id:'safari',end:12,en:'SAFARI',name:'肯尼亚 / 坦桑尼亚',country:'肯尼亚、坦桑尼亚',memory:'车停下来，草还在动。',route:'内罗毕、奈瓦沙湖、马赛马拉；越境到塞伦盖蒂、恩戈罗恩戈罗、曼雅拉湖、塔兰吉雷，再经阿鲁沙回肯尼亚安博塞利。',archive:['第一天六点接机，十点到湖边。下午坐了一小时船。酒店院子里有长颈鹿、斑马，晚上河马来吃草。','第二天七点出发，下午两点到马赛马拉。行程表的一整天 Safari，真正开进草原是两个半小时。第三天却看见花豹、猎豹、狮子、秃鹫和角马过河。','第四天跨境换车。原来的司机空车回去，另一位司机空开九小时来接。预计中午到，最终傍晚才到塞伦盖蒂。接下来的两天几乎没有新收获。','第七天去火山口，路上突然遇见小狮子和很近的猎豹；之后看到犀牛。第八、九天经过曼雅拉湖和塔兰吉雷。第十天先在阿鲁沙瀑布徒步，再返回肯尼亚。','安博塞利的山躲在云里，象群和鬣狗幼崽没有。第十二天从 Emali 乘火车回内罗毕。向导、无线电、天气和偶然性，都没写在动物清单上。']},
 {id:'seychelles',end:17,en:'SEYCHELLES',name:'塞舌尔 · 马埃岛',country:'塞舌尔',memory:'等车的地方，海很好看。',route:'内罗毕休整后飞到塞舌尔，在马埃岛坐公交、步行、看海。',archive:['关于公交的研究成果：App 不可信。时刻表也不一定可信。站台出现一个当地人，可信度显著提高。暂无理论解释。','手机里装了 SPTC。Journey Planner 选出发地和目的地，再和 Bus Timetable 对照。两处都写着同一班，仍不保证它会来。','那次坐车记下的是每人八卢比。充值时用了八的倍数。越远离始发站，时间越难猜；有的车早到，有的晚到，有的没来。','公交亭、地上白框、稍宽的路边，都可能是站。问路的人比屏幕上的转圈有帮助。','没有国外自驾经验，于是选了公交。节省的钱和花掉的时间没有互相抵消。细沙不磨脚，海还是那片海。']},
 {id:'falls',end:20,en:'VICTORIA FALLS',name:'维多利亚瀑布 / 两边的边境',country:'津巴布韦、赞比亚',memory:'还没看见水，就已经听见了。',route:'塞舌尔之后抵达瀑布城，再经津巴布韦边境、桥、赞比亚边境到另一侧。',archive:['周日到了。机场电话卡柜台和镇上的店都关门。周一办卡：卡一美元、五 GB 九美元；柜台付钱、小窗注册、回柜台开套餐，排了接近半小时。','经理说 ATM 手续费 2%。机器收了 2.5%。之前问过他多出来的能不能补，他真的补了。那次几家机器低于五美元也按五美元收；FBC 会先显示手续费。','酒店到边境约一公里，第一次被要了七美元。三个路段的出租车不能直接贯通。桥很短，尘土里的路很长。','N1 的早餐很好吃，房间勉强打开两个登机箱。瀑布这边和赞比亚那边都看了，后者景区里还能连上津巴布韦的信号。','远处先听见轰鸣，走近像被大雨淋湿。照片存下了风景，没有存下袜子里的水。']},
 {id:'chobe',end:21,en:'CHOBE',name:'乔贝 / 卡萨内',country:'博茨瓦纳',memory:'这次没有列清单。',route:'离开瀑布区域到乔贝，之后从卡萨内坐大巴去温得和克。',archive:['六小时的 Safari，看见活跃的花豹和大象群体过河。和同路的人聊，大家都带着各自的惊喜。','卡萨内是 Intercape 中间站。票写 10:05，提醒 9:05 等；实际十一点才来。附近工作人员似乎早就知道。','在 Tlou Safari Mall 附近候车。上车只剩两个单人座，有人一人占两座。到 Katima 换大车，腿并没有多出地方。']},
 {id:'namibia',end:30,en:'NAMIBIA',name:'纳米比亚 · 路上',country:'纳米比亚',memory:'日出团的日出，在出发时结束。',route:'卡萨内到温得和克；斯瓦科普蒙德、鲸湾、斯皮兹考普、红沙漠、箭袋树，最后在 Keetmanshoop 上开往开普敦的车。',archive:['大巴外面约十五度，里面还在制冷。Wi-Fi 连不上，到城市才勉强有信号。当地乘客带了棉被。','温得和克走了一圈教堂附近，吃了猪肘，住处的热水很好调。斯瓦八月是冬天，阴天比照片诚实。出海主要见海狮。','去斯皮兹考普包车，两个人花了约两千元，五小时路程换十分钟拍照。山很值得看，车程也很难忘。','Go2 的小巴准时、座椅舒服，石子路也不太颠，有信号处有 Wi-Fi，还给一瓶水。那次记录单程 790 纳币；温得和克八点出发，中午到斯瓦，之后到鲸湾。','斯瓦七点出发，经鲸湾，中午到红沙漠。日出团只是日出时出发，日落团停在无名山头。向导却认真找狐狸、松鼠、剑羚和跳羚，还讲树木果实。','他用登山杖在沙地画纳米比亚地图，解释沙漠。那天团到一点半才回门口，而另一班回温得和克的车一点就走。','Camp 和 Lodge 相隔约六公里，那次接送往返每人 75 纳币。Camp 有空调，Wi-Fi 很差。去箭袋树的路上在 Mariental 换车。Garas 从傍晚拍到天黑，再赶夜车。']},
 {id:'cape',end:37,en:'CAPE TOWN',name:'南非 · 开普敦',country:'南非',memory:'眼镜消失的地方。海也在这里。',route:'从纳米比亚陆路入境南非，到开普敦；之后飞往毛里求斯。',archive:['刚到开普敦遇到抢钱抢东西。朋友的眼镜被抢走，箱子里还有泳镜。','后来去了 Camps Bay。海很好看。前一句和这一句都没有删掉。','那次旅行办理了南非 ETA，也顺利从纳米比亚陆路入境。这是一张旧行程留下的记录。','回家后仍然想再来。泳镜留在箱子里，没有重新写用途。']},
 {id:'mauritius',end:42,en:'MAURITIUS',name:'毛里求斯 · 海边',country:'毛里求斯',memory:'又一片海。脚先认出了区别。',route:'从开普敦飞到毛里求斯，住下来五天，最后回家。',archive:['五天里大部分时间在酒店，出海追鲸，也试了海上项目。等鲸的时候，海面一直很空。','这里有碎石，沙比塞舌尔磨脚。并不妨碍坐下来很久。','出门前写下：肯坦十二天，加一日休整；塞舌尔四天；两侧瀑布三天；乔贝一天；纳米比亚九天；南非四天；毛里求斯五天。转场和停留有重叠，最后总共四十二天。','回家的时候，票根比护照更皱。计划里还留着马达加斯加、三角洲和再来一次开普敦。没写日期。']}
];
export const placeFor=day=>places.find(p=>day<=p.end)||places.at(-1);
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
 for(const node of route.nodes){const p=placeFor(node.day);node.place=node.place||p.name;node.location=p.id;node.time=node.time||({sunrise:'06:08','sand-map':'09:24','safari-morning':'08:16','sunday':'13:12','sim-monday':'09:30',atm:'10:05','falls-walk':'14:22','wet-clothes':'15:03','coach-late':'10:05',mountain:'16:12',whale:'09:18'}[node.id])||(node.scene==='airport'?'06:10':node.scene==='camp'?'20:16':node.scene==='coach'?'02:14':node.id==='bus-wait'?'16:37':'18:42');node.eyebrow='';node.choices.forEach(c=>{if(c.detail?.startsWith('+ '))delete c.detail;});
  if(node.hook&&!node.mini)for(const item of ITEMS.filter(i=>i.hooks.includes(node.hook)))node.choices.push(c('拿出'+item.name,item.use,{requires:item.id,use:item.id,remove:['snacks','noodles'].includes(item.id)?item.id:undefined}));
 }
 const kitchen=route.nodes.find(x=>x.id==='kitchen');kitchen.choices.find(x=>x.requires==='airfryer').condition=r=>has(r,'adapter');
 route.nodes.find(n=>n.id==='safari-leopard').day=3;route.nodes.find(n=>n.id==='safari-moment').day=4;route.nodes.sort((a,b)=>a.day-b.day||(a.id==='radio'?-1:b.id==='radio'?1:0));
 route.recordStops=places.map(p=>p.id);route.stops.forEach(s=>s.available=true);
}
