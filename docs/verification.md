# 验证说明

先在仓库根目录运行 `python3 -m http.server 4173`。以下命令需要 Node.js；浏览器检查需已可用的 Playwright 模块与浏览器运行时。仓库没有生产依赖，也不要求为运行游戏安装 Playwright。

## 当前检查入口

```sh
node --test tests/engine.test.js
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/packing.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/browser.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/phone-design.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/touch-phone.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/paper-scroll.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/atlas-interaction.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/code-visual.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/story-art.mjs
```

| 检查 | 范围与限制 |
| --- | --- |
| `story-art.mjs` | Chromium/WebKit 当前 74 故事画面区分、逐帧变化、换装、实际故事 ID 传递、无图片请求和 reduced-motion；截图在 `/tmp/mi-story-review` |
| `packing.mjs` | RPG 行李物品栏；Chromium/WebKit 拖入指定格子、同区换位、占格互换、取出/取消、无重复物品、仅重量文字、20/25 kg 秤屏颜色、手机与地图往返、合箱/打开/剧情继续和 320–1440 宽度；Chromium 原生触摸拖放与箱外格子滚动 |
| `engine.test.js` | 状态、行李重量与金额、物品效果、周目隔离、存档校验/迁移及七段旅程 |
| `browser.mjs` | Chromium/WebKit 完整 74 事件流程、小游戏、七次停顿、手机、旧入口与拒绝存储；支持 `MI_TEST_URL`、`MI_BROWSER` 和可选 `CHROME_PATH` |
| `phone-design.mjs` | Chromium/WebKit 锁屏与实时钟表、轻按解锁、Home 退出、内部滚动与宽窄视口；目标地址固定为本地 4173 |
| `touch-phone.mjs` | Chromium 原生触摸轻按解锁和联系人内部滚动，不产生页面滚动或文字选择；固定本地 4173 |
| `paper-scroll.mjs` | Chromium/WebKit 上下纸条滚动、内容末尾、照片固定、手机/地图点击、行李与手机返回；Chromium 原生触摸检查开场、长行李列表和机场选项；支持 `MI_TEST_URL` |
| `atlas-interaction.mjs` | 拖地图、悬停、地区地理比例、节点可达性与迷你地图；支持 `MI_TEST_URL` |
| `code-visual.mjs` | 无图片文件/请求、唯一样式表、14 种代码场景与服装变化；支持 `MI_TEST_URL` |

截图输出位置以各脚本代码为准，完整浏览器回归的检查截图位于系统临时目录。不要把检查截图加入游戏仓库。

`tests/visual-phone.mjs` 是历史检查脚本：仍依赖旧 `#lock-selfie` 与旧解锁/地图断言，不适用于当前手机。当前手机检查用 `phone-design.mjs` 和 `touch-phone.mjs`。本轮只整理文档，未修改或删除历史脚本。

## 视觉改动的手动复核

自动检查不能证明画风符合参考。手机改动至少查看锁屏、桌面、联系人、聊天、行李和设置；确认屏幕边缘、听筒与 Home 的相对位置。地图改动查看世界、地区与场景迷你地图，确认坐标仍一致。

使用 320×568、390×844 及桌面宽屏检查裁切、长文本、内部滚动和按键可达性。照片/账单占位不能进入空白页面。需要同时确认 hover、实际触摸、页面固定及真实时间更新。

## 仅文档变更

只改 README 与 `docs/*.md`，不改 HTML、CSS、JavaScript、数据、字体、缓存版本、存档或游戏机制。以 Git 差异确认变更范围，并核对文档中引用的本地文件。无需重复完整游戏测试来验证 Markdown 编辑；前端变更仍遵循上面的对应检查。

- 2026-10-03 paper study: directly exercised local port 4181 in Chromium and WebKit at 320×568, 390×844, 560×1000 and 900×600. Reason → packing → departure → choice → phone → return → next, viewport resizing, and horizontal containment passed without page errors. At 320×568 the final choice is in the independent option scroller. Scene animation also passed with reduced motion enabled. Refreshed the user's in-app preview and displayed the revised opening narrative. This is local preview verification, not a production deployment.
- Later 2026-10-03 revision: the photograph fills the play area's available width while retaining its aspect ratio. The play page now scrolls vertically as one sheet, replacing the earlier independent option scroller. Repeated Chromium/WebKit checks at all four viewports passed selection, packing, departure, phone return and resize; refreshed and visually inspected the in-app opening scene.
- Paper-study-6: removed colour chips; narrowed both paper and image lips. Code-authored phone and geographic minimap sprites use integer-grid inverse-sampled rotation. The enlarged phone overlaps the lower-left edge, and the folded/worn map crosses the right image/paper junction. Chromium/WebKit flow checks at the four viewports passed; directly checked Shanghai location reveal/hide and phone entry/return at 320×568, and refreshed the in-app opening scene.
- Paper-study-7: paper slips use clustered edge wear, pale core fragments and mild pixel-sampled tilt consistent with the approved phone/map objects. Choices overlap by 11–13 CSS pixels and the gap to narrative is reduced; the 390-wide choice block is 185px tall (previously 255px). Repeated Chromium/WebKit responsive and connected-flow checks passed. The in-app opening narrative was refreshed and visually inspected.
- Paper-study-8: slips render on a one-CSS-pixel grid, independently of the instant frame's two-pixel grid. Edge clusters are smaller and lower-contrast, the contact shadow is one authored pixel, and material wear is limited to the outer three pixels; internal mottling is removed. Compact overlap remains. Chromium/WebKit checks at 320/390/560/900 widths passed; the in-app preview was refreshed and visually compared with the user's coarse-grain defect screenshot.
- Paper-study-9: ordered Bayer dithering now mixes paper-core highlights, body colour and warm/olive shadow along the outer four pixels. Coverage decreases toward the clean interior; crease/dog-ear structure is protected. This replaces contiguous material patches rather than merely shrinking the drawing grid. Chromium/WebKit checks at the four viewports passed and the in-app preview was refreshed and visually inspected.
- Paper-study-11 final contour revision: removed repetitive cut-tooth decoration. Slips now tilt in alternate directions with 14–22px of vertical change across their width; pixel-sampled rotation supplies the staircase contour, while edge dithering remains. Backing canvases include rotation padding to avoid cropping. Choice spacing was adjusted to protect labels while retaining compact overlap. Chromium/WebKit connected-flow and responsive checks passed at all four widths; refreshed and inspected the user's in-app preview.
- Paper-study-12: reduced the cross-width vertical change to 3–6px, keeping paper slips nearly level while retaining pixel staircase edges and dithering. Refreshed and inspected the in-app preview; 320/390 fourth-choice interaction checks passed. The earlier larger 14–22px slope is superseded.

- Paper-study-14: removed the all-around highlight/shadow rim and automatic object shadow from paper slips. Only disconnected torn-fibre spans receive ordered colour mixing; clean cut edges retain the flat body tone. Small cast shadows appear underneath selected lifted spans. The phone and map retain their existing sprite shadows. Chromium/WebKit connected flows and responsive containment passed at 320/390/560/900 widths; refreshed and visually inspected the in-app opening screen.

- Paper-study-21: compressed narrative padding and the four option slips, moved narrative closer to the instant sheet, and added a 2–3px cast shadow below paper edges. The instant sheet stays stationary while `.paper-stack` scrolls. Chromium/WebKit at 320×568, 390×844, 560×1000 and 900×600 showed all opening options in one screen; the long packing list scrolled without moving the photograph. All option centres remained clickable, fourth-option selection worked, inventory edits and phone entry/return retained paper scrolling. The approved phone sprite is larger and sampled at −17°; map is slightly larger, at 11°, and covers the full rectangular paper. Map paper protrudes slightly past the instant sheet’s right edge. Location text is unboxed, 9px at 70% opacity, with a subtle lower highlight and a raised position nearer the map. In-app preview was refreshed and visually inspected with the location label visible. This remains a local preview.

- Paper-study-22: location letters have a sharper dark upper lip and pale lower highlight for a stronger debossed impression, without changing their size or position. The phone sprite is sampled at −13°, four degrees more upright. Captured and visually inspected the opening screen at 320/390/560 widths with the location label visible; the user preview was refreshed.

- Paper-study-25: both small-phone placements now share the same responsive size and finer 64 × 104 authored metal/glass contours; the tilted instance remains −13°. The Polaroid uses a canonical 224 × 272 drawing and percentage aperture placement, with equal side margins at every viewport. Paper slips are bounded inside the physical sheet width. Chromium/WebKit checks at 320×568, 390×844, 560×1000 and 900×600 passed equal phone dimensions, symmetric aperture margins, photograph proportions, contained slips, all opening choices in one screen, packing-list scrolling with a stationary photograph, inventory edits and phone return. Refreshed and inspected the in-app opening preview.

- Paper-study-29: homepage title reuses the geographic miniature’s paper renderer, with cream stock and title lettering rotated together at 11°. It sits upper right, with its display width reduced to 190px (bounded to 54% on narrow screens). The upright miniature phone retains its size, moved slightly left and up. The opened phone is centered, fixed at 9:16 after the requested slight elongation, and leaves background space around it. Chromium/WebKit at 320×568, 390×844, 560×1000 and 900×600 passed map → phone/map app → destination → phone Home → chat/notes/luggage/settings → exit, with unchanged gameplay. Inspected homepage, phone lock and Home screenshots, and refreshed the user preview.

- Paper-study-31: title paper is smaller (172px), moved 10px left, and has a deeper underlying sprite shadow. The homepage phone now uses the exact same −13° pixels as the story phone. The opened phone is slightly longer at 20:39 and remains centered with clear viewport margins. Chromium/WebKit at 320×568, 390×844, 560×1000 and 900×600 passed exact miniature pixel equality, Safari marker centering, phone proportions, map → phone → destination → phone apps → exit, without page errors. Refreshed and visually inspected the user's preview and the homepage/phone screenshots. Local preview only.

- Paper-study-32: removed the contrasting central rectangle from the background canvas and unified page/shell/view backgrounds with the play screen's #8a9070. Chromium/WebKit passed map → phone → play → phone → return and ten consecutive viewport changes (320 through 1401px, including 560/561/563/565px). Every canvas pixel had the same opaque background colour, page and shell colours matched, and no horizontal overflow or page errors occurred. Visually inspected the wide view and narrow captures for the exposed yellow seam.

- Story-pixel-6: directly exercised the local 4181 preview in Chromium and WebKit. All 74 story frames are distinct, animate, and respond to outfit changes, with no image requests or page errors. At 320×568 (reduced motion), 390×844, 560×1000 and 900×600, departure, visible scene motion, photograph containment, phone entry/return and next-story navigation passed. Checked 774 rendered frames per browser across the full aircraft cycle and room/camp/falls/desert/coach scenes; every pixel remained opaque, with the slowest observed draw under 8 ms. Visually inspected the frontal room/airport and scene gallery, then refreshed the user's in-app preview with the cooler palette, larger eye and narrow mobile margins. This is a local preview, not a production deployment.

- Paper-layer-2: Chromium and WebKit at 320×568, 390×660, 390×844, 560×1000 and 900×600 passed native wheel scrolling of slips across a stationary photograph, hit testing above the photograph, hidden scrollbar, short-pile scrolling to the top, inventory scroll retention, phone entry/return and next-story navigation. Canvas pixels confirmed 240/255 paper-face opacity and unchanged 120/255 and 40/255 cast shadows. Chromium native touch swipes also moved the papers without moving the page/photograph; phone backdrop/return preserved a 350px paper scroll, and resizing recalculated both spacers. Inspected overlapping-paper screenshots; no horizontal overflow or page errors occurred.

- Paper-layer-4: Chromium/WebKit at the same five viewport sizes passed the new scroll limit for opening, packing and airport papers. Fully visible piles had zero scroll range; overflowing piles stopped 8px above the viewport bottom, and further wheel movement did not advance them. At 320×568, phone backdrop/return retained a 30px scroll. Checked alpha 230/255 for stock, unchanged 120/255 and 40/255 shadows, and opaque text. A native Chromium touch swipe at the end did not move the papers or page. Choices and next-story navigation remained functional without page errors.

- Paper-layer-5: `tests/paper-scroll.mjs` passed Chromium/WebKit wheel input at 320×568, 375×600 (matching the reported iPhone Safari content area), 390×660, 390×844, 560×1000 and 900×600. Upper narrative and lower choices reveal overflowing content and stop with its end visible; fully visible piles retain zero scroll range. Exposed phone/map clicks, phone-return position, long packing lists, inventory edits, airport choices and next-story navigation passed. Chromium native touch swipes passed both directions on opening, packing and airport papers at all five mobile sizes, without moving the photo/page, selecting text or triggering choices. The 19 engine tests passed. WebKit wheel testing is not physical iPhone touch verification.

- Packing-1: 本地 4173 的 Chromium/WebKit 验证独立行李画面、拖放/取消/轻点、秤的重量和件数、充电宝随身规则、超重限制、开合与刷新存档、手机返回、六种视口和出发后剧情。Chromium 原生触摸拖动、取消和独立物品区滚动通过；19 项引擎检查和纸条滚动检查通过。完整旅程脚本仍在既有等车小游戏的 `.npc-here` 等待处超时，本轮未以此声称完整 74 事件回归通过。本轮为本地预览，未部署生产网站。

- Packing-RPG-3: 以真实硬壳行李箱的圆角箱壳、拉链分隔板、提手和轮子为结构，用既有游戏像素素材重绘。删除标题、说明、分类文字、件数、自重/限重提示、预装按钮及底部按钮条。上盖复用故事手机与迷你地图，箱内/外采用统一格子，支持指定格子投放、互换与刷新保存。秤屏 20.0 kg 黄色、25.0 kg 红色，经 Chromium/WebKit 实际颜色采样验证；两浏览器六种视口及 Chromium 原生触摸通过。既有 20 kg 出发规则保持。界面通过拉链开合、合箱后标签上的箭头进入剧情；名称保留在无障碍标签与悬停提示中。当前为本地预览。

- Packing-Free-6: 按最新反馈恢复大尺寸行李箱；左右两侧箱壳均为 184×234 的同尺寸像素绘制，通过横向镜头查看，合箱仍由实体拉链控制。重新绘制空箱衬布、网面分隔袋、交叉压缩带、扣件、角落折痕、提手和轮子，以方向明暗与接触阴影代替外圈描边。箱内删除所有格子，物品保存自由坐标与叠放顺序，可放在任意一侧、重叠摆放、挪动或取出；旧格子存档转换为坐标。拖动物品停留在画面边缘可移向另一侧；快速经过边缘不会移动镜头。仅箱外保留凹槽物品栏，电子秤和随身物品托盘固定在镜头外。Chromium/WebKit 的自由投放、叠放、取消、跨侧拖动、称重颜色、保存、手机/地图返回、六种视口、开合和出发剧情通过；Chromium 原生触屏自由拖放、取消、物品栏滚动与左右查看通过。19 项引擎检查通过。实际刷新并检查了用户的 4173 预览，当前仍为本地版本。

- Packing-Fine-7: 行李箱绘制网格密度提高两倍，主画布 800×572、左盖 400×572，显示尺寸与自由坐标保持一致。以半单位像素重新绘制箱壳圆角、斜绑带、细织纹、拉链齿、扣件、轮子与提手，保留方向明暗、接触阴影及无外圈描边的画风。实际检查了新版空箱与本地浏览器预览；既有行李验证脚本通过 Chromium/WebKit 六种视口、自由摆放/跨侧拖动/保存、手机与地图返回、称重颜色、开合与出发剧情，以及 Chromium 原生触屏操作。当前为本地预览。

- Packing-Clusters-8 / Packing-Edge-9: 根据 Pixel Joint 的像素簇/方向光/克制纹理教程（https://pixeljoint.com/forum/forum_posts.asp?TID=11299）及 Saint11 的布料教程（https://saint11.art/blog/pixel-art-tutorials/）重画空箱的聚拢褶皱、布面织纹、织带、金属扣件、箱壳局部反光和磨痕。进一步按手机素材的逆向整数采样方式，给左右箱壳加入相反的 2.5 度透视倾角；轮廓覆盖限定在 2×2 原生像素台阶，内部保留细纹理。参考 Samsonite Outline Pro 实物图（https://shop.samsonite.com/luggage-carry-on-luggage/outline-pro-carry-on-spinner/137393XXXX.html），删除底部错误提手，重画顶部携带提手和收回的拉杆握把，右侧补上三位密码拨轮、释放按钮及成对拉链头，并把开合热区移到箱锁位置。手机宽度 47% → 28%，地图 72% → 44%。检查了左右空箱、合箱、用户已有存档的实际本地预览；Chromium/WebKit 六种视口、自由摆放/重叠/跨侧拖动/取出/取消/保存、手机与地图返回、20/25 kg 颜色、侧锁开合及出发剧情均通过，Chromium 原生触屏自由拖放和独立滚动通过。未部署生产网站。

- Packing-Unified-11: 按新增截图反馈去掉行李画面的外边距、内嵌摄像窗口裁切及该环节的页面最大宽度；摄像区域铺到屏幕左右边缘，箱外物品区保持独立滚动。左右箱壳、衬布和中间连接带改为同一张代码像素画，整体顺时针 3.5 度整数采样，避免两个各自旋转的箱体错位。根据 Samsonite 实际打开的拉链箱内侧照片，删除两块金属铰链，改成贯穿接缝的布质柔性连接、中央折线和缝线。外轮廓采用 4×4 原生像素覆盖台阶，内部织纹仍保留细像素。相机铺满后，跨侧拖动验证在镜头移至左侧后移入左侧实际衬布再释放，避免把屏幕边缘外部空白误认为箱内。最终 Chromium/WebKit 六视口与 Chromium 原生触屏检查通过，范围含屏幕边缘、自由摆放、跨侧移动、保存、手机/地图返回、称重、箱锁开合和出发剧情；已刷新用户本地预览，未部署。

- Packing-Info-16: 物品栏左右及底部各保留 12px；整个行李箱下移 12px。合箱后的箭头牌替换为挂在顶部提手上的纸质行李牌，以整数像素书写「米」，点击进入既有出发剧情。新增合箱拉杆的向上拖动、向下收回、点击与键盘切换；拖动时逐格重绘金属杆，箱体向下让出空间而保留顶部留白，取消恢复、刷新保存及打开箱子时收回。点击物品改为只查看左侧信息块的名称、重量及 `data/items.js` 既有短句，删除重复悬停标题；装入、挪动和取出均由拖拽完成，点击箱内物品也不会取出。合箱状态仍可查看外部物品信息，装箱拖拽只在打开时启用。信息块不会遮住随身物品托盘。`tests/packing.mjs` 的 Chromium/WebKit 六尺寸、点击不修改行李与重量、拖拽自由放置及随身规则、信息文案、取消、手机/地图返回、称重、开合及出发剧情通过；Chromium 原生触屏点击查看、拖拽和独立滚动通过。`tests/packing-handle.mjs` 的 Chromium/WebKit 鼠标拉杆、点击/键盘收回、取消、保存、开箱收回、行李牌进入下一环节及 Chromium 320px 原生触屏拉杆/点牌通过。实际检查了 390px 与 320px 信息块、展开拉杆及用户本地预览；未部署生产网站。

- Packing-Pull-18: 最新机制取代 Packing-Info-16 的点牌出发与拉杆切换：合箱后拉杆收起，向上拖满并松手进入下一剧情；点击拉杆、键盘激活及点击「米」行李牌均不出发，行李牌只作为画面装饰。半途释放或取消拖动收回拉杆，开箱与刷新恢复收起状态；既有 20 kg 出发限制保持。行李牌参考 Woodstock McKenzie 实物（https://woodstockleather.co.za/products/mckenzie-luggage-tag），改为带小金属扣的皮革挂带、皮套与凹入的姓名卡窗口，「米」使用游戏字体采样为不透明像素。Chromium/WebKit 通过点击无效、部分/取消拖动、开箱/刷新、完整拖动与后续剧情，Chromium 320px 原生触摸拉杆通过。原有 `tests/packing.mjs` 两浏览器六视口、自由放置、点击信息、跨侧拖拽、手机/地图返回、保存、称重色及超重阻止出发、剧情继续，以及原生触屏拖放与滚动均通过。已检查展开拉杆截图并刷新用户的本地预览；未部署生产网站。

- Packing-Review-21: 整理时移除电子秤与物品说明中的重量；点击物品或开始拖动物品同步显示名称和既有一句话文案。说明块成为箱外物品栏顶部的凹陷矩形，沿用格子的底色与内阴影，和下方格子属于同一个托盘。合箱进入称重状态，箱体下移，箱外物品栏变淡且 inert 不可选；下方出现电子秤及「就带这些」「继续整理」。继续整理恢复自由装箱，保存的行李与坐标不变。确认后移除物品栏、说明、秤与按钮，只保留居中的箱子与拉杆热区；向上拉满并松手进入下一剧情，行李牌保持装饰。称重/确认状态随存档保存，既有 20 kg 出发规则保持。`tests/packing-review.mjs` 的 Chromium/WebKit 六视口通过说明托盘样式、拖动时立即切换信息、整理无重量、背景物品不可操作、称重与返回、确认画面中心及刷新保持状态。`tests/packing-handle.mjs` 两浏览器及 Chromium 320px 原生触摸通过拉杆、部分/取消拖动、点击无效和剧情进入；`tests/packing.mjs` 两浏览器六尺寸与原生触摸通过自由拖放、信息显示、跨侧摆放、取消、手机/地图返回、保存和称重颜色/超重规则。检查了 320px/390px 三个状态，并刷新与检查用户当前预览；本轮仍为本地预览，未部署。

- Packing-Card-25: 按最终反馈将说明恢复为 240px 最大宽度的浮动卡片，底色不透明度 62%，标题/描述 12px/11px；点击其他位置隐藏，点击或开始拖动当前物品显示，物品栏几何位置与滚动面积不因卡片出现变化。拉杆伸长量 32→64 个绘制单位，拖动行程同步翻倍。称重页和确认后的居中箱子都保留点锁打开，打开后保持原行李与坐标并返回整理。电子秤重画为带两枚实体凹陷按键的同一像素机身，加入台阶轮廓、分块高光、塑料材质、接触阴影、液晶凹槽及整数像素倾斜；原两张文字按钮移入机身按键位置。最终 `packing-review.mjs` 两浏览器六视口通过浮动卡片、点击其他处收起、固定物品栏、实体按键、称重/返回、确认与点锁开箱、存档；`packing.mjs` 两浏览器六视口与原生触屏通过自由拖放/取消/跨侧放置/显示当前物品、手机/地图返回、重量颜色与超重规则、后续剧情。长拉杆两浏览器及 320px 原生触摸验证通过；19 项引擎检查通过。`story-art.mjs` Chromium/WebKit 验证 74 个不同且持续运动的故事帧和服装变化。完整旅程中的既有 `.npc-here` 超时不在本轮宣称修复的范围内。

- Packing-Center-27: 箱外物品栏外框改为最大 571px，只包住 560px 格子区，去掉宽屏左右空底板；保留窄屏左右与底部留白。能完整容纳两侧箱体的宽屏，将整个打开的箱子和物品说明卡居中；两侧都可见时暂停横向镜头，窄屏仍可左右滑动。Chromium/WebKit 在 1440×1000、900×600、390×844、320×568 验证外框贴合格子、箱子与卡片居中、无溢出、卡片不挤动物品栏。

- Packing-Native-28: 横向查看由画布 transform 位移改为真实 overflow-x:auto 容器与 scrollLeft。触屏使用浏览器原生 pan-x，横向滚轮直接滚动；鼠标抓取、键盘与拖动物品停靠边缘均修改真实滚动位置。完整箱体适合宽屏时 scrollWidth=clientWidth、滚动范围为零，箱体、说明卡和物品栏居中；窄屏滚动不会移动物品栏。`packing-scroll.mjs` Chromium/WebKit 验证真实滚动范围、原生横向滚轮、scrollLeft 与内容位移一一对应、打开箱体没有 transform、宽屏无多余滚动与居中。`packing.mjs` 两浏览器六视口和 Chromium 原生触屏验证自由摆放/跨侧拖动/取消、原生水平滚动、独立物品栏、手机/地图返回、称重与剧情。

- Packing-Scale-29: 电子秤缩至最多 220px，固定在关闭箱体的右下角并随箱体尺寸定位；按钮文字按像素秤按键的同一旋转中心居中。`packing-review.mjs` Chromium/WebKit 六视口验证称重、返回保持摆放、确认和锁重新打开，电子秤不越界。
