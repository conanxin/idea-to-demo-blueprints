# 背景

## 当前场景

用户同时使用本地和云端多个 agent 推进项目，例如 OpenClaw、Hermes、Codex、Claude Code 等。项目状态分散在：

- **GitHub commit** — 每个项目的提交历史
- **阶段报告** — `reports/<project>/PHASE_*.md` 文件
- **Telegram 回传** — agent 通过 Telegram 发送的进度消息
- **Pages URL** — 已部署项目的在线地址
- **运行日志** — 各机器上的 agent 运行日志

## 核心问题

当多个 agent 并行推进多个项目时，项目负责人面临的痛点：

1. **状态分散** — 信息散落在不同来源，需要手动汇总
2. **优先级难判断** — 不知道哪个项目 blocked、哪个 ready、哪个需要人工确认
3. **报告埋没** — 长报告中的关键结论（风险、阻塞、下一步）容易被忽略
4. **Agent 不一致** — 不同 agent 报告格式不同，难以统一阅读
5. **回顾困难** — 缺少历史快照，无法复盘项目演化

## 现有方案的限制

- 单一项目状态工具（如 GitHub Projects）无法跨项目跨机器聚合
- 通用 Dashboard 工具（如 Grafana）配置成本高，不适合 agent 场景
- 手动汇总报告耗时且容易遗漏关键信息