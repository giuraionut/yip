'use client';

import { Avatar, Button } from 'antd';
import { signIn, signOut, useSession } from 'next-auth/react';

const AuthenticatedStatus = () => {
  const { data: session, status } = useSession();

  return status === 'authenticated';
};

const Profile = () => {
  const { data: session, status } = useSession();
  if (status === 'authenticated') {
    return (
      <Avatar
        shape='square'
        src={<img src={session.user?.image || undefined} alt='avatar' />}
      />
    );
  } else {
    return <div>Profile not authenticated</div>;
  }
};

const AuthButton = () => {
  const { data: session, status } = useSession();

  if (status === 'authenticated') {
    return (
      <Button type='primary' onClick={() => signOut()}>
        Logout
      </Button>
    );
  } else {
    return (
      <>
        <Button type='primary' onClick={() => signIn('github')}>
          Github Login
        </Button>
        <Button type='primary' onClick={() => signIn('google')}>
          Google Login
        </Button>
      </>
    );
  }
};

export { AuthButton, AuthenticatedStatus, Profile };
