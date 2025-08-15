/**
 * @fileoverview Settings page component
 */

import React from 'react';
import { Card, Typography, Space, Row, Col, Switch, Select } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { toggleTheme, setLanguage } from '../store/appSlice';
import type { Language } from '../types';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * Settings page component
 * Allows users to configure application preferences
 */
export const SettingsPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const dispatch = useAppDispatch();
    const { theme, language } = useAppSelector((state) => state.app);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    const handleLanguageChange = async (newLanguage: Language) => {
        dispatch(setLanguage(newLanguage));
        await i18n.changeLanguage(newLanguage);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Page Header */}
                <Card
                    styles={{
                        body: {
                            padding: 'var(--space-xl)',
                            textAlign: 'center',
                        },
                    }}
                    style={{
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-secondary)',
                    }}
                >
                    <Space direction="vertical" size="middle">
                        <SettingOutlined
                            style={{
                                fontSize: '48px',
                                color: 'var(--color-primary)',
                            }}
                        />
                        <Title level={1} style={{ color: 'var(--color-text-primary)' }}>
                            {t('pages.settings.title')}
                        </Title>
                    </Space>
                </Card>

                {/* Appearance Settings */}
                <Card
                    title={t('pages.settings.appearance')}
                    styles={{
                        body: {
                            padding: 'var(--space-xl)',
                        },
                    }}
                    style={{
                        background: 'var(--color-bg-secondary)',
                        border: '1px solid var(--color-border-secondary)',
                    }}
                >
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {/* Theme Setting */}
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space direction="vertical" size={0}>
                                    <Text strong style={{ color: 'var(--color-text-primary)' }}>
                                        {t('pages.settings.theme')}
                                    </Text>
                                    <Text style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                        {theme === 'dark' ? t('theme.dark') : t('theme.light')}
                                    </Text>
                                </Space>
                            </Col>
                            <Col>
                                <Switch
                                    checked={theme === 'dark'}
                                    onChange={handleThemeToggle}
                                    checkedChildren="🌙"
                                    unCheckedChildren="☀️"
                                />
                            </Col>
                        </Row>

                        {/* Language Setting */}
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Space direction="vertical" size={0}>
                                    <Text strong style={{ color: 'var(--color-text-primary)' }}>
                                        {t('pages.settings.language')}
                                    </Text>
                                    <Text style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
                                        {language === 'pl' ? t('language.polish') : t('language.english')}
                                    </Text>
                                </Space>
                            </Col>
                            <Col>
                                <Select
                                    value={language}
                                    onChange={handleLanguageChange}
                                    style={{ width: 120 }}
                                >
                                    <Option value="pl">🇵🇱 Polski</Option>
                                    <Option value="en">🇺🇸 English</Option>
                                </Select>
                            </Col>
                        </Row>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};
