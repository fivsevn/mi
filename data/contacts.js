export const SOCIAL_PROMPT='不知道为什么，突然想发给TA。';
export const CONTACTS=[
 {id:'he',name:'阿禾',detail:'先问吃了什么',color:'#dba675',mark:'禾',thought:'看到一个地方，先看看它的菜单。'},
 {id:'lan',name:'小岚',detail:'喜欢没有人的风景',color:'#93b9b1',mark:'岚',thought:'这个颜色，小岚大概会喜欢。'},
 {id:'you',name:'阿游',detail:'动物比人话少',color:'#b7bd81',mark:'游',thought:'阿游说，动物也在看我们。'},
 {id:'qi',name:'七七',detail:'负责问多少钱',color:'#c3aac6',mark:'七',thought:'还没感叹，就先把汇率算好了。'},
 {id:'wu',name:'老吴',detail:'奇怪的东西请发来',color:'#9ba8c4',mark:'吴',thought:'正常的东西也开始看起来有点奇怪。'},
 {id:'blank',name:'……',detail:'上次聊天是上次',color:'#c6be9d',mark:'·',thought:'有些话还没说，就已经想好了收件人。'}
];
const replies={
 safari:{he:['车开了一上午。','所以你吃饭了吗','……还没有。'],lan:['[车窗外的草地]','风大吗','照片没告诉你，但我的头发告诉我了。'],you:['还在找豹子。','它知道你来了吗','应该没收到行程表。'],qi:['今天在车上坐了一天。','按小时算是不是便宜一点','你这个算法让我好多了。'],wu:['[一块写着请勿下车的牌子]','那动物可以上车吗','你不要问。'],blank:['这里很大。','嗯','只是想跟你说一下。']},
 leopard:{he:['看见豹子了。没拍到。','那午饭拍了吗','拍了。'],lan:['看见了。照片没有。','那就记着','嗯。'],you:['看见豹子了。','图呢','没有。','？'],qi:['看到了，没拍到。','包含在票价里吗','包含在今天里。'],wu:['豹子走了。','它也有事要忙','可能是。'],blank:['刚才想起你。','发生什么了','一只豹子走过去。']},
 beach:{he:['[海的照片]','你吃什么了','……你等一下。'],lan:['这个海真的很夸张。','我靠','照片看不出来。'],you:['[海的照片]','里面有什么动物','暂时只有我。'],qi:['这个海真的很夸张。','贵吗','车费也很夸张。','第二句比较夸张。'],wu:['沙子进鞋里了。','它要跟你回家','不买票就上来了。'],blank:['[海的照片]','你那边几点','忘了。']},
 food:{he:['这边这个还挺好吃。','贵吗','别问。'],lan:['[午饭的照片]','后面的海不错','你看重点。'],you:['[午饭的照片]','豹子吃了吗','我们不在一个旅行团。'],qi:['今天买了顿很好的午饭。','几位数','先吃饭。'],wu:['我点的跟想的不一样。','那就多认识了一道菜','你很会安慰人。'],blank:['今天好好吃饭了。','嗯','你也是。']}
};
export function conversation(event,contact,run){
 const key=event==='safari'&&run.flags.leopard&&run.flags.missedPhoto?'leopard':event;
 const lines=(replies[key]||replies.beach)[contact]||replies.beach.blank;
 return lines.map((text,i)=>({from:i%2?'friend':'mi',text}));
}
