import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://124.156.200.127:3001';

export interface AnalyzeResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export interface PreviewResponse {
  success: boolean;
  preview?: string;
  error?: string;
}

export async function analyzeFile(
  file: File,
  category: string,
  outputOptions: string[],
  detailLevel?: 'concise' | 'detailed',
  videoSize?: string,
  voiceover?: string
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('outputOptions', JSON.stringify(outputOptions));
  if (detailLevel) {
    formData.append('detailLevel', detailLevel);
  }
  
  if (category === 'video') {
    if (videoSize) formData.append('videoSize', videoSize);
    if (voiceover) formData.append('voiceover', voiceover);
  }

  try {
    // 根据文件类型选择正确的API端点
    let endpoint = '/api/analyze/file';
    if (category === 'image') {
      endpoint = '/api/analyze/image';
    } else if (category === 'video') {
      endpoint = '/api/analyze/video';
    }

    const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Network error',
      };
    }
    return {
      success: false,
      error: 'Unknown error',
    };
  }
}

export async function analyzeText(
  content: string,
  category: string,
  outputOptions: string[]
): Promise<AnalyzeResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/analyze/text`, {
      content,
      category,
      outputOptions,
    }, {
      timeout: 120000,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Network error',
      };
    }
    return {
      success: false,
      error: 'Unknown error',
    };
  }
}

export async function previewOutput(prompt: string): Promise<PreviewResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/preview`, {
      prompt,
    }, {
      timeout: 60000,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Network error',
      };
    }
    return {
      success: false,
      error: 'Unknown error',
    };
  }
}
