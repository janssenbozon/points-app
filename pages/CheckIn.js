import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { RecaptchaVerifier, signInWithPhoneNumber, onAuthStateChanged, getAuth } from "firebase/auth"
import { authentication, database } from '../firebase/clientApp.ts'
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, get, onValue, push, update } from "firebase/database";
import { useAuth } from '../hooks/useAuth'
import { Router, useRouter } from 'next/router'

export default function Login() {

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showCodeScreen, setShowCodeScreen] = useState(true)
  const [showCheckedIn, setShowCheckedIn] = useState(false)
  const [invalidCode, setInvalidCode] = useState(false)
  const [invalidTime, setInvalidTime] = useState(false)
  const [checkedIn, setCheckedIn] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter();
  const auth = useAuth();

  // EVENT SPECIFIC DATA- LOADED AFTER CODE IS ENTERED
  const [eventID, setEventID] = useState(null)
  const [event, setEvent] = useState(null);

  async function fetchEventData(id) {
  return new Promise(async (resolve, reject) => {
    setCheckedIn(false);
    setInvalidCode(false);
    setInvalidTime(false);
    setError(false);

    console.log("Ref = events/" + id);

    if (id.length !== 6) {
      console.log("Invalid code length");
      resolve("Invalid code");
    }

    try {
      
      const eventRef = ref(database, 'events/' + id);
      console.log("Event ref = " + eventRef);
      const eventSnapshot = await get(eventRef);

      if (!eventSnapshot.exists()) {
        console.log("Event does not exist");
        resolve("Invalid code");
        return;
      }

      const userRef = ref(database, 'users/' + authentication.currentUser.uid + '/pastEvents/' + id);
      console.log("User ref = " + userRef);
      const userSnapshot = await get(userRef);

      if (userSnapshot.exists()) {
        console.log("User already checked in");
        resolve("Checked in");
        return;
      }
      console.log("User not checked in");

      const eventData = eventSnapshot.val();
      console.log(eventData);
      setEvent(eventData);
      console.log("Event data loaded");
      resolve(eventData);
    } catch (error) {
      console.log("Error fetching data:", error);
      resolve("Error");
    }
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
      console.log('Not the correct time to check in.');
      return false
    }

  }


  // Add the user to the guest list and update their checked-in status
  function checkIn() {
    return new Promise((resolve, reject) => {

      const uid = authentication.currentUser.uid;

      // TODO: Check if user is already checked in, if user's event id is 000000 they are not checked in.

      console.log("Updating user's checked-in status...");

      // IN USERS    
      const updates = {};

      updates['/users/' + uid + '/eventId'] = eventID;
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
          {invalidCode ? <h3 className='text-md font-bold font-lato text-center text-red-500'>Invalid code.</h3> : null}
          {invalidTime ? <h3 className='text-md font-bold font-lato text-center text-red-500'>Not the correct time to check in.</h3> : null}
          {checkedIn ? <h3 className='text-md font-bold font-lato text-center text-red-500'>You checked into this event already.</h3> : null}
          {error ? <h3 className='text-md font-bold font-lato text-center text-red-500'>There was a problem fetching the event.</h3> : null}
          <div className="mt-1 relative rounded-md shadow-sm pt-3">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-center pointer-events-none" />
            <input
              type="tel"
              value={id}
              className="input w-full"
              placeholder="Enter code here"
              onChange={(e) => setId(e.target.value)}
            />
          </div>

          <div className="flex space-x-2 justify-center pt-4">
            <button
              className='btn'
              type="submit"
              onClick={() => router.push('/Homepage')}
            >Return home</button>
            <button
              type="submit"
              className="btn"
              onClick={async () => {
                const eventData = await fetchEventData(id);
                if(eventData == "Invalid code") {
                  setInvalidCode(true)
                } else if (eventData == "Checked in") {
                  setCheckedIn(true)
                } else if (eventData == "Error") {
                  setError(true)
                } else {
                  if (await checkTime(eventData)) {
                    setEventID(id)
                    setShowCodeScreen(false)
                    setShowConfirmation(true)
                  } else {
                    setInvalidTime(true)
                  }
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
          Looks like you&apos;re checking into:
        </h1>

        <h1 className="text-2xl text-green-400 font-bold font-lato text-center">
          {event.name}
        </h1>
        <h2 className='text-md font-bold font-lato text-center'>You gain {event.points} {event.category} points from this.</h2>
        <div>
          <div className="flex space-x-2 justify-center pt-4">
            <button
              type="submit"
              className='btn'
              onClick={() => {
                router.push('/Homepage');
              }}
            >Return Home</button>
            <button
              type="submit"
              className='btn'
              onClick={() => {
                checkIn().then(() => {
                  setShowConfirmation(false);
                  setShowCodeScreen(false);
                  setShowCheckedIn(true);
                })
              }}
            >Continue</button>
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
        <h2 className='text-md font-bold font-lato text-center'>You&apos;re checked in.</h2>
        <div>
          <div className="flex space-x-2 justify-center pt-4">
            <button
              type="submit"
              className='btn'
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
    </div>
  )

}
