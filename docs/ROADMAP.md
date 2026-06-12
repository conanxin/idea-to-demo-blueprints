# Roadmap

> 项目未来发展方向。所有计划都不是承诺，会根据社区反馈和实际进展调整。

---

## Current baseline (v0.1.0-alpha)

当前项目已经具备：

- 3 个 demo-ready Blueprint
- Demo Pack 标准已建立（inputs / prompts / outputs / app / validation）
- 完整的阶段报告体系（IDB-1, 1A, 2R, 3, 3A）
- GitHub Pages 可访问（首页 + 3 方案页 + 3 Demo 页）
- 数据索引已同步（3 个 blueprints.json MD5 一致）
- README + 写作指南 + 模板完整
- v0.1.0-alpha tag 已发布

---

## Near-term: v0.1.x

短期目标（v0.1.0 → v0.1.x），重点是**打磨现有 3 个 Blueprint + 增加新案例**。

### v0.1.1
- [ ] 补充所有 Demo 截图（homepage + 3 个 Demo 页）
- [ ] 移动端显示优化
- [ ] 增加更多真实案例（不是模拟数据）

### v0.1.2
- [ ] 改进 Demo Pack 模板（增加测试用例、错误处理）
- [ ] 增加轻量验证脚本（JSON 合法性、链接可访问性）
- [ ] 完善文档导航

### v0.1.3
- [ ] 增加第 4 个 demo-ready Blueprint
- [ ] 增加 CONTRIBUTING 实战示例
- [ ] 改进 README 的"5 分钟理解"流程

### v0.1.x 整体目标
- 至少 5 个 demo-ready Blueprint
- 全部 Demo 都有截图
- 验证脚本集成到 CI

---

## Mid-term: v0.2.x

中期目标，**从静态方案库升级到半自动方案库**。

### v0.2.0 — 数据解析
- [ ] 自动解析 `reports/` 目录生成 Dashboard data.json
- [ ] 真实 GitHub API 集成（替换静态 commit）
- [ ] 历史快照（每日保存 data.json）

### v0.2.1 — 自动构建
- [ ] 自动生成 Blueprint index
- [ ] 自动生成每个 Blueprint 的 `data/blueprints.json` 条目
- [ ] Demo Pack 校验脚本（检查目录结构完整性）

### v0.2.2 — 协作
- [ ] 增加 Issue 模板（Blueprint proposal / Demo bug / Documentation）
- [ ] 增加 PR 模板（新增 Blueprint checklist）
- [ ] 第一个外部贡献者案例

### v0.2.x 整体目标
- 半自动内容生成（不需要人工同步数据）
- 第一个外部贡献
- CI/CD 集成

---

## Longer-term possibilities

长期可能性，**未来方向探索**。

### 自动化方向
- AI 自动从聊天记录提取新想法 → 转化为 Blueprint 草稿
- AI 自动构建 Demo Pack（基于模板 + 输入材料）
- AI 自动验证 Demo 质量（运行 Demo + 检查截图 + 验证链接）

### 生态方向
- Telegram bot 集成（自动推送 Demo 状态）
- 第三方 Blueprint 仓库（其他人的贡献）
- Demo Pack 商店（可下载的预制 Pack）

### 工具方向
- 桌面 GUI（可视化 Blueprint 管理）
- VS Code 插件（直接在 IDE 中浏览 Demo Pack）
- CLI 工具（命令行创建/验证/部署 Blueprint）

---

## Non-goals

**明确不做的事情：**

- ❌ 不做后端服务（保持纯静态）
- ❌ 不做用户登录和权限系统
- ❌ 不做复杂 CMS / 数据库
- ❌ 不重构成 Next.js / React 等重型框架
- ❌ 不强制所有人使用同一种 Agent（OpenClaw、Codex、Claude Code 都可以）
- ❌ 不做付费内容（保持 MIT 开源）

---

## Design principles

**项目设计的核心原则：**

### 1. Static-first
纯静态站点优先，避免任何不必要的依赖。任何人都可以 fork 后立即修改和部署。

### 2. Demo-not-deck
每个想法必须配真实可运行的 Demo，不接受"截图就是证据"。

### 3. Reproducibility-first
复现门槛要低：别人看到一个 Blueprint 后，应该能在 1-2 小时内照着复现。

### 4. Honest limitations
每个 Demo 都要标注限制（模拟数据、静态页面、不连接 API），不假装完美。

### 5. Small but complete
新 Blueprint 宁可少而精，不要多而半成品。每个 Blueprint 都必须完整闭环。

### 6. 文件即文档
所有文档都是 Markdown 文件，所有数据都是 JSON 文件。文件系统是唯一的真相。

---

*最后更新：2026-06-13*