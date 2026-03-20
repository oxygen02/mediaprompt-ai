import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PromptBox AI - Content Reverse Engineering Toolkit',
  description: 'Upload content you like, extract effective prompts, make beauty reproducible',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#f5f5f7] text-gray-800">
        {children}
      </body>
    </html>
  );
}
