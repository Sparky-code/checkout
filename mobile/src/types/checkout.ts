export interface Person {
  id: string
  name: string
  initials: string
  color: string
}

export interface Item {
  id: string
  name: string
  price: number
  count?: number
  assignedUsers?: string[]
  isSelected?: boolean
}

export interface ItemAssignment {
  personId: string
  weight: number
}

export interface BillSplit {
  id: string
  title: string
  total: number
  people: Person[]
  items?: Item[]
  createdAt: Date
  updatedAt: Date
}

export interface SplitResult {
  perPerson: number
  total: number
  peopleCount: number
  remainder?: number
  personTotals?: Record<string, number>
}

export interface ReceiptData {
  total: number
  items?: Item[]
  date?: Date
  merchant?: string
}
