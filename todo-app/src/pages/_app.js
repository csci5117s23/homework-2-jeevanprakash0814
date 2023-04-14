import '@/styles/globals.css'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs';
import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';


export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, [])

  return (
    <ClerkProvider {...pageProps} >
      <>
          <Component {...pageProps} />
          {/* <RedirectToSignIn /> */}
      </>
    </ClerkProvider>
  )
}
