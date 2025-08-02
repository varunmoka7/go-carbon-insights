import { describe, it, expect, vi, afterEach } from 'vitest';
import { callGeminiApi } from '@/services/geminiAPI';
import type { GeminiApiRequest } from '@/types/gemini-api';

// Mock the global fetch function
global.fetch = vi.fn();

describe('callGeminiApi Service', () => {

  afterEach(() => {
    // Clear mocks after each test
    vi.restoreAllMocks();
  });

  const mockRequest: GeminiApiRequest = {
    prompt: 'Test prompt',
  };

  it('should return data successfully when the API call is successful', async () => {
    const mockResponse = { extractedText: 'Test success' };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await callGeminiApi(mockRequest);

    expect(fetch).toHaveBeenCalledWith('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockRequest),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when the API call fails', async () => {
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ error: { message: 'Server error' } }),
    });

    // We expect the function to throw an error, so we wrap it in a promise rejection test
    await expect(callGeminiApi(mockRequest)).rejects.toThrow(
      'API call failed with status 500: Server error'
    );
  });
});