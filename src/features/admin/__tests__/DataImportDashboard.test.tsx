import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import DataImportDashboard from '../pages/DataImportDashboard';

// Mock the API hook
const mockUseDataImportAPI = {
  getImportHistory: vi.fn(),
  getImportStatus: vi.fn(),
  cancelImport: vi.fn(),
  isLoading: false,
  error: null
};

vi.mock('../hooks/useDataImportAPI', () => ({
  useDataImportAPI: () => mockUseDataImportAPI
}));

describe('DataImportDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dashboard with statistics', () => {
    const mockStats = {
      totalImports: 150,
      successfulImports: 120,
      failedImports: 20,
      pendingImports: 10,
      averageProcessingTime: '2.5 minutes'
    };

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: mockStats,
        imports: []
      }
    });

    render(<DataImportDashboard />);

    expect(screen.getByText('Data Import Dashboard')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument(); // Total imports
    expect(screen.getByText('120')).toBeInTheDocument(); // Successful imports
    expect(screen.getByText('20')).toBeInTheDocument(); // Failed imports
  });

  it('displays import history in table', async () => {
    const mockImports = [
      {
        id: 'import-1',
        import_name: 'Test Import 1',
        import_type: 'csv',
        import_category: 'emissions',
        status: 'completed',
        progress_percentage: 100,
        created_at: '2025-07-30T10:00:00Z'
      },
      {
        id: 'import-2',
        import_name: 'Test Import 2',
        import_type: 'api',
        import_category: 'financial',
        status: 'processing',
        progress_percentage: 50,
        created_at: '2025-07-30T11:00:00Z'
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Test Import 1')).toBeInTheDocument();
      expect(screen.getByText('Test Import 2')).toBeInTheDocument();
      expect(screen.getByText('csv')).toBeInTheDocument();
      expect(screen.getByText('api')).toBeInTheDocument();
    });
  });

  it('shows import status with progress bar', async () => {
    const mockImports = [
      {
        id: 'import-1',
        import_name: 'Processing Import',
        status: 'processing',
        progress_percentage: 75,
        total_records: 1000,
        processed_records: 750
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Processing Import')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('750 / 1000 records')).toBeInTheDocument();
    });
  });

  it('allows canceling active imports', async () => {
    const mockImports = [
      {
        id: 'import-1',
        import_name: 'Active Import',
        status: 'processing',
        progress_percentage: 50
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    mockUseDataImportAPI.cancelImport.mockResolvedValue({
      success: true
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Active Import')).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(mockUseDataImportAPI.cancelImport).toHaveBeenCalledWith('import-1');
    });
  });

  it('filters imports by status', async () => {
    const mockImports = [
      {
        id: 'import-1',
        import_name: 'Completed Import',
        status: 'completed'
      },
      {
        id: 'import-2',
        import_name: 'Failed Import',
        status: 'failed'
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Completed Import')).toBeInTheDocument();
      expect(screen.getByText('Failed Import')).toBeInTheDocument();
    });

    // Filter by completed status
    const statusFilter = screen.getByLabelText(/Status/i);
    fireEvent.change(statusFilter, { target: { value: 'completed' } });

    await waitFor(() => {
      expect(screen.getByText('Completed Import')).toBeInTheDocument();
      expect(screen.queryByText('Failed Import')).not.toBeInTheDocument();
    });
  });

  it('filters imports by type', async () => {
    const mockImports = [
      {
        id: 'import-1',
        import_name: 'CSV Import',
        import_type: 'csv'
      },
      {
        id: 'import-2',
        import_name: 'API Import',
        import_type: 'api'
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText('CSV Import')).toBeInTheDocument();
      expect(screen.getByText('API Import')).toBeInTheDocument();
    });

    // Filter by CSV type
    const typeFilter = screen.getByLabelText(/Type/i);
    fireEvent.change(typeFilter, { target: { value: 'csv' } });

    await waitFor(() => {
      expect(screen.getByText('CSV Import')).toBeInTheDocument();
      expect(screen.queryByText('API Import')).not.toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    mockUseDataImportAPI.error = 'Failed to load import history';
    mockUseDataImportAPI.getImportHistory.mockRejectedValue(new Error('API Error'));

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load import history/i)).toBeInTheDocument();
    });
  });

  it('shows loading state', () => {
    mockUseDataImportAPI.isLoading = true;

    render(<DataImportDashboard />);

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays import details in modal', async () => {
    const mockImports = [
      {
        id: 'import-1',
        import_name: 'Detailed Import',
        import_type: 'csv',
        import_category: 'emissions',
        status: 'completed',
        total_records: 1000,
        processed_records: 1000,
        error_count: 5,
        created_at: '2025-07-30T10:00:00Z',
        completed_at: '2025-07-30T10:05:00Z'
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Detailed Import')).toBeInTheDocument();
    });

    const viewButton = screen.getByText('View Details');
    fireEvent.click(viewButton);

    await waitFor(() => {
      expect(screen.getByText('Import Details')).toBeInTheDocument();
      expect(screen.getByText('1000 records processed')).toBeInTheDocument();
      expect(screen.getByText('5 errors')).toBeInTheDocument();
    });
  });

  it('refreshes data periodically', async () => {
    vi.useFakeTimers();

    const mockImports = [
      {
        id: 'import-1',
        import_name: 'Test Import',
        status: 'processing'
      }
    ];

    mockUseDataImportAPI.getImportHistory.mockResolvedValue({
      success: true,
      data: {
        stats: {},
        imports: mockImports
      }
    });

    render(<DataImportDashboard />);

    await waitFor(() => {
      expect(mockUseDataImportAPI.getImportHistory).toHaveBeenCalledTimes(1);
    });

    // Advance timer to trigger refresh
    vi.advanceTimersByTime(30000); // 30 seconds

    await waitFor(() => {
      expect(mockUseDataImportAPI.getImportHistory).toHaveBeenCalledTimes(2);
    });

    vi.useRealTimers();
  });
});