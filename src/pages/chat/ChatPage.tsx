/**
 * @fileoverview Chat interface component
 * 
 * Modular chat interface with pluggable features and model switching.
 * 
 * @since 1.0.0
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    Card,
    Input,
    Button,
    Space,
    Avatar,
    Typography,
    Select,
    Drawer,
    List,
    Tag,
    Tooltip,
    Spin,
    Switch,
    App
} from 'antd';
import {
    SendOutlined,
    RobotOutlined,
    UserOutlined,
    MenuOutlined,
    PlusOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useAppSelector } from '../../hooks/redux';
import { EnhancedAIService } from '../../services/enhancedAIService';
import type { AIModel } from '../../types/ai';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

/**
 * Chat message interface
 */
interface ChatMessage {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
    model?: string;
}

/**
 * Conversation interface
 */
interface Conversation {
    id: string;
    title: string;
    model: string;
    provider: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Chat page properties
 */
export interface ChatPageProps {
    /** CSS class name */
    className?: string;
}

/**
 * Chat page component with modular architecture
 */
export const ChatPage: React.FC<ChatPageProps> = ({ className }) => {
    const { providers } = useAppSelector(state => state.ai);
    const { message } = App.useApp();

    // State
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [models, setModels] = useState<AIModel[]>([]);
    const [autoCreateNewConversation, setAutoCreateNewConversation] = useState(true);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Load models and conversations on mount
    useEffect(() => {
        const loadModels = async () => {
            try {
                // Initialize cache with default models if empty
                EnhancedAIService.initializeDefaultModels();

                const cachedModels = EnhancedAIService.getAllCachedModels();
                const allModels: AIModel[] = [];

                Object.values(cachedModels).forEach(providerModels => {
                    allModels.push(...providerModels);
                });

                setModels(allModels);

                // Set default model if none selected
                if (!selectedModel && allModels.length > 0) {
                    setSelectedModel(allModels[0]);
                }
            } catch (error) {
                console.error('Failed to load models:', error);
            }
        };

        loadModels();
        loadConversations();
    }, [selectedModel]);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [currentConversation?.messages]);

    // Load conversations from localStorage
    const loadConversations = () => {
        try {
            const saved = localStorage.getItem('chat_conversations');
            if (saved) {
                const parsed = JSON.parse(saved);
                const conversations = parsed.map((conv: Omit<Conversation, 'createdAt' | 'updatedAt' | 'messages'> & {
                    createdAt: string;
                    updatedAt: string;
                    messages: (Omit<ChatMessage, 'timestamp'> & { timestamp: string })[];
                }) => ({
                    ...conv,
                    createdAt: new Date(conv.createdAt),
                    updatedAt: new Date(conv.updatedAt),
                    messages: conv.messages.map((msg) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
                setConversations(conversations);
            }
        } catch (error) {
            console.error('Failed to load conversations:', error);
        }
    };

    // Save conversations to localStorage
    const saveConversations = (convs: Conversation[]) => {
        try {
            localStorage.setItem('chat_conversations', JSON.stringify(convs));
        } catch (error) {
            console.error('Failed to save conversations:', error);
        }
    };

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Create new conversation
    const createNewConversation = (model?: AIModel) => {
        if (!model && !selectedModel) return;

        const modelToUse = model || selectedModel!;
        const newConversation: Conversation = {
            id: Date.now().toString(),
            title: `Chat with ${modelToUse.name}`,
            model: modelToUse.id,
            provider: modelToUse.provider,
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const updatedConversations = [newConversation, ...conversations];
        setConversations(updatedConversations);
        setCurrentConversation(newConversation);
        saveConversations(updatedConversations);
    };

    // Delete conversation
    const deleteConversation = (id: string) => {
        const updatedConversations = conversations.filter(conv => conv.id !== id);
        setConversations(updatedConversations);
        saveConversations(updatedConversations);

        if (currentConversation?.id === id) {
            setCurrentConversation(null);
        }
    };

    // Handle model change
    const handleModelChange = (modelId: string) => {
        const model = models.find(m => m.id === modelId);
        if (!model) return;

        setSelectedModel(model);

        if (autoCreateNewConversation && (currentConversation?.messages?.length ?? 0) > 0) {
            createNewConversation(model);
        } else if (currentConversation) {
            // Update current conversation model
            const updatedConversation = {
                ...currentConversation,
                model: model.id,
                provider: model.provider,
                title: currentConversation.messages.length === 0 ?
                    `Chat with ${model.name}` :
                    currentConversation.title,
                updatedAt: new Date()
            };

            const updatedConversations = conversations.map(conv =>
                conv.id === currentConversation.id ? updatedConversation : conv
            );

            setCurrentConversation(updatedConversation);
            setConversations(updatedConversations);
            saveConversations(updatedConversations);
        }
    };

    // Send message
    const sendMessage = async () => {
        if (!inputValue.trim() || !selectedModel) return;
        if (!currentConversation) {
            createNewConversation();
            return;
        }

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            content: inputValue.trim(),
            role: 'user',
            timestamp: new Date(),
            model: selectedModel.id
        };

        // Add user message
        const updatedConversation = {
            ...currentConversation,
            messages: [...currentConversation.messages, userMessage],
            updatedAt: new Date()
        };

        setCurrentConversation(updatedConversation);
        setInputValue('');
        setLoading(true);

        try {
            // Simulate AI response (replace with actual API call)
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                content: `This is a simulated response from ${selectedModel.name}. In a real implementation, this would call the AI provider's API.`,
                role: 'assistant',
                timestamp: new Date(),
                model: selectedModel.id
            };

            const finalConversation = {
                ...updatedConversation,
                messages: [...updatedConversation.messages, assistantMessage],
                updatedAt: new Date()
            };

            setCurrentConversation(finalConversation);

            const updatedConversations = conversations.map(conv =>
                conv.id === finalConversation.id ? finalConversation : conv
            );

            setConversations(updatedConversations);
            saveConversations(updatedConversations);

        } catch (error) {
            console.error('Failed to get AI response:', error);
            message.error('Failed to get response from AI');
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Group models by provider
    const modelsByProvider = useMemo(() => {
        const groups: Record<string, AIModel[]> = {};
        models.forEach(model => {
            if (!groups[model.provider]) {
                groups[model.provider] = [];
            }
            groups[model.provider].push(model);
        });
        return groups;
    }, [models]);

    // Render message component
    const renderMessage = (message: ChatMessage) => {
        const isUser = message.role === 'user';
        const provider = providers.find(p => p.id === selectedModel?.provider);

        return (
            <div
                key={message.id}
                style={{
                    display: 'flex',
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                    marginBottom: '16px'
                }}
            >
                <div
                    style={{
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: isUser ? 'row-reverse' : 'row',
                        gap: '8px',
                        alignItems: 'flex-start'
                    }}
                >
                    <Avatar
                        size="small"
                        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
                        src={!isUser ? provider?.logoUrl : undefined}
                        style={{
                            backgroundColor: isUser ? 'var(--color-primary)' : provider?.primaryColor,
                            flexShrink: 0
                        }}
                    />
                    <Card
                        size="small"
                        style={{
                            backgroundColor: isUser ? 'var(--color-primary-light)' : 'var(--color-bg-tertiary)',
                            border: 'none',
                            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px'
                        }}
                        styles={{
                            body: { padding: '8px 12px' }
                        }}
                    >
                        {isUser ? (
                            <Text>{message.content}</Text>
                        ) : (
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {message.content}
                            </ReactMarkdown>
                        )}
                        <div style={{
                            textAlign: 'right',
                            marginTop: '4px',
                            fontSize: '10px',
                            color: 'var(--color-text-tertiary)'
                        }}>
                            {message.timestamp.toLocaleTimeString()}
                        </div>
                    </Card>
                </div>
            </div>
        );
    };

    return (
        <div className={className} style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Card
                size="small"
                style={{
                    borderRadius: 0,
                    borderBottom: '1px solid var(--color-border)',
                    flexShrink: 0
                }}
                styles={{ body: { padding: '8px 16px' } }}
            >
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <Space>
                        <Button
                            type="text"
                            icon={<MenuOutlined />}
                            onClick={() => setSidebarVisible(true)}
                        />
                        {selectedModel && (
                            <>
                                <Avatar
                                    size="small"
                                    src={providers.find(p => p.id === selectedModel.provider)?.logoUrl}
                                    style={{
                                        backgroundColor: providers.find(p => p.id === selectedModel.provider)?.primaryColor
                                    }}
                                />
                                <Text strong>{selectedModel.name}</Text>
                            </>
                        )}
                    </Space>

                    <Space>
                        <Select
                            style={{ minWidth: 300 }}
                            placeholder="Select model"
                            value={selectedModel?.id}
                            onChange={handleModelChange}
                            showSearch
                            filterOption={(input, option) => {
                                const label = option?.label;
                                if (typeof label === 'string') {
                                    return label.toLowerCase().includes(input.toLowerCase());
                                }
                                return false;
                            }}
                        >
                            {Object.entries(modelsByProvider).map(([provider, models]) => (
                                <Select.OptGroup key={provider} label={
                                    <Space>
                                        <Avatar
                                            size="small"
                                            src={providers.find(p => p.id === provider)?.logoUrl}
                                            style={{
                                                backgroundColor: providers.find(p => p.id === provider)?.primaryColor
                                            }}
                                        />
                                        {providers.find(p => p.id === provider)?.name || provider}
                                    </Space>
                                }>
                                    {models.map(model => (
                                        <Option key={model.id} value={model.id} label={model.name}>
                                            <Space>
                                                <Text>{model.name}</Text>
                                                {model.capabilities && model.capabilities.length > 0 && (
                                                    <div>
                                                        {model.capabilities.slice(0, 2).map(cap => (
                                                            <Tag key={cap}>{cap}</Tag>
                                                        ))}
                                                    </div>
                                                )}
                                            </Space>
                                        </Option>
                                    ))}
                                </Select.OptGroup>
                            ))}
                        </Select>

                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => createNewConversation()}
                            title="New conversation"
                        />
                    </Space>
                </Space>
            </Card>

            {/* Messages Area */}
            <div
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    backgroundColor: 'var(--color-bg-secondary)'
                }}
            >
                {currentConversation?.messages.map(renderMessage)}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Avatar
                                size="small"
                                src={providers.find(p => p.id === selectedModel?.provider)?.logoUrl}
                                style={{
                                    backgroundColor: providers.find(p => p.id === selectedModel?.provider)?.primaryColor
                                }}
                            />
                            <Card
                                size="small"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    border: 'none',
                                    borderRadius: '18px 18px 18px 4px'
                                }}
                                styles={{ body: { padding: '8px 12px' } }}
                            >
                                <Spin size="small" />
                            </Card>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <Card
                size="small"
                style={{
                    borderRadius: 0,
                    borderTop: '1px solid var(--color-border)',
                    flexShrink: 0
                }}
                styles={{ body: { padding: '16px' } }}
            >
                <Space.Compact style={{ width: '100%' }}>
                    <TextArea
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        style={{ resize: 'none' }}
                        disabled={!selectedModel}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={sendMessage}
                        loading={loading}
                        disabled={!inputValue.trim() || !selectedModel}
                        style={{ height: 'auto' }}
                    >
                        Send
                    </Button>
                </Space.Compact>
            </Card>

            {/* Conversations Sidebar */}
            <Drawer
                title="Conversations"
                placement="left"
                onClose={() => setSidebarVisible(false)}
                open={sidebarVisible}
                width={320}
                extra={
                    <Space>
                        <Tooltip title="Auto-create new conversation when switching models">
                            <Switch
                                size="small"
                                checked={autoCreateNewConversation}
                                onChange={setAutoCreateNewConversation}
                            />
                        </Tooltip>
                        <Button
                            size="small"
                            icon={<PlusOutlined />}
                            onClick={() => createNewConversation()}
                        >
                            New
                        </Button>
                    </Space>
                }
            >
                <List
                    dataSource={conversations}
                    renderItem={(conversation) => (
                        <List.Item
                            style={{
                                cursor: 'pointer',
                                backgroundColor: currentConversation?.id === conversation.id ? 'var(--color-primary-light)' : 'transparent',
                                borderRadius: '4px',
                                margin: '4px 0'
                            }}
                            onClick={() => setCurrentConversation(conversation)}
                            actions={[
                                <Button
                                    key="delete"
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteConversation(conversation.id);
                                    }}
                                />
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        size="small"
                                        src={providers.find(p => p.id === conversation.provider)?.logoUrl}
                                        style={{
                                            backgroundColor: providers.find(p => p.id === conversation.provider)?.primaryColor
                                        }}
                                    />
                                }
                                title={
                                    <Text ellipsis style={{ fontSize: '13px' }}>
                                        {conversation.title}
                                    </Text>
                                }
                                description={
                                    <div>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>
                                            {conversation.messages.length} messages
                                        </Text>
                                        <br />
                                        <Text type="secondary" style={{ fontSize: '10px' }}>
                                            {conversation.updatedAt.toLocaleDateString()}
                                        </Text>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Drawer>
        </div>
    );
};
