/**
 * @fileoverview Provider Management page component
 * 
 * Main page component for managing AI providers with routing and layout integration.
 * 
 * @since 1.0.0
 */

import React from 'react';
import { Card, Tabs } from 'antd';
import { AISettings, ProviderManagement } from '../../components';
import { SettingOutlined, KeyOutlined } from '@ant-design/icons';

/**
 * Provider Management page component properties
 */
export interface ProviderManagementPageProps {
    /** CSS class name */
    className?: string;
}

/**
 * Provider Management page component
 * 
 * @param props - Component properties
 * @returns Provider Management page JSX
 */
export const ProviderManagementPage: React.FC<ProviderManagementPageProps> = ({ className }) => {
    return (
        <div
            className={className}
            style={{
                height: '100%',
                background: 'var(--color-bg-primary)',
                padding: 'var(--space-lg)'
            }}
        >
            <Card
                title="AI Provider Configuration"
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                styles={{
                    body: {
                        flex: 1,
                        padding: '0',
                        display: 'flex',
                        flexDirection: 'column'
                    },
                    header: {
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-primary)'
                    }
                }}
            >
                <Tabs
                    defaultActiveKey="api-keys"
                    style={{ height: '100%' }}
                    items={[
                        {
                            key: 'api-keys',
                            label: (
                                <span>
                                    <KeyOutlined />
                                    API Keys & Models
                                </span>
                            ),
                            children: (
                                <div style={{
                                    height: 'calc(100vh - 200px)',
                                    overflowY: 'auto',
                                    padding: 'var(--space-md)'
                                }}>
                                    <AISettings />
                                </div>
                            )
                        },
                        {
                            key: 'custom-providers',
                            label: (
                                <span>
                                    <SettingOutlined />
                                    Custom Providers
                                </span>
                            ),
                            children: (
                                <div style={{
                                    height: 'calc(100vh - 200px)',
                                    overflowY: 'auto',
                                    padding: 'var(--space-md)'
                                }}>
                                    <ProviderManagement />
                                </div>
                            )
                        }
                    ]}
                />
            </Card>
        </div>
    );
};
