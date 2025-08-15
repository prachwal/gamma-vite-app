/**
 * @fileoverview Application header component
 */

import React from 'react';
import { Layout, Space, Typography } from 'antd';
import { useResponsive } from '../hooks/useResponsive';
import { HamburgerMenu } from './HamburgerMenu';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

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
    const { isMobile } = useResponsive();

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
                    <HamburgerMenu
                        isOpen={!sidebarCollapsed}
                        onToggle={onSidebarToggle}
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
