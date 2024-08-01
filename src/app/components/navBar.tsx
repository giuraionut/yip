import React from 'react';
import ThemeColorPicker from '../themeColorPicker';
import { Button, Flex } from 'antd';
import DarkModeToggle from '../darkModeToggle';
import { authButton, profile } from './authComponents';
const NavBar: React.FC<{}> = ({}) => {
  return (
    <div className='text-white font-bold bg-slate-700 p-2'>
      <Flex gap='10px' align='center'>
        <ThemeColorPicker />
        <DarkModeToggle />
        {authButton()}
        {profile()}
      </Flex>
    </div>
  );
};

export default NavBar;
