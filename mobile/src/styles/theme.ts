export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    text: {
      primary: '#000000',
      disabled: '#999999'
    },
    subtext: {
      primary: '#00000080'
    },
    shadow: '#000000'
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24
  },
  typography: {
    button: {
      fontSize: 16,
      fontWeight: '600'
    },
    body: {
      fontSize: 16,
      fontWeight: '400'
    }
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12
  }
} as const

// Type for the theme
export type Theme = typeof theme
