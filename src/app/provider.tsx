'use client';
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { useTheme } from './themeContext';

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { primary } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.darkAlgorithm],
        token: {
          colorPrimary: primary,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
export default Provider;
