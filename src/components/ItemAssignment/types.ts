export interface Person {
  id: string;
  name: string;
  initials: string;
  color: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  count?: number;
  assignedUsers?: string[];
  isSelected?: boolean;
}

export interface ItemAssignmentProps {
  items: Item[];
  setItems: (items: Item[]) => void;
  users: Person[];
} 