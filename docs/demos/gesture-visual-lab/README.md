# Demo Pack: GestureVisual Lab (Gesture Cube Lite)

> **方案：** 手势实时视觉实验室 (GestureVisual Lab)  
> **Demo 场景：** 双手手势驱动 3D 故障视觉  
> **状态：** demo-ready  
> **创建阶段：** IDB-5  
> **关键提醒：** Web Demo 是 companion demo / 交互模拟器，真机版需要本地 TouchDesigner + MediaPipe 插件

---

## 快速复现

1. 阅读 `inputs/` 中的原始想法、技术链路拆解、技术背景
2. 查看 `prompts/` 中的两个核心 Prompt（TouchDesigner Python DAT + Web Demo）
3. 查看 `outputs/` 中的 Brief、映射模型、节点图规划、Demo 笔记
4. 打开 `app/index.html` 体验 Web 交互模拟器
5. 对照 `validation/acceptance-checklist.md` 验证
6. 真机版：本地安装 TouchDesigner + MediaPipe 插件，按节点图规划新建 .toe

---

## 文件结构

```
demos/gesture-visual-lab/
├── README.md                                    # 复现说明
├── inputs/
│   ├── source-idea.md                          # 原始想法
│   ├── source-analysis.md                      # 爆款视频技术链路拆解
│   └── technical-background.md                 # MediaPipe + TouchDesigner 技术背景
├── prompts/
│   ├── touchdesigner-python-dat-prompt.md     # TD Python DAT 生成 prompt
│   └── static-demo-build-prompt.md            # Web Demo 生成 prompt
├── outputs/
│   ├── blueprint-brief.md                      # Blueprint 摘要
│   ├── gesture-mapping-model.md                # 手势映射模型
│   ├── touchdesigner-network-plan.md           # TouchDesigner 节点图规划
│   └── demo-notes.md                           # Demo 演示笔记
├── app/
│   ├── index.html                              # Web Demo 入口
│   ├── style.css                               # 样式
│   └── app.js                                  # 手势映射 + cube 更新逻辑
└── validation/
    └── acceptance-checklist.md                 # 完整验收清单
```

---

## 复现步骤

### Web Demo 复现

1. 打开 `app/index.html`
2. 拖动 Left Hand 手点 → 看 cube 跟随移动
3. 拖动 Right Hand 手点 → 看 cube 跟随移动
4. 拉远 / 拉近双手 → 看 cube 缩放
5. 旋转双手角度 → 看 cube 旋转
6. 调节 Left Pinch slider → 看噪点强度变化
7. 调节 Right Pinch slider → 看主题切换
8. 调节 Movement Speed slider → 看 glitch 闪烁
9. 切换 Both Fists Freeze → 看视觉暂停
10. 点击 Reset → 回到初始状态

### TouchDesigner 真机复现

1. 本地安装 TouchDesigner Non-Commercial（derivative.ca 免费下载）
2. 安装 MediaPipe TouchDesigner 插件（torinmb/mediapipe-touchdesigner）
3. 准备摄像头
4. 按 `outputs/touchdesigner-network-plan.md` 复制节点结构
5. 按 `prompts/touchdesigner-python-dat-prompt.md` 驱动 Claude / Codex 生成 Python DAT
6. 运行 → 看 3D 故障视觉

---

## 关键输入

- **原始想法：** 爆款"手势控视觉"视频的真实技术链路
- **手势映射规则：** 7 项核心手势到视觉的映射
- **MediaPipe Hand Landmarker：** 21 个关键点 / 手
- **TouchDesigner Non-Commercial：** 免费版即可

---

## 关键输出

- **Web 交互模拟器：** 拖动手点 + slider + toggle + reset
- **3D cube 视觉：** 跟随手势实时变化
- **9-10 项参数面板：** 实时显示手势语义量
- **3 个颜色主题：** neon / mono / cyber
- **手势 → 视觉映射规则文档：** 可被 AI Agent 复用

---

## 验收标准

详见 `validation/acceptance-checklist.md`。

---

## 重要边界声明

- ✅ Web Demo 是"交互模拟器 / companion demo"，不调用真实摄像头
- ✅ 真机版需要本地 TouchDesigner + MediaPipe TouchDesigner 插件
- ✅ 本仓库**不提交** TouchDesigner .toe / .tox 二进制文件
- ✅ 不依赖外部 CDN，不使用构建步骤
- ✅ 不含 OPENAI_API_KEY / ANTHROPIC_API_KEY / TELEGRAM_BOT_TOKEN / password / secret

---

*Phase: IDB-5 — GestureVisual Lab Blueprint*
