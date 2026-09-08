# 行间官网

独立的中英文静态官网，中文位于根目录，英文位于 `en/`。首次访问按浏览器语言偏好选择语言，手动选择后优先使用保存的选择。使用现有品牌图标和真实商店截图，不依赖框架、第三方字体、分析服务或扩展运行时。构建只需要 Node.js 22+，无需安装依赖。

## 语言选择

- 优先级：手动切换链接中的 `?lang=zh` / `?lang=en` → 已保存的手动选择 → 浏览器语言偏好列表 → 英语。
- 按浏览器偏好顺序匹配首个支持的语言。`zh`（包括 `zh-CN`、`zh-TW`、`zh-HK`）显示现有简体中文页面；`en` 及其地区变体显示英语。全部不支持时回退到英语。
- 手动选择保存在本站路径对应的 localStorage 中，不发送到服务器。清除网站数据后恢复浏览器偏好。自动检测结果不会写入保存的手动选择。
- 自动跳转适用于两个语言入口，保留查询参数和页面锚点，兼容 GitHub Pages 项目子路径。手动切换通过显式语言参数覆盖已有选择，即使禁用存储也能切换，但无法跨访问记忆。
- 禁用 JavaScript 时不自动选择或记忆，仍可通过右上角链接访问两个完整的静态页面。

## 本地预览

在仓库根目录运行：

```sh
node website/build.mjs
node website/preview.mjs
```

也可使用 `pnpm site:build` 和 `pnpm site:preview`。打开终端显示的 `http://127.0.0.1:4173`。如端口被占用，可设置 `SITE_PORT=4174`。修改源文件后重新构建并刷新页面。

## GitHub Pages 部署

1. 将官网文件及 `.github/workflows/pages.yml` 提交并推送到 `main`。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开 **Actions → Deploy website to GitHub Pages → Run workflow**，选择 `main` 并运行。之后相关文件推送到 `main` 会自动重新部署。PR 只构建，不部署。
4. 工作流成功后，在部署任务或 Settings → Pages 中打开实际网址。默认项目地址应为 `https://eigenlux-ai.github.io/interline-translator/`，英文页为其下的 `en/`。

如组织或仓库对 GitHub Actions、Pages 或 `github-pages` 环境设有保护规则，需要按仓库现有要求完成配置或审核。

构建产物为 `website/dist/`，已被 Git 忽略。工作流仅上传该目录，不会公开仓库中的配置或扩展构建文件。相对资源路径同时支持 GitHub Pages 项目子路径和自定义域名；语言切换也不依赖域名或仓库名。若未来配置自定义域名，请同步检查安装链接、仓库链接和站点元数据。

## 内容维护

- `content.mjs`：中文与英文文案。
- `build.mjs`：页面模板与静态资源复制。
- `style.css`：响应式样式。
- `site.js`：截图标签切换，支持方向键、Home、End、Enter 和空格；禁用 JavaScript 时仍显示全部内容。
- `language.js`：页面渲染前选择语言、恢复手动偏好，并处理语言切换链接。
- `../assets/store/{zh_CN,global}/`：官网复用的三张真实截图。通过原有商店素材流程更新，重新构建官网即可同步。

FAQ 使用原生 `details`，无需 JavaScript。官网不执行翻译、不收集 API Key，安装按钮直接链接 Chrome 应用商店。部署使用 GitHub 官方 Pages Actions，参见[自定义工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。
