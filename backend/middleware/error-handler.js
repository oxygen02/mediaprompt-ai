/**
 * 统一错误处理中间件
 */

function errorHandler(err, req, res, next) {
  console.error('错误:', err);

  // 处理不同类型的错误
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: '文件上传错误',
      message: err.message
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: '参数验证失败',
      message: err.message
    });
  }

  if (err.code === 'ENOENT') {
    return res.status(404).json({
      success: false,
      error: '文件不存在',
      message: err.message
    });
  }

  // API 错误
  if (err.message.includes('API')) {
    return res.status(502).json({
      success: false,
      error: 'AI 服务暂时不可用',
      message: err.message
    });
  }

  // 默认服务器错误
  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  });
}

module.exports = errorHandler;
