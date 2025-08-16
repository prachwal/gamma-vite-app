/**
 * @fileoverview AI Settings component
 * 
 * Component for managing AI provider configurations, API keys, and model selections.
 * 
 * @since 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { Card, Form, Input, Button, Select, Alert, Space, Typography, Divider, Spin, List, Tag, Popconfirm, Modal, Descriptions, App } from 'antd';
import { KeyOutlined, CheckCircleOutlined, ExclamationCircleOutlined, DeleteOutlined, ReloadOutlined, ClearOutlined, EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { verifyAPIKey, fetchProviderModels, setSelectedProvider, setSelectedModel, removeAPIKey, loadStoredAIData, clearErrors } from '../../store/aiSlice';
import { clearAllAIData } from '../../services/aiService';
import type { AIProvider } from '../../types/ai';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * AI Settings component properties
 */
export interface AISettingsProps {
    /** CSS class name */
    className?: string;
}

/**
 * AI Settings component
 * 
 * Provides interface for:
 * - Adding and verifying API keys
 * - Selecting AI providers and models
 * - Managing stored configurations
 * 
 * @param props Component properties
 * @returns AI Settings component
 */
export const AISettings: React.FC<AISettingsProps> = ({ className }) => {
    const dispatch = useAppDispatch();
    const { message } = App.useApp();
    const aiState = useAppSelector(state => state.ai);

    const [testingProvider, setTestingProvider] = useState<AIProvider | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [selectedProviderDetails, setSelectedProviderDetails] = useState<AIProvider | null>(null);

    // Load stored data only once on component mount
    useEffect(() => {
        if (!isInitialized) {
            dispatch(loadStoredAIData());
            setIsInitialized(true);
        }
    }, [dispatch, isInitialized]);

    // Handle case where AI state doesn't exist (e.g., in tests)
    if (!aiState) {
        return <div className={className}>AI settings loading...</div>;
    }

    const { providers, models, apiKeys, selectedProvider, selectedModel, loading, errors } = aiState;

    const handleVerifyKey = async (provider: AIProvider, apiKey: string) => {
        if (!apiKey.trim()) {
            message.warning('Please enter an API key');
            return;
        }

        setTestingProvider(provider);
        try {
            const result = await dispatch(verifyAPIKey({ provider, apiKey }));

            if (result.payload && (result.payload as { isValid: boolean }).isValid) {
                message.success(`${providers.find(p => p.id === provider)?.name} API key verified successfully!`);
                // Automatically fetch models after successful verification
                dispatch(fetchProviderModels(provider));
            } else {
                // Show detailed error from Redux state
                const errorMessage = errors.keyVerification || 'Unknown verification error';
                message.error({
                    content: (
                        <div>
                            <div><strong>Failed to verify {providers.find(p => p.id === provider)?.name} API key</strong></div>
                            <div style={{ marginTop: 8, fontSize: '12px', opacity: 0.8 }}>
                                {errorMessage}
                            </div>
                        </div>
                    ),
                    duration: 8,
                });
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            message.error({
                content: (
                    <div>
                        <div><strong>Error verifying API key</strong></div>
                        <div style={{ marginTop: 8, fontSize: '12px', opacity: 0.8 }}>
                            {errorMessage}
                        </div>
                    </div>
                ),
                duration: 8,
            });
        } finally {
            setTestingProvider(null);
        }
    };

    const handleRemoveKey = (provider: AIProvider) => {
        const providerName = providers.find(p => p.id === provider)?.name || provider;
        dispatch(removeAPIKey(provider));
        message.success(`${providerName} API key removed successfully`);
    };

    const handleProviderChange = (provider: AIProvider) => {
        dispatch(setSelectedProvider(provider));

        // Fetch models if we have a verified key but no models yet
        if (apiKeys[provider] && (!models[provider] || models[provider].length === 0)) {
            dispatch(fetchProviderModels(provider));
        }
    };

    const handleModelChange = (modelId: string) => {
        dispatch(setSelectedModel(modelId));
    };

    const handleRefreshModels = () => {
        if (selectedProvider) {
            dispatch(fetchProviderModels(selectedProvider));
        }
    };

    const handleClearAllData = () => {
        clearAllAIData();
        // Reload the data to refresh the UI
        dispatch(loadStoredAIData());
        message.success('All AI data cleared successfully');
    };

    const getProviderStatus = (provider: AIProvider) => {
        const hasKey = !!apiKeys[provider];
        const isVerified = apiKeys[provider];

        if (!hasKey) return { status: 'none', text: 'No key', color: 'default', icon: <KeyOutlined /> };
        if (isVerified) return { status: 'verified', text: 'Verified', color: 'success', icon: <CheckCircleOutlined /> };
        return { status: 'invalid', text: 'Invalid', color: 'error', icon: <ExclamationCircleOutlined /> };
    };

    return (
        <div className={className}>
            <Title level={3}>
                <KeyOutlined /> AI Settings
            </Title>

            {errors.keyVerification && (
                <Alert
                    message="Key Verification Error"
                    description={errors.keyVerification}
                    type="error"
                    closable
                    onClose={() => dispatch(clearErrors())}
                    style={{ marginBottom: 16 }}
                />
            )}

            {errors.modelFetching && (
                <Alert
                    message="Model Fetching Error"
                    description={errors.modelFetching}
                    type="error"
                    closable
                    onClose={() => dispatch(clearErrors())}
                    style={{ marginBottom: 16 }}
                />
            )}

            <Card title="API Key Management">
                <List
                    dataSource={providers}
                    renderItem={(provider) => {
                        const status = getProviderStatus(provider.id);

                        return (
                            <List.Item
                                key={provider.id}
                                actions={[
                                    <Button
                                        key={`details_${provider.id}`}
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => setSelectedProviderDetails(provider.id)}
                                        title="View provider details"
                                    />,
                                    <Form
                                        key={`form_${provider.id}`}
                                        layout="inline"
                                        onFinish={(values) => handleVerifyKey(provider.id, values[`key_${provider.id}`])}
                                    >
                                        <Form.Item
                                            name={`key_${provider.id}`}
                                            rules={[
                                                { required: true, message: 'API key is required' },
                                                {
                                                    pattern: provider.keyFormat ? new RegExp(provider.keyFormat.replace('...', '.*')) : undefined,
                                                    message: `Key should match format: ${provider.keyFormat}`
                                                }
                                            ]}
                                        >
                                            <Input.Password
                                                placeholder={`Enter ${provider.name} API key`}
                                                disabled={testingProvider === provider.id || loading.verifyingKey}
                                                autoComplete="new-password"
                                            />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                loading={testingProvider === provider.id}
                                                disabled={loading.verifyingKey}
                                            >
                                                {status.status === 'verified' ? 'Update' : 'Verify'}
                                            </Button>
                                        </Form.Item>
                                        {status.status !== 'none' && (
                                            <Form.Item>
                                                <Button
                                                    type="text"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleRemoveKey(provider.id)}
                                                    disabled={loading.verifyingKey}
                                                />
                                            </Form.Item>
                                        )}
                                    </Form>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            {provider.name}
                                            <Tag color={status.color} icon={status.icon}>
                                                {status.text}
                                            </Tag>
                                        </Space>
                                    }
                                    description={
                                        <Space direction="vertical" size="small">
                                            <Text>{provider.description}</Text>
                                            {provider.keyFormat && (
                                                <Text type="secondary" code>
                                                    Key format: {provider.keyFormat}
                                                </Text>
                                            )}
                                            {provider.docsUrl && (
                                                <a href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                                                    Documentation
                                                </a>
                                            )}
                                        </Space>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />
            </Card>

            <Divider />

            <Card title="Provider & Model Selection">
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                        <Text strong>Select AI Provider:</Text>
                        <Select
                            value={selectedProvider}
                            onChange={handleProviderChange}
                            placeholder="Choose an AI provider"
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            {providers
                                .filter(p => apiKeys[p.id])
                                .map(provider => (
                                    <Option key={provider.id} value={provider.id}>
                                        <Space>
                                            {provider.name}
                                            <Tag color="success">Verified</Tag>
                                        </Space>
                                    </Option>
                                ))}
                        </Select>
                    </div>

                    {selectedProvider && (
                        <div>
                            <Space align="center">
                                <Text strong>Select Model:</Text>
                                <Button
                                    type="text"
                                    icon={<ReloadOutlined />}
                                    onClick={handleRefreshModels}
                                    loading={loading.fetchingModels}
                                    size="small"
                                >
                                    Refresh
                                </Button>
                            </Space>

                            <Select
                                value={selectedModel}
                                onChange={handleModelChange}
                                placeholder="Choose a model"
                                style={{ width: '100%', marginTop: 8 }}
                                loading={loading.fetchingModels}
                                notFoundContent={loading.fetchingModels ? <Spin size="small" /> : 'No models available'}
                            >
                                {models[selectedProvider]?.map(model => (
                                    <Option key={model.id} value={model.id}>
                                        <div>
                                            <Text strong>{model.name}</Text>
                                            {model.description && (
                                                <div>
                                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                                        {model.description}
                                                    </Text>
                                                </div>
                                            )}
                                            {model.contextLength && (
                                                <Tag style={{ marginTop: 4 }}>
                                                    {model.contextLength.toLocaleString()} tokens
                                                </Tag>
                                            )}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </div>
                    )}
                </Space>
            </Card>

            <Divider />

            <Card title="Data Management">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Text type="secondary">
                        Manage your stored API keys and cached model data.
                    </Text>
                    <Popconfirm
                        title="Clear All Data"
                        description="This will remove all stored API keys and cached models. Are you sure?"
                        onConfirm={handleClearAllData}
                        okText="Yes, clear all"
                        cancelText="Cancel"
                        okType="danger"
                    >
                        <Button danger icon={<ClearOutlined />}>
                            Clear All Data
                        </Button>
                    </Popconfirm>
                </Space>
            </Card>

            <Modal
                title="Provider Details"
                open={!!selectedProviderDetails}
                onCancel={() => setSelectedProviderDetails(null)}
                footer={[
                    <Button key="close" onClick={() => setSelectedProviderDetails(null)}>
                        Close
                    </Button>
                ]}
                width={600}
            >
                {selectedProviderDetails && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Name">
                            {providers.find(p => p.id === selectedProviderDetails)?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description">
                            {providers.find(p => p.id === selectedProviderDetails)?.description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Base URL">
                            <code>{providers.find(p => p.id === selectedProviderDetails)?.baseUrl}</code>
                        </Descriptions.Item>
                        <Descriptions.Item label="Key Format">
                            {providers.find(p => p.id === selectedProviderDetails)?.keyFormat ||
                                <Text type="secondary">Any format accepted</Text>}
                        </Descriptions.Item>
                        <Descriptions.Item label="Documentation">
                            {providers.find(p => p.id === selectedProviderDetails)?.docsUrl ? (
                                <a
                                    href={providers.find(p => p.id === selectedProviderDetails)?.docsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View Documentation
                                </a>
                            ) : (
                                <Text type="secondary">Not available</Text>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {(() => {
                                const status = getProviderStatus(selectedProviderDetails);
                                return (
                                    <Tag color={status.color} icon={status.icon}>
                                        {status.text}
                                    </Tag>
                                );
                            })()}
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};
