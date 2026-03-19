# MediaPrompt AI - 技术文档 v1.0

## 项目结构

```
mediaprompt-ai/
├── frontend/                    # Next.js 前端项目
│   ├── app/
│   │   ├── layout.tsx          # 根布局组件
│   │   ├── page.tsx           # 主页面组件
│   │   ├── globals.css        # 全局样式
│   │   └── favicon.ico        # 网站图标
│   ├── lib/
│   │   └── i18n.ts            # 国际化配置
│   ├── public/                 # 静态资源
│   ├── package.json            # 依赖配置
│   ├── next.config.js          # Next.js 配置
│   └── tsconfig.json           # TypeScript 配置
│
├── backend/                     # Express 后端项目
│   ├── src/
│   │   ├── index.ts           # 入口文件
│   │   ├── routes/
│   │   │   └── api.ts        # API 路由
│   │   ├── services/
│   │   │   └── ai.ts         # AI 服务封装
│   │   └── utils/
│   │       └── file.ts        # 文件处理工具
│   ├── package.json            # 依赖配置
│   └── tsconfig.json           # TypeScript 配置
│
├── MVP_REQUIREMENTS.md         # MVP 需求文档
└── README.md                   # 项目说明
```

---

## 前端架构

### 核心技术栈

| 技术 | 版本 | 说明 |
|-----|------|-----|
| Next.js | 14.x | React 框架，App Router |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 原子化 CSS |
| React | 18.x | UI 库 |

### 页面组件结构

```
page.tsx (主页面)
├── Header (顶部导航栏)
│   ├── Logo
│   ├── NavLinks (首页/定价/关于)
│   ├── LanguageSwitch (中英文切换)
│   └── AuthButtons (登录/注册)
│
├── Sidebar (左侧导航栏)
│   ├── Logo
│   ├── NavItems (工具/案例/个人)
│   └── UserInfo
│
├── FixedHeader (顶部副标题区域)
│   ├── Subtitle
│   └── CategoryButtons (文档/图片/视频/网页)
│
└── MainContent (主内容区)
    ├── Message (消息提示)
    ├── ThinkingCollapse (AI分析折叠区)
    │
    ├── UploadZone (上传区域)
    │   ├── FileUpload
    │   └── OutputOptions (提示词选项)
    │
    ├── ModelSelector (分析模型选择)
    │   └── AnalyzeButton (开始分析)
    │
    ├── VideoOptions (视频专属选项)
    │
    ├── EditorArea (提示词再创作)
    │
    ├── CreativeSection (创意类似+)
    │   ├── SourceFileButton
    │   ├── ModelSelector
    │   └── GenerateButton
    │
    ├── OutputArea (生成结果区)
    │   ├── MoonAnimation
    │   └── ResultContent
    │
    └── ShareSection (分享区)
```

### 核心状态管理

```typescript
// 内容类型
type ContentType = 'document' | 'image' | 'video' | 'website';

// 核心状态
const [contentType, setContentType] = useState<ContentType>('document');
const [lang, setLang] = useState<'zh' | 'en'>('zh');
const [uploadedFile, setUploadedFile] = useState<File | null>(null);
const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
const [selectedAnalysisModel, setSelectedAnalysisModel] = useState('auto');
const [isLoading, setIsLoading] = useState(false);
const [result, setResult] = useState('');
const [thinkingExpanded, setThinkingExpanded] = useState(false);
const [editorContent, setEditorContent] = useState('');
const [sourceFile, setSourceFile] = useState<File | null>(null);
const [selectedModel, setSelectedModel] = useState('auto');
const [isGenerating, setIsGenerating] = useState(false);
const [creativeResult, setCreativeResult] = useState('');
```

### 国际化方案

```typescript
// lib/i18n.ts
const translations = {
  zh: {
    'upload.drag': '拖放文件到此处，或点击上传',
    'btn.analyze': '开始分析',
    'btn.similar': '创意类似+',
    // ...
  },
  en: {
    'upload.drag': 'Drag & drop file here, or click to upload',
    'btn.analyze': 'Start Analysis',
    'btn.similar': 'Create Similar+',
    // ...
  }
};
```

---

## 后端架构

### 核心技术栈

| 技术 | 版本 | 说明 |
|-----|------|-----|
| Node.js | 22.x | 运行时 |
| Express | 4.x | Web 框架 |
| TypeScript | 5.x | 类型安全 |
| multer | 1.4 | 文件上传 |
| dotenv | 16.x | 环境变量 |

### API 接口

#### 1. 内容分析接口

```typescript
// POST /api/analyze
interface AnalyzeRequest {
  file: File;           // 上传的文件
  contentType: string;  // document | image | video | website
  model: string;        // 选择的分析模型
  options: string[];    // 选中的分析维度
}

interface AnalyzeResponse {
  success: boolean;
  result: string;       // 整合后的提示词
  steps: string[];      // 分析过程各步骤结果
}
```

#### 2. 内容生成接口

```typescript
// POST /api/generate
interface GenerateRequest {
  prompt: string;       // 提示词
  sourceFile?: File;    // 可选的源文件
  contentType: string;  // 生成内容类型
  model: string;        // 选择的生成模型
}

interface GenerateResponse {
  success: boolean;
  result: string;       // 生成结果
}
```

### AI 服务封装

```typescript
// services/ai.ts
export class AIService {
  // 腾讯云混元
  async hunyuanAnalyze(prompt: string, file: File): Promise<string> {
    // 调用混元API进行分析
  }
  
  // 阿里云千问
  async qwenAnalyze(prompt: string, file: File): Promise<string> {
    // 调用千问API进行分析
  }
  
  // GPT-4o
  async gptAnalyze(prompt: string, file: File): Promise<string> {
    // 调用OpenAI API进行分析
  }
}
```

---

## 样式规范

### 全局 CSS 变量

```css
/* globals.css */
:root {
  --color-bg: #f5f5f7;
  --color-text: #374151;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --radius-lg: 12px;
  --radius-md: 8px;
  --spacing-block: 20px;
  --transition: 300ms ease-in-out;
}
```

### 组件样式

```css
/* 月亮图标 */
.moon-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    #f5f5f5 0%, 
    #e5e5e5 40%, 
    #d4d4d4 70%, 
    #a3a3a3 100%
  );
}

/* 月蚀效果 */
.moon-95 { box-shadow: inset 14px 0 0 0 rgba(20,20,25,0.9); }
.moon-70 { box-shadow: inset 11px 0 0 0 rgba(20,20,25,0.9); }
.moon-40 { box-shadow: inset 6px 0 0 0 rgba(20,20,25,0.9); }
.moon-full { box-shadow: inset 2px 0 0 0 rgba(20,20,25,0.9); }

/* 流星动画 */
.meteor {
  position: absolute;
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, white, transparent);
  opacity: 0;
  animation: meteor-fall 3s linear infinite;
}
```

---

## 部署配置

### PM2 进程管理

```bash
# 启动前端
pm2 start npm --name "mediaprompt-frontend" -- run dev

# 启动后端
pm2 start npm --name "mediaprompt-api" -- run dev

# 查看状态
pm2 status

# 重启
pm2 restart mediaprompt-frontend
pm2 restart mediaprompt-api
```

### Nginx 配置（可选）

```nginx
server {
    listen 80;
    server_name 124.156.200.127;
    
    location / {
        proxy_pass http://localhost:3002;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

### 环境变量

```bash
# .env (后端)
HUNYUAN_API_KEY=sk-TYBFiCJwEglKf8PV5yAaFIuTJnDaW5PJ3mfMxim3QUAPp5xC
QWEN_API_KEY=sk-sp-b8c22cf63b4e42bd888d16f76d27a0e0
PORT=3001
```

---

## 核心算法

### 1. 内容分析维度提取

```typescript
function getAnalysisDimensions(contentType: string, selectedOptions: string[]): string {
  const dimensionMap = {
    document: {
      theme: '核心主题',
      genre: '文案体裁',
      langStyle: '语言风格',
      tone: '语气情感',
      structure: '内容结构',
      wordCount: '字数长度',
      audience: '目标受众',
      scenario: '使用场景',
      keywords: '核心关键词'
    },
    // ... 其他类型
  };
  
  // 构建分析 prompt
  const dimensions = selectedOptions
    .map(opt => dimensionMap[contentType]?.[opt])
    .filter(Boolean);
  
  return `请分析以下内容，按照以下维度提取：${dimensions.join('、')}`;
}
```

### 2. 提示词整合

```typescript
function integratePrompts(analysisResults: Record<string, string>): string {
  let prompt = '';
  
  // 添加各维度分析结果
  for (const [dimension, result] of Object.entries(analysisResults)) {
    prompt += `【${dimension}】${result}\n`;
  }
  
  // 添加整合提示词
  prompt += '\n━━━━ 整合提示词 ━━━━\n';
  prompt += generateIntegratedPrompt(analysisResults);
  
  return prompt;
}
```

---

## 性能优化

### 前端优化

1. **代码分割**
   - 使用 Next.js App Router 自动代码分割
   - 动态导入非核心组件

2. **图片优化**
   - 使用 Next.js Image 组件
   - 懒加载非首屏图片

3. **缓存策略**
   - 静态资源长期缓存
   - API 响应短期缓存

### 后端优化

1. **请求合并**
   - 批量处理文件上传
   - 减少 API 调用次数

2. **缓存**
   - 常用提示词模板缓存
   - 模型响应缓存

---

## 安全考虑

1. **文件上传**
   - 文件大小限制（50MB）
   - 文件类型验证
   - 病毒扫描（可选）

2. **API 安全**
   - API Key 保护
   - 请求频率限制
   - 输入验证

3. **用户数据**
   - 敏感信息加密
   - 会话管理

---

## 测试策略

### 单元测试
- 工具函数测试
- 组件渲染测试

### 集成测试
- API 接口测试
- 前后端联调测试

### E2E 测试
- 用户旅程测试
- 跨浏览器测试

---

## 文档版本
- **版本：** v1.0
- **日期：** 2026-03-19
- **状态：** MVP 固定版本
