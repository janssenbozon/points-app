import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Homepage.module.css'
import { useEffect, useState } from 'react';
import { authentication } from '../firebase/clientApp.ts';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/clientApp.ts';
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

export default function Homepage() {

    const auth = useAuth();
    const user = auth.user;
    const userUID = user ? user.uid : null;

    if (!userUID) {
        return <p>Loading...</p>; //TODO: Add loading screen
    }
    console.log(user);

    const [culturePoints, setCulturePoints] = useState(0);
    const [sportsPoints, setSportsPoints] = useState(0);
    const [communityPoints, setCommunityPoints] = useState(0);
    const [dancePoints, setDancePoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [currentEvent, setCurrentEvent] = useState("");
    const router = useRouter();
    
    useEffect(() => {

        console.log("Loading user data");

        const updateData = async () => {
            try {
                console.log("Updating user data");
                await auth.updateUser();
                console.log(user);
                console.log(user.firstName);
                console.log(user.lastName);
                console.log(user.points.sports);
                setFirstName(user.firstName);
                setLastName(user.lastName);
                setCommunityPoints(user.points.community);
                setSportsPoints(user.points.sports);
                setCulturePoints(user.points.culture);
                setCurrentEvent(user.eventName);
                setDancePoints(user.points.dance);
                setTotalPoints(
                    user.points.community +
                    user.points.sports +
                    user.points.culture +
                    user.points.dance
                );
                console.log("User data updated");
            } catch (error) {
                alert("Error updating user data");
            }
        }

        updateData();

        return () => {
            console.log(user)
            console.log("unmounting");
        }

    }, []);

    const ProgressBar = (props) => {
        return (
            <>
                <h1 className='text-lg font-bold font-lato pb-1'>{props.category} Points</h1>
                <div className='flex flex-row content-center'>
                    <div className='basis-5/6'>
                        <progress className="progress progress-info w-full h-4" value={props.points} max={props.max}></progress>
                    </div>
                    <div className='basis-1/6'>
                        <p className='text-center align-middle font-bold'>{props.points}/{props.max}</p>
                    </div>
                </div>
            </>
        )
    }

    const MemberID = () => {
        return (
            <>
                <h1 className=' w-full text-3xl font-bold font-lato pt-2 text-start'>Member ID</h1>
                <div className="container mx-auto pt-2">
                    <div className="w-full overflow-hidden rounded-2xl shadow-lg bg-gray-200 place-content-center">
                        <img className='p-10' src='https://pngimg.com/uploads/qr_code/qr_code_PNG14.png'></img>
                    </div>
                </div>
            </>
        )
    }

    const checkInComponent = () => {
        return (
            <>
                <h1 className='text-4xl font-bold font-lato'>At an event?</h1>
                <div className="container mx-auto pt-3">
                    <button
                        type="button"
                        className="w-full px-6 py-2.5 bg-green-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={() => router.push("/CheckIn")}>Check-in</button>
                </div>
            </>
        )
    }

    const checkOutComponent = () => {
        return (
            <>
                <h1 className='text-4xl font-bold font-lato'>You're checked into {currentEvent}</h1>
                <div className="container mx-auto pt-3">
                    <button type="button"
                        className="w-full px-6 py-2.5 bg-green-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={() => router.push("/CheckOut")}
                    >Check-out</button>
                </div>
            </>
        )
    }

    const SignOutButton = () => {
        return (
            <>
                <div className="container mx-auto pt-3">
                    <button type="button"
                        className="w-full px-6 py-2.5 bg-red-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-red-500 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={() => {
                            auth.signout().then(() => {
                                router.push("/Login")
                            }).catch(() => {
                                alert("Error signing out")
                            });
                        }}
                    >Sign-out</button>
                </div>
            </>
        )
    }

    return (

        <div className={styles.container}>
            <main className={styles.main}>
                <div className='container'>
                    <p className='text-xl font-bold font-lato'>Hi, {firstName}!</p>
                    {currentEvent == "NOT CHECKED IN" ? checkInComponent() : checkOutComponent()}
                </div>


                <h1 className=' w-full text-3xl font-bold font-lato pt-2 text-start'>Point Summary</h1>
                <div className="container mx-auto pt-2">
                    <div class="w-full overflow-hidden rounded-2xl shadow-lg bg-gray-200">
                        <div class="px-4 py-3">
                            <h1 className='text-2xl font-bold font-lato pb-2'>Goodphil 2023!</h1>
                            <progress className="progress progress-info w-full h-6" value={totalPoints} max="9"></progress>
                            <ProgressBar
                                category="Culture"
                                points={culturePoints}
                                max={3}
                            />
                            <ProgressBar
                                category="Sports"
                                points={sportsPoints}
                                max={3}
                            />
                            <ProgressBar
                                category="Dance"
                                points={dancePoints}
                                max={3}
                            />
                            <ProgressBar
                                category="Community"
                                points={communityPoints}
                                max={3}
                            />
                        </div>
                    </div>
                </div>
                <SignOutButton />
            </main>
        </div>
    )
}