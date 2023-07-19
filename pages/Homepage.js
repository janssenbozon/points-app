import styles from '../styles/Homepage.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import logoDark from '../public/logoDark.png';
import logoLight from '../public/logoLight.png';
import Image from 'next/image';
import { authentication } from '../firebase/clientApp.ts';
export default function Homepage() {

    const auth = useAuth();
    const user = auth.user;
    const router = useRouter();

    useEffect(() => {

        if (user) {
            auth.updateUser();
        }

    }, [authentication]);

    if (auth.loading || !user) {
        return (
            <div className={styles.main}>
                <span className="loading loading-spinner loading-lg" />
            </div>
        )
    }

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
                <h1 className='text-4xl font-bold font-lato text-white-400'>You&apos;re checked into</h1>
                <h1 className='text-4xl font-bold font-lato text-green-400'>{user.eventName}</h1>
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
                        className="w-full px-6 py-2.5 bg-red-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-red-500 hover:shadow-lg focus:bg-red-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-700 active:shadow-lg transition duration-150 ease-in-out"
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

    const EventLogButton = () => {
        return (
            <>
                <div className="container mx-auto pt-3">
                    <button type="button"
                        className="w-full px-6 py-2.5 bg-gray-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-gray-500 hover:shadow-lg focus:bg-gray-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={() => {
                            router.push("/EventLog")
                        }}
                    >Event Log</button>
                </div>
            </>
        )
    }

    return (

        <div className={styles.container}>
            <main className={styles.main}>
                <picture>
                    <source srcSet={logoLight} media="(prefers-color-scheme: dark)" />
                    <Image
                        src={logoDark}
                        width={100}
                        height={100}
                        alt="FSA Logo"
                    />
                </picture>
                <div className='container'>
                    <p className='text-xl font-bold font-lato'>Hi, {user.firstName}!</p>
                    {user.eventName == "NOT CHECKED IN" ? checkInComponent() : checkOutComponent()}
                </div>


                <div className="container mx-auto pt-2">
                    <h1 className=' w-full text-3xl font-bold font-lato pt-2 pb-2 text-start'>Point Summary</h1>
                    <div className="card w-full bg-base-300 shadow-xl px-4 py-4">
                        <div className="px-4 py-3">
                            <h1 className='text-2xl font-bold font-lato pb-2'>Goodphil 2023!</h1>
                            <progress className="progress progress-info w-full h-6" value={user.points.total} max="9"></progress>
                            <ProgressBar
                                category="Culture"
                                points={user.points.culture}
                                max={2}
                            />
                            <ProgressBar
                                category="Sports"
                                points={user.points.sports}
                                max={2}
                            />
                            <ProgressBar
                                category="Dance"
                                points={user.points.dance}
                                max={2}
                            />
                            <ProgressBar
                                category="Community"
                                points={user.points.community}
                                max={2}
                            />
                            <ProgressBar
                                category="Wildcard"
                                points={user.points.wildcard}
                                max={1}
                            />
                        </div>
                    </div>
                </div>
                <EventLogButton />
                <SignOutButton />
            </main>
        </div>
    )
}