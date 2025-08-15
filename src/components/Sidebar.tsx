/**
 * @fileoverview Navigation sidebar component
 */

import React from 'react';
import { Layout, Menu } from 'antd';
import { HomeOutlined, InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useResponsive } from '../hooks/useResponsive';
import type { NavigationItem } from '../types';
import type { MenuProps } from 'antd';

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

    const currentKey = navigationItems.find(item => item.path === location.pathname)?.key || 'home';

    const menuItems: MenuProps['items'] = navigationItems.map(item => ({
        key: item.key,
        icon: item.icon,
        label: t(item.labelKey),
        onClick: () => navigate(item.path),
    }));

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
