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
const mammoth = require('mammoth');
const puppeteer = require('puppeteer-core');
const { getVideoInfo, compressVideo, smartCompress, extractKeyFrames } = require('./utils/video-compress');
const { analyzeWithQwenVL, analyzeVideoFrames, QWEN_CONFIG } = require('./utils/qwen-vl-analyzer');
const { smartCompressImage } = require('./utils/image-compress');
const { generateImage } = require('./utils/image-generate');

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
      result: cleanResult(result),
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

// 图片分析（支持普通图片和网页截图）
app.post('/api/analyze/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '缺少图片文件' });
    }

    const { category = 'image', outputOptions = ['subject', 'style', 'composition'], detailLevel = 'detailed', lang = 'zh' } = req.body;
    const parsedOptions = typeof outputOptions === 'string' ? JSON.parse(outputOptions) : outputOptions;

    // 读取图片
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);

    // 智能压缩图片（超过1MB则压缩）
    console.log(`原始图片大小: ${(imageBuffer.length / 1024).toFixed(1)} KB`);
    const { buffer: compressedBuffer, compressed, originalSize, compressedSize } = await smartCompressImage(imageBuffer, 1024);
    console.log(`压缩后大小: ${compressedSize.toFixed(1)} KB${compressed ? ' (已压缩)' : ''}`);

    // 转 base64
    const base64Image = compressedBuffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // 根据类别选择提示词
    let systemPrompt, userPrompt;
    if (category === 'website') {
      // 网页截图分析
      console.log('使用千问VL分析网页截图...');
      systemPrompt = buildWebsitePrompt(parsedOptions, lang);
      userPrompt = lang === 'en'
        ? 'Please analyze this website screenshot in detail.'
        : '请详细分析这张网页截图，生成可用于复刻该网页的提示词。';
    } else {
      // 普通图片分析
      console.log('使用千问VL分析图片...');
      systemPrompt = buildImagePrompt(parsedOptions, lang);
      userPrompt = lang === 'en'
        ? 'Please analyze this image in detail and generate an AI art prompt.'
        : '请详细分析这张图片，并生成AI绘画提示词。';
    }

    const result = await analyzeWithQwenVL(systemPrompt, [imageUrl], userPrompt);

    // 清理临时文件
    fs.unlinkSync(imagePath);

    res.json({
      success: true,
      category,
      outputOptions,
      result: cleanResult(result),
      model: 'qwen3-vl-plus',
      compressed,
      originalSize: `${originalSize.toFixed(1)} KB`,
      compressedSize: `${compressedSize.toFixed(1)} KB`,
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

    const { category = 'document', outputOptions = ['prompt'], detailLevel = 'detailed' } = req.body;
    const parsedOptions = typeof outputOptions === 'string' ? JSON.parse(outputOptions) : outputOptions;

    // 读取文件内容
    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname || '').toLowerCase();

    let fileContent = '';

    // 根据文件类型读取内容
    if (fileExt === '.docx') {
      // 使用 mammoth 读取 docx 文件
      const result = await mammoth.extractRawText({ path: filePath });
      fileContent = result.value;
    } else if (fileExt === '.pdf') {
      // PDF 文件需要额外的处理库
      fileContent = fs.readFileSync(filePath, 'utf-8');
    } else {
      // 文本文件直接读取
      fileContent = fs.readFileSync(filePath, 'utf-8');
    }

    if (!fileContent || fileContent.trim().length === 0) {
      return res.status(400).json({ error: '文件内容为空或无法读取' });
    }

    // 限制内容长度，避免API报错
    const maxContentLength = 10000; // 约1万字符
    let truncatedContent = fileContent;
    if (fileContent.length > maxContentLength) {
      truncatedContent = fileContent.substring(0, maxContentLength) + '\n\n...(内容过长已截断)';
    }

    // 分析内容
    const systemPrompt = buildSystemPrompt(category, parsedOptions, detailLevel);
    const result = await callAI(systemPrompt, truncatedContent);

    // 清理临时文件
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      category,
      result: cleanResult(result),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('文件分析失败:', error);
    // 返回用户友好的错误信息
    let errorMessage = error.message;
    if (error.message.includes('too large')) {
      errorMessage = '文件内容过长，请上传较小的文件（建议5000字以内）';
    }
    res.status(500).json({
      error: '文件分析失败',
      message: errorMessage
    });
  }
});

// URL网页分析
app.post('/api/analyze/url', async (req, res) => {
  try {
    const { url, outputOptions = ['prompt'], detailLevel = 'detailed', lang = 'zh' } = req.body;

    if (!url) {
      return res.status(400).json({ error: '缺少网址' });
    }

    // 验证URL格式
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch (e) {
      return res.status(400).json({ error: '网址格式不正确' });
    }

    console.log(`开始分析网页: ${url}`);

    // 使用 Puppeteer 截图分析网页
    let screenshotBase64 = '';
    let browser = null;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/chromium-browser',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--window-size=1920,1080'
        ]
      });
      
      const page = await browser.newPage();
      await page.setViewport({ width: 1920, height: 1080 });
      
      // 设置超时和等待策略
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // 等待页面加载完成（使用 setTimeout 替代已废弃的 waitForTimeout）
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 截图
      const screenshot = await page.screenshot({ 
        type: 'jpeg',
        quality: 85,
        fullPage: false // 只截取视口大小
      });
      
      screenshotBase64 = screenshot.toString('base64');
      console.log(`网页截图成功，大小: ${(screenshotBase64.length / 1024).toFixed(1)} KB`);
      
    } catch (screenshotError) {
      console.error('网页截图失败:', screenshotError);
      return res.status(400).json({ 
        error: '无法抓取该网页，请检查网址是否正确或稍后重试',
        detail: screenshotError.message 
      });
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    if (!screenshotBase64) {
      return res.status(400).json({ error: '网页截图为空' });
    }

    // 使用千问VL分析截图
    const systemPrompt = buildWebsitePrompt(outputOptions, lang);
    const result = await callAIWithImage(systemPrompt, screenshotBase64);

    res.json({
      success: true,
      category: 'website',
      result: cleanResult(result),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('网页分析失败:', error);
    res.status(500).json({
      error: '网页分析失败',
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
      preview: cleanResult(result),
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
function buildSystemPrompt(category, outputOptions, detailLevel = 'detailed') {
  // 维度选项的中英文映射
  const dimensionLabels = {
    // 文档类
    theme: '主题',
    genre: '体裁',
    langStyle: '语言风格',
    tone: '语气',
    structure: '结构',
    wordCount: '字数',
    audience: '目标受众',
    scenario: '应用场景',
    keywords: '关键词',
    // 图片类
    subject: '主体',
    style: '风格',
    composition: '构图',
    lighting: '光影',
    colors: '色彩',
    quality: '画质',
    background: '背景',
    atmosphere: '氛围',
    // 视频类
    camera: '镜头',
    rhythm: '节奏',
    logic: '逻辑',
    mood: '情绪',
    // 网站类
    webType: '网站类型',
    layout: '布局',
    modules: '模块',
    device: '设备适配',
    texture: '质感'
  };

  // 根据用户选择的维度构建分析维度列表
  const selectedDimensions = outputOptions.map(opt => dimensionLabels[opt] || opt).join('、');

  if (detailLevel === 'concise') {
    // 简洁模式
    return `你是一位专业的AI提示词逆向工程师。分析用户提供的AI生成内容，直接输出简洁的提示词。

## 要求
1. 提示词要具体、可执行
2. 直接输出提示词，不要添加任何格式符号
3. 控制在30字以内`;
  }

  // 详细模式 - 根据用户选择的维度生成提示词
  return `你是一位专业的AI提示词逆向工程师。你的任务是：分析用户提供的AI生成内容，反推出"生成这样内容需要什么提示词"。

## 用户选择的维度
${selectedDimensions || '主题、风格'}

## 输出格式（按此格式输出，不要添加任何装饰符号如**或---）：

【推测的原始提示词】
[这里是推测的原始提示词]

【分析维度】
${outputOptions.map((opt, i) => `${i + 1}. ${dimensionLabels[opt] || opt}：根据内容分析`).join('\n')}

【优化建议】
[如何改进提示词]

## 重要原则
1. 不要使用任何**符号
2. 不要使用---分隔符
3. 只使用【】和数字编号
4. 提示词要具体、可执行`;
}

/**
 * 构建图片分析提示词
 * @param {string[]} outputOptions - 用户选择的维度
 * @param {string} lang - 语言 ('zh' | 'en')
 */
function buildImagePrompt(outputOptions, lang = 'zh') {
  const dimensionLabels = {
    zh: {
      subject: '主体',
      style: '风格',
      composition: '构图',
      lighting: '光影',
      colors: '色彩',
      quality: '画质',
      background: '背景',
      atmosphere: '氛围'
    },
    en: {
      subject: 'Subject',
      style: 'Style',
      composition: 'Composition',
      lighting: 'Lighting',
      colors: 'Colors',
      quality: 'Quality',
      background: 'Background',
      atmosphere: 'Atmosphere'
    }
  };

  const labels = dimensionLabels[lang] || dimensionLabels.zh;

  if (lang === 'en') {
    return `You are a professional image analyst. Analyze this image and generate an AI art prompt.

## Selected Dimensions
${outputOptions.map(opt => labels[opt] || opt).join(', ') || 'Subject, Style'}

## Output Format (do not use ** symbols)

[Reverse-Engineered Prompt]
[Directly usable AI art prompt in English]

[Analysis Dimensions]
${outputOptions.map((opt, i) => `${i + 1}. ${labels[opt] || opt}: Analyze based on the image`).join('\n')}

[Optimization Suggestions]
[How to improve the prompt]

## Requirements
1. Do not use any ** symbols
2. Do not use --- separators
3. The prompt must be specific and actionable
4. Output everything in English`;
  }

  return `你是一位专业的图像分析师。分析这张图片并生成AI绘画提示词。

## 用户选择的维度
${outputOptions.map(opt => labels[opt] || opt).join('、') || '主体、风格'}

## 输出格式（不要使用**符号）

【推测的原始提示词】
[可直接使用的AI绘画提示词]

【分析维度】
${outputOptions.map((opt, i) => `${i + 1}. ${labels[opt] || opt}：根据图片分析`).join('\n')}

【优化建议】
[如何改进提示词]

## 要求
1. 不要使用任何**符号
2. 不要使用---分隔符
3. 提示词要具体、可执行
4. 全部用中文输出`;
}

/**
 * 构建网页分析提示词（用于截图分析）
 */
function buildWebsitePrompt(outputOptions, lang = 'zh') {
  const dimensionLabels = {
    zh: {
      webType: '网站类型',
      style: '设计风格',
      colors: '配色方案',
      layout: '页面布局',
      modules: '功能模块',
      device: '设备适配',
      atmosphere: '整体氛围',
      texture: '细节质感'
    },
    en: {
      webType: 'Website Type',
      style: 'Design Style',
      colors: 'Color Scheme',
      layout: 'Page Layout',
      modules: 'Functional Modules',
      device: 'Device Adaptation',
      atmosphere: 'Overall Atmosphere',
      texture: 'Detail & Texture'
    }
  };

  const labels = dimensionLabels[lang] || dimensionLabels.zh;
  const selectedDimensions = outputOptions.map(opt => labels[opt] || opt).join('、');

  if (lang === 'en') {
    return `You are a professional UI/UX designer and web analyst. Analyze this website screenshot and generate a detailed prompt that could recreate a similar webpage.

## Selected Analysis Dimensions
${selectedDimensions || 'Website Type, Style, Colors, Layout'}

## Output Format (do not use ** symbols)

[Reverse-Engineered Prompt]
[Provide a detailed, actionable prompt in English that describes how to recreate this webpage]

[Analysis Dimensions]
${outputOptions.map((opt, i) => `${i + 1}. ${labels[opt] || opt}: Analyze based on the screenshot`).join('\n')}

[Design Specifications]
- Colors: [List primary colors, secondary colors, accent colors with hex codes if possible]
- Typography: [Font styles, sizes, weights]
- Layout: [Grid system, spacing, alignment]
- Components: [Key UI elements, buttons, cards, navigation]

[Optimization Suggestions]
[How to improve the design or prompt]

## Requirements
1. Analyze the VISUAL appearance, not the HTML code
2. Pay attention to colors, spacing, typography, and visual hierarchy
3. Describe UI components and their arrangement
4. Do not use any ** symbols or --- separators
5. Be specific and actionable`;
  }

  return `你是一位专业的UI/UX设计师和网页分析师。分析这张网页截图，生成一个详细的提示词，用于指导AI生成类似的网页。

## 用户选择的分析维度
${selectedDimensions || '网站类型、风格、配色、布局'}

## 输出格式（不要使用**符号）

【推测的原始提示词】
[提供详细的、可执行的提示词，描述如何复刻这个网页]

【分析维度】
${outputOptions.map((opt, i) => `${i + 1}. ${labels[opt] || opt}：根据截图分析`).join('\n')}

【设计规格】
- 配色：[列出主色、辅助色、强调色，尽可能提供色值]
- 字体：[字体风格、大小、粗细]
- 布局：[网格系统、间距、对齐方式]
- 组件：[关键UI元素、按钮、卡片、导航栏等]

【优化建议】
[如何改进设计或提示词]

## 重要原则
1. 分析的是视觉外观，不是HTML代码
2. 重点关注：颜色、间距、字体、视觉层次
3. 描述UI组件及其排列方式
4. 不要使用任何**符号或---分隔符
5. 提示词要具体、可执行
6. 全部用中文输出`;
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
 * 调用 AI 大模型（带图片）- 使用千问VL
 */
async function callAIWithImage(systemPrompt, base64Image) {
  // 使用千问VL分析图片
  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    throw new Error('千问API Key未配置');
  }

  const requestBody = {
    model: 'qwen-vl-max',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'text', text: '请分析这张网页截图' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } }
        ]
      }
    ],
    temperature: 0.7,
    max_tokens: 3000
  };

  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestBody);
    
    const options = {
      hostname: 'dashscope.aliyuncs.com',
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          console.log('千问VL响应:', data.substring(0, 200));
          const json = JSON.parse(data);
          if (json.error) {
            reject(new Error(json.error.message));
          } else if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('API返回格式异常: ' + JSON.stringify(json).substring(0, 200)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      console.error('千问VL请求错误:', e);
      reject(e);
    });
    
    req.write(postData);
    req.end();
  });
}

/**
 * 清理AI返回结果中的格式符号
 */
function cleanResult(text) {
  return text
    .replace(/\*\*/g, '')  // 去掉 **
    .replace(/\*/g, '')    // 去掉 *
    .replace(/#{1,6}\s?/g, '')  // 去掉 # 标题符号
    .replace(/`{1,3}/g, '') // 去掉 ` 代码块符号
    .trim();
}

// ==================== 创意生成 API ====================
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, model = 'auto', contentType = 'document', lang = 'zh' } = req.body;
    
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: '请输入提示词' });
    }

    // 如果是图片或视频类型，强制使用通义万相生成图片
    if (contentType === 'image' || contentType === 'video') {
      try {
        console.log(`使用通义万相生成图片: contentType=${contentType}, prompt=${prompt.substring(0, 50)}...`);
        // 强制使用通义万相，生成4张图片
        const imageResult = await generateImage(prompt, 'wanxiang', { n: 4 });
        
        // 如果返回的是图片URL
        if (imageResult.success && imageResult.images && imageResult.images.length > 0) {
          return res.json({
            success: true,
            type: 'image',
            images: imageResult.images,
            model: 'wanx-v1',
            contentType: contentType,
            timestamp: new Date().toISOString()
          });
        }
        
        // 如果返回的是文本结果（优化后的提示词）
        if (imageResult.type === 'text') {
          return res.json({
            success: true,
            type: 'text',
            result: cleanResult(imageResult.result),
            model: imageResult.model,
            timestamp: new Date().toISOString()
          });
        }
      } catch (imageError) {
        console.error('图片生成失败:', imageError.message);
        return res.status(500).json({ 
          error: '图片生成失败', 
          message: imageError.message 
        });
      }
    }

    // 文本生成（默认）
    const langPrompt = lang === 'en' 
      ? 'Respond in English only. Do not use any markdown formatting like **, *, #, or `.' 
      : '只用中文回复。不要使用任何markdown格式符号如**、*、#、`。';
    
    let systemPrompt = '';
    
    if (contentType === 'image') {
      systemPrompt = lang === 'en'
        ? `You are an AI art creation assistant. Based on the user's prompt, generate an improved and detailed prompt for AI image generation (like Midjourney, DALL-E, Stable Diffusion). ${langPrompt}`
        : `你是一位专业的AI艺术创作助手。根据用户的提示词，生成一个改进的、详细的AI绘画提示词（适用于Midjourney、DALL-E、Stable Diffusion等）。${langPrompt}`;
    } else if (contentType === 'video') {
      systemPrompt = lang === 'en'
        ? `You are a professional video creation assistant. Based on the user's prompt, generate an improved and detailed prompt for AI video generation. ${langPrompt}`
        : `你是一位专业的视频创作助手。根据用户的提示词，生成一个改进的、详细的AI视频生成提示词。${langPrompt}`;
    } else {
      systemPrompt = lang === 'en'
        ? `You are a professional content creation assistant. Based on the user's prompt, generate improved and creative content. ${langPrompt}`
        : `你是一位专业的内容创作助手。根据用户的提示词，生成改进的、有创意的内容。${langPrompt}`;
    }
    
    const result = await callAI(systemPrompt, prompt);
    
    res.json({
      success: true,
      type: 'text',
      result: cleanResult(result),
      model: model === 'auto' ? CONFIG.model : model,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('创意生成失败:', error);
    res.status(500).json({ 
      error: '创意生成失败', 
      message: error.message 
    });
  }
});

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
