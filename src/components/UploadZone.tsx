'use client';

import { Category } from '@/app/page';

interface UploadZoneProps {
  category: Category;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
  isLoading: boolean;
  onAnalyze: () => void;
}

const moonPhases = {
  document: 'moon-95',
  image: 'moon-70',
  video: 'moon-40',
  website: 'moon-full',
};

export default function UploadZone({
  category,
  uploadedFile,
  setUploadedFile,
  selectedOptions,
  setSelectedOptions,
  isLoading,
  onAnalyze,
}: UploadZoneProps) {
  const categories: { id: Category; name: string }[] = [
    { id: 'document', name: '文档' },
    { id: 'image', name: '图片' },
    { id: 'video', name: '视频' },
    { id: 'website', name: '网页' },
  ];

  const options: Record<Category, string[]> = {
    document: ['提示词', '大纲梗概', '结构分析', '关键词'],
    image: ['提示词', '风格描述', '配色方案', '参数建议'],
    video: ['提示词', '分镜脚本', '节奏分析', '推荐工具'],
    website: ['提示词', '功能列表', 'MVP文档', '技术栈'],
  };

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* 类别选择 */}
      <div className="flex gap-2 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              // This would update the parent state
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${
              category === cat.id
                ? 'bg-white text-gray-800 border border-gray-600 shadow-sm'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 ${
                cat.id === 'document'
                  ? 'shadow-[inset_14px_0_0_0_rgba(20,20,25,0.9)]'
                  : cat.id === 'image'
                  ? 'shadow-[inset_11px_0_0_0_rgba(20,20,25,0.9)]'
                  : cat.id === 'video'
                  ? 'shadow-[inset_6px_0_0_0_rgba(20,20,25,0.9)]'
                  : 'shadow-[inset_2px_0_0_0_rgba(20,20,25,0.9)]'
              }`}
            />
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* 文件拖拽区 */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-gray-500 hover:bg-gray-50 transition-colors"
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-gray-600 mb-1">
          {uploadedFile ? uploadedFile.name : '拖放文件到此处'}
        </p>
        <p className="text-gray-400 text-xs">
          {category === 'document' && '支持 Word/PDF/TXT/Markdown'}
          {category === 'image' && '支持 JPG/PNG/WebP/GIF'}
          {category === 'video' && '支持 MP4/MOV，≤30秒'}
          {category === 'website' && '支持 URL/网页截图'}
        </p>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={
            category === 'document'
              ? '.doc,.docx,.pdf,.txt,.md'
              : category === 'image'
              ? '.jpg,.jpeg,.png,.webp,.gif'
              : category === 'video'
              ? '.mp4,.mov'
              : undefined
          }
        />
      </div>

      {/* 模型选择 + 分析按钮 */}
      <div className="flex gap-3 items-center flex-wrap">
        <button
          onClick={() => document.getElementById('fileInput')?.click()}
          className="flex-1 py-2.5 px-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-600 font-medium shadow-sm hover:bg-gray-50"
        >
          📁 选择文件上传
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">模型选择：</span>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 min-w-[140px]">
            <option>🤖 自动选择</option>
            <optgroup label="国内模型">
              <option>混元 Lite</option>
              <option>混元 Pro</option>
            </optgroup>
            <optgroup label="International">
              <option>GPT-4o</option>
              <option>Claude 3.5</option>
            </optgroup>
          </select>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading || !uploadedFile}
          className={`px-6 py-2.5 rounded-xl text-white font-medium shadow-sm ${
            isLoading
              ? 'btn-loading bg-gray-600'
              : 'btn-primary hover:opacity-90'
          } ${!uploadedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? '⏳ 正在分析...' : '🔍 开始分析提炼'}
        </button>
      </div>

      {/* 输出选项 */}
      <div className="flex items-center gap-3 flex-wrap">
        <h3 className="text-sm font-medium text-gray-600">希望输出的内容（可多选）</h3>
        <div className="flex items-center gap-1 flex-wrap">
          {options[category].map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                selectedOptions.includes(option)
                  ? 'text-gray-700 font-medium bg-gray-100 border border-gray-400'
                  : 'text-gray-400 bg-transparent border border-gray-200 hover:border-gray-300'
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  selectedOptions.includes(option)
                    ? 'bg-gray-600'
                    : 'border border-gray-300'
                }`}
              />
              <span>{option}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
