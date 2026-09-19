export const ITEMS = [
  {id:'tee',name:'白色短袖',weight:0.3,group:'衣服',slot:'top',color:'#e7ead6',note:'洗完，第二天还穿。'},
  {id:'stripe',name:'条纹上衣',weight:0.4,group:'衣服',slot:'top',color:'#df805c',note:'在照片里很好认。'},
  {id:'linen',name:'蓝色衬衫',weight:0.5,group:'衣服',slot:'top',color:'#7eb7bd',note:'皱了也算一种穿法。'},
  {id:'jacket',name:'薄外套',weight:0.7,group:'衣服',slot:'outer',color:'#748562',note:'机场空调另有气候。'},
  {id:'coat',name:'厚外套',weight:1.6,group:'衣服',slot:'outer',color:'#cf9053',note:'出门前觉得一定用得到。'},
  {id:'hat',name:'遮阳帽',weight:0.2,group:'衣服',slot:'hat',color:'#cfb878',note:'风可能也想戴。'},
  {id:'boots',name:'徒步鞋',weight:1.3,group:'衣服',slot:'shoes',color:'#785d45',note:'很认真地准备走路。'},
  {id:'sandals',name:'凉鞋',weight:0.4,group:'衣服',slot:'shoes',color:'#d7b175',note:'沙子不用倒，自己会出来。'},
  {id:'raincoat',name:'雨衣',weight:0.4,group:'日用',note:'天气不看行李清单。'},
  {id:'sunscreen',name:'防晒霜',weight:0.3,group:'日用',note:'记得涂，比记得带难。'},
  {id:'repellent',name:'驱蚊液',weight:0.2,group:'日用',note:'小小一瓶安全感。'},
  {id:'swimsuit',name:'泳衣',weight:0.2,group:'日用',note:'先带上，游不游再说。'},
  {id:'wash',name:'洗漱包',weight:1.1,group:'日用',note:'每天都用，但拍照时不出现。'},
  {id:'laundry',name:'换洗衣物',weight:3.4,group:'日用',note:'42天当然不是42套。'},
  {id:'camera',name:'相机',weight:0.9,group:'随身物',note:'手机也能拍。这台比较重。'},
  {id:'lens',name:'长焦镜头',weight:1.8,group:'随身物',note:'把远处拉近一点。'},
  {id:'guide',name:'纸质指南',weight:0.7,group:'随身物',note:'没有电的时候也在。'},
  {id:'powerbank',name:'充电宝',weight:0.4,group:'随身物',carryOnly:true,note:'放随身包，计入随身重量。'},
  {id:'book',name:'还没看完的书',weight:0.6,group:'随身物',note:'可能换个大陆就看完了。'},
  {id:'toy',name:'小玩偶',weight:0.2,group:'随身物',note:'它不用买机票。'},
  {id:'tripod',name:'三脚架',weight:1.8,group:'随身物',note:'也许会拍星星。'},
  {id:'towel',name:'大浴巾',weight:1.2,group:'日用',note:'干的时候已经这么重。'},
  {id:'spare',name:'备用的备用衣服',weight:2.4,group:'衣服',note:'万一呢。'},
  {id:'hippo',name:'木头小河马',weight:1.8,group:'带回来的',souvenir:true,note:'看着比拿着轻。'},
  {id:'spice',name:'一袋香料',weight:0.8,group:'带回来的',souvenir:true,note:'回家以后再研究做什么。'},
  {id:'cloth',name:'印花布',weight:1.2,group:'带回来的',souvenir:true,note:'还没有决定它是什么。'},
  {id:'postcard',name:'没寄的明信片',weight:0.1,group:'带回来的',souvenir:true,note:'地址写了，邮局没找到。'},
  {id:'receipts',name:'折起来的小票',weight:0.1,group:'带回来的',souvenir:true,note:'有些字已经看不清了。'}
];
export const itemById = Object.fromEntries(ITEMS.map(i=>[i.id,i]));
export const DEFAULT_BAG=['tee','stripe','jacket','hat','boots','sandals','raincoat','sunscreen','repellent','swimsuit','wash','laundry','camera','powerbank','book','toy'];
export const BAG_LIMIT=20, CASE_WEIGHT=1.4, HAND_LIMIT=7;
