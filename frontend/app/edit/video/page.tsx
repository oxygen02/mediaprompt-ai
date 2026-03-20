import React from 'react';

export default function VideoEditPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">视频剪辑</h1>
        
        <div className="grid grid-cols-2 gap-6">
          {/* 左侧：上传和工具 */}
          <div className="space-y-6">
            {/* 上传区域 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">上传素材</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                <p className="text-gray-400 text-sm">拖拽或粘贴视频素材</p>
                <p className="text-gray-300 text-xs mt-2">支持多种格式</p>
              </div>
            </div>
            
            {/* 剪辑工具 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">剪辑工具</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">国内：剪映专业版</span>
                  <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded">打开</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">国际：CapCut / Premiere</span>
                  <button className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded">打开</button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧：预设模板 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">预设剪辑方式（12种）</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                '快节奏混剪', '慢节奏叙事', '卡点音乐', '画中画',
                '转场特效', '字幕解说', '配音解说', '产品展示',
                '教程步骤', 'Vlog记录', '情感故事', '品牌宣传'
              ].map((style) => (
                <div key={style} className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-200">
                  <p className="text-sm text-gray-700">{style}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-indigo-500 text-white py-3 rounded-lg text-sm font-medium">
              一键生成
            </button>
          </div>
        </div>
        
        {/* 功能说明 */}
        <div className="mt-8 bg-green-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-green-800 mb-2">功能规划</h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• 支持用户上传/粘贴视频素材</li>
            <li>• 对接国内剪映、国际CapCut/Premiere等主流剪辑工具</li>
            <li>• 12种预设剪辑方式，支持一键生成</li>
            <li>• 定期补充流行剪辑模板</li>
            <li>• 支持用户自定义剪辑方式</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
