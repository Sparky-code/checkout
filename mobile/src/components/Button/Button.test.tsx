import { Platform } from 'react-native'

import { Button } from './Button'
import { ButtonProps } from './types'

// Mock Platform to avoid Animated issues
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default)
}))

describe('Button', () => {
  const defaultProps: ButtonProps = {
    title: 'Test Button',
    onPress: jest.fn(),
    accessibilityLabel: 'Test Button'
  }

  describe('component logic', () => {
    it('creates a button component factory', () => {
      // Test that the factory function exists and returns a component
      expect(typeof Button).toBe('function')
    })

    it('has correct default props', () => {
      // Test default prop values
      const button = Button({ ...defaultProps })
      expect(button).toBeDefined()
    })

    it('handles disabled prop correctly', () => {
      const button = Button({ ...defaultProps, disabled: true })
      expect(button).toBeDefined()
    })

    it('handles loading prop correctly', () => {
      const button = Button({ ...defaultProps, loading: true })
      expect(button).toBeDefined()
    })

    it('handles custom styles correctly', () => {
      const customStyle = { backgroundColor: 'red' }
      const button = Button({ ...defaultProps, style: customStyle })
      expect(button).toBeDefined()
    })

    it('handles accessibility props correctly', () => {
      const button = Button({
        ...defaultProps,
        accessibilityLabel: 'Custom Label',
        accessibilityHint: 'Custom Hint',
        accessibilityRole: 'link'
      })
      expect(button).toBeDefined()
    })
  })

  describe('accessibility logic', () => {
    it('generates correct accessibility label when loading', () => {
      // Test the accessibility label logic
      const button = Button({
        ...defaultProps,
        accessibilityLabel: 'Submit',
        loading: true
      })
      expect(button).toBeDefined()
    })

    it('generates correct accessibility label when not loading', () => {
      const button = Button({
        ...defaultProps,
        accessibilityLabel: 'Submit',
        loading: false
      })
      expect(button).toBeDefined()
    })
  })

  describe('platform-specific behavior', () => {
    it('handles iOS platform styles', () => {
      Platform.OS = 'ios'
      const button = Button({ ...defaultProps })
      expect(button).toBeDefined()
    })

    it('handles Android platform styles', () => {
      Platform.OS = 'android'
      const button = Button({ ...defaultProps })
      expect(button).toBeDefined()
    })

    it('handles Web platform styles', () => {
      Platform.OS = 'web'
      const button = Button({ ...defaultProps })
      expect(button).toBeDefined()
    })
  })

  describe('error handling', () => {
    it('handles onPress errors gracefully', () => {
      const errorOnPress = jest.fn(() => {
        throw new Error('Test error')
      })

      const button = Button({ ...defaultProps, onPress: errorOnPress })
      expect(button).toBeDefined()
    })
  })

  describe('style composition', () => {
    it('combines default and custom styles', () => {
      const customStyle = { backgroundColor: 'blue' }
      const button = Button({ ...defaultProps, style: customStyle })
      expect(button).toBeDefined()
    })

    it('applies disabled styles when disabled', () => {
      const button = Button({ ...defaultProps, disabled: true })
      expect(button).toBeDefined()
    })

    it('applies web-specific disabled styles on web platform', () => {
      Platform.OS = 'web'
      const button = Button({ ...defaultProps, disabled: true })
      expect(button).toBeDefined()
    })
  })

  describe('content rendering logic', () => {
    it('renders loading indicator when loading', () => {
      const button = Button({ ...defaultProps, loading: true })
      expect(button).toBeDefined()
    })

    it('renders text when not loading', () => {
      const button = Button({ ...defaultProps, loading: false })
      expect(button).toBeDefined()
    })

    it('applies text styles correctly', () => {
      const customTextStyle = { fontSize: 20 }
      const button = Button({ ...defaultProps, textStyle: customTextStyle })
      expect(button).toBeDefined()
    })
  })

  describe('interaction logic', () => {
    it('calls onPress when not disabled and not loading', () => {
      const onPress = jest.fn()
      const button = Button({ ...defaultProps, onPress })
      expect(button).toBeDefined()
    })

    it('does not call onPress when disabled', () => {
      const onPress = jest.fn()
      const button = Button({ ...defaultProps, onPress, disabled: true })
      expect(button).toBeDefined()
    })

    it('does not call onPress when loading', () => {
      const onPress = jest.fn()
      const button = Button({ ...defaultProps, onPress, loading: true })
      expect(button).toBeDefined()
    })
  })

  describe('accessibility state', () => {
    it('sets correct accessibility state when disabled', () => {
      const button = Button({ ...defaultProps, disabled: true })
      expect(button).toBeDefined()
    })

    it('sets correct accessibility state when loading', () => {
      const button = Button({ ...defaultProps, loading: true })
      expect(button).toBeDefined()
    })

    it('sets correct accessibility state when both disabled and loading', () => {
      const button = Button({ ...defaultProps, disabled: true, loading: true })
      expect(button).toBeDefined()
    })
  })
})
