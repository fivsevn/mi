# 验证说明

先在仓库根目录运行 `python3 -m http.server 4173`。以下命令需要 Node.js；浏览器检查需已可用的 Playwright 模块与浏览器运行时。仓库没有生产依赖，也不要求为运行游戏安装 Playwright。

## 当前检查入口

```sh
node --test tests/engine.test.js
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/browser.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/phone-design.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/touch-phone.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/atlas-interaction.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/code-visual.mjs
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs node tests/story-art.mjs
```

| 检查 | 范围与限制 |
| --- | --- |
| `story-art.mjs` | Chromium/WebKit 当前 74 故事画面区分、逐帧变化、换装、实际故事 ID 传递、无图片请求和 reduced-motion；截图在 `/tmp/mi-story-review` |
| `engine.test.js` | 状态、行李重量与金额、物品效果、周目隔离、存档校验/迁移及七段旅程 |
| `browser.mjs` | Chromium/WebKit 完整 74 事件流程、小游戏、七次停顿、手机、旧入口与拒绝存储；支持 `MI_TEST_URL`、`MI_BROWSER` 和可选 `CHROME_PATH` |
| `phone-design.mjs` | Chromium/WebKit 锁屏与实时钟表、轻按解锁、Home 退出、内部滚动与宽窄视口；目标地址固定为本地 4173 |
| `touch-phone.mjs` | Chromium 原生触摸轻按解锁和联系人内部滚动，不产生页面滚动或文字选择；固定本地 4173 |
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
