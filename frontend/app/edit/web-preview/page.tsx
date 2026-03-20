import React from 'react';

export default function WebPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">网页预览</h1>
        
        <div className="grid grid-cols-3 gap-6">
          {/* 左侧：关键词输入 */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">关键词输入</h2>
            <textarea
              className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="描述你想要的网页...&#10;例如：一个现代化的电商首页，深色主题，主色调蓝色"
            />
            <button className="w-full mt-4 bg-indigo-500 text-white py-2 rounded-lg text-sm">
              生成预览图
            </button>
          </div>
          
          {/* 中间：预览区域 */}
          <div className="col-span-2 bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">网页预览</h2>
            <div className="bg-gray-100 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
              <p className="text-gray-400 text-sm">生成的网页预览图将显示在这里</p>
            </div>
            
            {/* 标注工具栏 */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-gray-600">标注工具：</span>
              <button className="px-3 py-1.5 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200">矩形框</button>
              <button className="px-3 py-1.5 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200">箭头</button>
              <button className="px-3 py-1.5 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200">文字</button>
              <button className="px-3 py-1.5 bg-gray-100 rounded text-sm text-gray-700 hover:bg-gray-200">删除</button>
            </div>
          </div>
        </div>
        
        {/* 右侧：对接工具 */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">设计工具</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">Figma</div>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">Sketch</div>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">即时设计</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">网页生成</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">Framer</div>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">Webflow</div>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">V0.dev</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">代码生成</h3>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">HTML/CSS</div>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">React</div>
              <div className="p-2 bg-gray-50 rounded text-sm text-gray-600">Vue</div>
            </div>
          </div>
        </div>
        
        {/* 功能说明 */}
        <div className="mt-8 bg-purple-50 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-purple-800 mb-2">功能规划</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• 用户输入关键词生成网页预览图</li>
            <li>• 支持局部标注和备注说明修改需求</li>
            <li>• 灵活的网页版型设计编辑器</li>
            <li>• 对接全网合适工具（Figma、Webflow、V0.dev等）</li>
            <li>• 支持导出为设计稿或前端代码</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
