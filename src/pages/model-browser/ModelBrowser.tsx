/**
 * @fileoverview Model Browser page
 * 
 * Advanced model browser with filtering, pagination, and detailed model information.
 * 
 * @since 1.0.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
    Card,
    Row,
    Col,
    Input,
    Select,
    Button,
    Tag,
    Pagination,
    Drawer,
    Space,
    Typography,
    Slider,
    Switch,
    Tooltip,
    Avatar,
    Badge,
    Modal,
    Descriptions,
    Spin,
    App,
    Table
} from 'antd';
import {
    FilterOutlined,
    EyeOutlined,
    BugOutlined,
    CodeOutlined,
    GlobalOutlined,
    ApiOutlined,
    BranchesOutlined,
    ReloadOutlined,
    AppstoreOutlined,
    UnorderedListOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useAppSelector } from '../../hooks/redux';
import { EnhancedAIService } from '../../services/enhancedAIService';
import { AI_PROVIDERS } from '../../services/aiProviders';
import type { AIModel, ModelBrowserFilters, ModelCapability } from '../../types/ai';

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;

/**
 * Model Browser component properties
 */
export interface ModelBrowserProps {
    /** CSS class name */
    className?: string;
}

/**
 * Capability icons mapping
 */
const CAPABILITY_ICONS = {
    vision: <EyeOutlined />,
    function_calling: <ApiOutlined />,
    json_mode: <BranchesOutlined />,
    code_interpreter: <CodeOutlined />,
    web_search: <GlobalOutlined />,
    multimodal: <BugOutlined />
} as const;

/**
 * Capability colors mapping
 */
const CAPABILITY_COLORS = {
    vision: 'blue',
    function_calling: 'green',
    json_mode: 'purple',
    code_interpreter: 'orange',
    web_search: 'cyan',
    multimodal: 'magenta'
} as const;

/**
 * Model Browser component
 */
export const ModelBrowser: React.FC<ModelBrowserProps> = ({ className }) => {
    const { providers } = useAppSelector(state => state.ai);
    const { message } = App.useApp();

    // Local state
    const [models, setModels] = useState<AIModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<ModelBrowserFilters>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [sortBy, setSortBy] = useState<keyof AIModel>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [filterPanelVisible, setFilterPanelVisible] = useState(false);
    const [filterPanelPosition, setFilterPanelPosition] = useState<'left' | 'right'>('right');
    const [columnsCount, setColumnsCount] = useState(4);
    const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Load models on component mount and when providers change
    useEffect(() => {
        loadModels();
    }, [providers]);

    // Load models from cache or API
    const loadModels = async () => {
        setLoading(true);
        try {
            // Initialize cache with default models if empty
            EnhancedAIService.initializeDefaultModels();

            // Get all cached models first
            const cachedModels = EnhancedAIService.getAllCachedModels();
            const allModels: AIModel[] = [];

            // Flatten all models from all providers
            Object.values(cachedModels).forEach(providerModels => {
                allModels.push(...providerModels);
            });

            setModels(allModels);

            // Only try background refresh if we have at least one API key
            const hasAnyApiKey = AI_PROVIDERS.some(provider => {
                const apiKey = localStorage.getItem(`apiKey_${provider.id}`);
                return apiKey && provider.requiresApiKey;
            });

            if (hasAnyApiKey) {
                // Refresh stale models in background only if we have API keys
                EnhancedAIService.refreshStaleModels().then(() => {
                    // Reload models after background refresh
                    const updatedModels = EnhancedAIService.getAllCachedModels();
                    const refreshedModels: AIModel[] = [];
                    Object.values(updatedModels).forEach(providerModels => {
                        refreshedModels.push(...providerModels);
                    });
                    setModels(refreshedModels);
                }).catch(error => {
                    console.warn('Failed to refresh stale models:', error);
                });
            } else {
                console.debug('No API keys available, skipping background refresh');
            }

        } catch (error) {
            console.error('Failed to load models:', error);
            message.error('Failed to load models');
        } finally {
            setLoading(false);
        }
    };

    // Refresh all models manually
    const refreshAllModels = async () => {
        setLoading(true);
        try {
            const allModels: AIModel[] = [];

            // Force refresh all providers
            for (const provider of providers) {
                try {
                    const providerModels = await EnhancedAIService.getModels(provider.id, true);
                    allModels.push(...providerModels);
                } catch (error) {
                    console.warn(`Failed to refresh models for ${provider.name}:`, error);
                }
            }

            setModels(allModels);
            message.success('Models refreshed successfully');
        } catch (error) {
            console.error('Failed to refresh models:', error);
            message.error('Failed to refresh models');
        } finally {
            setLoading(false);
        }
    };

    // Get all models - now using local state instead of Redux
    const allModels = useMemo(() => {
        return models;
    }, [models]);

    // Apply filters and sorting
    const filteredAndSortedModels = useMemo(() => {
        let filtered = [...allModels];

        // Apply filters
        if (filters.name) {
            filtered = filtered.filter(model =>
                model.name.toLowerCase().includes(filters.name!.toLowerCase()) ||
                model.id.toLowerCase().includes(filters.name!.toLowerCase())
            );
        }

        if (filters.provider && filters.provider.length > 0) {
            filtered = filtered.filter(model =>
                filters.provider!.includes(model.provider)
            );
        }

        if (filters.capabilities && filters.capabilities.length > 0) {
            filtered = filtered.filter(model =>
                model.capabilities?.some(cap => filters.capabilities!.includes(cap))
            );
        }

        if (filters.minContextLength) {
            filtered = filtered.filter(model =>
                (model.contextLength || 0) >= filters.minContextLength!
            );
        }

        if (filters.maxInputCost) {
            filtered = filtered.filter(model =>
                !model.inputCostPerMillion || model.inputCostPerMillion <= filters.maxInputCost!
            );
        }

        if (filters.maxOutputCost) {
            filtered = filtered.filter(model =>
                !model.outputCostPerMillion || model.outputCostPerMillion <= filters.maxOutputCost!
            );
        }

        if (!filters.showDeprecated) {
            filtered = filtered.filter(model => !model.deprecated);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];

            if (aVal === undefined && bVal === undefined) return 0;
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;

            let comparison = 0;
            if (aVal < bVal) comparison = -1;
            else if (aVal > bVal) comparison = 1;

            return sortDirection === 'asc' ? comparison : -comparison;
        });

        return filtered;
    }, [allModels, filters, sortBy, sortDirection]);

    // Paginated models
    const paginatedModels = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredAndSortedModels.slice(start, start + pageSize);
    }, [filteredAndSortedModels, currentPage, pageSize]);

    // Get unique providers
    const availableProviders = useMemo(() => {
        return [...new Set(allModels.map(model => model.provider))];
    }, [allModels]);

    // Get unique capabilities
    const availableCapabilities = useMemo(() => {
        const caps = new Set<ModelCapability>();
        allModels.forEach(model => {
            model.capabilities?.forEach(cap => caps.add(cap));
        });
        return Array.from(caps);
    }, [allModels]);

    // Handle model details
    const handleModelDetails = async (model: AIModel) => {
        setLoadingDetails(true);
        setSelectedModel(model);

        // Fetch additional details from provider API if needed in future versions

        setLoadingDetails(false);
    };

    // Filter panel content
    const renderFilterPanel = () => (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
                <Text strong>Search</Text>
                <Search
                    placeholder="Search models..."
                    value={filters.name}
                    onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                    style={{ marginTop: 8 }}
                />
            </div>

            <div>
                <Text strong>Providers</Text>
                <Select
                    mode="multiple"
                    placeholder="Select providers"
                    value={filters.provider}
                    onChange={(value) => setFilters(prev => ({ ...prev, provider: value }))}
                    style={{ width: '100%', marginTop: 8 }}
                >
                    {availableProviders.map(provider => (
                        <Option key={provider} value={provider}>
                            {providers.find(p => p.id === provider)?.name || provider}
                        </Option>
                    ))}
                </Select>
            </div>

            <div>
                <Text strong>Capabilities</Text>
                <Select
                    mode="multiple"
                    placeholder="Select capabilities"
                    value={filters.capabilities}
                    onChange={(value) => setFilters(prev => ({ ...prev, capabilities: value }))}
                    style={{ width: '100%', marginTop: 8 }}
                >
                    {availableCapabilities.map(capability => (
                        <Option key={capability} value={capability}>
                            <Space>
                                {CAPABILITY_ICONS[capability]}
                                {capability.replace('_', ' ')}
                            </Space>
                        </Option>
                    ))}
                </Select>
            </div>

            <div>
                <Text strong>Min Context Length</Text>
                <Slider
                    min={0}
                    max={1000000}
                    step={1000}
                    value={filters.minContextLength || 0}
                    onChange={(value) => setFilters(prev => ({ ...prev, minContextLength: value }))}
                    tooltip={{ formatter: (value) => `${value?.toLocaleString()} tokens` }}
                    style={{ marginTop: 8 }}
                />
            </div>

            <div>
                <Text strong>Max Input Cost (per 1M tokens)</Text>
                <Slider
                    min={0}
                    max={100}
                    step={0.1}
                    value={filters.maxInputCost || 100}
                    onChange={(value) => setFilters(prev => ({ ...prev, maxInputCost: value }))}
                    tooltip={{ formatter: (value) => `$${value}` }}
                    style={{ marginTop: 8 }}
                />
            </div>

            <div>
                <Text strong>Max Output Cost (per 1M tokens)</Text>
                <Slider
                    min={0}
                    max={100}
                    step={0.1}
                    value={filters.maxOutputCost || 100}
                    onChange={(value) => setFilters(prev => ({ ...prev, maxOutputCost: value }))}
                    tooltip={{ formatter: (value) => `$${value}` }}
                    style={{ marginTop: 8 }}
                />
            </div>

            <div>
                <Space>
                    <Text strong>Show Deprecated</Text>
                    <Switch
                        checked={filters.showDeprecated}
                        onChange={(checked) => setFilters(prev => ({ ...prev, showDeprecated: checked }))}
                    />
                </Space>
            </div>

            <Button
                block
                onClick={() => setFilters({})}
                style={{ marginTop: 16 }}
            >
                Clear Filters
            </Button>
        </Space>
    );

    // Render model in list/table view
    const renderModelList = () => {
        const columns = [
            {
                title: 'Model',
                dataIndex: 'name',
                key: 'name',
                render: (_: string, model: AIModel) => {
                    const provider = providers.find(p => p.id === model.provider);
                    return (
                        <Space>
                            <Avatar
                                size="small"
                                src={provider?.logoUrl}
                                style={{ backgroundColor: provider?.primaryColor }}
                            >
                                {provider?.name.charAt(0)}
                            </Avatar>
                            <div>
                                <div style={{ fontWeight: 500 }}>{model.name}</div>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    {provider?.name || model.provider}
                                </Text>
                            </div>
                        </Space>
                    );
                },
                sorter: (a: AIModel, b: AIModel) => a.name.localeCompare(b.name),
            },
            {
                title: 'Context Length',
                dataIndex: 'contextLength',
                key: 'contextLength',
                render: (contextLength: number) => contextLength ? `${contextLength.toLocaleString()}` : 'N/A',
                sorter: (a: AIModel, b: AIModel) => (a.contextLength || 0) - (b.contextLength || 0),
            },
            {
                title: 'Input Cost',
                dataIndex: 'inputCostPerMillion',
                key: 'inputCostPerMillion',
                render: (cost: number) => cost ? `$${cost.toFixed(3)}` : 'N/A',
                sorter: (a: AIModel, b: AIModel) => (a.inputCostPerMillion || 0) - (b.inputCostPerMillion || 0),
            },
            {
                title: 'Capabilities',
                dataIndex: 'capabilities',
                key: 'capabilities',
                render: (capabilities: ModelCapability[]) => (
                    <Space wrap size={[4, 4]}>
                        {capabilities?.slice(0, 3).map(capability => (
                            <Tag
                                key={capability}
                                color={CAPABILITY_COLORS[capability]}
                            >
                                {capability.replace('_', ' ')}
                            </Tag>
                        ))}
                        {capabilities?.length > 3 && (
                            <Tag>+{capabilities.length - 3}</Tag>
                        )}
                    </Space>
                ),
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_: unknown, model: AIModel) => (
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleModelDetails(model)}
                        size="small"
                    >
                        Details
                    </Button>
                ),
            },
        ];

        return (
            <Table
                columns={columns}
                dataSource={paginatedModels}
                rowKey="id"
                pagination={false}
                size="middle"
            />
        );
    };

    // Model card component
    const renderModelCard = (model: AIModel) => {
        const provider = providers.find(p => p.id === model.provider);

        return (
            <Card
                key={model.id}
                hoverable
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                styles={{
                    body: {
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        flex: 1
                    }
                }}
                actions={[
                    <Tooltip key="view-details" title="View Details">
                        <Button
                            type="text"
                            icon={<EyeOutlined />}
                            onClick={() => handleModelDetails(model)}
                        />
                    </Tooltip>
                ]}
            >
                <Space direction="vertical" style={{ width: '100%', flex: 1 }}>
                    {/* Provider info */}
                    <Space>
                        <Avatar
                            size="small"
                            src={provider?.logoUrl}
                            style={{ backgroundColor: provider?.primaryColor }}
                        >
                            {provider?.name.charAt(0)}
                        </Avatar>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {provider?.name || model.provider}
                        </Text>
                    </Space>

                    {/* Model name */}
                    <Title level={5} style={{ margin: 0, lineHeight: '1.2' }}>
                        {model.name}
                        {model.deprecated && (
                            <Tag color="red" style={{ marginLeft: 8 }}>
                                Deprecated
                            </Tag>
                        )}
                    </Title>

                    {/* Capabilities */}
                    {model.capabilities && model.capabilities.length > 0 && (
                        <Space wrap>
                            {model.capabilities.map(capability => (
                                <Tooltip key={capability} title={capability.replace('_', ' ')}>
                                    <Tag
                                        color={CAPABILITY_COLORS[capability]}
                                        icon={CAPABILITY_ICONS[capability]}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Tooltip>
                            ))}
                        </Space>
                    )}

                    {/* Stats */}
                    <Space direction="vertical" size={4} style={{ marginTop: 'auto' }}>
                        {model.contextLength && (
                            <Text style={{ fontSize: '11px' }}>
                                <strong>Context:</strong> {model.contextLength.toLocaleString()} tokens
                            </Text>
                        )}

                        {(model.inputCostPerMillion || model.outputCostPerMillion) && (
                            <Text style={{ fontSize: '11px' }}>
                                <strong>Cost:</strong> ${model.inputCostPerMillion?.toFixed(2) || '?'} /
                                ${model.outputCostPerMillion?.toFixed(2) || '?'} per 1M tokens
                            </Text>
                        )}
                    </Space>
                </Space>
            </Card>
        );
    };

    return (
        <div className={className}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Space size="middle" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Model Browser
                        <Badge count={filteredAndSortedModels.length} style={{ marginLeft: 12 }} />
                    </Title>

                    <Space>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={refreshAllModels}
                            loading={loading}
                            title="Refresh all models"
                        >
                            Refresh
                        </Button>

                        <Space.Compact>
                            <Button
                                icon={<AppstoreOutlined />}
                                onClick={() => setViewMode('grid')}
                                type={viewMode === 'grid' ? 'primary' : 'default'}
                                title="Grid View"
                            />
                            <Button
                                icon={<UnorderedListOutlined />}
                                onClick={() => setViewMode('list')}
                                type={viewMode === 'list' ? 'primary' : 'default'}
                                title="List View"
                            />
                        </Space.Compact>

                        {viewMode === 'grid' && (
                            <Select
                                value={columnsCount}
                                onChange={setColumnsCount}
                                style={{ width: 120 }}
                            >
                                <Option value={2}>2 Columns</Option>
                                <Option value={3}>3 Columns</Option>
                                <Option value={4}>4 Columns</Option>
                                <Option value={6}>6 Columns</Option>
                            </Select>
                        )}

                        <Select
                            value={sortBy}
                            onChange={setSortBy}
                            style={{ width: 140 }}
                        >
                            <Option value="name">Sort by Name</Option>
                            <Option value="provider">Sort by Provider</Option>
                            <Option value="contextLength">Sort by Context</Option>
                            <Option value="inputCostPerMillion">Sort by Cost</Option>
                        </Select>

                        <Button
                            icon={sortDirection === 'asc' ? '↑' : '↓'}
                            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                        />

                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setFilterPanelVisible(true)}
                            type={Object.keys(filters).length > 0 ? 'primary' : 'default'}
                        >
                            Filters
                        </Button>
                    </Space>
                </Space>
            </div>

            {/* Models View */}
            {viewMode === 'grid' ? (
                <Row gutter={[16, 16]} style={{ margin: 0 }}>
                    {paginatedModels.map(model => (
                        <Col
                            key={model.id}
                            xs={24}
                            sm={12}
                            md={24 / Math.min(columnsCount, 6)}
                            lg={24 / Math.min(columnsCount, 6)}
                            xl={24 / Math.min(columnsCount, 6)}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginBottom: 0
                            }}
                        >
                            {renderModelCard(model)}
                        </Col>
                    ))}
                </Row>
            ) : (
                renderModelList()
            )}

            {/* Pagination */}
            {filteredAndSortedModels.length > pageSize && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                    <Pagination
                        current={currentPage}
                        total={filteredAndSortedModels.length}
                        pageSize={pageSize}
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total, range) =>
                            `${range[0]}-${range[1]} of ${total} models`
                        }
                        onChange={(page, size) => {
                            setCurrentPage(page);
                            if (size !== pageSize) {
                                setPageSize(size);
                                setCurrentPage(1);
                            }
                        }}
                        pageSizeOptions={['12', '24', '48', '96']}
                    />
                </div>
            )}

            {/* Filter Panel */}
            <Drawer
                title="Model Filters"
                placement={filterPanelPosition}
                onClose={() => setFilterPanelVisible(false)}
                open={filterPanelVisible}
                width={320}
                extra={
                    <Space>
                        <Button
                            size="small"
                            onClick={() => setFilterPanelPosition(
                                filterPanelPosition === 'right' ? 'left' : 'right'
                            )}
                        >
                            {filterPanelPosition === 'right' ? '← Left' : 'Right →'}
                        </Button>
                    </Space>
                }
            >
                {renderFilterPanel()}
            </Drawer>

            {/* Model Details Modal */}
            <Modal
                title={selectedModel?.name}
                open={!!selectedModel}
                onCancel={() => setSelectedModel(null)}
                width={800}
                footer={[
                    <Button key="close" onClick={() => setSelectedModel(null)}>
                        Close
                    </Button>
                ]}
            >
                {selectedModel && (
                    <Spin spinning={loadingDetails}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {/* Provider info */}
                            <Space>
                                <Avatar
                                    src={providers.find(p => p.id === selectedModel.provider)?.logoUrl}
                                    style={{ backgroundColor: providers.find(p => p.id === selectedModel.provider)?.primaryColor }}
                                >
                                    {providers.find(p => p.id === selectedModel.provider)?.name.charAt(0)}
                                </Avatar>
                                <Text>
                                    <strong>{providers.find(p => p.id === selectedModel.provider)?.name || selectedModel.provider}</strong>
                                </Text>
                            </Space>

                            {/* Model details */}
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Model ID" span={2}>
                                    <code>{selectedModel.id}</code>
                                </Descriptions.Item>

                                {selectedModel.description && (
                                    <Descriptions.Item label="Description" span={2}>
                                        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeHighlight]}
                                            >
                                                {selectedModel.description}
                                            </ReactMarkdown>
                                        </div>
                                    </Descriptions.Item>
                                )}

                                {selectedModel.contextLength && (
                                    <Descriptions.Item label="Context Length">
                                        {selectedModel.contextLength.toLocaleString()} tokens
                                    </Descriptions.Item>
                                )}

                                {selectedModel.maxOutputTokens && (
                                    <Descriptions.Item label="Max Output">
                                        {selectedModel.maxOutputTokens.toLocaleString()} tokens
                                    </Descriptions.Item>
                                )}

                                {selectedModel.inputCostPerMillion && (
                                    <Descriptions.Item label="Input Cost">
                                        ${selectedModel.inputCostPerMillion.toFixed(4)} per 1M tokens
                                    </Descriptions.Item>
                                )}

                                {selectedModel.outputCostPerMillion && (
                                    <Descriptions.Item label="Output Cost">
                                        ${selectedModel.outputCostPerMillion.toFixed(4)} per 1M tokens
                                    </Descriptions.Item>
                                )}

                                {selectedModel.version && (
                                    <Descriptions.Item label="Version">
                                        {selectedModel.version}
                                    </Descriptions.Item>
                                )}

                                {selectedModel.trainingDataCutoff && (
                                    <Descriptions.Item label="Training Cutoff">
                                        {selectedModel.trainingDataCutoff}
                                    </Descriptions.Item>
                                )}

                                {selectedModel.capabilities && selectedModel.capabilities.length > 0 && (
                                    <Descriptions.Item label="Capabilities" span={2}>
                                        <Space wrap>
                                            {selectedModel.capabilities.map(capability => (
                                                <Tag
                                                    key={capability}
                                                    color={CAPABILITY_COLORS[capability]}
                                                    icon={CAPABILITY_ICONS[capability]}
                                                >
                                                    {capability.replace('_', ' ')}
                                                </Tag>
                                            ))}
                                        </Space>
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Space>
                    </Spin>
                )}
            </Modal>
        </div>
    );
};
