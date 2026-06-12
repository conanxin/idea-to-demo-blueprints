# 验收清单：多 Agent 项目管理面板 Demo

## 功能验收

- [x] Demo 页面可打开（任何浏览器直接打开 `app/index.html`）
- [x] 展示不少于 5 个项目（实际展示 6 个）
- [x] 每个项目都包含完整字段（name / agent / machine / phase / status / risk / commit / report / blocker / next action）
- [x] 顶部统计卡片显示 5 项（Total / Active / Blocked / Done / High Risk）
- [x] 6 个筛选按钮可点击并切换显示
- [x] JSON 数据合法
- [x] 不依赖后端
- [x] 不依赖外部 CDN
- [x] 不使用真实 token / secret / 私密路径
- [x] 移动端可读（响应式布局）

## 数据验收

- [x] data.json 是合法 JSON
- [x] 6 个项目：1 active + 1 blocked + 2 active + 1 needs-review + 1 done = 6 ✓
- [x] 风险等级分布：4 low + 1 medium + 1 high = 6 ✓
- [x] 每个项目都有 latest_commit 或为 null
- [x] 每个项目都有 next_action

## 样式验收

- [x] Notion 风格：白底、圆角、低饱和度
- [x] 状态标签颜色：active 绿 / blocked 红 / done 紫 / needs-review 黄
- [x] 风险标签颜色：low 绿 / medium 黄 / high 红
- [x] 卡片布局清晰，10 个字段易读
- [x] 阻塞事项标红高亮
- [x] 下一步动作标蓝高亮

## 交互验收

- [x] 点击 All 按钮：显示全部 6 个项目
- [x] 点击 Active：只显示 status=active 的项目
- [x] 点击 Blocked：只显示 1 个 blocked 项目
- [x] 点击 Done：只显示 1 个 done 项目
- [x] 点击 Needs Review：只显示 1 个 needs-review 项目
- [x] 点击 High Risk：只显示 1 个 high risk 项目

## 复现验收

- [x] Demo Pack 完整（README + inputs + prompts + outputs + app + validation）
- [x] README.md 包含复现步骤
- [x] prompts/ 包含完整 Prompt
- [x] outputs/ 包含 Brief、数据模型、任务计划、笔记
- [x] validation/ 包含验收清单

## 发布验收

- [x] Demo 发布到 GitHub Pages
- [x] URL：`https://conanxin.github.io/idea-to-demo-blueprints/demos/multi-agent-project-dashboard/`
- [x] HTTP 200 可访问

## Demo 限制说明

- [x] 页面显著位置标注"Demo 使用静态模拟数据"
- [x] 数据来源说明
- [x] 复现步骤说明
- [x] 本 Demo 限制说明
- [x] 后续扩展方向

---

**验收结果：PASS**

**验收日期：** 2026-06-13
**验收人：** AI Demo Builder（模拟）

---

*Acceptance checklist for Multi-Agent Project Dashboard Demo. Phase: IDB-3.*