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
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
