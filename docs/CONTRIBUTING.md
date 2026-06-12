# Contributing to Idea-to-Demo Blueprints

> 感谢你考虑为这个项目做贡献。本项目欢迎任何形式的贡献：bug 报告、文档改进、新 Blueprint、Demo 优化。

---

## 如何贡献

### 报告问题
- 找到 GitHub Issues
- 描述：问题、Demo URL、复现步骤、预期 vs 实际
- 如果是 Demo 不工作，请说明浏览器和访问时间

### 改进文档
- 直接 fork → 修改 → 提 PR
- 文档错误、错别字、内容补充都可以

### 新增 Blueprint
见下方"如何新增一个 Blueprint"。

### 优化现有 Demo
- UI 改进
- 增加交互功能
- 修复链接
- 移动端优化

---

## 如何新增一个 Blueprint

### 第一步：确认想法适合

用下面 6 条标准判断：

- [ ] 有真实问题（不是想象中的问题）
- [ ] 有明确使用场景（有人真的会遇到这个场景）
- [ ] 能做出最小 Demo（1-3 天能验证）
- [ ] 能被别人复现（不需要特殊权限）
- [ ] 能形成验收结果（有明确的"做成功了"标准）
- [ ] 能沉淀为项目资产（执行后产生的文档/代码/流程可复用）

如果任何一条不满足，建议先在 Issue 中讨论。

### 第二步：使用模板

1. 复制 `docs/blueprint-template.md` 作为起点
2. 填写所有必填章节
3. **不要删除任何章节**（不适用可以填 N/A）

### 第三步：构建 Demo

**这是这个项目最核心的部分**。你的 Demo 必须：

- 是真实可运行的（不是截图、不是描述）
- 包含完整的输入材料
- 包含可复制的 Prompt
- 包含生成的输出
- 包含验收清单

### 第四步：Demo Pack 结构

按照标准结构创建 `demos/<slug>/`：

```
demos/<slug>/
├── README.md                    # 复现说明
├── inputs/                      # 输入材料
├── prompts/build-prompt.md      # 关键 Prompt
├── outputs/                     # 生成结果
├── app/index.html               # 可运行 Demo
└── validation/acceptance-checklist.md
```

### 第五步：注册元数据

更新 `data/blueprints.json`，新增一个条目：

```json
{
  "id": "your-slug",
  "title": "你的方案标题",
  "title_en": "Your Blueprint Title",
  "slug": "your-slug",
  "summary": "一句话简介",
  "category": "AI Workflow / 其他",
  "difficulty": "中等",
  "demo_time": "1-2 天",
  "audience": ["目标用户"],
  "tags": ["标签"],
  "status": "demo-ready",
  "page_url": "./blueprints/your-slug.html",
  "demo_url": "./demos/your-slug/",
  "demo_pack_path": "demos/your-slug/",
  "created_phase": "IDB-X",
  "updated_phase": "IDB-X"
}
```

**必须**同步复制到：
- `public/data/blueprints.json`
- `docs/data/blueprints.json`

### 第六步：生成方案页 HTML

基于 Markdown 方案内容生成 HTML 页面，放入：

- `public/blueprints/your-slug.html`
- `docs/blueprints/your-slug.html`

页面必须包含：
- 完整章节
- Demo 链接
- 复现步骤
- 返回首页链接

### 第七步：同步 Demo 到 Pages

```bash
# Demo app
cp demos/your-slug/app/index.html docs/demos/your-slug/index.html
# 如果有 app.js / data.json 等，也同步
cp demos/your-slug/app/data.json docs/demos/your-slug/data.json
```

### 第八步：本地预览

```bash
cd public
python3 -m http.server 8080
```

访问 http://localhost:8080，检查：
- 首页显示新 Blueprint 卡片
- 方案页可打开
- Demo 页可打开且交互正常
- 移动端可读

### 第九步：提交

```bash
git add -A
git commit -m "IDB-X: Add your-blueprint-slug blueprint"
git push origin main
```

### 第十步：生成报告

在 `reports/idea_to_demo_blueprints/PHASE_IDB_X_*.md` 创建报告，包含：

- 执行摘要
- 方案内容摘要
- Demo 摘要
- 新增文件列表
- JSON 检查结果
- Pages URL 检查结果
- commit hash
- 验收结果
- 已知限制

---

## 命名规范

### slug 规则
- 全部小写
- 单词用连字符分隔
- 不超过 5 个单词
- 不包含数字序号（如 `001-`）
- 体现核心概念（如 `project-memory-meeting-assistant`）

### 文件命名
- Markdown：`docs/<slug>.md`
- 方案页 HTML：`public/blueprints/<slug>.html` + `docs/blueprints/<slug>.html`
- Demo Pack：`demos/<slug>/`
- Demo app：`public/demos/<slug>/` + `docs/demos/<slug>/`

---

## 代码风格

- HTML：语义化标签、合理标题层级
- CSS：使用 CSS 变量，保持风格一致
- JS：原生 JS，不引入框架
- Markdown：标题清晰，章节完整
- JSON：保持字段名 snake_case

---

## 提交信息规范

```
<phase>: <简短描述>

例如：
IDB-4: Add new blueprint for xxx
IDB-4-fix: Fix broken link in xxx
IDB-4-docs: Improve README clarity
```

---

## 提交前检查

- [ ] 所有 JSON 是合法格式
- [ ] 所有链接可访问（curl 验证）
- [ ] 没有真实 token / secret / 私密路径
- [ ] Demo Pack 完整（README + inputs + prompts + outputs + app + validation）
- [ ] 方案页包含 Demo 链接
- [ ] 数据 JSON 已同步到 3 个位置
- [ ] 提交信息符合规范
- [ ] 阶段报告已生成

---

## 联系方式

- GitHub Issues: 报告问题或讨论新想法
- Pull Requests: 直接贡献代码或文档

---

*最后更新：2026-06-13*