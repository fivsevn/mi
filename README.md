# 米的地图 · MI’S MAP

[打开米的地图](https://mi.fivsevn.com)

桌上一张折过的世界地图、一部手机、一本日记。点击非洲的标记出发；有没走完的旅程时，回到当前场景。现实旅行资料只作创作背景，页面不展示行程总天数或路线表。

## 游玩与存档

- 原有 Safari、塞舌尔、打包、换装、选择与归来结局保留。尚未去的地方通过“下次再去”的故事过渡，不展示开发说明。
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

回归覆盖三种完整通关、逐阶段刷新、跨周目聊天、换装与行李取舍、手机解锁与发送、日记返回、浏览器历史、320–1440px 布局及不可用存储的降级。截图输出到忽略的 `test-results/`。

## 文件与发布

- `js/app.js`：桌面物件、场景、手机、日记与导航。
- `js/engine.js`：游戏状态与存档；节点顺序未改变，已有进度可继续。
- `js/art.js`、`assets/world-grid.js`：原有像素地图、场景和人物。
- `css/style.css`：游戏基础样式；`css/desk.css`：桌面、手机和纸页样式。
- `data/`：剧情、物品、朋友与结局。路线里的天数是内部数据，不渲染成行程说明。

GitHub Pages 从 `main` 根目录发布。保留 `.nojekyll` 和 `CNAME`（`mi.fivsevn.com`），不改变 DNS 或域名设置。

## 字体与素材

使用与 [Umwelt](https://umwelt.fivsevn.com) 及其 Tick 游戏相同的 **Fusion Pixel 12px Monospaced 简体中文**字体。字体随站点本地托管（约 894 KB），`font-display: swap` 并提供中文系统字体回退。来源：[Fusion Pixel Font](https://github.com/TakWolf/fusion-pixel-font)，许可证见 `assets/fonts/LICENSE-OFL.txt`（SIL OFL 1.1）。

场景、人物、物件为本项目 canvas / CSS 绘制。世界地图陆地数据来自 [Natural Earth](https://github.com/nvkelso/natural-earth-vector)，属于公共领域。
