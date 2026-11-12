# Chrome Web Store 发布素材

Interline · 行间 **1.1.0**，2026-11-12 通过 **Ego Lite** 重新实拍。中、英、日、韩四套各含 5 张功能截图、2 张推广图及商店文案。

[查看四语言总览](./preview.png)

## 上传文件

| 目录 | 商店语言 |
| --- | --- |
| `global/` | English（默认/国际素材） |
| `zh_CN/` | 简体中文 |
| `ja/` | 日本語 |
| `ko/` | 한국어 |

每个目录按以下顺序上传五张截图：

1. `screenshot-1-bilingual.png`：原创文章的真实逐段双语译文。
2. `screenshot-2-selection.png`：选中一句后打开真实划词卡片，保留复制与朗读入口。
3. `screenshot-3-settings.png`：通用设置中的阅读外观，展示真实样式预览和导航。
4. `screenshot-4-input-translation.png`：连按三次空格后的真实英文结果与撤销入口，右侧保留示例原始草稿。
5. `screenshot-5-subtitles.png`：YouTube 全屏播放器中的真实双语字幕和 CC／设置按钮。

五张截图均为 **1280 × 800、RGB PNG、无透明通道**。另有：

- `promo-small.png`：440 × 280 品牌推广图。
- `promo-marquee.png`：1400 × 560 横幅，以等比例缩小的真实双语阅读截图展示产品。
- `summary.txt`：与对应 manifest locale 一致的短简介。
- `listing.txt`：完整商店介绍，包含 1.1.0 字幕功能、开源许可、服务费用和数据处理说明。

`preview.png` 是审阅总览，不是商店上传截图。推广图分别上传到 small／marquee 字段，不占五张截图名额。扩展 ZIP 与这些素材需分别提交到商店后台。

## 画面来源与验证

- 扩展：当前源码的 Chrome 生产构建，版本 1.1.0。
- 浏览器：Ego Lite；原始界面视口 1120 × 600、deviceScaleFactor=1。
- 原创文章与输入框：`scripts/store/fixtures.mjs`，仅在本机提供。英文读图为法语译入英语，其他三套为英语译入对应语言；输入翻译均译入英语。
- 字幕示例：[Tim Urban / TED — Inside the Mind of a Master Procrastinator](https://www.youtube.com/watch?v=arj7oStGLkU)，暂停在约 00:38。英文素材展示英语／法语字幕，其他三套展示英语／对应语言字幕。视频画面属于原发布者；这里只展示扩展在真实播放器上的使用，不表示 TED 或 YouTube 为产品背书。
- 翻译均由内置 Google Translate 免费引擎实际返回；没有替换网络响应、注入伪造译文或重画产品控件。字幕使用机器翻译，未以人工字幕替代演示。
- 字幕字号 24px、距底部 18%，均通过实际配置设置，避免与视频内文字重叠。
- 临时语言、外观、翻译设置在拍摄后恢复；个人服务商凭据未导出、未用于演示。
- 清除了本次任务页面上无关模板扩展的演示浮层。产品截图本身未做修图；宣传画布上的标题、版本标识、边框和阴影在截图外另行排版。

`capture-manifest.json` 记录每张原始截图的 SHA-256、最终图片 SHA-256、来源 URL 和版本。原始文件保存在被 Git 忽略的 `.cache/store-capture/raw/`。审阅时检查实际图片，尺寸检查不代替视觉验收。

## 更新这套素材（Ego Lite）

先读本机浏览器自动化规则和 `ego-browser skill`。整个拍摄使用同一个 TaskSpace，不使用或关闭用户已有标签页。

```sh
pnpm build
node scripts/store/ego-server.mjs
```

服务器仅监听 `127.0.0.1:9341`，不启动其他浏览器。通过 Ego Lite：

1. 加载或重新加载生产扩展，记录需要临时修改的非凭据配置，以便恢复；不要导出完整配置或个人 API keys。
2. 使用内置免费引擎，依次切换 `global / zh_CN / ja / ko`。页面样例地址为 `/?locale=global`，输入样例追加 `&mode=input`。
3. 在 1120 × 600 视口操作真实控件。等待译文完成、字体加载和动画结束，再保存为 `.cache/store-capture/raw/<locale>-<screenshot-name>.png`。设置图滚动到阅读外观；字幕图进入真实 YouTube 全屏并等待两行字幕。
4. 保留来源记录。在同一 TaskSpace 的宣传画布页面调用下列函数合成四语言素材：

```js
const { composeStoreAssets } = await import('/absolute/repo/scripts/store/compose-ego.mjs');
await composeStoreAssets(page, '/absolute/repo');
```

`copy.mjs` 保存四语言宣传文案，`artwork.mjs` 保存画布设计。合成函数只移除宣传画布页上的额外扩展浮层，不修改图片内的产品 UI。

5. 更新来源 manifest 和总览，检查长标题、边缘裁切、字幕位置及小尺寸推广图。恢复临时配置，结束 TaskSpace，关闭本地服务器。
6. 运行 `pnpm store:check`，然后将四个语言目录连同 README 和来源 manifest 打包。

原有 `pnpm store:assets` 是旧版 Chrome for Testing 全自动流程，会生成旧的引擎／深色设置组合；**不要用它覆盖本次 1.1.0 Ego Lite 素材**。

## 商店链接

- 项目：https://github.com/eigenlux-ai/interline-translator
- 支持与需求：https://github.com/eigenlux-ai/interline-translator/issues
- 贡献：https://github.com/eigenlux-ai/interline-translator/pulls
- 隐私：https://github.com/eigenlux-ai/interline-translator/blob/main/PRIVACY.md

本次验收覆盖四语言排版与上述真实演示流程，不代表所有网站、付费服务商或浏览器的兼容性验收。
