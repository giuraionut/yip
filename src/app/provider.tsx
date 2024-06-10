'use client';
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { useTheme } from './themeContext';

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accentColor, darkMode } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = theme;
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: accentColor,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
export default Provider;
