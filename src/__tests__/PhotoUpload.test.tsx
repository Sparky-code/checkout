import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PhotoUpload from '../components/PhotoUpload/PhotoUpload';

const mockOnPhotoUpload = jest.fn();
const mockOnManualEntry = jest.fn();
const mockSetUploadStatus = jest.fn();
const mockSetDragActive = jest.fn();

const mockProps = {
  onPhotoUpload: mockOnPhotoUpload,
  onManualEntry: mockOnManualEntry,
  uploadStatus: 'idle' as const,
  setUploadStatus: mockSetUploadStatus,
  dragActive: false,
  setDragActive: mockSetDragActive,
};

describe('PhotoUpload', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<PhotoUpload {...mockProps} />);
    expect(screen.getByText('Name of bill')).toBeInTheDocument();
  });

  it('displays upload area', () => {
    render(<PhotoUpload {...mockProps} />);
    expect(screen.getByTestId('upload-area')).toBeInTheDocument();
  });

  it('shows camera and upload buttons', () => {
    render(<PhotoUpload {...mockProps} />);
    expect(screen.getByTestId('camera-button')).toBeInTheDocument();
    expect(screen.getByTestId('file-button')).toBeInTheDocument();
  });

  it('shows manual entry button', () => {
    render(<PhotoUpload {...mockProps} />);
    expect(screen.getByText('Enter manually')).toBeInTheDocument();
  });

  it('handles manual entry button click', async () => {
    render(<PhotoUpload {...mockProps} />);
    await userEvent.click(screen.getByText('Enter manually'));
    expect(mockOnManualEntry).toHaveBeenCalled();
  });

  it('handles file input change', async () => {
    render(<PhotoUpload {...mockProps} />);
    const fileInput = screen.getByTestId('file-input');
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await userEvent.upload(fileInput, file);
    
    await waitFor(() => {
      expect(mockSetUploadStatus).toHaveBeenCalledWith('uploading');
    });
  });

  it('handles camera input change', async () => {
    render(<PhotoUpload {...mockProps} />);
    const cameraInput = screen.getByTestId('camera-input');
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    await userEvent.upload(cameraInput, file);
    
    await waitFor(() => {
      expect(mockSetUploadStatus).toHaveBeenCalledWith('uploading');
    });
  });

  it('validates file types on upload', async () => {
    const { rerender } = render(<PhotoUpload {...mockProps} />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByTestId('file-input');
    
    await act(async () => {
      const changeEvent = {
        target: {
          files: [file]
        }
      };
      fireEvent.change(input, changeEvent);
    });

    await waitFor(() => {
      expect(mockSetUploadStatus).toHaveBeenCalledWith('error');
    });

    // Re-render with error status
    rerender(<PhotoUpload {...mockProps} uploadStatus="error" />);

    await waitFor(() => {
      const errorAlert = screen.getByText('Please upload an image file (jpg, png, etc).');
      expect(errorAlert).toBeInTheDocument();
    });
  });

  it('handles file upload errors', async () => {
    const { rerender } = render(<PhotoUpload {...mockProps} />);
    
    const file = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    const input = screen.getByTestId('file-input');
    
    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onerror: null as any,
      onload: null as any,
      error: new Error('Mock file read error'),
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
      result: null
    };

    // @ts-ignore - Mocking FileReader constructor
    window.FileReader = jest.fn(() => mockFileReader);
    
    await act(async () => {
      const changeEvent = {
        target: {
          files: [file]
        }
      };
      fireEvent.change(input, changeEvent);
      
      // Trigger the error
      if (mockFileReader.onerror) {
        mockFileReader.onerror(new ErrorEvent('error'));
      }
    });

    await waitFor(() => {
      expect(mockSetUploadStatus).toHaveBeenCalledWith('error');
    });

    // Re-render with error status
    rerender(<PhotoUpload {...mockProps} uploadStatus="error" />);

    await waitFor(() => {
      const errorAlert = screen.getByText('Error reading file');
      expect(errorAlert).toBeInTheDocument();
    });
  });

  it('shows upload status when uploading', () => {
    render(<PhotoUpload {...mockProps} uploadStatus="uploading" />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    render(<PhotoUpload {...mockProps} uploadStatus="processing" />);
    expect(screen.getByText('Processing...')).toBeInTheDocument();

    render(<PhotoUpload {...mockProps} uploadStatus="done" />);
    expect(screen.getByText('Processing complete!')).toBeInTheDocument();

    render(<PhotoUpload {...mockProps} uploadStatus="error" />);
    expect(screen.getByText('There was an error processing your bill.')).toBeInTheDocument();
  });

  it('handles drag and drop events', () => {
    render(<PhotoUpload {...mockProps} />);
    const uploadArea = screen.getByTestId('upload-area');
    
    fireEvent.dragOver(uploadArea);
    expect(mockSetDragActive).toHaveBeenCalledWith(true);
    
    fireEvent.dragLeave(uploadArea);
    expect(mockSetDragActive).toHaveBeenCalledWith(false);
  });
}); 