import { API_BASE_URL } from '../config/api';

export interface GuidanceResponse {
  query: string;
  guidance: string;
}

export interface SlokaResponse {
  chapter_id: number;
  shloka_id: number;
  shloka_sanskrit: string;
  transliteration: string;
  english_meaning: string;
  audio: string;
}

export const getMahaGuruGuidance = async (query: string): Promise<GuidanceResponse> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout for LLM

  try {
    const response = await fetch(`${API_BASE_URL}/managuru`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch guidance: ${response.status} ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error?.name === 'AbortError') {
      throw new Error('The divine wisdom is taking longer than expected. Please try again.');
    }
    console.error('Error fetching Maha Guru guidance:', error);
    throw error;
  }
};

export const getSloka = async (chapterId: number, shlokaId: number): Promise<SlokaResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/sloka?chapter_id=${chapterId}&shloka_id=${shlokaId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sloka: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching sloka:', error);
    throw error;
  }
};
