import { useAuth } from '../hooks/useAuth'
import Homepage from './Homepage'
import Login from './Login'

export default function Home() {

  const auth = useAuth();

  return auth.user ? (
    <Homepage />
  ) : (
    <Login />
  );
  
}
