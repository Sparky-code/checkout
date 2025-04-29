import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryPage from '../components/SummaryPage/SummaryPage';
import { Item, Person } from '../types';

describe('SummaryPage', () => {
  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Item 1',
      price: 10.99,
      count: 1,
      assignedUsers: ['user1'],
      isSelected: false
    },
    {
      id: '2',
      name: 'Item 2',
      price: 15.99,
      count: 2,
      assignedUsers: ['user1', 'user2'],
      isSelected: false
    }
  ];

  const mockUsers: Person[] = [
    {
      id: 'user1',
      name: 'User 1',
      initials: 'U1',
      color: '#FF0000'
    },
    {
      id: 'user2',
      name: 'User 2',
      initials: 'U2',
      color: '#00FF00'
    }
  ];

  const mockReceiptSummary = {
    subtotal: 42.97,
    tax: 3.50,
    total: 46.47,
    tip: 5.00,
    date: '2024-03-20',
    merchant: 'Test Store',
    originalImage: null
  };

  const mockOnBack = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <SummaryPage
        items={mockItems}
        users={mockUsers}
        onBack={mockOnBack}
        taxAmount={mockReceiptSummary.tax}
        receiptSummary={mockReceiptSummary}
      />
    );
    expect(screen.getByText('Test Store')).toBeInTheDocument();
  });

  it('displays all items with their prices and assigned users', () => {
    render(
      <SummaryPage
        items={mockItems}
        users={mockUsers}
        onBack={mockOnBack}
        taxAmount={mockReceiptSummary.tax}
        receiptSummary={mockReceiptSummary}
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();
    expect(screen.getByText('1 assigned')).toBeInTheDocument();

    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('$15.99 × 2')).toBeInTheDocument();
    expect(screen.getByText('2 assigned')).toBeInTheDocument();
  });

  it('displays receipt summary with correct totals', () => {
    render(
      <SummaryPage
        items={mockItems}
        users={mockUsers}
        onBack={mockOnBack}
        taxAmount={mockReceiptSummary.tax}
        receiptSummary={mockReceiptSummary}
      />
    );

    expect(screen.getByText('Subtotal:')).toBeInTheDocument();
    expect(screen.getByText('$42.97')).toBeInTheDocument();

    expect(screen.getByText('Tax:')).toBeInTheDocument();
    expect(screen.getByText('$3.50')).toBeInTheDocument();

    expect(screen.getByText('Tip:')).toBeInTheDocument();
    expect(screen.getByText('$5.00')).toBeInTheDocument();

    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('$46.47')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    render(
      <SummaryPage
        items={mockItems}
        users={mockUsers}
        onBack={mockOnBack}
        taxAmount={mockReceiptSummary.tax}
        receiptSummary={mockReceiptSummary}
      />
    );

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('toggles original bill image visibility', () => {
    const mockImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const receiptSummaryWithImage = {
      ...mockReceiptSummary,
      originalImage: mockImage
    };

    render(
      <SummaryPage
        items={mockItems}
        users={mockUsers}
        onBack={mockOnBack}
        taxAmount={mockReceiptSummary.tax}
        receiptSummary={receiptSummaryWithImage}
      />
    );

    const toggleButton = screen.getByRole('button', { name: /show original bill/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /hide original bill/i })).toBeInTheDocument();
  });

  it('calculates and displays user totals correctly', () => {
    render(
      <SummaryPage
        items={mockItems}
        users={mockUsers}
        onBack={mockOnBack}
        taxAmount={mockReceiptSummary.tax}
        receiptSummary={mockReceiptSummary}
      />
    );

    // User 1 should have both items
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('$26.98')).toBeInTheDocument(); // $10.99 + ($15.99/2)

    // User 2 should have half of Item 2
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('$15.99')).toBeInTheDocument(); // $15.99/2
  });
}); 