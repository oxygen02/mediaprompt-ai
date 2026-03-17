'use client';

export default function Header() {
  return (
    <>
      {/* 顶部导航栏 */}
      <nav className="h-14 border-b border-gray-200 flex items-center justify-between px-8 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-gray-800 font-medium">首页</a>
          <a href="/pricing" className="text-sm text-gray-500 hover:text-gray-800">定价</a>
          <a href="/about" className="text-sm text-gray-500 hover:text-gray-800">关于</a>
        </div>

        {/* 月食动画 + Slogan */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8">
            <div className="moon-base w-8 h-8 rounded-full bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 relative overflow-hidden">
              <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black/10 rounded-full" />
              <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-black/15 rounded-full" />
            </div>
            <div className="moon-shadow absolute top-0 left-0 w-8 h-8 rounded-full pointer-events-none" />
          </div>
          <h1 className="text-base font-semibold text-gray-800">最好的学习从模仿开始</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button className="px-3 py-1 rounded text-xs font-medium bg-gray-600 text-white">中文</button>
            <button className="px-3 py-1 rounded text-xs text-gray-500">EN</button>
          </div>
          <button className="text-sm text-gray-500 hover:text-gray-800">登录</button>
          <button className="btn-primary px-4 py-1.5 rounded text-sm text-white">注册</button>
        </div>
      </nav>

      {/* 固定副标题区域 */}
      <div className="fixed top-14 left-52 right-0 z-15 bg-[#f5f5f7] px-6 py-3 border-b border-gray-200">
        <p className="text-center text-gray-500 text-sm">
          上传你喜欢的内容，提炼有效提示词，让美好可以复刻迭代
        </p>
      </div>
    </>
  );
}
