import React from 'react';
import Provider from './provider';
import { ThemeProvider } from './themeContext';

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <Provider>{children}</Provider>
    </ThemeProvider>
  );
};

export default ThemeWrapper;
