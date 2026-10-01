# 米的地图 · MI’S MAP

[打开游戏](https://mi.fivsevn.com)

桌上只有地图和手机。点击黄色非洲陆地展开地区地图，方框表示地点；已到访地点可点击，下一站以金色标记，之后尚未解锁的地点禁用；完整路线预先画出，已走段落加深。当前地点返回正在玩的画面，其他已到访地点打开该地点的旅行记录；直接点击下一站接着走，地图上没有另设的开始按钮。非洲42天为完整的一卷，分成七段地点旅程，共74个事件。每段结束可回到桌面，下次从下一站续走，也可立即继续；行李、余额、聊天和记事本属于同一次旅行，只有最后才进入归来整理。

游戏固定在 440px 以内的竖屏舞台，页面不滚动；选项、行李列表和手机 App 在各自区域内滚动。

## 手机和记录

手机从锁屏进入 App 桌面：聊天、记事本、行李、设置。场景下方左侧的像素手机打开同一部手机，右侧迷你纸地图显示当前地点周边的真实地理轮廓，点击显示具体地点，再点文字收起，不提供路线预览。

记事本只显示当前周目实际选择产生的结果。结束后增加本周目的归来笔记；重新开始后记事本和可见聊天重新从空白开始。不会回退到 profile 历史记录，也不展示未发生的结局、物品用途或旅游资料。

原有浏览器存档和 mi-v01 保留，旧节点索引按 ID 迁移。旧日记与记录书签统一进入手机记事本。浏览器拒绝存储时可继续游戏，并提示无法存档。

## 实现和验证

- js/app.js：固定场景、手机 App、当前周目笔记、小游戏界面。
- js/engine.js：行李、选择、状态与存档；visibleNotes 限定已发生内容。
- js/maps.js、data/geography.js、assets/context-maps.js：非洲地区地图、实际地点与局部地图，Natural Earth 海岸线、河湖与边界。
- js/art.js：现有米的人物画法、场景和世界地图；非洲陆地点击。
- css/pocket.css：固定视口、内部滚动、复古按钮和手机 App。
- data/routes/africa-journey.js：七段路线、收尾及新剧情；资料和实录/虚构边界见 docs/africa-story-sources.md。
- data/routes/africa-stories.js：可玩事件及最小地点坐标。没有说明性旅行档案。

无需生产依赖或构建：

```sh
python3 -m http.server 4173
node --test tests/engine.test.js
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome node tests/browser.mjs
```

浏览器回归在 Chromium 和 WebKit 完整走过 74 个事件和七次段落停顿，包括小游戏、物品变化、手机返回、当前周目隔离、旧书签处理、320×568 到 1440×1000 的固定屏幕，以及不可用存储。截图在 test-results/。

GitHub Pages 使用 main 根目录和 CNAME。发布时更新完整模块图和字体的版本标记，防止混用旧缓存。

## 字体与素材

Fusion Pixel 12px Monospaced 简体中文字体本地托管，按文案裁剪，预加载并等待准备完成后显示首屏。字体许可见 assets/fonts/LICENSE-OFL.txt（SIL OFL 1.1）。脚本 scripts/subset-font.py 接受完整字体路径，需要 fonttools 和 brotli。

Canvas / CSS 场景为本项目绘制。世界地图陆地数据来自公共领域 Natural Earth；局部地图采用 1:10m 数据（[来源](https://www.naturalearthdata.com/downloads/10m-physical-vectors/)），按地点裁剪后随游戏托管，不依赖外部地图服务。地理坐标为剧情地点的近似中心；scripts/build-context-maps.py 可从 Natural Earth GeoJSON 重建底图。动画尊重 reduced-motion；小游戏切到手机、资料弹窗或后台时暂停。
