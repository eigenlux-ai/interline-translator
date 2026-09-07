# Chrome Web Store 发布素材

Interline · 行间。四种语言各含 5 张实拍截图、两种推广图、短简介和完整介绍。所有素材已替换为当前源码构建的真实扩展界面；没有重画插件按钮、捏造服务商连接状态或植入翻译结果。

## 直接用于商店

| 目录 | 商店语言 |
| --- | --- |
| `global/` | English（默认/国际素材） |
| `zh_CN/` | 简体中文 |
| `ja/` | 日本語 |
| `ko/` | 한국어 |

每个目录包含：

- `summary.txt`：短简介，已同步到对应 `public/_locales/*/messages.json`，均不超过 132 字符。商店短简介随新版本扩展包里的 manifest 更新。
- `listing.txt`：可直接复制的完整介绍，含完整 GitHub 地址、功能需求 / Bug 的 Issues 入口、PRs welcome，以及 MIT 许可、第三方服务费用和数据去向说明。
- `screenshot-1-bilingual.png`：整页双语对照，真实逐段译文与悬浮入口。
- `screenshot-2-selection.png`：选中句子后打开真实翻译卡片。
- `screenshot-3-settings.png`：真实引擎设置，内置免费引擎与可添加的服务商。
- `screenshot-4-input-translation.png`：实际按三次空格后的输入框译文和撤销入口；右侧为示例网页展示的原始草稿。
- `screenshot-5-dark-mode.png`：真实深色设置与翻译风格选项。
- `promo-small.png`：440 × 280 品牌推广图。
- `promo-marquee.png`：1400 × 560 可选横幅推广图。

截图按编号顺序上传，每个语言 5 张；尺寸为 1280 × 800，RGB PNG，无透明通道。推广图分别上传到 small / marquee 字段，不占截图名额。[Chrome 官方图片要求](https://developer.chrome.com/docs/webstore/images)。

商店相关链接：

- 项目主页：https://github.com/eigenlux-ai/interline-translator
- 支持与新功能需求：https://github.com/eigenlux-ai/interline-translator/issues
- 贡献代码：https://github.com/eigenlux-ai/interline-translator/pulls
- 隐私政策：https://github.com/eigenlux-ai/interline-translator/blob/main/PRIVACY.md

GitHub Release 中的扩展 ZIP 与本目录的商店素材需要分别上传到 Chrome Web Store 后台；发布 GitHub Release 不会自动更新商店。提交商店审核前，请核对以上链接和公开隐私政策内容。

## 截图来源与真实性

`scripts/store/fixtures.mjs` 提供原创、无账号的本地示例文章和输入框。英文素材使用法文原文译入英语；其他三套使用英文原文译入对应语言。输入框演示均把本地语言草稿译成英语。

界面来自 `.output/chrome-mv3` 的生产构建，页面翻译、选区翻译、输入翻译均调用内置 Google Translate 免费引擎。脚本没有替换网络响应，没有注入伪造译文，没有使用个人 API Key。网络服务的可用性和具体措辞可能随时间变化；服务不可用时生成会失败，不会用假结果补图。

实际界面以 1120 × 600、deviceScaleFactor=1 截取，等尺寸放进 1280 × 800 的商店画布。四周的标题、开源标识和仓库地址是宣传层，不属于插件 UI。推广横幅将原始截图等比例缩小，不拉伸。图标来自 `public/icon/128.png`。

`capture-manifest.json` 记录浏览器、版本、原始截图 SHA-256 和视口信息。原始截图保留在被 Git 忽略的 `.cache/store-capture/raw/`。重新生成后请连同最终 PNG 和 manifest 一起审查。

## 更新素材

需要 Node.js 22+、依赖安装完成、支持加载未打包扩展的 Chrome for Testing，以及能访问内置翻译服务的网络。

```sh
pnpm i18n       # 仅在 messages 改动后需要
pnpm build
pnpm store:assets
pnpm store:check
```

macOS Apple Silicon 会自动找到本机缓存中的 Chrome for Testing；其他环境或自选路径：

```sh
STORE_CHROME_BIN='/absolute/path/to/chrome-for-testing' pnpm store:assets
```

生成器创建独立的临时浏览器 profile，自动识别 Interline 扩展 ID；完成或出错后关闭浏览器并清理该临时 profile。不会连接或修改个人浏览器、个人 API Key 或现有扩展设置。底层 `capture.mjs` 是内部入口，会修改所连接浏览器的扩展演示设置，请始终通过 `pnpm store:assets` 运行。

翻译验证包括：三个段落得到译文、划词卡片出现朗读按钮、输入框实际输出英语、深色设置实际切换。`store:check` 校验 28 张 PNG 的尺寸与颜色格式、4 套短简介与 manifest 一致、源代码 / Issues / PR 链接和 20 条截图来源记录。

## 本次视觉验收

1. 整页翻译：通过。原文与译文相邻，正文完整可读。首图移除会在小视口里溢出的展开控制面板，保留真实悬浮入口。
2. 划词翻译：通过。选区与翻译卡片对应，译文加载完成，复制与朗读入口可见。卡片保持产品的真实尺寸。
3. 引擎设置：通过。只展示实际默认引擎及快捷添加入口，没有虚构已配置密钥、连接成功、延迟或模型状态。修复两处在其他语言下仍显示中文的快捷添加文案。
4. 输入框翻译：通过。实际触发三次空格，展示原始草稿、英文结果和短暂撤销提示；未点击示例提交按钮。
5. 深色设置：通过。通过实际外观控件切换主题，展示翻译风格。设置页较长，底部继续内容可滚动，截图不代表全部设置。

本次是商店素材核对，不是完整的无障碍审计或所有网站兼容性测试；没有验证付费 AI 服务商连接，也没有据此承诺全站兼容。
