import React from 'react';
import { Typography, Card } from 'antd';
import { AISettings } from '../components';

const { Title, Paragraph } = Typography;

/**
 * @fileoverview AI configuration page
 * @component AIPage
 * @since 1.0.0
 */
export const AIPage: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <Title level={2}>AI Configuration</Title>
                <Paragraph>
                    Configure API keys and models for various AI providers. Your API keys are stored
                    securely in your browser's local storage.
                </Paragraph>
            </div>

            <Card
                title="AI Provider Settings"
                styles={{
                    body: { padding: 'var(--space-lg)' }
                }}
            >
                <AISettings />
            </Card>
        </div>
    );
};

export default AIPage;