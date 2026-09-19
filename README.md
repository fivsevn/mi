# mi — 米米环游世界

[开始旅行：mi.fivsevn.com](https://mi.fivsevn.com)

一个把现实旅行写成封闭叙事环线的像素小游戏。世界是开放的，米每次只走一条路线。一次旅行不能代表一个地方，地图也不需要被填满。

## v0.2 可玩的完整流程

世界地图 → Route 001 → 出发前的问题 → 逐件装箱 / 换装 → 机票与住宿 → 肯尼亚 / 坦桑尼亚 Safari → 塞舌尔 → 后续路线书签 → 回程机票 → 再整理行李 → 回家的问题 → RETURN RECORD → 地图。

- 17 个旅行节点，完整的 Safari 与塞舌尔两章，约 15 分钟一个周目。
- 完整七大洲像素地图；无记录地区显示 `NO FIELD RECORD`。非洲显示 `FIELD RECORD × 次数`。月球轨道只作为远处的暗示。
- 20 kg 托运限制，1.4 kg 空箱。23 件可选出发物品，5 件途中获得的物品。出发必须取舍；回程可留下物品、放进最多 7 kg 的随身包、穿上衣服或付超重费。拿出后可以撤回。充电宝放随身包。
- 上衣、外套、帽子、鞋的像素纸娃娃。只允许换上实际带着的衣物。衣物、相机、长焦、防晒、驱蚊、书、泳衣等改变文本版本。
- 公开旅费与重量；舒适、疲劳、观看、记忆等状态只在故事里体现。机票与住宿的金额是游戏内叙事设定，不是实际旅行报价。
- 6 个长期联系人，3 个轻社交时刻；统一提示“**不知道为什么，突然想发给TA。**”。每个联系人对同一件事有不同回复。可全程不发消息；累计聊天会改变之后的内心旁白，包括下个周目。
- 7 种可触发的 RETURN RECORD。数据中预留了 11 种，未启用的 4 种随后续章节加入。没有好坏排名，没有 TRUE END，没有结局完成率。
- 自动保存整个当前阶段，刷新后从地图继续；已完成周目、旧聊天和归来记录保留。豹子是否出现由本周目一次抽样确定，刷新不会重抽。
- localStorage 不可用时仍可在内存中玩，会清楚提示无法保存。无法解析的 v0.2 存档会备份到 `mi-v02-unreadable-backup`。

42 天是现实路线的跨度。本版完整演出第 1—17 天的两个地点，以书签明确跳过尚未写完的中段，然后进入第 42 天的归来；不会把尚未写出的五站冒充为已经游玩过的内容。

## 保留早期雏形

原始 v0.1 的 `index.html` 原样保留在 [`legacy/index.html`](legacy/index.html)，可从旅行菜单访问。原来的 `mi-v01` 存档不会被修改，新版使用 `mi-v02`。旧版原有的五天事件、印章和轻社交仍可使用。

## 结构与扩展

```text
index.html                 页面外壳
css/style.css              桌面 / 手机布局、像素界面
js/app.js                  场景渲染、导航、浏览器存档
js/engine.js               周目状态机、行李、选择、聊天、归来结算
js/art.js                  原创 canvas 像素场景与纸娃娃
assets/world-grid.js       世界地图像素陆地数据
assets/favicon.svg         mi 图标
data/items.js              物品重量、部位、途中物品
data/contacts.js           联系人、同事件的不同回复
data/endings.js            11 种归来记录（7 种已可触发）
data/routes/africa-001.js   Route 001 的站点与事件
data/routes/index.js       Route 注册表
legacy/index.html          未修改的原始试玩
tests/engine.test.js       核心状态 / 存档 / 结局测试
tests/browser.mjs          浏览器完整流程检查
```

未来补全维多利亚瀑布、乔贝、纳米比亚、开普敦、毛里求斯：在 `africa-001.js` 的 `nodes` 中替换 `interlude` 为新场景，并把对应 `stops.available` 打开、更新 `recordStops`。每个节点包含稳定 `id`、`scene`、`day`、`place`、短文本与 `choices`；每个选项可定义 `effect`、`cost`、`add` 和结果文本函数。社交通过节点的 `social` 键连接到联系人回复。对已发布路线插入节点时应按稳定节点 ID 迁移进行中的存档，避免旧的节点索引错位。

新增 Route 002 / 003：新增路线文件，在注册表中注册。提供 `id`、`number`、`name`、`region`、`days`、`budget`、`stops`、`nodes` 和封面文案。地图按 `region` 找路线，同地区多条路线会显示切换按钮。状态机以 `routeId` 区分周目；归来记录按路线独立计次。新路线需另补其场景、收尾问题和归来记录主题，不需要另建后端。

## 运行与检查

无需安装生产依赖，也不需要构建。因为使用浏览器 ES modules，使用静态 HTTP 服务，不要直接双击 HTML：

```sh
python3 -m http.server 4173
# 打开 http://localhost:4173
node --test tests/engine.test.js
```

可选浏览器检查需要 Playwright 和 Chromium / Chrome：

```sh
node tests/browser.mjs
```

若依赖由外部工具提供，可用 `PLAYWRIGHT_MODULE` 指向 Playwright 的 ESM 入口、`CHROME_PATH` 指向 Chrome 可执行文件。`MI_TEST_URL` 可指定测试地址。浏览器检查在独立临时浏览器上下文里运行，不接触个人浏览器存档，截图写入忽略的 `test-results/`。

已验证：7 种记录可达；三次不同的完整浏览器通关；每个阶段刷新续玩；超重、随身、穿着、丢弃与撤回；跨周目聊天与记录；320—1440 px 无横向溢出；保留旧版存档；禁用存储时继续游玩。

## 部署与素材

GitHub Pages 从 `main` 根目录发布。`CNAME` 保留为 `mi.fivsevn.com`。没有修改域名、DNS 或 Pages 来源设置。新增 `.nojekyll` 直接发布静态模块；没有后端、外部运行时、追踪脚本或第三方字体请求。

场景、人物、图标由本项目的 canvas / SVG 原创绘制。世界陆地像素取样自 [Natural Earth 1:110m land and countries](https://github.com/nvkelso/natural-earth-vector)，[公共领域数据](https://www.naturalearthdata.com/about/terms-of-use/)。地图为概览，不用于导航或边界判断。
