import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ManualEntry from '../components/ManualEntry/ManualEntry';
import { Item } from '../types';

describe('ManualEntry', () => {
  const mockItems: Item[] = [
    { id: '1', name: 'Pizza', price: 20.00, count: 1 },
    { id: '2', name: 'Drinks', price: 15.00, count: 2 }
  ];

  const mockProps = {
    items: mockItems,
    setItems: jest.fn(),
    manualItems: [{ name: 'Burger', price: '12.99', count: 1 }],
    setManualItems: jest.fn(),
    manualTax: '2.50',
    setManualTax: jest.fn(),
    manualTip: '3.00',
    setManualTip: jest.fn(),
    isTipPercentage: false,
    setIsTipPercentage: jest.fn(),
    validationAttempted: false,
    setValidationAttempted: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ManualEntry {...mockProps} />);
    expect(screen.getByText('Enter Items Manually')).toBeInTheDocument();
  });

  it('displays existing manual items', () => {
    render(<ManualEntry {...mockProps} />);
    expect(screen.getByDisplayValue('Burger')).toBeInTheDocument();
    expect(screen.getByDisplayValue('12.99')).toBeInTheDocument();
  });

  it('allows adding new items', async () => {
    render(<ManualEntry {...mockProps} />);
    await userEvent.click(screen.getByText('Add Item'));
    expect(mockProps.setManualItems).toHaveBeenCalled();
  });

  it('allows removing items', async () => {
    render(<ManualEntry {...mockProps} />);
    await userEvent.click(screen.getByText('Remove'));
    expect(mockProps.setManualItems).toHaveBeenCalled();
  });

  it('updates tax value', async () => {
    render(<ManualEntry {...mockProps} />);
    const taxInput = screen.getByLabelText('Tax:');
    await userEvent.type(taxInput, '5.00');
    expect(mockProps.setManualTax).toHaveBeenCalled();
  });

  it('updates tip value', async () => {
    render(<ManualEntry {...mockProps} />);
    const tipInput = screen.getByLabelText('Tip:');
    await userEvent.type(tipInput, '10.00');
    expect(mockProps.setManualTip).toHaveBeenCalled();
  });

  it('toggles tip percentage mode', async () => {
    render(<ManualEntry {...mockProps} />);
    const tipSwitch = screen.getByRole('switch');
    await userEvent.click(tipSwitch);
    expect(mockProps.setIsTipPercentage).toHaveBeenCalled();
  });

  it('shows validation errors when attempted', () => {
    render(<ManualEntry {...mockProps, validationAttempted: true, manualTax: '', manualTip: ''}} />);
    expect(screen.getAllByText('Required')).toHaveLength(2);
  });

  it('calculates total correctly', () => {
    render(<ManualEntry {...mockProps} />);
    // Subtotal: 12.99, Tax: 2.50, Tip: 3.00
    expect(screen.getByText('$18.49')).toBeInTheDocument();
  });

  it('calculates total with percentage tip correctly', () => {
    render(<ManualEntry {...mockProps, isTipPercentage: true, manualTip: '15'}} />);
    // Subtotal: 12.99, Tax: 2.50, Tip: 15% of 12.99 = 1.95
    expect(screen.getByText('$17.44')).toBeInTheDocument();
  });

  it('validates numeric input for price', async () => {
    render(<ManualEntry {...mockProps} />);
    const priceInput = screen.getByDisplayValue('12.99');
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, 'abc');
    expect(priceInput).toHaveValue('');
  });

  it('validates numeric input for count', async () => {
    render(<ManualEntry {...mockProps} />);
    const countInput = screen.getByDisplayValue('1');
    await userEvent.clear(countInput);
    await userEvent.type(countInput, 'abc');
    expect(countInput).toHaveValue('');
  });
}); 