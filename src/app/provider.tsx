'use client';
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import { useTheme } from './themeContext';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';
import { tailwindColors } from './utils';
const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fullConfig = resolveConfig(tailwindConfig);

  const { accentColor, darkMode } = useTheme();
  const { darkAlgorithm, defaultAlgorithm } = theme;
  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: darkMode ? tailwindColors.slate[700] : tailwindColors.slate[300],
          colorBgContainer: darkMode
            ? tailwindColors.gray[700]
            : tailwindColors.blue[300],
          colorText: darkMode ? tailwindColors.white : tailwindColors.black,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
export default Provider;
