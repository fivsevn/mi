# 米的地图 · MI’S MAP

[打开游戏](https://mi.fivsevn.com)

桌上只有地图和手机。点击黄色非洲陆地开始或继续旅行。游戏固定在 440px 以内的竖屏舞台，页面不滚动；选项、行李列表和手机 App 在各自区域内滚动。

## 手机和记录

手机从锁屏进入 App 桌面：聊天、记事本、行李、设置。场景下方左侧的像素手机打开同一部手机，右侧迷你地图短暂显示当前地点，不提供路线预览。

记事本只显示当前周目实际选择产生的结果。结束后增加本周目的归来笔记；重新开始后记事本和可见聊天重新从空白开始。不会回退到 profile 历史记录，也不展示未发生的结局、物品用途或旅游资料。

原有浏览器存档和 mi-v01 保留，旧节点索引按 ID 迁移。旧日记与记录书签统一进入手机记事本。浏览器拒绝存储时可继续游戏，并提示无法存档。

## 实现和验证

- js/app.js：固定场景、手机 App、当前周目笔记、小游戏界面。
- js/engine.js：行李、选择、状态与存档；visibleNotes 限定已发生内容。
- js/art.js：现有米的人物画法、场景和地图；非洲陆地点击与已到访地点标记。
- css/pocket.css：固定视口、内部滚动、复古按钮和手机 App。
- data/routes/africa-stories.js：可玩事件及最小地点坐标。没有说明性旅行档案。

无需生产依赖或构建：

```sh
python3 -m http.server 4173
node --test tests/engine.test.js
PLAYWRIGHT_MODULE=/path/to/playwright/index.mjs CHROME_PATH=/path/to/chrome node tests/browser.mjs
```

浏览器回归在 Chromium 和 WebKit 完整走过 48 个事件，包括小游戏、物品变化、手机返回、当前周目隔离、旧书签处理、320×568 到 1440×1000 的固定屏幕，以及不可用存储。截图在 test-results/。

GitHub Pages 使用 main 根目录和 CNAME。发布时更新完整模块图和字体的版本标记，防止混用旧缓存。

## 字体与素材

Fusion Pixel 12px Monospaced 简体中文字体本地托管，按文案裁剪，预加载并等待准备完成后显示首屏。字体许可见 assets/fonts/LICENSE-OFL.txt（SIL OFL 1.1）。脚本 scripts/subset-font.py 接受完整字体路径，需要 fonttools 和 brotli。

Canvas / CSS 场景为本项目绘制。世界地图陆地数据来自公共领域 Natural Earth。动画尊重 reduced-motion；小游戏切到手机、资料弹窗或后台时暂停。
