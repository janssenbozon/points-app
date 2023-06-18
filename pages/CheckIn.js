import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, getAuth } from "firebase/auth"
import { authentication, database } from '../firebase/clientApp.ts'
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, onValue } from "firebase/database";
import { Router, useRouter } from 'next/router'

export default function Login() {

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCodeScreen, setShowCodeScreen] = useState(true)

  // EVENT SPECIFIC DATA- LOADED AFTER CODE IS ENTERED
  const [start, setStart] = useState(new Date())
  const [end, setEnd] = useState(new Date())
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [points, setPoints] = useState(0)

  function fetchEventData(id) {

    console.log("Ref = events/" + id)

    const eventRef = ref(database, 'events/' + id);

    get(eventRef).then((snapshot) => {
      const eventData = snapshot.val();

      console.log(eventData)
      setStart(new Date(eventData.start));
      setEnd(new Date(eventData.end));
      setName(eventData.name);
      setCategory(eventData.category);
      setPoints(eventData.points);
    });
  }

  function checkTime() {
    const currentDate = new Date();
    const startTime = start.getTime();
    const endTime = end.getTime();
    const currentTime = currentDate.getTime();
  
    if (currentTime >= startTime && currentTime <= endTime) {
      console.log("Time correct!");
      return true
    } else {
      console.log('Not the correct time to check in.');
      console.log('currentTime = ' + currentTime);
      console.log('startTime = ' + startTime);
      console.log('endTime = ' + endTime);
      return false
    }
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

    const [id, setId] = useState("")

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
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-xl transition ease-in-out"
                placeholder="123456"
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            <div className="flex space-x-2 justify-center pt-4">
              <button
                type="submit"
                className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                onClick={() => {
                  fetchEventData(id)
                  if(checkTime()) {
                    showCodeScreen(false)
                    showConfirmation(true)
                  } else {

                  }
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
          {name}
        </h1>
        <h2 className='text-md font-bold font-lato text-center'>You gain {points} {category} points from this.</h2>
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
