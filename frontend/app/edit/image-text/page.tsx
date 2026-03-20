'use client';

import React, { useState, useCallback } from 'react';
import EditLayout from '../layout';
import { socialTemplates, getTemplatesByLang, getTemplateById, renderTemplate } from '@/lib/templates';

type Language = 'zh' | 'en';

export default function ImageTextEditPage() {
  const [lang, setLang] = useState<Language>('zh');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [editedText, setEditedText] = useState('');
  const [templateData, setTemplateData] = useState<Record<string, string>>({});
  const [showCopied, setShowCopied] = useState(false);
  
  // 当前语言下的模板
  const templates = getTemplatesByLang(lang);
  
  // 平台分组
  const platformGroups = lang === 'zh' 
    ? [
        { name: '小红书', icon: '📕', ids: templates.filter(t => t.platform === '小红书').map(t => t.id) },
        { name: '抖音', icon: '🎵', ids: templates.filter(t => t.platform === '抖音').map(t => t.id) },
        { name: '微博', icon: '📱', ids: templates.filter(t => t.platform === '微博').map(t => t.id) },
        { name: '朋友圈', icon: '💬', ids: templates.filter(t => t.platform === '朋友圈').map(t => t.id) },
      ]
    : [
        { name: 'Instagram', icon: '📸', ids: templates.filter(t => t.platform === 'Instagram').map(t => t.id) },
        { name: 'Twitter/X', icon: '🐦', ids: templates.filter(t => t.platform === 'Twitter/X').map(t => t.id) },
        { name: 'TikTok', icon: '🎵', ids: templates.filter(t => t.platform === 'TikTok').map(t => t.id) },
      ];

  // 选择模板
  const handleSelectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setSelectedTemplate(templateId);
      if (template.example) {
        setEditedText(renderTemplate(template.structure, template.example));
        setTemplateData(template.example);
      } else {
        setEditedText('');
        setTemplateData({});
      }
    }
  };

  // 处理模板字段变化
  const handleFieldChange = (key: string, value: string) => {
    const newData = { ...templateData, [key]: value };
    setTemplateData(newData);
    
    const template = getTemplateById(selectedTemplate!);
    if (template) {
      setEditedText(renderTemplate(template.structure, newData));
    }
  };

  // 图片拖拽上传
  const handleImageDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImages(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // 删除图片
  const handleDeleteImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // 复制文案
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 分享到平台（模拟）
  const handleShare = (platform: string) => {
    const platformUrls: Record<string, string> = {
      'wechat': 'weixin://',
      'xiaohongshu': 'https://creator.xiaohongshu.com/creator/post',
      'douyin': 'https://creator.douyin.com/',
      'weibo': 'https://weibo.com/compose',
      'twitter': 'https://twitter.com/compose',
      'instagram': 'https://instagram.com/',
    };
    
    if (platformUrls[platform]) {
      window.open(platformUrls[platform], '_blank');
    }
  };

  return (
    <EditLayout title={lang === 'zh' ? '图文编辑' : 'Image & Text Editor'} currentPath="image-text">
      <div className="p-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {/* 左侧：模板选择 */}
          <div className="col-span-1 bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              {lang === 'zh' ? '选择模板' : 'Select Template'}
            </h2>
            
            {/* 平台分类 */}
            {platformGroups.map((group) => (
              <div key={group.name} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span>{group.icon}</span>
                  <span className="text-xs font-medium text-gray-600">{group.name}</span>
                </div>
                <div className="space-y-1">
                  {templates.filter(t => group.ids.includes(t.id)).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => handleSelectTemplate(template.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedTemplate === template.id
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* 中间：编辑区域 */}
          <div className="col-span-2 space-y-4">
            {/* 模板字段编辑 */}
            {selectedTemplate && (
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700 mb-4">
                  {lang === 'zh' ? '编辑内容' : 'Edit Content'}
                </h2>
                <div className="space-y-3">
                  {getTemplateById(selectedTemplate)?.fields.map((field) => (
                    <div key={field}>
                      <label className="text-xs text-gray-500 mb-1 block">{field}</label>
                      <textarea
                        value={templateData[field] || ''}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        placeholder={`${field}...`}
                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* 文字编辑区 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700">
                  {lang === 'zh' ? '文案编辑' : 'Text Editor'}
                </h2>
                <button
                  onClick={handleCopy}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  {showCopied ? '✓ 已复制' : (lang === 'zh' ? '一键复制' : 'Copy')}
                </button>
              </div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                placeholder={lang === 'zh' ? '选择模板后开始编辑...' : 'Select a template to start editing...'}
                className="w-full h-48 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>
            
            {/* 图片上传区 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                {lang === 'zh' ? '上传图片' : 'Upload Images'}
              </h2>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleImageDrop}
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-indigo-300 transition-colors"
              >
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img src={img} alt="" className="w-full h-24 object-cover rounded-lg" />
                        <button
                          onClick={() => handleDeleteImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        </button>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center h-24 cursor-pointer hover:bg-gray-50">
                      <span className="text-2xl text-gray-300">+</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-400 text-sm">
                      {lang === 'zh' ? '拖拽图片到这里，或点击上传' : 'Drag images here, or click to upload'}
                    </p>
                    <p className="text-gray-300 text-xs mt-1">PNG, JPG, GIF</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setUploadedImages(prev => [...prev, event.target?.result as string]);
                    };
                    reader.readAsDataURL(file);
                  });
                }}
              />
            </div>
          </div>
          
          {/* 右侧：预览和分享 */}
          <div className="col-span-1 space-y-4">
            {/* 预览 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                {lang === 'zh' ? '预览效果' : 'Preview'}
              </h2>
              <div className="bg-gray-100 rounded-lg p-4 min-h-[300px]">
                {editedText || uploadedImages.length > 0 ? (
                  <div className="space-y-3">
                    {uploadedImages.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full rounded-lg" />
                    ))}
                    {editedText.split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-gray-700 whitespace-pre-wrap">{line}</p>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center">预览区域</p>
                )}
              </div>
            </div>
            
            {/* 分享按钮 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">
                {lang === 'zh' ? '一键分享' : 'Share'}
              </h2>
              <div className="grid grid-cols-3 gap-2">
                {lang === 'zh' ? (
                  <>
                    <button
                      onClick={() => handleShare('wechat')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">💬</span>
                      <span className="text-xs text-gray-600">微信</span>
                    </button>
                    <button
                      onClick={() => handleShare('xiaohongshu')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">📕</span>
                      <span className="text-xs text-gray-600">小红书</span>
                    </button>
                    <button
                      onClick={() => handleShare('douyin')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">🎵</span>
                      <span className="text-xs text-gray-600">抖音</span>
                    </button>
                    <button
                      onClick={() => handleShare('weibo')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">📱</span>
                      <span className="text-xs text-gray-600">微博</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">📸</span>
                      <span className="text-xs text-gray-600">Instagram</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">🐦</span>
                      <span className="text-xs text-gray-600">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('tiktok')}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span className="text-xl">🎵</span>
                      <span className="text-xs text-gray-600">TikTok</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </EditLayout>
  );
}
