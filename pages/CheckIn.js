import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, getAuth } from "firebase/auth"
import { authentication } from '../firebase/clientApp.ts'
import React, { useState } from 'react';
import { getDatabase, ref, set, get } from "firebase/database";
import { Router, useRouter } from 'next/router'

export default function Login() {

  const [id, setId] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(true)
  const [showCodeScreen, setShowCodeScreen] = useState(true)


  // EVENT SPECIFIC DATA- LOADED AFTER CODE IS ENTERED
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [points, setPoints] = useState(0)

  function preCheckIn() {

    const eventRef = ref(database, 'events/' + id);

    eventRef.once('value')
      .then((snapshot) => {
        const eventData = snapshot.val();
        setStart(new Date(eventData.startTime));
        setEnd(new Date(eventData.endTime));
        setName(eventData.eventName);
        setCategory(eventData.eventCategory);
        setPoints(eventData.eventPoints);

        const currentDate = new Date();
        const currentTime = currentDate.getTime();

        if (currentTime >= eventStartTime.getTime() && currentTime <= eventEndTime.getTime()) {

          // confirm with user
          setShowConfirmation(true)

        } else {
          console.log('Not the correct time to check in.')
        }
      })
      .catch((error) => {
        console.error('Failed to fetch event data:', error);
      });

  }

  function checkIn() {

    // IN EVENTS
    const guestListRef = ref(database, 'events/' + id + '/guestList')

    guestListRef.push().set(authentication.currentUser.uid)
      .then(() => {
        console.log('User is added to guest list!')
      })
      .catch((error) => {
        console.error('Failed to add user to the guest list:', error);
      });
      
    // IN USERS
    const userRef = ref(database, 'users/' + authentication.currentUser.uid);

    userRef.update({
      eventId: id
    })
      .then(() => {
        console.log('User status checkd to checked in!')
      })
      .catch((error) => {
        console.error('Failed to update user\'s checked-in status:', error);
      });

  }

  const CodeScreen = () => {
    return (
        <>
          <h1 className="text-2xl font-bold font-lato text-center">
            Checking in?
          </h1>
          <h2 className='text-md font-bold font-lato text-center'>Enter the unique code for the event.</h2>
          <div>
            <div className="mt-1 relative rounded-md shadow-sm pt-3">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none" />
              <input
                type="tel"
                value={id}
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-11 pr-12 sm:text-sm border-gray-300 rounded-xl transition ease-in-out"
                placeholder="123456"
                onChange={e => setId(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 justify-center pt-4">
              <button
                type="submit"
                className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  setShowConfirmation(true);
                  setShowCodeScreen(false);
                }}
              >Check In</button>
            </div>
          </div>
        </>
    )
  }

  const ConfirmationScreen = () => {
    return (
      <>
        <h1 className="text-xl font-bold font-lato text-center">
          Looks like you're checking into:
        </h1>

        <h1 className="text-2xl text-lime-500 font-bold font-lato text-center">
          Volleyball Tryouts
        </h1>
        <h2 className='text-md font-bold font-lato text-center'>You gain 3 sports points from this.</h2>
        <div>
          <div className="flex space-x-2 justify-center pt-4">
            <button
              type="submit"
              className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                setShowConfirmation(true);
                setShowCodeScreen(false);
              }}
            >Continue</button>
            <button
              type="submit"
              className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                setShowConfirmation(true);
                setShowCodeScreen(false);
              }}
            >Return Home</button>
          </div>
        </div>
      </>
    )
  }

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

        { showCodeScreen ? <CodeScreen/> : null}

        { showConfirmation ? <ConfirmationScreen/> : null}

        <div id='recaptcha-container'></div>

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
