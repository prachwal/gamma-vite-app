/**
 * @fileoverview AI section layout component
 * 
 * Layout component for AI-related pages with navigation between AI features
 * 
 * @since 1.0.0
 */

import React, { Suspense } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Breadcrumb, Card, Menu, Spin } from 'antd';
import {
    MessageOutlined,
    DatabaseOutlined,
    SettingOutlined
} from '@ant-design/icons';

/**
 * AI section layout props interface
 */
export interface AILayoutProps {
    className?: string;
}

/**
 * Navigation items for AI section
 */
const AI_NAV_ITEMS = [
    {
        key: '/ai/chat',
        icon: <MessageOutlined />,
        label: <Link to="/ai/chat">Chat</Link>,
        title: 'AI Chat Interface'
    },
    {
        key: '/ai/models',
        icon: <DatabaseOutlined />,
        label: <Link to="/ai/models">Model Browser</Link>,
        title: 'Browse AI Models'
    },
    {
        key: '/ai/providers',
        icon: <SettingOutlined />,
        label: <Link to="/ai/providers">Providers</Link>,
        title: 'Manage AI Providers'
    }
];

/**
 * Get breadcrumb items based on current path
 */
const getBreadcrumbItems = (pathname: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const items = [
        {
            title: <Link to="/">Home</Link>
        },
        {
            title: <Link to="/ai">AI</Link>
        }
    ];

    if (pathSegments.length > 1) {
        const currentSegment = pathSegments[pathSegments.length - 1];
        const navItem = AI_NAV_ITEMS.find(item =>
            item.key.endsWith(`/${currentSegment}`)
        );

        if (navItem) {
            items.push({
                title: <span>{navItem.title}</span>
            });
        }
    }

    return items;
};

/**
 * AI section layout component
 * Provides navigation and layout structure for AI-related pages
 * 
 * @component
 */
export const AILayout: React.FC<AILayoutProps> = ({ className }) => {
    const location = useLocation();

    return (
        <div className={className} style={{
            padding: 'var(--space-lg)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Breadcrumb */}
            <Breadcrumb
                items={getBreadcrumbItems(location.pathname)}
                style={{ marginBottom: 'var(--space-md)' }}
            />

            {/* Navigation */}
            <Card
                size="small"
                style={{
                    marginBottom: 'var(--space-lg)',
                    flexShrink: 0
                }}
                styles={{ body: { padding: '8px' } }}
            >
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={AI_NAV_ITEMS}
                    style={{
                        border: 'none',
                        backgroundColor: 'transparent'
                    }}
                />
            </Card>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Suspense
                    fallback={
                        <Spin size="large" tip="Loading AI module...">
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '300px',
                                minHeight: '300px'
                            }} />
                        </Spin>
                    }
                >
                    <Outlet />
                </Suspense>
            </div>
        </div>
    );
};
