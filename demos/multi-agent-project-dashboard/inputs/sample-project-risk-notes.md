# 模拟项目风险记录

> 注意：以下为模拟风险记录，用于演示。请勿与真实风险混淆。

## 通用风险

### 1. Pages 发布风险
- **描述：** GitHub Pages 首次部署可能延迟 1-3 分钟，导致外部访问 404
- **影响：** 中
- **应对措施：** 在报告中标明部署时间窗口，提供本地预览方式作为 fallback

### 2. 数据同步风险
- **描述：** 多个 agent 报告格式不统一，标准化 JSON 时可能丢失信息
- **影响：** 中
- **应对措施：** 在 Agent Prompt 中明确数据格式要求，标准化前人工审查

### 3. 报告过长导致信息丢失
- **描述：** 长报告中的关键结论（风险、阻塞、下一步）容易被忽略
- **影响：** 高
- **应对措施：** Dashboard 卡片突出关键字段：status / risk / blocker / next action

### 4. 多 Agent 状态不一致
- **描述：** 不同 agent 报告相同项目时可能给出不同状态
- **影响：** 高
- **应对措施：** 设置权威源（如 GitHub Pages URL 是否 200），其他源仅作参考

### 5. 人工确认缺失
- **描述：** 长时间无人工确认可能导致 agent 推进错误方向
- **影响：** 高
- **应对措施：** Dashboard 突出"Needs Review"项目，每日定时提醒

## 项目特定风险

### idea-to-demo-blueprints
- 当前无风险，处于 IDB-2R 完成状态

### medium-archive-astro
- **blocked：** 设计师休假，UI 设计稿延迟（high）

### conan-vps-control-tower
- 当前无风险，处于基础设施搭建完成

### claimlens
- **high：** AI 模型选择待用户确认，3 天未回复

### artvee-library
- 当前无风险，按计划进行

### booktrans-desk
- 已发布，建议监控首周用户反馈