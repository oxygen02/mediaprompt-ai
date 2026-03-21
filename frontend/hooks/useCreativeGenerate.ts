/**
 * 创意生成逻辑封装 Hook
 */

import { useState, useCallback } from 'react';

interface GenerateState {
  isGenerating: boolean;
  result: string;
  images: string[];
  error: string | null;
}

export function useCreativeGenerate() {
  const [state, setState] = useState<GenerateState>({
    isGenerating: false,
    result: '',
    images: [],
    error: null
  });

  const generate = useCallback(async (
    prompt: string,
    options: {
      model: string;
      contentType: string;
      lang: string;
    }
  ) => {
    if (!prompt.trim()) {
      setState(prev => ({ ...prev, error: '请输入提示词' }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://124.156.200.127:3001';
      
      const response = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model: options.model,
          contentType: options.contentType,
          lang: options.lang
        })
      });

      const data = await response.json();

      if (data.success) {
        if (data.type === 'image' && data.images) {
          setState({
            isGenerating: false,
            result: '',
            images: data.images,
            error: null
          });
        } else if (data.type === 'text' && data.result) {
          setState({
            isGenerating: false,
            result: data.result,
            images: [],
            error: null
          });
        }
        return data;
      } else {
        throw new Error(data.error || '生成失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成失败';
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMessage
      }));
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      result: '',
      images: [],
      error: null
    });
  }, []);

  return {
    ...state,
    generate,
    reset
  };
}
