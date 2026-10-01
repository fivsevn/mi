// Approximate place centres for contextual maps; not live GPS or navigation.
export const locations={
 shanghai:{coord:[121.805,31.143],span:1.823,label:'上海 · 浦东国际机场'},
 nairobi:{coord:[36.82,-1.29],span:4.05,label:'肯尼亚 · 内罗毕'},
 naivasha:{coord:[36.34,-.77],span:2.43,label:'肯尼亚 · 奈瓦沙湖'},
 mara:{coord:[35.1,-1.45],span:3.375,label:'肯尼亚 · 马赛马拉'},
 serengeti:{coord:[34.8,-2.33],span:4.05,label:'坦桑尼亚 · 塞伦盖蒂'},
 ngorongoro:{coord:[35.58,-3.18],span:1.62,label:'坦桑尼亚 · 恩戈罗恩戈罗'},
 manyara:{coord:[35.82,-3.63],span:1.62,label:'坦桑尼亚 · 曼雅拉湖附近'},
 arusha:{coord:[36.68,-3.37],span:2.43,label:'坦桑尼亚 · 阿鲁沙'},
 amboseli:{coord:[37.26,-2.65],span:2.7,label:'肯尼亚 · 安博塞利'},
 mahe:{coord:[55.46,-4.67],span:0.743,label:'塞舌尔 · 马埃岛'},
 falls:{coord:[25.86,-17.925],span:1.62,label:'津巴布韦 · 维多利亚瀑布'},
 livingstone:{coord:[25.86,-17.85],span:1.62,label:'赞比亚 · 利文斯通'},
 chobe:{coord:[25.15,-17.82],span:2.295,label:'博茨瓦纳 · 乔贝河岸'},
 kasane:{coord:[25.15,-17.8],span:2.295,label:'博茨瓦纳 · 卡萨内'},
 windhoek:{coord:[17.08,-22.57],span:5.4,label:'纳米比亚 · 温得和克'},
 swakop:{coord:[14.53,-22.68],span:3.645,label:'纳米比亚 · 斯瓦科普蒙德'},
 spitzkoppe:{coord:[15.2,-21.83],span:4.05,label:'纳米比亚 · 斯皮兹考普'},
 walvis:{coord:[14.5,-22.96],span:3.645,label:'纳米比亚 · 鲸湾'},
 sossusvlei:{coord:[15.3,-24.73],span:4.725,label:'纳米比亚 · 红沙漠'},
 quiver:{coord:[18.23,-26.43],span:5.4,label:'纳米比亚 · 箭袋树林'},
 cape:{coord:[18.42,-33.93],span:2.295,label:'南非 · 开普敦'},
 campsbay:{coord:[18.38,-33.95],span:2.295,label:'南非 · 开普敦 Camps Bay'},
 boulders:{coord:[18.45,-34.2],span:1.89,label:'南非 · 西蒙镇巨石滩'},
 mauritius:{coord:[57.55,-20.2],span:1.89,label:'毛里求斯'},
 mauritiusAirport:{coord:[57.68,-20.43],span:1.89,label:'毛里求斯 · 机场'}
};
const ids={
 'flight-out':'shanghai','hotel-safari':'naivasha','hippo-night':'naivasha','safari-morning':'mara',welcome:'mara','safari-leopard':'mara',radio:'mara','safari-moment':'mara','safari-evening':'serengeti',socket:'manyara','crater-lake':'ngorongoro','small-room':'arusha','arusha-waterfall':'arusha',mountain:'amboseli','safari-shop':'nairobi','train-nairobi':'nairobi','flight-island':'nairobi',
 'border-two':'livingstone','coach-late':'kasane','cold-coach':'windhoek','quiet-day':'windhoek','five-hours':'spitzkoppe','seal-trip':'walvis','swakop-fog':'swakop',sunrise:'sossusvlei','sand-map':'sossusvlei','dune-shoes':'sossusvlei','tree-sunset':'quiver',
 'cape-sea':'campsbay','cape-wind':'campsbay','cape-last-walk':'campsbay','boulders-boardwalk':'boulders','delay-home':'mauritiusAirport','flight-home':'mauritiusAirport'
};
const regionKeys={safari:'mara',seychelles:'mahe',falls:'falls',chobe:'chobe',namibia:'windhoek',cape:'cape',mauritius:'mauritius'};
export function geographyFor(node){const key=ids[node?.id]||regionKeys[node?.location]||'shanghai';return {key,...locations[key],label:!node?'米的房间':node.id==='flight-out'?locations.shanghai.label:node.place||locations[key].label};}
export const routePins=[
 {id:'safari',coord:[35.1,-1.45],label:'肯尼亚 / 坦桑尼亚'},
 {id:'seychelles',coord:[55.46,-4.67],label:'塞舌尔'},
 {id:'falls',coord:[25.86,-17.925],label:'维多利亚瀑布',offset:[54,-17]},
 {id:'chobe',coord:[25.15,-17.82],label:'乔贝',offset:[2,24]},
 {id:'namibia',coord:[17.08,-22.57],label:'纳米比亚',offset:[-16,-8]},
 {id:'cape',coord:[18.42,-33.93],label:'开普敦',offset:[0,8]},
 {id:'mauritius',coord:[57.55,-20.2],label:'毛里求斯'}
];
