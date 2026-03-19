'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { i18n, Language, TranslationKey } from '@/lib/i18n';
import { analyzeFile, analyzeText, previewOutput } from '@/lib/api';

// 类型定义
type ContentType = 'document' | 'image' | 'video' | 'website';
type Status = 'waiting' | 'processing' | 'success' | 'error';

// 社交媒体SVG图标
const WechatIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.006-.27-.018-.407-.032zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/></svg>
);

const DouyinIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
);

const XiaohongshuIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4" fill="#FF2442"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">小</text></svg>
);

const WeiboIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.194.573zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.57-.18-.405-.649.356-.998.39-1.858.002-2.47-.727-1.148-2.708-1.085-4.9-.03 0 0-.702.306-.522-.25.346-1.1.294-2.02-.246-2.55-1.226-1.2-4.49.043-7.29 2.774C2.842 11.478 1 14.4 1 16.929c0 4.842 6.207 7.785 12.277 7.785 7.96 0 13.263-4.625 13.263-8.292 0-2.213-1.866-3.469-3.461-3.973z"/></svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
);

export default function Home() {
  // 状态管理
  const [lang, setLang] = useState<Language>('zh');
  const [contentType, setContentType] = useState<ContentType>('document');
  const [status, setStatus] = useState<Status>('waiting');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [result, setResult] = useState('');
  const [creativeResult, setCreativeResult] = useState('');
  const [creativeImages, setCreativeImages] = useState<string[]>([]); // 生成的图片URLs
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['theme', 'genre', 'langStyle', 'tone', 'structure', 'wordCount', 'audience', 'scenario', 'keywords']);
  const [selectedVideoSize, setSelectedVideoSize] = useState('16:9');
  const [voiceover, setVoiceover] = useState('');
  const [processText, setProcessText] = useState<TranslationKey>('process.ready');
  const [editorContent, setEditorContent] = useState('');
  const [stepResults, setStepResults] = useState<{[key: number]: string}>({});
  const [selectedAnalysisModel, setSelectedAnalysisModel] = useState('auto');
  const [selectedGenerateModel, setSelectedGenerateModel] = useState('auto');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // 切换分析模型时清空结果
  const handleAnalysisModelChange = useCallback((newModel: string) => {
    setSelectedAnalysisModel(newModel);
    setResult('');
    setEditorContent('');
    setCreativeResult('');
    setStatus('waiting');
  }, []);
  
  // 切换生成模型时清空生成结果
  const handleGenerateModelChange = useCallback((newModel: string) => {
    setSelectedGenerateModel(newModel);
    setCreativeResult('');
    setCreativeImages([]);
  }, []);
  
  // 历史记录 - 保存每个类别的内容
  const [history, setHistory] = useState<{
    [key in ContentType]?: {
      uploadedFile: File | null;
      result: string;
      editorContent: string;
      creativeResult: string;
      creativeImages: string[];
      previewUrl: string | null;
    }
  }>({});
  
  // 输出详细程度
  const [detailLevel, setDetailLevel] = useState<'concise' | 'detailed'>('detailed');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);

  // 翻译函数
  const t = useCallback((key: TranslationKey): string => {
    return i18n[lang][key] || key;
  }, [lang]);

  // 获取当前类型的文件提示
  const getFileHint = useCallback(() => {
    const hints: Record<ContentType, TranslationKey> = {
      document: 'hint.document',
      image: 'hint.image',
      video: 'hint.video',
      website: 'hint.website',
    };
    return t(hints[contentType]);
  }, [contentType, t]);

  // 获取当前类型的输出选项
  const getOutputOptions = useCallback(() => {
    const options: Record<ContentType, { value: string; label: TranslationKey }[]> = {
      document: [
        { value: 'theme', label: 'opt.theme' },
        { value: 'genre', label: 'opt.genre' },
        { value: 'langStyle', label: 'opt.langStyle' },
        { value: 'tone', label: 'opt.tone' },
        { value: 'structure', label: 'opt.structure' },
        { value: 'wordCount', label: 'opt.wordCount' },
        { value: 'audience', label: 'opt.audience' },
        { value: 'scenario', label: 'opt.scenario' },
        { value: 'keywords', label: 'opt.keywords' },
      ],
      image: [
        { value: 'subject', label: 'opt.subject' },
        { value: 'style', label: 'opt.style' },
        { value: 'composition', label: 'opt.composition' },
        { value: 'lighting', label: 'opt.lighting' },
        { value: 'colors', label: 'opt.colors' },
        { value: 'quality', label: 'opt.quality' },
        { value: 'background', label: 'opt.background' },
        { value: 'atmosphere', label: 'opt.atmosphere' },
      ],
      video: [
        { value: 'subject', label: 'opt.subject' },
        { value: 'camera', label: 'opt.camera' },
        { value: 'style', label: 'opt.style' },
        { value: 'lighting', label: 'opt.lighting' },
        { value: 'quality', label: 'opt.quality' },
        { value: 'rhythm', label: 'opt.rhythm' },
        { value: 'logic', label: 'opt.logic' },
        { value: 'mood', label: 'opt.mood' },
      ],
      website: [
        { value: 'webType', label: 'opt.webType' },
        { value: 'style', label: 'opt.style' },
        { value: 'colors', label: 'opt.colors' },
        { value: 'layout', label: 'opt.layout' },
        { value: 'modules', label: 'opt.modules' },
        { value: 'device', label: 'opt.device' },
        { value: 'atmosphere', label: 'opt.atmosphere' },
        { value: 'texture', label: 'opt.texture' },
      ],
    };
    return options[contentType];
  }, [contentType]);

  // 输出详细程度选项
  const detailLevels = [
    { value: 'concise', label: '简洁' },
    { value: 'detailed', label: '详细' },
  ];

  // 处理文件选择
  // 切换类别的处理函数
  const handleContentTypeChange = useCallback((newType: ContentType) => {
    // 先获取新类别的历史数据（同步获取）
    let historyData;
    setHistory(prev => {
      // 保存当前类别的内容
      const newHistory = { ...prev };
      if (uploadedFile || result || editorContent || creativeResult || creativeImages.length > 0) {
        newHistory[contentType] = {
          uploadedFile,
          result,
          editorContent,
          creativeResult,
          creativeImages,
          previewUrl
        };
      }
      // 获取新类别的历史数据
      historyData = newHistory[newType];
      return newHistory;
    });
    
    // 切换到新类别
    setContentType(newType);
    
    // 根据类别设置默认选项
    const defaultOptions: Record<ContentType, string[]> = {
      document: ['theme', 'genre', 'langStyle', 'tone', 'structure', 'wordCount', 'audience', 'scenario', 'keywords'],
      image: ['subject', 'style', 'composition', 'lighting', 'colors', 'quality', 'background', 'atmosphere'],
      video: ['subject', 'camera', 'style', 'lighting', 'quality', 'rhythm', 'logic', 'mood'],
      website: ['webType', 'style', 'colors', 'layout', 'modules', 'device', 'atmosphere', 'texture'],
    };
    setSelectedOptions(defaultOptions[newType]);
    
    // 根据是否有历史数据来设置状态
    if (historyData) {
      setUploadedFile(historyData.uploadedFile || null);
      setResult(historyData.result || '');
      setEditorContent(historyData.editorContent || '');
      setCreativeResult(historyData.creativeResult || '');
      setCreativeImages(historyData.creativeImages || []);
      setPreviewUrl(historyData.previewUrl || null);
      setStatus(historyData.result ? 'success' : 'waiting');
    } else {
      setUploadedFile(null);
      setResult('');
      setEditorContent('');
      setCreativeResult('');
      setCreativeImages([]);
      setPreviewUrl(null);
      setStatus('waiting');
    }
    setMessage(null);
  }, [contentType, uploadedFile, result, editorContent, creativeResult, creativeImages]);

  const handleFileSelect = useCallback((file: File) => {
    setUploadedFile(file);
    setMessage({ text: `${t('btn.selectFile')}: ${file.name}`, type: 'success' });
    // 清空之前的结果
    setResult('');
    setEditorContent('');
    setStatus('idle');
    
    // 生成预览缩略图
    if (contentType === 'image' && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (contentType === 'video' && file.type.startsWith('video/')) {
      // 视频缩略图：生成第一帧
      const video = document.createElement('video');
      video.src = URL.createObjectURL(file);
      video.currentTime = 1; // 取第1秒
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 180;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          setPreviewUrl(canvas.toDataURL('image/jpeg', 0.7));
        }
        URL.revokeObjectURL(video.src);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [t, contentType]);

  // 处理拖拽上传
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    uploadZoneRef.current?.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback(() => {
    uploadZoneRef.current?.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    uploadZoneRef.current?.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, [handleFileSelect]);

  // 分析内容
  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) {
      setMessage({ text: lang === 'zh' ? '请先上传文件' : 'Please upload a file first', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatus('processing');
    setThinkingExpanded(true);

    // 模拟思考过程动画
    let step = 0;
    const thinkingInterval = setInterval(() => {
      if (step < 10) {
        setThinkingStep(step);
        setProcessText(`thinking.step${step + 1}` as TranslationKey);
        step++;
      }
    }, 300);

    try {
      const response = await analyzeFile(
        uploadedFile,
        contentType,
        selectedOptions,
        detailLevel,
        contentType === 'video' ? selectedVideoSize : undefined,
        contentType === 'video' ? voiceover : undefined,
        lang
      );

      clearInterval(thinkingInterval);
      setThinkingStep(9);

      if (response.success && response.result) {
        setResult(response.result);
        setEditorContent(response.result); // 将分析结果填充到"提示词再创作"输入框
        setStatus('success');
        setMessage({ text: lang === 'zh' ? '分析完成！可在下方编辑后生成创意内容' : 'Analysis complete! Edit below to generate creative content', type: 'success' });
      } else {
        setStatus('error');
        setMessage({ text: response.error || (lang === 'zh' ? '分析失败' : 'Analysis failed'), type: 'error' });
      }
    } catch (error) {
      clearInterval(thinkingInterval);
      setStatus('error');
      setMessage({ text: lang === 'zh' ? '网络错误' : 'Network error', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, contentType, selectedOptions, selectedVideoSize, voiceover, lang]);

  // 复制结果
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(creativeResult);
    setMessage({ text: lang === 'zh' ? '已复制' : 'Copied!', type: 'success' });
  }, [creativeResult, lang]);

  // 下载结果
  const handleDownload = useCallback(() => {
    const blob = new Blob([creativeResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-content-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage({ text: lang === 'zh' ? '下载成功！' : 'Download complete!', type: 'success' });
  }, [creativeResult, lang]);

  // 创意类似+生成
  const handleCreativeGenerate = useCallback(async () => {
    if (!editorContent.trim() && !sourceFile) {
      setMessage({ text: lang === 'zh' ? '请输入提示词或上传源文件' : 'Please enter prompt or upload source file', type: 'error' });
      return;
    }
    
    setIsGenerating(true);
    setCreativeResult('');
    setCreativeImages([]);
    setMessage({ text: lang === 'zh' ? '正在生成创意内容...' : 'Generating creative content...', type: 'success' });
    
    try {
      // 调用后端生成API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://124.156.200.127:3001'}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: editorContent.trim(),
          model: selectedGenerateModel, // 使用生成模型选择
          contentType,
          lang,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (data.type === 'image' && data.images && data.images.length > 0) {
          // 图片结果
          setCreativeImages(data.images);
          setMessage({ text: lang === 'zh' ? '图片生成完成！' : 'Images generated!', type: 'success' });
        } else if (data.type === 'text' && data.result) {
          // 文本结果
          setCreativeResult(data.result);
          setMessage({ text: lang === 'zh' ? '生成完成！' : 'Generation complete!', type: 'success' });
        } else {
          setMessage({ text: lang === 'zh' ? '生成失败：返回数据格式错误' : 'Generation failed: Invalid response format', type: 'error' });
        }
      } else {
        setMessage({ text: data.error || (lang === 'zh' ? '生成失败' : 'Generation failed'), type: 'error' });
      }
    } catch (error) {
      console.error('生成错误:', error);
      setMessage({ text: lang === 'zh' ? '生成失败' : 'Generation failed', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  }, [editorContent, sourceFile, selectedGenerateModel, contentType, lang]);

  // 社交分享
  const shareToWechat = () => alert(lang === 'zh' ? '请截图后分享到微信' : 'Please screenshot and share to WeChat');
  const shareToDouyin = () => alert(lang === 'zh' ? '请截图后分享到抖音' : 'Please screenshot and share to Douyin');
  const shareToXiaohongshu = () => alert(lang === 'zh' ? '请截图后分享到小红书' : 'Please screenshot and share to Xiaohongshu');
  const shareToWeibo = () => window.open(`https://service.weibo.com/share/share.php?title=${encodeURIComponent(result.substring(0, 140))}`, '_blank');
  const shareToTwitter = () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(result.substring(0, 280))}`, '_blank');
  const shareToFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  const shareToLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
  const shareToInstagram = () => alert(lang === 'zh' ? '请截图后分享到Instagram' : 'Please screenshot and share to Instagram');

  // 清除消息
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // 内容类型变化时重置选项为全选
  useEffect(() => {
    const allOptions = getOutputOptions().map(opt => opt.value);
    setSelectedOptions(allOptions);
  }, [contentType, getOutputOptions]);

  return (
    <>
      {/* 左侧固定导航栏 */}
      <aside className="sidebar w-52 flex-shrink-0 flex flex-col">
        <div className="h-14 px-4 border-b border-gray-200 flex items-center">
          <div className="w-8 h-8 rounded-lg logo-bg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-gray-800 ml-2">MediaPrompt</span>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="text-xs text-gray-400 px-3 py-2">{t('nav.tools')}</div>
          <a href="#" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${contentType === 'document' ? 'active text-gray-700' : 'text-gray-500'}`} onClick={(e) => { e.preventDefault(); handleContentTypeChange('document'); }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>{t('nav.document')}</span>
          </a>
          <a href="#" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${contentType === 'image' ? 'active text-gray-700' : 'text-gray-500'}`} onClick={(e) => { e.preventDefault(); handleContentTypeChange('image'); }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>{t('nav.image')}</span>
          </a>
          <a href="#" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${contentType === 'video' ? 'active text-gray-700' : 'text-gray-500'}`} onClick={(e) => { e.preventDefault(); handleContentTypeChange('video'); }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
            <span>{t('nav.video')}</span>
          </a>
          <a href="#" className={`nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm ${contentType === 'website' ? 'active text-gray-700' : 'text-gray-500'}`} onClick={(e) => { e.preventDefault(); handleContentTypeChange('website'); }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
            <span>{t('nav.website')}</span>
          </a>
          
          <div className="text-xs text-gray-400 px-3 py-2 mt-4">{t('nav.cases')}</div>
          <a href="/cases" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
            <span>{t('nav.documentCase')}</span>
          </a>
          
          <div className="text-xs text-gray-400 px-3 py-2 mt-4">{t('nav.personal')}</div>
          <a href="#" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>{t('nav.history')}</span>
          </a>
          <a href="#" className="nav-item flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <span>{t('nav.settings')}</span>
          </a>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-500">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 truncate">{t('nav.username')}</p>
              <p className="text-xs text-gray-400">{t('nav.userType')}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="main-content">
        {/* 顶部导航栏 */}
        <nav className="h-14 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-800 font-medium">{t('top.home')}</a>
            <a href="#" className="text-sm text-gray-500">{t('top.pricing')}</a>
            <a href="#" className="text-sm text-gray-500">{t('top.about')}</a>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="moon-container">
              <div className="moon-base"></div>
              <div className="moon-shadow"></div>
            </div>
            <h1 className="text-base font-semibold text-gray-800">{t('subtitle')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button className={`lang-btn px-3 py-1 rounded text-xs font-medium ${lang === 'zh' ? 'active' : 'text-gray-500'}`} onClick={() => setLang('zh')}>中文</button>
              <button className={`lang-btn px-3 py-1 rounded text-xs font-medium ${lang === 'en' ? 'active' : 'text-gray-500'}`} onClick={() => setLang('en')}>EN</button>
            </div>
            <button className="text-sm text-gray-500 hover:text-gray-800">{t('top.login')}</button>
            <button className="btn-primary px-4 py-1.5 rounded text-sm text-white">{t('top.register')}</button>
          </div>
        </nav>

        {/* 固定副标题区域 */}
        <div className="fixed-header">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-3">
              <p className="text-gray-500 text-sm">{t('header.subtext')}</p>
            </div>
            <div className="flex gap-2 justify-center">
              {(['document', 'image', 'video', 'website'] as ContentType[]).map((type, index) => {
                const moonClasses = ['moon-95', 'moon-70', 'moon-40', 'moon-full'];
                return (
                  <button
                    key={type}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      contentType === type
                        ? 'bg-white text-gray-800 border border-gray-600 shadow-sm'
                        : 'text-gray-500 bg-white border border-gray-200'
                    }`}
                    onClick={() => handleContentTypeChange(type)}
                  >
                    <span className={`moon-icon ${moonClasses[index]}`}></span>
                    <span>{t(`category.${type}` as TranslationKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6 max-w-4xl mx-auto pt-28">
          {/* 消息区域 */}
          {message && (
            <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
              {message.text}
            </div>
          )}

          {/* AI输出面板 */}
          <div className="ai-output-panel mb-5">
            <div className="ai-output-header">
              <div className="ai-output-status">
                <span className={`status-dot ${status}`}></span>
                <span>{t(`status.${status}` as TranslationKey)}</span>
              </div>
            </div>
            <div className="ai-output-process">
              <div className={`process-step ${status === 'processing' ? 'active' : status === 'success' ? 'done' : status === 'error' ? 'error' : ''}`}>
                {status === 'processing' && <div className="spinner"></div>}
                <span>{t(processText)}</span>
              </div>
            </div>
            <div className="ai-output-result">
              {result ? (
                <div className="whitespace-pre-wrap">{result}</div>
              ) : (
                <p className="text-gray-400 text-sm text-center">{t('result.placeholder')}</p>
              )}
            </div>
          </div>

          {/* 上传模仿对象区域 */}
          <div className="mb-5">
            <div
              className={`upload-zone rounded-xl py-3 px-4 text-center cursor-pointer relative group min-h-[160px] ${previewUrl ? 'has-preview' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* 悬停标题 */}
              <span className="absolute top-2 left-3 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium z-10">{lang === 'zh' ? '上传模仿内容' : 'Upload Content to Imitate'}</span>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={contentType === 'image' ? 'image/*' : contentType === 'video' ? 'video/*' : contentType === 'website' ? '.html,.htm,.zip' : undefined}
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              />
              
              {/* 缩略图预览 */}
              {previewUrl && (contentType === 'image' || contentType === 'video') ? (
                <div className="preview-container relative">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-[120px] mx-auto rounded-lg shadow-sm object-contain"
                  />
                  <div className="mt-2 text-sm text-gray-600">{uploadedFile?.name}</div>
                  <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    {contentType === 'video' ? '🎬 视频' : '📷 图片'}
                  </div>
                </div>
              ) : uploadedFile && contentType === 'website' ? (
                <div className="preview-container">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm">{uploadedFile.name}</p>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-1.5">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm mb-0.5">{uploadedFile ? uploadedFile.name : t('upload.drag')}</p>
                  <p className="text-gray-400 text-xs">{getFileHint()}</p>
                </>
              )}
              
              {/* 提示词选项 - 框内底部 */}
              <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                {/* 详细程度选择 */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-xs text-gray-500">输出风格：</span>
                  {detailLevels.map((level) => (
                    <span
                      key={level.value}
                      className={`px-2 py-0.5 rounded text-xs cursor-pointer transition-colors ${
                        detailLevel === level.value 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setDetailLevel(level.value as 'concise' | 'detailed')}
                    >
                      {level.label}
                    </span>
                  ))}
                </div>
                {/* 维度选项 */}
                <div className="flex items-center justify-center gap-1 overflow-x-auto" style={{ flexWrap: 'nowrap' }}>
                  {getOutputOptions().map((option) => (
                    <span
                      key={option.value}
                      className={`option-tag text-xs flex-shrink-0 ${selectedOptions.includes(option.value) ? 'selected' : ''}`}
                      onClick={() => {
                        if (selectedOptions.includes(option.value)) {
                          setSelectedOptions(selectedOptions.filter(v => v !== option.value));
                        } else {
                          setSelectedOptions([...selectedOptions, option.value]);
                        }
                      }}
                    >
                      <span className="dot"></span>
                      <span>{t(option.label)}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 模型选择 + 开始分析 */}
          <div className="mb-5 flex items-center justify-end gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">{t('label.model')}</span>
              <select 
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 w-[140px]"
                value={selectedAnalysisModel}
                onChange={(e) => handleAnalysisModelChange(e.target.value)}
              >
                <option value="auto">{t('model.auto')}</option>
                {contentType === 'document' && (
                  <>
                    {lang === 'zh' ? (
                      <optgroup label="国内模型 (免费优先)">
                        <option value="hunyuan-lite">混元Lite (免费)</option>
                        <option value="qwen-turbo">通义千问 (免费)</option>
                        <option value="hunyuan-pro">混元Pro</option>
                      </optgroup>
                    ) : (
                      <optgroup label="International Models">
                        <option value="gpt4o">GPT-4o</option>
                        <option value="claude">Claude 3.5</option>
                        <option value="gemini">Gemini Pro</option>
                      </optgroup>
                    )}
                  </>
                )}
                {contentType === 'image' && (
                  <>
                    {lang === 'zh' ? (
                      <optgroup label="国内模型 (免费优先)">
                        <option value="qwen-vl">通义千问VL (免费)</option>
                        <option value="hunyuan-vision">混元视觉 (免费)</option>
                        <option value="doubao-vision">豆包视觉 (免费)</option>
                      </optgroup>
                    ) : (
                      <optgroup label="International Models">
                        <option value="gpt4o-vision">GPT-4o Vision</option>
                        <option value="claude-vision">Claude 3.5 Vision</option>
                        <option value="gemini">Gemini Pro</option>
                      </optgroup>
                    )}
                  </>
                )}
                {contentType === 'video' && (
                  <>
                    {lang === 'zh' ? (
                      <optgroup label="国内模型 (免费优先)">
                        <option value="qwen-vl">通义千问VL (免费)</option>
                        <option value="hunyuan-vision">混元视觉 (免费)</option>
                        <option value="doubao-vision">豆包视觉 (免费)</option>
                      </optgroup>
                    ) : (
                      <optgroup label="International Models">
                        <option value="gpt4o-vision">GPT-4o Vision</option>
                        <option value="gemini">Gemini Pro</option>
                      </optgroup>
                    )}
                  </>
                )}
                {contentType === 'website' && (
                  <>
                    {lang === 'zh' ? (
                      <optgroup label="国内模型 (免费优先)">
                        <option value="hunyuan-lite">混元Lite (免费)</option>
                        <option value="qwen-turbo">通义千问 (免费)</option>
                        <option value="hunyuan-pro">混元Pro</option>
                      </optgroup>
                    ) : (
                      <optgroup label="International Models">
                        <option value="gpt4o">GPT-4o</option>
                        <option value="claude">Claude 3.5</option>
                        <option value="gemini">Gemini Pro</option>
                      </optgroup>
                    )}
                  </>
                )}
              </select>
            </div>
            <button
              className={`px-8 py-2.5 rounded-xl text-white font-medium shadow-sm ${isLoading ? 'btn-loading' : 'btn-primary'}`}
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              🔍 {isLoading ? (lang === 'zh' ? '正在分析...' : 'Analyzing...') : t('btn.analyze')}
            </button>
          </div>

          {/* 视频专属选项 */}
          {contentType === 'video' && (
            <div className="mb-5 p-4 bg-white rounded-xl border border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t('video.title')}</h4>
              <div className="mb-4">
                <label className="text-xs text-gray-500 mb-2 block">{t('video.size')}</label>
                <div className="flex gap-2 flex-wrap">
                  {['16:9', '9:16', '4:3', '1:1', '21:9'].map((size) => (
                    <span
                      key={size}
                      className={`size-option ${selectedVideoSize === size ? 'selected' : ''}`}
                      onClick={() => setSelectedVideoSize(size)}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-2 block">{t('video.voiceover')}</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400"
                  placeholder={t('video.voiceoverPlaceholder')}
                  value={voiceover}
                  onChange={(e) => setVoiceover(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* 提示词再创作 */}
          <div className="mb-5 relative group">
            {!editorContent && <span className="absolute top-2 left-3 text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none font-medium">{lang === 'zh' ? '创作你自己的提示词' : 'Create Your Own Prompts'}</span>}
            <textarea
              className="w-full min-h-[150px] bg-white border-2 border-dashed border-gray-200 rounded-xl p-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400 group-hover:placeholder-transparent transition-all duration-300"
              placeholder={t('editor.placeholder')}
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
            />
          </div>

          {/* 创意类似+ 按钮 + 打开文件 + 模型选择 */}
          <div className="mb-5">
            <div className="flex items-center justify-end gap-4">
              <button
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 px-4 py-2.5 bg-gray-100 rounded-lg"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = contentType === 'image' ? 'image/*' : contentType === 'video' ? 'video/*' : '*/*';
                  input.onchange = (ev: any) => { 
                    const file = ev.target.files?.[0];
                    if (file) {
                      const maxSize = 50 * 1024 * 1024;
                      if (file.size > maxSize) {
                        setMessage({ text: lang === 'zh' ? '文件大小不能超过50MB' : 'File size cannot exceed 50MB', type: 'error' });
                        return;
                      }
                      setSourceFile(file);
                      setMessage({ text: `${lang === 'zh' ? '已选择' : 'Selected'}: ${file.name}`, type: 'success' });
                    }
                  };
                  input.click();
                }}
                title={lang === 'zh' ? '支持文档/图片/视频，最大50MB' : 'Support document/image/video, max 50MB'}
              >
                📁 {sourceFile ? (lang === 'zh' ? '已选择文件' : 'File Selected') : (lang === 'zh' ? '打开想要创作的内容（如需要）' : 'Open content (optional)')}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{t('label.model')}</span>
                <select 
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:outline-none focus:border-gray-400 w-[140px]"
                  value={selectedGenerateModel}
                  onChange={(e) => handleGenerateModelChange(e.target.value)}
                >
                  <option value="auto">{t('model.auto')}</option>
                  {contentType === 'document' && (
                    <>
                      {lang === 'zh' ? (
                        <optgroup label="国内模型 (免费优先)">
                          <option value="hunyuan-lite">混元Lite (免费)</option>
                          <option value="qwen-turbo">通义千问 (免费)</option>
                          <option value="hunyuan-pro">混元Pro</option>
                        </optgroup>
                      ) : (
                        <optgroup label="International Models">
                          <option value="gpt4o">GPT-4o</option>
                          <option value="claude">Claude 3.5</option>
                          <option value="gemini">Gemini Pro</option>
                        </optgroup>
                      )}
                    </>
                  )}
                  {contentType === 'image' && (
                    <>
                      {lang === 'zh' ? (
                        <optgroup label="国内模型 (免费优先)">
                          <option value="qwen-vl">通义千问VL (免费)</option>
                          <option value="hunyuan-vision">混元视觉 (免费)</option>
                          <option value="doubao-vision">豆包视觉 (免费)</option>
                        </optgroup>
                      ) : (
                        <optgroup label="International Models">
                          <option value="gpt4o-vision">GPT-4o Vision</option>
                          <option value="claude-vision">Claude 3.5 Vision</option>
                          <option value="gemini">Gemini Pro</option>
                        </optgroup>
                      )}
                    </>
                  )}
                  {contentType === 'video' && (
                    <>
                      {lang === 'zh' ? (
                        <optgroup label="国内模型 (免费优先)">
                          <option value="qwen-vl">通义千问VL (免费)</option>
                          <option value="hunyuan-vision">混元视觉 (免费)</option>
                          <option value="doubao-vision">豆包视觉 (免费)</option>
                        </optgroup>
                      ) : (
                        <optgroup label="International Models">
                          <option value="gpt4o-vision">GPT-4o Vision</option>
                          <option value="gemini">Gemini Pro</option>
                        </optgroup>
                      )}
                    </>
                  )}
                  {contentType === 'website' && (
                    <>
                      {lang === 'zh' ? (
                        <optgroup label="国内模型 (免费优先)">
                          <option value="hunyuan-lite">混元Lite (免费)</option>
                          <option value="qwen-turbo">通义千问 (免费)</option>
                          <option value="hunyuan-pro">混元Pro</option>
                        </optgroup>
                      ) : (
                        <optgroup label="International Models">
                          <option value="gpt4o">GPT-4o</option>
                          <option value="claude">Claude 3.5</option>
                          <option value="gemini">Gemini Pro</option>
                        </optgroup>
                      )}
                    </>
                  )}
                </select>
              </div>
              <button
                className={`px-8 py-2.5 rounded-xl text-white font-medium shadow-sm ${isGenerating ? 'btn-loading' : 'btn-primary'}`}
                onClick={handleCreativeGenerate}
                disabled={isGenerating}
                title={lang === 'zh' ? '使用上方选择的模型生成类似内容' : 'Use the selected model above to generate similar content'}
              >
                ✨ {isGenerating ? (lang === 'zh' ? '生成中...' : 'Generating...') : t('btn.similar')}
              </button>
            </div>
            {sourceFile && (
              <div className="text-right text-xs text-gray-500 mt-2">
                {lang === 'zh' ? '当前文件：' : 'Current file: '}{sourceFile.name} ({(sourceFile.size / 1024 / 1024).toFixed(2)}MB)
              </div>
            )}
          </div>

          {/* 生成内容区 */}
          <div className="mb-4">
            <div className="output-card rounded-xl p-4 min-h-[80px] shadow-sm flex items-center justify-center relative overflow-hidden">
              {creativeImages.length > 0 ? (
                // 图片结果显示
                <div className="grid grid-cols-2 gap-4 w-full">
                  {creativeImages.map((imgUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imgUrl} 
                        alt={`生成图片 ${index + 1}`}
                        className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      />
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={imgUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-black/50 text-white px-3 py-1 rounded text-xs hover:bg-black/70"
                          download
                        >
                          {lang === 'zh' ? '下载' : 'Download'}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : creativeResult ? (
                // 文本结果显示
                <div className="whitespace-pre-wrap text-sm text-gray-700 w-full">{creativeResult}</div>
              ) : (
                // 默认空状态
                <div className="moon-container flex items-center justify-center">
                  <div className="moon-base"></div>
                  {/* 流星 - 从左下角到右上角 */}
                  <div className="meteor meteor-1"></div>
                  <div className="meteor meteor-2"></div>
                  <div className="meteor meteor-3"></div>
                  <div className="meteor meteor-4"></div>
                  <div className="meteor meteor-5"></div>
                </div>
              )}
            </div>
            {/* 分享按钮 + 下载 - 框外右下角 */}
            <div className="flex items-center justify-end gap-3 mt-3">
              <span className="text-xs text-gray-500">{t('share.title')}</span>
              {lang === 'zh' ? (
                <div className="flex gap-1.5">
                  <button className="social-btn-small wechat" title="微信" onClick={shareToWechat}><WechatIcon /></button>
                  <button className="social-btn-small douyin" title="抖音" onClick={shareToDouyin}><DouyinIcon /></button>
                  <button className="social-btn-small xiaohongshu" title="小红书" onClick={shareToXiaohongshu}><XiaohongshuIcon /></button>
                  <button className="social-btn-small weibo" title="微博" onClick={shareToWeibo}><WeiboIcon /></button>
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <button className="social-btn-small twitter" title="X (Twitter)" onClick={shareToTwitter}><TwitterIcon /></button>
                  <button className="social-btn-small facebook" title="Facebook" onClick={shareToFacebook}><FacebookIcon /></button>
                  <button className="social-btn-small linkedin" title="LinkedIn" onClick={shareToLinkedIn}><LinkedInIcon /></button>
                  <button className="social-btn-small instagram" title="Instagram" onClick={shareToInstagram}><InstagramIcon /></button>
                </div>
              )}
              <div className="w-px h-4 bg-gray-300 mx-1"></div>
              <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1" onClick={handleDownload}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                <span>{t('btn.download')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
