import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReceiptScraper from '../components/ReceiptScraper/ReceiptScraper';
import { useReceiptProcessing } from '../components/ReceiptScraper/hooks/useReceiptProcessing';

// Mock the custom hook
jest.mock('../components/ReceiptScraper/hooks/useReceiptProcessing');

describe('ReceiptScraper', () => {
  const mockOnExtracted = jest.fn();
  const mockImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation
    (useReceiptProcessing as jest.Mock).mockReturnValue({
      text: '',
      loading: false,
      progress: 0,
      error: null,
      startTime: null,
      endTime: null,
      processImage: jest.fn()
    });
  });

  it('renders without crashing', () => {
    render(<ReceiptScraper image={mockImage} onExtracted={mockOnExtracted} />);
    expect(screen.getByTestId('receipt-scraper')).toBeInTheDocument();
  });

  it('shows loading state when processing', () => {
    (useReceiptProcessing as jest.Mock).mockReturnValue({
      text: '',
      loading: true,
      progress: 50,
      error: null,
      startTime: Date.now(),
      endTime: null,
      processImage: jest.fn()
    });

    render(<ReceiptScraper image={mockImage} onExtracted={mockOnExtracted} />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Progress: 50%')).toBeInTheDocument();
  });

  it('shows error state when processing fails', () => {
    (useReceiptProcessing as jest.Mock).mockReturnValue({
      text: '',
      loading: false,
      progress: 0,
      error: 'OCR processing failed',
      startTime: Date.now(),
      endTime: Date.now(),
      processImage: jest.fn()
    });

    render(<ReceiptScraper image={mockImage} onExtracted={mockOnExtracted} />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('OCR processing failed')).toBeInTheDocument();
  });

  it('calls onExtracted when text is processed', async () => {
    const mockText = 'Processed text';
    (useReceiptProcessing as jest.Mock).mockReturnValue({
      text: mockText,
      loading: false,
      progress: 100,
      error: null,
      startTime: Date.now(),
      endTime: Date.now(),
      processImage: jest.fn()
    });

    render(<ReceiptScraper image={mockImage} onExtracted={mockOnExtracted} />);
    
    await waitFor(() => {
      expect(mockOnExtracted).toHaveBeenCalledWith(mockText);
    });
  });

  it('shows processing time when complete', () => {
    const startTime = Date.now();
    const endTime = startTime + 2000; // 2 seconds later
    
    (useReceiptProcessing as jest.Mock).mockReturnValue({
      text: 'Processed text',
      loading: false,
      progress: 100,
      error: null,
      startTime,
      endTime,
      processImage: jest.fn()
    });

    render(<ReceiptScraper image={mockImage} onExtracted={mockOnExtracted} />);
    
    expect(screen.getByText('Time taken: 2.00s')).toBeInTheDocument();
  });
}); 