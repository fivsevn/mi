# 米的地图 · MI’S MAP

[打开米的地图](https://mi.fivsevn.com)

桌上一张折过的世界地图、一部手机、一本日记。点击非洲的标记出发；有没走完的旅程时，回到当前场景。固定 440px 竖屏舞台。故事先发生，点场景才展开地点，再翻纸页进入真实旅行资料。

## 游玩与存档

- 原有 Safari、塞舌尔、打包、换装、选择与归来结局保留。九国 42 天现在有 48 个事件节点，包含三个小游戏和 70 件有条件用途的物品。
- 手机先锁屏，解锁后进入聊天软件。六个朋友以最后一句消息出现；桌面聊天和旅途分享都保存在同一个浏览器里。
- 日记收录已经发生的片段；归来后可翻阅以前的结局。重新开始需要确认，不会清除以前的记录或聊天。
- 使用 `mi-v02` 存档，旧版存档兼容；不会读写 `mi-v01`。`legacy/` 直接返回新首页。浏览器不能保存时仍可玩，并显示提示。
- Hash 路由支持刷新、浏览器返回和 GitHub Pages，无需服务端路由设置。刷新手机后重新解锁，联系人仍保留。

## 本地运行和验证

无需生产依赖或构建：

```sh
python3 -m http.server 4173
node --test tests/engine.test.js
```

浏览器回归使用 Playwright 和 Chrome：

```sh
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs \
CHROME_PATH=/path/to/chrome \
MI_TEST_URL=http://127.0.0.1:4173 \
node tests/browser.mjs
```

回归在 Chromium 和 WebKit 中完整通关，覆盖三个真实计时小游戏、刷新继续、物品条件/消耗/损坏、开箱、聊天、三层记录、320–1440px 与存储不可用。截图输出到忽略的 `test-results/`。

## 文件与发布

- `js/app.js`：桌面物件、场景、手机、日记与导航。
- `js/engine.js`：游戏状态与存档；revision 3 按旧节点 ID 迁移原来的索引进度。
- `js/art.js`、`assets/world-grid.js`：原有像素地图、场景和人物。
- `css/style.css`：游戏基础样式；`css/desk.css`：桌面、手机和纸页样式；`css/handheld.css` 统一竖屏与小游戏表现。
- `data/`：剧情、物品、朋友与结局。`africa-stories.js` 维护新增事件和旅行资料。

GitHub Pages 从 `main` 根目录发布。保留 `.nojekyll` 和 `CNAME`（`mi.fivsevn.com`），不改变 DNS 或域名设置。

## 字体与素材

使用与 [Umwelt](https://umwelt.fivsevn.com) 及其 Tick 游戏相同的 **Fusion Pixel 12px Monospaced 简体中文**字体。字体随站点本地托管，按实际文案裁剪约 40 KB；预加载、`font-display: block`，字体准备好后显示首屏。加载失败时 2.5 秒后保留可玩性。来源：[Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font)，许可证见 `assets/fonts/LICENSE-OFL.txt`（SIL OFL 1.1）。

场景、人物、物件为本项目 canvas / CSS 绘制。世界地图陆地数据来自 [Natural Earth](https://github.com/nvkelso/natural-earth-vector)，属于公共领域。

小游戏使用可持久化的前台经过时间，切后台或打开资料时暂停；尊重 reduced-motion。音效默认关闭，瀑布场景可手动开启。场景日期为叙事重排，档案保留原始相对行程，不将旧价格和入境经历表述为当前建议。
