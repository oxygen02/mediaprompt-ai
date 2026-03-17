/**
 * MediaPrompt AI Backend API
 * 对接腾讯云混元大模型 + OpenAI兼容API
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { URL } = require('url');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 文件上传配置
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }
});

// 配置
const CONFIG = {
  apiKey: process.env.AI_API_KEY || '',
  baseUrl: process.env.AI_BASE_URL || 'https://api.hunyuan.cloud.tencent.com/v1',
  model: process.env.AI_MODEL || 'hunyuan-lite',
};

// ==================== API 路由 ====================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    model: CONFIG.model,
    hasApiKey: !!CONFIG.apiKey
  });
});

// 文本分析 - 生成结构化提示词
app.post('/api/analyze/text', async (req, res) => {
  try {
    const { content, category = 'document', outputOptions = ['prompt'] } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: '缺少内容参数' });
    }

    // 构建系统提示词
    const systemPrompt = buildSystemPrompt(category, outputOptions);
    
    // 调用大模型
    const result = await callAI(systemPrompt, content);
    
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
    
    // 读取图片并转 base64
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    // 构建图片分析提示词
    const systemPrompt = buildImagePrompt(outputOptions);
    const result = await callAIWithImage(systemPrompt, base64Image);
    
    // 清理临时文件
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
    
    // 读取文件内容
    const filePath = req.file.path;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // 分析内容
    const systemPrompt = buildSystemPrompt(category, outputOptions);
    const result = await callAI(systemPrompt, fileContent);
    
    // 清理临时文件
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

    // 使用提示词生成示例输出
    const result = await callAI(
      '你是一个专业的AI助手，请根据用户提供的提示词生成一个高质量的示例输出。保持简洁，',
      prompt
    );
    
    res.json({
      success: true,
      model: CONFIG.model,
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

/**
 * 构建系统提示词
 */
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

/**
 * 构建图片分析提示词
 */
function buildImagePrompt(outputOptions) {
  return `你是一位专业的图像分析师，请分析这张图片并生成以下内容：

${outputOptions.includes('prompt') ? '- AI绘画提示词（适用于Midjourney/SD）' : ''}
${outputOptions.includes('style') ? '- 风格描述' : ''}
${outputOptions.includes('colors') ? '- 配色方案（提供HEX色值）' : ''}
${outputOptions.includes('params') ? '- 参数建议（分辨率、采样器等）' : ''}

请详细分析图片的主体、构图、光影、色彩、风格等元素。`;
}

/**
 * 调用 AI 大模型（OpenAI兼容格式）
 */
async function callAI(systemPrompt, userContent) {
  const apiKey = CONFIG.apiKey;
  const baseUrl = CONFIG.baseUrl;
  
  const requestBody = {
    model: CONFIG.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.7,
    max_tokens: 2000
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestBody);
    
    const options = {
      hostname: 'api.hunyuan.cloud.tencent.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          console.log('API Response:', data.substring(0, 200));
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
          } else if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('API返回格式异常: ' + data.substring(0, 100)));
          }
        } catch (e) {
          console.error('JSON Parse Error:', e.message, 'Data:', data.substring(0, 200));
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('Request Error:', e);
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

/**
 * 调用 AI 大模型（带图片）
 */
async function callAIWithImage(systemPrompt, base64Image) {
  const apiKey = CONFIG.apiKey;
  const baseUrl = CONFIG.baseUrl;
  
  const url = new URL('/chat/completions', baseUrl);
  
  const requestBody = {
    model: CONFIG.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { 
        role: 'user', 
        content: [
          { type: 'text', text: '请分析这张图片' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    temperature: 0.7,
    max_tokens: 2000
  };

  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
          } else if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('API返回格式异常'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(requestBody));
    req.end();
  });
}

// ==================== 启动服务 ====================

// 确保上传目录存在
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`🚀 MediaPrompt API 服务已启动`);
  console.log(`📍 地址: http://localhost:${PORT}`);
  console.log(`🤖 模型: ${CONFIG.model}`);
  console.log(`🔑 API Key: ${CONFIG.apiKey ? '已配置' : '未配置'}`);
  console.log(`🌐 Base URL: ${CONFIG.baseUrl}`);
  console.log(`📅 时间: ${new Date().toISOString()}`);
});

module.exports = app;
