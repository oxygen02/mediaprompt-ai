/**
 * 千问VL 视频分析模块
 * 调用阿里云千问VL API分析视频
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

// 千问VL API 配置
const QWEN_CONFIG = {
  apiKey: process.env.QWEN_API_KEY || '',
  baseUrl: process.env.QWEN_BASE_URL || 'dashscope.aliyuncs.com',
  model: process.env.QWEN_MODEL || 'qwen3-vl-plus'
};

/**
 * 调用千问VL API分析图片
 * @param {string} systemPrompt - 系统提示词
 * @param {string[]} imageUrls - 图片URL数组（公网可访问）
 * @param {string} userPrompt - 用户提示
 * @returns {Promise<string>} - 分析结果
 */
async function analyzeWithQwenVL(systemPrompt, imageUrls, userPrompt) {
  if (!QWEN_CONFIG.apiKey) {
    throw new Error('千问VL API Key 未配置，请设置 QWEN_API_KEY 环境变量');
  }
  
  // 构建消息内容
  const content = [];
  
  // 添加图片（支持多图）
  for (const imageUrl of imageUrls) {
    content.push({
      type: 'image_url',
      image_url: { url: imageUrl }
    });
  }
  
  // 添加文本提示
  content.push({
    type: 'text',
    text: userPrompt
  });
  
  const requestBody = {
    model: QWEN_CONFIG.model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: content }
    ],
    temperature: 0.7,
    max_tokens: 4000
  };
  
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(requestBody);
    
    const options = {
      hostname: QWEN_CONFIG.baseUrl,
      port: 443,
      path: '/compatible-mode/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': `Bearer ${QWEN_CONFIG.apiKey}`
      }
    };
    
    console.log('千问VL Request:', JSON.stringify({
      hostname: options.hostname,
      model: QWEN_CONFIG.model,
      imageCount: imageUrls.length,
      apiKeyPrefix: QWEN_CONFIG.apiKey.substring(0, 12) + '...'
    }));
    
    const req = https.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          console.log('千问VL Response:', data.substring(0, 300));
          const json = JSON.parse(data);
          
          if (json.error) {
            reject(new Error(json.error.message));
          } else if (json.choices && json.choices[0]) {
            resolve(json.choices[0].message.content);
          } else {
            reject(new Error('千问VL API返回格式异常: ' + data.substring(0, 200)));
          }
        } catch (e) {
          console.error('JSON Parse Error:', e.message);
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
 * 分析视频帧并生成提示词
 * @param {string[]} frameUrls - 视频帧URL数组
 * @param {string[]} outputOptions - 输出选项
 * @returns {Promise<string>} - 生成的提示词
 */
async function analyzeVideoFrames(frameUrls, outputOptions = ['prompt']) {
  // 构建系统提示词
  const systemPrompt = `你是一位专业的视频内容分析师，擅长分析视频画面并生成AI视频创作提示词。

请分析提供的视频关键帧，按照以下格式输出：

## 视频概述
[简要描述视频的整体内容和主题]

## 场景描述
[详细描述每个关键帧的场景，包括环境、背景、道具等]

## 人物/主体
[描述视频中的主要人物或主体，包括外观、服装、动作等]

## 镜头语言
[分析镜头运动、构图、视角等]

## 光影与色彩
[描述光影效果、色调、氛围等]

## 风格标签
[提供适用于Sora/Runway/Pika等的提示词标签]

## 音效建议
[建议的背景音乐或音效类型]

## 完整提示词
[生成一个完整的、可用于AI视频生成的英文提示词]`;

  const userPrompt = `请分析这组视频关键帧，共 ${frameUrls.length} 帧。${outputOptions.includes('prompt') ? '请生成详细的AI视频生成提示词。' : ''}${outputOptions.includes('style') ? '请分析视频风格。' : ''}`;

  return await analyzeWithQwenVL(systemPrompt, frameUrls, userPrompt);
}

/**
 * 使用本地帧文件分析（先上传到COS）
 * @param {string[]} framePaths - 本地帧文件路径数组
 * @param {object} cosClient - COS客户端实例
 * @param {string[]} outputOptions - 输出选项
 * @returns {Promise<string>} - 分析结果
 */
async function analyzeLocalFrames(framePaths, cosClient, outputOptions = ['prompt']) {
  const frameUrls = [];
  
  // 上传每个帧到COS
  for (const framePath of framePaths) {
    const fileName = path.basename(framePath);
    const cosKey = `mediaprompt/frames/${Date.now()}_${fileName}`;
    
    // 上传到COS
    const url = await uploadToCOS(framePath, cosKey, cosClient);
    frameUrls.push(url);
  }
  
  return await analyzeVideoFrames(frameUrls, outputOptions);
}

/**
 * 上传文件到腾讯云COS
 * @param {string} filePath - 本地文件路径
 * @param {string} cosKey - COS对象键
 * @param {object} cosClient - COS客户端（可选，如果没有则创建新的）
 * @returns {Promise<string>} - 公网URL
 */
async function uploadToCOS(filePath, cosKey, cosClient) {
  // 如果有现成的COS客户端，使用它
  if (cosClient) {
    // 使用传入的COS客户端上传
    // 这里需要根据实际的COS SDK来实现
    return await cosClient.upload(filePath, cosKey);
  }
  
  // 否则返回本地文件路径（需要外部处理上传）
  // 或者使用base64编码
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');
  return `data:image/jpeg;base64,${base64}`;
}

module.exports = {
  analyzeWithQwenVL,
  analyzeVideoFrames,
  analyzeLocalFrames,
  QWEN_CONFIG
};