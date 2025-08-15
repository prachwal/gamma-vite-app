/**
 * @fileoverview Language selector component
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
 * Available languages configuration
 */
const languages: { key: Language; label: string; flag: string }[] = [
    { key: 'pl', label: 'Polski', flag: '🇵🇱' },
    { key: 'en', label: 'English', flag: '🇺🇸' },
];

/**
 * Language selector component
 * Allows users to switch between available languages
 */
export const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector((state) => state.app.language);

    const handleLanguageChange = async (language: Language) => {
        dispatch(setLanguage(language));
        await i18n.changeLanguage(language);
    };

    const currentLang = languages.find(lang => lang.key === currentLanguage);

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
