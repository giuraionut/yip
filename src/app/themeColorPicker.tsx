import { ColorPicker } from 'antd';
import React from 'react';
import { useTheme } from './themeContext';

const ThemeColorPicker: React.FC = () => {
  const { primary, setPrimary } = useTheme();

  return (
    <ColorPicker
      showText
      value={primary}
      onChangeComplete={(color) => setPrimary(color.toHexString())}
    />
  );
};

export default ThemeColorPicker;
