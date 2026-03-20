// 社交媒体模板数据
export interface SocialTemplate {
  id: string;
  platform: string;
  name: string;
  icon: string;
  structure: string;
  fields: string[];
  example?: Record<string, string>;
}

export const socialTemplates: Record<string, SocialTemplate[]> = {
  zh: [
    {
      id: 'xiaohongshu-1',
      platform: '小红书',
      name: '种草推荐',
      icon: '📕',
      structure: `标题：{{emoji}}被问爆的{{product}}，真的绝了！

姐妹们！今天必须跟你们分享这个{{product}}！

{{emoji}}使用场景：{{scene}}
{{emoji}}核心卖点：
{{features}}

{{emoji}}使用感受：{{experience}}

{{emoji}}小贴士：{{tips}}

{{hashtags}}

#{{productCategory}} #好物分享 #{{topic}}`,
      fields: ['product', 'scene', 'features', 'experience', 'tips', 'hashtags', 'productCategory', 'topic', 'emoji'],
      example: {
        product: '神仙高光',
        scene: '日常通勤和约会都超适合',
        features: '• 粉质细腻不飞粉\n• 上脸自然水光感\n• 持久度能打8小时',
        experience: '用了两个月，每次都被问色号！',
        tips: '建议少量多次叠加更自然',
        hashtags: '#平价高光 #学生党必备',
        productCategory: '美妆',
        topic: '妆容分享',
        emoji: '✨'
      }
    },
    {
      id: 'douyin-1',
      platform: '抖音',
      name: '短视频文案',
      icon: '🎵',
      structure: `{{hook}}（前3秒抓住眼球）

{{problem}}（痛点共鸣）

{{solution}}（解决方案）

{{proof}}（效果展示）

{{cta}}（行动号召）

{{hashtags}}`,
      fields: ['hook', 'problem', 'solution', 'proof', 'cta', 'hashtags'],
      example: {
        hook: '用了这个方法，我真的瘦了20斤！',
        problem: '你是不是也试过无数减肥方法都没用？',
        solution: '其实只需要坚持这三点...',
        proof: '看这是我的前后对比！',
        cta: '点赞关注，下一期分享详细教程',
        hashtags: '#减肥逆袭 #变美秘籍'
      }
    },
    {
      id: 'weibo-1',
      platform: '微博',
      name: '热点话题',
      icon: '📱',
      structure: `【{{topic}}】

{{content}}

{{emoji}} {{keyPoint}}

{{emoji}} {{opinion}}

{{emoji}} {{question}}

{{emoji}} {{interaction}}

{{hashtags}}

转发抽{{prize}}！`,
      fields: ['topic', 'content', 'keyPoint', 'opinion', 'question', 'interaction', 'hashtags', 'prize', 'emoji'],
      example: {
        topic: '2024最值得看的电影',
        content: '整理了一份年度片单，每一部都是心头好',
        keyPoint: '悬疑片爱好者必看',
        opinion: '个人最喜欢第三部',
        question: '你们今年看了哪些好电影？',
        interaction: '评论区聊聊',
        hashtags: '#电影推荐 #年度盘点',
        prize: '电影票2张',
        emoji: '🎬'
      }
    },
    {
      id: 'wechat-1',
      platform: '朋友圈',
      name: '生活分享',
      icon: '💬',
      structure: `{{emoji}} {{location}}

{{moment}}

{{feeling}}

{{emoji}} {{detail}}

{{emoji}} {{reflection}}

—— {{signature}}`,
      fields: ['location', 'moment', 'feeling', 'detail', 'reflection', 'signature', 'emoji'],
      example: {
        location: '上海·外滩',
        moment: '傍晚的江风，吹散了所有的疲惫',
        feeling: '这一刻，觉得生活真好',
        detail: '对岸的灯火璀璨，像梦里的场景',
        reflection: '有时候慢下来，才能看清方向',
        signature: '2024.3.20',
        emoji: '🌆'
      }
    }
  ],
  en: [
    {
      id: 'instagram-1',
      platform: 'Instagram',
      name: 'Lifestyle Post',
      icon: '📸',
      structure: `{{emoji}} {{caption}}

{{story}}

✨ {{highlight1}}
✨ {{highlight2}}
✨ {{highlight3}}

{{cta}}

{{hashtags}}`,
      fields: ['caption', 'story', 'highlight1', 'highlight2', 'highlight3', 'cta', 'hashtags', 'emoji'],
      example: {
        caption: 'Sunday morning vibes',
        story: 'Waking up to this view never gets old',
        highlight1: 'Fresh coffee',
        highlight2: 'Good book',
        highlight3: 'Zero plans',
        cta: 'How do you spend your Sundays?',
        hashtags: '#sundayvibes #lifestyle',
        emoji: '☕'
      }
    },
    {
      id: 'twitter-1',
      platform: 'Twitter/X',
      name: 'Quick Thread',
      icon: '🐦',
      structure: `🧵 {{hook}}

1/ {{point1}}

2/ {{point2}}

3/ {{point3}}

{{conclusion}}

{{cta}}`,
      fields: ['hook', 'point1', 'point2', 'point3', 'conclusion', 'cta'],
      example: {
        hook: '3 lessons I learned from failing my first startup:',
        point1: 'Your first idea is rarely the best',
        point2: 'Talk to users before building',
        point3: 'Speed matters more than perfection',
        conclusion: 'Failure taught me more than success ever could',
        cta: 'What did failure teach you?'
      }
    },
    {
      id: 'tiktok-1',
      platform: 'TikTok',
      name: 'Viral Script',
      icon: '🎵',
      structure: `{{hook}} (0-3 sec)

{{setup}} (3-10 sec)

{{climax}} (10-25 sec)

{{cta}} (end)

——
Text overlay: {{textOverlay}}
Sound: {{sound}}`,
      fields: ['hook', 'setup', 'climax', 'cta', 'textOverlay', 'sound'],
      example: {
        hook: 'POV: You found the life hack',
        setup: 'So I was scrolling and saw this trick',
        climax: 'Tried it and it actually worked!',
        cta: 'Follow for more life hacks',
        textOverlay: 'Wait for it...',
        sound: ' trending sound'
      }
    }
  ]
};

export const getTemplatesByLang = (lang: 'zh' | 'en') => {
  return socialTemplates[lang] || socialTemplates.zh;
};

export const getTemplateById = (id: string) => {
  const allTemplates = [...socialTemplates.zh, ...socialTemplates.en];
  return allTemplates.find(t => t.id === id);
};

// 渲染模板（将占位符替换为实际内容）
export const renderTemplate = (template: string, data: Record<string, string>) => {
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
  });
  // 清理未替换的占位符
  result = result.replace(/\{\{[^}]+\}\}/g, '');
  return result;
};