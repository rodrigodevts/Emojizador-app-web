import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Roboto } from '@next/font/google';
import '@/styles/globals.css';

const roboto = Roboto({ subsets: ['latin'], weight: ['500', '700', '900'] })

export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return <SessionProvider session={session}>
    <style jsx global>{`
        html {
          font-family: ${roboto.style.fontFamily};
        }
      `}</style>
    <Component {...pageProps} />
  </SessionProvider>
}
