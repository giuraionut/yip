'use client';
import React, { useState } from 'react';
import { Layout, Menu, Button, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import DarkModeToggle from '../darkModeToggle';
import ThemeColorPicker from '../themeColorPicker';
import { AuthButton, Profile } from './authComponents';
const { Header, Sider, Content } = Layout;

const NavigationWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  //   const {
  //     token: { colorBgContainer, borderRadiusLG },
  //   } = theme.useToken();
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className='min-h-screen'>
        <div className='demo-logo-vertical' />
        <Menu
          theme='dark'
          mode='inline'
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'nav 1',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'nav 2',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'nav 3',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header className='flex'>
          <Button
            type='text'
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white',
            }}
          />
          <div className='ml-auto flex items-center gap-3'>
            <ThemeColorPicker />
            <DarkModeToggle />
            <AuthButton />
            <Profile />
          </div>
        </Header>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};
export default NavigationWrapper;
