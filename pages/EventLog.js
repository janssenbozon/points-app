import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { authentication, database } from '../firebase/clientApp.ts';
import { getDatabase, ref, get, equalTo, query, set } from "firebase/database";
import styles from '../styles/Homepage.module.css';
import Error from './Error';

export default function Login() {
    const auth = useAuth();
    const router = useRouter();
    const events = auth.user.pastEvents ? Object.values(auth.user.pastEvents) : [];
    const cultureEvents = events.filter((event) => event.category == "Culture");
    const sportsEvents = events.filter((event) => event.category == "Sports");
    const communityEvents = events.filter((event) => event.category == "Community");
    const danceEvents = events.filter((event) => event.category == "Dance");

    console.log(events)
    console.log(sportsEvents)

    const EventTable = (props) => {

        console.log("Rendering event table for + " + props.title);
        console.log(props.events);

        return (
            <div className="pt-3">
                <h1 className='text-2xl font-bold font-lato'>{props.title}</h1>
                {props.events.length == 0 ? <p className='text-sm font-lato'>No events yet</p> :
                    <table className='table mx-auto'>
                        <thead>
                            <tr>
                                <th className='px-4 py-2'>Event</th>
                                <th className='px-4 py-2'>Date</th>
                                <th className='px-4 py-2'>Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.events.map((event) => {
                                return (
                                    <tr>
                                        <td className='border px-4 py-2'>{event.name}</td>
                                        <td className='border px-4 py-2'>{event.start.slice(6, 10)}</td>
                                        <td className='border px-4 py-2'>{event.points}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                }
            </div>
        );
    };

    const BackToHome = () => {
        return (
            <>
                <div className="container mx-auto pt-4">
                    <button type="button"
                        className="w-full px-6 py-2.5 bg-gray-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-red-500 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                        onClick={() => {
                            router.push("/Homepage")
                        }}
                    >Back to home</button>
                </div>
            </>
        )
    }

    return (
        <div className={`${styles.container} mx-auto`}>
            <main className={styles.main}>
                <div className="container mx-auto pt-2 text-center">
                    <p className="text-4xl font-bold font-lato">Event Log</p>
                    <div className="pt-3 pb-3">
                        <EventTable title="Sports" events={sportsEvents} />
                        <div className="divider"/>
                        <EventTable title="Culture" events={cultureEvents} />
                        <div className="divider"/>
                        <EventTable title="Community" events={communityEvents} />
                        <div className="divider"/>
                        <EventTable title="Dance" events={danceEvents} />
                    </div>
                    <BackToHome />
                </div>
            </main>
        </div>
    );
}
