/**
 * @fileoverview Unit tests for ProviderManagement component
 * 
 * Tests for provider management functionality including adding, editing,
 * and deleting AI providers.
 * 
 * @since 1.0.0
 */

import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { ProviderManagement } from './ProviderManagement';
import { render as renderWithProviders } from '../../test/utils';
import { AI_PROVIDERS } from '../../services/aiProviders';

// Mock form
type FieldKeys = 'name' | 'apiKey';
let fields: Record<FieldKeys, string> = { name: '', apiKey: '' };
const ensureFields = () => {
    if (!fields || typeof fields !== 'object') fields = { name: '', apiKey: '' };
    fields.name ??= '';
    fields.apiKey ??= '';
};
const mockForm = {
    submit: vi.fn(),
    resetFields: vi.fn(() => { fields = { name: '', apiKey: '' }; }),
    setFieldsValue: vi.fn((newFields: Partial<Record<FieldKeys, string>>) => { ensureFields(); fields = { ...fields, ...newFields }; }),
    getFieldsValue: vi.fn(() => { ensureFields(); return { ...fields }; }),
    getFieldValue: vi.fn((key: FieldKeys) => { ensureFields(); return fields[key]; }),
    setFieldValue: vi.fn((key: FieldKeys, value: string) => { ensureFields(); fields[key] = value; }),
    validateFields: vi.fn(() => { ensureFields(); return Promise.resolve({ ...fields }); }),
    isFieldsTouched: vi.fn(() => false),
    getFieldsError: vi.fn(() => []),
    scrollToField: vi.fn(),
};

// Mock Ant Design Form
vi.mock('antd', async () => {
    const actual = await vi.importActual('antd');
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...actual as any,
        Form: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ...(actual as any).Form,
            useForm: () => [mockForm],
        },
    };
});

describe('ProviderManagement', () => {
    const renderComponent = () => {
        const preloadedState = {
            ai: {
                providers: AI_PROVIDERS,
                models: {},
                selectedProvider: undefined,
                apiKeys: {},
                loading: {
                    verifyingKey: false,
                    fetchingModels: false,
                },
                errors: {},
            },
        };
        return renderWithProviders(<ProviderManagement />, { preloadedState });
    };

    it('renders provider management interface', () => {
        renderComponent();

        expect(screen.getByText('AI Provider Management')).toBeInTheDocument();
        expect(screen.getByText('Add Custom Provider')).toBeInTheDocument();
        expect(screen.getByText('OpenAI')).toBeInTheDocument();
        expect(screen.getByText('Anthropic')).toBeInTheDocument();
    });

    it('displays provider information correctly', () => {
        renderComponent();

        expect(screen.getByText('OpenAI')).toBeInTheDocument();
        expect(screen.getByText('openai')).toBeInTheDocument();
        expect(screen.getByText('GPT-4, GPT-3.5, and other OpenAI models')).toBeInTheDocument();
        expect(screen.getByText('Anthropic')).toBeInTheDocument();
    });

    it('shows delete button only for custom providers', () => {
        renderComponent();

        const deleteButtons = screen.queryAllByTitle('Delete Provider');
        expect(deleteButtons).toHaveLength(0); // No delete buttons for built-in providers
    });

    it('shows test connection button for all providers', () => {
        renderComponent();

        const testButtons = screen.getAllByTitle('Test Connection');
        expect(testButtons).toHaveLength(7); // Test buttons for all 7 providers
    });

    it('displays API key requirement status', () => {
        renderComponent();

        const requiredTags = screen.getAllByText('Required');
        expect(requiredTags).toHaveLength(7); // All 7 providers require API keys
    });

    it('shows provider status tags', () => {
        renderComponent();

        const statusTags = screen.getAllByText(/Connected|Not Connected/);
        expect(statusTags.length).toBeGreaterThan(0);
    });

    it('renders with custom className', () => {
        const { container } = renderWithProviders(
            <ProviderManagement className="custom-class" />,
            {
                preloadedState: {
                    ai: {
                        providers: AI_PROVIDERS,
                        models: {},
                        selectedProvider: undefined,
                        apiKeys: {},
                        loading: {
                            verifyingKey: false,
                            fetchingModels: false,
                        },
                        errors: {},
                    },
                },
            }
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders without providers', () => {
        const { container } = renderWithProviders(
            <ProviderManagement />,
            {
                preloadedState: {
                    ai: {
                        providers: [],
                        models: {},
                        selectedProvider: undefined,
                        apiKeys: {},
                        loading: {
                            verifyingKey: false,
                            fetchingModels: false,
                        },
                        errors: {},
                    },
                },
            }
        );

        expect(container).toBeInTheDocument();
        expect(screen.getByText('AI Provider Management')).toBeInTheDocument();
    });
});
