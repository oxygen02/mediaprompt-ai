'use client';

import React, { useState } from 'react';

type Language = 'zh' | 'en';

interface EditLayoutProps {
  children: React.ReactNode;
  title: string;
  currentPath: 'image-text' | 'video' | 'web-preview';
}

export default function EditLayout({ children, title, currentPath }: EditLayoutProps) {
  const [lang, setLang] = useState<Language>('zh');

  const t = {
    zh: {
      tools: '分析工具',
      document: '文档分析',
      image: '图片分析',
      video: '视频分析',
      website: '网页分析',
      editBox: '编辑盒子',
      imageText: '图文编辑',
      videoEdit: '视频剪辑',
      webPreview: '网页预览',
      promptLibrary: '提示词库',
      personal: '个人中心',
      history: '历史记录',
      settings: '设置',
      username: '用户',
      userType: '免费版'
    },
    en: {
      tools: 'Analysis Tools',
      document: 'Document',
      image: 'Image',
      video: 'Video',
      website: 'Website',
      editBox: 'Edit Box',
      imageText: 'Image & Text',
      videoEdit: 'Video Editor',
      webPreview: 'Web Preview',
      promptLibrary: 'Prompts',
      personal: 'Personal',
      history: 'History',
      settings: 'Settings',
      username: 'User',
      userType: 'Free'
    }
  }[lang];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-44 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-30">
        <div className="flex items-center gap-8">
          {/* 页面标题 */}
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-800">{title}</span>
          </div>
          
          {/* 导航链接 */}
          <div className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-800">首页</a>
            <a href="/pricing" className="text-sm text-gray-500 hover:text-gray-800">定价</a>
            <a href="/about" className="text-sm text-gray-500 hover:text-gray-800">关于</a>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* 中英文切换 */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLang('zh')}
              className={`px-3 py-1 rounded text-sm ${lang === 'zh' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >中文</button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded text-sm ${lang === 'en' ? 'bg-white shadow-sm' : 'text-gray-500'}`}
            >EN</button>
          </div>
          
          {/* 登录/注册 */}
          <div className="flex items-center gap-2">
            <button className="text-sm text-gray-500 hover:text-gray-800">{lang === 'zh' ? '登录' : 'Login'}</button>
            <button className="text-sm bg-indigo-500 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-600">{lang === 'zh' ? '注册' : 'Sign Up'}</button>
          </div>
        </div>
      </nav>

      {/* 左侧固定导航栏 */}
      <aside className="sidebar w-44 flex-shrink-0 flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 z-20">
        <div className="h-14 px-4 border-b border-gray-200 flex items-center">
          <div className="w-8 h-8 rounded-lg logo-bg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-gray-800 ml-2">PromptBox</span>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-xs text-gray-400 px-3 py-2">{t.tools}</div>
          <a href="/" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>{t.document}</span>
          </a>
          <a href="/" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>{t.image}</span>
          </a>
          <a href="/" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>{t.video}</span>
          </a>
          <a href="/" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
            <span>{t.website}</span>
          </a>
          
          <div className="text-xs text-gray-400 px-3 py-2 mt-4">{t.editBox}</div>
          <a href="/edit/image-text" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${currentPath === 'image-text' ? 'active text-gray-700 bg-gray-100' : 'text-gray-500 hover:bg-gray-50'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>{t.imageText}</span>
          </a>
          <a href="/edit/video" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${currentPath === 'video' ? 'active text-gray-700 bg-gray-100' : 'text-gray-500 hover:bg-gray-50'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>{t.videoEdit}</span>
          </a>
          <a href="/edit/web-preview" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${currentPath === 'web-preview' ? 'active text-gray-700 bg-gray-100' : 'text-gray-500 hover:bg-gray-50'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            <span>{t.webPreview}</span>
          </a>
          
          <div className="text-xs text-gray-400 px-3 py-2 mt-4">{t.promptLibrary}</div>
          <a href="/prompts" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <span>{lang === 'zh' ? '提示词库' : 'Prompts'}</span>
          </a>
          
          <div className="text-xs text-gray-400 px-3 py-2 mt-4">{t.personal}</div>
          <a href="#" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>{t.history}</span>
          </a>
          <a href="#" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>{t.settings}</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">{t.username}</p>
              <p className="text-xs text-gray-400">{t.userType}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <div className="flex-1 ml-44">
        {/* 主内容 */}
        <main className="pt-14 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}
