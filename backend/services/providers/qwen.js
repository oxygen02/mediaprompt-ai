/**
 * 阿里千问 AI 提供商
 * 支持文本对话和视觉分析
 */

class QwenProvider {
  constructor() {
    this.apiKey = process.env.QWEN_API_KEY || '';
    this.baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    this.textModel = 'qwen-turbo';
    this.visionModel = 'qwen-vl-max';
  }

  isConfigured() {
    return !!this.apiKey;
  }

  getSupportedModels() {
    return ['qwen-turbo', 'qwen-plus', 'qwen-max', 'qwen-vl-max', 'qwen-vl-plus'];
  }

  /**
   * 发送对话请求
   */
  async chat(messages, options = {}) {
    const { temperature = 0.7, maxTokens = 2000 } = options;

    const requestBody = {
      model: options.model || this.textModel,
      messages,
      temperature,
      max_tokens: maxTokens
    };

    return this._request('/chat/completions', requestBody);
  }

  /**
   * 图片分析
   */
  async analyzeImage(imageUrl, prompt, options = {}) {
    const messages = [
      { role: 'system', content: options.systemPrompt || '你是一位专业的图像分析师。' },
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      }
    ];

    return this.chat(messages, {
      model: options.model || this.visionModel,
      maxTokens: options.maxTokens || 3000
    });
  }

  /**
   * 视频分析（基于帧）
   */
  async analyzeVideo(frameUrls, prompt, options = {}) {
    const content = [
      { type: 'text', text: prompt }
    ];

    // 添加所有帧
    frameUrls.forEach(url => {
      content.push({ type: 'image_url', image_url: { url } });
    });

    const messages = [
      { role: 'system', content: options.systemPrompt || '你是一位专业的视频分析师。' },
      { role: 'user', content }
    ];

    return this.chat(messages, {
      model: options.model || this.visionModel,
      maxTokens: options.maxTokens || 4000
    });
  }

  /**
   * 内部请求方法
   */
  async _request(path, body) {
    const https = require('https');

    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(body);

      const options = {
        hostname: 'dashscope.aliyuncs.com',
        port: 443,
        path: `/compatible-mode/v1${path}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error.message));
            } else if (json.choices && json.choices[0]) {
              resolve(json.choices[0].message.content);
            } else {
              reject(new Error('API 返回格式异常'));
            }
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(postData);
      req.end();
    });
  }
}

module.exports = QwenProvider;
