import React from 'react';
import ThemeColorPicker from '../themeColorPicker';
import { Flex } from 'antd';
import DarkModeToggle from '../darkModeToggle';
const NavBar: React.FC<{}> = ({}) => {
  return (
    <div className='text-white font-bold bg-slate-700 p-2'>
      <Flex gap='10px' align='center'>
        <ThemeColorPicker />
        <DarkModeToggle />
      </Flex>
    </div>
  );
};

export default NavBar;
