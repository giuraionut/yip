import { Button } from 'antd';
import React from 'react';
import { SmileFilled } from '@ant-design/icons';
const NavBar: React.FC<{ setModalOpen: (open: boolean) => void }> = ({
  setModalOpen,
}) => {
  return (
    <div className='text-white font-bold bg-slate-700 p-2 rounded-md'>
      <Button
        type='primary'
        icon={<SmileFilled />}
        onClick={() => setModalOpen(true)}
      >
        Moods
      </Button>
    </div>
  );
};

export default NavBar;
