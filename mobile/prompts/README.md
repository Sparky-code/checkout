# Project Prompts

This directory contains guidelines and strategies that should be followed throughout the project. These files serve as a reference for maintaining consistency and best practices.

## Files

- `guidelines.md`: Defines WHAT to do (core principles and high-level guidelines)
- `strategies.md`: Defines HOW to do it (specific implementation patterns and strategies)

## Document Relationships

### Key Cross-References
- **Theming**
  - Guidelines: [Theming](#theming) → Strategies: [Theme System](#theme-system)
  - Defines theme structure and usage patterns

- **Testing**
  - Guidelines: [Testing Requirements](#testing-requirements) → Strategies: [Testing Patterns](#testing-patterns)
  - Specifies coverage requirements and testing priorities

- **State Management**
  - Guidelines: [State Management](#state-management) → Strategies: [State Management Patterns](#state-management-patterns)
  - Details implementation patterns for different state types

- **Component Structure**
  - Guidelines: [Component Guidelines](#component-guidelines) → Strategies: [Container/Presenter Pattern](#containerpresenter-pattern)
  - Provides concrete examples of component organization

- **Styling**
  - Guidelines: [Styling Strategy](#styling-strategy) → Strategies: [Styling Patterns](#styling-patterns)
  - Shows how to implement platform-agnostic styles

## How to Use

1. **Reference in Development**
   - Review relevant sections before starting new features
   - Use as a checklist for code reviews
   - Reference when making architectural decisions
   - Follow cross-references between guidelines and strategies

2. **Maintenance**
   - Update guidelines as the project evolves
   - Add new patterns as they prove successful
   - Document decisions and their rationale
   - Keep cross-references up to date

3. **Integration with AI**
   - Share these guidelines with AI assistants
   - Reference specific patterns when requesting implementations
   - Use as a basis for code review suggestions
   - Include relevant cross-references in requests

## Example Usage with AI

When working with AI assistants, you can reference these guidelines like this:

```
Please implement a new component following our guidelines:
- Use the Container/Presenter pattern from strategies.md
- Follow the styling strategy from guidelines.md
- Implement proper TypeScript types
- Ensure platform-agnostic implementation
- Follow testing requirements (80% coverage)
```

## Contributing

When adding new guidelines or strategies:
1. Update the relevant markdown file
2. Provide clear examples
3. Explain the rationale
4. Update this README if necessary
5. Add appropriate cross-references
6. Ensure consistency with existing guidelines

## Theming
- Follow the Theme System defined in strategies.md
- Use dark mode as default
- Define all colors, spacing, and typography in theme constants

## Style Organization
- Keep component-specific styles in `.styles.ts` files co-located with components
- Store shared styles and theme definitions in `src/styles/`
- Use Platform.select only for:
  - Platform-specific visual differences (shadows, elevation)
  - Platform-specific behavior (cursor on web)
  - Platform-specific accessibility features

## Testing Requirements
- Maintain minimum 80% test coverage for critical paths
- Follow testing patterns defined in strategies.md
- Prioritize testing:
  1. Business logic
  2. User interactions
  3. Platform-specific features 