# Release Notes v0.1.0-alpha

## Release Title

**Idea-to-Demo Blueprints v0.1.0-alpha**

---

## 1. Highlights

这是 alpha 版本，核心目标是证明 **"想法 → 方案 → Demo → 构建过程 → 复现指南 → 验收记录"** 的闭环可行。

本版本包含：

- 3 个 demo-ready Blueprint
- 完整的 Demo Pack 标准
- 7 个 GitHub Pages URL 全部 200
- v0.1.0-alpha Git tag

---

## 2. Included Blueprints

| # | Blueprint | Status |
|---|-----------|--------|
| 1 | 项目记忆型会议助手（Project Memory Meeting Assistant） | `demo-ready` ✅ |
| 2 | 客户会议触发的自主循环构建（Customer Meeting Triggered Autonomous Build） | `demo-ready` ✅ |
| 3 | 多 Agent 项目管理面板（Multi-Agent Project Dashboard） | `demo-ready` ✅ |

---

## 3. Included Demos

| # | Demo | URL |
|---|------|-----|
| 1 | TeamFlow Dashboard 项目会议纪要 | https://conanxin.github.io/idea-to-demo-blueprints/demos/project-memory-meeting-assistant/ |
| 2 | 客户跟进看板原型 | https://conanxin.github.io/idea-to-demo-blueprints/demos/customer-meeting-autonomous-build/ |
| 3 | AgentOps Control Tower | https://conanxin.github.io/idea-to-demo-blueprints/demos/multi-agent-project-dashboard/ |

---

## 4. Demo Pack standard

每个完整 Blueprint 包含：

```
demos/<slug>/
├── README.md                    # 复现说明
├── inputs/                      # 输入材料
├── prompts/build-prompt.md      # 关键 Prompt
├── outputs/                     # 生成结果
├── app/index.html               # 可运行 Demo
└── validation/acceptance-checklist.md
```

**状态规则：**
- `draft` — 只有方案文档，没有 Demo Pack
- `demo-ready` — 有完整 Demo Pack + 可打开 Demo 页面 + 验收记录

---

## 5. Verification Summary

| 检查项 | 结果 |
|--------|------|
| 3 个 blueprints.json MD5 一致 | ✅ |
| 5 个 JSON 文件全部合法 | ✅ |
| 7 个 GitHub Pages URL HTTP 200 | ✅ |
| 3 个 Blueprint + Demo Pack 完整 | ✅ |
| docs/.nojekyll 存在 | ✅ |
| Git status clean | ✅ |
| v0.1.0-alpha tag 已推送 | ✅ |

---

## 6. Known Limitations

1. **截图缺失** — 当前环境无浏览器截图工具，v0.1.1 补充
2. **三目录手动同步** — `data/`、`public/data/`、`docs/data/` 需要手动 cp 同步
3. **移动端未深度优化** — v0.1.1 优化
4. **Dashboard 使用模拟数据** — v0.2.0 接入真实数据
5. **无自动化 CI 校验** — v0.1.2 添加

---

## 7. Recommended Next Steps

- **v0.1.1**：补充截图 + 移动端优化
- **v0.1.2**：改进 Demo Pack 模板 + 添加 CI 校验脚本
- **v0.1.3**：新增第 4 个 demo-ready Blueprint
- **v0.2.0**：自动数据解析 + GitHub API 集成

---

*Released: 2026-06-13*