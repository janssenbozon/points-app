import Homepage from './Homepage'
import Login from './Login'
import { useAuth } from '../hooks/useAuth'

export default function Home() {

  const {loading, user} = useAuth();

  if(loading) {
    return (
      <div className="loading loading-lg" />
    )
  }

  return user ? ( 
    <Homepage />
  ) : (
    <Login />
  );
  
}
