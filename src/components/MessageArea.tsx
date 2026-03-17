'use client';

import { Message } from '@/app/page';

interface MessageAreaProps {
  message: Message | null;
}

export default function MessageArea({ message }: MessageAreaProps) {
  if (!message) return null;

  const bgColor = {
    success: 'bg-green-50 border-green-200 text-green-700',
    error: 'bg-red-50 border-red-200 text-red-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  };

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div
      className={`mb-4 px-4 py-3 rounded-lg border ${bgColor[message.type]} flex items-center gap-2`}
    >
      <span className="font-bold">{icon[message.type]}</span>
      <span className="text-sm">{message.text}</span>
    </div>
  );
}
