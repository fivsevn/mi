# 米的地图 · MI’S MAP

[打开游戏](https://mi.fivsevn.com)

点击世界地图上的非洲，桌面手机亮屏并震动。拿起手机，轻按解锁后直接进入地图 App。手机地图采用简洁的水面、陆地和植被色块；点击可进入的目的地点开始或继续旅行。之后也可从手机桌面的「地图」图标随时打开。尚未解锁的目的地禁用，已到访地点可查看旅行记录。打开手机时保留当前地图或旅行场景背景。

## 本地运行

无需生产依赖、打包或构建，在仓库根目录启动静态服务：

```sh
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173`。引擎测试需要 Node.js；浏览器检查另需 Playwright 及对应浏览器，命令与适用范围见[验证说明](docs/verification.md)。

## 开发文档

- [项目结构与维护约定](docs/development.md)：模块职责、地图数据、字体、存档与发布。
- [手机视觉与交互约定](docs/phone-design.md)：当前保留的外观、入口、占位功能和响应式行为。
- [验证说明](docs/verification.md)：当前检查入口、手动复核项目及历史脚本限制。
- [非洲剧情依据与改编边界](docs/africa-story-sources.md)：旅行资料、地理背景和原创对白的边界。

## 素材与许可

视觉由 Canvas / CSS 代码绘制，仓库不包含游戏图片、SVG 或贴图，不依赖外部图片或地图服务。字体本地托管，采用 Fusion Pixel 12px Monospaced 简体中文裁剪版；许可见 [SIL OFL 1.1](assets/fonts/LICENSE-OFL.txt)。地图地理数据来自公共领域 Natural Earth，具体来源和重建方式见开发文档。
