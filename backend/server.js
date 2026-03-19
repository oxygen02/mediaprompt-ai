/**
 * MediaPrompt AI Backend API
 * 对接腾讯云混元大模型 + 千问VL视频分析
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { URL } = require('url');
const { getVideoInfo, compressVideo, smartCompress, extractKeyFrames } = require('./utils/video-compress');
const { analyzeWithQwenVL, analyzeVideoFrames, QWEN_CONFIG } = require('./utils/qwen-vl-analyzer');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 文件上传配置
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 100 * 1024 * 1024 }  // 上限100MB
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
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    
    // 使用千问VL分析图片
    console.log('使用千问VL分析图片...');
    const systemPrompt = buildImagePrompt(outputOptions);
    const userPrompt = '请详细分析这张图片，并生成AI绘画提示词。';
    
    const result = await analyzeWithQwenVL(systemPrompt, [imageUrl], userPrompt);
    
    // 清理临时文件
    fs.unlinkSync(imagePath);
    
    res.json({
      success: true,
      category: 'image',
      outputOptions,
      result: result,
      model: 'qwen3-vl-plus',
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

// ==================== 视频处理 API ====================

// 获取视频信息
app.post('/api/video/info', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少视频文件' });
    }

    const videoPath = req.file.path;
    const info = await getVideoInfo(videoPath);
    
    // 清理临时文件
    fs.unlinkSync(videoPath);
    
    res.json({
      success: true,
      info: {
        width: info.width,
        height: info.height,
        duration: info.duration.toFixed(1),
        fileSize: info.fileSize.toFixed(2),
        fileSizeBytes: info.fileSizeBytes,
        needsCompression: info.fileSize > 50  // 超过50MB需要压缩
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取视频信息失败:', error);
    res.status(500).json({ 
      error: '获取视频信息失败', 
      message: error.message 
    });
  }
});

// 视频压缩
app.post('/api/video/compress', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少视频文件' });
    }

    const { quality = 'medium' } = req.body;
    const inputPath = req.file.path;
    const outputPath = inputPath.replace(/\.[^.]+$/, '_compressed.mp4');
    
    console.log(`开始压缩视频: ${inputPath}, 质量级别: ${quality}`);
    
    const result = await compressVideo(inputPath, outputPath, quality);
    
    // 清理原始文件
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    
    // 读取压缩后的文件并返回
    const compressedBuffer = fs.readFileSync(outputPath);
    const compressedBase64 = compressedBuffer.toString('base64');
    
    // 清理压缩后的临时文件
    fs.unlinkSync(outputPath);
    
    res.json({
      success: true,
      originalSize: result.originalSize.toFixed(2),
      compressedSize: result.compressedSize.toFixed(2),
      compressionRatio: result.compressionRatio,
      videoData: `data:video/mp4;base64,${compressedBase64}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('视频压缩失败:', error);
    res.status(500).json({ 
      error: '视频压缩失败', 
      message: error.message 
    });
  }
});

// 视频分析（使用千问VL）
app.post('/api/analyze/video', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少视频文件' });
    }

    const { outputOptions = ['prompt'], compress = 'auto' } = req.body;
    const inputPath = req.file.path;
    
    console.log(`开始分析视频: ${inputPath}, 压缩选项: ${compress}`);
    
    // 1. 获取原始视频信息
    const originalInfo = await getVideoInfo(inputPath);
    let videoPath = inputPath;
    
    // 2. 如果需要压缩或文件太大，自动压缩
    let compressedFilePath = null;
    if (compress === 'auto' && originalInfo.fileSize > 50) {
      console.log('视频文件过大，进行自动压缩...');
      compressedFilePath = inputPath.replace(/\.[^.]+$/, '_compressed.mp4');
      const compressResult = await compressVideo(inputPath, compressedFilePath, 'medium');
      console.log(`压缩完成: ${compressResult.compressionRatio}%`);
      videoPath = compressedFilePath;
    }
    
    // 3. 提取关键帧
    const framesDir = path.join('uploads', 'frames', Date.now().toString());
    const framePaths = await extractKeyFrames(videoPath, framesDir, 8);
    console.log(`提取了 ${framePaths.length} 个关键帧`);
    
    // 4. 将帧转为base64（简化处理，避免额外上传）
    const frameDataUrls = framePaths.map(framePath => {
      const buffer = fs.readFileSync(framePath);
      const base64 = buffer.toString('base64');
      return `data:image/jpeg;base64,${base64}`;
    });
    
    // 5. 调用千问VL分析
    console.log('调用千问VL API分析视频...');
    const analysisResult = await analyzeVideoFrames(frameDataUrls, outputOptions);
    
    // 6. 清理临时文件
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (compressedFilePath && fs.existsSync(compressedFilePath)) fs.unlinkSync(compressedFilePath);
      framePaths.forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
      if (fs.existsSync(framesDir)) fs.rmdirSync(framesDir);
    } catch (e) {
      console.error('清理临时文件失败:', e);
    }
    
    res.json({
      success: true,
      category: 'video',
      outputOptions,
      result: analysisResult,
      videoInfo: {
        originalSize: originalInfo.fileSize.toFixed(2),
        duration: originalInfo.duration.toFixed(1),
        frameCount: framePaths.length,
        wasCompressed: !!compressedFilePath
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('视频分析失败:', error);
    res.status(500).json({ 
      error: '视频分析失败', 
      message: error.message 
    });
  }
});

// 千问VL配置检查
app.get('/api/qwen/status', (req, res) => {
  res.json({
    configured: !!QWEN_CONFIG.apiKey,
    model: QWEN_CONFIG.model,
    apiKeyPrefix: QWEN_CONFIG.apiKey ? QWEN_CONFIG.apiKey.substring(0, 10) + '...' : '未配置'
  });
});

// ==================== 核心函数 ====================

/**
 * 构建系统提示词
 */
function buildSystemPrompt(category, outputOptions) {
  const prompts = {
    document: `你是一位专业的AI提示词逆向工程师。你的任务是：分析用户提供的AI生成内容，反推出"生成这样内容需要什么提示词"。

## 你的任务
用户会给你一份由AI生成的内容（文章、文案、代码等），你需要逆向分析：
1. 这份内容是什么类型的？（文章、故事、报告、营销文案等）
2. 生成这样内容需要什么样的提示词？
3. 提示词应该包含哪些关键要素？

## 输出格式
请直接输出可用于AI生成的提示词，格式如下：

---
**推测的原始提示词：**
\`\`\`
[这里是推测的原始提示词，要具体、可操作]
\`\`\`

**分析维度：**
1. **内容类型**：[文章/故事/报告/文案/代码等]
2. **风格特征**：[正式/轻松/幽默/专业/感性等]
3. **语言特点**：[简洁/详尽/口语化/书面语等]
4. **结构特点**：[总分总/并列式/递进式等]
5. **字数范围**：[估算字数]

**优化建议：**
[如何改进提示词，生成更好的效果]
---

## 重要原则
1. 提示词要具体、可执行，不要抽象描述
2. 提示词要包含角色设定、任务要求、输出格式
3. 分析要基于内容的实际特征，不要臆测
4. 输出要简洁清晰，便于用户理解和修改`,

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
