import '@/styles/globals.css'
// maybe use signedin signedout tags that clerk offers to ensure that the user is seeing the right things at the right time (maybe redirect to a login page)

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
