/**
 * MediaPrompt AI Backend API
 * 使用腾讯云混元大模型 SDK
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

// 腾讯云混元 SDK
const tencentcloud = require("tencentcloud-sdk-nodejs");
const HunyuanClient = tencentcloud.hunyuan.v20230901.Client;

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 文件上传配置
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }
});

// 腾讯云配置
const TENCENT_CONFIG = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || 'ap-guangzhou',
  profile: {
    httpProfile: {
      endpoint: "hunyuan.tencentcloudapi.com",
    },
  },
};

// 创建混元客户端
function createClient() {
  return new HunyuanClient(TENCENT_CONFIG);
}

// ==================== API 路由 ====================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    model: 'hunyuan-lite',
    auth: 'tencent-sdk',
    hasCredentials: !!(TENCENT_CONFIG.credential.secretId && TENCENT_CONFIG.credential.secretKey)
  });
});

// 文本分析 - 生成结构化提示词
app.post('/api/analyze/text', async (req, res) => {
  try {
    const { content, category = 'document', outputOptions = ['prompt'] } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: '缺少内容参数' });
    }

    const systemPrompt = buildSystemPrompt(category, outputOptions);
    const result = await callHunyuan(systemPrompt, content);
    
    res.json({
      success: true,
      category,
      outputOptions,
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('分析失败:', error);
    res.status(500).json({ 
      error: '分析失败', 
      message: error.message 
    });
  }
});

// 图片分析
app.post('/api/analyze/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少图片文件' });
    }

    const { outputOptions = ['prompt'] } = req.body;
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const systemPrompt = buildImagePrompt(outputOptions);
    const result = await callHunyuanVision(systemPrompt, base64Image);
    
    fs.unlinkSync(imagePath);
    
    res.json({
      success: true,
      category: 'image',
      outputOptions,
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('图片分析失败:', error);
    res.status(500).json({ 
      error: '图片分析失败', 
      message: error.message 
    });
  }
});

// 文件上传分析
app.post('/api/analyze/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少文件' });
    }

    const { category = 'document', outputOptions = ['prompt'] } = req.body;
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    const systemPrompt = buildSystemPrompt(category, outputOptions);
    const result = await callHunyuan(systemPrompt, fileContent);
    
    fs.unlinkSync(filePath);
    
    res.json({
      success: true,
      category,
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('文件分析失败:', error);
    res.status(500).json({ 
      error: '文件分析失败', 
      message: error.message 
    });
  }
});

// 模拟输出预览
app.post('/api/preview', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: '缺少提示词' });
    }

    const result = await callHunyuan(
      '你是一个专业的AI助手，请根据用户提供的提示词生成一个高质量的示例输出。',
      prompt
    );
    
    res.json({
      success: true,
      model: 'hunyuan-lite',
      preview: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('预览生成失败:', error);
    res.status(500).json({ 
      error: '预览生成失败', 
      message: error.message 
    });
  }
});

// ==================== 核心函数 ====================

function buildSystemPrompt(category, outputOptions) {
  const prompts = {
    document: `你是一位专业的内容分析专家，擅长从文档中提炼核心信息并生成结构化的AI提示词。

请分析用户提供的文档内容，按照以下格式输出：

## Role
[定义AI助手的角色定位]

## Background
[描述任务背景和用户需求]

## Profile
[详细描述AI助手的专业背景和能力]

## Skills
[列出所需的核心技能，用逗号分隔]

## Goals
[明确任务目标]

## Constrains
[列出约束条件和注意事项]

## OutputFormat
[定义输出格式要求]

## Workflow
[列出工作流程步骤]

## Examples
[提供2-3个示例]

## Initialization
[初始化问候语]`,
    image: `你是一位专业的图像分析专家，擅长分析图片并生成AI绘画提示词。

请分析用户描述的图片内容，生成可用于 Midjourney / Stable Diffusion / DALL-E 的提示词。

输出格式：
- 主体描述
- 风格标签
- 构图建议
- 光影描述
- 色彩方案
- 参数建议`,
    video: `你是一位专业的视频内容分析师，擅长分析视频并生成创作提示词。

请分析用户提供的视频描述，生成可用于 Sora / Runway / HeyGen 的提示词。

输出格式：
- 场景描述
- 镜头运动
- 人物动作
- 环境氛围
- 音效建议`,
    website: `你是一位专业的网页设计师，擅长分析网站并生成设计提示词。

请分析用户提供的网页描述，生成可用于前端开发的提示词。

输出格式：
- 页面结构
- 设计风格
- 配色方案
- 交互建议
- 技术栈推荐`
  };
  return prompts[category] || prompts.document;
}

function buildImagePrompt(outputOptions) {
  return `你是一位专业的图像分析师，请分析这张图片并生成以下内容：

${outputOptions.includes('prompt') ? '- AI绘画提示词（适用于Midjourney/SD）' : ''}
${outputOptions.includes('style') ? '- 风格描述' : ''}
${outputOptions.includes('colors') ? '- 配色方案（提供HEX色值）' : ''}
${outputOptions.includes('params') ? '- 参数建议（分辨率、采样器等）' : ''}

请详细分析图片的主体、构图、光影、色彩、风格等元素。`;
}

/**
 * 调用腾讯云混元大模型
 */
async function callHunyuan(systemPrompt, userContent) {
  const client = createClient();
  
  const params = {
    Model: 'hunyuan-lite',
    Messages: [
      { Role: 'system', Content: systemPrompt },
      { Role: 'user', Content: userContent }
    ],
    Temperature: 0.7,
    TopP: 0.8,
  };
  
  const response = await client.ChatCompletions(params);
  
  if (response.Choices && response.Choices[0]) {
    return response.Choices[0].Message.Content;
  }
  
  throw new Error('API返回格式异常');
}

/**
 * 调用混元多模态模型（图片分析）
 */
async function callHunyuanVision(systemPrompt, base64Image) {
  const client = createClient();
  
  const params = {
    Model: 'hunyuan-vision',
    Messages: [
      { Role: 'system', Content: systemPrompt },
      { 
        Role: 'user', 
        Contents: [
          { Type: 'image_url', ImageUrl: { Url: `data:image/jpeg;base64,${base64Image}` } },
          { Type: 'text', Text: '请分析这张图片' }
        ]
      }
    ],
  };
  
  const response = await client.ChatCompletions(params);
  
  if (response.Choices && response.Choices[0]) {
    return response.Choices[0].Message.Content;
  }
  
  throw new Error('API返回格式异常');
}

// ==================== 启动服务 ====================

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`🚀 MediaPrompt API 服务已启动`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`🤖 模型: hunyuan-lite`);
  console.log(`🔐 认证: 腾讯云 SDK`);
  console.log(`🔑 SecretId: ${TENCENT_CONFIG.credential.secretId ? '已配置' : '未配置'}`);
  console.log(`📅 时间: ${new Date().toISOString()}`);
});

module.exports = app;
