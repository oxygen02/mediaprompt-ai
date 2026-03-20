import React from 'react';

export default function ImageTextEditPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">图文编辑</h1>
        
        <div className="grid grid-cols-3 gap-6">
          {/* 左侧：模板选择 */}
          <div className="col-span-1 bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">热门模板</h2>
            <div className="space-y-3">
              {['小红书种草', '抖音短视频文案', '朋友圈分享', '微博热点'].map((template) => (
                <div key={template} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <p className="text-sm text-gray-700">{template}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* 中间：编辑区域 */}
          <div className="col-span-1 bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">编辑区</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-400 text-sm">拖拽图片或粘贴文案到这里</p>
              <p className="text-gray-300 text-xs mt-2">支持一键复制和分享</p>
            </div>
          </div>
          
          {/* 右侧：预览和工具 */}
          <div className="col-span-1 bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">预览</h2>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
              <p className="text-gray-400 text-sm text-center">实时预览效果</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-indigo-500 text-white py-2 rounded-lg text-sm">复制</button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm">分享</button>
            </div>
          </div>
        </div>
        
        {/* 功能说明 */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">功能规划</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 爬取优秀社交媒体文案模板（小红书、抖音、朋友圈、微博）</li>
            <li>• 支持图片拖拽上传和文字编辑</li>
            <li>• 一键复制和分享到各大平台</li>
            <li>• 区分中文/国际用户不同平台</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
