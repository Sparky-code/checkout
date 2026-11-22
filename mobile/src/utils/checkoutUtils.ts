import { BillSplit, Item, Person, SplitResult } from '../types/checkout'

/**
 * Generate initials from a person's name
 */
export const generateInitials = (name: string): string => {
  const words = name.trim().split(/\s+/)
  if (words.length === 1) {
    const word = words[0]
    return word.length > 1
      ? `${word[0].toUpperCase()}${word[word.length - 1].toUpperCase()}`
      : word[0].toUpperCase()
  }
  return words
    .map((word) => word[0].toUpperCase())
    .join('')
    .slice(0, 2)
}

/**
 * Calculate basic bill split (equal division)
 */
export const calculateBasicSplit = (total: number, peopleCount: number): SplitResult => {
  if (peopleCount <= 0 || total <= 0) {
    return {
      perPerson: 0,
      total: 0,
      peopleCount: 0
    }
  }

  const perPerson = total / peopleCount
  const remainder = total - perPerson * peopleCount

  return {
    perPerson: Math.round(perPerson * 100) / 100, // Round to 2 decimal places
    total,
    peopleCount,
    remainder: Math.round(remainder * 100) / 100
  }
}

/**
 * Calculate advanced bill split with item assignments
 */
export const calculateAdvancedSplit = (items: Item[], people: Person[]): SplitResult => {
  if (items.length === 0 || people.length === 0) {
    return {
      perPerson: 0,
      total: 0,
      peopleCount: 0
    }
  }

  const total = items.reduce((sum, item) => {
    const count = item.count || 1
    return sum + item.price * count
  }, 0)

  // Calculate how much each person owes based on assigned items
  const personTotals = new Map<string, number>()

  people.forEach((person) => {
    personTotals.set(person.id, 0)
  })

  items.forEach((item) => {
    const itemTotal = item.price * (item.count || 1)

    if (item.assignedUsers && item.assignedUsers.length > 0) {
      // Split item cost among assigned users
      const costPerPerson = itemTotal / item.assignedUsers.length
      item.assignedUsers.forEach((userId) => {
        const currentTotal = personTotals.get(userId) || 0
        personTotals.set(userId, currentTotal + costPerPerson)
      })
    } else {
      // If no users assigned, split equally among all people
      const costPerPerson = itemTotal / people.length
      people.forEach((person) => {
        const currentTotal = personTotals.get(person.id) || 0
        personTotals.set(person.id, currentTotal + costPerPerson)
      })
    }
  })

  // Round all totals to 2 decimal places
  personTotals.forEach((total, personId) => {
    personTotals.set(personId, Math.round(total * 100) / 100)
  })

  return {
    perPerson: Math.round((total / people.length) * 100) / 100,
    total: Math.round(total * 100) / 100,
    peopleCount: people.length,
    personTotals: Object.fromEntries(personTotals)
  }
}

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

/**
 * Validate bill data
 */
export const validateBillData = (
  total: string,
  peopleCount: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  const totalNum = parseFloat(total)
  const peopleNum = parseInt(peopleCount, 10)

  if (isNaN(totalNum) || totalNum <= 0) {
    errors.push('Total must be a positive number')
  }

  if (isNaN(peopleNum) || peopleNum <= 0) {
    errors.push('Number of people must be a positive integer')
  }

  if (peopleNum > 100) {
    errors.push('Maximum 100 people allowed')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Create a new person with generated initials and color
 */
export const createPerson = (name: string): Person => {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#85C1E9'
  ]

  return {
    id: generateId(),
    name: name.trim(),
    initials: generateInitials(name),
    color: colors[Math.floor(Math.random() * colors.length)]
  }
}
