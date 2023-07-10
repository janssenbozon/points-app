import '../styles/globals.css'
import Login from './Login.js'
import Homepage from './Homepage.js'
import CreateNewUser from './createNewUser'
import { useAuth, AuthProvider } from '../hooks/useAuth';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <div id='recaptcha-container'></div>
    </AuthProvider>
  );
}

export default MyApp
