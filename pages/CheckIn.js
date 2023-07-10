import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, getAuth } from "firebase/auth"
import { authentication, database } from '../firebase/clientApp.ts'
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, onValue, push, update } from "firebase/database";
import { Router, useRouter } from 'next/router'

export default function Login() {

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCodeScreen, setShowCodeScreen] = useState(true)
  const [showCheckedIn, setShowCheckedIn] = useState(false)
  const router = useRouter();

  // EVENT SPECIFIC DATA- LOADED AFTER CODE IS ENTERED
  const [eventID, setEventID] = useState(null)
  const [event, setEvent] = useState(null);

  function fetchEventData(id) {
    return new Promise((resolve, reject) => {
      console.log("Ref = events/" + id);

      const eventRef = ref(database, 'events/' + id);

      get(eventRef)
        .then((snapshot) => {
          const eventData = snapshot.val();
          console.log(eventData);
          setEvent(eventData);
          resolve(eventData);
        })
        .catch((error) => {
          console.error('Failed to fetch event data:', error);
          reject(error); // Reject the promise if an error occurs
        });
    });
  }

  async function checkTime(eventData) {

    console.log("event = " + eventData)

    const currentDate = new Date();
    const startDate = new Date(eventData.start);
    const endDate = new Date(eventData.end);
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const currentTime = currentDate.getTime();

    // print times
    console.log("Start time: " + startDate);
    console.log("End time: " + endDate);
    console.log("Current time: " + currentDate);

    if (currentTime >= startTime && currentTime <= endTime) {
      console.log("Time correct!");
      return true
    } else {
      console.log('3 Not the correct time to check in.');
      return false
    }

  }


  // Add the user to the guest list and update their checked-in status
  function checkIn() {
    return new Promise((resolve, reject) => {
      console.log("Checking in user to path " + 'events/' + eventID + '/guestList/');

      const uid = authentication.currentUser.uid;

      // TODO: Check if user is already checked in, if user's event id is 000000 they are not checked in.

      // IN EVENTS
      const guestListRef = ref(database, 'events/' + eventID + '/guestList/');

      // push the user's uid to the guest list
      const key = push(guestListRef, authentication.currentUser.uid).key;

      console.log("Added user to guest list with key " + key);
      console.log("Updating user's checked-in status...");

      // IN USERS    
      const updates = {};

      updates['/users/' + uid + '/eventId'] = eventID;
      updates['/users/' + uid + '/eventRef'] = key;
      updates['/users/' + uid + '/eventName'] = event.name;

      // update the user's checked-in status
      update(ref(database), updates)
        .then(() => {
          console.log('User status changed to checked in!');
          resolve();
        })
        .catch((error) => {
          console.error('Failed to update user\'s checked-in status:', error);
          reject(error);
        });
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
              onClick={async () => {
                const eventData = await fetchEventData(id);
                if (checkTime(eventData)) {
                  setEventID(id)
                  setShowCodeScreen(false)
                  setShowConfirmation(true)
                } else {
                  // TODO: display error message
                }
              }}
            >Check In</button>
          </div>
        </div>
      </>
    )
  }

  const handleReturnHome = () => {

    router.push('/Homepage');
  }

  // Confirmation screen: displays the event name and points gained, asks user to confirm their check-in
  const ConfirmationScreen = () => {
    return (
      <>
        <h1 className="text-xl font-bold font-lato text-center">
          Looks like you're checking into:
        </h1>

        <h1 className="text-2xl text-lime-500 font-bold font-lato text-center">
          {event.name}
        </h1>
        <h2 className='text-md font-bold font-lato text-center'>You gain {event.points} {event.category} points from this.</h2>
        <div>
          <div className="flex space-x-2 justify-center pt-4">
            <button
              type="submit"
              className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                checkIn().then(() => {
                  setShowConfirmation(false);
                  setShowCodeScreen(false);
                  setShowCheckedIn(true);
                })
              }}
            >Continue</button>
            <button
              type="submit"
              className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                router.push('/Homepage');
              }}
            >Return Home</button>
          </div>
        </div>
      </>
    )
  }

  // Checked in screen: alerts the user that the check in process is complete
  const CheckedInScreen = () => {
    return (
      <>
        <h1 className="text-2xl font-bold font-lato text-center">
          Success!
        </h1>
        <h2 className='text-md font-bold font-lato text-center'>You're checked in.</h2>
        <div>
          <div className="flex space-x-2 justify-center pt-4">
            <button
              type="submit"
              className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
              onClick={() => {
                router.push('/Homepage')
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

        {showCodeScreen ? <CodeScreen /> : null}

        {showConfirmation ? <ConfirmationScreen /> : null}

        {showCheckedIn ? <CheckedInScreen /> : null}

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
