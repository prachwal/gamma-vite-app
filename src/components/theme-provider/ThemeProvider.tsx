/**
 *import { useAppSelector } from "../../hooks/redux";@fileoverview Theme provider component
 */

import React, { useEffect } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { useAppSelector } from "../../hooks/redux";
import type { Theme } from "../../types";

/**
 * Props for ThemeProvider component
 */
export interface ThemeProviderProps {
    children: React.ReactNode;
}

/**
 * Apply theme to document root
 */
const applyThemeToDocument = (theme: Theme): void => {
    document.documentElement.setAttribute('data-theme', theme);
};

/**
 * Get Ant Design theme configuration
 */
const getAntThemeConfig = (theme: Theme) => {
    return {
        algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
            colorBgContainer: theme === 'dark' ? '#1f1f1f' : '#ffffff',
            colorBgElevated: theme === 'dark' ? '#262626' : '#ffffff',
            colorBgLayout: theme === 'dark' ? '#141414' : '#f5f5f5',
        },
        components: {
            Layout: {
                siderBg: theme === 'dark' ? '#1f1f1f' : '#fafafa',
                headerBg: theme === 'dark' ? '#141414' : '#ffffff',
            },
            Menu: {
                itemBg: 'transparent',
                itemSelectedBg: theme === 'dark' ? '#1890ff20' : '#e6f7ff',
                itemHoverBg: theme === 'dark' ? '#ffffff10' : '#f5f5f5',
            },
            Card: {
                colorBgContainer: theme === 'dark' ? '#1f1f1f' : '#ffffff',
            },
        },
    };
};

/**
 * Theme provider component
 * Manages theme state and applies it to Ant Design and CSS variables
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const theme = useAppSelector((state) => state.app.theme);

    useEffect(() => {
        applyThemeToDocument(theme);
    }, [theme]);

    return (
        <ConfigProvider theme={getAntThemeConfig(theme)}>
            {children}
        </ConfigProvider>
    );
};
