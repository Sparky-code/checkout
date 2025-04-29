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

export interface ItemAssignment {
  personId: string;
  weight: number;
} 