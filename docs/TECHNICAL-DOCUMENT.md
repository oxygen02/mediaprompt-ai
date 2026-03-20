# PromptBox AI - 技术文档

> 版本：v1.0 (基于 index-v20)  
> 更新日期：2026-03-18

---

## 一、项目概述

### 1.1 项目名称
PromptBox AI - 内容反向工程工具箱

### 1.2 项目描述
一款帮助非技术用户从已有内容中提炼 AI 提示词的 Web 应用。

### 1.3 技术选型

| 层级 | 技术 | 版本 |
|------|------|------|
| 前端框架 | Next.js | 16.x |
| 样式框架 | Tailwind CSS | 4.x |
| 编程语言 | TypeScript | 5.x |
| 后端框架 | Express.js | 4.x |
| AI 模型 | 腾讯云混元 | hunyuan-lite |
| 云存储 | 腾讯云 COS | - |
| 代码托管 | GitHub | - |

---

## 二、前端架构

### 2.1 目录结构

```
promptbox-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 主页面
│   │   ├── globals.css     # 全局样式
│   │   └── api/            # API 路由
│   │       └── analyze/
│   │           ├── file/route.ts
│   │           └── text/route.ts
│   └── components/         # 组件（可选）
├── public/
│   └── reference.html      # 参考原型
├── package.json
├── tailwind.config.ts
└── next.config.ts
```

### 2.2 页面布局

#### 左侧固定导航栏
- **位置**：`position: fixed; top: 0; left: 0; height: 100vh;`
- **宽度**：208px (w-52)
- **内容**：
  - Logo 区域（h-14）
  - 分析工具（文档/图片/视频/网页）
  - 案例展示（文档/图片/视频/网页案例）
  - 个人中心（历史记录/设置）
  - 用户信息区

#### 顶部导航栏
- **高度**：56px (h-14)
- **位置**：`sticky top-0`
- **内容**：
  - 左侧：首页/定价/关于
  - 中间：月食动画 + Slogan
  - 右侧：语言切换/登录/注册

#### 固定副标题区域
- **位置**：`position: fixed; top: 56px; left: 208px;`
- **z-index**：25
- **内容**：
  - 副标题文字
  - 四个月食类别按钮

### 2.3 核心样式

#### 月食动画

```css
/* 月亮基础样式 */
.moon-base {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    #e4e4e7 0%, #d4d4d8 25%, #a1a1aa 55%, #71717a 80%, #52525b 100%);
  animation: moonRotate 20s linear infinite;
}

/* 旋转动画 */
@keyframes moonRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 月食吞噬效果 */
@keyframes lunarEclipseReal {
  0% { box-shadow: inset 0 0 0 0 rgba(15,15,26,0); }
  25% { box-shadow: inset 8px 0 0 0 rgba(15,15,26,0.7); }
  50% { box-shadow: inset 18px 0 0 0 rgba(15,15,26,0.95); }
  75% { box-shadow: inset 8px 0 0 0 rgba(15,15,26,0.7); }
  100% { box-shadow: inset 0 0 0 0 rgba(15,15,26,0); }
}
```

#### 分类月食图标

```css
.moon-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    #f5f5f5 0%, #e5e5e5 40%, #d4d4d4 70%, #a3a3a3 100%);
}

.moon-95 { box-shadow: inset 14px 0 0 0 rgba(20,20,25,0.9); }  /* 文档 90%黑 */
.moon-70 { box-shadow: inset 11px 0 0 0 rgba(20,20,25,0.9); }  /* 图片 70%黑 */
.moon-40 { box-shadow: inset 6px 0 0 0 rgba(20,20,25,0.9); }   /* 视频 40%黑 */
.moon-full { box-shadow: inset 2px 0 0 0 rgba(20,20,25,0.9); } /* 网页 10%黑 */
```

#### 结构化提示词样式

```css
.prompt-block { 
  background: #fafafa; 
  border-left: 3px solid #52525b; 
  padding: 8px 12px; 
  margin-bottom: 8px; 
  border-radius: 0 6px 6px 0; 
}

.prompt-block.workflow { border-left-color: #71717a; }
.prompt-block.examples { border-left-color: #a1a1aa; }
.prompt-block.init { border-left-color: #52525b; }
```

### 2.4 状态管理

```typescript
type Category = 'document' | 'image' | 'video' | 'website';

// 主要状态
const [currentType, setCurrentType] = useState<Category>('document');
const [isLoading, setIsLoading] = useState(false);
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [selectedOptions, setSelectedOptions] = useState<string[]>(['prompt']);
```

---

## 三、后端架构

### 3.1 目录结构

```
backend/
├── server.js           # Express 服务器
├── server-sdk.js       # 腾讯云 SDK 版本
├── package.json
└── .env                # 环境变量
```

### 3.2 API 接口

#### 文件分析接口

```http
POST /api/analyze/file
Content-Type: multipart/form-data

参数：
- file: 文件
- category: 类别 (document|image|video|website)
- outputOptions: 输出选项 JSON 数组

响应：
{
  "success": true,
  "result": "结构化提示词内容"
}
```

#### 文本分析接口

```http
POST /api/analyze/text
Content-Type: application/json

参数：
{
  "text": "文本内容",
  "category": "document",
  "outputOptions": ["提示词", "大纲梗概"]
}

响应：
{
  "success": true,
  "result": "结构化提示词内容"
}
```

### 3.3 腾讯云混元调用

```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs");
const HunyuanClient = tencentcloud.hunyuan.v20230901.Client;

// 配置
const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: "ap-guangzhou",
};

// 调用模型
const client = new HunyuanClient(clientConfig);
const response = await client.ChatCompletions({
  Model: "hunyuan-lite",
  Messages: [
    { Role: "user", Content: prompt }
  ]
});
```

---

## 四、部署配置

### 4.1 服务器信息

| 项目 | 值 |
|------|------|
| 服务器 IP | 124.156.200.127 |
| 前端端口 | 3002 |
| 后端端口 | 3001 |
| 操作系统 | Ubuntu Linux |

### 4.2 环境变量

```bash
# 腾讯云凭证（请使用环境变量，不要提交到代码库）
TENCENT_SECRET_ID=<your-secret-id>
TENCENT_SECRET_KEY=<your-secret-key>

# AI API
AI_API_KEY=<your-api-key>

# COS 配置
COS_BUCKET=oliveryoung1983-1409675040
COS_REGION=ap-singapore
```

### 4.3 启动命令

```bash
# 前端
cd /root/.openclaw/workspace/project/promptbox-web
npm run dev -- -H 0.0.0.0 -p 3002

# 后端
cd /root/.openclaw/workspace/promptbox-ai/backend
node server.js
```

---

## 五、GitHub 仓库

### 5.1 仓库信息

| 项目 | 值 |
|------|------|
| 仓库地址 | https://github.com/oxygen02/promptbox-ai |
| 默认分支 | master |
| Next.js 分支 | nextjs |

### 5.2 推送命令

```bash
git add .
git commit -m "feat: update MVP features"
git push origin master
```

---

## 六、COS 存储

### 6.1 存储桶信息

| 项目 | 值 |
|------|------|
| Bucket | oliveryoung1983-1409675040 |
| Region | ap-singapore |
| 访问权限 | public-read |

### 6.2 文件列表

| 文件 | URL |
|------|------|
| index-v20.html | https://oliveryoung1983-1409675040.cos.ap-singapore.myqcloud.com/promptbox/index-v20.html |
| index-v21.html | https://oliveryoung1983-1409675040.cos.ap-singapore.myqcloud.com/promptbox/index-v21.html |
| cases.html | https://oliveryoung1983-1409675040.cos.ap-singapore.myqcloud.com/promptbox/cases.html |

---

## 七、模型选择配置

### 7.1 国内模型

| 模型 | value | 说明 |
|------|-------|------|
| 文心一言 | wenxin | 百度 |
| 通义千问 | qwen | 阿里 |
| 智谱清言 | zhipu | 智谱AI |
| 讯飞星火 | spark | 科大讯飞 |

### 7.2 国际模型

| 模型 | value | 说明 |
|------|-------|------|
| GPT-4o | gpt4 | OpenAI |
| Claude 3.5 | claude | Anthropic |
| Gemini Pro | gemini | Google |
| Llama 3 | llama | Meta |

---

## 八、输出选项配置

### 8.1 文档分析

| 选项 | value |
|------|-------|
| 提示词 | prompt |
| 大纲梗概 | outline |
| 结构分析 | structure |
| 关键词 | keywords |

### 8.2 图片分析

| 选项 | value |
|------|-------|
| 提示词 | prompt |
| 风格描述 | style |
| 配色方案 | colors |
| 参数建议 | params |

### 8.3 视频分析

| 选项 | value |
|------|-------|
| 提示词 | prompt |
| 分镜脚本 | storyboard |
| 节奏分析 | pacing |
| 推荐工具 | tools |

### 8.4 网页分析

| 选项 | value |
|------|-------|
| 提示词 | prompt |
| 功能列表 | features |
| MVP文档 | mvp |
| 技术栈 | tech |

---

## 九、提示词资源网站

### 9.1 文字文案类
- **Promptly** - https://promptly.works/ （综合性社区）

### 9.2 图片类
- **Lexica** - https://lexica.art/ （SD 图像搜索）
- **PromptCat** - https://promptcat.io/ （提示词分享）
- **Prompt.Gacha** - https://prompt-gacha.com/ （图片反推）

### 9.3 视频类
- **Sora 2提示词合集库** - https://sora2prompts.com/
- **VideoPrompt** - https://videoprompt.com/

### 9.4 网页设计类
- **Style2image** - https://www.style2image.com/

---

## 十、开发注意事项

### 10.1 安全
- ❌ 不要将 SecretId/SecretKey 提交到 GitHub
- ✅ 使用环境变量存储敏感信息
- ✅ GitHub Push Protection 会自动检测泄露

### 10.2 性能
- 输出结果区域限制高度 280px，超出滚动
- 使用 CSS 动画而非 JS 动画
- 图片使用懒加载

### 10.3 兼容性
- 使用系统字体（PingFang SC / Microsoft YaHei）
- 支持 Chrome / Firefox / Safari 最新版
- 移动端适配待实现
