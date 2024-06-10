import { Switch } from 'antd';
import React from 'react';
import { useTheme } from './themeContext';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
const DarkModeToggle: React.FC = () => {
  const { darkMode, setDarkMode } = useTheme();

  const onChange = () => {
    setDarkMode(!darkMode);
  };
  return (
    <Switch
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
      onChange={onChange}
    />
  );
};

export default DarkModeToggle;
