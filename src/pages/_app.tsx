import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { SessionProvider as NextAuthProvider } from 'next-auth/react';
import { Roboto } from '@next/font/google';
import AOS from 'aos';

import 'aos/dist/aos.css';
import '@/styles/globals.css';

const roboto = Roboto({ subsets: ['latin'], weight: ['500', '700', '900'] })

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  
  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <NextAuthProvider session={session}>
        <style jsx global>{`
            html {
              font-family: ${roboto.style.fontFamily};
            }
            `}</style>
        <Component {...pageProps} />
    </NextAuthProvider>
  )
}
