'use client';

import { useState, useCallback } from 'react';

// 组件
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import UploadZone from '@/components/UploadZone';
import OutputArea from '@/components/OutputArea';
import MessageArea from '@/components/MessageArea';

// 类型
export type Category = 'document' | 'image' | 'video' | 'website';

export interface Message {
  type: 'success' | 'error' | 'info';
  text: string;
}

export default function Home() {
  const [category, setCategory] = useState<Category>('document');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [output, setOutput] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(['prompt']);

  const showMessage = useCallback((type: Message['type'], text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!uploadedFile) {
      showMessage('error', '请先上传文件');
      return;
    }

    setIsLoading(true);
    setOutput('');

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('category', category);
      formData.append('outputOptions', JSON.stringify(selectedOptions));

      const response = await fetch('http://124.156.200.127:3001/api/analyze/file', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setOutput(data.result);
        showMessage('success', '分析完成！');
      } else {
        showMessage('error', data.error || '分析失败');
      }
    } catch (error) {
      showMessage('error', '网络错误，请检查API服务');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedFile, category, selectedOptions, showMessage]);

  return (
    <div className="flex min-h-screen">
      {/* 左侧导航 */}
      <Sidebar category={category} setCategory={setCategory} />

      {/* 主内容区 */}
      <div className="flex-1 ml-52">
        <Header />

        <main className="p-6 max-w-4xl mx-auto pt-28">
          <MessageArea message={message} />

          <UploadZone
            category={category}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            isLoading={isLoading}
            onAnalyze={handleAnalyze}
          />

          <OutputArea output={output} />
        </main>
      </div>
    </div>
  );
}
