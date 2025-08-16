/**
 * @fileoverview AI provider types and interfaces
 * 
 * @since 1.0.0
 */

/**
 * Supported AI providers
 */
export type AIProvider = string;

/**
 * Model capabilities
 */
export type ModelCapability = 'vision' | 'function_calling' | 'json_mode' | 'code_interpreter' | 'web_search' | 'multimodal';

/**
 * AI provider configuration
 */
export interface AIProviderConfig {
    /** Provider identifier */
    id: AIProvider;
    /** Display name */
    name: string;
    /** Provider description */
    description: string;
    /** API base URL */
    baseUrl: string;
    /** Whether API key is required */
    requiresApiKey: boolean;
    /** Example API key format */
    keyFormat?: string;
    /** Provider documentation URL */
    docsUrl?: string;
    /** Provider logo URL */
    logoUrl?: string;
    /** Provider color theme */
    primaryColor?: string;
    /** Custom provider (user-defined) */
    isCustom?: boolean;
}

/**
 * AI model information
 */
export interface AIModel {
    /** Model identifier */
    id: string;
    /** Model display name */
    name: string;
    /** Model description */
    description?: string;
    /** Context window size */
    contextLength?: number;
    /** Input cost per million tokens */
    inputCostPerMillion?: number;
    /** Output cost per million tokens */
    outputCostPerMillion?: number;
    /** Provider that owns this model */
    provider: AIProvider;
    /** Model capabilities */
    capabilities?: ModelCapability[];
    /** Model category/family */
    category?: string;
    /** Model version/date */
    version?: string;
    /** Whether model is deprecated */
    deprecated?: boolean;
    /** Maximum output tokens */
    maxOutputTokens?: number;
    /** Training data cutoff date */
    trainingDataCutoff?: string;
}

/**
 * API key storage entry
 */
export interface APIKeyEntry {
    /** Provider identifier */
    provider: AIProvider;
    /** Encrypted API key */
    apiKey: string;
    /** When the key was added */
    addedAt: string;
    /** Whether the key was verified */
    isVerified: boolean;
    /** Last verification attempt */
    lastVerified?: string;
}

/**
 * AI provider state interface
 */
export interface AIState {
    /** Available providers */
    providers: AIProviderConfig[];
    /** Available models by provider */
    models: Partial<Record<AIProvider, AIModel[]>>;
    /** API keys status */
    apiKeys: Partial<Record<AIProvider, boolean>>;
    /** Currently selected provider */
    selectedProvider?: AIProvider;
    /** Currently selected model */
    selectedModel?: string;
    /** Loading states */
    loading: {
        verifyingKey: boolean;
        fetchingModels: boolean;
    };
    /** Error states */
    errors: {
        keyVerification?: string;
        modelFetching?: string;
    };
}

/**
 * Model browser filter state
 */
export interface ModelBrowserFilters {
    /** Filter by name */
    name?: string;
    /** Filter by provider */
    provider?: AIProvider[];
    /** Filter by capabilities */
    capabilities?: ModelCapability[];
    /** Min context length */
    minContextLength?: number;
    /** Max input cost per million tokens */
    maxInputCost?: number;
    /** Max output cost per million tokens */
    maxOutputCost?: number;
    /** Show deprecated models */
    showDeprecated?: boolean;
}

/**
 * Model browser state
 */
export interface ModelBrowserState {
    /** All available models */
    allModels: AIModel[];
    /** Filtered models */
    filteredModels: AIModel[];
    /** Current filters */
    filters: ModelBrowserFilters;
    /** Current page */
    currentPage: number;
    /** Items per page */
    pageSize: number;
    /** Sort by field */
    sortBy: keyof AIModel;
    /** Sort direction */
    sortDirection: 'asc' | 'desc';
    /** Loading state */
    loading: boolean;
    /** Selected model for details */
    selectedModel?: AIModel;
    /** Columns count for grid layout */
    columnsCount: number;
    /** Filter panel visibility */
    filterPanelVisible: boolean;
    /** Filter panel position */
    filterPanelPosition: 'left' | 'right';
}
