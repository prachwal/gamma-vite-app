/**
 * @fileoverview Test utilities and render helpers
 * @since 1.0.0
 */

import React from 'react';
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import appSlice from '../store/appSlice';
import aiSlice from '../store/aiSlice';
import configSlice from '../store/configSlice';
import { ThemeProvider } from '../components/theme-provider';
import { MockBrowserRouter } from './MockBrowserRouter';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    preloadedState?: Partial<RootState>;
    wrapper?: React.ComponentType<{ children: ReactNode }>;
}

/**
 * Custom render function that wraps components with necessary providers
 * Uses a fresh test store for each test
 */
function customRender(
    ui: ReactElement,
    {
        preloadedState,
        wrapper,
        ...renderOptions
    }: ExtendedRenderOptions = {}
) {
    // Create a test store with preloaded state
    const testStore = configureStore({
        reducer: {
            app: appSlice,
            ai: aiSlice,
            config: configSlice,
        },
        preloadedState,
        // Disable serializable check for testing
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: false,
            }),
    });

    const TestWrapper = ({ children }: { children: ReactNode }) => {
        return (
            <Provider store={testStore}>
                <MockBrowserRouter>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </MockBrowserRouter>
            </Provider>
        );
    };

    return render(ui, { wrapper: wrapper || TestWrapper, ...renderOptions });
}

// Re-export specific testing utilities (avoiding export *)
export {
    screen,
    fireEvent,
    waitFor,
    within,
    getByRole,
    getByText,
    queryByText,
    findByText,
    act
} from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';

// Override render method with our custom render
export { customRender as render };
