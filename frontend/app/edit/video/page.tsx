'use client';

import React, { useState, useCallback, useRef } from 'react';
import EditLayout from '../layout';
import { videoEditPresets, editingTools, getEditingTools, type VideoEditPreset, type EditingTool } from '@/lib/video-presets';

type Language = 'zh' | 'en';
type ProcessingStep = 'upload' | 'select' | 'processing' | 'done';

export default function VideoEditPage() {
  const [lang, setLang] = useState<Language>('zh');
  const [step, setStep] = useState<ProcessingStep>('upload');
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string>('jianying');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = {
    zh: {
      title: '视频剪辑',
      upload: '上传素材',
      uploadDesc: '拖拽或点击上传视频',
      selectPreset: '选择剪辑方式',
      selectTool: '选择工具',
      oneClick: '一键生成',
      processing: '处理中...',
      done: '完成！',
      tools: '剪辑工具',
      presets: '预设方式',
      custom: '自定义',
      duration: '时长',
      features: '特点',
      suitableFor: '适合',
      beginner: '入门',
      intermediate: '进阶',
      professional: '专业',
      openTool: '打开工具',
      download: '下载结果',
      createNew: '新建项目'
    },
    en: {
      title: 'Video Editor',
      upload: 'Upload',
      uploadDesc: 'Drag or click to upload video',
      selectPreset: 'Select Style',
      selectTool: 'Select Tool',
      oneClick: 'Generate',
      processing: 'Processing...',
      done: 'Done!',
      tools: 'Editing Tools',
      presets: 'Presets',
      custom: 'Custom',
      duration: 'Duration',
      features: 'Features',
      suitableFor: 'Good for',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      professional: 'Professional',
      openTool: 'Open Tool',
      download: 'Download',
      createNew: 'New Project'
    }
  }[lang];

  // 处理视频上传
  const handleVideoUpload = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedVideo(e.target?.result as string);
      setStep('select');
    };
    reader.readAsDataURL(file);
  }, []);

  // 处理拖拽
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoUpload(file);
    }
  }, [handleVideoUpload]);

  // 开始处理
  const handleGenerate = () => {
    if (!selectedPreset) return;
    
    setProcessing(true);
    setStep('processing');
    setProgress(0);
    
    // 模拟处理进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setProcessing(false);
          setStep('done');
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  // 重置项目
  const handleReset = () => {
    setStep('upload');
    setUploadedVideo(null);
    setSelectedPreset(null);
    setProgress(0);
  };

  // 打开剪辑工具
  const openTool = (tool: EditingTool) => {
    window.open(tool.url, '_blank');
  };

  const currentTools = getEditingTools(lang);
  const selectedPresetData = videoEditPresets.find(p => p.id === selectedPreset);
  const selectedToolData = editingTools.find(t => t.id === selectedTool);

  return (
    <EditLayout title={t.title} currentPath="video">
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* 步骤1: 上传素材 */}
        {step === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-2xl p-16 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all"
            >
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{t.upload}</h2>
              <p className="text-gray-500">{t.uploadDesc}</p>
              <p className="text-gray-400 text-sm mt-2">MP4, MOV, AVI (最大500MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {/* 步骤2: 选择预设和工具 */}
        {(step === 'select' || step === 'processing') && uploadedVideo && (
          <div className="grid grid-cols-12 gap-6">
            {/* 左侧：视频预览 */}
            <div className="col-span-4 space-y-4">
              <div className="bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  src={uploadedVideo}
                  controls
                  className="w-full"
                  style={{ maxHeight: '300px' }}
                />
              </div>
              
              {/* 已选预设信息 */}
              {selectedPresetData && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{selectedPresetData.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{lang === 'zh' ? selectedPresetData.name : selectedPresetData.nameEn}</h3>
                      <p className="text-xs text-gray-500">{t.duration}: {selectedPresetData.duration}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">{lang === 'zh' ? selectedPresetData.description : selectedPresetData.descriptionEn}</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPresetData.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 已选工具 */}
              {selectedToolData && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{selectedToolData.icon}</span>
                      <span className="font-medium text-gray-800">{selectedToolData.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      selectedToolData.level === 'beginner' ? 'bg-green-100 text-green-600' :
                      selectedToolData.level === 'intermediate' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {t[selectedToolData.level]}
                    </span>
                  </div>
                </div>
              )}
              
              {/* 一键生成按钮 */}
              {selectedPreset && (
                <button
                  onClick={handleGenerate}
                  disabled={processing}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors"
                >
                  {processing ? t.processing : t.oneClick}
                </button>
              )}
            </div>

            {/* 中间：预设选择 */}
            <div className="col-span-5 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">{t.presets} ({videoEditPresets.length} {lang === 'zh' ? '种' : 'styles'})</h2>
              <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                {videoEditPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPreset(preset.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selectedPreset === preset.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-100 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{preset.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm">{lang === 'zh' ? preset.name : preset.nameEn}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{lang === 'zh' ? preset.description : preset.descriptionEn}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-400">{preset.duration}</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{preset.features[0]}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧：工具选择 */}
            <div className="col-span-3 space-y-4">
              <h2 className="text-sm font-semibold text-gray-700">{t.tools}</h2>
              <div className="space-y-2">
                {currentTools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedTool === tool.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-100 bg-white hover:border-indigo-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{tool.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate">{tool.name}</h3>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            tool.level === 'beginner' ? 'bg-green-100 text-green-600' :
                            tool.level === 'intermediate' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {t[tool.level]}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {tool.features.slice(0, 2).map((f, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{f}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* 打开工具按钮 */}
              <button
                onClick={() => selectedToolData && openTool(selectedToolData)}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded-lg text-sm transition-colors"
              >
                {t.openTool}
              </button>
            </div>
          </div>
        )}

        {/* 处理中 */}
        {step === 'processing' && processing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t.processing}</h3>
                <p className="text-gray-500 text-sm mb-4">
                  {lang === 'zh' ? `正在应用 ${selectedPresetData?.name} 风格...` : `Applying ${selectedPresetData?.nameEn} style...`}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">{Math.round(Math.min(progress, 100))}%</p>
              </div>
            </div>
          </div>
        )}

        {/* 步骤4: 完成 */}
        {step === 'done' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{t.done}</h2>
            <p className="text-gray-500 mb-6">
              {lang === 'zh' ? '视频已生成，可直接下载或打开剪辑工具继续编辑' : 'Video generated! Download or open editing tool'}
            </p>
            
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-4xl">🎬</span>
              </div>
              <div className="flex items-center justify-center gap-4 mt-4">
                <span className="text-sm text-gray-600">{lang === 'zh' ? selectedPresetData?.name : selectedPresetData?.nameEn}</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600">{selectedToolData?.name}</span>
              </div>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => selectedToolData && openTool(selectedToolData)}
                className="px-6 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-900"
              >
                {t.openTool}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600"
              >
                {t.createNew}
              </button>
            </div>
          </div>
        )}
      </div>
    </EditLayout>
  );
}
