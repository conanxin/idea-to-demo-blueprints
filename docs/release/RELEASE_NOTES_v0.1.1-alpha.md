# Release Notes v0.1.1-alpha

## Release Title

**Idea-to-Demo Blueprints v0.1.1-alpha**

---

## 1. Highlights

v0.1.1-alpha 是 v0.1.0 之后的视觉打磨版本，核心目标：

- 为首页和 3 个 Demo 页生成真实截图
- 在首页加入 Showcase 区域
- 在 README 中加入 Screenshots 区域
- 让项目看起来"像一个完整的开源项目"

---

## 2. Screenshot List

通过 Playwright + Chromium + SOCKS5 代理自动生成 4 张全页截图：

| 截图 | 文件 | 对应页面 |
|------|------|----------|
| 首页 | `homepage.png` | https://conanxin.github.io/idea-to-demo-blueprints/ |
| Demo 1 | `demo-project-memory-meeting-assistant.png` | /demos/project-memory-meeting-assistant/ |
| Demo 2 | `demo-customer-meeting-autonomous-build.png` | /demos/customer-meeting-autonomous-build/ |
| Demo 3 | `demo-multi-agent-project-dashboard.png` | /demos/multi-agent-project-dashboard/ |

---

## 3. Showcase Update

首页新增 Showcase 区域：

- 4 张截图组成 2×2 网格
- 每张图下方标注对应 Blueprint 名称
- 点击截图跳转到对应 Demo 页面
- 移动端单列布局

---

## 4. Verification Summary

| 检查项 | 结果 |
|--------|------|
| 4 张截图已生成 | ✅ |
| 截图文件大小 360-515 KB | ✅ |
| README 引用所有截图 | ✅ |
| 首页 Showcase 引用截图 | ✅ |
| docs/media/README.md 已更新 | ✅ |
| 截图不含敏感信息 | ✅ |

---

## 5. Known Limitations

1. **截图视口固定 1280×800** — 移动端截图需要额外生成
2. **截图脚本依赖 SOCKS5 代理** — 在受限网络环境可能需要调整
3. **截图依赖 GitHub Pages CDN** — 网络波动可能影响生成

---

## 6. Next Steps

- **v0.1.2**：改进 Demo Pack 模板 + 集成 check-catalog.sh 到 CI
- **v0.1.3**：新增第 4 个 demo-ready Blueprint
- **v0.2.0**：自动数据解析 + GitHub API 集成
- **截图未来增强**：多视口截图（移动端 + 平板 + 桌面）

---

*Released: 2026-06-13*