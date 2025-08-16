/**
 * @fileoverview Application header component
 */

import React from 'react';
import { Button, Layout, Space, Typography } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useAppDispatch, useResponsive } from '../../hooks';
import { setSidebarCollapsed } from '../../store/appSlice';
import { LanguageSelector } from '../language-selector';
import { ThemeToggle } from '../theme-toggle';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

/**
 * Props for Header component
 */
export interface HeaderProps {
    sidebarCollapsed: boolean;
    onSidebarToggle: () => void;
    title?: string;
    className?: string;
}

/**
 * Application header component
 * Contains branding, navigation controls, and user actions
 */
export const Header: React.FC<HeaderProps> = ({
    sidebarCollapsed,
    onSidebarToggle,
    title = 'Gamma App',
    className,
}) => {
    const dispatch = useAppDispatch();
    const { isMobile } = useResponsive();

    const handleToggle = () => {
        const newCollapsed = !sidebarCollapsed;
        dispatch(setSidebarCollapsed(newCollapsed));
        onSidebarToggle?.();
    };

    return (
        <AntHeader
            className={className}
            style={{
                background: 'var(--color-bg-primary)',
                borderBottom: '1px solid var(--color-border-secondary)',
                padding: '0 var(--space-md)',
                height: 'var(--header-height)',
                lineHeight: 'var(--header-height)',
                position: 'sticky',
                top: 0,
                zIndex: 'var(--z-header)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            {/* Left section - Logo and hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {isMobile && (
                    <Button
                        type="text"
                        icon={<MenuOutlined />}
                        onClick={handleToggle}
                        style={{ color: 'var(--color-text)' }}
                        aria-label="Toggle sidebar"
                    />
                )}

                <Title
                    level={4}
                    style={{
                        margin: 0,
                        color: 'var(--color-text-primary)',
                        fontWeight: 600,
                    }}
                >
                    {title}
                </Title>
            </div>

            {/* Right section - Controls */}
            <Space size="small">
                <LanguageSelector />
                <ThemeToggle />
            </Space>
        </AntHeader>
    );
};

export default Header;
