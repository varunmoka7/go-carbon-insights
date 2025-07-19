import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AdminDashboard } from '../pages/AdminDashboard';

// Mock the hooks
jest.mock('../hooks/useSSE', () => ({
  useSSE: () => ({
    isConnected: false,
    lastEvent: null,
    connectionError: null,
    connect: jest.fn(),
    disconnect: jest.fn(),
  }),
}));

jest.mock('../hooks/useModerationAPI', () => ({
  useModerationAPI: () => ({
    metrics: {
      moderationActions: { total: 0, recent: 0 },
      contentReports: { total: 0, pending: 0 },
      users: { total: 0, suspended: 0, active: 0 },
    },
    isLoading: false,
    error: null,
  }),
}));

jest.mock('../hooks/useReportsAPI', () => ({
  useReportsAPI: () => ({
    reportStats: {
      byStatus: [],
      byReason: [],
      recentCount: 0,
    },
    usePendingReports: () => ({
      data: { data: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } },
      isLoading: false,
      error: null,
    }),
    isLoading: false,
    error: null,
  }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard overview', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <AdminDashboard />
      </Wrapper>
    );

    expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
    expect(screen.getByText('Monitor forum activity, moderation actions, and user reports.')).toBeInTheDocument();
  });

  it('shows offline status when not connected', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <AdminDashboard />
      </Wrapper>
    );

    expect(screen.getByText('🔴 Offline')).toBeInTheDocument();
  });

  it('renders metrics overview component', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <AdminDashboard />
      </Wrapper>
    );

    // Check for metric cards
    expect(screen.getByText('Pending Reports')).toBeInTheDocument();
    expect(screen.getByText('Moderation Actions')).toBeInTheDocument();
    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Reports Resolved')).toBeInTheDocument();
  });

  it('renders reports list component', () => {
    const Wrapper = createWrapper();
    
    render(
      <Wrapper>
        <AdminDashboard />
      </Wrapper>
    );

    expect(screen.getByText('Pending Reports')).toBeInTheDocument();
    expect(screen.getByText('No pending reports!')).toBeInTheDocument();
  });
});