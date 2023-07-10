import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import Error from './Error';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneInputShown, setPhoneInputShown] = useState(true)
  const [codeInputShown, setCodeInputShown] = useState(false)
  const [incorrectCode, setIncorrectCode] = useState(false)
  const [incorrectPhoneNumber, setIncorrectPhoneNumber] = useState(false)
  const [otp, setOTP] = useState("")
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    auth.generateRecaptcha(); // Initialize reCAPTCHA on component mount
  }, []);

  const handleVerification = async () => {
    setIncorrectCode(false);
    try {
      if (await auth.verifyOTP(otp, window.confirmationResult)) {
        if (await auth.userExists()) {
          router.push('/Homepage')
        } else {
          router.push({
            pathname: '/createNewUser',
            query: {
              phoneNumber: phoneNumber
            }
          }, '/createNewUser');
        }
      } else {
        setIncorrectCode(true)
      }
    } catch (error) {
      return <Error
        largeText="Something went wrong!"
        smallText="Please try again."
        action={() => router.push('/Login')}
        actionPrompt="Back to login."
      />
    }
  };

  const handlePhoneInput = async () => {
    try {
      if (phoneNumber.length != 10) {
        setIncorrectPhoneNumber(true);
      } else {
        if(await auth.requestOTP(phoneNumber)) {
          console.log("Correct phone number")
          setPhoneInputShown(false);
          setCodeInputShown(true);
        } else {
          console.log("Incorrect phone number")
          setIncorrectPhoneNumber(true);
        }
      }
    } catch (error) {
      return <Error
        largeText="Something went wrong!"
        smallText="Please try again."
        action={() => router.push('/Login')}
        actionPrompt="Back to login."
      />
    }
  };

  // TODO: Break down into components
  return (

    <div className={styles.container}>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin></link>
        <link href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap" rel="stylesheet"></link>
      </Head>
      <main className={styles.main}>

        {phoneInputShown === true ?
          <>
            <h1 className="text-2xl font-bold font-lato text-center">
              Hey there! 👋🏼  Welcome to UTFSA! 🇵🇭
            </h1>
            <h2 className='text-md font-bold font-lato text-center'>To get started, enter your phone number.</h2>
            {incorrectPhoneNumber === true ? <h2 className='text-md font-bold font-lato text-center text-red-500'>Please enter a valid phone number.</h2> : null}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm pt-3">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">📞</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-12 sm:text-sm border-gray-300 rounded-xl transition ease-in-out"
                  placeholder="(000) 000 - 0000"
                  onChange={e => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="flex space-x-2 justify-center pt-4">
                <button
                  type="submit"
                  className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={(e) => {
                    handlePhoneInput();
                  }}
                >Submit</button>
              </div>
            </div>
          </>
          : null
        }

        {codeInputShown === true ?
          <>
            <h1 className="text-2xl font-bold font-lato text-center">
              We sent you a code!
            </h1>
            <h2 className='text-md font-bold font-lato text-center'>Please enter it below.</h2>
            {incorrectCode === true ? <h2 className='text-md font-bold font-lato text-center text-red-500'>Incorrect code. Please try again.</h2> : null}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm pt-3">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">🔑</span>
                </div>
                <input
                  type="tel"
                  value={otp}
                  onChange={e => setOTP(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-12 sm:text-sm border-gray-300 rounded-xl transition ease-in-out"
                />
              </div>

              <div className="flex space-x-2 justify-center pt-4">
                <button
                  type="button"
                  className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={() => {
                    handleVerification();
                  }}
                >Submit</button>
              </div>
            </div>
          </>
          : null
        }

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )

}
