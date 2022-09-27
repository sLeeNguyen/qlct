import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import ResetCSS from 'src/styles/ResetCSS';
import { useAuthStateListener } from 'src/hooks/useAuthStateListener';
import GlobalStyles from 'src/styles/GlobalStyles';

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>;
};

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

function MyApp(props: MyAppProps) {
  const { pageProps, Component } = props;

  const Layout = Component.Layout || Fragment;

  useAuthStateListener();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta name="description" content="Quan ly thu chi ca nhan" />
        <title>Quan ly thu chi</title>
      </Head>
      <ResetCSS />
      <GlobalStyles />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
