/**
 * 图片生成工具
 * 支持：
 * 1. 阿里云通义万相
 * 2. 腾讯云混元图生图
 */

const axios = require('axios');
const https = require('https');

// ==================== 阿里云通义万相 ====================

/**
 * 通义万相图片生成
 * 文档：https://help.aliyun.com/zh/openapi/developer-reference/api-doc
 */
async function generateWithWanxiang(prompt, options = {}) {
  const apiKey = process.env.QWEN_API_KEY || 'sk-53e8ae2bf4b043448a47083b1de5446e';
  
  const response = await axios({
    method: 'POST',
    url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable' // 异步模式
    },
    data: {
      model: 'wanx-v1', // 通义万相模型
      input: {
        prompt: prompt
      },
      parameters: {
        style: options.style || '<auto>', // <auto>, <3d cartoon>, <anime>, <oil painting>, <watercolor>, <sketch>, <chinese painting>, <photography>
        size: options.size || '1024*1024', // 1024*1024, 720*1280, 1280*720
        n: options.n || 1, // 生成数量 1-4
        seed: options.seed || Math.floor(Math.random() * 1000000)
      }
    },
    timeout: 30000
  });

  // 如果是异步任务，需要轮询获取结果
  if (response.data.output && response.data.output.task_id) {
    return await pollWanxiangTask(response.data.output.task_id, apiKey);
  }

  return response.data;
}

/**
 * 轮询通义万相任务状态
 */
async function pollWanxiangTask(taskId, apiKey, maxRetries = 60) {
  for (let i = 0; i < maxRetries; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    const response = await axios({
      method: 'GET',
      url: `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const task = response.data.output;
    
    if (task.task_status === 'SUCCEEDED') {
      return {
        success: true,
        images: task.results.map(r => r.url),
        model: 'wanx-v1'
      };
    } else if (task.task_status === 'FAILED') {
      throw new Error(task.message || '图片生成失败');
    }
    
    console.log(`通义万相任务状态: ${task.task_status} (${i + 1}/${maxRetries})`);
  }
  
  throw new Error('图片生成超时');
}

// ==================== 腾讯云混元图生图 ====================

/**
 * 腾讯云混元图片生成
 * 文档：https://cloud.tencent.com/document/product/1729/101842
 */
async function generateWithHunyuan(prompt, options = {}) {
  const apiKey = process.env.HUNYUAN_API_KEY || 'sk-TYBFiCJwEglKf8PV5yAaFIuTJnDaW5PJ3mfMxim3QUAPp5xC';
  
  const response = await axios({
    method: 'POST',
    url: 'https://hunyuan.tencentcloudapi.com/', // 需要确认实际API地址
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    data: {
      Prompt: prompt,
      NegativePrompt: options.negativePrompt || '',
      Style: options.style || '', // 风格
      Resolution: options.resolution || '1024:1024', // 分辨率
      LogoParam: {
        AddLogo: false
      }
    },
    timeout: 60000
  });

  // 处理响应
  if (response.data.Response && response.data.Response.ResultImage) {
    return {
      success: true,
      images: [response.data.Response.ResultImage], // base64 或 URL
      model: 'hunyuan-image'
    };
  }

  throw new Error(response.data.Response?.Error?.Message || '图片生成失败');
}

/**
 * 使用HTTP请求调用腾讯云API（备用方案）
 */
async function generateWithHunyuanHttp(prompt, options = {}) {
  const apiKey = process.env.HUNYUAN_API_KEY || 'sk-TYBFiCJwEglKf8PV5yAaFIuTJnDaW5PJ3mfMxim3QUAPp5xC';
  
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: 'hunyuan-lite', // 使用混元模型生成图片描述
      messages: [
        {
          role: 'system',
          content: '你是一个AI绘画提示词优化助手。根据用户的描述，生成详细、专业的AI绘画提示词。只输出提示词，不要其他内容。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const req = https.request({
      hostname: 'hunyuan.tencentcloudapi.com',
      port: 443,
      path: '/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.choices && json.choices[0]) {
            // 返回优化后的提示词，前端显示为"生成结果"
            resolve({
              success: true,
              result: json.choices[0].message.content,
              model: 'hunyuan-lite',
              type: 'text' // 标记为文本结果
            });
          } else if (json.error) {
            reject(new Error(json.error.message));
          } else {
            reject(new Error('API返回格式异常'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });
}

// ==================== 统一生成接口 ====================

/**
 * 生成图片（根据模型选择API）
 * @param {string} prompt - 提示词
 * @param {string} model - 模型选择：wanxiang | hunyuan | auto
 * @param {object} options - 额外选项
 */
async function generateImage(prompt, model = 'auto', options = {}) {
  console.log(`生成图片: model=${model}, prompt=${prompt.substring(0, 50)}...`);

  // 图片和视频优先使用通义万相
  // 通义万相支持的模型标识：wanxiang, qwen-vl, qwen-turbo, auto
  const wanxiangModels = ['wanxiang', 'qwen-vl', 'qwen-turbo', 'auto', 'doubao-vision', 'hunyuan-vision'];
  
  if (wanxiangModels.includes(model)) {
    // 优先使用通义万相
    return await generateWithWanxiang(prompt, options);
  } else if (model === 'hunyuan' || model === 'hunyuan-lite' || model === 'hunyuan-pro') {
    // 混元暂时返回优化的提示词（需要确认实际图片生成API）
    return await generateWithHunyuanHttp(prompt, options);
  } else {
    // 默认使用通义万相
    return await generateWithWanxiang(prompt, options);
  }
}

module.exports = {
  generateImage,
  generateWithWanxiang,
  generateWithHunyuan,
  generateWithHunyuanHttp
};
