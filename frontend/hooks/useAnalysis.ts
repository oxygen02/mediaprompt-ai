/**
 * 分析逻辑封装 Hook
 * 统一处理文件分析的所有逻辑
 */

import { useState, useCallback } from 'react';
import { analyzeFile, analyzeUrl } from '@/lib/api';

interface AnalysisState {
  isLoading: boolean;
  result: string;
  error: string | null;
  status: 'waiting' | 'processing' | 'success' | 'error';
}

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: '',
    error: null,
    status: 'waiting'
  });

  /**
   * 分析文件
   */
  const analyze = useCallback(async (
    file: File | null,
    contentType: string,
    options: {
      outputOptions: string[];
      detailLevel: 'concise' | 'detailed';
      videoSize?: string;
      voiceover?: string;
      lang: string;
    }
  ) => {
    if (!file) {
      setState(prev => ({ ...prev, error: '请先上传文件', status: 'error' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, status: 'processing', error: null }));

    try {
      const response = await analyzeFile(
        file,
        contentType,
        options.outputOptions,
        options.detailLevel,
        options.videoSize,
        options.voiceover,
        options.lang
      );

      if (response.success && response.result) {
        setState({
          isLoading: false,
          result: response.result,
          error: null,
          status: 'success'
        });
        return response.result;
      } else {
        throw new Error(response.error || '分析失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        status: 'error'
      }));
      throw err;
    }
  }, []);

  /**
   * 分析 URL
   */
  const analyzeWebsite = useCallback(async (
    url: string,
    options: {
      outputOptions: string[];
      detailLevel: 'concise' | 'detailed';
      lang: string;
    }
  ) => {
    if (!url.trim()) {
      setState(prev => ({ ...prev, error: '请输入网址', status: 'error' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, status: 'processing', error: null }));

    try {
      const response = await analyzeUrl(
        url,
        options.outputOptions,
        options.detailLevel,
        options.lang
      );

      if (response.success && response.result) {
        setState({
          isLoading: false,
          result: response.result,
          error: null,
          status: 'success'
        });
        return response.result;
      } else {
        throw new Error(response.error || '分析失败');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '网络错误';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        status: 'error'
      }));
      throw err;
    }
  }, []);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      result: '',
      error: null,
      status: 'waiting'
    });
  }, []);

  return {
    ...state,
    analyze,
    analyzeWebsite,
    reset
  };
}
