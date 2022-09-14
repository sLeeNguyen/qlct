/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useUserStore } from 'src/store';

export default function requireAuth(Component: React.FC<any>, componentProps?: any) {
  return function C() {
    const isAuthenticated = useUserStore((state) => state.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/sign-in');
      }
    }, [router, isAuthenticated]);

    if (isAuthenticated) {
      return <Component {...componentProps} />;
    } else return <></>;
  };
}
