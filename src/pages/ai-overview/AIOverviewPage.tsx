/**
 * @fileoverview AI overview page component
 * 
 * Main dashboard for AI section with quick access to features
 * 
 * @since 1.0.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Card,
    Row,
    Col,
    Typography,
    Button,
    Space,
    Statistic,
    Progress,
    Avatar,
    Tag
} from 'antd';
import {
    MessageOutlined,
    DatabaseOutlined,
    SettingOutlined,
    RobotOutlined,
    ApiOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import { useAppSelector } from '../../hooks/redux';

const { Title, Text, Paragraph } = Typography;

/**
 * AI overview page props interface
 */
export interface AIOverviewPageProps {
    className?: string;
}

/**
 * Feature card data
 */
const FEATURES = [
    {
        key: 'chat',
        title: 'AI Chat',
        description: 'Interactive chat interface with multiple AI models',
        icon: <MessageOutlined />,
        path: '/ai/chat',
        color: 'var(--color-primary)'
    },
    {
        key: 'models',
        title: 'Model Browser',
        description: 'Browse and compare AI models from different providers',
        icon: <DatabaseOutlined />,
        path: '/ai/models',
        color: 'var(--color-success)'
    },
    {
        key: 'providers',
        title: 'Provider Management',
        description: 'Manage API keys and provider configurations',
        icon: <SettingOutlined />,
        path: '/ai/providers',
        color: 'var(--color-warning)'
    }
];

/**
 * Get provider statistics
 */
const getProviderStats = (providers: unknown[], apiKeys: Partial<Record<string, boolean>>) => {
    const totalProviders = providers.length;
    const configuredProviders = Object.keys(apiKeys).filter(provider =>
        apiKeys[provider] === true
    ).length;

    return {
        total: totalProviders,
        configured: configuredProviders,
        percentage: totalProviders > 0 ? Math.round((configuredProviders / totalProviders) * 100) : 0
    };
};

/**
 * AI overview page component
 * Main dashboard for AI section with feature access and statistics
 * 
 * @component
 */
export const AIOverviewPage: React.FC<AIOverviewPageProps> = ({ className }) => {
    const navigate = useNavigate();
    const { providers, apiKeys, models } = useAppSelector(state => state.ai);

    const providerStats = getProviderStats(providers, apiKeys);
    const totalModels = Object.values(models).flat().length;

    return (
        <div className={className} style={{ padding: 0 }}>
            {/* Header */}
            <div style={{ marginBottom: 'var(--space-xl)' }}>
                <Space align="center" style={{ marginBottom: 'var(--space-md)' }}>
                    <Avatar
                        size={48}
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            fontSize: '24px'
                        }}
                    >
                        <RobotOutlined />
                    </Avatar>
                    <div>
                        <Title level={2} style={{ margin: 0 }}>
                            AI Dashboard
                        </Title>
                        <Text type="secondary">
                            Manage AI models, providers, and chat interactions
                        </Text>
                    </div>
                </Space>
            </div>

            {/* Statistics */}
            <Row gutter={[16, 16]} style={{ marginBottom: 'var(--space-xl)' }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Configured Providers"
                            value={providerStats.configured}
                            suffix={`/ ${providerStats.total}`}
                            prefix={<ApiOutlined />}
                        />
                        <Progress
                            percent={providerStats.percentage}
                            size="small"
                            style={{ marginTop: 8 }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Available Models"
                            value={totalModels}
                            prefix={<DatabaseOutlined />}
                        />
                        <Tag color="blue" style={{ marginTop: 8 }}>
                            Cached & Live
                        </Tag>
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="AI Status"
                            value="Ready"
                            prefix={<ThunderboltOutlined />}
                        />
                        <Tag color="green" style={{ marginTop: 8 }}>
                            All Systems Go
                        </Tag>
                    </Card>
                </Col>
            </Row>

            {/* Features */}
            <Title level={3} style={{ marginBottom: 'var(--space-lg)' }}>
                Features
            </Title>

            <Row gutter={[16, 16]}>
                {FEATURES.map(feature => (
                    <Col key={feature.key} xs={24} sm={12} lg={8}>
                        <Card
                            hoverable
                            style={{ height: '100%' }}
                            actions={[
                                <Button
                                    key="launch"
                                    type="primary"
                                    onClick={() => navigate(feature.path)}
                                    block
                                >
                                    Launch {feature.title}
                                </Button>
                            ]}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Space>
                                    <Avatar
                                        style={{ backgroundColor: feature.color }}
                                        size={40}
                                    >
                                        {feature.icon}
                                    </Avatar>
                                    <div>
                                        <Title level={4} style={{ margin: 0 }}>
                                            {feature.title}
                                        </Title>
                                    </div>
                                </Space>
                                <Paragraph
                                    style={{ margin: 0, color: 'var(--color-text-secondary)' }}
                                >
                                    {feature.description}
                                </Paragraph>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Quick Actions */}
            <Card
                title="Quick Actions"
                style={{ marginTop: 'var(--space-xl)' }}
            >
                <Space wrap>
                    <Button
                        icon={<MessageOutlined />}
                        onClick={() => navigate('/ai/chat')}
                    >
                        Start New Chat
                    </Button>
                    <Button
                        icon={<DatabaseOutlined />}
                        onClick={() => navigate('/ai/models')}
                    >
                        Browse Models
                    </Button>
                    <Button
                        icon={<SettingOutlined />}
                        onClick={() => navigate('/ai/providers')}
                    >
                        Configure Providers
                    </Button>
                </Space>
            </Card>
        </div>
    );
};
