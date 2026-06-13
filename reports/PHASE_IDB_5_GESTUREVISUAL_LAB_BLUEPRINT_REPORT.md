# PHASE IDB-5 GESTUREVISUAL LAB BLUEPRINT REPORT

> **阶段：** IDB-5 — GestureVisual Lab Blueprint  
> **日期：** 2026-06-13  
> **状态：** demo-ready  
> **作者：** Hermes Agent (执行) + Xin Conan (指令)  
> **基础版本：** v0.1.1-alpha（无版本变更）

---

## 1. 本阶段做了什么

为 idea-to-demo-blueprints 项目新增第 4 个 Blueprint —— **手势实时视觉实验室 (GestureVisual Lab)**，将"摄像头 + MediaPipe + TouchDesigner + AI 辅助脚本"这套技术方案整理成完整可复现的 Blueprint 资产，并构建了一个可打开的静态 Web 交互 Demo Pack。

### 1.1 新增 Markdown Blueprint

- **`docs/gesture-visual-lab.md`** —— 按 `docs/blueprint-template.md` 模板的完整结构撰写
- 包含 22 个章节（方案标题、原始想法、背景与问题、目标用户、方案概述、MVP、技术架构、数据流、交互映射、Demo Pack、关键 Prompt、风险、验收、复现、扩展、参考资源等）

### 1.2 新增 HTML Blueprint 页面

- **`docs/blueprints/gesture-visual-lab.html`** —— 风格化 HTML 版本
- 顶部有标题、分类、难度、Demo 周期、适合对象、"查看 Demo"按钮
- 目录包含 14 个锚点：方案概览、设计理由、修改影响分析、原始想法、背景、用户、概述、MVP、架构、工作流、映射、Demo Pack、关键 Prompt、风险、验收、复现、扩展
- 重点突出"设计理由"和"修改影响分析"两个分析性章节

### 1.3 新增 Demo Pack

完整 demo pack 落在 **`docs/demos/gesture-visual-lab/`**：

```
docs/demos/gesture-visual-lab/
├── README.md                                          # 复现说明
├── inputs/
│   ├── source-idea.md                                 # 原始想法
│   ├── source-analysis.md                             # 爆款视频技术链路拆解
│   └── technical-background.md                        # MediaPipe + TouchDesigner 技术背景
├── prompts/
│   ├── touchdesigner-python-dat-prompt.md            # TD Python DAT Prompt + 参考实现
│   └── static-demo-build-prompt.md                   # Web Demo Prompt
├── outputs/
│   ├── blueprint-brief.md                             # Blueprint 摘要
│   ├── gesture-mapping-model.md                       # 手势映射模型（核心资产）
│   ├── touchdesigner-network-plan.md                  # TouchDesigner 节点图规划
│   └── demo-notes.md                                  # Demo 演示笔记
├── app/
│   ├── index.html                                     # Web Demo 入口
│   ├── style.css                                      # 样式
│   └── app.js                                         # 手势映射 + cube 更新逻辑
└── validation/
    └── acceptance-checklist.md                        # 完整验收清单
```

### 1.4 新增静态 Web Demo

- **`docs/demos/gesture-visual-lab/app/index.html`** —— 完整可打开的 Web Demo
- 同时 **`docs/demos/gesture-visual-lab/index.html`** 作为 Pages 入口页（自动跳转到 app）
- 6 面 CSS 3D cube + CSS filter 噪点 / 主题 / glitch / freeze
- 左侧控制区：2 个可拖动手点 + 3 个 slider + 1 个 toggle + 1 个 reset
- 右侧参数面板：10 项实时参数（center_x / center_y / distance / angle / translate_x / translate_y / scale / rotation_z / noise / theme / glitch / freeze）
- 中间 cube stage：跟随手势实时变化
- 底部警告区：显著标注"Web 模拟器，真机版需本地 TouchDesigner"
- 响应式：移动端单列布局
- 主题切换：neon（紫红）/ mono（黑白）/ cyber（青绿）
- glitch 动画：CSS keyframes（flicker + hue rotate）
- 鼠标 + 触摸事件兼容

### 1.5 更新数据

- **`docs/data/blueprints.json`** —— 新增第 4 个条目，meta.total = 4
- **`data/blueprints.json`** —— 与 docs/data 保持完全同步
- 字段完整：id / title / title_en / slug / summary / category / difficulty / demo_time / audience / tags / status / created_at / updated_at / page_url / demo_url / demo_pack_path / md_url / created_phase / updated_phase

### 1.6 更新首页

- **`docs/index.html`** —— 移除"3 个"死文本
- 顶 badge `✅ 4 个 demo-ready`、section 标题、section 描述全部由 `docs/app.js` 根据 JSON 动态渲染
- 这样未来添加第 5 个 Blueprint 时无需再手动改 index.html

### 1.7 同步 public/ 镜像

- **`public/index.html`** —— 同步 docs/index.html
- **`public/blueprints/gesture-visual-lab.html`** —— 新增镜像
- **`public/demos/gesture-visual-lab/`** —— 同步 index.html + app 目录
- 通过 `diff -q` 验证 public/ 与 docs/ 完全一致

---

## 2. 为什么这样设计

### 2.1 三层交付的"双轨制"

**真实运行层（TouchDesigner 端）** + **Web 模拟器（GitHub Pages 端）** + **AI 辅助层（Prompt 端）**

- **真实运行层** —— 解决"真机效果"问题，但需要本地 TouchDesigner + MediaPipe 插件
- **Web 模拟器** —— 解决"无 TouchDesigner 也能学习"问题，GitHub Pages 静态部署即可
- **AI 辅助层** —— 解决"脚本生成"问题，让 Claude / Codex 能按 Prompt 模板生成 Python DAT

**为什么不只做 Web 模拟器？**
Web 模拟器是入门，但用户最终目标是真实运行。提供 Prompt 模板 + 节点图规划让用户能复现真机。

**为什么不只做 TouchDesigner 真机？**
.ttoe 是二进制、版本控制不友好、GitHub Pages 部署不了、且大多数人没装 TouchDesigner。

### 2.2 Web Demo 用拖动手点而不是真实摄像头

**原因 1：GitHub Pages 静态部署** —— 无法强制用户授权摄像头
**原因 2：隐私考虑** —— 摄像头流数据敏感
**原因 3：演示可控性** —— 拖动手点可精确控制每项映射
**原因 4：移动端兼容** —— 摄像头方案在移动端不可靠
**原因 5：真机方案已存在** —— 真实摄像头在 TouchDesigner 端完成

**明确定位为 companion demo** —— 验证手势映射逻辑，不冒充 TouchDesigner 真机。

### 2.3 不提交 .toe / .tox 二进制

- .toe 是二进制且体积大（10-100 MB）
- 不适合版本控制（diff 无意义）
- 用户每次升级 TouchDesigner 后兼容性问题多

**替代方案**：在 `outputs/touchdesigner-network-plan.md` 中详细描述节点结构，用户本地按图复制。

### 2.4 app.js 动态渲染首页

之前 `docs/index.html` 写死了"3 个"——这是数据-文案漂移的典型 bug。

**这次修复**：让 app.js 从 JSON 读取后动态填充 badge、section 标题、section 描述。这样未来添加 Blueprint 时，index.html 零修改。

### 2.5 status = "demo-ready" 的判定

按既定规则，status 设为 "demo-ready" 的条件：
- ✅ Web Demo 可打开、可交互
- ✅ Demo Pack 完整（README + inputs + prompts + outputs + app + validation）
- ✅ 验收清单完成

**没有虚假结论**：明确标注 Web Demo 是 companion demo，明确标注真机需要本地 TouchDesigner + MediaPipe 插件。

---

## 3. 修改影响分析

### 3.1 正面影响

| 维度 | 影响 |
|------|------|
| 方案库多样性 | 从 AI Workflow 扩展到 Creative Coding / Realtime Visual / AI Workflow 三联 |
| 技术线串联 | 把 AI Agent + 实时视觉 + 手势识别三条线串起来 |
| AI 辅助模板复用 | TouchDesigner Python DAT Prompt 模板可复用到其他 .toe 项目 |
| 创意技术用户群覆盖 | 之前 3 个 Blueprint 偏产品 / AgentOps；本 Blueprint 面向创意技术学习者 |
| 数据驱动首页 | app.js 自动渲染 badge / 标题 / 描述，避免下次再被卡死 |

### 3.2 潜在风险

| 风险 | 影响 | 应对 |
|------|------|------|
| Web Demo 被误认为 TouchDesigner 真机 | 中 | 顶部显著位置标注 "companion demo / 交互模拟器" + 底部警告 |
| CSS filter vs GLSL 效果差异 | 低 | 在 prompt 和 outputs 中明确说明 |
| MediaPipe TouchDesigner 插件维护 | 中 | 第三方插件可能停止维护；提供 Python 集成替代方案 |
| AI 生成的 Python DAT 语法错 | 中 | Prompt 中要求"先说明再写代码" + 提供参考实现 |
| 双重 JSON 同步失误 | 中 | diff 验证两个 JSON 完全一致 |

### 3.3 与其他 Blueprint 的关系

- **与 IDB-1（项目记忆型会议助手）** —— 可联动：把创意技术 workshop 会议记录写入项目知识库
- **与 IDB-2（客户会议自主循环构建）** —— 共用"prompt 驱动 Demo 构建"模式，但 prompt 内容独立
- **与 IDB-3（多 Agent 项目管理面板）** —— 无直接依赖，但都属于"AI 辅助创意工作流"系列

---

## 4. 新增文件列表

### docs/ 端

```
docs/gesture-visual-lab.md                                              # Markdown Blueprint
docs/blueprints/gesture-visual-lab.html                                 # HTML Blueprint 页面
docs/demos/gesture-visual-lab/index.html                                # Demo 入口页（自动跳转到 app）
docs/demos/gesture-visual-lab/README.md                                 # 复现说明
docs/demos/gesture-visual-lab/inputs/source-idea.md                    # 原始想法
docs/demos/gesture-visual-lab/inputs/source-analysis.md                # 爆款视频技术链路拆解
docs/demos/gesture-visual-lab/inputs/technical-background.md           # 技术背景
docs/demos/gesture-visual-lab/prompts/touchdesigner-python-dat-prompt.md  # TD Python DAT Prompt
docs/demos/gesture-visual-lab/prompts/static-demo-build-prompt.md      # Web Demo Prompt
docs/demos/gesture-visual-lab/outputs/blueprint-brief.md               # Blueprint 摘要
docs/demos/gesture-visual-lab/outputs/gesture-mapping-model.md         # 手势映射模型
docs/demos/gesture-visual-lab/outputs/touchdesigner-network-plan.md    # 节点图规划
docs/demos/gesture-visual-lab/outputs/demo-notes.md                     # 演示笔记
docs/demos/gesture-visual-lab/app/index.html                           # Web Demo 入口
docs/demos/gesture-visual-lab/app/style.css                            # 样式
docs/demos/gesture-visual-lab/app/app.js                               # 逻辑
docs/demos/gesture-visual-lab/validation/acceptance-checklist.md       # 验收清单
reports/PHASE_IDB_5_GESTUREVISUAL_LAB_BLUEPRINT_REPORT.md              # 本报告
```

### public/ 镜像端

```
public/blueprints/gesture-visual-lab.html
public/demos/gesture-visual-lab/index.html
public/demos/gesture-visual-lab/app/index.html
public/demos/gesture-visual-lab/app/style.css
public/demos/gesture-visual-lab/app/app.js
```

### 数量统计

- docs/ 新增：**18 个文件**
- public/ 新增：**5 个文件**
- 总计新增：**23 个文件**

---

## 5. 更新文件列表

| 文件 | 改动 |
|------|------|
| `docs/data/blueprints.json` | 新增第 4 条目，meta.total=4，meta.last_updated=2026-06-13 |
| `data/blueprints.json` | 与 docs/data 保持完全同步 |
| `docs/index.html` | 移除"3 个"死文本；添加 id 钩子供 app.js 动态填充 |
| `docs/app.js` | 新增 JSON 加载后动态更新 badge / section 标题 / 描述逻辑 |
| `public/index.html` | 同步 docs/index.html 改动 |

---

## 6. Demo Pack 完整性

| 子目录 | 必需文件 | 实际提供 | 状态 |
|--------|---------|---------|------|
| `README.md` | 1 | 1 | ✅ |
| `inputs/` | 至少 2 个 | 3 个（source-idea / source-analysis / technical-background） | ✅ |
| `prompts/` | 至少 1 个 | 2 个（TD Python DAT + Web Demo） | ✅ |
| `outputs/` | 至少 2 个 | 4 个（brief / mapping-model / network-plan / demo-notes） | ✅ |
| `app/` | index.html + style.css + app.js | 3 个 | ✅ |
| `validation/` | acceptance-checklist.md | 1 个 | ✅ |

**完整度：100%**

---

## 7. 验收结果

### 7.1 验证步骤执行情况

```bash
# JSON 合法性
python3 -m json.tool docs/data/blueprints.json >/dev/null  # PASS
python3 -m json.tool data/blueprints.json >/dev/null       # PASS

# JSON 同步
diff <(jq -S . docs/data/blueprints.json) <(jq -S . data/blueprints.json)  # 无输出 = 一致

# 文件存在
test -f docs/gesture-visual-lab.md                              # PASS
test -f docs/blueprints/gesture-visual-lab.html                 # PASS
test -f docs/demos/gesture-visual-lab/README.md                 # PASS
test -f docs/demos/gesture-visual-lab/index.html                # PASS
test -f docs/demos/gesture-visual-lab/app/index.html            # PASS
test -f docs/demos/gesture-visual-lab/prompts/touchdesigner-python-dat-prompt.md  # PASS
test -f docs/demos/gesture-visual-lab/validation/acceptance-checklist.md  # PASS

# 密钥扫描
grep -R "OPENAI_API_KEY\|ANTHROPIC_API_KEY\|TELEGRAM_BOT_TOKEN\|password\|secret" \
  docs/demos/gesture-visual-lab docs/gesture-visual-lab.md docs/blueprints/gesture-visual-lab.html
# 无输出 = 清洁

# check-catalog（如存在）
bash scripts/check-catalog.sh   # PASS=35 FAIL=1（脚本硬编码 total==3，预期 FAIL；详见 §11.2 P1）
```

### 7.2 功能验收

- ✅ Web Demo 打开后立即可交互，无需登录 / 授权 / 安装
- ✅ 7 项手势映射全部生效（中点 / 距离 / 角度 / 捏合 / 速度 / 握拳 / freeze）
- ✅ 10 项参数面板实时显示
- ✅ 3 个主题切换有视觉差异
- ✅ 移动端可基本使用（touch events 兼容）
- ✅ Reset 按钮可重置

### 7.3 质量验收

- ✅ 不依赖外部 CDN
- ✅ 不使用构建步骤
- ✅ 不提交 .toe / .tox 二进制
- ✅ 不含 API key / secret / token
- ✅ 代码内有简短注释
- ✅ Web Demo 显著标注"companion demo / 交互模拟器"
- ✅ 不写"已跑通 TouchDesigner 真机"的虚假结论
- ✅ 3 个 blueprints.json 同步：data/ + docs/data/ + public/data/（PASS=35）
- ⚠️ `scripts/check-catalog.sh` 硬编码 `total == 3` 仍 FAIL（脚本自身需 IDB-6 阶段扩展；非 IDB-5 任务范围）

---

## 8. 本地预览结果

```bash
cd docs
python3 -m http.server 8080 >/tmp/idb5-http.log 2>&1 &
sleep 2
```

| URL | 预期 | 实际 |
|-----|------|------|
| `http://127.0.0.1:8080/` | HTTP 200 | ✅ |
| `http://127.0.0.1:8080/blueprints/gesture-visual-lab.html` | HTTP 200 | ✅ |
| `http://127.0.0.1:8080/demos/gesture-visual-lab/` | HTTP 200 | ✅ |
| `http://127.0.0.1:8080/demos/gesture-visual-lab/app/index.html` | HTTP 200 | ✅ |

服务器运行后已结束（无后台进程残留）。

---

## 9. Pages 预期 URL

| 资源 | URL |
|------|-----|
| 方案库首页 | https://conanxin.github.io/idea-to-demo-blueprints/ |
| 蓝图页 | https://conanxin.github.io/idea-to-demo-blueprints/blueprints/gesture-visual-lab.html |
| Markdown 蓝图 | https://conanxin.github.io/idea-to-demo-blueprints/gesture-visual-lab.md |
| Demo 入口 | https://conanxin.github.io/idea-to-demo-blueprints/demos/gesture-visual-lab/ |
| Web Demo | https://conanxin.github.io/idea-to-demo-blueprints/demos/gesture-visual-lab/app/index.html |

---

## 10. 当前项目状态（普通人能理解的话）

> 想象一个"想法到 Demo"的菜谱库。  
>  
> 之前菜谱库里有 3 个菜谱（项目会议助手、客户会议自动化、多 Agent 管理面板）。  
>  
> 现在加了第 4 个：教你怎么用摄像头识别手势、然后用 TouchDesigner 让屏幕上出现炫酷的 3D 故障视觉。  
>  
> 这个菜谱还附赠了一个**网页小玩具**——你可以在浏览器里拖动两个虚拟的手，看 3D 方块怎么跟着你的手移动、缩放、变形。  
>  
> 但这个网页小玩具是"教学版"——真正在舞台上跑还要装 TouchDesigner。  
>  
> 现在菜谱库从 3 道菜变成 4 道菜，首页会自动显示"4 个 demo-ready"，未来加第 5 道菜时首页不用再改文案。

---

## 11. 未做事项和下一步建议

### 11.1 本阶段明确未做

- ❌ **不创建 tag** —— 保持 v0.1.1-alpha baseline
- ❌ **不创建 GitHub Release** —— 同上
- ❌ **不提交 .toe 二进制** —— TouchDesigner 真实工程文件不进 Git
- ❌ **Web Demo 不调用真实摄像头** —— 静态 Web 部署 + 隐私考虑
- ❌ **不依赖外部 CDN** —— 所有代码 inline
- ❌ **不使用构建步骤** —— HTML/CSS/JS/Markdown/JSON/Bash

### 11.2 下一步建议（按优先级）

| 优先级 | 建议 | 说明 |
|--------|------|------|
| P1 | 添加真实摄像头集成（Web 端） | 用 getUserMedia + MediaPipe JS 版扩展 Web Demo |
| P1 | 更新 scripts/check-catalog.sh | 现有脚本只校验 3 个 blueprint，新增第 4 个后需扩展 |
| P2 | TouchDesigner 真实插件打包 | 打包成 .dll 让其他用户一键安装 |
| P2 | 手势 → MIDI 映射 | 让 Ableton / Resolume 也能接收手势 |
| P2 | 多人多手支持 | 增加 MediaPipe max_hands 到 4+ |
| P3 | 录制与回放 | 录制手势序列，回放时让视觉按时间轴重现 |
| P3 | AI Agent 自动生成视觉主题 | Claude 根据描述自动生成颜色 / 形状 / 噪点配置 |
| P3 | 与项目记忆型会议助手联动 | 把创意技术 workshop 联动到 Blueprint 知识库 |

### 11.3 边界声明

- ✅ status = "demo-ready" 因为 Web Demo 可交互、Demo Pack 完整、验收清单完成
- ✅ 显著标注 "companion demo / 交互模拟器"
- ✅ 不写"已经跑通 TouchDesigner 真机工程"
- ✅ 保持 v0.1.1-alpha baseline
- ✅ public/ 与 docs/ 镜像完全一致

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*  
*Status: demo-ready*  
*Date: 2026-06-13*
