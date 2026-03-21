/**
 * 腾讯混元 AI 提供商
 */

class HunyuanProvider {
  constructor() {
    this.apiKey = process.env.AI_API_KEY || '';
    this.baseUrl = process.env.AI_BASE_URL || 'https://api.hunyuan.cloud.tencent.com/v1';
    this.model = process.env.AI_MODEL || 'hunyuan-lite';
  }

  isConfigured() {
    return !!this.apiKey;
  }

  getSupportedModels() {
    return ['hunyuan-lite', 'hunyuan-pro', 'hunyuan-standard'];
  }

  /**
   * 发送对话请求
   */
  async chat(messages, options = {}) {
    const { temperature = 0.7, maxTokens = 2000 } = options;

    const requestBody = {
      model: options.model || this.model,
      messages,
      temperature,
      max_tokens: maxTokens
    };

    return this._request('/chat/completions', requestBody);
  }

  /**
   * 内部请求方法
   */
  async _request(path, body) {
    const https = require('https');
    
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(body);

      const options = {
        hostname: 'api.hunyuan.cloud.tencent.com',
        port: 443,
        path: `/v1${path}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
          'Authorization': `Bearer ${this.apiKey}`
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.setEncoding('utf8');
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

module.exports = HunyuanProvider;
