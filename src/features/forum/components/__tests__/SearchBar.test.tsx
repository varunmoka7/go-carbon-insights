import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchBar from '../SearchBar';
import { searchService } from '@/api/SearchService';

// Mock the search service
vi.mock('@/api/SearchService', () => ({
  searchService: {
    getAutocomplete: vi.fn(),
  },
}));

const mockProps = {
  onSearch: vi.fn(),
  onResultsClick: vi.fn(),
  categories: [
    { id: '1', name: 'Carbon Tracking' },
    { id: '2', name: 'Sustainability' },
  ],
  availableTags: ['carbon-footprint', 'emissions', 'renewable-energy'],
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input and filter button', () => {
    renderWithRouter(<SearchBar {...mockProps} />);
    
    expect(screen.getByPlaceholderText(/search discussions/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter/i })).toBeInTheDocument();
  });

  it('calls onSearch when typing in search input', async () => {
    renderWithRouter(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search discussions/i);
    fireEvent.change(searchInput, { target: { value: 'carbon tracking' } });
    
    await waitFor(() => {
      expect(mockProps.onSearch).toHaveBeenCalledWith(
        'carbon tracking',
        expect.any(Object)
      );
    }, { timeout: 500 });
  });

  it('shows autocomplete suggestions when typing', async () => {
    const mockSuggestions = {
      data: {
        query: 'carbon',
        suggestions: ['carbon footprint', 'carbon tracking', 'carbon offset'],
      },
    };

    vi.mocked(searchService.getAutocomplete).mockResolvedValue(mockSuggestions);

    renderWithRouter(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search discussions/i);
    fireEvent.change(searchInput, { target: { value: 'carbon' } });
    fireEvent.focus(searchInput);
    
    await waitFor(() => {
      expect(screen.getByText('carbon footprint')).toBeInTheDocument();
    });
  });

  it('shows trending topics when no query is entered', () => {
    renderWithRouter(<SearchBar {...mockProps} showTrending={true} />);
    
    expect(screen.getByText(/trending topics/i)).toBeInTheDocument();
    expect(screen.getByText('carbon-footprint')).toBeInTheDocument();
  });

  it('opens filter popover when filter button is clicked', async () => {
    renderWithRouter(<SearchBar {...mockProps} />);
    
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText('Carbon Tracking')).toBeInTheDocument();
    });
  });

  it('shows active filter count when filters are applied', async () => {
    renderWithRouter(<SearchBar {...mockProps} />);
    
    // Open filter popover
    const filterButton = screen.getByRole('button', { name: /filter/i });
    fireEvent.click(filterButton);
    
    await waitFor(() => {
      const categoryCheckbox = screen.getByLabelText('Carbon Tracking');
      fireEvent.click(categoryCheckbox);
    });
    
    // Filter button should show active count
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('clears search when X button is clicked', () => {
    renderWithRouter(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search discussions/i);
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
  });

  it('handles form submission', () => {
    renderWithRouter(<SearchBar {...mockProps} />);
    
    const searchInput = screen.getByPlaceholderText(/search discussions/i);
    fireEvent.change(searchInput, { target: { value: 'carbon footprint' } });
    
    const form = searchInput.closest('form')!;
    fireEvent.submit(form);
    
    expect(mockProps.onResultsClick).toHaveBeenCalledWith(
      'carbon footprint',
      expect.any(Object)
    );
  });
});