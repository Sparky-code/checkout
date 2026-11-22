# Implementation Strategies

## Component Patterns
1. **Container/Presenter Pattern**
   ```typescript
   // Container Component (ComponentName.container.tsx)
   import { ReactElement } from 'react'
   import { ComponentNamePresenter } from './ComponentName.presenter'
   import { useComponentName } from './useComponentName' // custom hook for logic
   
   export const ComponentNameContainer = (): ReactElement => {
     const { data, handlers } = useComponentName()
     return <ComponentNamePresenter data={data} handlers={handlers} />
   }
   
   // Presenter Component (ComponentName.presenter.tsx)
   import { ReactElement } from 'react'
   import { styles } from './ComponentName.styles'
   import type { ComponentNameProps } from './types'
   
   export const ComponentNamePresenter = ({ data, handlers }: ComponentNameProps): ReactElement => {
     return (
       // UI implementation
     )
   }
   ```

2. **Compound Components**
   - Use for complex, related components
   - Example: Form components with Form.Input, Form.Label, etc.
   - Share context between related components
   - Keep platform-specific logic in container components

3. **Render Props**
   - Use for sharing behavior between components
   - Keep render prop functions pure
   - Document expected props and return types
   - Handle platform differences in the render prop implementation

## State Management Patterns
1. **Local State**
   - Use useState for component-specific state
   - Use useReducer for complex state logic
   - Keep state as local as possible
   - Handle platform-specific state in custom hooks

2. **Global State**
   - Use Context for theme, auth, etc.
   - Create custom hooks for context consumers
   - Document context structure and usage
   - Implement platform-specific state handling in context providers

3. **Data Fetching**
   - Use custom hooks for data fetching
   - Implement proper loading and error states
   - Cache responses when appropriate
   - Handle platform-specific network requirements

## Styling Patterns
1. **Theme System**
   ```typescript
   // src/styles/theme.ts
   export const theme = {
     colors: {
       primary: '#007AFF',
       background: {
         light: '#FFFFFF',
         dark: '#000000'
       }
     },
     spacing: {
       small: 8,
       medium: 16,
       large: 24
     },
     typography: {
       body: {
         fontSize: 16,
         lineHeight: 24
       }
     }
   }
   ```

2. **Responsive Design**
   - Use flexbox for layouts
   - Implement proper safe areas across platforms
   - Test on different screen sizes
   - Use Platform.select for platform-specific layout adjustments

3. **Platform-Specific Styles**
   ```typescript
   const styles = StyleSheet.create({
     container: {
       // Common styles
       padding: theme.spacing.medium,
       // Platform-specific styles
       ...Platform.select({
         web: {
           cursor: 'pointer',
           userSelect: 'none',
           // Web-specific accessibility
           ':hover': {
             opacity: 0.8
           }
         },
         ios: {
           shadowColor: theme.colors.shadow,
           shadowOffset: { width: 0, height: 2 },
           shadowOpacity: 0.25,
         },
         android: {
           elevation: 5,
         },
       }),
     },
   });
   ```

## Error Handling
1. **Error Boundaries**
   - Implement at strategic points
   - Provide fallback UI
   - Log errors appropriately
   - Handle platform-specific error scenarios

2. **Form Validation**
   - Use consistent validation patterns
   - Provide clear error messages
   - Handle async validation
   - Support platform-specific input validation

## Testing Patterns
1. **Component Testing**
   ```typescript
   describe('ComponentName', () => {
     it('renders correctly on all platforms', () => {
       // Test common functionality
     });
     
     it('handles platform-specific features', () => {
       // Test platform-specific behavior
     });
   });
   ```

2. **Hook Testing**
   - Test state changes
   - Test side effects
   - Mock dependencies
   - Test platform-specific behavior

## Performance Patterns
1. **Memoization**
   - Use useMemo for expensive calculations
   - Use useCallback for function props
   - Use React.memo for pure components
   - Consider platform-specific performance optimizations

2. **List Optimization**
   - Use FlatList for long lists
   - Implement proper key props
   - Use windowing for large datasets
   - Optimize for platform-specific list rendering

## Navigation Patterns
1. **Route Structure**
   - Define routes in constants
   - Use type-safe navigation
   - Handle deep linking
   - Support platform-specific navigation patterns

2. **Screen Transitions**
   - Use consistent animations
   - Handle back navigation
   - Preserve screen state
   - Implement platform-specific transitions 