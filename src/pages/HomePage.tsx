/**
 * @fileoverview Home page component
 */

import React from 'react';
import { Card, Typography, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

/**
 * Home page component
 * Main landing page of the application
 */
export const HomePage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
                        <HomeOutlined
                            style={{
                                fontSize: '48px',
                                color: 'var(--color-primary)',
                            }}
                        />
                        <Title level={1} style={{ color: 'var(--color-text-primary)' }}>
                            {t('pages.home.title')}
                        </Title>
                        <Title level={3} style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>
                            {t('pages.home.welcome')}
                        </Title>
                        <Paragraph style={{ fontSize: '16px', color: 'var(--color-text-secondary)' }}>
                            {t('pages.home.description')}
                        </Paragraph>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};
