import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FileUpload } from '../FileUpload';
import { useToast } from '../../../../hooks/use-toast';
import { server } from '../../../../test/mocks/server';

// Mock the toast hook
vi.mock('../../../../hooks/use-toast');
const mockUseToast = useToast as any;
const mockToast = vi.fn();

// Mock fetch
global.fetch = vi.fn();
const mockFetch = fetch as any;

// Mock URL.createObjectURL and revokeObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-object-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn(),
});

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => 'mock-auth-token'),
  },
});

describe('FileUpload', () => {
  const defaultProps = {
    uploadUrl: '/api/uploads',
    onProgress: vi.fn(),
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseToast.mockReturnValue({ toast: mockToast });
    // Disable MSW for upload tests to use Jest fetch mock instead
    server.close();
  });

  afterEach(() => {
    vi.resetAllMocks();
    // Restart MSW after each test
    server.listen({ onUnhandledRequest: 'bypass' });
  });

  it('renders upload zone correctly', () => {
    render(<FileUpload {...defaultProps} />);
    
    expect(screen.getByText('Drop files here or click to select')).toBeInTheDocument();
    expect(screen.getByText(/Supports: image\/png, image\/jpeg, application\/pdf/)).toBeInTheDocument();
  });

  it('accepts file selection via click', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);
    
    expect(screen.getByText('test.png')).toBeInTheDocument();
    expect(screen.getByText('0.00 MB')).toBeInTheDocument();
  });

  it('validates file types', async () => {
    render(<FileUpload {...defaultProps} />);
    
    const invalidFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection more directly
    Object.defineProperty(input, 'files', {
      value: [invalidFile],
      writable: false,
    });
    
    fireEvent.change(input);
    
    // Wait for the component to process the file
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Upload Error',
        description: 'Invalid file type. Allowed types: image/png, image/jpeg, application/pdf',
        variant: 'destructive',
      });
    }, { timeout: 3000 });
  });

  it('validates file size', async () => {
    const maxSize = 1024 * 1024; // 1MB
    render(<FileUpload {...defaultProps} maxSizeBytes={maxSize} />);
    
    // Create a file larger than the limit
    const largeFile = new File(['x'.repeat(2048)], 'large.png', { type: 'image/png' });
    Object.defineProperty(largeFile, 'size', { value: 2 * 1024 * 1024 }); // 2MB
    
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Simulate file selection more directly
    Object.defineProperty(input, 'files', {
      value: [largeFile],
      writable: false,
    });
    
    fireEvent.change(input);
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Upload Error',
        description: 'File size exceeds maximum limit of 1MB',
        variant: 'destructive',
      });
    });
  });

  it('handles drag and drop', async () => {
    render(<FileUpload {...defaultProps} />);
    
    const dropZone = screen.getByRole('button');
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    
    fireEvent.dragOver(dropZone);
    expect(dropZone).toHaveClass('border-blue-500');
    
    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    });
    
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('uploads file successfully', async () => {
    const user = userEvent.setup();
    
    // Mock successful API responses
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          uploadId: 'test-upload-id',
          url: 'https://s3.amazonaws.com/presigned-url',
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'test-upload-id',
          originalFilename: 'test.png',
          cdnUrl: 'https://cdn.example.com/test.png',
        }),
      } as Response);
    
    render(<FileUpload {...defaultProps} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);
    
    const uploadButton = screen.getByText('Upload');
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Uploaded successfully')).toBeInTheDocument();
    });
    
    expect(mockFetch).toHaveBeenCalledTimes(4);
    expect(defaultProps.onSuccess).toHaveBeenCalledWith({
      id: 'test-upload-id',
      originalFilename: 'test.png',
      cdnUrl: 'https://cdn.example.com/test.png',
    });
  });

  it('handles upload errors', async () => {
    const user = userEvent.setup();
    
    // Mock failed presign response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({
        message: 'Invalid file size',
      }),
    } as Response);
    
    render(<FileUpload {...defaultProps} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);
    
    const uploadButton = screen.getByText('Upload');
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid file size')).toBeInTheDocument();
    });
    
    expect(defaultProps.onError).toHaveBeenCalledWith({
      code: 'UPLOAD_FAILED',
      message: 'Invalid file size',
    });
  });

  it('allows file removal', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);
    
    expect(screen.getByText('test.png')).toBeInTheDocument();
    
    const removeButton = screen.getByRole('button', { name: /×/ });
    await user.click(removeButton);
    
    expect(screen.queryByText('test.png')).not.toBeInTheDocument();
  });

  it('supports multiple file uploads when enabled', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} multiple={true} />);
    
    const file1 = new File(['content 1'], 'test1.png', { type: 'image/png' });
    const file2 = new File(['content 2'], 'test2.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, [file1, file2]);
    
    expect(screen.getByText('test1.png')).toBeInTheDocument();
    expect(screen.getByText('test2.png')).toBeInTheDocument();
  });

  it('replaces files when multiple is disabled', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} multiple={false} />);
    
    const file1 = new File(['content 1'], 'test1.png', { type: 'image/png' });
    const file2 = new File(['content 2'], 'test2.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file1);
    expect(screen.getByText('test1.png')).toBeInTheDocument();
    
    await user.upload(input, file2);
    expect(screen.queryByText('test1.png')).not.toBeInTheDocument();
    expect(screen.getByText('test2.png')).toBeInTheDocument();
  });

  it('shows image previews', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);
    
    const imageFile = new File(['image content'], 'image.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, imageFile);
    
    const preview = screen.getByRole('img', { name: 'image.png' });
    expect(preview).toHaveAttribute('src', 'mock-object-url');
  });

  it('shows file icons for non-images', async () => {
    const user = userEvent.setup();
    render(<FileUpload {...defaultProps} />);
    
    const pdfFile = new File(['pdf content'], 'document.pdf', { type: 'application/pdf' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, pdfFile);
    
    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    // Should not have an image preview
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('retries failed uploads', async () => {
    const user = userEvent.setup();
    
    // First attempt fails, second succeeds
    mockFetch
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Network error' }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          uploadId: 'test-upload-id',
          url: 'https://s3.amazonaws.com/presigned-url',
        }),
      } as Response)
      .mockResolvedValueOnce({ ok: true } as Response)
      .mockResolvedValueOnce({ ok: true } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          id: 'test-upload-id',
          originalFilename: 'test.png',
        }),
      } as Response);
    
    render(<FileUpload {...defaultProps} />);
    
    const file = new File(['test content'], 'test.png', { type: 'image/png' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    
    await user.upload(input, file);
    
    // First upload attempt
    const uploadButton = screen.getByText('Upload');
    await user.click(uploadButton);
    
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
    
    // Retry
    const retryButton = screen.getByRole('button', { name: /RotateCcw/ });
    await user.click(retryButton);
    
    await waitFor(() => {
      expect(screen.getByText('✓ Uploaded successfully')).toBeInTheDocument();
    });
  });
});