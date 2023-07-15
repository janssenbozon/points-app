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
    const [currentPoints, setCurrentPoints] = useState(0);
    const [showConfirmation, setShowConfirmation] = useState(true)
    const [showCompletion, setShowCompletion] = useState(false)
    const [eventId, setEventId] = useState(null)
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
        // TODO: Move pastEvents here

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
                            className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
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
                            className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                            onClick={() => {
                                router.push('/Homepage')
                            }}
                        >Return to Home</button>
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

                {showConfirmation ? <ConfirmationScreen /> : null}

                {showCompletion ? <CompletionScreen /> : null}

                <div id='recaptcha-container'></div>

            </main>
        </div>
    )

}
