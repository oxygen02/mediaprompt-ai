import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediaPrompt AI - 内容反向工程工具箱",
  description: "上传你喜欢的内容，提炼有效提示词，让美好可以复刻迭代",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="bg-[#f5f5f7] text-gray-800 font-sans">
        {children}
      </body>
    </html>
  );
}
