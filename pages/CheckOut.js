import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { authentication, database } from '../firebase/clientApp.ts'
import React, { useState, useEffect } from 'react';
import { get, push, update, ref, set} from "firebase/database";
import { useRouter } from 'next/router'

export default function Login() {

    const router = useRouter();
    const [event, setEvent] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showCompletion, setShowCompletion] = useState(false)
    const [showForfeit, setShowForfeit] = useState(false)
    const [showCodeScreen, setShowCodeScreen] = useState(false)
    const [invalidCode, setInvalidCode] = useState(false)
    const [eventID, setEventID] = useState(null)
    const uid = authentication.currentUser.uid;

    // Load event data from firebase before rendering
    useEffect(() => {

        console.log("Loading event data");

        // Get eventId from user data
        let eventId = "";
        const userRef = ref(database, 'users/' + authentication.currentUser.uid);
        get(userRef)
            .then((snapshot) => {
                const data = snapshot.val();
                console.log(data);
                eventId = data.eventId;
                setEventID(eventId);
                setUser(data);
            })
            .catch((error) => {
                console.error('Failed to fetch user data:', error);
            });

        // Get event data from eventId
        // TODO: Data is fetched as a nested object unlike in CheckIn.js idk why but try and fix later
        const eventRef = ref(database, 'events/' + eventId);
        get(eventRef)
            .then((snapshot) => {
                const data = snapshot.val();
                setEvent(data[eventId]);
                console.log(data[eventId]);
            })
            .catch((error) => {
                console.error('Failed to fetch event data:', error);
            });

        console.log("Event data loaded");
        setLoading(false);
        setShowCodeScreen(true);

    }, []);

    // Add the user to the guest list and update their checked-in status, also update points
    function checkOut() {

        console.log("Checking out user");

        const uid = authentication.currentUser.uid;

        // IN USERS
        const updates = {};
        const category = event.category.toLowerCase();
        console.log("Category = " + category);
        const points = user.points[category] + event.points;
        console.log("Points = " + points);

        updates['/users/' + uid + '/eventId'] = "NOT CHECKED IN";
        updates['/users/' + uid + '/eventName'] = "NOT CHECKED IN";
        updates['/users/' + uid + '/points/' + category] = points;
        updates['/users/' + uid + '/pastEvents/' + eventID] = {
            name: event.name,
            start: event.start,
            points: event.points,
            category: event.category
        };
        updates['/events/' + eventID + '/attendees/' + uid] = { name: user.firstName + " " + user.lastName, uid: uid };


        // update the user's checked-in status
        update(ref(database), updates)
            .then(() => {
                console.log('User status changed to checked out!')
            })
            .catch((error) => {
                console.error('Failed to update user\'s status:', error);
            });

    }

    // Confirmation screen: displays the event name and points gained, asks user to confirm their check-out
    const ConfirmationScreen = () => {

        if (event === null) {
            return <div>Loading...</div>; // Display loading message or placeholder
        }

        console.log(event);

        return (
            <>
                <h1 className="text-2xl font-bold font-lato text-center">
                    You&apos;re checking out of {event.name}.
                </h1>
                <h2 className='text-md font-bold font-lato text-center'>You&apos;ll gain {event.points} {event.category} points from this event.</h2>
                <div>
                    <div className="flex space-x-2 justify-center pt-4">
                        <button
                            type="submit"
                            className='btn'
                            onClick={() => {
                                checkOut();
                                setShowConfirmation(false);
                                setShowCompletion(true);
                            }}
                        >Finish check out</button>
                    </div>
                </div>
            </>
        )
    }

    const ForfeitScreen = () => {
        return (
            <>
                <h1 className="text-2xl font-bold font-lato text-center">
                    You&apos;re forfeiting your points from {event.name}.
                </h1>
                <h2 className='text-md font-bold font-lato text-center'>You&apos;ll lose {event.points} {event.category} points from this event.</h2>
                <div>
                    <div className="flex space-x-2 justify-center pt-4">

                        { loading ? <div>Loading...</div> :
                        <button
                            type="submit"
                            className='btn btn-error'
                            onClick={() => {
                                setShowForfeit(false);
                                setLoading(true);

                                const updates = {};
                                updates['/users/' + uid + '/eventId'] = "NOT CHECKED IN";
                                updates['/users/' + uid + '/eventName'] = "NOT CHECKED IN";
                                updates['/users/' + uid + '/pastEvents/' + eventID] = {
                                    name: event.name + " (FORFEITTED)",
                                    start: event.start,
                                    points: 0,
                                    category: event.category
                                };

                                update(ref(database), updates).then(() => {
                                    setShowCompletion(true);
                                }).catch((error) => {
                                    console.error('Failed to update user\'s status:', error);
                                });

                            }}
                        >Forfeit and check out</button>
                        }
                    </div>
                    <div className="flex space-x-2 justify-center pt-4">
                        <button
                            type="submit"
                            className='btn'
                            onClick={() => {
                                setShowForfeit(false);
                                setShowCodeScreen(true);
                            }}
                        >Back</button>
                    </div>
                    
                </div>
            </>
        )
    }

    // Completion out screen: alerts the user that the check out process is complete
    const CompletionScreen = () => {
        return (
            <>
                <h1 className="text-2xl font-bold font-lato text-center">
                    You&apos;re checked out!
                </h1>
                <div>
                    <div className="flex space-x-2 justify-center pt-4">
                        <button
                            type="submit"
                            className='btn'
                            onClick={() => {
                                router.push('/Homepage')
                            }}
                        >Return to Home</button>
                    </div>
                </div>
            </>
        )
    }

    const CodeScreen = () => {

        const [id, setId] = useState("")

        if (event === null) {
            return <div>Loading...</div>; // Display loading message or placeholder
        }

    return (
      <>
        <h1 className="text-lg font-bold font-lato text-center">
          Please enter the checkout code for:
        </h1>
        <h1 className="text-2xl text-green-400 font-bold font-lato text-center">{event.name}</h1>
          {invalidCode ? <h3 className='text-md font-bold font-lato text-center text-red-500'>Invalid code.</h3> : null}
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

          <div className="flex flex-col space-y-2 justify-center pt-4">
            <button
              type="submit"
              className="btn btn-success"
              onClick={() => {
                console.log("Checking code")
                if(id == event.endCode) {
                    console.log("Code is correct")
                    setShowCodeScreen(false)
                    setShowConfirmation(true)
                } else {
                    setInvalidCode(true)
                }
              }}
            >Check Out</button>
            <button
                className='btn btn-error'
                type="submit"
                onClick={() => {
                    setShowCodeScreen(false)
                    setShowForfeit(true)
                }}
            >I don't know the code!</button>
            <button
              className='btn'
              type="submit"
              onClick={() => router.push('/Homepage')}
            >Return home</button>
          </div>
      </>
    )

    }


    return (

        <div className={styles.container}>
            <main className={styles.main}>

                {loading ? <div>Loading...</div> : null}

                {showCodeScreen ? <CodeScreen /> : null}

                {showForfeit ? <ForfeitScreen /> : null}

                {showConfirmation ? <ConfirmationScreen /> : null}

                {showCompletion ? <CompletionScreen /> : null}

                <div id='recaptcha-container'></div>

            </main>
        </div>
    )

}
