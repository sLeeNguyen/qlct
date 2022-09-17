import { PropsWithChildren } from 'react';
import Header from './Header';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <div>
      <Header />
      <div css={{ padding: '32px 0' }}>{children}</div>
    </div>
  );
}
