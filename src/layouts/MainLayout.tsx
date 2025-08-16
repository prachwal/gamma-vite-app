/**
 * @fileoverview Main application layout component
 */

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '../components';
import { useAppDispatch, useAppSelector, useComponentPreloader } from '../hooks';
import { useResponsive } from '../hooks/useResponsive';
import { setSidebarCollapsed } from '../store/appSlice';

const { Content } = Layout;

/**
 * @fileoverview Main layout component with responsive sidebar
 * @component MainLayout
 * @since 1.0.0
 */
export const MainLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    const { deviceType } = useResponsive();
    const { sidebarCollapsed } = useAppSelector((state) => state.app);

    // Initialize component preloading
    useComponentPreloader();

    // Auto-collapse sidebar based on device type
    useEffect(() => {
        if (deviceType === 'mobile') {
            dispatch(setSidebarCollapsed(true));
        } else if (deviceType === 'tablet') {
            dispatch(setSidebarCollapsed(true));
        } else {
            dispatch(setSidebarCollapsed(false));
        }
    }, [deviceType, dispatch]);

    const handleSidebarCollapse = (collapsed: boolean) => {
        dispatch(setSidebarCollapsed(collapsed));
    };

    const handleSidebarToggle = () => {
        dispatch(setSidebarCollapsed(!sidebarCollapsed));
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar
                collapsed={sidebarCollapsed}
                onCollapse={handleSidebarCollapse}
            />
            <Layout>
                <Header
                    sidebarCollapsed={sidebarCollapsed}
                    onSidebarToggle={handleSidebarToggle}
                />
                <Content
                    style={{
                        padding: 'var(--space-lg)',
                        backgroundColor: 'var(--color-bg-layout)',
                        minHeight: 'calc(100vh - 64px)',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
