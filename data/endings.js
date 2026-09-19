// Records describe what remained. Order is only a stable tie-break, never a rank.
export const ENDINGS=[
 {id:'leopard',title:'今天没有看到豹子',code:'RR · 03',active:true,text:'不是每一次等待都有东西出现。\n米还是记住了那片草地。',match:r=>!r.flags.leopard?5:0},
 {id:'sunscreen',title:'防晒霜还剩半瓶',code:'RR · 01',active:true,text:'去了那么远，带回来的还有半瓶日常。\n米把它放回了玄关。',match:r=>r.flags.sunscreenUsed?6:0},
 {id:'receipts',title:'小票比明信片多',code:'RR · 06',active:true,text:'买车票，买午饭，买六小时睡眠。\n有些时刻，最后只剩一张很薄的纸。',match:r=>r.flags.comfort?4:0},
 {id:'heavy',title:'箱子比出发时重了',code:'RR · 07',active:true,text:'有些是买的。有些忘了为什么还留着。\n箱子关上了。事情还没有。',match:r=>r.returnWeight-r.departureWeight>=1?7:0},
 {id:'light',title:'箱子比出发时轻了',code:'RR · 08',active:true,text:'少了几件东西。\n那几天空出来的位置，米没有再填满。',match:r=>r.departureWeight-r.returnWeight>=1?7:0},
 {id:'sea',title:'回家以后还在比较海',code:'RR · 09',active:true,text:'水龙头打开的时候，米想到了那个蓝色。\n然后想起来，还没交水费。',match:r=>r.flags.compareSea?6:0},
 {id:'next',title:'下一站还没有被画出来',code:'RR · 11',active:true,text:'路线回到了出发的地方。\n米没有把地图合上。',match:()=>1},
 {id:'sand',title:'所有口袋里都有沙',code:'RR · 02',active:false},
 {id:'rain',title:'雨衣失去了意义',code:'RR · 04',active:false},
 {id:'offline',title:'没有信号的地图',code:'RR · 05',active:false},
 {id:'cape',title:'开普敦再见？',code:'RR · 10',active:false}
];
export function returnQuestions(r){
 const q=[];
 if(!r.flags.leopard)q.push({id:'leopard',text:'也许是为了那些没有等到的事。'});
 if(r.flags.sunscreenUsed)q.push({id:'sunscreen',text:'想在别的地方，过几天普通日子。'});
 if(r.flags.compareSea)q.push({id:'sea',text:'我好像还想再看看另一片海。'});
 if(r.returnWeight-r.departureWeight>=1)q.push({id:'heavy',text:'说不清。带回来的东西倒是很多。'});
 if(r.departureWeight-r.returnWeight>=1)q.push({id:'light',text:'想试试少带一点东西生活。'});
 if(r.flags.comfort)q.push({id:'receipts',text:'想把钱花在自己确实需要的地方。'});
 q.push({id:'next',text:r.flags.missedPhoto?'为了刚才那样，来不及拍照的瞬间。':'不知道。但下次可能还是会出去。'});
 return q;
}
export function selectEnding(run){
 const preferred=ENDINGS.find(x=>x.active&&x.id===run.returnReason);
 return preferred||ENDINGS.filter(x=>x.active).sort((a,b)=>b.match(run)-a.match(run))[0];
}
