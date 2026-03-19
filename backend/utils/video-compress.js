/**
 * 视频压缩工具模块
 * 使用 ffmpeg 压缩视频
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const util = require('util');
const execPromise = util.promisify(exec);

// 压缩配置
const COMPRESSION_CONFIG = {
  // 压缩质量级别
  quality: {
    high: { crf: 23, preset: 'medium', maxWidth: 1920 },    // 高质量，适合大部分场景
    medium: { crf: 28, preset: 'fast', maxWidth: 1280 },    // 中等质量，体积较小
    low: { crf: 32, preset: 'veryfast', maxWidth: 854 }      // 低质量，最小体积
  },
  // 文件大小限制（MB）
  maxFileSize: 50
};

/**
 * 获取视频信息
 * @param {string} videoPath - 视频路径
 * @returns {Promise<object>} - 视频信息
 */
async function getVideoInfo(videoPath) {
  try {
    const { stdout } = await execPromise(
      `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,bit_rate -of json "${videoPath}"`
    );
    const info = JSON.parse(stdout);
    const stream = info.streams[0];
    
    // 获取文件大小
    const stats = fs.statSync(videoPath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    return {
      width: parseInt(stream.width),
      height: parseInt(stream.height),
      duration: parseFloat(stream.duration) || 0,
      bitRate: parseInt(stream.bit_rate) || 0,
      fileSize: fileSizeMB,
      fileSizeBytes: stats.size
    };
  } catch (error) {
    console.error('获取视频信息失败:', error);
    throw new Error(`获取视频信息失败: ${error.message}`);
  }
}

/**
 * 压缩视频
 * @param {string} inputPath - 输入视频路径
 * @param {string} outputPath - 输出视频路径
 * @param {string} qualityLevel - 质量级别: 'high', 'medium', 'low'
 * @returns {Promise<object>} - 压缩结果
 */
async function compressVideo(inputPath, outputPath, qualityLevel = 'medium') {
  const config = COMPRESSION_CONFIG.quality[qualityLevel] || COMPRESSION_CONFIG.quality.medium;
  
  // 获取原始视频信息
  const originalInfo = await getVideoInfo(inputPath);
  
  // 构建 ffmpeg 命令
  // -c:v libx264: H.264编码
  // -crf: 恒定质量因子 (18-28是视觉无损范围，越大体积越小)
  // -preset: 编码速度预设 (slower质量更好但慢，fast更快但质量稍差)
  // -vf scale: 调整分辨率
  // -c:a aac: AAC音频编码
  // -b:a 128k: 音频码率
  
  const scaleFilter = originalInfo.width > config.maxWidth 
    ? `scale=${config.maxWidth}:-2` // 保持宽高比，最大宽度限制
    : '';
  
  const vfOption = scaleFilter ? `-vf "${scaleFilter}"` : '';
  
  const ffmpegCmd = `ffmpeg -i "${inputPath}" -c:v libx264 -crf ${config.crf} -preset ${config.preset} ${vfOption} -c:a aac -b:a 128k -movflags +faststart -y "${outputPath}"`;
  
  console.log('执行压缩命令:', ffmpegCmd);
  
  try {
    const startTime = Date.now();
    await execPromise(ffmpegCmd);
    const compressTime = (Date.now() - startTime) / 1000;
    
    // 获取压缩后信息
    const compressedInfo = await getVideoInfo(outputPath);
    
    return {
      success: true,
      originalSize: originalInfo.fileSize,
      compressedSize: compressedInfo.fileSize,
      compressionRatio: ((1 - compressedInfo.fileSize / originalInfo.fileSize) * 100).toFixed(1),
      compressTime: compressTime.toFixed(1),
      outputPath,
      originalInfo,
      compressedInfo
    };
  } catch (error) {
    console.error('视频压缩失败:', error);
    throw new Error(`视频压缩失败: ${error.message}`);
  }
}

/**
 * 智能压缩 - 根据目标文件大小自动选择压缩参数
 * @param {string} inputPath - 输入视频路径
 * @param {string} outputPath - 输出视频路径
 * @param {number} targetSizeMB - 目标文件大小（MB）
 * @returns {Promise<object>} - 压缩结果
 */
async function smartCompress(inputPath, outputPath, targetSizeMB = 20) {
  const info = await getVideoInfo(inputPath);
  
  // 如果文件已经小于目标大小，直接返回
  if (info.fileSize <= targetSizeMB) {
    return {
      success: true,
      noCompressionNeeded: true,
      originalSize: info.fileSize,
      message: '文件已符合大小要求，无需压缩'
    };
  }
  
  // 根据压缩比选择质量级别
  const compressionRatio = info.fileSize / targetSizeMB;
  let qualityLevel = 'medium';
  
  if (compressionRatio > 5) {
    qualityLevel = 'low';      // 需要大幅压缩
  } else if (compressionRatio > 2) {
    qualityLevel = 'medium';   // 中等压缩
  } else {
    qualityLevel = 'high';     // 轻微压缩
  }
  
  console.log(`原始大小: ${info.fileSize.toFixed(2)}MB, 目标: ${targetSizeMB}MB, 压缩比: ${compressionRatio.toFixed(2)}, 使用质量级别: ${qualityLevel}`);
  
  return await compressVideo(inputPath, outputPath, qualityLevel);
}

/**
 * 提取视频关键帧（用于千问VL分析）
 * @param {string} videoPath - 视频路径
 * @param {string} outputDir - 输出目录
 * @param {number} frameCount - 提取帧数（默认8帧）
 * @returns {Promise<string[]>} - 帧文件路径数组
 */
async function extractKeyFrames(videoPath, outputDir, frameCount = 8) {
  try {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // 获取视频时长
    const info = await getVideoInfo(videoPath);
    const duration = info.duration;
    
    // 计算提取时间点（均匀分布）
    const interval = duration / (frameCount + 1);
    const framePaths = [];
    
    for (let i = 1; i <= frameCount; i++) {
      const time = interval * i;
      const framePath = path.join(outputDir, `frame_${i.toString().padStart(3, '0')}.jpg`);
      
      // 提取帧
      const ffmpegCmd = `ffmpeg -ss ${time} -i "${videoPath}" -vframes 1 -q:v 2 -y "${framePath}"`;
      await execPromise(ffmpegCmd);
      
      framePaths.push(framePath);
    }
    
    console.log(`成功提取 ${framePaths.length} 帧到 ${outputDir}`);
    return framePaths;
  } catch (error) {
    console.error('提取关键帧失败:', error);
    throw new Error(`提取关键帧失败: ${error.message}`);
  }
}

module.exports = {
  getVideoInfo,
  compressVideo,
  smartCompress,
  extractKeyFrames,
  COMPRESSION_CONFIG
};