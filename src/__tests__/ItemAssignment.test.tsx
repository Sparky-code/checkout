import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ItemAssignment from '../components/ItemAssignment/ItemAssignment';
import { Item, Person } from '../types';

describe('ItemAssignment', () => {
  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Item 1',
      price: 10.99,
      count: 1,
      assignedUsers: [],
      isSelected: false
    },
    {
      id: '2',
      name: 'Item 2',
      price: 15.99,
      count: 2,
      assignedUsers: [],
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

  const mockSetItems = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <ItemAssignment
        items={mockItems}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );
    expect(screen.getByText('Items to Split')).toBeInTheDocument();
  });

  it('displays all items with their prices and counts', () => {
    render(
      <ItemAssignment
        items={mockItems}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('$10.99')).toBeInTheDocument();

    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('$15.99 × 2')).toBeInTheDocument();
  });

  it('allows selecting items for assignment', () => {
    render(
      <ItemAssignment
        items={mockItems}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );

    const item1 = screen.getByText('Item 1').closest('li');
    fireEvent.click(item1!);

    expect(mockSetItems).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: '1',
        isSelected: true
      })
    ]));
  });

  it('allows double-clicking to select all users for an item', () => {
    render(
      <ItemAssignment
        items={mockItems}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );

    const item1 = screen.getByText('Item 1').closest('li');
    fireEvent.doubleClick(item1!);

    expect(mockSetItems).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: '1',
        assignedUsers: ['user1', 'user2']
      })
    ]));
  });

  it('shows assignment indicators for each user', () => {
    const itemsWithAssignments = mockItems.map(item => ({
      ...item,
      assignedUsers: ['user1']
    }));

    render(
      <ItemAssignment
        items={itemsWithAssignments}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );

    const assignmentIndicators = screen.getAllByTestId('assignment-indicator');
    expect(assignmentIndicators).toHaveLength(2); // One for each item
  });

  it('allows removing items', () => {
    render(
      <ItemAssignment
        items={mockItems}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(mockSetItems).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        id: '2' // Only the second item should remain
      })
    ]));
  });

  it('allows adding new items', () => {
    render(
      <ItemAssignment
        items={mockItems}
        setItems={mockSetItems}
        users={mockUsers}
      />
    );

    const addButton = screen.getByRole('button', { name: /add additional items/i });
    fireEvent.click(addButton);

    expect(mockSetItems).toHaveBeenCalledWith(expect.arrayContaining([
      ...mockItems,
      expect.objectContaining({
        id: expect.any(String),
        name: '',
        price: 0,
        count: 1
      })
    ]));
  });
}); 