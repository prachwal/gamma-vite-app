/**
 * @fileoverview Test utilities for React components with Redux and theme providers
 * @since 1.0.0
 */

import { render as rtlRender, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeProvider';
import { store } from '../store';
import type { RootState } from '../store';

/**
 * Interface for custom render options extending RTL's RenderOptions
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Pre-loaded state for Redux store */
  preloadedState?: Partial<RootState>;
  /** Custom wrapper component */
  wrapper?: ({ children }: { children: ReactNode }) => ReactElement;
}

/**
 * Test wrapper component that provides all necessary providers
 * @param children - Child components to wrap
 * @returns JSX element with all providers
 */
function TestProviders({ children }: { readonly children: ReactNode }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

/**
 * Custom render function that wraps components with necessary providers
 * @param ui - Component to render
 * @param options - Render options including preloaded state
 * @returns RTL render result
 */
export function render(
  ui: ReactElement,
  {
    preloadedState,
    wrapper = TestProviders,
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const Wrapper = ({ children }: { readonly children: ReactNode }) => {
    if (preloadedState) {
      // If preloaded state is provided, create a new store
      const { configureStore } = require('@reduxjs/toolkit');
      const appReducer = require('../store/appSlice').default;
      
      const testStore = configureStore({
        reducer: {
          app: appReducer,
        },
        preloadedState,
      });

      return (
        <Provider store={testStore}>
          <BrowserRouter>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </BrowserRouter>
        </Provider>
      );
    }

    return wrapper({ children });
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Mock user event for testing user interactions
 */
export { userEvent } from '@testing-library/user-event';

/**
 * Re-export everything from testing library
 */
export * from '@testing-library/react';
