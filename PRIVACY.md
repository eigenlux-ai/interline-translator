# Privacy Policy for Interline

**Last updated:** August 24, 2026

**Interline · 行间** ("Interline", "we", "our") is an open-source browser extension designed to provide in-place bilingual reading and translation. We are committed to protecting your privacy. This Privacy Policy explains our data practices.

---

## 1. Zero Data Collection & Zero Telemetry

- **No User Accounts:** Interline does not require user registration, email addresses, names, or any personal identification.
- **No Telemetry or Tracking:** We do not collect, monitor, track, or analyze your browsing activity, mouse clicks, keystrokes, or page visits.
- **No Intermediary Servers:** We do not operate any central servers or proxy databases that process or store your data.

---

## 2. How Website Content is Processed

- **Translation Requests:** When you translate a page, select text, or use in-input translation, the relevant text segments are extracted locally in your browser.
- **Direct Provider Connection:** Text is sent directly from your browser to your configured translation provider (e.g., OpenAI, Anthropic, Google Gemini, OpenRouter, or a local Ollama instance) via encrypted HTTPS connections (or local loopback for self-hosted models).
- **No Third-Party Reselling:** Your content is never sold, shared, or used for advertising, lending, or any secondary purposes.

---

## 3. Local Credential Storage

- **API Keys:** API keys and custom configuration settings are stored exclusively in your local browser storage (`chrome.storage.local`).
- **Security:** API keys are never logged and leave your browser only as the `Authorization` header in direct API calls to your chosen endpoints.

---

## 4. Permissions Used

- `storage`: Used solely to persist your translation settings, display styles, and local API keys.
- `contextMenus`: Used solely to provide right-click options for page and selection translation.
- `alarms`: Used solely to schedule local IndexedDB cache cleanup (TTL expiration).
- `Host Permissions` (`<all_urls>`): Required to read text on user-visited web pages and inject translations alongside original paragraphs.

---

## 5. Open Source & Contact

Interline is free and open-source software under the MIT License. You can inspect the entire source code to verify our privacy and security guarantees:

- **Source Code:** [https://github.com](https://github.com)
- **Contact & Feedback:** Please submit an Issue on our GitHub repository.

---

# 隐私权政策（中文）

**更新日期：** 2026年8月24日

**Interline（行间）** 是一个开源的浏览器双语阅读与翻译扩展。我们尊重并严格保护您的个人隐私。本隐私权政策说明我们的数据处理方式：

### 1. 零数据收集与零遥测
- **无需账号**：不要求注册账号，不收集姓名、邮箱或任何身份标识信息。
- **无埋点跟踪**：不收集或监控您的浏览历史、点击行为、滚动习惯或按键记录。
- **无自建中转服务器**：本项目不运营任何用于收集或缓存用户数据的中心化服务器。

### 2. 网站内容的调用方式
- 网页内容仅在您触发翻译时在本地提取，并直接从您的浏览器通过加密网络发送至您配置的 AI 翻译端点（如 OpenAI、Anthropic、Google Gemini、OpenRouter 或本地 Ollama）。
- 文本数据仅用于生成译文，绝不用于广告营销、数据转售或任何非翻译用途。

### 3. 本地凭据存储
- 您配置的 API Key 和个性化设置仅保存在本地浏览器存储（`chrome.storage.local`）中，绝不上传到任何第三方平台。

### 4. 权限使用说明
- `storage`：用于在本地保存设置偏好与 API Key。
- `contextMenus`：用于在右键菜单中提供快捷翻译入口。
- `alarms`：用于定时清理本地过期缓存。
- `Host Permissions`：用于在用户访问的网页中就地插入双语对照译文。
