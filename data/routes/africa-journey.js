// New scenes are fiction rooted in the places listed in docs/africa-story-sources.md.
const scene=(id,day,background,place,title,text,a,b)=>({id,day,scene:background,place,title,text,choices:[{label:a[0],result:a[1],effect:{remember:1}},{label:b[0],result:b[1],effect:{people:1}}]});
export const journeyStories=[
 scene('crater-lake',7,'savanna','坦桑尼亚 · 恩戈罗恩戈罗','原来是一圈。','米指着远处的山。\nJoshua 说，那是火山口的边。',['把视线绕一圈','那一小段山，接上了另一小段。湖安静地留在中间。'],['问刚才的黑点','是犀牛。这一趟只见到了这一次。']),
 scene('arusha-waterfall',10,'falls','坦桑尼亚 · 阿鲁沙附近','今天的绿很近。','草原留在昨天。\n鞋底踩上湿土，树叶遮住了天。',['跟着向导走','两小时的路。瀑布旁边，米终于把口罩收了起来。'],['停下来听水','朋友先走出几步，又回头等。米说，来了。']),
 scene('train-nairobi',12,'coach','肯尼亚 · 返回内罗毕的列车','不用一直抓着座椅了。','Frank 送到车站，挥了挥手。\n米坐下，膝盖终于能往前伸。',['看窗外','草原退成了一条线。向导已经往回开了。'],['跟朋友对照片','同一只象。两个人各拍了二十张。谁也没舍得删。']),
 scene('mahe-stop-name',14,'busstop','塞舌尔 · 马埃岛','不是这一个白框。','米把手机递给路边的人。\n他看了站名，指向坡下。',['走到坡下','另一个白框。刚才那个人路过，又点了一下头。'],['记住商店招牌','回来的时候，先看到了招牌。手机还在转圈。']),
 scene('mahe-tide',16,'island','塞舌尔 · 马埃岛海边','毛巾的位置。','刚才还在干沙上。\n米看公交时间，朋友看海。',['往后挪一点','水刚好走到刚才的位置。朋友说，还好。'],['收起来去找阴凉','毛巾抖出了半个沙滩。箱子没必要带这么多沙回去。']),
 scene('falls-leaves',19,'falls','津巴布韦 · 瀑布雨林步道','这里的叶子也湿了。','离开最响的那一段。\n树荫里还飘着细细的水。',['把手机收起来','叶尖滴下水。米走到晴天里，袖口还是湿的。'],['找一块干地方擦眼镜','擦完，又落了两滴。米笑了一下，先不擦了。']),
 scene('chobe-morning',21,'road','博茨瓦纳 · 乔贝集合点','今天只有六小时。','刚才还在对护照。\n现在向导问，谁先坐靠边？',['跟朋友换一边','上午她坐外面。下午轮到米。还没看见动物，座位先安排好了。'],['把清单折起来','纸折成小小一块。今天先看看会遇到什么。']),
 scene('chobe-tracks',21,'savanna','博茨瓦纳 · 乔贝河岸','车停在一道印子旁。','向导指着沙上的脚印。\n米看了很久，还没看出方向。',['请他再指一次','脚趾在这一边。米看懂了一小段路，动物已经走远了。'],['看看自己的鞋印','鞋底花纹整整齐齐。向导笑着说，这个比较容易认。']),
 scene('chobe-leopard',21,'savanna','博茨瓦纳 · 乔贝','这次它很忙。','花豹沿着枝条换了个位置。\n米和朋友同时停下了话。',['等它站稳','尾巴还垂在外面。六小时的旅行，忽然有了一段很长的安静。'],['让朋友先看','她挪开一点，米也看到了。今天不用抢同一个角度。']),
 scene('chobe-shore',21,'river','博茨瓦纳 · 乔贝河','从水上看过去。','岸上的车变得很小。\n向导把船慢下来。',['把手放回船里','象在岸边喝水。水面把鼻子和倒影连在一起。'],['指给朋友看倒影','她以为米指的是后面那只。两个人又各发现了一只。']),
 scene('chobe-wake',21,'river','博茨瓦纳 · 乔贝河','一条线很快消失了。','船经过，水面开了一道纹。\n米刚举起手机。',['放下手机看','纹路慢慢散开。岸边的草还是刚才的草。'],['拍下来','照片里看不出船刚刚经过。朋友说，我记得。']),
 scene('chobe-table',21,'camp','博茨瓦纳 · 卡萨内','别人的六小时。','吃饭时，有人说今天看到了花豹。\n米立刻抬起头。',['问是在树上吗','原来不是同一棵树。大家用筷子和手比了半张地图。'],['讲象过河','有人还没看到。米把拍糊的照片也翻出来给他们看。']),
 scene('chobe-evening',21,'room','博茨瓦纳 · 卡萨内住处','这一页很满。','明天要坐长途车。\n米把今天的照片留在屏幕上。',['先把外套放在最上面','拉链合好。今天只待了一天，还是想以后再来。'],['给朋友看最后一张','象已经上岸。照片里，只剩了一圈水。']),
 scene('swakop-fog',24,'island','纳米比亚 · 斯瓦科普蒙德','海先变成了声音。','走到岸边，雾还没有散。\n地图上的蓝色比眼前清楚。',['找家店坐坐','杯子是热的。窗外有人把外套领子拉起来，继续走。'],['沿海走一小段','风把头发吹乱。米没等到蓝天，等到了肚子饿。']),
 scene('dune-shoes',27,'desert','纳米比亚 · 红沙漠','鞋里还有一点。','倒过一次。又倒一次。\n朋友说，别把沙漠都装走。',['再敲一下鞋跟','又落下一小堆。刚才爬过的坡，在鞋里留了个副本。'],['把鞋放在门外','晚饭回来，鞋还在。明早再倒一次。']),
 scene('cape-wind',34,'cape','南非 · Camps Bay','菜单需要两只手。','风掀起纸角。\n服务员把杯子往里挪了一点。',['按住菜单','朋友替米看海。点完以后，换米看。'],['坐到靠里的位置','风小了一点。桌上还是能看见那片海。']),
 scene('boulders-boardwalk',35,'island','南非 · 西蒙镇巨石滩','它们有自己的路。','木栈道下面，一只企鹅往前走。\n米刚想跟上，又停住。',['留在栈道上看','它钻到石头后面。另一只从另一边出来，完全不看观众。'],['给朋友让出位置','她蹲下来。米从她肩膀上面，也看到了摇摇晃晃的背影。']),
 scene('cape-borrow-return',36,'room','南非 · 开普敦住处','柜台上留了一张纸。','借来的插头就在旁边。\n米写：谢谢。',['现在拿下去','前台收好插头。米的侧袋空了一小格。'],['请朋友帮忙提醒','出门前她拍了拍米的包。还好，没带去下一座岛。']),
 scene('cape-postcard',37,'cape','南非 · 开普敦','写不下整座城。','一面海。一小块空白。\n米把笔尖停在纸上。',['写今天的海','字挤在右下角。难受的那一段，留着见面再说。'],['先写地址','地址倒是一直记得。朋友借过笔，把自己的也写了。']),
 scene('cape-last-walk',37,'cape','南非 · 开普敦海边','还是想再来。','箱子拉好了。\n米又走到海边看了一次。',['坐五分钟','朋友看了看时间，坐在旁边。五分钟后来，还够赶飞机。'],['拍下回去的路','照片里多了一条人行道。下次来，也许先认出这里。']),
 scene('mauritius-breakfast',38,'room','毛里求斯 · 酒店','今天不设闹钟。','窗帘边亮了。\n米摸到手机，翻了个面。',['再躺一会儿','朋友也没起来。早餐还来得及，今天不用抢第一辆车。'],['下楼吃早餐','盘子端得有点满。坐下来以后，今天的计划还是空的。']),
 scene('mauritius-dholl',39,'city','毛里求斯 · 街边小摊','纸包先热到了手。','摊主把豆饼折起来。\n问米，要不要辣酱。',['先放一点','第一口还在认真辨味。第二口，酱碰到了手指。'],['跟朋友换着尝','两包的辣度不一样。她把比较温和的那半包递给米。']),
 scene('mauritius-lagoon',39,'island','毛里求斯 · 海边','今天先学着划。','救生衣扣好了。\n工作人员让米先在浅水边试。',['跟朋友对齐节奏','一二，一二。船还是有点歪，但终于不是原地转了。'],['先练一边','手臂先觉得累。米把船慢慢划回岸边，今天学会了一点。']),
 scene('mauritius-whale-before',40,'river','毛里求斯 · 出海的船上','没有出现时间表。','船长说，能不能看到，要等。\n米把帽绳系紧。',['坐好等','船边有水花。米把屏幕关了，抬头看海。'],['跟朋友说先别找相机','她把相机放在膝上。两个人终于朝同一个方向看。']),
 scene('mauritius-salt',41,'room','毛里求斯 · 酒店阳台','泳镜上留了白边。','淡水冲过以后。\n米把它放在毛巾上晾。',['一起整理湿衣服','有些干了，有些还没干。回程的箱子从这一堆开始。'],['看看镜片','里面还看得见。开普敦那一天，也跟着留在里面。']),
 scene('mauritius-last-morning',42,'island','毛里求斯 · 离岛前','最后一顿不用赶。','早餐放在桌上。\n箱子等在门口。',['把这杯喝完','四十二天。今天还没结束，先把早餐吃完。'],['问朋友最想再去哪','她还没选好。米说，乔贝可以多待一点，开普敦也想再去。'])
];
export const segments=[
 {id:'safari',title:'草原上的车窗',scene:'camp',closing:'口罩收起来了。车窗外的草原还在。\n米明天要去另一种蓝里。'},
 {id:'seychelles',title:'等车去海边',scene:'island',closing:'锅还给老板。毛巾晾过一次。\n下一站，先听见水。'},
 {id:'falls',title:'走进水声里',scene:'falls',closing:'护照多了两个章，鞋里还湿着。\n先坐下来，再往乔贝走。'},
 {id:'chobe',title:'河岸的六小时',scene:'river',closing:'象已经上岸。今天这一页很满。\n明天的长途车，还没有来。'},
 {id:'namibia',title:'雾、沙和夜车',scene:'desert',closing:'沙地上的地图早就被风吹走了。\n米记得向导指过的地方。'},
 {id:'cape',title:'在开普敦坐一会儿',scene:'cape',closing:'借来的插头还了。箱子重新拉好。\n那片海，还是想再来看。'},
 {id:'mauritius',title:'又一片海，慢慢回家',scene:'island',closing:'最后一杯喝完了。\n现在，看看什么跟米一起回家。'}
];
export function arrangeJourney(route,placeFor){
 route.previousNodeIds=route.nodes.map(n=>n.id);
 route.nodes.push(...journeyStories);
 route.nodes.sort((a,b)=>a.day-b.day||(a.id==='flight-home'?1:b.id==='flight-home'?-1:0));
 // Keep causal chains together within each day.
 for(const ids of [['safari-leopard','radio','safari-moment'],['chobe-morning','chobe-tracks','chobe-leopard','chobe-shore','chobe-river','chobe-wake','chobe-table','chobe-evening'],['mauritius-whale-before','whale'],['mauritius-last-morning','delay-home','flight-home']]){
  const selected=ids.map(id=>route.nodes.find(n=>n.id===id));const at=Math.min(...selected.map(n=>route.nodes.indexOf(n)));
  route.nodes=route.nodes.filter(n=>!ids.includes(n.id));route.nodes.splice(at,0,...selected);
 }
 route.segments=segments.map(s=>({...s,nodeIds:route.nodes.filter(n=>placeFor(n.day).id===s.id).map(n=>n.id)}));
 for(const n of route.nodes){n.location=placeFor(n.day).id;n.place??=placeFor(n.day).name;n.time??='12:24';n.eyebrow='';}
 for(const stop of route.stops){const p=placeFor(route.nodes.find(n=>n.location===stop.id).day);stop.days=({safari:'01—12',seychelles:'13—17',falls:'18—20',chobe:'21',namibia:'22—32',cape:'33—37',mauritius:'38—42'})[p.id];}
 route.revision=4;
}
