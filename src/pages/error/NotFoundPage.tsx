/**
 * @fileoverview 404 Not Found page component
 * 
 * Error page displayed when route is not found
 * 
 * @since 1.0.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Result, Button, Space } from 'antd';
import { HomeOutlined, ReloadOutlined } from '@ant-design/icons';

/**
 * Not Found page props interface
 */
export interface NotFoundPageProps {
    className?: string;
}

/**
 * 404 Not Found page component
 * Displayed when a requested route doesn't exist
 * 
 * @component
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({ className }) => {
    const navigate = useNavigate();

    return (
        <div
            className={className}
            style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--space-xl)'
            }}
        >
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Space>
                        <Button
                            type="primary"
                            icon={<HomeOutlined />}
                            onClick={() => navigate('/')}
                        >
                            Back Home
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => window.location.reload()}
                        >
                            Retry
                        </Button>
                    </Space>
                }
            />
        </div>
    );
};
