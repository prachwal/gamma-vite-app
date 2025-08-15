/**
 * @fileoverview Theme toggle component
 */

import React from 'react';
import { Button, Tooltip } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme } from '../store/appSlice';

/**
 * Theme toggle button component
 * Allows users to switch between light and dark themes
 */
export const ThemeToggle: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const theme = useAppSelector((state) => state.app.theme);

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
