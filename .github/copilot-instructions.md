# Copilot Instructions - Gamma Vite App

## Architecture Overview

This is a **responsive React 19 + TypeScript** application with strict **separation of concerns**:

- **Components** (`src/components/`) contain ONLY presentation logic
- **Business logic** lives in `src/services/`, `src/hooks/`, `src/store/`
- **Global state** managed through Redux Toolkit with typed hooks

## Key Patterns

### 1. Responsive Layout System

The app uses a **device-driven layout** with automatic sidebar behavior:

```typescript
// BREAKPOINTS constant in src/hooks/useResponsive.ts
mobile: 768px    // Sidebar hidden, overlay mode
tablet: 1024px   // Sidebar collapsed (icons only)
desktop: 1200px  // Sidebar expanded (full width)
```

**Critical**: MainLayout.tsx automatically dispatches `setSidebarCollapsed()` based on `deviceType` changes.

### 2. Theme System Architecture

**Dual-layer theming** combining CSS custom properties + Ant Design:

- CSS vars defined in `:root` and `[data-theme='dark']` selectors
- `ThemeProvider.tsx` synchronizes Redux state → `document.documentElement.setAttribute('data-theme')` → Ant Design `ConfigProvider`
- All components use `var(--color-*)` for consistency

### 3. Internationalization Flow

**HTTP-based i18n** with Redux integration:

1. Files: `public/locales/{lng}/common.json`
2. `initializeI18n()` in App.tsx startup
3. Language changes: Redux dispatch → i18n.changeLanguage() → localStorage sync

### 4. Import/Export Conventions

Each folder has `index.ts` barrel exports:

```typescript
// Import from barrel, not direct files
import { useAppDispatch, useAppSelector } from "../hooks";
import { Header, Sidebar } from "../components";
```

## Development Workflows

### Quick Start

```bash
npm run dev    # http://localhost:5173
npm run build  # TypeScript check + Vite build
npm run lint   # ESLint with React hooks + TypeScript rules
```

### Testing & Documentation

```bash
# Testing
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once (CI)
npm run test:ui       # Run with UI interface
npm run test:coverage # Generate coverage report

# Documentation
npm run docs          # Generate TSDoc documentation
npm run docs:watch    # Generate in watch mode
npm run docs:serve    # Serve documentation locally

# Storybook
npm run storybook     # Start Storybook dev server
npm run build-storybook # Build static Storybook
```

### Adding New Components

1. Create in appropriate folder (`components/`, `pages/`, `layouts/`)
2. Export from folder's `index.ts`
3. Use typed Redux hooks: `useAppDispatch`, `useAppSelector`
4. Apply CSS custom properties: `var(--color-*, --space-*, --transition-*)`
5. **REQUIRED**: Create corresponding `.test.tsx` and `.stories.ts` files

### Responsive Component Guidelines

- Use `useResponsive()` hook for device detection
- Mobile-first: `isMobile` conditions for hamburger menu, overlay behavior
- Reference `MainLayout.tsx` for responsive patterns

### Theme Integration

- Components: Use CSS custom properties exclusively
- New themes: Add to `:root` and `[data-theme='']` selectors in `globals.css`
- Ant Design customization: Modify `getAntThemeConfig()` in `ThemeProvider.tsx`

## TypeScript Patterns

### Import Style (Important)

Uses `verbatimModuleSyntax: true`:

```typescript
// Correct - separate type imports
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Wrong - mixed imports fail compilation
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
```

### State Management Types

- All Redux state is typed via `RootState` and `AppDispatch`
- Component props interfaces always exported
- Global types in `src/types/index.ts`

## Testing Architecture

### Test Structure

```
src/
├── test/
│   ├── setup.ts          # Vitest setup with mocks
│   ├── testRender.tsx    # TestProviders component
│   ├── testUtils.ts      # render function and utilities
│   └── utils.ts          # Exports for all test utilities
```

### Test Utilities

- **TestProviders**: Wraps components with Redux, Router, ThemeProvider
- **render()**: Custom render with provider support
- **userEvent**: Re-exported from @testing-library/user-event
- Mocks: ResizeObserver, matchMedia, localStorage

### Test Guidelines

- Every component MUST have a `.test.tsx` file
- Use `render()` from `../test/utils` for component testing
- Mock i18next in tests with translation objects
- Test user interactions with `userEvent.setup()`
- Test responsive behavior with `useResponsive` mock

## Storybook Architecture

### Story Structure

```
src/stories/ComponentName.stories.ts
```

### Story Guidelines

- Every component MUST have a `.stories.ts` file
- Use `@storybook/react-vite` for imports
- Include `tags: ['autodocs']` for automatic documentation
- Create stories for different states/variants
- Use controls for interactive props

## Documentation System

### TSDoc Standards

- **@fileoverview**: Module description at file start
- **@since**: Version tracking for all exports
- **@param**: Parameter descriptions with types
- **@returns**: Return value descriptions
- **@example**: Code usage examples
- **@component**: Mark React components

### Documentation Generation

- Uses TypeDoc with TSDoc comments
- Generates to `docs/` folder (gitignored)
- Comprehensive API documentation with examples
- Type information automatically included

## Critical Integration Points

### 1. Layout Responsiveness

`MainLayout.tsx` orchestrates responsive behavior:

- Listens to `useResponsive()` deviceType changes
- Auto-dispatches sidebar state to Redux
- Renders mobile overlay for sidebar dismissal

### 2. Theme + Redux + CSS Sync

Three-way binding in `ThemeProvider.tsx`:

- Redux state → `data-theme` attribute → CSS custom properties
- Ant Design ConfigProvider gets theme from same Redux state
- localStorage persistence handled in Redux reducers

### 3. i18n + Redux Language Sync

`LanguageSelector.tsx` pattern:

```typescript
const handleLanguageChange = async (language: Language) => {
  dispatch(setLanguage(language)); // Redux state
  await i18n.changeLanguage(language); // i18next instance
};
```

## File Structure Logic

- `components/` - Pure presentation, no business logic
- `hooks/` - Reusable stateful logic (responsive, Redux typed hooks)
- `layouts/` - Page structure components with routing
- `pages/` - Route components (use layout as parent)
- `services/` - External integrations, API calls, i18n setup
- `store/` - Redux slices and store configuration
- `styles/` - Global CSS with custom properties
- `types/` - Shared TypeScript interfaces
- `test/` - Test utilities and configuration
- `stories/` - Storybook component stories

## Common Gotchas

1. **Ant Design Props**: Use `styles.body` not `bodyStyle` (deprecated)
2. **Mobile Overlay**: Required `role="button"`, `tabIndex`, `onKeyDown` for accessibility
3. **CSS Variables**: Always use `var(--*)` syntax, defined in `:root` and theme selectors
4. **Redux Hooks**: Import from `hooks/redux` not direct from react-redux
5. **i18n Loading**: Call `initializeI18n()` in App.tsx useEffect, handle async properly
6. **Test Files**: Use `.ts` for utilities, `.tsx` only for components (Fast Refresh rules)
7. **Storybook Imports**: Use `@storybook/react-vite` not `@storybook/react`
8. **ESLint Coverage**: `coverage/` folder excluded from linting
