import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from '../src/store';
import { ThemeProvider } from '../src/components/ThemeProvider';

/**
 * Wrapper component that provides all necessary context providers for Storybook stories
 */
export const StorybookProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Provider store={store}>
        <BrowserRouter>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </BrowserRouter>
    </Provider>
);
