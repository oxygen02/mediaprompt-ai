# PromptBox AI Backend

对接腾讯云混元大模型的后端 API 服务。

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的腾讯云密钥：

```bash
cp .env.example .env
```

编辑 `.env`：
```
TENCENT_SECRET_ID=你的SecretId
TENCENT_SECRET_KEY=你的SecretKey
TENCENT_REGION=ap-guangzhou
```

### 3. 获取腾讯云密钥

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 进入「访问管理」→「访问密钥」→「API密钥管理」
3. 创建或查看你的 SecretId 和 SecretKey

### 4. 启动服务

```bash
npm start
```

## API 接口

### 健康检查
```
GET /api/health
```

### 文本分析
```
POST /api/analyze/text
Content-Type: application/json

{
  "content": "要分析的文本内容",
  "category": "document",  // document/image/video/website
  "outputOptions": ["prompt", "outline"]
}
```

### 图片分析
```
POST /api/analyze/image
Content-Type: multipart/form-data

image: 图片文件
outputOptions: ["prompt", "style", "colors"]
```

### 文件上传分析
```
POST /api/analyze/file
Content-Type: multipart/form-data

file: 文档文件
category: document
outputOptions: ["prompt"]
```

### 模拟输出预览
```
POST /api/preview
Content-Type: application/json

{
  "prompt": "生成的提示词",
  "model": "hunyuan-lite"
}
```

## 支持的模型

| 模型 | 用途 | 免费额度 |
|------|------|----------|
| hunyuan-lite | 快速文本生成 | 大 |
| hunyuan-pro | 复杂任务 | 中 |
| hunyuan-vision | 图片分析 | 中 |

## 部署

### 本地运行
```bash
npm start
```

### Docker 部署
```bash
docker build -t promptbox-api .
docker run -p 3000:3000 --env-file .env promptbox-api
```

### 云函数部署
可部署到腾讯云 SCF（云函数），享受更低的延迟和更好的稳定性。
