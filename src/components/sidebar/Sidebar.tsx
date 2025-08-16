/**
 * @fileoverview Navigation sidebar component
 */

import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, SettingOutlined, RobotOutlined, AppstoreOutlined, ApiOutlined, MessageOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import type { MenuProps } from 'antd';
import type { NavigationItem } from '../../types';
import { useResponsive } from '../../hooks';

const { Sider } = Layout;

/**
 * Props for Sidebar component
 */
export interface SidebarProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
    className?: string;
}

/**
 * Navigation items configuration
 */
const navigationItems: NavigationItem[] = [
    {
        key: 'home',
        path: '/',
        labelKey: 'navigation.home',
        icon: <HomeOutlined />,
    },
    {
        key: 'ai',
        path: '/ai',
        labelKey: 'navigation.ai',
        icon: <RobotOutlined />,
        children: [
            {
                key: 'ai-chat',
                path: '/ai/chat',
                labelKey: 'navigation.chat',
                icon: <MessageOutlined />,
            },
            {
                key: 'ai-models',
                path: '/ai/models',
                labelKey: 'navigation.models',
                icon: <AppstoreOutlined />,
            },
            {
                key: 'ai-providers',
                path: '/ai/providers',
                labelKey: 'navigation.providers',
                icon: <ApiOutlined />,
            }
        ]
    },
    {
        key: 'about',
        path: '/about',
        labelKey: 'navigation.about',
        icon: <InfoCircleOutlined />,
    },
    {
        key: 'settings',
        path: '/settings',
        labelKey: 'navigation.settings',
        icon: <SettingOutlined />,
    },
];

/**
 * Navigation sidebar component
 * Provides main application navigation with responsive behavior
 */
export const Sidebar: React.FC<SidebarProps> = ({
    collapsed,
    onCollapse,
    className,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobile } = useResponsive();
    const [openKeys, setOpenKeys] = React.useState<string[]>([]);

    // Get current active key considering nested routes
    const findMatchingItem = (items: NavigationItem[], path: string): string | null => {
        for (const item of items) {
            if (item.path === path) return item.key;
            if (item.children) {
                const childMatch = findMatchingItem(item.children, path);
                if (childMatch) return childMatch;
            }
        }
        return null;
    };

    const findParentMatch = (items: NavigationItem[], path: string): string | null => {
        for (const item of items) {
            if (path.startsWith(item.path + '/') && item.children) {
                const childMatch = findMatchingItem(item.children, path);
                return childMatch || item.key;
            }
        }
        return null;
    };

    const getCurrentKey = (): string => {
        const currentPath = location.pathname;
        return findMatchingItem(navigationItems, currentPath) ||
            findParentMatch(navigationItems, currentPath) ||
            'home';
    };

    const currentKey = getCurrentKey();

    const convertToMenuItems = (items: NavigationItem[]): MenuProps['items'] => {
        return items.map(item => ({
            key: item.key,
            icon: item.icon,
            label: t(item.labelKey),
            onClick: item.children ? undefined : () => navigate(item.path),
            children: item.children ? convertToMenuItems(item.children) : undefined,
        }));
    };

    // Initialize openKeys based on current path
    React.useEffect(() => {
        const currentPath = location.pathname;
        const newOpenKeys: string[] = [];

        for (const item of navigationItems) {
            if (item.children && currentPath.startsWith(item.path + '/')) {
                newOpenKeys.push(item.key);
            }
        }

        setOpenKeys(newOpenKeys);
    }, [location.pathname]);

    const handleOpenChange = (keys: string[]) => {
        setOpenKeys(keys);
    };

    const menuItems: MenuProps['items'] = convertToMenuItems(navigationItems);

    return (
        <Sider
            collapsible={!isMobile}
            collapsed={collapsed}
            onCollapse={onCollapse}
            trigger={null}
            width={256}
            collapsedWidth={isMobile ? 0 : 80}
            className={className}
            style={{
                background: 'var(--color-bg-secondary)',
                borderRight: '1px solid var(--color-border-secondary)',
                position: isMobile ? 'fixed' : 'relative',
                height: isMobile ? '100vh' : 'auto',
                zIndex: isMobile ? 'var(--z-sidebar-mobile)' : 'auto',
                left: isMobile && collapsed ? '-100%' : '0',
                transition: 'all var(--transition-medium)',
                top: isMobile ? 'var(--header-height)' : '0',
            }}
        >
            <Menu
                mode="inline"
                selectedKeys={[currentKey]}
                openKeys={openKeys}
                onOpenChange={handleOpenChange}
                items={menuItems}
                style={{
                    background: 'transparent',
                    border: 'none',
                    height: '100%',
                }}
                theme="light"
            />
        </Sider>
    );
};
