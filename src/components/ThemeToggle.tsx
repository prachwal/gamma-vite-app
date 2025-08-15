/**
 * @fileoverview Theme toggle component for switching between light and dark themes
 * 
 * This component provides a button that allows users to toggle between light and dark themes.
 * It integrates with Redux store to manage theme state and uses Ant Design components.
 * 
 * @since 1.0.0
 */

import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme } from '../store/appSlice';

/**
 * Theme toggle button component
 * 
 * Displays a button with theme-appropriate icon (sun for dark theme, moon for light theme)
 * that allows users to switch between light and dark themes. The component is fully
 * internationalized and accessible.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <ThemeToggle />
 * 
 * // Integrates automatically with Redux theme state
 * // No props required - state managed internally
 * ```
 * 
 * @returns A theme toggle button component
 * @since 1.0.0
 */
export const ThemeToggle: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.app.theme);

    /**
     * Handles theme toggle action
     * 
     * Dispatches Redux action to toggle between 'light' and 'dark' themes.
     * The theme change is persisted in localStorage via Redux middleware.
     * 
     * @returns void
     * @since 1.0.0
     */
    const handleToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <Tooltip title={t('theme.toggleTheme')}>
            <Button
                type="text"
                size="large"
                icon={theme === 'light' ? <MoonOutlined /> : <SunOutlined />}
                onClick={handleToggle}
                aria-label={t('theme.toggleTheme')}
                style={{
                    color: 'var(--color-text-primary)',
                }}
            />
        </Tooltip>
    );
};
