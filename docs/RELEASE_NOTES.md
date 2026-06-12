# Release Notes

## v0.1.0-alpha (2026-06-13)

> 🎉 首次 alpha 发布。

---

### ✨ Highlights

- **3 个 demo-ready Blueprint** 全部可在线访问
- **Demo Pack 标准** 正式建立
- **GitHub Pages 站点** 全部 HTTP 200
- **完整文档体系**（README / ROADMAP / CONTRIBUTING / CHANGELOG）

---

### 📦 What's included

#### 方案 #1：项目记忆型会议助手

- **URL：** https://conanxin.github.io/idea-to-demo-blueprints/blueprints/project-memory-meeting-assistant.html
- **Demo：** https://conanxin.github.io/idea-to-demo-blueprints/demos/project-memory-meeting-assistant/
- **核心价值：** 基于项目知识库，AI 不是简单记录"会上说了什么"，而是回答"这场会对项目意味着什么"
- **Demo Pack：** 6 inputs + 1 prompt + 4 outputs + 1 app + 1 validation = 13 文件

#### 方案 #2：客户会议触发的自主循环构建

- **URL：** https://conanxin.github.io/idea-to-demo-blueprints/blueprints/customer-meeting-autonomous-build.html
- **Demo：** https://conanxin.github.io/idea-to-demo-blueprints/demos/customer-meeting-autonomous-build/
- **核心价值：** 客户会议中的自然语言需求，实时转化为可演示 Demo
- **Demo Pack：** 3 inputs + 1 prompt + 4 outputs + 1 app + 1 validation = 10 文件

#### 方案 #3：多 Agent 项目管理面板

- **URL：** https://conanxin.github.io/idea-to-demo-blueprints/blueprints/multi-agent-project-dashboard.html
- **Demo：** https://conanxin.github.io/idea-to-demo-blueprints/demos/multi-agent-project-dashboard/
- **核心价值：** 把分散的报告、commit、消息中的多项目状态，统一汇总到可观察面板
- **Demo Pack：** 5 inputs + 1 prompt + 4 outputs + 3 app + 1 validation = 14 文件

---

### 🛠 Infrastructure

- **GitHub Pages：** `main` 分支 `/docs` 目录
- **本地预览：** `cd public && python3 -m http.server 8080`
- **数据驱动：** 3 个 blueprints.json 同步（MD5 一致）
- **Demo Pack 标准：** inputs/prompts/outputs/app/validation

---

### 📊 Stats

- 3 个 Blueprint
- 37 个 Demo Pack 文件
- 5 个阶段报告
- 7 个 GitHub Pages URL 全部 200
- 100% demo-ready

---

### ⚠️ Known Limitations

- 截图待补充（v0.1.1）
- Dashboard Demo 使用模拟数据（v0.2.0 接入真实数据）
- 移动端可读但未优化（v0.1.1）

---

### 🚀 Upgrade

这是一个首发版本，无需升级。直接 clone 使用：

```bash
git clone https://github.com/conanxin/idea-to-demo-blueprints.git
cd idea-to-demo-blueprints
cd public && python3 -m http.server 8080
```

或访问线上版本：https://conanxin.github.io/idea-to-demo-blueprints/

---

### 🙏 Acknowledgments

感谢所有提供想法、测试、反馈的贡献者。

特别感谢原始想法的提出者：
- 方案 #1 原始想法：项目记忆型会议助手
- 方案 #2 原始想法：客户会议触发的自主循环构建
- 方案 #3 原始想法：多 Agent 项目管理面板

---

*Released: 2026-06-13*