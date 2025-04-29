import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManualEntry from '../components/ManualEntry/ManualEntry';
import { Item } from '../types';

const mockSetItems = jest.fn();
const mockSetManualItems = jest.fn();
const mockSetManualTax = jest.fn();
const mockSetManualTip = jest.fn();
const mockSetIsTipPercentage = jest.fn();
const mockSetValidationAttempted = jest.fn();

const mockProps = {
  items: [],
  setItems: mockSetItems,
  manualItems: [{ name: '', price: '', count: 1 }],
  setManualItems: mockSetManualItems,
  manualTax: '',
  setManualTax: mockSetManualTax,
  manualTip: '',
  setManualTip: mockSetManualTip,
  isTipPercentage: true,
  setIsTipPercentage: mockSetIsTipPercentage,
  validationAttempted: false,
  setValidationAttempted: mockSetValidationAttempted,
};

describe('ManualEntry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ManualEntry {...mockProps} />);
    expect(screen.getByText('Enter Items Manually')).toBeInTheDocument();
  });

  it('shows validation errors when required fields are empty', async () => {
    render(<ManualEntry {...mockProps} validationAttempted={true} manualTax="" manualTip="" />);
    
    const submitButton = screen.getByRole('button', { name: /add item/i });
    await userEvent.click(submitButton);
    
    expect(screen.getByText(/tax amount is required/i)).toBeInTheDocument();
    expect(screen.getByText(/tip amount is required/i)).toBeInTheDocument();
  });

  it('calculates tip amount correctly', () => {
    render(<ManualEntry {...mockProps} isTipPercentage={true} manualTip="15" />);
    // Add your test assertions here
  });
}); 