/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';
import React from 'react';
import { useUserStore } from 'src/store';
import Redirect from './Redirect';

export default function requireAuth(Component: React.FC<any>, componentProps?: any) {
  return function C() {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const router = useRouter();

    if (isAuthenticated) {
      return <Component {...componentProps} />;
    } else return <Redirect to={`/sign-in?next=${router.route}`} />;
  };
}
