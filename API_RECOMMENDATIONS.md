# PromptBox AI - API 推荐方案

## 需求分析

PromptBox 需要以下能力：
1. **图像分析** - 识别图片风格、构图、色调等
2. **视频分析** - 理解视频内容、镜头、节奏
3. **文档分析** - 提取文档主题、风格、结构
4. **网页分析** - 分析设计风格、布局、配色
5. **提示词生成** - 结构化输出

---

## 🏆 推荐方案（性价比优先）

### 方案一：讯飞星辰MaaS（强烈推荐）

**优势：**
- ✅ 价格极低（DeepSeek-V3.2: 输入1元/百万tokens，输出1.5元）
- ✅ 视觉模型便宜（Qwen3-VL-32B: 输入2元，输出8元）
- ✅ 有免费模型（GLM-4.7-flash 限免）
- ✅ OpenAI 兼容接口，无缝对接
- ✅ 70+ 模型可选

**价格对比：**
| 模型 | 输入价格 | 输出价格 | 适用场景 |
|------|---------|---------|---------|
| DeepSeek-V3.2 | ¥1/百万tokens | ¥1.5/百万tokens | 文档/网页分析 |
| Qwen3-VL-32B | ¥2/百万tokens | ¥8/百万tokens | 图片/视频分析 |
| GLM-4.7-flash | **免费** | **免费** | 简单分析 |
| DeepSeek-R1 | ¥4/百万tokens | ¥16/百万tokens | 复杂推理 |

**官网：** https://maas.xfyun.cn/modelSquare

---

### 方案二：OpenRouter（灵活性优先）

**优势：**
- ✅ 400+ 模型聚合，一个接口调用
- ✅ 智能路由自动选择最优模型
- ✅ 支持图像/PDF处理
- ✅ 自动故障转移

**适用场景：**
- 需要快速切换不同模型
- 国际用户（支持海外模型）
- 需要图像+文本一站式处理

**官网：** https://openrouter.ai

---

### 方案三：DeepSeek API（性能优先）

**优势：**
- ✅ DeepSeek-V3 对标 GPT-4o
- ✅ DeepSeek-R1 推理能力极强
- ✅ 支持多模态（DeepSeek-VL2）
- ✅ 开源可本地部署

**价格：**
- 通过讯飞星辰调用，享受优惠价格
- 直接调用：api.deepseek.com

**官网：** https://platform.deepseek.com

---

### 方案四：阿里云百炼（国内稳定）

**优势：**
- ✅ 通义千问系列（Qwen3）
- ✅ 新用户100次免费
- ✅ 可领5.5折优惠券
- ✅ 国内访问稳定

**官网：** https://bailian.console.aliyun.com

---

## 📊 成本对比（按100万tokens计算）

| 平台 | 文本模型 | 视觉模型 | 免费额度 | 推荐指数 |
|------|---------|---------|---------|---------|
| 讯飞星辰 | ¥2.5 | ¥10 | 有 | ⭐⭐⭐⭐⭐ |
| OpenRouter | 变动 | 变动 | 无 | ⭐⭐⭐⭐ |
| DeepSeek | ¥2 | ¥- | 有 | ⭐⭐⭐⭐ |
| 阿里百炼 | ¥4 | ¥12 | 100次 | ⭐⭐⭐ |

---

## 🎯 最终推荐配置

### 图片分析
```
模型：Qwen3-VL-32B-Instruct（讯飞星辰）
价格：输入¥2/百万tokens，输出¥8/百万tokens
优势：便宜 + 效果好 + 支持中文
```

### 视频分析
```
模型：Qwen2.5-VL-32B-Instruct（讯飞星辰）
价格：输入¥8/百万tokens，输出¥24/百万tokens
优势：视频理解能力强
```

### 文档/网页分析
```
模型：DeepSeek-V3.2（讯飞星辰）
价格：输入¥1/百万tokens，输出¥1.5/百万tokens
优势：极便宜 + 效果好
```

### 复杂推理
```
模型：DeepSeek-R1（讯飞星辰）
价格：输入¥4/百万tokens，输出¥16/百万tokens
优势：推理能力极强
```

---

## 💡 成本优化建议

1. **免费模型优先**
   - 简单任务用 GLM-4.7-flash（免费）
   - 复杂任务再切换付费模型

2. **模型降级策略**
   - 先用便宜模型分析
   - 如果效果不好，再升级

3. **缓存策略**
   - 相同内容缓存结果
   - 减少重复调用

4. **批量处理**
   - 合并多个小请求
   - 减少API调用次数

---

## 🔧 接入方式

### 讯飞星辰（OpenAI兼容）
```javascript
const client = new OpenAI({
  baseURL: 'https://maas.xfyun.cn/v1',
  apiKey: 'YOUR_API_KEY'
});

const response = await client.chat.completions.create({
  model: 'deepseek-v3.2',
  messages: [{ role: 'user', content: '分析这张图片' }]
});
```

### OpenRouter
```javascript
const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v3',
    messages: [{ role: 'user', content: 'Hello' }]
  })
});
```

---

## 📝 总结

**最佳方案：讯飞星辰MaaS**
- 价格最低
- 模型丰富
- 接口兼容
- 国内稳定

**备选方案：**
- 需要灵活性 → OpenRouter
- 需要稳定性 → 阿里百炼
- 需要开源 → DeepSeek本地部署

---

*更新时间：2026-03-19*
