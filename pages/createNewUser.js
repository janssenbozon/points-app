import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set } from "firebase/database";
import { CheckCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router';
import { authentication } from '../firebase/clientApp.ts';
import { useAuth } from '../hooks/useAuth'

// Prompt template for text input
const Prompt = (props) => {

    return (
        <>
            <h1 className="text-2xl font-bold font-lato text-center">
                {props.largeText}
            </h1>
            <h2 className='text-md font-bold font-lato text-center'>{props.smallText}</h2>
            <div>
                <div className="mt-1 relative rounded-md shadow-sm pt-3">
                    <input
                        type="text"
                        value={props.value}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block pl-11 pr-12 sm:text-sm border-gray-300 rounded-xl transition ease-in-out"
                        onChange={e => props.inputFunction(e.target.value)}
                    />
                </div>

                <div className="flex space-x-2 justify-center pt-4">
                    <button
                        type="submit"
                        className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={props.screenFunction}
                    >Next</button>
                </div>
            </div>

        </>
    )

}

// Prompt template for year input, requires multiple buttons so I had to make a separate component
const YearPrompt = (props) => {

    return (
        <>
            <h1 className="text-2xl font-bold font-lato text-center">
                {props.largeText}
            </h1>
            <h2 className='text-md font-bold font-lato text-center'>{props.smallText}</h2>
            <div className="flex space-x-2 justify-center pt-4">
                <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                    onClick={() => {
                        console.log("Logging freshman.")
                        props.inputFunction("Freshman");
                    }}
                >Freshman</button>
            </div>
            <div className="flex space-x-2 justify-center pt-4">
                <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                    onClick={() => {
                        props.inputFunction("Sophomore");
                    }}
                >Sophomore</button>
            </div>
            <div className="flex space-x-2 justify-center pt-4">
                <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                    onClick={() => {
                        props.inputFunction("Junior");
                    }}
                >Junior</button>
            </div>
            <div className="flex space-x-2 justify-center pt-4">
                <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                    onClick={() => {
                        props.inputFunction("Senior");
                    }}
                >Senior</button>
            </div>
            <div className="flex space-x-2 justify-center pt-4">
                <button
                    type="submit"
                    className="inline-block px-6 py-2.5 bg-green-500 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md"
                    onClick={() => {
                        props.screenFunction();
                    }}
                >Next</button>
            </div>
        </>
    )

}

// Confirmation screen template
const ConfirmationScreen = (props) => {

    return (
        <>
            <div>
                <CheckCircleIcon className='h-full w-full text-green-400'></CheckCircleIcon>
            </div>
            <h1 className="text-2xl font-bold font-lato text-center">
                {props.largeText}
            </h1>
            <h2 className='text-md font-bold font-lato text-center'>{props.smallText}</h2>
            <div>
                <div className="flex space-x-2 justify-center pt-4">
                    <button
                        type="submit"
                        className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={props.screenFunction}
                    >Go to Homepage</button>
                </div>
            </div>
        </>
    )

}

function writeNewUser(uid, phoneNumber, firstName, lastName, bigFam, year) {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        set(ref(db, 'users/' + uid), {
            uid: uid,
            phoneNumber: phoneNumber,
            firstName: firstName,
            lastName: lastName,
            year: year,
            bigFam: bigFam,
            points: {
                culture: 0,
                community: 0,
                sports: 0,
                dance: 0,
                total: 0,
            },
            eventId: "NOT CHECKED IN",
            eventName: "NOT CHECKED IN",
            eventRef: "NOT CHECKED IN",
        }).then(() => {
            resolve(true);
        }).catch((error) => {
            reject(error);
        });
    });
}

export default function CreateNewUser(props) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [year, setYear] = useState("")
    const [bigFam, setBigFam] = useState("")
    const [screen, setScreen] = useState(1)
    const router = useRouter();
    const auth = useAuth();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [uid, setUid] = useState("")

    // get the phone number from the URL
    useEffect(() => {
        setPhoneNumber(router.query.phoneNumber);
    }, [router.query])

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

                {screen == 1 ?

                    <Prompt
                        largeText="You're verified! Now let's get to know you better."
                        smallText="What's your first name?"
                        value={firstName}
                        inputFunction={setFirstName}
                        screenFunction={() => setScreen(2)}
                    />

                    : null

                }

                {screen == 2 ?

                    <Prompt
                        largeText={`Hi, ${firstName}!`}
                        smallText="What's your last name?"
                        value={lastName}
                        inputFunction={setLastName}
                        screenFunction={() => setScreen(3)}
                    />

                    : null

                }

                {screen == 3 ?

                    <YearPrompt
                        largeText={`Got it. Next question:`}
                        smallText={`What year are you in?`}
                        value={year}
                        inputFunction={setYear}
                        screenFunction={() => setScreen(4)}
                    />

                    : null

                }

                {screen == 4 ?

                    <Prompt
                        largeText={`Ok, last question.`}
                        smallText="What big fam are you in?"
                        value={bigFam}
                        inputFunction={setBigFam}
                        screenFunction={async () => {
                            const uid = authentication.currentUser.uid;
                            if (await writeNewUser(uid, phoneNumber, firstName, lastName, bigFam, year) && await auth.updateUser()) {
                                setScreen(5)
                            } else {
                                alert("Something went wrong. Please try again.")
                            }
                        }}
                    />

                    : null

                }

                {screen == 5 ?

                    <ConfirmationScreen
                        largeText={`You're in!`}
                        smallText="You're registered for the 23-24 school year."
                        screenFunction={() => {
                            console.log("Redirecting to home")
                            router.push('/Homepage')
                        }
                        }
                    />

                    : null

                }

            </main>
        </div>
    )

}
