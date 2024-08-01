'use client';

import { Button } from 'antd';
import { signIn, useSession, signOut } from 'next-auth/react';

export const profile = () => {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return 'profile authenticated';
  } else return 'profile not authenticated';
};

export const authButton = () => {
  return (
    <Button type='primary' onClick={() => signIn('github')}>
      Login
    </Button>
  );
};

export const logoutButton = () => {
  return <Button type='primary'>Logout</Button>;
};
