'use client';
import React from 'react';
import Provider from './provider';
import { ThemeProvider, useTheme } from './themeContext';
import NavigationWrapper from './components/navigationWrapper';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <ThemeWrapperContent>{children}</ThemeWrapperContent>
    </ThemeProvider>
  );
};

const ThemeWrapperContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { accentColor, darkMode } = useTheme();

  return (
    <html lang='en' className={darkMode ? 'bg-gray-900' : 'bg-white'}>
      <body className='overflow-hidden'>
        <Provider>
          <NavigationWrapper>{children}</NavigationWrapper>
        </Provider>
      </body>
    </html>
  );
};

export default ThemeWrapper;
