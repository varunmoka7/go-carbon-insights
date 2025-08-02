import { describe, it, expect, vi, afterEach } from 'vitest';
import { processEsgReport } from '@/services/geminiAPI';
import type { ESGExtractionRequest as ApiRequest } from '@/types/gemini-api';

// Mock the global fetch function before all tests
global.fetch = vi.fn();

describe('processEsgReport Service', () => {

  afterEach(() => {
    // Clear mocks after each test to ensure isolation
    vi.restoreAllMocks();
  });

  const mockRequest: ApiRequest = {
    documentText: 'Test content',
    extractionType: 'emissions'
  };

  it('should return data successfully when the API call is successful', async () => {
    const mockResponse = { success: true, data: { message: 'Processed' } };

    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await processEsgReport(mockRequest);

    // Verify fetch was called correctly to our proxy
    expect(fetch).toHaveBeenCalledWith('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockRequest),
    });

    // Verify the service returns the expected data
    expect(result).toEqual(mockResponse);
  });

  it('should throw an error when the API call fails', async () => {
    // Mock a failed response from the server
    (fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({ message: 'Server error occurred' }),
    });

    // Verify that our service function throws an error
    await expect(processEsgReport(mockRequest)).rejects.toThrow(
      'API request failed with status 500: Internal Server Error'
    );
  });
});