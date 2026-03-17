# MediaPrompt AI - 技术文档

> 版本：v1.0  
> 更新日期：2026-03-18  
> 技术负责人：Oliver Young

---

## 一、系统架构

### 1.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                        用户层                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  Web 浏览器  │  │  移动端 H5  │  │  API 客户端  │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                       CDN / 静态资源                          │
│              腾讯云 COS (oliveryoung1983-1409675040)          │
│              https://oliveryoung1983-1409675040.cos...       │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                       API 网关层                              │
│                    Express.js Server                         │
│                    http://124.156.200.127:3001               │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                       业务逻辑层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │  文本分析    │  │  图片分析    │  │  文件处理    │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                       AI 服务层                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              腾讯云混元大模型                           │   │
│  │         hunyuan-lite / hunyuan-pro / hunyuan-vision  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| 前端 | HTML + Tailwind CSS + Vanilla JS | 轻量级，快速加载 |
| CDN | 腾讯云 COS | 静态资源托管 |
| 后端 | Node.js + Express | API 服务 |
| AI | 腾讯云混元大模型 | 文本/图片分析 |
| 存储 | 本地文件系统 | 临时文件存储 |

---

## 二、API 接口文档

### 2.1 基础信息

- **Base URL**: `http://124.156.200.127:3001`
- **Content-Type**: `application/json`
- **认证方式**: 暂无（后续支持 API Key）

### 2.2 接口列表

#### 2.2.1 健康检查

```
GET /api/health
```

**响应示例：**
```json
{
  "status": "ok",
  "timestamp": "2026-03-18T00:00:00.000Z",
  "model": "hunyuan-lite",
  "auth": "tencent-sdk",
  "hasCredentials": true
}
```

#### 2.2.2 文本分析

```
POST /api/analyze/text
```

**请求参数：**
```json
{
  "content": "要分析的文本内容",
  "category": "document",
  "outputOptions": ["prompt", "outline"]
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| content | string | 是 | 要分析的文本内容 |
| category | string | 否 | 类别：document/image/video/website，默认 document |
| outputOptions | string[] | 否 | 输出选项，默认 ["prompt"] |

**响应示例：**
```json
{
  "success": true,
  "category": "document",
  "outputOptions": ["prompt"],
  "result": "## Role\n...\n## Background\n...",
  "timestamp": "2026-03-18T00:00:00.000Z"
}
```

#### 2.2.3 图片分析

```
POST /api/analyze/image
```

**请求参数：**
- Content-Type: `multipart/form-data`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| image | file | 是 | 图片文件（JPG/PNG/WebP/GIF） |
| outputOptions | string | 否 | JSON 数组字符串，如 '["prompt","style"]' |

**响应示例：**
```json
{
  "success": true,
  "category": "image",
  "outputOptions": ["prompt"],
  "result": "主体描述：...\n风格标签：...",
  "timestamp": "2026-03-18T00:00:00.000Z"
}
```

#### 2.2.4 文件分析

```
POST /api/analyze/file
```

**请求参数：**
- Content-Type: `multipart/form-data`

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 文档文件（Word/PDF/TXT/Markdown） |
| category | string | 否 | 类别，默认 document |
| outputOptions | string | 否 | JSON 数组字符串 |

**响应示例：**
```json
{
  "success": true,
  "category": "document",
  "result": "## Role\n...",
  "timestamp": "2026-03-18T00:00:00.000Z"
}
```

#### 2.2.5 模拟预览

```
POST /api/preview
```

**请求参数：**
```json
{
  "prompt": "生成的提示词内容"
}
```

**响应示例：**
```json
{
  "success": true,
  "model": "hunyuan-lite",
  "preview": "基于提示词生成的示例输出...",
  "timestamp": "2026-03-18T00:00:00.000Z"
}
```

---

## 三、腾讯云混元大模型集成

### 3.1 认证方式

使用腾讯云 SDK 方式，通过 SecretId 和 SecretKey 认证：

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const HunyuanClient = tencentcloud.hunyuan.v20230901.Client;

const client = new HunyuanClient({
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: "ap-guangzhou",
});
```

### 3.2 模型选择

| 模型 | 用途 | 特点 |
|------|------|------|
| hunyuan-lite | 快速文本生成 | 免费额度大，速度快 |
| hunyuan-pro | 复杂任务 | 能力更强，适合专业场景 |
| hunyuan-vision | 图片分析 | 多模态，支持图片理解 |

### 3.3 调用示例

```javascript
// 文本分析
const response = await client.ChatCompletions({
  Model: 'hunyuan-lite',
  Messages: [
    { Role: 'system', Content: '你是专业的内容分析专家...' },
    { Role: 'user', Content: '分析这段内容...' }
  ],
  Temperature: 0.7,
  TopP: 0.8,
});

const result = response.Choices[0].Message.Content;
```

### 3.4 费用说明

- **混元 Lite**：免费额度较大，适合 MVP 阶段
- **混元 Pro**：按 token 计费，专业版用户使用
- **Coding Plan**：已购买套餐，包含大模型调用额度

---

## 四、前端实现

### 4.1 技术选型

- **框架**：无框架，原生 HTML + JS
- **样式**：Tailwind CSS（CDN）
- **特点**：轻量、快速加载、SEO 友好

### 4.2 核心模块

```javascript
// API 调用
const API_BASE_URL = 'http://124.156.200.127:3001';

// 文本分析
async function analyzeContent() {
  const response = await fetch(`${API_BASE_URL}/api/analyze/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: uploadedContent,
      category: currentType,
      outputOptions: getSelectedOptions()
    })
  });
  return await response.json();
}

// 文件上传
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', currentType);
  
  const response = await fetch(`${API_BASE_URL}/api/analyze/file`, {
    method: 'POST',
    body: formData
  });
  return await response.json();
}
```

### 4.3 状态管理

```javascript
// 全局状态
let currentLang = 'zh';        // 当前语言
let currentType = 'document';  // 当前类别
let isLoading = false;         // 加载状态
let uploadedContent = '';      // 上传的内容
let uploadedFile = null;       // 上传的文件
```

---

## 五、部署架构

### 5.1 当前部署

| 组件 | 位置 | 说明 |
|------|------|------|
| 前端静态资源 | 腾讯云 COS | ap-singapore 区域 |
| 后端 API 服务 | 云服务器 | 124.156.200.127:3001 |
| AI 服务 | 腾讯云混元 | API 调用 |

### 5.2 服务器信息

```
公网 IP: 124.156.200.127
端口: 3001
系统: Linux (Ubuntu)
Node.js: v22.22.1
```

### 5.3 进程管理

```bash
# 启动服务
cd /root/.openclaw/workspace/mediaprompt-ai/backend
node server-sdk.js &

# 查看日志
tail -f sdk.log

# 检查进程
ps aux | grep node
```

### 5.4 后续优化

| 优化项 | 方案 | 优先级 |
|--------|------|--------|
| 进程守护 | PM2 | P0 |
| 反向代理 | Nginx | P0 |
| HTTPS | Let's Encrypt | P0 |
| 域名绑定 | DNS 配置 | P1 |
| 日志收集 | ELK / 云日志 | P2 |
| 监控告警 | 云监控 | P2 |

---

## 六、安全设计

### 6.1 数据安全

- 文件上传后立即处理，处理完成后删除
- 不存储用户上传的内容（MVP 阶段）
- 后续支持隐私模式

### 6.2 接口安全

```javascript
// CORS 配置
app.use(cors({
  origin: ['https://oliveryoung1983-1409675040.cos.ap-singapore.myqcloud.com'],
  credentials: true
}));

// 请求大小限制
app.use(express.json({ limit: '50mb' }));

// 文件大小限制
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});
```

### 6.3 密钥管理

```bash
# 环境变量配置
TENCENT_SECRET_ID=xxx
TENCENT_SECRET_KEY=xxx
AI_API_KEY=xxx
```

---

## 七、性能优化

### 7.1 前端优化

- Tailwind CSS CDN 缓存
- 图片懒加载
- 代码压缩

### 7.2 后端优化

- 连接池复用
- 响应缓存
- 异步处理

### 7.3 AI 调用优化

- 选择合适的模型（lite vs pro）
- 控制输出长度（max_tokens）
- 批量请求合并

---

## 八、监控与日志

### 8.1 日志格式

```
[dotenv@17.3.1] injecting env (7) from .env
🚀 MediaPrompt API 服务已启动
📍 地址: http://localhost:3001
🤖 模型: hunyuan-lite
🔑 SecretId: 已配置
📅 时间: 2026-03-18T00:00:00.000Z
```

### 8.2 错误处理

```javascript
try {
  const result = await callHunyuan(systemPrompt, userContent);
  res.json({ success: true, result });
} catch (error) {
  console.error('分析失败:', error);
  res.status(500).json({ 
    error: '分析失败', 
    message: error.message 
  });
}
```

---

## 九、扩展计划

### 9.1 短期（1个月）

- [ ] PM2 进程守护
- [ ] Nginx 反向代理
- [ ] HTTPS 证书
- [ ] 域名绑定
- [ ] 用户系统

### 9.2 中期（3个月）

- [ ] 数据库集成（MongoDB/MySQL）
- [ ] Redis 缓存
- [ ] 消息队列（异步处理）
- [ ] API 限流

### 9.3 长期（6个月）

- [ ] 微服务拆分
- [ ] Kubernetes 部署
- [ ] 多区域部署
- [ ] 私有化方案

---

## 十、附录

### 10.1 环境变量

```bash
# .env 文件
TENCENT_SECRET_ID=your_secret_id_here
TENCENT_SECRET_KEY=your_secret_key_here
TENCENT_REGION=ap-guangzhou

AI_API_KEY=your_api_key_here
AI_BASE_URL=https://api.hunyuan.cloud.tencent.com/v1
AI_MODEL=hunyuan-lite

PORT=3001
```

### 10.2 依赖版本

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^17.3.1",
    "tencentcloud-sdk-nodejs": "^4.0.300"
  }
}
```

### 10.3 相关链接

- 腾讯云控制台：https://console.cloud.tencent.com/
- 混元大模型文档：https://cloud.tencent.com/document/product/1729
- Tailwind CSS：https://tailwindcss.com/
