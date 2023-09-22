import '../styles/globals.css'
import Login from './Login.js'
import Homepage from './Homepage.js'
import CreateNewUser from './createNewUser'
import Head from 'next/head'
import { useAuth, AuthProvider } from '../hooks/useAuth';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>UTFSA Points App - Beta</title>
        <meta name="UTFSA Points App" content="Beta" />
        <link rel="icon" href="/fsa-logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"></link>
      </Head>
      <Component {...pageProps} />
      <div id='recaptcha-container'></div>
    </AuthProvider>
  );
}

export default MyApp
