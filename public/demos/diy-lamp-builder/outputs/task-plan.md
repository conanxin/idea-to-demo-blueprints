# 任务计划（Task Plan）

> Agent 接到 Build Prompt 后，按这四步完成 Demo。所有产物都在 `app/index.html` 一个页面里。

---

## Step 1: Idea Input（输入区）

| 项目 | 说明 |
|------|------|
| 输入 | 用户在 textarea 写一句话产品想法 |
| 默认 | "北京风格阅读台灯，外壳可定制，适合书桌使用" |
| 输出 | 一段 idea 文本，触发后续三步 |
| 文件 | `app/index.html` 顶部 `<section id="idea-section">` |

实现要点：

- 简单的 `<textarea>` + `<button id="btn-generate">`
- 不做实时校验，按钮触发后跳到 Step 2

## Step 2: AI Analyze（产品架构推理区）

| 项目 | 说明 |
|------|------|
| 输入 | Step 1 的 idea 文本 |
| 输出 | 产品架构 6 字段表 + 固定 ReadingCore-01 标识 |
| 文件 | `app/index.html` 中部 `<section id="analyze-section">` |

实现要点：

- 这一步在 Demo 里**不是真的调用 LLM**，而是用硬编码常量展示"AI 推理后会输出什么"
- 6 字段：Lamp Type / Core Module / Light Type / Brightness Target / Reading Distance / Shell / Interface

## Step 3: Configurator（配置区）

| 项目 | 说明 |
|------|------|
| 输入 | 用户选择 Lamp Type / Shell Style / Color / Engraving |
| 输出 | 右侧 SVG mock 预览随选择实时变化 |
| 文件 | `app/index.html` 下部 `<section id="configurator-section">` |

实现要点：

- Lamp Type：`<select>`，两选项（Reading Lamp / Ambient Lamp）
- Shell Style：`<select>`，四选项
- Color：四个色块按钮（用 CSS 变量切换）
- Engraving：`<input type="text">`
- Core：固定显示 "ReadingCore-01"，禁用编辑
- SVG 预览：用 `<svg>` + `<text>` 组合，根据选择更新 `fill` 和 `<text>` 文本

## Step 4: Manufacturing Plan（制造计划区）

| 项目 | 说明 |
|------|------|
| 输入 | Step 3 的所有配置 + 默认值 |
| 输出 | JSON 实时输出 + 装配步骤列表 |
| 文件 | `app/index.html` 底部 `<section id="manufacturing-section">` |

实现要点：

- JSON 用 `<pre>` 展示，每次配置变化重新渲染
- 装配步骤用 `<ol>` 列出（固化在 JS 里）
- 估算成本和打印时间固化在 JS 里

## 跨步骤约束

1. **零外部依赖** —— 不引 CDN、不引 build、不引 npm
2. **响应式** —— `<meta viewport>` + 媒体查询
3. **可访问性最低要求** —— 按钮、表单可键盘操作
4. **不写入 .gitignore 之外的文件** —— 不生成 BOM.txt 之类的散落物
5. **不打印真实 CAD / 不发起真实支付** —— 永远停留在 mock 阶段

## 完成判定

- [x] 4 区都在 `<section id="...">` 里
- [x] `app/app.js` 没有 console.error
- [x] `app/style.css` 没有未引用样式
- [x] 在 1280×800 和 375×667 两个尺寸下都能看
- [x] 在 Chrome / Firefox 最新版都能打开