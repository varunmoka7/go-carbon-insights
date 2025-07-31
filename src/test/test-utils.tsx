import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a test wrapper with Router context
interface WrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
  initialIndex?: number;
}

const TestWrapper: React.FC<WrapperProps> = ({ 
  children, 
  initialEntries = ['/admin'], 
  initialIndex = 0 
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Custom render function with Router context
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialEntries?: string[];
  initialIndex?: number;
}

export const renderWithRouter = (
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialEntries, initialIndex, ...renderOptions } = options;
  
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TestWrapper initialEntries={initialEntries} initialIndex={initialIndex}>
      {children}
    </TestWrapper>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Export everything from testing-library
export * from '@testing-library/react';
export { renderWithRouter as render };