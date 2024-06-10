'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ThemeContextProps {
  accentColor: string;
  setAccentColor: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [accentColor, setAccentColor] = useState<string>('#1890ff'); // Default color
  const [darkMode, setDarkMode] = useState<boolean>(false);
  return (
    <ThemeContext.Provider
      value={{ accentColor, setAccentColor, darkMode, setDarkMode }}
    >
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
