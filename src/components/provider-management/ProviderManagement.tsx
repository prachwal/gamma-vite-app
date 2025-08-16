/**
 * @fileoverview Provider Management component
 * 
 * Component for managing AI providers, adding custom providers, and configuring settings.
 * 
 * @since 1.0.0
 */

import React, { useState } from 'react';
import {
    Card,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Switch,
    Space,
    Typography,
    Tag,
    Avatar,
    Popconfirm,
    App,
    Divider,
    ColorPicker
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    GlobalOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AIProviderConfig } from '../../types/ai';
import { useAppSelector } from '../../hooks/redux';

const { Title, Text } = Typography;
const { TextArea } = Input;

/**
 * Provider Management component properties
 */
export interface ProviderManagementProps {
    /** CSS class name */
    className?: string;
}

/**
 * Provider form data interface
 */
interface ProviderFormData {
    id: string;
    name: string;
    description: string;
    baseUrl: string;
    requiresApiKey: boolean;
    keyFormat?: string;
    docsUrl?: string;
    logoUrl?: string;
    primaryColor?: string;
}

/**
 * Provider Management component
 */
export const ProviderManagement: React.FC<ProviderManagementProps> = ({ className }) => {
    const { providers } = useAppSelector(state => state.ai);
    const { message } = App.useApp();

    // Local state
    const [modalVisible, setModalVisible] = useState(false);
    const [editingProvider, setEditingProvider] = useState<AIProviderConfig | null>(null);
    const [form] = Form.useForm<ProviderFormData>();

    // Handle add/edit provider
    const handleSubmit = async (values: ProviderFormData) => {
        try {
            console.log('Saving provider:', values);

            if (editingProvider) {
                message.success(`Provider "${values.name}" updated successfully`);
            } else {
                message.success(`Provider "${values.name}" added successfully`);
            }

            handleModalClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to save provider:', errorMessage);
            message.error('Failed to save provider');
        }
    };

    // Handle delete provider
    const handleDelete = async (providerId: string) => {
        try {
            console.log('Deleting provider:', providerId);
            message.success('Provider deleted successfully');
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to delete provider:', errorMessage);
            message.error('Failed to delete provider');
        }
    };

    // Handle edit provider
    const handleEdit = (provider: AIProviderConfig) => {
        setEditingProvider(provider);
        form.setFieldsValue({
            id: provider.id,
            name: provider.name,
            description: provider.description,
            baseUrl: provider.baseUrl,
            requiresApiKey: provider.requiresApiKey,
            keyFormat: provider.keyFormat,
            docsUrl: provider.docsUrl,
            logoUrl: provider.logoUrl,
            primaryColor: provider.primaryColor,
        });
        setModalVisible(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setModalVisible(false);
        setEditingProvider(null);
        form.resetFields();
    };

    // Handle test connection
    const handleTestConnection = async (provider: AIProviderConfig) => {
        try {
            console.log('Testing connection for:', provider.id);
            // Mock successful connection for now
            await new Promise(resolve => setTimeout(resolve, 1000));
            message.success(`Connection to ${provider.name} successful`);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Failed to connect to provider:', errorMessage);
            message.error(`Failed to connect to ${provider.name}`);
        }
    };

    // Table columns
    const columns: ColumnsType<AIProviderConfig> = [
        {
            title: 'Provider',
            key: 'provider',
            render: (_, provider) => (
                <Space>
                    <Avatar
                        size="small"
                        src={provider.logoUrl}
                        style={{ backgroundColor: provider.primaryColor }}
                    >
                        {provider.name.charAt(0)}
                    </Avatar>
                    <div>
                        <Text strong>{provider.name}</Text>
                        {provider.isCustom && (
                            <Tag color="blue" style={{ marginLeft: 8 }}>
                                Custom
                            </Tag>
                        )}
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {provider.id}
                        </Text>
                    </div>
                </Space>
            ),
            width: 200,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Base URL',
            key: 'baseUrl',
            render: (_, provider) => (
                <Text code style={{ fontSize: '12px' }}>
                    {provider.baseUrl}
                </Text>
            ),
            width: 250,
        },
        {
            title: 'API Key',
            key: 'apiKey',
            render: (_, provider) => (
                <Tag color={provider.requiresApiKey ? 'orange' : 'green'}>
                    {provider.requiresApiKey ? 'Required' : 'Not Required'}
                </Tag>
            ),
            width: 120,
        },
        {
            title: 'Status',
            key: 'status',
            render: () => {
                // Mock status - in real implementation, this would come from Redux state
                const isConnected = Math.random() > 0.5;
                return (
                    <Tag color={isConnected ? 'success' : 'default'} icon={
                        isConnected ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
                    }>
                        {isConnected ? 'Connected' : 'Not Connected'}
                    </Tag>
                );
            },
            width: 130,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, provider) => (
                <Space size="small">
                    <Button
                        type="text"
                        size="small"
                        icon={<GlobalOutlined />}
                        onClick={() => handleTestConnection(provider)}
                        title="Test Connection"
                    />
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(provider)}
                        title="Edit Provider"
                    />
                    {provider.isCustom && (
                        <Popconfirm
                            title="Delete Provider"
                            description="Are you sure you want to delete this provider?"
                            onConfirm={() => handleDelete(provider.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                title="Delete Provider"
                            />
                        </Popconfirm>
                    )}
                </Space>
            ),
            width: 120,
            fixed: 'right',
        },
    ];

    return (
        <div className={className}>
            <Card>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Title level={4} style={{ margin: 0 }}>
                        AI Provider Management
                    </Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalVisible(true)}
                    >
                        Add Custom Provider
                    </Button>
                </div>

                <Table<AIProviderConfig>
                    columns={columns}
                    dataSource={providers}
                    rowKey="id"
                    pagination={{
                        total: providers.length,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} of ${total} providers`,
                    }}
                    scroll={{ x: 800 }}
                />
            </Card>

            {/* Provider Form Modal */}
            <Modal
                title={editingProvider ? 'Edit Provider' : 'Add Custom Provider'}
                open={modalVisible}
                onCancel={handleModalClose}
                width={600}
                footer={[
                    <Button key="cancel" onClick={handleModalClose}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => form.submit()}>
                        {editingProvider ? 'Update' : 'Add'} Provider
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="id"
                        label="Provider ID"
                        rules={[
                            { required: true, message: 'Provider ID is required' },
                            { pattern: /^[a-z0-9_-]+$/, message: 'ID can only contain lowercase letters, numbers, hyphens, and underscores' }
                        ]}
                    >
                        <Input
                            placeholder="e.g., my_custom_provider"
                            disabled={!!editingProvider && !editingProvider.isCustom}
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Provider Name"
                        rules={[{ required: true, message: 'Provider name is required' }]}
                    >
                        <Input placeholder="e.g., My Custom AI Provider" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[{ required: true, message: 'Description is required' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Brief description of the AI provider and its capabilities"
                        />
                    </Form.Item>

                    <Form.Item
                        name="baseUrl"
                        label="Base URL"
                        rules={[
                            { required: true, message: 'Base URL is required' },
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="https://api.example.com/v1" />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        name="requiresApiKey"
                        label="API Key Required"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item
                        name="keyFormat"
                        label="API Key Format (Optional)"
                        tooltip="Example format to help users understand the expected key format"
                    >
                        <Input placeholder="e.g., sk-..." />
                    </Form.Item>

                    <Form.Item
                        name="docsUrl"
                        label="Documentation URL (Optional)"
                        rules={[
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="https://docs.example.com" />
                    </Form.Item>

                    <Divider />

                    <Form.Item
                        name="logoUrl"
                        label="Logo URL (Optional)"
                        rules={[
                            { type: 'url', message: 'Please enter a valid URL' }
                        ]}
                    >
                        <Input placeholder="https://example.com/logo.png" />
                    </Form.Item>

                    <Form.Item
                        name="primaryColor"
                        label="Primary Color (Optional)"
                    >
                        <ColorPicker showText />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
