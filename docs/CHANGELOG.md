# Changelog

所有项目的变更都会记录在此。

---

## [v0.1.0-alpha] - 2026-06-13

> 🎉 首次 alpha 发布。3 个 demo-ready Blueprint，Demo Pack 标准已建立。

### Added（新增）

- **3 个 demo-ready Blueprint：**
  - 项目记忆型会议助手（Project Memory Meeting Assistant）
  - 客户会议触发的自主循环构建（Customer Meeting Triggered Autonomous Build）
  - 多 Agent 项目管理面板（Multi-Agent Project Dashboard）
- **Demo Pack 标准：** 每个 Blueprint 必须包含 inputs/prompts/outputs/app/validation 五部分
- **GitHub Pages 站点：** 首页 + 3 方案页 + 3 Demo 页，全部 HTTP 200
- **数据驱动架构：** blueprints.json 驱动首页卡片渲染
- **完整文档体系：** README、Blueprint Template、Writing Guide、ROADMAP、CONTRIBUTING、CHANGELOG

### Fixed（修复）

- IDB-1A: GitHub Pages 404 — 添加 `.nojekyll`，修正 docs/index.html 链接路径

### Verified（验证）

- IDB-3A: 3 个 blueprints.json MD5 一致（2d46b4dad55cb2a3f70f21d86c0c9fc3）

---

## [Unreleased] - 计划中

### v0.1.1 (Next)
- 补充所有 Demo 截图
- 移动端显示优化
- 增加更多真实案例（不是模拟数据）

### v0.2.0
- 自动解析 reports/ 目录
- 真实 GitHub API 集成
- 历史快照

详见 [ROADMAP.md](./ROADMAP.md)。

---

## 阶段标签历史

| Phase | 内容 | Date | Commit |
|-------|------|------|--------|
| IDB-1 | 创建项目 + 第一组方案 | 2026-06-12 | 14c1a32 |
| IDB-1A | 修复 GitHub Pages | 2026-06-12 | 9784a3e |
| IDB-2R | 升级为可复现 Demo 蓝图库 | 2026-06-12 | 6a89bef |
| IDB-3 | 新增多 Agent 项目管理面板 | 2026-06-13 | 3313593 |
| IDB-3A | Blueprint 数据同步验证 | 2026-06-13 | 6b4fd63 |
| IDB-4A | Blueprint Catalog Polish | 2026-06-13 | [TBD] |

---

*最后更新：2026-06-13*