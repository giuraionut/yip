import { ColorPicker } from 'antd';
import React from 'react';
import { useTheme } from './themeContext';

const ThemeColorPicker: React.FC = () => {
  const { accentColor, setAccentColor } = useTheme();

  return (
    <ColorPicker
      showText
      value={accentColor}
      onChangeComplete={(color) => setAccentColor(color.toHexString())}
    />
  );
};

export default ThemeColorPicker;
