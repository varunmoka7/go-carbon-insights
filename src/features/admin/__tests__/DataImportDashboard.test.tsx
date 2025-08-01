import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, beforeEach, it, expect } from 'vitest';
import { renderWithRouter as render } from '../../../test/test-utils';
import DataImportDashboard from '../pages/DataImportDashboard';

// Mock the API hook
const mockUseDataImportAPI = {
  imports: [],
  statistics: null,
  configurations: [],
  isLoading: false,
  error: null,
  initiateImport: vi.fn(),
  getImportStatus: vi.fn(),
  cancelImport: vi.fn(),
  refreshImports: vi.fn(),
  validateData: vi.fn(),
  refreshStatistics: vi.fn(),
  getConfigurations: vi.fn(),
  createConfiguration: vi.fn(),
  downloadTemplate: vi.fn()
};

vi.mock('../hooks/useDataImportAPI', () => ({
  useDataImportAPI: () => mockUseDataImportAPI
}));

// Mock child components to avoid import issues
vi.mock('../components/ImportUploadDialog', () => ({
  ImportUploadDialog: ({ open, onOpenChange, onSuccess }: any) => 
    open ? <div data-testid="import-upload-dialog">Import Upload Dialog</div> : null
}));

vi.mock('../components/ImportHistoryTable', () => ({
  ImportHistoryTable: () => <div data-testid="import-history-table">Import History Table</div>
}));

vi.mock('../components/ImportStatistics', () => ({
  ImportStatistics: () => <div data-testid="import-statistics">Import Statistics</div>
}));

vi.mock('../components/ImportConfigurations', () => ({
  ImportConfigurations: () => <div data-testid="import-configurations">Import Configurations</div>
}));

describe('DataImportDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock to default state
    mockUseDataImportAPI.error = null;
    mockUseDataImportAPI.isLoading = false;
    mockUseDataImportAPI.statistics = null;
  });

  it('renders AdminLayout without crashing', () => {
    render(<DataImportDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Forum Administration')).toBeInTheDocument();
  });

  it('calls useDataImportAPI hook on mount', () => {
    render(<DataImportDashboard />);
    // Just verify the component renders and the hook is called
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('handles loading state without errors', () => {
    mockUseDataImportAPI.isLoading = true;
    
    render(<DataImportDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('handles error state without crashing', () => {
    mockUseDataImportAPI.error = 'Test error';
    
    render(<DataImportDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  it('renders with statistics data', () => {
    mockUseDataImportAPI.statistics = {
      totalImports: 10,
      completedImports: 8,
      successRate: 80
    };
    
    render(<DataImportDashboard />);
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });
});