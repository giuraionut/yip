import { Button } from 'antd';
import React from 'react';
import { SmileFilled } from '@ant-design/icons';
import ThemeColorPicker from '../themeColorPicker';
const NavBar: React.FC<{}> = ({}) => {
  return (
    <div className='text-white font-bold bg-slate-700 p-2'>
      <ThemeColorPicker/>
    </div>
  );
};

export default NavBar;
