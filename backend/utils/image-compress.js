/**
 * 图片压缩工具
 * 使用sharp库进行图片压缩和优化
 */

const sharp = require('sharp');

/**
 * 压缩图片
 * @param {Buffer} imageBuffer - 原始图片Buffer
 * @param {Object} options - 压缩选项
 * @returns {Promise<Buffer>} - 压缩后的图片Buffer
 */
async function compressImage(imageBuffer, options = {}) {
  const {
    maxWidth = 1920,        // 最大宽度
    maxHeight = 1080,       // 最大高度
    quality = 80,           // JPEG质量 (1-100)
    format = 'jpeg',        // 输出格式
  } = options;

  try {
    let image = sharp(imageBuffer);
    
    // 获取图片元数据
    const metadata = await image.metadata();
    console.log(`原始图片: ${metadata.width}x${metadata.height}, ${metadata.format}, ${imageBuffer.length} bytes`);
    
    // 调整尺寸（保持比例）
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      image = image.resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // 设置输出格式和质量
    if (format === 'jpeg') {
      image = image.jpeg({ quality, mozjpeg: true });
    } else if (format === 'png') {
      image = image.png({ compressionLevel: 9 });
    } else if (format === 'webp') {
      image = image.webp({ quality });
    }
    
    const compressedBuffer = await image.toBuffer();
    console.log(`压缩后: ${compressedBuffer.length} bytes, 压缩率: ${((1 - compressedBuffer.length / imageBuffer.length) * 100).toFixed(1)}%`);
    
    return compressedBuffer;
  } catch (error) {
    console.error('图片压缩失败:', error);
    throw error;
  }
}

/**
 * 智能压缩图片（自动判断是否需要压缩）
 * @param {Buffer} imageBuffer - 原始图片Buffer
 * @param {number} maxSizeKB - 最大文件大小（KB），超过则压缩
 * @returns {Promise<{buffer: Buffer, compressed: boolean, originalSize: number, compressedSize: number}>}
 */
async function smartCompressImage(imageBuffer, maxSizeKB = 1024) {
  const originalSizeKB = imageBuffer.length / 1024;
  
  // 如果图片小于限制，直接返回
  if (originalSizeKB <= maxSizeKB) {
    return {
      buffer: imageBuffer,
      compressed: false,
      originalSize: originalSizeKB,
      compressedSize: originalSizeKB
    };
  }
  
  // 需要压缩
  const compressedBuffer = await compressImage(imageBuffer, {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 80
  });
  
  const compressedSizeKB = compressedBuffer.length / 1024;
  
  return {
    buffer: compressedBuffer,
    compressed: true,
    originalSize: originalSizeKB,
    compressedSize: compressedSizeKB
  };
}

module.exports = {
  compressImage,
  smartCompressImage
};
