import styles from '../styles/Homepage.module.css'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'

export default function Homepage() {

    const auth = useAuth();
    const user = auth.user;

    console.log(user);

    // Set initial state values conditionally
    const [totalPoints, setTotalPoints] = useState(0);
    const router = useRouter();

    async function updateData() {
        console.log("Updating user data");
        await auth.updateUser();
        console.log(user);
        setTotalPoints(
            user.points.community +
            user.points.sports +
            user.points.culture +
            user.points.dance
        );
        console.log("User data updated");
    };

    useEffect(() => {
        console.log("Loading user data");
        updateData();

        return () => {
            console.log(user)
            console.log("unmounting");
        }
    }, []);

    if (!user) {
        return <p>Loading...</p>; //TODO: Add loading screen
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
                <h1 className='text-4xl font-bold font-lato text-green-400'>You&apos;re checked into {user.eventName}</h1>
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
                    <p className='text-xl font-bold font-lato'>Hi, {user.firstName}!</p>
                    {user.eventName == "NOT CHECKED IN" ? checkInComponent() : checkOutComponent()}
                </div>


                <div className="container mx-auto pt-2">
                <h1 className=' w-full text-3xl font-bold font-lato pt-2 pb-2 text-start'>Point Summary</h1>
                    <div className="w-full overflow-hidden rounded-2xl shadow-lg bg-gray-200">
                        <div className="px-4 py-3">
                            <h1 className='text-2xl font-bold font-lato pb-2'>Goodphil 2023!</h1>
                            <progress className="progress progress-info w-full h-6" value={totalPoints} max="9"></progress>
                            <ProgressBar
                                category="Culture"
                                points={user.points.culture}
                                max={3}
                            />
                            <ProgressBar
                                category="Sports"
                                points={user.points.sports}
                                max={3}
                            />
                            <ProgressBar
                                category="Dance"
                                points={user.points.dance}
                                max={3}
                            />
                            <ProgressBar
                                category="Community"
                                points={user.points.community}
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