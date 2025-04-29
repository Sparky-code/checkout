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

export interface ReceiptSummary {
  subtotal: number;
  tax: number;
  total: number;
  tip: number;
  date: string;
  merchant: string;
  originalImage: File | string | null;
}

export interface SummaryPageProps {
  items: Item[];
  users: Person[];
  onBack: () => void;
  taxAmount: number;
  receiptSummary: ReceiptSummary;
}

export interface UserTotal {
  user: Person;
  subtotal: number;
  tip: number;
  tax: number;
  total: number;
} 