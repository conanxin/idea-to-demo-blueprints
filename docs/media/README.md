# Screenshots

> 项目截图集合。所有截图通过 Playwright 自动化生成。

---

## 文件列表

| 文件名 | 对应页面 | 大小 |
|--------|----------|------|
| `homepage.png` | 首页（Hero + 3 卡片 + Demo Pack 标准） | ~400 KB |
| `demo-project-memory-meeting-assistant.png` | 第一组 Demo：TeamFlow Dashboard 会议纪要 | ~500 KB |
| `demo-customer-meeting-autonomous-build.png` | 第二组 Demo：客户跟进看板原型 | ~480 KB |
| `demo-multi-agent-project-dashboard.png` | 第三组 Demo：AgentOps Control Tower | ~360 KB |

---

## 对应页面 URL

| 截图 | URL |
|------|-----|
| `homepage.png` | https://conanxin.github.io/idea-to-demo-blueprints/ |
| `demo-project-memory-meeting-assistant.png` | https://conanxin.github.io/idea-to-demo-blueprints/demos/project-memory-meeting-assistant/ |
| `demo-customer-meeting-autonomous-build.png` | https://conanxin.github.io/idea-to-demo-blueprints/demos/customer-meeting-autonomous-build/ |
| `demo-multi-agent-project-dashboard.png` | https://conanxin.github.io/idea-to-demo-blueprints/demos/multi-agent-project-dashboard/ |

---

## 生成方式

### 自动化（v0.1.1+）

使用 Playwright + Chromium 通过 SOCKS5 代理访问 GitHub Pages：

```bash
# 确保 SOCKS5 代理在 127.0.0.1:7898
# 运行生成脚本
python3 scripts/generate-screenshots.py
```

脚本位置：`scripts/generate-screenshots.py`

### 手动（备选）

如果 Playwright 不可用，可以：

1. 打开目标页面
2. 截全屏（macOS: Cmd+Shift+4 / Windows: Win+Shift+S）
3. 保存到 `docs/media/<name>.png`
4. 同时复制到 `public/media/`（如果用于本地预览）

---

## 截图规范

- **尺寸：** 1280×800 视口（full_page 截全屏）
- **格式：** PNG
- **完整截图：** 包含完整页面，不裁剪
- **更新时机：** 每次 v0.1.x 关键变更后
- **存放位置：** `docs/media/`（同步到 `public/media/` 如果需要本地预览）

---

## 截图更新流程

1. 修改 `scripts/generate-screenshots.py` 添加新页面（如需要）
2. 运行脚本生成新截图
3. 更新 `README.md` 和 `docs/media/README.md` 引用
4. 提交 commit：`IDB-X: Update screenshots`
5. push 后验证 `https://conanxin.github.io/idea-to-demo-blueprints/media/<filename>.png` 200

---

## 敏感信息

截图不应包含：

- ❌ 真实 token / API key
- ❌ 私密路径（如 `~/.ssh`、`/home/user/secret`）
- ❌ 客户名称（如果是真实客户）
- ❌ 未公开的内部信息

当前所有截图使用公开 Demo 数据，安全无敏感信息。

---

*最后更新：2026-06-13*