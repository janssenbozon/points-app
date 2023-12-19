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
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [otp, setOTP] = useState("")
  const auth = useAuth()
  const router = useRouter()

  const handleVerification = async () => {
    setIncorrectCode(false);
    setLoading(true);
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
      }
      setLoading(false);
    } catch (error) {
      console.log(error)
      setError(error.code);
      setLoading(false);
    }
  };

  const handlePhoneInput = async () => {

    setLoading(true);

    auth.generateRecaptcha(); // Initialize reCAPTCHA on component mount

    console.log("Phone number: " + phoneNumber)

    if (phoneNumber.length !== 10) {
      setError("auth/invalid-phone-number");
      setLoading(false);
      return;
    }

    try {
      var result = await auth.requestOTP(phoneNumber);
      setPhoneInputShown(false);
      setCodeInputShown(true);
      setLoading(false);
    } catch (error) {
      setError(error.code);
      setLoading(false);
    }

  };

  // TODO: Break down into components
  return (

    <div className={styles.container}>
      <main className={styles.main}>

        {phoneInputShown === true ?
          <>
            <h1 className="text-2xl font-bold font-lato text-center">
              Hey there! 👋🏼  Welcome to UTFSA! 🇵🇭
            </h1>
            <h2 className='text-md font-bold font-lato text-center'>To get started, enter your phone number.</h2>
            {error === null ? null : <h2 className='text-md font-bold font-lato text-center text-red-500'>Something went wrong. Please try again. Error code: {error} </h2>}
            <div>
              <div className="mt-1 relative rounded-md shadow-sm pt-3">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">📞</span>
                </div>
                <input
                  type="tel"
                  id='phoneInput'
                  value={phoneNumber}
                  className="input input-bordered w-full pl-11 pr-12"
                  placeholder="(000) 000 - 0000"
                  onChange={e => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="flex space-x-2 justify-center pt-4">
                {loading === true ? <span className="loading loading-spinner loading-lg"></span> :
                <button
                  type="submit"
                  className="btn"
                  onClick={(e) => {
                    handlePhoneInput();
                  }}
                >Submit</button>
                }
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
            {error === null ? null : <h2 className='text-md font-bold font-lato text-center text-red-500'>Something went wrong. Please try again. Error code: {error} </h2>}<div>
              <div className="mt-1 relative rounded-md shadow-sm pt-3">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">🔑</span>
                </div>
                <input
                  type="tel"
                  value={otp}
                  id='otpInput'
                  onChange={e => setOTP(e.target.value)}
                  className="input input-bordered w-full pl-11 pr-12"
                />
              </div>

              <div className="flex space-x-2 justify-center pt-4">
                {loading === true ? <span className="loading loading-spinner loading-lg"></span> :
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    handleVerification();
                  }}
                >Submit</button>
                }
              </div>
            </div>
          </>
          : null
        }

      </main>
    </div>
  )

}
