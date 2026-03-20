# PromptBox AI - 精简版产品定义

## 核心定位

**一句话**：上传任意图片或网页，AI 帮你分析设计风格，生成可用的提示词和工具建议。

**目标用户**：非技术人员，零编程基础，想要复刻喜欢的设计风格。

---

## 功能范围

### ✅ MVP 包含

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 图片上传 | JPG/PNG/WebP/GIF，支持拖放 | P0 |
| 网页截图 | 输入URL，自动截图分析 | P0 |
| 设计分析 | 配色、布局、风格、字体提取 | P0 |
| 提示词生成 | Midjourney / Stable Diffusion / DALL-E | P0 |
| 工具推荐 | 推荐适合的AI工具和模型 | P0 |
| Tailwind代码 | 输出可复用的CSS类名组合 | P1 |
| 网站逆向分析 | URL → 功能/技术栈/API/需求提示词 | P1 |
| 多方案输出 | 2-4个方案，用户滑块选择 | P1 |
| 中英双语 | 界面和输出双语支持 | P1 |
| 风格记忆 | 预设风格包 + 简单偏好记录 | P2 |

### ✅ 保留功能

| 功能 | 描述 | 优先级 |
|------|------|--------|
| Tailwind代码生成 | 输出可复用的CSS类名组合 | P1 |

### ❌ 暂不包含

- 视频分镜分析
- AI工作流反推
- 文档处理
- 浏览器插件

---

## 用户流程

```
上传图片/URL → AI分析设计 → 输出方案 → 用户选择 → 复制提示词
                              ↓
                    [方案1] 配色+风格+提示词+工具建议
                    [方案2] 变体方案
                    [方案3] 变体方案

URL输入时额外选项：
输入URL → 选择分析模式
              ├─ 设计分析 → 提示词 + Tailwind代码
              └─ 逆向分析 → 功能/技术栈/API/需求文档
```

---

## 输出示例

### 输入
一张科技感landing page截图

### 输出

**方案1：深空科技风**
```
设计分析：
- 配色：深色背景(#0a0a0f) + 紫蓝渐变光效(#6366f1→#8b5cf6)
- 布局：居中单列 + 大量留白
- 字体：无衬线粗体标题 + 细体正文
- 风格关键词：minimalist, dark mode, tech, glow effects

Midjourney 提示词：
minimalist tech landing page, dark theme with purple gradient glow, 
sans-serif typography, clean geometric shapes, centered layout, 
subtle light effects, modern UI --ar 16:9 --v 6

Stable Diffusion 提示词：
minimalist tech website, dark interface, purple blue gradient, 
glowing accents, clean typography, geometric shapes, 
professional UI design, 8k quality

推荐工具：
🎨 Midjourney v6（效果最接近，推荐优先尝试）
🎨 Stable Diffusion + SDXL（可本地运行，成本最低）
🎨 DALL-E 3（操作最简单，适合新手）
```

---

### 输入
一个AI聊天网站URL（如 chat.openai.com）

### 输出（逆向分析模式）

**1. 主要功能与特色**
- 智能对话：基于大语言模型的自然语言交互
- 多模型切换：支持GPT-4、GPT-4o等多版本模型
- 会话管理：创建新对话、历史记录、导出
- 插件生态：支持第三方插件扩展功能
- 多模态：支持图片、语音输入输出

**2. 开发工具与技术栈**
- 前端：React + TypeScript + Tailwind CSS
- 后端：Node.js / Python
- 部署：Vercel / AWS
- 认证：OAuth 2.0 / JWT
- 实时通信：WebSocket

**3. 调用的API与大模型**
- OpenAI API (GPT-4, GPT-4o)
- Anthropic API (Claude) - 备用
- 第三方服务：Stripe(支付)、Auth0(认证)

**4. 需求提示词模板**
```
我要做一个类似的AI对话网站，包含以下功能：
1. 支持用户注册登录（邮箱/Google/Apple）
2. 创建和管理多个对话会话
3. 支持切换不同的AI模型（GPT-4、Claude等）
4. 支持图片上传和语音输入
5. 对话历史自动保存
6. 支持导出对话为PDF/Markdown
7. 简洁现代的深色UI设计

请帮我详细设计：
- 技术架构方案
- 每个功能的实现思路
- 推荐的AI API选择
- 整体开发周期估算
```

---

## 技术栈（精简版）

| 层级 | 技术选型 | 说明 |
|-----|---------|------|
| 前端 | Next.js 14 + Tailwind | 单体应用，快速开发 |
| AI | 腾讯 Coding 模型 API | 主模型 |
| 存储 | 本地文件 + Redis 缓存 | MVP阶段够用 |
| 部署 | Vercel / 腾讯云 | 按需选择 |

---

## 开发周期

| 阶段 | 内容 | 时间 |
|------|------|------|
| Phase 1 | 基础上传 + 分析 + 提示词 + Tailwind代码 | 2.5周 |
| Phase 2 | 网站逆向分析 + 多方案 + 双语 | 1周 |
| Phase 3 | 用户系统 + 付费 | 1周 |
| **总计** | | **4.5周** |

---

## 风险与对策

| 风险 | 对策 |
|------|------|
| AI分析质量不稳定 | 提示词模板 + 后处理优化 |
| 用户觉得"不值" | 免费试用 + 限次体验 |
| 版权争议 | 输出"风格建议"而非"完整复刻" |
