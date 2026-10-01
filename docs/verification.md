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
```

| 检查 | 范围与限制 |
| --- | --- |
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
