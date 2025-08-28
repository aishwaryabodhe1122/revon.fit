
import type { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';
import { useEffect } from 'react';
export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(()=>{ import('bootstrap/dist/js/bootstrap.bundle.min.js'); }, []);
  return <Component {...pageProps} />;
}
