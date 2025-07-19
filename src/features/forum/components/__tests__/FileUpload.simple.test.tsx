import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FileUpload } from '../FileUpload';

// Mock the toast hook
vi.mock('../../../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

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

describe('FileUpload Component', () => {
  const defaultProps = {
    uploadUrl: '/api/uploads',
    onProgress: vi.fn(),
    onSuccess: vi.fn(),
    onError: vi.fn(),
  };

  it('renders upload zone correctly', () => {
    render(<FileUpload {...defaultProps} />);
    
    expect(screen.getByText('Drop files here or click to select')).toBeDefined();
    expect(screen.getByText(/Supports: image\/png, image\/jpeg, application\/pdf/)).toBeDefined();
  });

  it('displays correct file size limit', () => {
    render(<FileUpload {...defaultProps} maxSizeBytes={5000000} />);
    
    expect(screen.getByText(/Max 5MB/)).toBeDefined();
  });

  it('shows allowed file types', () => {
    const customTypes = ['image/png', 'application/pdf'];
    render(
      <FileUpload 
        {...defaultProps} 
        allowedTypes={customTypes}
      />
    );
    
    expect(screen.getByText(/Supports: image\/png, application\/pdf/)).toBeDefined();
  });

  it('renders without crashing with minimal props', () => {
    render(<FileUpload uploadUrl="/api/uploads" />);
    
    expect(screen.getByText('Drop files here or click to select')).toBeDefined();
  });
});