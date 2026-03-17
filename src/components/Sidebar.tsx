'use client';

import { Category } from '@/app/page';

interface SidebarProps {
  category: Category;
  setCategory: (cat: Category) => void;
}

export default function Sidebar({ category, setCategory }: SidebarProps) {
  const categories = [
    { id: 'document', name: '文档分析', icon: '📄' },
    { id: 'image', name: '图片分析', icon: '🖼️' },
    { id: 'video', name: '视频分析', icon: '🎬' },
    { id: 'website', name: '网页分析', icon: '🌐' },
  ];

  return (
    <aside className="w-52 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen z-20 flex flex-col">
      {/* Logo */}
      <div className="h-14 px-4 border-b border-gray-200 flex items-center">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
        <span className="font-semibold text-gray-800 ml-2">MediaPrompt</span>
      </div>

      {/* 导航 */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-xs text-gray-400 px-3 py-2">分析工具</div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id as Category)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              category === cat.id
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}

        <div className="text-xs text-gray-400 px-3 py-2 mt-4">案例展示</div>
        <a href="/cases" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <span>📁</span>
          <span>案例对比</span>
        </a>

        <div className="text-xs text-gray-400 px-3 py-2 mt-4">个人中心</div>
        <a href="/history" className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
          <span>🕐</span>
          <span>历史记录</span>
        </a>
      </nav>

      {/* 用户信息 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 truncate">用户名</p>
            <p className="text-xs text-gray-400">免费用户</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
