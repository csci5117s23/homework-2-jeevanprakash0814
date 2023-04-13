import '@/styles/globals.css'

import 'bootstrap/dist/css/bootstrap.css';
import { useEffect } from 'react';
// maybe use signedin signedout tags that clerk offers to ensure that the user is seeing the right things at the right time (maybe redirect to a login page)


export default function App({ Component, pageProps }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, [])
  
  return <Component {...pageProps} />
}
