# MediaPrompt AI 项目检查与优化报告

**检查日期**: 2026-03-21  
**检查人**: 四喜 🍀  
**分工思路**: Claude Code (编排) + Codex CLI (后端) + Gemini CLI (前端)

---

## 📊 项目概览

| 维度 | 评分 | 说明 |
|------|------|------|
| 整体架构 | ⭐⭐⭐⭐ (4/5) | 前后端分离，技术选型合理 |
| 后端质量 | ⭐⭐⭐ (3/5) | 功能完整，但有重复代码和安全隐患 |
| 前端质量 | ⭐⭐⭐ (3/5) | 功能丰富，但代码臃肿需重构 |
| 文档完整性 | ⭐⭐⭐⭐ (4/5) | MVP文档和技术文档齐全 |

---

## 🔴 严重问题（需立即修复）

### 1. 后端安全漏洞

**问题**: API Key 硬编码风险
```javascript
// 当前代码中直接读取环境变量但没有验证
const CONFIG = {
  apiKey: process.env.AI_API_KEY || '',
  baseUrl: process.env.AI_BASE_URL || 'https://api.hunyuan.cloud.tencent.com/v1',
  model: process.env.AI_MODEL || 'hunyuan-lite',
};
```

**风险**: 
- 如果 .env 文件被意外提交到 git，会泄露密钥
- 没有 API Key 有效性验证

**修复建议**:
```javascript
// 添加启动时的配置验证
function validateConfig() {
  const required = ['AI_API_KEY', 'QWEN_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ 缺少必要的环境变量:', missing.join(', '));
    console.error('请复制 .env.example 到 .env 并填写配置');
    process.exit(1);
  }
}

// 启动时调用
validateConfig();
```

### 2. 临时文件清理不彻底

**问题**: `fs.unlinkSync` 在 catch 块中执行，如果抛出异常会中断

**修复建议**:
```javascript
// 使用 try-finally 确保清理
async function cleanupTempFiles(files) {
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    } catch (e) {
      console.error('清理文件失败:', file, e.message);
    }
  }
}
```

### 3. 文件上传没有大小和类型限制

**修复建议**:
```javascript
const upload = multer({
  dest: 'uploads/',
  limits: { 
    fileSize: 100 * 1024 * 1024  // 100MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = {
      'image': ['image/jpeg', 'image/png', 'image/webp'],
      'video': ['video/mp4', 'video/quicktime', 'video/webm'],
      'document': ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };
    // 实现类型检查...
  }
});
```

---

## 🟡 中等问题（建议优化）

### 4. 后端代码重复严重

**发现的问题**:
- `callAI` 和 `callAIWithImage` 有 80% 重复代码
- `buildSystemPrompt`, `buildImagePrompt`, `buildWebsitePrompt` 结构重复
- API 调用逻辑分散在多个函数

**Claude Code 建议 - 重构方案**:

创建统一的 AI 服务层:
```javascript
// services/ai-service.js
class AIService {
  constructor(provider, config) {
    this.provider = provider;
    this.config = config;
  }

  async chat(messages, options = {}) {
    // 统一的调用接口
  }

  async analyzeImage(imageBase64, prompt) {
    // 统一的多模态接口
  }
}

// providers/hunyuan.js
class HunyuanProvider {
  async chat(messages) { /* 实现 */ }
}

// providers/qwen.js  
class QwenProvider {
  async chat(messages) { /* 实现 */ }
  async analyzeVideo(frames, prompt) { /* 实现 */ }
}
```

### 5. 前端 page.tsx 过于臃肿

**现状**: 超过 1200 行，包含：
- 20+ 个状态变量
- 30+ 个处理函数
- UI 逻辑和业务逻辑混合

**Gemini CLI 建议 - 组件拆分方案**:

```
app/
├── page.tsx                 # 精简到 200 行以内
├── layout.tsx
├── sections/
│   ├── Header.tsx           # 顶部导航
│   ├── Sidebar.tsx          # 左侧导航
│   ├── UploadZone.tsx       # 上传区域
│   ├── AnalysisPanel.tsx    # AI 输出面板
│   ├── CreativeEditor.tsx   # 提示词再创作
│   └── ResultDisplay.tsx    # 结果展示
├── components/
│   ├── ModelSelector.tsx    # 模型选择器
│   ├── OutputOptions.tsx    # 输出选项
│   ├── VideoOptions.tsx     # 视频专属选项
│   ├── SocialShare.tsx      # 社交分享按钮
│   └── PromptLibrary.tsx    # 已有
└── hooks/
    ├── useAnalysis.ts       # 分析逻辑封装
    ├── useCreativeGen.ts    # 生成逻辑封装
    └── useHistory.ts        # 历史记录管理
```

### 6. React 性能问题

**发现的问题**:
```typescript
// 问题 1: 每次渲染都创建新函数
const handleCopy = useCallback(() => {
  navigator.clipboard.writeText(creativeResult);
  setMessage({ text: lang === 'zh' ? '已复制' : 'Copied!', type: 'success' });
}, [creativeResult, lang]);

// 问题 2: 大量内联函数
onClick={() => setLang('zh')}

// 问题 3: 没有使用 useMemo 缓存计算结果
const getOutputOptions = useCallback(() => { /* 每次都重新计算 */ }, [contentType]);
```

**优化后**:
```typescript
// 1. 预定义消息对象
const MESSAGES = {
  zh: { copied: '已复制', downloaded: '下载成功！' },
  en: { copied: 'Copied!', downloaded: 'Download complete!' }
};

// 2. 使用 useMemo 缓存选项
const outputOptions = useMemo(() => OPTIONS_MAP[contentType], [contentType]);

// 3. 事件处理抽离
const handleLangChange = useCallback((newLang: Language) => {
  setLang(newLang);
}, []);
```

### 7. API 接口设计不一致

**问题**:
- `/api/analyze/image` 接受 multipart/form-data
- `/api/analyze/text` 接受 application/json
- `/api/analyze/url` 参数命名不一致

**建议统一**:
```javascript
// 统一接口规范
POST /api/analyze
{
  type: 'image' | 'video' | 'document' | 'website',
  source: File | string,  // 文件或URL
  options: {...}
}
```

---

## 🟢 优化建议（提升体验）

### 8. 添加错误边界和加载状态

```typescript
// components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### 9. 添加 API 响应缓存

```typescript
// lib/cache.ts
const cache = new Map();

export async function cachedAnalyze(fileHash, analyzeFn) {
  if (cache.has(fileHash)) {
    return cache.get(fileHash);
  }
  const result = await analyzeFn();
  cache.set(fileHash, result);
  return result;
}
```

### 10. 添加分析和监控

```javascript
// middleware/analytics.js
function analyticsMiddleware(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
}
```

---

## 📋 优先级行动计划

### 阶段 1: 安全修复（本周）
- [ ] 添加环境变量验证
- [ ] 修复临时文件清理
- [ ] 添加文件类型和大小限制

### 阶段 2: 后端重构（下周）
- [ ] 创建 AI 服务层
- [ ] 统一 API 接口
- [ ] 添加测试用例

### 阶段 3: 前端重构（2周内）
- [ ] 拆分 page.tsx 为组件
- [ ] 优化 React 性能
- [ ] 添加错误边界

### 阶段 4: 功能增强（后续）
- [ ] 添加用户认证
- [ ] 实现真正的历史记录存储
- [ ] 添加分析结果缓存

---

## 🛠️ 立即可执行的优化

### 1. 创建 .env.example 模板
```bash
cd /root/.openclaw/workspace/mediaprompt-ai/backend
cat > .env.example << 'EOF'
# AI API 配置 (必填)
AI_API_KEY=your_hunyuan_api_key_here
QWEN_API_KEY=your_qwen_api_key_here

# 服务器配置
PORT=3001
NODE_ENV=development

# 可选配置
AI_MODEL=hunyuan-lite
AI_BASE_URL=https://api.hunyuan.cloud.tencent.com/v1
EOF
```

### 2. 添加 .gitignore 规则
```bash
cat >> /root/.openclaw/workspace/mediaprompt-ai/.gitignore << 'EOF'
# Environment
.env
.env.local
.env.production

# Uploads
uploads/
!uploads/.gitkeep

# Logs
logs/
*.log

# IDE
.vscode/
.idea/
*.swp
EOF
```

### 3. 创建简单的启动脚本
```bash
cat > /root/.openclaw/workspace/mediaprompt-ai/start.sh << 'EOF'
#!/bin/bash
# MediaPrompt AI 启动脚本

# 检查环境变量
if [ ! -f backend/.env ]; then
    echo "❌ 错误: backend/.env 不存在"
    echo "请复制 backend/.env.example 到 backend/.env 并填写配置"
    exit 1
fi

# 启动后端
echo "🚀 启动后端服务..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# 启动前端
echo "🚀 启动前端服务..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "✅ 服务已启动"
echo "  后端: http://localhost:3001"
echo "  前端: http://localhost:3000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获退出信号
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF
chmod +x /root/.openclaw/workspace/mediaprompt-ai/start.sh
```

---

## 📊 代码质量统计

| 文件 | 行数 | 问题数 | 建议 |
|------|------|--------|------|
| backend/server.js | 850+ | 12 | 需要模块化重构 |
| frontend/app/page.tsx | 1200+ | 18 | 需要组件拆分 |
| frontend/lib/api.ts | 120 | 3 | 接口可简化 |
| backend/utils/*.js | 400+ | 5 | 可合并为服务层 |

---

## 🎯 总结

### 做的好的地方 ✅
1. 功能完整，MVP 已实现核心需求
2. 技术选型合理（Next.js + Express）
3. 文档齐全，需求明确
4. AI 集成覆盖多种模型

### 需要改进的地方 🔧
1. **安全问题**: 环境变量验证、文件上传限制
2. **代码质量**: 前后端都有重复代码，需要模块化
3. **性能优化**: 前端需要组件拆分和缓存
4. **架构设计**: 需要统一 API 接口和服务层

### 下一步行动 🚀
1. 立即修复安全漏洞
2. 按优先级逐步重构
3. 添加自动化测试
4. 完善监控和日志

---

*报告由 四喜 🍀 生成*  
*遵循 Claude Code + Codex CLI + Gemini CLI 分工思路*
