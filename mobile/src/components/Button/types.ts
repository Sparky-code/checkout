import { StyleProp, TextStyle, ViewStyle } from 'react-native'

export interface ButtonProps {
  /** Button title */
  title: string
  /** Function called when button is pressed */
  onPress: () => void
  /** Whether the button is disabled */
  disabled?: boolean
  /** Whether the button is in loading state */
  loading?: boolean
  /** Custom styles for the button container */
  style?: StyleProp<ViewStyle>
  /** Custom styles for the button text */
  textStyle?: StyleProp<TextStyle>
  /** Accessibility label for the button */
  accessibilityLabel: string
  /** Accessibility hint for the button */
  accessibilityHint?: string
  /** Accessibility role for the button */
  accessibilityRole?: 'button' | 'link' | 'none'
  /** Test ID for testing */
  testID?: string
}
