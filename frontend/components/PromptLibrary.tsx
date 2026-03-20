'use client';

import { useState, useMemo } from 'react';
import {
  PromptTemplate,
  PromptCategory,
  PromptVariable,
  allPrompts,
  categoryLabels,
  getPromptsByCategory,
  searchPrompts,
  getHotPrompts,
  fillTemplate
} from '@/lib/prompt-library';

interface PromptLibraryProps {
  onSelectPrompt?: (prompt: string) => void;
  lang?: 'zh' | 'en';
}

export default function PromptLibrary({ onSelectPrompt, lang = 'zh' }: PromptLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState<PromptCategory | 'all' | 'hot'>('hot');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptTemplate | null>(null);
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // 过滤提示词
  const filteredPrompts = useMemo(() => {
    if (searchQuery) {
      return searchPrompts(searchQuery);
    }
    if (selectedCategory === 'all') {
      return allPrompts;
    }
    if (selectedCategory === 'hot') {
      return getHotPrompts(20);
    }
    return getPromptsByCategory(selectedCategory);
  }, [selectedCategory, searchQuery]);

  // 选择提示词时初始化变量值
  const handleSelectPrompt = (prompt: PromptTemplate) => {
    setSelectedPrompt(prompt);
    const defaults: Record<string, string> = {};
    prompt.variables?.forEach(v => {
      if (v.default) defaults[v.name] = v.default;
    });
    setVariableValues(defaults);
    setGeneratedPrompt('');
    setShowPreview(true);
  };

  // 生成最终提示词
  const handleGenerate = () => {
    if (!selectedPrompt) return;
    const result = fillTemplate(selectedPrompt.template, variableValues);
    setGeneratedPrompt(result);
  };

  // 使用生成的提示词
  const handleUsePrompt = () => {
    if (onSelectPrompt && generatedPrompt) {
      onSelectPrompt(generatedPrompt);
    }
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    if (generatedPrompt) {
      await navigator.clipboard.writeText(generatedPrompt);
      alert(lang === 'zh' ? '已复制到剪贴板' : 'Copied to clipboard');
    }
  };

  const t = {
    search: lang === 'zh' ? '搜索提示词...' : 'Search prompts...',
    all: lang === 'zh' ? '全部' : 'All',
    hot: lang === 'zh' ? '热门' : 'Hot',
    usage: lang === 'zh' ? '使用次数' : 'Usage',
    rating: lang === 'zh' ? '评分' : 'Rating',
    variables: lang === 'zh' ? '参数设置' : 'Variables',
    generate: lang === 'zh' ? '生成提示词' : 'Generate',
    copy: lang === 'zh' ? '复制' : 'Copy',
    use: lang === 'zh' ? '使用' : 'Use',
    preview: lang === 'zh' ? '预览结果' : 'Preview',
    back: lang === 'zh' ? '返回' : 'Back',
    noPrompts: lang === 'zh' ? '暂无匹配的提示词' : 'No prompts found',
    required: lang === 'zh' ? '必填' : 'Required',
  };

  const categories: (PromptCategory | 'all' | 'hot')[] = ['hot', 'all', 'writing', 'image', 'video', 'code', 'marketing', 'business', 'education', 'creative', 'analysis', 'translation', 'social', 'document'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 搜索栏 */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-4 py-2 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? t.all : cat === 'hot' ? t.hot : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-[500px]">
        {/* 提示词列表 */}
        <div className={`w-80 border-r border-gray-100 overflow-y-auto ${showPreview ? 'hidden md:block' : 'w-full'}`}>
          {filteredPrompts.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              {t.noPrompts}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filteredPrompts.map(prompt => (
                <button
                  key={prompt.id}
                  onClick={() => handleSelectPrompt(prompt)}
                  className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                    selectedPrompt?.id === prompt.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-sm">{prompt.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prompt.description}</p>
                      <div className="flex gap-2 mt-2">
                        {prompt.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>🔥 {(prompt.usage / 1000).toFixed(1)}k</span>
                    <span>⭐ {prompt.rating}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 提示词详情 */}
        {showPreview && selectedPrompt && (
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* 返回按钮（移动端） */}
              <button
                onClick={() => setShowPreview(false)}
                className="md:hidden mb-4 text-sm text-gray-500 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                {t.back}
              </button>

              {/* 标题 */}
              <h2 className="text-lg font-semibold text-gray-900">{selectedPrompt.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedPrompt.description}</p>

              {/* 变量输入 */}
              {selectedPrompt.variables && selectedPrompt.variables.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">{t.variables}</h3>
                  <div className="space-y-3">
                    {selectedPrompt.variables.map(variable => (
                      <VariableInput
                        key={variable.name}
                        variable={variable}
                        value={variableValues[variable.name] || ''}
                        onChange={(value) => setVariableValues(prev => ({ ...prev, [variable.name]: value }))}
                        lang={lang}
                        requiredLabel={t.required}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                className="mt-6 w-full py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                {t.generate}
              </button>

              {/* 生成结果 */}
              {generatedPrompt && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">{t.preview}</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {generatedPrompt}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleCopy}
                      className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      {t.copy}
                    </button>
                    {onSelectPrompt && (
                      <button
                        onClick={handleUsePrompt}
                        className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                      >
                        {t.use}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 变量输入组件
function VariableInput({
  variable,
  value,
  onChange,
  lang,
  requiredLabel
}: {
  variable: PromptVariable;
  value: string;
  onChange: (value: string) => void;
  lang: 'zh' | 'en';
  requiredLabel: string;
}) {
  const baseClass = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (variable.type === 'select' && variable.options) {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          {variable.label}
          {variable.required && <span className="text-red-500 ml-1">*{requiredLabel}</span>}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        >
          {variable.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (variable.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          {variable.label}
          {variable.required && <span className="text-red-500 ml-1">*{requiredLabel}</span>}
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={variable.placeholder}
          rows={3}
          className={`${baseClass} resize-none`}
        />
      </div>
    );
  }

  if (variable.type === 'number') {
    return (
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          {variable.label}
          {variable.required && <span className="text-red-500 ml-1">*{requiredLabel}</span>}
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={baseClass}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">
        {variable.label}
        {variable.required && <span className="text-red-500 ml-1">*{requiredLabel}</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={variable.placeholder}
        className={baseClass}
      />
    </div>
  );
}
