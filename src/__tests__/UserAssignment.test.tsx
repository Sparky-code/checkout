import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserAssignment from '../components/UserAssignment/UserAssignment';
import { Person, Item } from '../types';

describe('UserAssignment', () => {
  const mockUsers: Person[] = [
    { id: '1', name: 'John Doe', initials: 'JD', color: '#FF6B6B' },
    { id: '2', name: 'Jane Smith', initials: 'JS', color: '#4ECDC4' }
  ];

  const mockItems: Item[] = [
    { id: '1', name: 'Pizza', price: 20.00, count: 1 },
    { id: '2', name: 'Drinks', price: 15.00, count: 2 }
  ];

  const mockProps = {
    currentStep: 3,
    setCurrentStep: jest.fn(),
    items: mockItems,
    setItems: jest.fn(),
    users: mockUsers,
    setUsers: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<UserAssignment {...mockProps} />);
    expect(screen.getByText('People')).toBeInTheDocument();
  });

  it('displays existing users', () => {
    render(<UserAssignment {...mockProps} />);
    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('JS')).toBeInTheDocument();
  });

  it('shows add person button', () => {
    render(<UserAssignment {...mockProps} />);
    expect(screen.getByText('Add Person')).toBeInTheDocument();
  });

  it('opens dialog when add person button is clicked', async () => {
    render(<UserAssignment {...mockProps} />);
    const addButton = screen.getByText('Add Person');
    await userEvent.click(addButton);
    expect(screen.getByText('Add New Person')).toBeInTheDocument();
  });

  it('adds a new user when dialog form is submitted', async () => {
    const { setUsers } = mockProps;
    render(<UserAssignment {...mockProps} />);
    
    // Open dialog
    await userEvent.click(screen.getByText('Add Person'));
    
    // Fill in name
    const nameInput = screen.getByLabelText('Name');
    await userEvent.type(nameInput, 'Bob Wilson');
    
    // Submit form
    await userEvent.click(screen.getByText('Add'));
    
    expect(setUsers).toHaveBeenCalled();
    const newUserCall = setUsers.mock.calls[0][0];
    expect(newUserCall).toHaveLength(3); // Original 2 users + new user
    expect(newUserCall[2].name).toBe('Bob Wilson');
    expect(newUserCall[2].initials).toBe('BW');
  });

  it('removes a user when close button is clicked', async () => {
    const { setUsers, setItems } = mockProps;
    render(<UserAssignment {...mockProps} />);
    
    // Find and click first user's close button
    const closeButtons = screen.getAllByTestId('CloseIcon');
    await userEvent.click(closeButtons[0]);
    
    expect(setUsers).toHaveBeenCalledWith(mockUsers.filter(u => u.id !== '1'));
    expect(setItems).toHaveBeenCalled();
  });

  it('shows items when "Show Items" button is clicked', async () => {
    render(<UserAssignment {...mockProps} />);
    
    await userEvent.click(screen.getByText('Show Items'));
    
    expect(screen.getByText('Items to Split')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Drinks')).toBeInTheDocument();
  });

  it('assigns item to selected user when clicked', async () => {
    const { setItems } = mockProps;
    render(<UserAssignment {...mockProps} />);
    
    // Show items
    await userEvent.click(screen.getByText('Show Items'));
    
    // Select a user
    await userEvent.click(screen.getByText('JD'));
    
    // Click an item
    await userEvent.click(screen.getByText('Pizza'));
    
    expect(setItems).toHaveBeenCalled();
    const updatedItems = setItems.mock.calls[0][0];
    expect(updatedItems[0].assignedUsers).toContain('1');
  });

  it('validates duplicate names', async () => {
    render(<UserAssignment {...mockProps} />);
    
    // Open dialog
    await userEvent.click(screen.getByText('Add Person'));
    
    // Try to add existing name
    const nameInput = screen.getByLabelText('Name');
    await userEvent.type(nameInput, 'John Doe');
    
    expect(screen.getByText('This name is already taken')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeDisabled();
  });

  it('handles empty name submission', async () => {
    render(<UserAssignment {...mockProps} />);
    
    // Open dialog
    await userEvent.click(screen.getByText('Add Person'));
    
    // Try to submit empty name
    const addButton = screen.getByText('Add');
    expect(addButton).toBeDisabled();
  });

  it('assigns all users to item on double click', async () => {
    const { setItems } = mockProps;
    render(<UserAssignment {...mockProps} />);
    
    // Show items
    await userEvent.click(screen.getByText('Show Items'));
    
    // Double click an item
    const pizzaItem = screen.getByText('Pizza');
    fireEvent.doubleClick(pizzaItem);
    
    expect(setItems).toHaveBeenCalled();
    const updatedItems = setItems.mock.calls[0][0];
    expect(updatedItems[0].isSelected).toBe(true);
    expect(updatedItems[0].assignedUsers).toEqual(mockUsers.map(u => u.id));
  });
}); 