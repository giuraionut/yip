'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextProps {
  primary: string;
  setPrimary: React.Dispatch<React.SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [primary, setPrimary] = useState<string>('#1890ff'); // Default color

  return (
    <ThemeContext.Provider value={{ primary, setPrimary }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
