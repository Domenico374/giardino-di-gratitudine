import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="it">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f4efe4" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
