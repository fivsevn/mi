# 项目结构与维护约定

本文描述当前仓库。早期 Atlas 12、13 的过程说明已从 README 合并为当前状态，版本差异通过 Git 历史查询。

## 运行入口与模块

| 文件 | 职责 |
| --- | --- |
| `index.html` | 页面入口、字体预加载、唯一样式表与应用模块 |
| `css/game.css` | 地图、游戏、手机及响应式布局；当前唯一游戏样式表 |
| `js/app.js` | 页面渲染、导航、手机、小游戏界面、时钟与交互事件 |
| `js/engine.js` | 行李、选择效果、旅行状态、存档校验及迁移 |
| `js/art.js` | 世界地图绘制与点击地理范围；转出场景绘制接口 |
| `js/maps.js` | 地形色阶、世界/地区/局部地图共用绘制规则与坐标 |
| `js/scene.js` | 保留米的人物、头像、自拍与页面背景绘制 |
| `js/story-art.js` | 选项上方的故事动画；14 类构图、74 个故事细节、整数扫描线材质与逐帧动画 |
| `js/ui-art.js` | 手机外壳、锁屏壁纸、App 图标、头像、内部边框及小手机 |
| `js/paper.js` | 地图纸张边缘处理 |
| `data/routes/africa-001.js` | 非洲路线定义 |
| `data/routes/africa-journey.js` | 七段旅程、转场与收尾 |
| `data/routes/africa-stories.js` | 追加可玩事件与地点资料 |
| `data/items.js`、`data/contacts.js`、`data/endings.js` | 物品、联系人和结局数据 |
| `data/geography.js` | 地点坐标与地区地理数据接口 |
| `assets/world-grid.js`、`assets/context-maps.js` | 随仓库托管的代码地理数据 |
| `legacy/index.html` | 旧入口兼容页；不作为当前视觉实现入口 |

历史 `css/pocket.css` 已不存在，不应再作为维护入口。

## 视觉和地图

全部游戏画面使用代码绘制，不加入图片、SVG 或外部图片请求。世界大地图、非洲地区地图与游戏内局部地图共用地理轮廓和小方块坐标语言。首页拖动、地点悬停反馈及手机交互需要同时检查宽屏和窄屏。

像素绘制采用有限色阶、连贯像素簇及局部抖动法。抖动用于颜色过渡，控制范围和密度，避免将重复纹理铺满阅读区域。技法参考：[Cure 的 Pixel Art Tutorial](https://pixeljoint.com/forum/forum_posts.asp?TID=11299)。手机当前约定另见 [phone-design.md](phone-design.md)。

局部地理底图采用 Natural Earth 1:10m 数据，按地点裁剪后托管。来源：[Natural Earth Physical Vectors](https://www.naturalearthdata.com/downloads/10m-physical-vectors/)。`scripts/build-context-maps.py` 可从 Natural Earth GeoJSON 重建底图；地点坐标是剧情位置的近似中心，不是导航定位。

## 视口和滚动

竖屏舞台最大宽度为 560px，桌面浏览器也保持这一构图。页面固定，手机 App、游戏选项和行李内容各自滚动。禁止页面文字选择与长按菜单；手机内容保留竖向触摸滚动。动画在后台暂停，小游戏在进入手机或弹窗时暂停。检查 reduced-motion 状态时仍需确认必要场景运动可见。

## 存档与记录

当前存档键为 `mi-v02`，旅行对象 revision 为 4。现有兼容/迁移由 `js/engine.js` 和应用入口处理，不能因视觉修改清空存档。浏览器拒绝存储时仍可玩，并提示无法存档。

记事本只展示当前周目已经选择产生的结果与结束后的归来笔记。重新开始后，可见笔记和聊天按新周目处理；不回退展示历史 profile 记录，也不提前展示未发生的结局或物品用途。旧日记/记录书签进入手机记事本。

## 字体

本地字体：`assets/fonts/fusion-pixel-12px-monospaced-zh_hans.woff2`。首屏等待字体准备完成。裁剪脚本 `scripts/subset-font.py` 接受完整字体路径，需要 fonttools 和 brotli；修改文案后需核对是否缺字，不能只确认系统字体能显示。许可文件为 `assets/fonts/LICENSE-OFL.txt`。

## 发布

GitHub Pages 使用 `main` 根目录与 `CNAME`，域名为 `mi.fivsevn.com`。无构建步骤。

前端资源变更时，同步更新入口、模块引用和字体/样式的缓存版本标记，避免混用版本。仅修改 Markdown 文档时不改缓存标记、不改前端文件。发布成功不等于画面验收；有前端变化时需确认线上模块版本并实际操作相关页面。

截至本轮文档整理，前端缓存标记保留 `atlas-48`。本文不将此前检查结果视作未来改动自动通过的证明。

### Paper study (2026-10-03)
- `paper-art.js` draws the instant sheet on a fixed 224 × 272 design grid and paper slips on a one-CSS-pixel grid, using the phone-icon palette. No reference photographs become runtime assets.
- Instant frame uses Polaroid's documented 88.47 × 107.52 mm outer dimensions and 78.94 × 76.801 mm image area. Horizontal margins follow those measurements; the top margin is visually matched at approximately 5.2 mm, not a manufacturer-specified measurement. The frame keeps its aspect ratio in a height-constrained scene row.
- Reference: https://support.polaroid.com/hc/en-us/articles/115012363647-What-are-Polaroid-photo-dimensions
- Paper contours/core fibres, exposed backing pieces and lined fragments were studied from the real collage and monthly-planner photographs in https://www.archerandolive.com/blogs/news/6-ways-to-use-notepads . Each choice uses an independently cut contour; reading and hit areas remain upright.

Paper slips use flat face colours, local feathered tears and a thin cast shadow underneath the bottom edge. Do not apply a perimeter light/shadow ramp: it creates a bevelled button instead of thin paper. Pixel rotation can disable its default object shadow for these sheets; the approved phone/map keep their existing shading.

The instant sheet is outside `.paper-stack`, which is the only game-story scroller. Its proportions remain unchanged; short viewports constrain its footprint to reserve space for the paper pile. Inventory edits and phone return preserve the active paper scroll position. The miniature map uses a proportional cover crop across its rectangular sheet rather than a square contain projection.

The instant frame and its aperture share proportional positioning from one canonical drawing; the aperture width uses matching parity so left/right paper margins remain identical. Narrative and option slips share a width bound inside that frame. Desktop and instant-sheet phone objects share a newly authored 64 × 104 device, a 128 × 164 output canvas, and one responsive display-size rule. Rotation changes its footprint, not the device scale.

The homepage title and geographic miniature share `folded-paper.js`: identical cut stock, edge wear, creases and sampled 11° tilt. The title uses paper colours and its lettering is drawn before rotation, with a larger shadow beneath it. Its width is bounded to 172px and it sits 10px further left than the earlier placement. Homepage and story phones use the same −13° sampled sprite, dimensions and object shadow, including the lit homepage variant. The opened phone has a fixed 20:39 aspect ratio, a bounded centered footprint, and an independently scrollable launcher grid. The atlas initially centres the Safari coordinate, retaining horizontal dragging.

Page backgrounds share `--page-background: #8a9070`, matching the play screen. `paintSurface()` fills its whole canvas with that colour; it must not draw a contrasting centre panel, which exposes a yellow seam when its coarse canvas grid differs from the centered CSS shell after resizing. Browser theme colour, outer margins, shell and safe-area space use the same colour.
