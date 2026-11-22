import { Item, Person } from '../../types/checkout'

import {
  calculateAdvancedSplit,
  calculateBasicSplit,
  createPerson,
  formatCurrency,
  generateId,
  generateInitials,
  validateBillData
} from '../checkoutUtils'

describe('checkoutUtils', () => {
  describe('generateInitials', () => {
    it('generates initials from single word', () => {
      expect(generateInitials('John')).toBe('JN')
      expect(generateInitials('A')).toBe('A')
    })

    it('generates initials from multiple words', () => {
      expect(generateInitials('John Doe')).toBe('JD')
      expect(generateInitials('Mary Jane Smith')).toBe('MJ')
    })

    it('handles whitespace correctly', () => {
      expect(generateInitials('  John  Doe  ')).toBe('JD')
    })
  })

  describe('calculateBasicSplit', () => {
    it('calculates equal split correctly', () => {
      const result = calculateBasicSplit(100, 4)
      expect(result.perPerson).toBe(25)
      expect(result.total).toBe(100)
      expect(result.peopleCount).toBe(4)
      expect(result.remainder).toBe(0)
    })

    it('handles decimal amounts', () => {
      const result = calculateBasicSplit(100.5, 3)
      expect(result.perPerson).toBe(33.5)
      expect(result.total).toBe(100.5)
      expect(result.peopleCount).toBe(3)
      expect(result.remainder).toBe(0)
    })

    it('handles remainder correctly', () => {
      const result = calculateBasicSplit(100, 3)
      expect(result.perPerson).toBe(33.33)
      expect(result.total).toBe(100)
      expect(result.peopleCount).toBe(3)
      expect(result.remainder).toBe(0)
    })

    it('returns zero for invalid inputs', () => {
      const result = calculateBasicSplit(0, 5)
      expect(result.perPerson).toBe(0)
      expect(result.total).toBe(0)
      expect(result.peopleCount).toBe(0)
    })
  })

  describe('calculateAdvancedSplit', () => {
    const mockPeople: Person[] = [
      { id: '1', name: 'John', initials: 'J', color: '#FF6B6B' },
      { id: '2', name: 'Jane', initials: 'J', color: '#4ECDC4' }
    ]

    const mockItems: Item[] = [
      { id: '1', name: 'Pizza', price: 20, count: 1, assignedUsers: ['1'] },
      { id: '2', name: 'Drinks', price: 10, count: 2, assignedUsers: ['1', '2'] }
    ]

    it('calculates split with assigned items', () => {
      const result = calculateAdvancedSplit(mockItems, mockPeople)
      expect(result.total).toBe(40) // 20 + (10 * 2)
      expect(result.peopleCount).toBe(2)
      expect(result.personTotals).toEqual({
        '1': 30, // 20 (pizza) + 10 (half of drinks)
        '2': 10 // 10 (half of drinks)
      })
    })

    it('splits unassigned items equally', () => {
      const items: Item[] = [{ id: '1', name: 'Pizza', price: 30, count: 1 }]
      const result = calculateAdvancedSplit(items, mockPeople)
      expect(result.total).toBe(30)
      expect(result.personTotals).toEqual({
        '1': 15,
        '2': 15
      })
    })

    it('handles empty arrays', () => {
      const result = calculateAdvancedSplit([], mockPeople)
      expect(result.perPerson).toBe(0)
      expect(result.total).toBe(0)
      expect(result.peopleCount).toBe(0)
    })
  })

  describe('formatCurrency', () => {
    it('formats currency correctly', () => {
      expect(formatCurrency(10)).toBe('$10.00')
      expect(formatCurrency(10.5)).toBe('$10.50')
      expect(formatCurrency(10.55)).toBe('$10.55')
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('validateBillData', () => {
    it('validates correct data', () => {
      const result = validateBillData('100', '4')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('detects invalid total', () => {
      const result = validateBillData('0', '4')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Total must be a positive number')
    })

    it('detects invalid people count', () => {
      const result = validateBillData('100', '0')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Number of people must be a positive integer')
    })

    it('detects too many people', () => {
      const result = validateBillData('100', '101')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Maximum 100 people allowed')
    })

    it('detects multiple errors', () => {
      const result = validateBillData('-10', '0')
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
      expect(typeof id1).toBe('string')
      expect(id1.length).toBeGreaterThan(0)
    })
  })

  describe('createPerson', () => {
    it('creates person with correct properties', () => {
      const person = createPerson('John Doe')
      expect(person.name).toBe('John Doe')
      expect(person.initials).toBe('JD')
      expect(person.color).toMatch(/^#[0-9A-F]{6}$/i)
      expect(person.id).toBeDefined()
    })

    it('trims whitespace from name', () => {
      const person = createPerson('  John Doe  ')
      expect(person.name).toBe('John Doe')
    })
  })
})
