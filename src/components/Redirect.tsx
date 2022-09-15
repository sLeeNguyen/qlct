import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { UrlObject } from 'url';

export interface RedirectProps {
  to: UrlObject | string;
}

export default function Redirect(props: RedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.push(props.to);
  }, [router, props.to]);

  return <></>;
}
