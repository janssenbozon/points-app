import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, set } from "firebase/database";
import { CheckCircleIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router';
import { authentication } from '../firebase/clientApp.ts';
import { useAuth } from '../hooks/useAuth'

// Prompt template for text input
const Prompt = (props) => {

    return (
        <div class="flex min-h-screen flex-col justify-center items-center p-24">
            <h1 className="text-2xl font-bold font-lato text-center">
                {props.largeText}
            </h1>
            <h2 className='text-md font-bold pb-4'>{props.smallText}</h2>
            <input
                type="text"
                value={props.value}
                class="input input-bordered w-full max-w-xs"
                onChange={e => props.inputFunction(e.target.value)}
            />

            <div className="flex flex-row space-x-2 justify-center align-middle pt-4">
                {props.showBackButton ? <button type="submit" className="btn" onClick={props.backFunction}>Back</button> : null}
                <button
                    type="submit"
                    className="btn"
                    onClick={props.screenFunction}
                >Next</button>
            </div>

            

        </div>
    )

}

// Prompt template for year input, requires multiple buttons so I had to make a separate component
const YearPrompt = (props) => {

    return (
        <div class="flex min-h-screen flex-col justify-center items-center p-24">
            <h1 className="text-2xl font-bold font-lato text-center">
                {props.largeText}
            </h1>
            <h2 className='text-md font-bold pb-4'>{props.smallText}</h2>
            <select className="select select-bordered w-full max-w-xs" value={props.value} onChange={(e) => props.inputFunction(e.target.value)}>
                <option disabled selected>Select your year</option>
                <option value="Freshman">Freshman</option>
                <option  value="Sophomore">Sophomore</option>
                <option  value="Junior">Junior</option>
                <option  value="Senior">Senior</option>
                <option  value="Graduate">Graduate</option>
            </select>
            <div className="flex space-x-2 justify-center pt-4">
                <button type="submit" className="btn" onClick={props.backFunction}>Back</button>
                <button
                    type="submit"
                    className="btn"
                    onClick={props.screenFunction}
                >Next</button>
            </div>
        </div>
    )

}

const FamPrompt = (props) => {

    return (
        <div class="flex min-h-screen flex-col justify-center items-center p-24">
            <h1 className="text-2xl font-bold font-lato text-center">
                {props.largeText}
            </h1>
            <h2 className='text-md font-bold pb-4'>{props.smallText}</h2>
            <select className="select select-bordered w-full max-w-xs" value={props.value} onChange={(e) => props.inputFunction(e.target.value)}>
                <option disabled selected>Select your big fam</option>
                <option value="Dora and Diego">Dora and Diego</option>
                <option  value="Backyardigans">Backyardigans</option>
                <option  value="Wonder Pets">Wonder Pets</option>
                <option  value="Sesame Street">Sesame Street</option>
                <option  value="I don'&apos;t know">I dont know</option>
            </select>
            <div className="flex space-x-2 justify-center pt-4">
                <button type="submit" className="btn" onClick={props.backFunction}>Back</button>
                <button
                    type="submit"
                    className="btn"
                    onClick={props.screenFunction}
                >Next</button>
            </div>
        </div>
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
                        class="btn"
                        onClick={props.screenFunction}
                    >Go to Homepage</button>
                </div>
            </div>
        </>
    )

}

async function writeNewUser(uid, phoneNumber, firstName, lastName, bigFam, year) {
    const db = getDatabase();

    try {
        // add to user list
        await set(ref(db, 'users/' + uid), {
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
                wildcard: 0,
            },
            eventId: "NOT CHECKED IN",
            eventName: "NOT CHECKED IN",
            pastEvents: "",
        });

        // add to phone number list
        await set(ref(db, 'phones/' + phoneNumber), uid);

        // add to names list
        await set(ref(db, 'names/' + firstName.toLowerCase() + " " + lastName.toLowerCase()), {
            [uid]: uid,
        });

        return true;
    } catch (error) {
        throw error;
    }
}

export default function CreateNewUser(props) {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [year, setYear] = useState("Freshman")
    const [bigFam, setBigFam] = useState("Dora and Diego")
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

        <div className="">
            <main className="">

                {screen == 1 ?
                    <div class="flex flex-col align-middle justify-center">
                        <Prompt
                            largeText="You're verified! Now let's get to know you better."
                            smallText="What's your first name?"
                            value={firstName}
                            inputFunction={setFirstName}
                            screenFunction={() => setScreen(2)}
                        />
                    </div>

                    : null

                }

                {screen == 2 ?

                    <Prompt
                        largeText={`Hi, ${firstName}!`}
                        smallText="What's your last name?"
                        value={lastName}
                        inputFunction={setLastName}
                        screenFunction={() => setScreen(3)}
                        showBackButton={true}
                        backFunction={() => setScreen(1)}
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
                        showBackButton={true}
                        backFunction={() => setScreen(2)}
                    />

                    : null

                }

                {screen == 4 ?

                    <FamPrompt
                        largeText={`Ok, last question.`}
                        smallText={`What big fam are you in?`}
                        value={bigFam}
                        inputFunction={setBigFam}
                        screenFunction={async () => {
                            const uid = authentication.currentUser.uid;
                            if (await writeNewUser(uid, phoneNumber, firstName, lastName, bigFam, year)) {
                                auth.updateUser()
                                setScreen(5)
                            } else {
                                alert("Something went wrong. Please reload the page and try again.")
                            }
                        }}
                        showBackButton={true}
                        backFunction={() => setScreen(3)}
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
