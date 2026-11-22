# Project Guidelines

## Code Style & Architecture
- Use TypeScript for all new code
- Follow React Native's platform-agnostic approach
- Use functional components with React hooks
- Maintain consistent file structure:
  ```
  src/
    components/     # Reusable UI components
      ComponentName/
        ComponentName.tsx
        ComponentName.styles.ts
        ComponentName.test.tsx
    screens/        # Screen components
    styles/         # Shared styles and theme definitions
    hooks/          # Custom hooks
    utils/          # Utility functions
    types/          # TypeScript type definitions
    constants/      # Constants and configuration
  ```

## Theming
- Follow the Theme System defined in strategies.md
- Use dark mode as default
- Define all colors, spacing, and typography in theme constants
- Support both light and dark modes
- Use semantic color names (e.g., 'primary', 'background') instead of literal colors

## Styling Strategy
- Keep component-specific styles in `.styles.ts` files co-located with components
- Store shared styles and theme definitions in `src/styles/`
- Use React Native's StyleSheet.create for all styles
- Use platform-agnostic styles when possible
- Use Platform.select only for:
  - Platform-specific visual differences (shadows, elevation)
  - Platform-specific behavior (cursor on web)
  - Platform-specific accessibility features
- Follow a consistent naming convention for style properties

## Component Guidelines
- Keep components small and focused
- Use proper TypeScript types for props
- Document complex components with JSDoc comments
- Follow a consistent component structure:
  ```typescript
  // imports
  // types
  // component
  // styles (in separate .styles.ts file)
  ```
- For complex components, use the Container/Presenter pattern (see strategies.md)

## State Management
- Use React's built-in state management when possible
- Follow state management patterns from strategies.md
- Use useState for component-specific state
- Use useReducer for complex state logic
- Use Context for global state (theme, auth, etc.)
- Document state management decisions
- Keep state as local as possible

## Testing Requirements
- Maintain minimum 80% test coverage for critical paths
- Follow testing patterns defined in strategies.md
- Write unit tests for utilities and hooks
- Write component tests for UI components
- Use React Native Testing Library
- Prioritize testing:
  1. Business logic
  2. User interactions
  3. Platform-specific features
- Include accessibility testing

## Performance Guidelines
- Use React.memo for expensive components
- Implement proper list virtualization
- Optimize images and assets
- Monitor bundle size
- Follow performance patterns from strategies.md

## Accessibility
- Use proper semantic elements
- Include proper accessibility labels
- Support screen readers
- Test with accessibility tools
- Ensure keyboard navigation works on web
- Support platform-specific accessibility features

## Documentation
- Document complex logic
- Keep README up to date
- Document API changes
- Include usage examples for components
- Document platform-specific considerations
- Cross-reference related guidelines and strategies 