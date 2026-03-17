'use client';

interface OutputAreaProps {
  output: string;
}

export default function OutputArea({ output }: OutputAreaProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const formatOutput = (text: string) => {
    if (!text) return null;

    const sections = text.split(/##\s*/).filter((s) => s.trim());
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      if (lines.length === 0) return null;

      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();

      if (!title) return null;

      const titleLower = title.toLowerCase();
      let borderClass = 'border-gray-500';
      let textClass = 'text-gray-600';

      if (titleLower.includes('workflow')) {
        borderClass = 'border-gray-600';
        textClass = 'text-gray-700';
      } else if (titleLower.includes('example')) {
        borderClass = 'border-gray-400';
        textClass = 'text-gray-500';
      } else if (titleLower.includes('initialization') || titleLower.includes('初始化')) {
        borderClass = 'border-gray-600';
        textClass = 'text-gray-600';
      }

      return (
        <div
          key={index}
          className={`bg-gray-50 border-l-3 ${borderClass} p-3 mb-2 rounded-r-lg`}
          style={{ borderLeftWidth: '3px' }}
        >
          <div className={`font-semibold ${textClass} text-xs mb-1`}>{title}</div>
          <div className="text-gray-600 text-xs leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">输出结果</h3>
        {output && (
          <button
            onClick={handleCopy}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span>一键复制</span>
          </button>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm output-scroll">
        <div className="p-4">
          {output ? (
            formatOutput(output)
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">
              上传内容后点击"开始分析提炼"生成提示词
            </p>
          )}
        </div>
      </div>

      {/* 编辑区 */}
      {output && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-600 mb-2">编辑修改（可选）</h3>
          <textarea
            className="w-full h-24 bg-white border border-gray-200 rounded-xl p-3 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:border-gray-400"
            placeholder="在这里修改提示词或添加你的想法..."
            defaultValue={output}
          />
        </div>
      )}
    </div>
  );
}
