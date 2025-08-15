/**
 * @fileoverview Language selector component for internationalization support
 * 
 * This component provides a dropdown interface for users to switch between
 * supported languages. It integrates with i18next for translation management
 * and Redux for state persistence.
 * 
 * @since 1.0.0
 */

import React from 'react';
import { Button, Dropdown } from 'antd';
import { GlobalOutlined, DownOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { setLanguage } from '../store/appSlice';
import type { Language } from '../types';
import type { MenuProps } from 'antd';

/**
 * Configuration for supported languages
 * 
 * @interface LanguageConfig
 * @property key - Language code (ISO 639-1)
 * @property label - Display name in the language
 * @property flag - Unicode flag emoji for visual representation
 */
interface LanguageConfig {
    key: Language;
    label: string;
    flag: string;
}

/**
 * Available languages configuration
 * 
 * Defines all supported languages with their display properties.
 * Each language includes an ISO 639-1 code, native display name,
 * and flag emoji for visual identification.
 * 
 * @since 1.0.0
 */
const languages: LanguageConfig[] = [
    { key: 'pl', label: 'Polski', flag: '🇵🇱' },
    { key: 'en', label: 'English', flag: '🇺🇸' },
];

/**
 * Language selector component
 * 
 * Provides a dropdown button that displays the current language flag
 * and allows users to switch between available languages. Changes
 * are synchronized between Redux store and i18next instance.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <LanguageSelector />
 * 
 * // Automatically syncs with Redux state and i18next
 * // Persists language preference to localStorage
 * ```
 * 
 * @returns A language selector dropdown component
 * @since 1.0.0
 */
export const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector((state) => state.app.language);

    /**
     * Handles language change selection
     * 
     * Updates both Redux store and i18next instance when user selects
     * a new language. The change is persisted via Redux middleware.
     * 
     * @param language - The selected language code
     * @returns Promise that resolves when language change is complete
     * @since 1.0.0
     */
    const handleLanguageChange = async (language: Language) => {
        dispatch(setLanguage(language));
        await i18n.changeLanguage(language);
    };

    /**
     * Gets the current language configuration object
     * 
     * @returns The language config for the currently selected language
     * @since 1.0.0
     */
    const currentLang = languages.find(lang => lang.key === currentLanguage);

    /**
     * Dropdown menu items configuration
     * 
     * Maps language configurations to Ant Design menu items with
     * flag icons and native language names.
     * 
     * @since 1.0.0
     */
    const menuItems: MenuProps['items'] = languages.map(lang => ({
        key: lang.key,
        label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
            </div>
        ),
        onClick: () => handleLanguageChange(lang.key),
    }));

    return (
        <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
        >
            <Button
                type="text"
                size="large"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-text-primary)',
                }}
                aria-label={t('language.changeLanguage')}
            >
                <GlobalOutlined />
                <span>{currentLang?.flag}</span>
                <DownOutlined style={{ fontSize: '10px' }} />
            </Button>
        </Dropdown>
    );
};
