import Document, { Head, Html, Main, NextScript } from 'next/document';
import { buildPathToPublicResource } from 'src/utils';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head>
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href={buildPathToPublicResource('favicon.ico')} />
          <link rel="apple-touch-icon" sizes="32x32" href={buildPathToPublicResource('favicon32.png')} />
          <link rel="apple-touch-icon" sizes="64x64" href={buildPathToPublicResource('favicon64.png')} />
          <link rel="apple-touch-icon" sizes="256x256" href={buildPathToPublicResource('favicon256.png')} />
          <link rel="manifest" href={buildPathToPublicResource('manifest.json')} />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
