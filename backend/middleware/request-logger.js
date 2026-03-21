/**
 * 请求日志中间件
 */

function requestLogger(req, res, next) {
  const start = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 记录请求
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, {
    requestId,
    ip: req.ip,
    userAgent: req.get('user-agent')?.substring(0, 50)
  });

  // 记录响应
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode < 400 ? '\x1b[32m' : '\x1b[31m';
    console.log(
      `${statusColor}[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms\x1b[0m`
    );
  });

  next();
}

module.exports = requestLogger;
