/**
 * AI 服务统一接口
 * 统一管理所有 AI 提供商的调用
 */

const HunyuanProvider = require('./providers/hunyuan');
const QwenProvider = require('./providers/qwen');

class AIService {
  constructor() {
    this.providers = {
      hunyuan: new HunyuanProvider(),
      qwen: new QwenProvider()
    };
  }

  /**
   * 获取提供商
   */
  getProvider(name) {
    if (!this.providers[name]) {
      throw new Error(`未知的 AI 提供商: ${name}`);
    }
    return this.providers[name];
  }

  /**
   * 统一的文本对话接口
   */
  async chat(provider, messages, options = {}) {
    const p = this.getProvider(provider);
    return p.chat(messages, options);
  }

  /**
   * 统一的图片分析接口
   */
  async analyzeImage(provider, imageBase64, prompt, options = {}) {
    const p = this.getProvider(provider);
    if (!p.analyzeImage) {
      throw new Error(`${provider} 不支持图片分析`);
    }
    return p.analyzeImage(imageBase64, prompt, options);
  }

  /**
   * 统一的视频分析接口
   */
  async analyzeVideo(provider, frameUrls, prompt, options = {}) {
    const p = this.getProvider(provider);
    if (!p.analyzeVideo) {
      throw new Error(`${provider} 不支持视频分析`);
    }
    return p.analyzeVideo(frameUrls, prompt, options);
  }

  /**
   * 检查提供商配置状态
   */
  checkStatus() {
    const status = {};
    for (const [name, provider] of Object.entries(this.providers)) {
      status[name] = {
        configured: provider.isConfigured(),
        models: provider.getSupportedModels()
      };
    }
    return status;
  }
}

// 单例导出
const aiService = new AIService();
module.exports = aiService;
