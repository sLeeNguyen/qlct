import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import ResetCSS from 'src/components/ResetCSS';

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

function MyApp(props: MyAppProps) {
  const { pageProps, Component } = props;

  const Layout = Component.Layout || Fragment;

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Quan ly thu chi ca nhan" />
        <title>Quan ly thu chi</title>
      </Head>
      <ResetCSS />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
