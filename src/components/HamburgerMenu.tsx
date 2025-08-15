/**
 * @fileoverview Hamburger menu component for mobile navigation
 */

import React from 'react';
import { Button } from 'antd';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';

/**
 * Props for HamburgerMenu component
 */
export interface HamburgerMenuProps {
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}

/**
 * Hamburger menu button component
 * Used for toggling mobile navigation
 */
export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
    isOpen,
    onToggle,
    className,
}) => {
    return (
        <Button
            type="text"
            size="large"
            icon={isOpen ? <CloseOutlined /> : <MenuOutlined />}
            onClick={onToggle}
            className={className}
            style={{
                color: 'var(--color-text-primary)',
            }}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
        />
    );
};
