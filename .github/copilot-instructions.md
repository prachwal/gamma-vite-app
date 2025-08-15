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

### Adding New Components

1. Create in appropriate folder (`components/`, `pages/`, `layouts/`)
2. Export from folder's `index.ts`
3. Use typed Redux hooks: `useAppDispatch`, `useAppSelector`
4. Apply CSS custom properties: `var(--color-*, --space-*, --transition-*)`

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

## Common Gotchas

1. **Ant Design Props**: Use `styles.body` not `bodyStyle` (deprecated)
2. **Mobile Overlay**: Required `role="button"`, `tabIndex`, `onKeyDown` for accessibility
3. **CSS Variables**: Always use `var(--*)` syntax, defined in `:root` and theme selectors
4. **Redux Hooks**: Import from `hooks/redux` not direct from react-redux
5. **i18n Loading**: Call `initializeI18n()` in App.tsx useEffect, handle async properly
