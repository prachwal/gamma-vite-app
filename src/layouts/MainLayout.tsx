/**
 * @fileoverview Main application layout component
 */

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useResponsive } from '../hooks/useResponsive';
import { setSidebarCollapsed } from '../store/appSlice';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

const { Content } = Layout;

/**
 * Main application layout component
 * Provides the overall structure with responsive sidebar and header
 */
export const MainLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { sidebarCollapsed } = useAppSelector((state) => state.app);
    const { deviceType } = useResponsive();

    // Auto-collapse sidebar based on device type
    useEffect(() => {
        switch (deviceType) {
            case 'mobile':
                dispatch(setSidebarCollapsed(true));
                break;
            case 'tablet':
                dispatch(setSidebarCollapsed(true));
                break;
            case 'desktop':
                dispatch(setSidebarCollapsed(false));
                break;
        }
    }, [deviceType, dispatch]);

    const handleSidebarToggle = () => {
        dispatch(setSidebarCollapsed(!sidebarCollapsed));
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                sidebarCollapsed={sidebarCollapsed}
                onSidebarToggle={handleSidebarToggle}
            />

            <Layout style={{ background: 'var(--color-bg-primary)' }}>
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                />

                <Layout
                    style={{
                        marginLeft: deviceType === 'mobile' ? 0 : undefined,
                        background: 'var(--color-bg-primary)',
                    }}
                >
                    <Content
                        style={{
                            padding: 'var(--space-lg)',
                            background: 'var(--color-bg-primary)',
                            minHeight: 'calc(100vh - var(--header-height))',
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>

            {/* Mobile overlay to close sidebar */}
            {deviceType === 'mobile' && !sidebarCollapsed && (
                <div
                    role="button"
                    tabIndex={0}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 'calc(var(--z-sidebar-mobile) - 1)',
                    }}
                    onClick={() => dispatch(setSidebarCollapsed(true))}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            dispatch(setSidebarCollapsed(true));
                        }
                    }}
                    aria-label="Close sidebar"
                />
            )}
        </Layout>
    );
};
