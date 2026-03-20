// 视频剪辑预设模板
export interface VideoEditPreset {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  description: string;
  descriptionEn: string;
  duration: string;
  features: string[];
  suitableFor: string[];
}

export const videoEditPresets: VideoEditPreset[] = [
  {
    id: 'fast-cut',
    name: '快节奏混剪',
    nameEn: 'Fast Cut',
    icon: '⚡',
    description: '快速切换画面，配合动感音乐，适合产品展示',
    descriptionEn: 'Quick cuts with dynamic music, great for product showcases',
    duration: '15-30秒',
    features: ['快速转场', '卡点剪辑', '动感BGM', '特效叠加'],
    suitableFor: ['产品宣传', '活动回顾', '街拍Vlog']
  },
  {
    id: 'slow-narrative',
    name: '慢节奏叙事',
    nameEn: 'Slow Narrative',
    icon: '🎬',
    description: '舒缓节奏，情感化叙事，适合故事类内容',
    descriptionEn: 'Slow pace, emotional storytelling',
    duration: '1-3分钟',
    features: ['长镜头', '舒缓BGM', '旁白解说', '情绪渲染'],
    suitableFor: ['人物故事', '旅行记录', '品牌故事']
  },
  {
    id: 'beat-sync',
    name: '卡点音乐',
    nameEn: 'Beat Sync',
    icon: '🎵',
    description: '画面与音乐节奏完美同步，冲击力强',
    descriptionEn: 'Perfect sync between visuals and music beats',
    duration: '15-60秒',
    features: ['节拍检测', '自动卡点', '音乐可视化', '律动转场'],
    suitableFor: ['舞蹈视频', '运动集锦', '时尚展示']
  },
  {
    id: 'picture-in-picture',
    name: '画中画',
    nameEn: 'Picture in Picture',
    icon: '🖼️',
    description: '多画面同屏展示，信息量丰富',
    descriptionEn: 'Multiple screens at once, rich information',
    duration: '30秒-2分钟',
    features: ['多轨道布局', '自由缩放', '独立音频', '交互标注'],
    suitableFor: ['教程讲解', '对比评测', '反应视频']
  },
  {
    id: 'transition-effects',
    name: '转场特效',
    nameEn: 'Transition Effects',
    icon: '✨',
    description: '丰富的转场效果，画面流畅自然',
    descriptionEn: 'Rich transition effects for smooth flow',
    duration: '15-60秒',
    features: ['百种转场', '自定义效果', '3D转场', '闪白闪黑'],
    suitableFor: ['旅行Vlog', '日常记录', '产品展示']
  },
  {
    id: 'subtitle-tutorial',
    name: '字幕解说',
    nameEn: 'Subtitle Tutorial',
    icon: '📝',
    description: '自动生成字幕，适合教程类视频',
    descriptionEn: 'Auto-generated subtitles for tutorials',
    duration: '1-5分钟',
    features: ['语音识别', '自动字幕', '样式模板', '双语字幕'],
    suitableFor: ['技能教程', '产品讲解', '知识科普']
  },
  {
    id: 'voiceover-guide',
    name: '配音解说',
    nameEn: 'Voiceover Guide',
    icon: '🎙️',
    description: '专业配音模板，让视频更有感染力',
    descriptionEn: 'Professional voiceover templates',
    duration: '30秒-3分钟',
    features: ['AI配音', '真人配音', '多音色选择', '音量调节'],
    suitableFor: ['产品介绍', '纪录片', '宣传片']
  },
  {
    id: 'product-showcase',
    name: '产品展示',
    nameEn: 'Product Showcase',
    icon: '🛍️',
    description: '突出产品特点，引导购买转化',
    descriptionEn: 'Highlight product features, drive conversions',
    duration: '15-60秒',
    features: ['产品特写', '卖点标注', '价格展示', '购买引导'],
    suitableFor: ['电商带货', '新品发布', '开箱评测']
  },
  {
    id: 'tutorial-steps',
    name: '教程步骤',
    nameEn: 'Step by Step',
    icon: '📚',
    description: '清晰的步骤分解，易于学习',
    descriptionEn: 'Clear step-by-step breakdown',
    duration: '1-5分钟',
    features: ['步骤标注', '进度提示', '关键帧高亮', '章节划分'],
    suitableFor: ['烹饪教程', '手工制作', '软件教学']
  },
  {
    id: 'vlog-daily',
    name: 'Vlog记录',
    nameEn: 'Vlog Daily',
    icon: '📹',
    description: '日常生活记录，轻松自然风格',
    descriptionEn: 'Daily life recording, casual natural style',
    duration: '1-5分钟',
    features: ['时光流逝', '日常滤镜', '轻松BGM', '旁白日记'],
    suitableFor: ['日常分享', '旅行日记', '美食探店']
  },
  {
    id: 'emotional-story',
    name: '情感故事',
    nameEn: 'Emotional Story',
    icon: '💔',
    description: '情感化叙事，引发观众共鸣',
    descriptionEn: 'Emotional storytelling that resonates',
    duration: '1-3分钟',
    features: ['情绪渲染', '配乐烘托', '慢镜头', '滤镜调色'],
    suitableFor: ['爱情故事', '励志故事', '公益宣传']
  },
  {
    id: 'brand-promo',
    name: '品牌宣传',
    nameEn: 'Brand Promo',
    icon: '🏢',
    description: '专业品牌形象展示，提升品牌价值',
    descriptionEn: 'Professional brand image showcase',
    duration: '30秒-2分钟',
    features: ['品牌动画', '企业色调', '专业配音', 'Logo水印'],
    suitableFor: ['企业形象', '品牌故事', '宣传片']
  }
];

// 剪辑工具列表
export interface EditingTool {
  id: string;
  name: string;
  icon: string;
  platform: 'zh' | 'global';
  url: string;
  features: string[];
  level: 'beginner' | 'intermediate' | 'professional';
}

export const editingTools: EditingTool[] = [
  // 国内工具
  {
    id: 'jianying',
    name: '剪映专业版',
    icon: '🎬',
    platform: 'zh',
    url: 'https://www.capcut.cn/',
    features: ['自动字幕', 'AI特效', '模板丰富', '免费使用'],
    level: 'beginner'
  },
  {
    id: 'jianying-pro',
    name: '剪映企业版',
    icon: '💼',
    platform: 'zh',
    url: 'https://www.capcut.cn/business',
    features: ['团队协作', '版权音乐', '批量处理', '云存储'],
    level: 'professional'
  },
  {
    id: 'bijian',
    name: '必剪',
    icon: '✂️',
    platform: 'zh',
    url: 'https://bcut.bilibili.com/',
    features: ['B站专属', '二次元模板', '一键投稿', '弹幕效果'],
    level: 'beginner'
  },
  {
    id: 'kuaiying',
    name: '快影',
    icon: '⚡',
    platform: 'zh',
    url: 'https://www.kuaiying.com/',
    features: ['快手专属', 'AI配音', '一键成片', '智能剪辑'],
    level: 'beginner'
  },
  
  // 国际工具
  {
    id: 'capcut',
    name: 'CapCut',
    icon: '🎬',
    platform: 'global',
    url: 'https://www.capcut.com/',
    features: ['Auto captions', 'AI effects', 'Templates', 'Free'],
    level: 'beginner'
  },
  {
    id: 'premiere',
    name: 'Adobe Premiere Pro',
    icon: '🎥',
    platform: 'global',
    url: 'https://www.adobe.com/products/premiere.html',
    features: ['Professional', 'Integration', 'Advanced effects', 'Industry standard'],
    level: 'professional'
  },
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    icon: '🎨',
    platform: 'global',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve',
    features: ['Color grading', 'Free version', 'Professional', 'Fusion effects'],
    level: 'professional'
  },
  {
    id: 'final-cut',
    name: 'Final Cut Pro',
    icon: '🍎',
    platform: 'global',
    url: 'https://www.apple.com/final-cut-pro/',
    features: ['Mac optimized', 'Magnetic timeline'],
    level: 'professional'
  },
  {
    id: 'davinci',
    name: 'DaVinci Resolve',
    icon: '🎨',
    platform: 'global',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve',
    features: ['Color grading', 'Free version', 'Professional', 'Fusion effects'],
    level: 'professional'
  },
  {
    id: 'final-cut',
    name: 'Final Cut Pro',
    icon: '🍎',
    platform: 'global',
    url: 'https://www.apple.com/final-cut-pro/',
    features: ['Mac only', 'Magnetic timeline', 'Optimized', 'Professional'],
    level: 'professional'
  }
];

export const getEditingTools = (lang: 'zh' | 'en') => {
  return editingTools.filter(tool => 
    lang === 'zh' ? tool.platform === 'zh' : tool.platform === 'global'
  );
};