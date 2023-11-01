import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import type { Session } from "next-auth";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={session}>
      <Head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DW4563ZMBT"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DW4563ZMBT');
            `,
          }}
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
