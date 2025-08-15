/**
 * @fileoverview About page component
 */

import React from 'react';
import { Card, Typography, Space, List } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

/**
 * About page component
 * Displays information about the application
 */
export const AboutPage: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        'React 19 + TypeScript',
        'Ant Design UI Framework',
        'React Router for Navigation',
        'Redux Toolkit for State Management',
        'i18next for Internationalization',
        'Responsive Design',
        'Dark/Light Theme Support',
    ];

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
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <InfoCircleOutlined
                            style={{
                                fontSize: '48px',
                                color: 'var(--color-primary)',
                            }}
                        />
                        <Title level={1} style={{ color: 'var(--color-text-primary)', textAlign: 'center', width: '100%' }}>
                            {t('pages.about.title')}
                        </Title>
                        <Paragraph style={{ fontSize: '16px', color: 'var(--color-text-secondary)', textAlign: 'center', width: '100%' }}>
                            {t('pages.about.description')}
                        </Paragraph>
                    </Space>
                </Card>

                <Card
                    title="Features"
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
                    <List
                        dataSource={features}
                        renderItem={(feature) => (
                            <List.Item>
                                <Space>
                                    <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
                                    <span style={{ color: 'var(--color-text-primary)' }}>{feature}</span>
                                </Space>
                            </List.Item>
                        )}
                    />
                </Card>
            </Space>
        </div>
    );
};
