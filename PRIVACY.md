# Interline privacy policy / 行间隐私说明

**Last updated / 更新日期：2026-09-07**

[English](#english) · [简体中文](#简体中文)

## English

Interline · 行间 is an open-source browser extension for bilingual reading and translation. This policy describes how the extension handles data. It does not replace the policies of translation providers, browser services or GitHub.

### Accounts, analytics and servers

Interline does not require an Interline account. The extension does not include behavioral analytics, advertising trackers or telemetry. The project does not operate a translation relay server or a central database of your browsing or translation activity.

Translation still involves processing page content. With an online engine, the text needed for the feature is sent directly from your browser to the selected provider.

### What is processed and when

| Feature | Data used |
| --- | --- |
| Page translation | Text extracted from the page and the source/target languages. Translation can start through your action or a matching automatic site rule. |
| Selection translation and vocabulary notes | Selected text; AI features can also use the translation, page title and neighboring text to explain context. |
| Input translation | The draft in the supported input/editor when its translation shortcut is triggered, plus the chosen language. |
| AI styles and glossaries | Applicable prompt instructions, matching glossary entries and relevant context are included in AI requests. The page domain is used locally to select applicable rules. |
| Whole-page context (optional, off by default) | Up to the first 8,000 characters of page text, potentially including text not yet scrolled into view, is sent to the AI provider to produce context for subsequent translations. |
| Provider setup | Fetching models or validating an engine contacts the configured endpoint and may send a test request, using credentials when required. |

The built-in key-free engine uses Google's online translation service. Custom engines send requests to the provider or endpoint you select, such as OpenAI, Anthropic, Google Gemini, OpenRouter or a compatible local/cloud service. These recipients can receive request content and ordinary connection information such as your IP address. Their retention, processing and account terms are governed by their own policies.

Interline uses this data to provide the translation features described above. The project does not sell it, use it for advertising or build behavioral profiles from it. Choosing a local endpoint does not establish that every service in your setup is offline; that depends on the endpoint and browser features you use.

### Local storage and backups

- **Settings and credentials:** provider settings, API keys, language preferences, prompts, glossaries and site rules are stored in the extension's local browser storage (`chrome.storage.local`). Visual preferences are stored locally as well. Interline does not use browser sync storage for these settings.
- **Authentication:** keys and configured authentication headers are sent to the selected service when needed to authenticate requests. The authentication format depends on the provider. Keys are not confined to local storage during an authenticated service call.
- **Translation cache:** translated results and cache metadata are stored locally in IndexedDB. Cache keys are hashes of request inputs; API keys are excluded from the key calculation. The background maintenance task is scheduled daily to delete entries older than 30 days and trim the cache to 150,000 entries. Cleanup occurs when that task runs, not necessarily at the exact expiration time.
- **Exports:** exporting settings creates a JSON file **containing API keys**, prompts, glossaries and site rules. Interline does not upload this file. Anyone you share it with may be able to read those values. Importing it stores the configuration on the receiving browser.

### Network and browser features

Custom endpoint URLs require HTTPS except for supported loopback addresses and `.local` hosts, where HTTP is allowed for local setups. HTTP connections are not encrypted by Interline. Use an endpoint you trust.

Read-aloud uses the browser's speech synthesis service; processing depends on the selected browser/system voice. The optional language-detection model is downloaded through Chrome's built-in model capability when requested and available. These browser-managed features have their own availability and data-handling behavior.

### Browser permissions

| Permission | Purpose |
| --- | --- |
| `storage` | Save extension settings and credentials locally. |
| `contextMenus` | Provide page and selection translation actions in the right-click menu. |
| `alarms` | Schedule periodic local translation-cache cleanup. |
| Host access (`<all_urls>`) | Run translation content scripts on supported pages and contact translation services across origins. Browser-restricted pages remain inaccessible to content scripts. |

The extension does not request the separate `tabs` or `scripting` permissions. Its host access is still broad and is used for the page translation features above.

### Your controls

You can change or remove provider credentials, change site rules, turn off optional whole-page context, disable input translation or disable the extension. Restoring default settings resets configuration; it does **not** clear the separate IndexedDB translation cache or delete exported files. Browser developer tools can clear the extension's local storage and IndexedDB. Exported files must be managed separately. Requests already sent to a provider are subject to that provider's retention and deletion procedures.

### Source code and contact

The full source is available under the [MIT license](./LICENSE):

- [Source code](https://github.com/eigenlux-ai/interline-translator)
- [Questions, bugs and feature requests](https://github.com/eigenlux-ai/interline-translator/issues)
- [Contribute improvements — PRs welcome](https://github.com/eigenlux-ai/interline-translator/pulls)

GitHub issues and pull requests are public. Do not post API keys, authorization headers, private page content or configuration backups. Information you voluntarily submit there is handled by GitHub under its policies.

## 简体中文

Interline（行间）是一款开源的浏览器双语阅读与翻译扩展。本文说明扩展如何处理数据，不替代翻译服务商、浏览器服务或 GitHub 自身的政策。

### 账号、分析与服务器

行间无需注册专用账号。扩展不包含行为分析埋点、广告跟踪或遥测；项目不运营翻译中转服务器，也不建立集中保存浏览或翻译活动的数据库。

翻译功能仍需要处理网页内容。使用在线引擎时，功能所需的文本会由浏览器直接发送至所选服务商。

### 处理哪些内容、何时处理

| 功能 | 使用的数据 |
| --- | --- |
| 整页翻译 | 从页面提取的文本、源语言和目标语言。可由主动操作或匹配的自动翻译规则触发。 |
| 划词翻译与词汇释义 | 选中文本；AI 功能还可使用译文、页面标题和相邻文本来理解上下文。 |
| 输入框翻译 | 在受支持的输入框或编辑器中触发翻译快捷操作时的草稿，以及目标语言。 |
| AI 风格与术语表 | 生效的提示词指令、匹配的术语条目与相关上下文会进入 AI 请求。页面域名在本地用于选择规则。 |
| 通读全文（可选，默认关闭） | 将页面前 8,000 个字符发送给 AI 服务商生成后续翻译所用的上下文，包括尚未滚动到的文本。 |
| 引擎设置 | 获取模型列表或验证引擎时会访问配置的端点，可能发送测试请求，并按需使用认证凭据。 |

内置免 Key 引擎使用 Google 在线翻译服务。自定义引擎会访问你选择的服务商或端点，例如 OpenAI、Anthropic、Google Gemini、OpenRouter，以及兼容协议的本地或云端服务。接收方可能获得请求内容和 IP 地址等常规连接信息，其保存、处理与账号条款由各自政策规定。

行间使用这些数据提供上述翻译功能。项目不出售这些数据，不用于广告，也不据此建立行为画像。选择本地端点并不代表整套配置完全离线，仍取决于端点本身和使用的浏览器功能。

### 本地保存与备份

- **设置与凭据：** 服务商配置、API Key、语言偏好、提示词、术语表和站点规则保存在扩展的本地浏览器存储（`chrome.storage.local`），外观偏好也保存在本地。行间不使用浏览器同步存储来保存这些设置。
- **调用认证：** 发起需要认证的请求时，会将所需密钥和配置的认证请求头发送至所选服务。认证格式因服务商而异，不能理解为密钥在调用时也绝不离开设备。
- **译文缓存：** 译文结果与缓存元数据保存在本地 IndexedDB。缓存索引由请求输入计算哈希，不将 API Key 纳入计算。后台维护任务按每天一次安排，清理超过 30 天的条目，并将条目数限制到 150,000；实际清理发生在任务执行时，并非到期瞬间。
- **导出文件：** 配置导出会生成**包含 API Key**、提示词、术语表和站点规则的 JSON 文件。行间不会上传该文件；收到文件的人可能读到这些内容。导入操作会把配置保存到接收方浏览器。

### 网络与浏览器功能

自定义端点默认要求 HTTPS；受支持的回环地址和 `.local` 主机允许 HTTP，以便连接本地服务。行间不会为 HTTP 连接额外加密，请使用你信任的端点。

朗读使用浏览器语音合成服务，数据处理方式取决于所选浏览器或系统语音。可选的语言检测模型在你请求且浏览器支持时，通过 Chrome 内置模型能力下载。这些由浏览器管理的功能有各自的可用性与数据处理方式。

### 浏览器权限

| 权限 | 用途 |
| --- | --- |
| `storage` | 在本地保存扩展设置和凭据。 |
| `contextMenus` | 在右键菜单提供整页与选区翻译入口。 |
| `alarms` | 定期清理本地翻译缓存。 |
| 主机访问权限（`<all_urls>`） | 在支持的页面运行翻译内容脚本，并跨域访问翻译服务。浏览器限制页面仍无法注入内容脚本。 |

扩展不申请单独的 `tabs` 或 `scripting` 权限，但仍具有用于上述网页翻译功能的广泛主机访问权限。

### 你可以如何控制

你可以修改或移除服务商凭据、调整站点规则、关闭可选的通读全文、关闭输入框翻译，或禁用扩展。恢复默认设置仅重置配置，**不会**清空独立的 IndexedDB 译文缓存，也不会删除已导出的文件。可通过浏览器开发者工具清理扩展的本地存储与 IndexedDB，导出文件需另行管理。已经发送给服务商的数据，适用该服务商的保存与删除流程。

### 开源与联系

全部源代码以 [MIT 许可](./LICENSE)公开：

- [完整源代码](https://github.com/eigenlux-ai/interline-translator)
- [问题反馈与新功能需求](https://github.com/eigenlux-ai/interline-translator/issues)
- [参与改进 — PRs welcome](https://github.com/eigenlux-ai/interline-translator/pulls)

GitHub 的 Issues 和 Pull Requests 是公开的，请勿提交 API Key、认证请求头、私密网页内容或配置备份。你主动提交到 GitHub 的信息由 GitHub 按其政策处理。
