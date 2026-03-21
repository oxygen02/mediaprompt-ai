#!/bin/bash
# MediaPrompt AI 启动脚本

cd "$(dirname "$0")"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 MediaPrompt AI 启动脚本"
echo "=========================="

# 检查环境变量
if [ ! -f backend/.env ]; then
    echo -e "${RED}❌ 错误: backend/.env 不存在${NC}"
    echo "请复制 backend/.env.example 到 backend/.env 并填写配置"
    echo ""
    echo "示例:"
    echo "  cp backend/.env.example backend/.env"
    echo "  nano backend/.env"
    exit 1
fi

# 检查必要的环境变量
echo "🔍 检查环境变量..."
if ! grep -q "AI_API_KEY=" backend/.env || grep -q "AI_API_KEY=$" backend/.env; then
    echo -e "${YELLOW}⚠️ 警告: AI_API_KEY 未配置${NC}"
fi

if ! grep -q "QWEN_API_KEY=" backend/.env || grep -q "QWEN_API_KEY=$" backend/.env; then
    echo -e "${YELLOW}⚠️ 警告: QWEN_API_KEY 未配置${NC}"
fi

# 检查 node_modules
echo "📦 检查依赖..."
if [ ! -d "backend/node_modules" ]; then
    echo "安装后端依赖..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "安装前端依赖..."
    cd frontend && npm install && cd ..
fi

# 创建 uploads 目录
mkdir -p backend/uploads

# 启动后端
echo -e "${GREEN}🚀 启动后端服务...${NC}"
cd backend
npm start &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 2

# 启动前端
echo -e "${GREEN}🚀 启动前端服务...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ 服务已启动${NC}"
echo "  后端: http://localhost:3001"
echo "  前端: http://localhost:3000"
echo "  API文档: http://localhost:3001/api/health"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 捕获退出信号
trap "echo ''; echo '🛑 正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
