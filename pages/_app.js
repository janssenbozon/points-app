import '../styles/globals.css'
import Login from './Login.js'
import Homepage from './Homepage.js'
import CreateNewUser from './createNewUser'

function MyApp({ Component, pageProps }) {
  return (
      <Component {...pageProps} />
  );
}

export default MyApp
