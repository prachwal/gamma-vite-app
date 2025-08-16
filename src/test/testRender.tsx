/**
 * @fileoverview Test wrapper component for React testing
 * @since 1.0.0
 */

import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeProvider';
import { store } from '../store';

export function TestProviders({ children }: { readonly children: ReactNode }) {
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
