import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useAuth } from '../hooks/useAuth'
import Homepage from './Homepage'
import Login from './Login'

export default function Home() {

  const auth = useAuth();

  console.log("auth  = " + auth.user);

  return auth.user ? (
    <Homepage />
  ) : (
    <Login />
  );
}
