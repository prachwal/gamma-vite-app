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

### 4. AI Provider Integration System

**Multi-provider AI integration** with secure key management:

- **7 AI Providers**: OpenAI, Anthropic, xAI, Mistral, DeepSeek, Groq, OpenRouter
- **Secure Storage**: API keys encrypted with base64 in localStorage (`gamma_ai_keys`)
- **Model Management**: Dynamic model fetching and caching per provider
- **Redux Integration**: Full state management with async thunks
- **Real-time Validation**: API key verification with provider endpoints
- **Generic Architecture**: Easy to extend with new providers

#### AI Provider Architecture:

```typescript
// Configuration driven approach in src/services/aiProviders.ts
export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: "openai",
    name: "OpenAI",
    baseUrl: "https://api.openai.com/v1",
    requiresApiKey: true,
    // ...
  },
];
```

#### AI Data Flow Pattern:

```typescript
// 1. Save API key (encrypted base64)
saveApiKey(provider, apiKey) → localStorage('gamma_ai_keys')

// 2. Verify key with real endpoint
dispatch(verifyAPIKey({provider, apiKey})) → API call → Redux state

// 3. Fetch models (cached 24h)
dispatch(fetchProviderModels(provider)) → localStorage('gamma_ai_models') + Redux

// 4. Enhanced service layer
EnhancedAIService.getModels() → cached data + custom descriptions
```

### 5. Component Organization Structure

**Modular component architecture** with dedicated folders:

```
src/components/
├── component-name/
│   ├── ComponentName.tsx         # Main component
│   ├── ComponentName.test.tsx    # Unit tests (required)
│   ├── ComponentName.stories.tsx # Storybook stories (required)
│   └── index.ts                  # Barrel export
```

### 6. Import/Export Conventions

Each folder has `index.ts` barrel exports:

```typescript
// Import from barrel, not direct files
import { useAppDispatch, useAppSelector } from "../hooks";
import { Header, Sidebar } from "../components";
import { AIPage } from "../pages";
```

## Development Workflows

### Quick Start

```bash
npm run dev    # http://localhost:5173
npm run build  # TypeScript check + Vite build
npm run lint   # ESLint with React hooks + TypeScript rules
```

### Advanced Build Management

```bash
# Build Manager (comprehensive build system)
./build-manager.sh --help        # Show all options
./build-manager.sh               # Full build with clean
./build-manager.sh --no-clean    # Quick build without cleanup
./build-manager.sh --test        # Run only tests
./build-manager.sh --docs        # Generate only documentation

# Log Management
./log-monitor.sh --help          # Log monitoring options
npm run logs:stats               # Build statistics
npm run logs:errors              # Recent errors
npm run logs:latest              # Latest build log
```

### Testing & Documentation

```bash
# Testing
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once (CI)
npm run test:ui       # Run with UI interface
npm run test:coverage # Generate coverage report
npm run test:reset    # Clear test cache

# Documentation
npm run docs          # Generate TSDoc documentation (0 warnings)
npm run docs:watch    # Generate in watch mode
npm run docs:serve    # Serve documentation locally

# Storybook
npm run storybook     # Start Storybook dev server
npm run build-storybook # Build static Storybook
```

### Adding New Components

1. Create folder in appropriate location (`components/`, `pages/`, `layouts/`)
2. **Required Files**:
   - `ComponentName.tsx` - Main component (presentation only)
   - `ComponentName.test.tsx` - Unit tests with 100% coverage
   - `ComponentName.stories.tsx` - Storybook documentation
   - `index.ts` - Barrel export with types
3. Export from parent folder's `index.ts`
4. Use typed Redux hooks: `useAppDispatch`, `useAppSelector`
5. Apply CSS custom properties: `var(--color-*, --space-*, --transition-*)`

### AI Provider Integration Guidelines

1. **Add Provider Configuration**:

   ```typescript
   // In src/services/aiProviders.ts
   newprovider: {
     name: 'New Provider',
     baseUrl: 'https://api.newprovider.com',
     requiresApiKey: true,
     keyFormat: 'sk-...',
     // ...
   }
   ```

2. **Implement Service Methods**:

   ```typescript
   // In src/services/aiService.ts
   validateAPIKey, getModels, storeAPIKey methods
   ```

3. **Add to Redux Store**:
   ```typescript
   // Add to aiSlice.ts async thunks
   ```

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
- AI types in `src/types/ai.ts`

## Testing Architecture

### Test Structure

```
src/
├── test/
│   ├── setup.ts              # Vitest setup with mocks
│   ├── testRender.tsx        # TestProviders component
│   ├── testUtils.tsx         # render function and utilities
│   ├── MockBrowserRouter.tsx # Router mock component
│   ├── mocks.ts              # Global mocks
│   └── utils.ts              # Exports for all test utilities
```

### Test Utilities

- **TestProviders**: Wraps components with Redux, Router, ThemeProvider
- **render()**: Custom render with provider support and AI state
- **userEvent**: Re-exported from @testing-library/user-event
- **Mocks**: ResizeObserver, matchMedia, localStorage, AI providers

### Test Guidelines

- Every component MUST have a `.test.tsx` file
- Use `render()` from `../../test/utils` for component testing
- Mock i18next in tests with translation objects
- Test user interactions with `userEvent.setup()`
- Test responsive behavior with `useResponsive` mock
- AI components: Mock API calls and localStorage
- **100% test coverage requirement** for all business logic

### VS Code Test Integration

Configured for optimal VS Code Test Explorer experience:

```json
// .vscode/settings.json
{
  "vitest.commandLine": "npx vitest --config=vitest.config.ts",
  "vitest.exclude": ["**/*.stories.{js,jsx,ts,tsx}"]
}
```

## Storybook Architecture

### Story Structure

```
src/components/component-name/ComponentName.stories.tsx
```

### Story Guidelines

- Every component MUST have a `.stories.tsx` file
- Use `@storybook/react-vite` for imports (not `@storybook/react`)
- Include `tags: ['autodocs']` for automatic documentation
- Create stories for different states/variants/responsive breakpoints
- Use controls for interactive props
- AI components: Include mock API responses

### Global Storybook Configuration

- **Redux Provider**: All stories wrapped with store including AI state
- **Theme Integration**: Automatic dark/light mode support
- **i18n Support**: Translation keys resolved in stories
- **Responsive Testing**: Built-in viewport controls

## Documentation System

### TSDoc Standards (Zero Warnings Configuration)

- **@fileoverview**: Module description at file start
- **@since**: Version tracking for all exports
- **@param**: Parameter descriptions with types
- **@returns**: Return value descriptions
- **@example**: Code usage examples
- **@component**: Mark React components

### Documentation Generation

- **TypeDoc**: Generates comprehensive API documentation
- **Zero warnings**: Optimized configuration with proper exports
- **AI Integration**: Documents all AI provider types and interfaces
- **Generated Location**: `docs/` folder (gitignored)
- **Live Server**: Available via `npm run docs:serve`

## Build System Architecture

### Build Manager (`build-manager.sh`)

**Professional build automation** with:

- **Environment Validation**: Node.js, npm, dependencies check
- **Smart Cleaning**: Selective cache and build folder cleanup
- **Testing Pipeline**: Vitest + coverage + ESLint integration
- **Multi-target Builds**: Main app + Storybook + documentation
- **Error Handling**: Intelligent retry and recovery
- **Logging System**: Structured logs with colors and timestamps
- **Performance Metrics**: Build times, file sizes, success rates

### Log Monitoring (`log-monitor.sh`)

- **Build Statistics**: Success/failure rates, performance trends
- **Error Analysis**: Recent errors with context and solutions
- **Live Monitoring**: Real-time log tailing with filters
- **Cleanup Management**: Automatic old log rotation

### Vite Configuration Patterns

**Manual Chunking Strategy** (90% bundle reduction achieved):

```typescript
// vite.config.ts - manualChunks configuration
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
  'antd-vendor': ['antd', '@ant-design/icons'],
  'ai-components': ['./src/components/ai-settings', './src/pages/*/'],
  'markdown-vendor': ['react-markdown', 'remark-gfm', 'rehype-highlight'],
}
```

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

### 4. AI Provider State Management

`AISettings.tsx` integration pattern:

```typescript
const { providers, apiKeys, models } = useAppSelector((state) => state.ai);
const dispatch = useAppDispatch();

// Validate API key
await dispatch(validateApiKey({ provider: "openai", apiKey }));

// Fetch models
await dispatch(fetchModels("openai"));
```

### 5. AI Service Layer Architecture

**EnhancedAIService** pattern for cached model data:

```typescript
// Uses getStoredApiKeys() for encrypted key retrieval
const storedKeys = getStoredApiKeys();
const keyEntry = storedKeys[provider.id];
const apiKey = atob(keyEntry.apiKey); // decrypt base64

// Implements 24-hour cache with localStorage fallback
if (needsModelRefresh(providerId)) {
  return await this.fetchModelsFromProvider(provider);
}
return getCachedModels(providerId);
```

## File Structure Logic

- `components/` - Pure presentation, organized in dedicated folders
- `hooks/` - Reusable stateful logic (responsive, Redux typed hooks)
- `layouts/` - Page structure components with routing
- `pages/` - Route components including AIPage (use layout as parent)
- `services/` - External integrations, API calls, AI providers, i18n setup
- `store/` - Redux slices (app, ai, config) and store configuration
- `styles/` - Global CSS with custom properties
- `types/` - Shared TypeScript interfaces including AI types
- `test/` - Test utilities and configuration
- `stories/` - Legacy Storybook components (being phased out)
- `utils/` - Pure utility functions

## Environment Configuration

### Environment Variables (.env)

```bash
# App Configuration
VITE_APP_NAME="Gamma Vite App"
VITE_APP_VERSION="1.0.0"
VITE_APP_DESCRIPTION="AI-powered responsive React application"

# AI Provider Defaults (optional)
VITE_OPENAI_API_URL="https://api.openai.com/v1"
VITE_ANTHROPIC_API_URL="https://api.anthropic.com"
# ... other providers
```

### Config Service Integration

```typescript
// Accessed via src/services/config.ts
export const getAppConfig = () => ({
  appName: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
  // ...
});
```

## Ant Design Best Practices

**Reference**: See [Ant Design Best Practices](.github/ant-design-best-practices.md) for comprehensive guidelines.

### Critical Implementation Rules

1. **App Component Wrapper**: Always wrap root with `<App>` component for message/notification context
2. **Message API**: Use `App.useApp()` hook instead of static imports to avoid theme warnings
3. **Spin Component**: Use nest pattern `<Spin tip="..."><content /></Spin>` or standalone without tip
4. **Theme Integration**: Use CSS custom properties `var(--color-*)` for all custom styling
5. **Modern Props**: Use `styles` instead of deprecated `*Style` props (e.g., `styles.body` not `bodyStyle`)

### Quick Fixes for Common Warnings

```tsx
// ❌ WRONG - Shows warnings
import { message, Spin } from "antd";
message.success("Done!");
<Spin tip="Loading..." />;

// ✅ CORRECT - No warnings
import { App, Spin } from "antd";
const { message } = App.useApp();
message.success("Done!");
<Spin tip="Loading...">
  <div style={{ minHeight: "100px" }} />
</Spin>;
```

### 5. Component Organization Structure

**Modular component architecture** with dedicated folders:

```
src/components/
├── component-name/
│   ├── ComponentName.tsx         # Main component
│   ├── ComponentName.test.tsx    # Unit tests (required)
│   ├── ComponentName.stories.tsx # Storybook stories (required)
│   └── index.ts                  # Barrel export
```

### 6. Import/Export Conventions

Each folder has `index.ts` barrel exports:

```typescript
// Import from barrel, not direct files
import { useAppDispatch, useAppSelector } from "../hooks";
import { Header, Sidebar } from "../components";
import { AIPage } from "../pages";
```

## Development Workflows

### Quick Start

```bash
npm run dev    # http://localhost:5173
npm run build  # TypeScript check + Vite build
npm run lint   # ESLint with React hooks + TypeScript rules
```

### Advanced Build Management

```bash
# Build Manager (comprehensive build system)
./build-manager.sh --help        # Show all options
./build-manager.sh               # Full build with clean
./build-manager.sh --no-clean    # Quick build without cleanup
./build-manager.sh --test        # Run only tests
./build-manager.sh --docs        # Generate only documentation

# Log Management
./log-monitor.sh --help          # Log monitoring options
npm run logs:stats               # Build statistics
npm run logs:errors              # Recent errors
npm run logs:latest              # Latest build log
```

### Testing & Documentation

```bash
# Testing
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once (CI)
npm run test:ui       # Run with UI interface
npm run test:coverage # Generate coverage report
npm run test:reset    # Clear test cache

# Documentation
npm run docs          # Generate TSDoc documentation (0 warnings)
npm run docs:watch    # Generate in watch mode
npm run docs:serve    # Serve documentation locally

# Storybook
npm run storybook     # Start Storybook dev server
npm run build-storybook # Build static Storybook
```

### Adding New Components

1. Create folder in appropriate location (`components/`, `pages/`, `layouts/`)
2. **Required Files**:
   - `ComponentName.tsx` - Main component (presentation only)
   - `ComponentName.test.tsx` - Unit tests with 100% coverage
   - `ComponentName.stories.tsx` - Storybook documentation
   - `index.ts` - Barrel export with types
3. Export from parent folder's `index.ts`
4. Use typed Redux hooks: `useAppDispatch`, `useAppSelector`
5. Apply CSS custom properties: `var(--color-*, --space-*, --transition-*)`

### AI Provider Integration Guidelines

1. **Add Provider Configuration**:

   ```typescript
   // In src/services/aiProviders.ts
   newprovider: {
     name: 'New Provider',
     baseUrl: 'https://api.newprovider.com',
     modelsEndpoint: '/models',
     headers: { 'Authorization': 'Bearer {apiKey}' }
   }
   ```

2. **Implement Service Methods**:

   ```typescript
   // In src/services/aiService.ts
   validateAPIKey, getModels, storeAPIKey methods
   ```

3. **Add to Redux Store**:
   ```typescript
   // Add to aiSlice.ts async thunks
   ```

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
- AI types in `src/types/ai.ts`

## Testing Architecture

### Test Structure

```
src/
├── test/
│   ├── setup.ts              # Vitest setup with mocks
│   ├── testRender.tsx        # TestProviders component
│   ├── testUtils.tsx         # render function and utilities
│   ├── MockBrowserRouter.tsx # Router mock component
│   ├── mocks.ts              # Global mocks
│   └── utils.ts              # Exports for all test utilities
```

### Test Utilities

- **TestProviders**: Wraps components with Redux, Router, ThemeProvider
- **render()**: Custom render with provider support and AI state
- **userEvent**: Re-exported from @testing-library/user-event
- **Mocks**: ResizeObserver, matchMedia, localStorage, AI providers

### Test Guidelines

- Every component MUST have a `.test.tsx` file
- Use `render()` from `../../test/utils` for component testing
- Mock i18next in tests with translation objects
- Test user interactions with `userEvent.setup()`
- Test responsive behavior with `useResponsive` mock
- AI components: Mock API calls and localStorage
- **100% test coverage requirement** for all business logic

### VS Code Test Integration

Configured for optimal VS Code Test Explorer experience:

```json
// .vscode/settings.json
{
  "vitest.commandLine": "npx vitest --config=vitest.config.ts",
  "vitest.exclude": ["**/*.stories.{js,jsx,ts,tsx}"]
}
```

## Storybook Architecture

### Story Structure

```
src/components/component-name/ComponentName.stories.tsx
```

### Story Guidelines

- Every component MUST have a `.stories.tsx` file
- Use `@storybook/react-vite` for imports (not `@storybook/react`)
- Include `tags: ['autodocs']` for automatic documentation
- Create stories for different states/variants/responsive breakpoints
- Use controls for interactive props
- AI components: Include mock API responses

### Global Storybook Configuration

- **Redux Provider**: All stories wrapped with store including AI state
- **Theme Integration**: Automatic dark/light mode support
- **i18n Support**: Translation keys resolved in stories
- **Responsive Testing**: Built-in viewport controls

## Documentation System

### TSDoc Standards (Zero Warnings Configuration)

- **@fileoverview**: Module description at file start
- **@since**: Version tracking for all exports
- **@param**: Parameter descriptions with types
- **@returns**: Return value descriptions
- **@example**: Code usage examples
- **@component**: Mark React components

### Documentation Generation

- **TypeDoc**: Generates comprehensive API documentation
- **Zero warnings**: Optimized configuration with proper exports
- **AI Integration**: Documents all AI provider types and interfaces
- **Generated Location**: `docs/` folder (gitignored)
- **Live Server**: Available via `npm run docs:serve`

## Build System Architecture

### Build Manager (`build-manager.sh`)

**Professional build automation** with:

- **Environment Validation**: Node.js, npm, dependencies check
- **Smart Cleaning**: Selective cache and build folder cleanup
- **Testing Pipeline**: Vitest + coverage + ESLint integration
- **Multi-target Builds**: Main app + Storybook + documentation
- **Error Handling**: Intelligent retry and recovery
- **Logging System**: Structured logs with colors and timestamps
- **Performance Metrics**: Build times, file sizes, success rates

### Log Monitoring (`log-monitor.sh`)

- **Build Statistics**: Success/failure rates, performance trends
- **Error Analysis**: Recent errors with context and solutions
- **Live Monitoring**: Real-time log tailing with filters
- **Cleanup Management**: Automatic old log rotation

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

### 4. AI Provider State Management

`AISettings.tsx` integration pattern:

```typescript
const { providers, apiKeys, models } = useAppSelector((state) => state.ai);
const dispatch = useAppDispatch();

// Validate API key
await dispatch(validateApiKey({ provider: "openai", apiKey }));

// Fetch models
await dispatch(fetchModels("openai"));
```

## File Structure Logic

- `components/` - Pure presentation, organized in dedicated folders
- `hooks/` - Reusable stateful logic (responsive, Redux typed hooks)
- `layouts/` - Page structure components with routing
- `pages/` - Route components including AIPage (use layout as parent)
- `services/` - External integrations, API calls, AI providers, i18n setup
- `store/` - Redux slices (app, ai, config) and store configuration
- `styles/` - Global CSS with custom properties
- `types/` - Shared TypeScript interfaces including AI types
- `test/` - Test utilities and configuration
- `stories/` - Legacy Storybook components (being phased out)
- `utils/` - Pure utility functions

## Environment Configuration

### Environment Variables (.env)

```bash
# App Configuration
VITE_APP_NAME="Gamma Vite App"
VITE_APP_VERSION="1.0.0"
VITE_APP_DESCRIPTION="AI-powered responsive React application"

# AI Provider Defaults (optional)
VITE_OPENAI_API_URL="https://api.openai.com/v1"
VITE_ANTHROPIC_API_URL="https://api.anthropic.com"
# ... other providers
```

### Config Service Integration

```typescript
// Accessed via src/services/config.ts
export const getAppConfig = () => ({
  appName: import.meta.env.VITE_APP_NAME,
  version: import.meta.env.VITE_APP_VERSION,
  // ...
});
```

## Ant Design Best Practices

**Reference**: See [Ant Design Best Practices](.github/ant-design-best-practices.md) for comprehensive guidelines.

### Critical Implementation Rules

1. **App Component Wrapper**: Always wrap root with `<App>` component for message/notification context
2. **Message API**: Use `App.useApp()` hook instead of static imports to avoid theme warnings
3. **Spin Component**: Use nest pattern `<Spin tip="..."><content /></Spin>` or standalone without tip
4. **Theme Integration**: Use CSS custom properties `var(--color-*)` for all custom styling
5. **Modern Props**: Use `styles` instead of deprecated `*Style` props (e.g., `styles.body` not `bodyStyle`)

### Quick Fixes for Common Warnings

```tsx
// ❌ WRONG - Shows warnings
import { message, Spin } from "antd";
message.success("Done!");
<Spin tip="Loading..." />;

// ✅ CORRECT - No warnings
import { App, Spin } from "antd";
const { message } = App.useApp();
message.success("Done!");
<Spin tip="Loading...">
  <div style={{ minHeight: "100px" }} />
</Spin>;
```

## Common Gotchas

1. **Ant Design Props**: Use `styles.body` not `bodyStyle` (deprecated)
2. **Mobile Overlay**: Required `role="button"`, `tabIndex`, `onKeyDown` for accessibility
3. **CSS Variables**: Always use `var(--*)` syntax, defined in `:root` and theme selectors
4. **Redux Hooks**: Import from `hooks/redux` not direct from react-redux
5. **i18n Loading**: Call `initializeI18n()` in App.tsx useEffect, handle async properly
6. **Test Files**: Use `.ts` for utilities, `.tsx` only for components (Fast Refresh rules)
7. **Storybook Imports**: Use `@storybook/react-vite` not `@storybook/react`
8. **ESLint Coverage**: `coverage/` folder excluded from linting
9. **AI API Keys**: Always encrypt before localStorage, validate format before storage
10. **Component Organization**: Each component must have its own folder with required files
11. **Build System**: Use `build-manager.sh` for production builds, not direct npm commands
12. **Documentation**: TypeDoc must generate zero warnings, export all referenced interfaces
13. **TypeScript Imports**: Use `verbatimModuleSyntax: true` - separate type imports required
14. **Vitest Configuration**: jsdom environment with comprehensive test setup required

## Performance Considerations

- **Code Splitting**: Dynamic imports for AI provider modules
- **Lazy Loading**: Route-based code splitting for pages
- **State Normalization**: Redux state structured for optimal access patterns
- **Memoization**: React.memo for expensive UI components
- **Bundle Analysis**: Built-in analysis in build system (90% reduction achieved)
- **Test Performance**: Parallel test execution with Vitest
- **Build Caching**: Intelligent cache management in build system

## Security Practices

- **API Key Encryption**: Base64 encoding for localStorage storage
- **Type Safety**: Strict TypeScript, no `any` types allowed
- **Input Validation**: All AI provider inputs validated
- **Error Boundaries**: Graceful error handling for AI operations
- **CSP Headers**: Content Security Policy ready configuration
- **Dependency Security**: Regular security audits via build system
