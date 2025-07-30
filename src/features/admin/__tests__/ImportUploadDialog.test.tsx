import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import ImportUploadDialog from '../components/ImportUploadDialog';

// Mock the API hook
const mockUseDataImportAPI = {
  initiateImport: vi.fn(),
  validateData: vi.fn(),
  isLoading: false,
  error: null
};

vi.mock('../hooks/useDataImportAPI', () => ({
  useDataImportAPI: () => mockUseDataImportAPI
}));

describe('ImportUploadDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders upload dialog with form fields', () => {
    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText('Upload Data Import')).toBeInTheDocument();
    expect(screen.getByLabelText(/Import Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Import Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Import Category/i)).toBeInTheDocument();
    expect(screen.getByText('Choose File')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const fileInput = screen.getByLabelText(/Choose File/i);
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  });

  it('validates required fields before submission', async () => {
    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const submitButton = screen.getByText('Upload & Process');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Import name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a file/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockUseDataImportAPI.initiateImport.mockResolvedValue({
      success: true,
      data: { id: 'import-123' }
    });

    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Import Name/i), {
      target: { value: 'Test Import' }
    });

    fireEvent.change(screen.getByLabelText(/Import Type/i), {
      target: { value: 'csv' }
    });

    fireEvent.change(screen.getByLabelText(/Import Category/i), {
      target: { value: 'emissions' }
    });

    // Upload file
    const fileInput = screen.getByLabelText(/Choose File/i);
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const submitButton = screen.getByText('Upload & Process');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseDataImportAPI.initiateImport).toHaveBeenCalledWith({
        importName: 'Test Import',
        importType: 'csv',
        importCategory: 'emissions',
        file: file
      });
    });

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles validation errors', async () => {
    mockUseDataImportAPI.validateData.mockResolvedValue({
      success: false,
      errors: [
        { row: 1, column: 'emissions', message: 'Invalid number format' }
      ]
    });

    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/Import Name/i), {
      target: { value: 'Test Import' }
    });

    fireEvent.change(screen.getByLabelText(/Import Type/i), {
      target: { value: 'csv' }
    });

    fireEvent.change(screen.getByLabelText(/Import Category/i), {
      target: { value: 'emissions' }
    });

    // Upload file
    const fileInput = screen.getByLabelText(/Choose File/i);
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const submitButton = screen.getByText('Upload & Process');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid number format/i)).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    mockUseDataImportAPI.isLoading = true;

    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('handles API errors', async () => {
    mockUseDataImportAPI.error = 'Upload failed';

    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    expect(screen.getByText(/Upload failed/i)).toBeInTheDocument();
  });

  it('closes dialog when cancel button is clicked', () => {
    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('supports drag and drop file upload', async () => {
    render(
      <ImportUploadDialog
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const dropZone = screen.getByTestId('drop-zone');
    const file = new File(['test,data'], 'test.csv', { type: 'text/csv' });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file]
      }
    });

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });
  });
});