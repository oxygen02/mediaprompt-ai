/**
 * PromptBox AI 提示词库
 * 本地提示词模板，无需 API 调用
 */

export interface PromptTemplate {
  id: string;
  name: string;
  nameEn: string;
  category: PromptCategory;
  tags: string[];
  description: string;
  template: string;
  variables?: PromptVariable[];
  examples?: string[];
  author?: string;
  createdAt: string;
  usage: number;
  rating: number;
}

export type PromptCategory = 
  | 'writing'      // 写作
  | 'image'        // 图像生成
  | 'video'        // 视频生成
  | 'code'         // 代码
  | 'marketing'    // 营销
  | 'business'     // 商业
  | 'education'    // 教育
  | 'creative'     // 创意
  | 'analysis'     // 分析
  | 'translation'  // 翻译
  | 'social'       // 社交媒体
  | 'document';    // 文档

export interface PromptVariable {
  name: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'textarea';
  default?: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

// ============ 写作类提示词 ============

export const writingPrompts: PromptTemplate[] = [
  {
    id: 'article-outline',
    name: '文章大纲生成器',
    nameEn: 'Article Outline Generator',
    category: 'writing',
    tags: ['写作', '大纲', '结构'],
    description: '根据主题生成结构化的文章大纲',
    template: `你是一位专业的写作顾问。请为主题"{{topic}}"生成一份详细的文章大纲。

要求：
1. 目标读者：{{audience}}
2. 文章类型：{{articleType}}
3. 字数范围：{{wordCount}}

请按以下格式输出：
## 标题
[建议的文章标题]

## 核心观点
[文章要传达的核心信息]

## 大纲结构
1. 引言
   - 开篇钩子
   - 背景介绍
   - 论点预告
2. 正文
   - 分论点1
   - 分论点2
   - 分论点3
3. 结论
   - 总结要点
   - 行动号召`,
    variables: [
      { name: 'topic', label: '主题', type: 'text', required: true, placeholder: '请输入文章主题' },
      { name: 'audience', label: '目标读者', type: 'select', options: ['普通大众', '专业人士', '学生', '企业家', '技术人员'], default: '普通大众' },
      { name: 'articleType', label: '文章类型', type: 'select', options: ['科普文章', '新闻稿', '评论文章', '教程指南', '研究报告'], default: '科普文章' },
      { name: 'wordCount', label: '字数', type: 'select', options: ['500-1000字', '1000-2000字', '2000-3000字', '3000字以上'], default: '1000-2000字' }
    ],
    createdAt: '2024-01-01',
    usage: 1520,
    rating: 4.8
  },
  {
    id: 'content-rewrite',
    name: '内容改写专家',
    nameEn: 'Content Rewriter',
    category: 'writing',
    tags: ['改写', '润色', '优化'],
    description: '将原文改写成不同风格',
    template: `你是一位专业的文字编辑。请将以下内容改写成{{style}}风格。

原文：
"""
{{content}}
"""

改写要求：
1. 保持原文核心信息不变
2. 语言风格调整为{{style}}
3. 改进句式结构，增强可读性
4. 字数控制在原文的80%-120%

请输出改写后的内容：`,
    variables: [
      { name: 'content', label: '原文内容', type: 'textarea', required: true, placeholder: '请输入需要改写的内容' },
      { name: 'style', label: '改写风格', type: 'select', options: ['正式学术', '轻松活泼', '专业商务', '文艺优雅', '简洁明了'], default: '简洁明了' }
    ],
    createdAt: '2024-01-01',
    usage: 2350,
    rating: 4.7
  },
  {
    id: 'story-writer',
    name: '小说创作助手',
    nameEn: 'Story Writer',
    category: 'creative',
    tags: ['小说', '创意', '故事'],
    description: '根据设定生成小说片段',
    template: `你是一位才华横溢的作家。请根据以下设定创作一段小说：

【背景设定】
时代背景：{{era}}
地点：{{location}}

【人物设定】
主角：{{protagonist}}
主角性格：{{personality}}

【情节要求】
场景类型：{{scene}}
情感基调：{{mood}}
字数要求：约{{wordCount}}字

请创作这个场景，注意：
1. 注重细节描写，营造氛围
2. 人物对话要符合性格特点
3. 适当使用比喻和意象
4. 结尾留有悬念或余韵`,
    variables: [
      { name: 'era', label: '时代背景', type: 'select', options: ['现代都市', '古代中国', '未来科幻', '奇幻世界', '民国时期'], default: '现代都市' },
      { name: 'location', label: '地点', type: 'text', default: '咖啡馆', placeholder: '故事发生的地点' },
      { name: 'protagonist', label: '主角', type: 'text', required: true, placeholder: '主角姓名和身份' },
      { name: 'personality', label: '性格特点', type: 'text', default: '内向敏感', placeholder: '主角的性格' },
      { name: 'scene', label: '场景类型', type: 'select', options: ['相遇', '冲突', '告白', '告别', '回忆'], default: '相遇' },
      { name: 'mood', label: '情感基调', type: 'select', options: ['温馨', '忧伤', '紧张', '浪漫', '悬疑'], default: '温馨' },
      { name: 'wordCount', label: '字数', type: 'number', default: '800' }
    ],
    createdAt: '2024-01-01',
    usage: 890,
    rating: 4.9
  }
];

// ============ 图像生成提示词 ============

export const imagePrompts: PromptTemplate[] = [
  {
    id: 'portrait-prompt',
    name: '人像摄影提示词',
    nameEn: 'Portrait Photography Prompt',
    category: 'image',
    tags: ['人像', '摄影', '肖像'],
    description: '生成专业人像摄影提示词',
    template: `专业人像摄影，{{subject}}，{{pose}}，{{expression}}，{{lighting}}光线，{{background}}背景，{{style}}风格，{{mood}}氛围，使用{{lens}}镜头，{{framing}}构图，高分辨率，专业摄影，景深效果`,
    variables: [
      { name: 'subject', label: '主体', type: 'text', required: true, placeholder: '描述人物特征' },
      { name: 'pose', label: '姿势', type: 'select', options: ['正面直视', '侧脸轮廓', '回眸一瞥', '低头沉思', '仰望远方'], default: '正面直视' },
      { name: 'expression', label: '表情', type: 'select', options: ['温柔微笑', '严肃专注', '自然放松', '神秘冷峻', '活泼俏皮'], default: '自然放松' },
      { name: 'lighting', label: '光线', type: 'select', options: ['自然日光', '柔和窗光', '戏剧性侧光', '逆光剪影', '专业影棚光'], default: '自然日光' },
      { name: 'background', label: '背景', type: 'select', options: ['简洁纯色', '城市街景', '自然风光', '室内环境', '渐变色'], default: '简洁纯色' },
      { name: 'style', label: '风格', type: 'select', options: ['写实摄影', '电影质感', '油画风格', '日系小清新', '高级黑白'], default: '写实摄影' },
      { name: 'mood', label: '氛围', type: 'select', options: ['温暖阳光', '冷调优雅', '复古怀旧', '现代时尚', '梦幻柔美'], default: '温暖阳光' },
      { name: 'lens', label: '镜头', type: 'select', options: ['85mm人像镜头', '50mm标准镜头', '35mm人文镜头', '135mm长焦'], default: '85mm人像镜头' },
      { name: 'framing', label: '构图', type: 'select', options: ['大头照', '半身像', '全身像', '环境人像', '特写'], default: '半身像' }
    ],
    examples: [
      '专业人像摄影，年轻女性，侧脸轮廓，自然放松，柔和窗光，简洁纯色背景，写实摄影风格，温暖阳光氛围，使用85mm人像镜头，半身像构图，高分辨率，专业摄影，景深效果'
    ],
    createdAt: '2024-01-01',
    usage: 3200,
    rating: 4.9
  },
  {
    id: 'landscape-prompt',
    name: '风景摄影提示词',
    nameEn: 'Landscape Photography Prompt',
    category: 'image',
    tags: ['风景', '摄影', '自然'],
    description: '生成专业风景摄影提示词',
    template: `壮丽风景摄影，{{scene}}，{{time}}时分的{{weather}}天气，{{composition}}构图，{{style}}风格，{{mood}}氛围，{{technique}}技术处理，超高清，8K分辨率，专业风光摄影`,
    variables: [
      { name: 'scene', label: '场景', type: 'select', options: ['山峦叠嶂', '海天一线', '森林溪流', '沙漠戈壁', '城市天际线', '田园风光', '雪山冰川', '热带雨林'], default: '山峦叠嶂' },
      { name: 'time', label: '时间', type: 'select', options: ['日出', '日落', '正午', '黄昏', '深夜星空', '蓝调时刻'], default: '日落' },
      { name: 'weather', label: '天气', type: 'select', options: ['晴朗', '多云', '雾气', '雨后', '雪景', '风暴'], default: '晴朗' },
      { name: 'composition', label: '构图', type: 'select', options: ['三分法', '对称构图', '引导线', '框架构图', '对角线', '黄金分割'], default: '三分法' },
      { name: 'style', label: '风格', type: 'select', options: ['写实风光', '梦幻唯美', '暗调戏剧', '高调清新', '电影感', '黑白艺术'], default: '写实风光' },
      { name: 'mood', label: '氛围', type: 'select', options: ['宁静祥和', '壮阔震撼', '神秘幽深', '温馨浪漫', '苍凉旷远'], default: '壮阔震撼' },
      { name: 'technique', label: '技术', type: 'select', options: ['长曝光', 'HDR合成', '全景接片', '延时摄影', '景深合成'], default: 'HDR合成' }
    ],
    createdAt: '2024-01-01',
    usage: 2100,
    rating: 4.8
  },
  {
    id: 'product-prompt',
    name: '产品展示提示词',
    nameEn: 'Product Photography Prompt',
    category: 'image',
    tags: ['产品', '电商', '商业'],
    description: '生成电商产品摄影提示词',
    template: `商业产品摄影，{{product}}，{{angle}}角度展示，{{background}}背景，{{lighting}}布光，{{style}}风格，{{props}}道具搭配，专业影棚拍摄，高清细节，商业级后期，突出产品质感`,
    variables: [
      { name: 'product', label: '产品', type: 'text', required: true, placeholder: '产品名称和特点' },
      { name: 'angle', label: '角度', type: 'select', options: ['正面展示', '45度角', '俯视平铺', '侧面轮廓', '细节特写'], default: '45度角' },
      { name: 'background', label: '背景', type: 'select', options: ['纯白背景', '渐变背景', '场景化背景', '深色背景', '透明玻璃'], default: '纯白背景' },
      { name: 'lighting', label: '布光', type: 'select', options: ['柔和均匀', '侧面光', '顶光', '轮廓光', '混合光'], default: '柔和均匀' },
      { name: 'style', label: '风格', type: 'select', options: ['简洁干净', '高级奢华', '清新自然', '科技感', '复古怀旧'], default: '简洁干净' },
      { name: 'props', label: '道具', type: 'select', options: ['无道具', '植物装饰', '生活场景', '几何造型', '水珠溅射'], default: '无道具' }
    ],
    createdAt: '2024-01-01',
    usage: 4500,
    rating: 4.7
  },
  {
    id: 'anime-prompt',
    name: '动漫风格提示词',
    nameEn: 'Anime Style Prompt',
    category: 'image',
    tags: ['动漫', '二次元', '插画'],
    description: '生成动漫/二次元风格提示词',
    template: `{{style}}风格，{{character}}，{{outfit}}，{{pose}}，{{expression}}，{{hair}}发型，{{eyes}}眼神，{{background}}背景，{{colorScheme}}配色，{{artistStyle}}画风，高质量，精细细节，官方插画品质`,
    variables: [
      { name: 'style', label: '风格', type: 'select', options: ['日系动漫', '韩系插画', '美漫风格', '中国风', '赛博朋克', '蒸汽朋克'], default: '日系动漫' },
      { name: 'character', label: '角色', type: 'text', required: true, placeholder: '描述角色特征' },
      { name: 'outfit', label: '服装', type: 'text', default: '校服', placeholder: '服装描述' },
      { name: 'pose', label: '姿势', type: 'select', options: ['站姿', '坐姿', '奔跑', '战斗姿态', '飞翔', '冥想'], default: '站姿' },
      { name: 'expression', label: '表情', type: 'select', options: ['微笑', '严肃', '害羞', '兴奋', '悲伤', '冷酷'], default: '微笑' },
      { name: 'hair', label: '发型', type: 'text', default: '长发飘逸', placeholder: '发型和发色' },
      { name: 'eyes', label: '眼神', type: 'select', options: ['清澈明亮', '深邃神秘', '温柔柔和', '锐利坚定', '呆萌可爱'], default: '清澈明亮' },
      { name: 'background', label: '背景', type: 'select', options: ['樱花飘落', '城市夜景', '魔法森林', '海边', '星空', '简洁'], default: '樱花飘落' },
      { name: 'colorScheme', label: '配色', type: 'select', options: ['明亮暖色', '冷色调', '粉嫩少女', '复古色调', '高对比'], default: '明亮暖色' },
      { name: 'artistStyle', label: '画风', type: 'select', options: ['新海诚风格', '京阿尼风格', '骨头社风格', 'MAPPA风格', '原创风格'], default: '原创风格' }
    ],
    createdAt: '2024-01-01',
    usage: 5600,
    rating: 4.9
  }
];

// ============ 视频生成提示词 ============

export const videoPrompts: PromptTemplate[] = [
  {
    id: 'cinematic-video',
    name: '电影感视频',
    nameEn: 'Cinematic Video',
    category: 'video',
    tags: ['电影', '视频', '叙事'],
    description: '生成电影感视频提示词',
    template: `电影级视频片段，{{scene}}场景，{{camera}}镜头运动，{{action}}动作，{{lighting}}光线，{{mood}}氛围，{{style}}风格，{{duration}}秒时长，{{ratio}}比例，4K画质，流畅运镜，专业后期调色`,
    variables: [
      { name: 'scene', label: '场景', type: 'text', required: true, placeholder: '描述视频场景' },
      { name: 'camera', label: '镜头', type: 'select', options: ['缓慢推进', '环绕拍摄', '跟随镜头', '升降镜头', '手持晃动', '固定机位'], default: '缓慢推进' },
      { name: 'action', label: '动作', type: 'text', default: '人物缓步行走', placeholder: '描述画面中的动作' },
      { name: 'lighting', label: '光线', type: 'select', options: ['黄金时刻', '蓝色时刻', '霓虹灯光', '自然日光', '戏剧性阴影'], default: '黄金时刻' },
      { name: 'mood', label: '氛围', type: 'select', options: ['温暖怀旧', '冷峻悬疑', '浪漫唯美', '紧张刺激', '宁静平和'], default: '宁静平和' },
      { name: 'style', label: '风格', type: 'select', options: ['好莱坞大片', '欧洲文艺片', '日系清新', '赛博朋克', '复古胶片'], default: '好莱坞大片' },
      { name: 'duration', label: '时长', type: 'select', options: ['3', '5', '8', '10', '15'], default: '5' },
      { name: 'ratio', label: '比例', type: 'select', options: ['16:9横屏', '9:16竖屏', '1:1方形', '2.39:1宽银幕'], default: '16:9横屏' }
    ],
    createdAt: '2024-01-01',
    usage: 1800,
    rating: 4.8
  },
  {
    id: 'product-video',
    name: '产品宣传视频',
    nameEn: 'Product Promo Video',
    category: 'video',
    tags: ['产品', '宣传', '商业'],
    description: '生成产品宣传视频提示词',
    template: `商业产品视频，{{product}}，{{shot}}镜头，{{angle}}角度，{{effect}}特效，{{bg}}背景，{{pace}}节奏，{{style}}风格，{{duration}}秒，专业摄影棚拍摄，高清画质，广告级后期`,
    variables: [
      { name: 'product', label: '产品', type: 'text', required: true, placeholder: '产品名称' },
      { name: 'shot', label: '镜头', type: 'select', options: ['产品特写', '360度展示', '使用场景', '细节呈现', '开箱展示'], default: '产品特写' },
      { name: 'angle', label: '角度', type: 'select', options: ['正面', '侧面', '俯视', '仰视', '动态跟随'], default: '正面' },
      { name: 'effect', label: '特效', type: 'select', options: ['无特效', '光影闪烁', '粒子特效', '慢动作', '快切'], default: '无特效' },
      { name: 'bg', label: '背景', type: 'select', options: ['纯色背景', '科技感背景', '自然场景', '室内场景', '抽象渐变'], default: '纯色背景' },
      { name: 'pace', label: '节奏', type: 'select', options: ['缓慢优雅', '中等节奏', '快速动感'], default: '中等节奏' },
      { name: 'style', label: '风格', type: 'select', options: ['苹果风格', '高端奢华', '科技未来', '简约现代', '活泼年轻'], default: '简约现代' },
      { name: 'duration', label: '时长', type: 'select', options: ['5', '10', '15', '30'], default: '10' }
    ],
    createdAt: '2024-01-01',
    usage: 2200,
    rating: 4.6
  }
];

// ============ 营销类提示词 ============

export const marketingPrompts: PromptTemplate[] = [
  {
    id: 'copywriting',
    name: '营销文案生成器',
    nameEn: 'Marketing Copy Generator',
    category: 'marketing',
    tags: ['文案', '营销', '广告'],
    description: '生成有吸引力的营销文案',
    template: `你是一位资深文案策划。请为以下产品/服务撰写营销文案：

【产品信息】
产品名称：{{productName}}
产品特点：{{features}}
目标用户：{{targetAudience}}
核心卖点：{{usp}}

【文案要求】
风格：{{style}}
平台：{{platform}}
字数：约{{wordCount}}字

请按以下结构撰写文案：
1. 标题（吸睛，10字以内）
2. 副标题（补充说明，20字以内）
3. 正文（突出卖点，引发共鸣）
4. 行动号召（明确引导）

注意：文案要符合平台调性，避免违禁词，突出产品价值。`,
    variables: [
      { name: 'productName', label: '产品名称', type: 'text', required: true },
      { name: 'features', label: '产品特点', type: 'textarea', required: true, placeholder: '列出产品的主要特点和优势' },
      { name: 'targetAudience', label: '目标用户', type: 'text', required: true, placeholder: '描述目标用户画像' },
      { name: 'usp', label: '核心卖点', type: 'text', required: true, placeholder: '差异化优势' },
      { name: 'style', label: '风格', type: 'select', options: ['温暖感性', '专业理性', '幽默活泼', '高端奢华', '亲民实用'], default: '亲民实用' },
      { name: 'platform', label: '平台', type: 'select', options: ['微信公众号', '小红书', '抖音', '微博', '官网', '电商详情页'], default: '微信公众号' },
      { name: 'wordCount', label: '字数', type: 'number', default: '200' }
    ],
    createdAt: '2024-01-01',
    usage: 4200,
    rating: 4.8
  },
  {
    id: 'social-post',
    name: '社交媒体文案',
    nameEn: 'Social Media Post',
    category: 'social',
    tags: ['社交媒体', '文案', '内容'],
    description: '生成社交媒体发布内容',
    template: `请为{{platform}}创作一条关于{{topic}}的发布内容。

要求：
- 风格：{{style}}
- 目的：{{purpose}}
- 包含：{{elements}}
- 字数：{{wordCount}}字以内

请输出：
【文案内容】
[正文]

【话题标签】
[相关话题标签]

【配图建议】
[图片或视频建议]`,
    variables: [
      { name: 'platform', label: '平台', type: 'select', options: ['小红书', '抖音', '微博', '朋友圈', 'Instagram', 'Twitter/X'], default: '小红书' },
      { name: 'topic', label: '主题', type: 'text', required: true, placeholder: '内容主题' },
      { name: 'style', label: '风格', type: 'select', options: ['种草安利', '干货分享', '情感共鸣', '幽默搞笑', '知识科普'], default: '种草安利' },
      { name: 'purpose', label: '目的', type: 'select', options: ['增加曝光', '引导互动', '产品推广', '建立人设', '资讯分享'], default: '增加曝光' },
      { name: 'elements', label: '元素', type: 'select', options: ['表情符号', '话题标签', '提问互动', '数据支撑', '故事案例'], default: '表情符号' },
      { name: 'wordCount', label: '字数', type: 'select', options: ['50字以内', '100字以内', '200字以内', '500字以内'], default: '200字以内' }
    ],
    createdAt: '2024-01-01',
    usage: 3800,
    rating: 4.7
  }
];

// ============ 商业类提示词 ============

export const businessPrompts: PromptTemplate[] = [
  {
    id: 'business-plan',
    name: '商业计划书大纲',
    nameEn: 'Business Plan Outline',
    category: 'business',
    tags: ['商业', '创业', '计划书'],
    description: '生成商业计划书大纲',
    template: `你是一位资深的商业顾问。请为以下创业项目撰写商业计划书大纲：

【项目信息】
项目名称：{{projectName}}
行业领域：{{industry}}
项目阶段：{{stage}}
融资金额：{{funding}}

请按以下结构输出详细大纲：

## 一、执行摘要
[核心要点概括]

## 二、公司介绍
[使命愿景、团队背景]

## 三、市场分析
[市场规模、目标用户、竞争分析]

## 四、产品/服务
[核心产品、技术壁垒、发展规划]

## 五、商业模式
[盈利模式、成本结构、关键指标]

## 六、运营策略
[营销策略、渠道策略、增长计划]

## 七、财务规划
[收入预测、资金用途、退出机制]

## 八、风险分析
[主要风险及应对措施]

请确保内容专业、逻辑清晰、数据支撑。`,
    variables: [
      { name: 'projectName', label: '项目名称', type: 'text', required: true },
      { name: 'industry', label: '行业', type: 'select', options: ['互联网', '人工智能', '新能源', '消费零售', '教育', '医疗健康', '金融科技', '其他'], default: '互联网' },
      { name: 'stage', label: '阶段', type: 'select', options: ['种子轮', '天使轮', 'A轮', 'B轮', 'C轮及以后'], default: '种子轮' },
      { name: 'funding', label: '融资金额', type: 'text', default: '500万', placeholder: '如：500万、1000万' }
    ],
    createdAt: '2024-01-01',
    usage: 980,
    rating: 4.6
  },
  {
    id: 'email-template',
    name: '商务邮件模板',
    nameEn: 'Business Email Template',
    category: 'business',
    tags: ['邮件', '商务', '沟通'],
    description: '生成专业商务邮件',
    template: `你是一位商务沟通专家。请撰写一封{{type}}邮件。

【邮件信息】
收件人：{{recipient}}
发件人身份：{{sender}}
主要内容：{{content}}
语气：{{tone}}

请输出格式规范的邮件：

---
**主题：** {{subject}}

**正文：**

{{emailBody}}

**签名：**
{{signature}}
---`,
    variables: [
      { name: 'type', label: '邮件类型', type: 'select', options: ['初次联系', '跟进邮件', '邀请邮件', '感谢邮件', '拒绝邮件', '投诉邮件'], default: '初次联系' },
      { name: 'recipient', label: '收件人', type: 'text', required: true, placeholder: '收件人身份/公司' },
      { name: 'sender', label: '发件人身份', type: 'text', required: true, placeholder: '你的身份/职位' },
      { name: 'content', label: '主要内容', type: 'textarea', required: true, placeholder: '邮件要表达的核心内容' },
      { name: 'tone', label: '语气', type: 'select', options: ['正式商务', '友好亲切', '严肃认真', '轻松幽默'], default: '正式商务' }
    ],
    createdAt: '2024-01-01',
    usage: 1500,
    rating: 4.5
  }
];

// ============ 代码类提示词 ============

export const codePrompts: PromptTemplate[] = [
  {
    id: 'code-review',
    name: '代码审查助手',
    nameEn: 'Code Review Assistant',
    category: 'code',
    tags: ['代码', '审查', '优化'],
    description: '对代码进行专业审查',
    template: `你是一位资深软件工程师。请对以下代码进行审查：

\`\`\`{{language}}
{{code}}
\`\`\`

请从以下维度进行审查并给出改进建议：

## 1. 代码质量
- 可读性
- 命名规范
- 代码结构

## 2. 性能优化
- 时间复杂度
- 空间复杂度
- 潜在性能瓶颈

## 3. 安全性
- 潜在安全漏洞
- 输入验证
- 敏感信息处理

## 4. 最佳实践
- 设计模式应用
- 代码复用
- 测试覆盖

## 5. 改进建议
[具体的优化代码示例]`,
    variables: [
      { name: 'language', label: '语言', type: 'select', options: ['JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', '其他'], default: 'JavaScript' },
      { name: 'code', label: '代码', type: 'textarea', required: true, placeholder: '请粘贴需要审查的代码' }
    ],
    createdAt: '2024-01-01',
    usage: 2800,
    rating: 4.8
  },
  {
    id: 'api-doc',
    name: 'API文档生成器',
    nameEn: 'API Doc Generator',
    category: 'code',
    tags: ['API', '文档', '开发'],
    description: '根据接口信息生成API文档',
    template: `请根据以下接口信息生成标准的API文档：

接口名称：{{apiName}}
请求方法：{{method}}
接口地址：{{endpoint}}
功能描述：{{description}}

请求参数：
{{params}}

响应示例：
{{response}}

请按照OpenAPI 3.0规范输出完整文档，包括：
- 接口描述
- 请求参数说明
- 响应结构说明
- 错误码说明
- 调用示例`,
    variables: [
      { name: 'apiName', label: '接口名称', type: 'text', required: true },
      { name: 'method', label: '请求方法', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], default: 'GET' },
      { name: 'endpoint', label: '接口地址', type: 'text', required: true, placeholder: '/api/v1/resource' },
      { name: 'description', label: '功能描述', type: 'textarea', required: true },
      { name: 'params', label: '请求参数', type: 'textarea', placeholder: '参数列表（JSON格式）' },
      { name: 'response', label: '响应示例', type: 'textarea', placeholder: '响应数据（JSON格式）' }
    ],
    createdAt: '2024-01-01',
    usage: 1200,
    rating: 4.6
  }
];

// ============ 教育类提示词 ============

export const educationPrompts: PromptTemplate[] = [
  {
    id: 'lesson-plan',
    name: '教学教案生成器',
    nameEn: 'Lesson Plan Generator',
    category: 'education',
    tags: ['教育', '教案', '教学'],
    description: '生成结构化教学教案',
    template: `你是一位资深教育工作者。请为以下课程设计教案：

【课程信息】
学科：{{subject}}
年级：{{grade}}
课题：{{topic}}
课时：{{duration}}分钟
教学目标：{{objectives}}

请按以下结构输出教案：

## 一、教学目标
### 知识与技能
### 过程与方法
### 情感态度与价值观

## 二、教学重难点
### 重点
### 难点

## 三、教学方法

## 四、教学过程
### 1. 导入（5分钟）
### 2. 新授（20分钟）
### 3. 练习（10分钟）
### 4. 总结（5分钟）
### 5. 作业布置

## 五、板书设计

## 六、教学反思`,
    variables: [
      { name: 'subject', label: '学科', type: 'select', options: ['语文', '数学', '英语', '物理', '化学', '生物', '历史', '地理', '政治'], default: '语文' },
      { name: 'grade', label: '年级', type: 'select', options: ['小学一年级', '小学三年级', '小学六年级', '初中一年级', '初中三年级', '高中一年级', '高中三年级'], default: '初中一年级' },
      { name: 'topic', label: '课题', type: 'text', required: true, placeholder: '如：背影、勾股定理' },
      { name: 'duration', label: '课时', type: 'number', default: '45' },
      { name: 'objectives', label: '教学目标', type: 'textarea', required: true, placeholder: '学生应掌握的知识和技能' }
    ],
    createdAt: '2024-01-01',
    usage: 950,
    rating: 4.7
  },
  {
    id: 'quiz-generator',
    name: '试题生成器',
    nameEn: 'Quiz Generator',
    category: 'education',
    tags: ['教育', '试题', '考试'],
    description: '根据知识点生成试题',
    template: `你是一位专业命题教师。请根据以下要求生成试题：

【试题信息】
学科：{{subject}}
知识点：{{knowledgePoint}}
难度：{{difficulty}}
题型：{{questionTypes}}
数量：{{count}}题

请生成试题，每题包含：
1. 题目
2. 选项（选择题）
3. 正确答案
4. 解析说明

注意：
- 试题要有梯度，由易到难
- 答案解析要详细
- 避免出现偏题怪题`,
    variables: [
      { name: 'subject', label: '学科', type: 'text', required: true },
      { name: 'knowledgePoint', label: '知识点', type: 'text', required: true, placeholder: '具体的知识点' },
      { name: 'difficulty', label: '难度', type: 'select', options: ['简单', '中等', '困难', '混合'], default: '中等' },
      { name: 'questionTypes', label: '题型', type: 'select', options: ['选择题', '填空题', '简答题', '综合题', '混合题型'], default: '选择题' },
      { name: 'count', label: '数量', type: 'number', default: '10' }
    ],
    createdAt: '2024-01-01',
    usage: 1800,
    rating: 4.6
  }
];

// ============ 分析类提示词 ============

export const analysisPrompts: PromptTemplate[] = [
  {
    id: 'data-analysis',
    name: '数据分析报告',
    nameEn: 'Data Analysis Report',
    category: 'analysis',
    tags: ['数据', '分析', '报告'],
    description: '生成数据分析报告框架',
    template: `你是一位数据分析专家。请对以下数据进行分析：

【分析背景】
业务场景：{{scenario}}
数据类型：{{dataType}}
分析目的：{{purpose}}
数据概况：{{dataOverview}}

请输出分析报告：

## 一、数据概览
- 数据规模
- 数据质量评估
- 异常值识别

## 二、探索性分析
- 描述性统计
- 分布特征
- 相关性分析

## 三、核心发现
[关键洞察和发现]

## 四、业务解读
[结合业务场景的解读]

## 五、建议与行动项
[基于数据的决策建议]`,
    variables: [
      { name: 'scenario', label: '业务场景', type: 'text', required: true, placeholder: '如：电商销售、用户增长' },
      { name: 'dataType', label: '数据类型', type: 'select', options: ['时间序列', '用户行为', '交易数据', '调研问卷', '日志数据'], default: '时间序列' },
      { name: 'purpose', label: '分析目的', type: 'textarea', required: true },
      { name: 'dataOverview', label: '数据概况', type: 'textarea', placeholder: '数据规模、时间范围等' }
    ],
    createdAt: '2024-01-01',
    usage: 1100,
    rating: 4.7
  },
  {
    id: 'competitor-analysis',
    name: '竞品分析报告',
    nameEn: 'Competitor Analysis',
    category: 'analysis',
    tags: ['竞品', '分析', '市场'],
    description: '生成竞品分析报告',
    template: `你是一位市场分析专家。请进行竞品分析：

【分析对象】
我们的产品：{{ourProduct}}
竞品：{{competitor}}
分析维度：{{dimensions}}

请输出竞品分析报告：

## 一、竞品概述
- 公司背景
- 产品定位
- 目标用户

## 二、功能对比
| 维度 | 我们的产品 | 竞品 | 差异点 |
|------|-----------|------|--------|
[对比表格]

## 三、用户体验分析
- 界面设计
- 交互流程
- 核心体验

## 四、商业模式分析
- 盈利模式
- 定价策略
- 渠道策略

## 五、SWOT分析
- 优势（S）
- 劣势（W）
- 机会（O）
- 威胁（T）

## 六、策略建议
[基于分析的竞争策略]`,
    variables: [
      { name: 'ourProduct', label: '我们的产品', type: 'text', required: true },
      { name: 'competitor', label: '竞品', type: 'text', required: true },
      { name: 'dimensions', label: '分析维度', type: 'select', options: ['功能对比', '用户体验', '商业模式', '市场策略', '全面分析'], default: '全面分析' }
    ],
    createdAt: '2024-01-01',
    usage: 1400,
    rating: 4.8
  }
];

// ============ 翻译类提示词 ============

export const translationPrompts: PromptTemplate[] = [
  {
    id: 'professional-translation',
    name: '专业翻译助手',
    nameEn: 'Professional Translator',
    category: 'translation',
    tags: ['翻译', '多语言', '专业'],
    description: '高质量多语言翻译',
    template: `你是一位资深翻译专家。请将以下内容从{{sourceLang}}翻译成{{targetLang}}：

【原文】
{{content}}

【翻译要求】
风格：{{style}}
专业领域：{{domain}}

【译文】
[翻译内容]

【翻译说明】
- 关键术语处理
- 文化适配说明
- 其他注意事项`,
    variables: [
      { name: 'sourceLang', label: '源语言', type: 'select', options: ['中文', '英文', '日文', '韩文', '法文', '德文', '西班牙文', '俄文'], default: '中文' },
      { name: 'targetLang', label: '目标语言', type: 'select', options: ['英文', '中文', '日文', '韩文', '法文', '德文', '西班牙文', '俄文'], default: '英文' },
      { name: 'content', label: '原文内容', type: 'textarea', required: true },
      { name: 'style', label: '风格', type: 'select', options: ['正式商务', '文学艺术', '科技专业', '日常口语', '新闻报道'], default: '正式商务' },
      { name: 'domain', label: '专业领域', type: 'select', options: ['通用', '法律', '医学', '技术', '金融', '文学'], default: '通用' }
    ],
    createdAt: '2024-01-01',
    usage: 5200,
    rating: 4.9
  }
];

// ============ 文档类提示词 ============

export const documentPrompts: PromptTemplate[] = [
  {
    id: 'summary-generator',
    name: '文档摘要生成器',
    nameEn: 'Document Summary Generator',
    category: 'document',
    tags: ['摘要', '文档', '总结'],
    description: '生成文档核心内容摘要',
    template: `请为以下文档生成摘要：

【文档内容】
{{content}}

【摘要要求】
- 类型：{{summaryType}}
- 字数：{{wordCount}}字左右
- 语言：{{language}}

请输出：
## 核心观点
[3-5个关键观点]

## 内容摘要
[精炼的摘要内容]

## 关键信息
[重要数据、结论等]`,
    variables: [
      { name: 'content', label: '文档内容', type: 'textarea', required: true },
      { name: 'summaryType', label: '摘要类型', type: 'select', options: ['提纲式', '段落式', '要点式', '思维导图式'], default: '段落式' },
      { name: 'wordCount', label: '字数', type: 'number', default: '200' },
      { name: 'language', label: '语言', type: 'select', options: ['中文', '英文', '中英双语'], default: '中文' }
    ],
    createdAt: '2024-01-01',
    usage: 3500,
    rating: 4.7
  },
  {
    id: 'meeting-minutes',
    name: '会议纪要生成器',
    nameEn: 'Meeting Minutes Generator',
    category: 'document',
    tags: ['会议', '纪要', '记录'],
    description: '根据会议内容生成规范纪要',
    template: `请根据以下会议信息生成会议纪要：

【会议信息】
会议主题：{{title}}
时间：{{date}}
参会人员：{{attendees}}
会议内容：{{content}}

请输出规范格式的会议纪要：

---
# 会议纪要

## 基本信息
- 会议主题：
- 会议时间：
- 会议地点：
- 参会人员：
- 记录人：

## 会议议题

### 议题一
- 讨论内容：
- 决议结果：

### 议题二
- 讨论内容：
- 决议结果：

## 待办事项
| 事项 | 负责人 | 截止日期 |
|------|--------|----------|

## 下次会议安排
- 时间：
- 议题：
---`,
    variables: [
      { name: 'title', label: '会议主题', type: 'text', required: true },
      { name: 'date', label: '时间', type: 'text', default: '今天' },
      { name: 'attendees', label: '参会人员', type: 'text', placeholder: '列出参会人员' },
      { name: 'content', label: '会议内容', type: 'textarea', required: true, placeholder: '会议讨论的主要内容' }
    ],
    createdAt: '2024-01-01',
    usage: 1600,
    rating: 4.6
  }
];

// ============ 全部提示词导出 ============

export const allPrompts: PromptTemplate[] = [
  ...writingPrompts,
  ...imagePrompts,
  ...videoPrompts,
  ...marketingPrompts,
  ...businessPrompts,
  ...codePrompts,
  ...educationPrompts,
  ...analysisPrompts,
  ...translationPrompts,
  ...documentPrompts
];

// 按分类获取提示词
export function getPromptsByCategory(category: PromptCategory): PromptTemplate[] {
  return allPrompts.filter(p => p.category === category);
}

// 搜索提示词
export function searchPrompts(query: string): PromptTemplate[] {
  const lowerQuery = query.toLowerCase();
  return allPrompts.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.nameEn.toLowerCase().includes(lowerQuery) ||
    p.tags.some(t => t.includes(query)) ||
    p.description.includes(query)
  );
}

// 获取热门提示词
export function getHotPrompts(limit: number = 10): PromptTemplate[] {
  return [...allPrompts].sort((a, b) => b.usage - a.usage).slice(0, limit);
}

// 获取高分提示词
export function getTopRatedPrompts(limit: number = 10): PromptTemplate[] {
  return [...allPrompts].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

// 填充模板变量
export function fillTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
}

// 分类标签
export const categoryLabels: Record<PromptCategory, string> = {
  writing: '写作',
  image: '图像生成',
  video: '视频生成',
  code: '代码',
  marketing: '营销',
  business: '商业',
  education: '教育',
  creative: '创意',
  analysis: '分析',
  translation: '翻译',
  social: '社交媒体',
  document: '文档'
};
