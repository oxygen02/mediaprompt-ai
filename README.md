# PromptBox AI 项目

## 项目简介
内容反向工程工具箱，从优质内容中提炼AI提示词，让美好可以复刻迭代。

## 在线文档

| 文档 | 链接 |
|------|------|
| **MVP 需求文档** | https://feishu.cn/docx/EnredWNn8oXEWlxur2scslPJnMd |
| **技术文档** | https://feishu.cn/docx/SG9CdmD3kozQrVxMsWRcNvWbn7F |

## 在线演示
- **前端页面**: https://oliveryoung1983-1409675040.cos.ap-singapore.myqcloud.com/promptbox/index-v21.html
- **后端 API**: http://124.156.200.127:3001

## 目录结构

```
promptbox-ai/
├── prototype/           # 前端页面
│   ├── index-v21.html   # 最新版本
│   └── ...
├── backend/             # 后端 API
│   ├── server-sdk.js    # 主程序
│   ├── package.json
│   └── .env.example
└── docs/                # 文档
    ├── MVP-REQUIREMENTS.md
    └── TECHNICAL-DOCUMENT.md
```

## 快速开始

### 安装依赖
```bash
cd backend
npm install
```

### 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 填入你的腾讯云密钥
```

### 启动服务
```bash
npm start
```

## 技术栈
- **前端**: HTML + Tailwind CSS + Vanilla JS
- **后端**: Node.js + Express
- **AI**: 腾讯云混元大模型

## 开发日志
- 2026-03-18: 完成 MVP 版本，对接腾讯云混元大模型

---
*最好的学习从模仿开始*
