import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Homepage.module.css'
import { useEffect, useState } from 'react';
import { authentication } from '../firebase/clientApp.ts';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebase/clientApp.ts';

export default function Homepage() {
    
    const userUID = authentication.currentUser.uid;

    const [culturePoints, setCulturePoints] = useState(0);
    const [sportsPoints, setSportsPoints] = useState(0);
    const [communityPoints, setCommunityPoints] = useState(0);
    const [dancePoints, setDancePoints] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        const userRef = ref(database, 'users/' + userUID);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          console.log(data);
          setFirstName(data.firstName);
          setLastName(data.lastName);
          setCommunityPoints(data.points.community)
          setSportsPoints(data.points.sports)
          setCulturePoints(data.points.culture)
          setDancePoints(data.points.dance)
          setTotalPoints(data.points.total)
        });
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

    return (

        <div className={styles.container}>
            <main className={styles.main}>
                <div className='container'>
                    <p className='text-xl font-bold font-lato'>Hi, {firstName}!</p>
                    <h1 className='text-4xl font-bold font-lato'>At an event?</h1>           
                </div>

                <div className="container mx-auto pt-3">
                    <button type="button" className="w-full px-6 py-2.5 bg-green-400 text-white font-medium text-sm leading-tight uppercase rounded-xl shadow-md hover:bg-green-500 hover:shadow-lg focus:bg-green-500 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out">Check-in</button>
                </div>

                <h1 className=' w-full text-3xl font-bold font-lato pt-2 text-start'>Point Summary</h1>
                <div className="container mx-auto pt-2">
                    <div class="w-full overflow-hidden rounded-2xl shadow-lg bg-gray-200">
                        <div class="px-4 py-3">
                            <h1 className='text-2xl font-bold font-lato pb-2'>Goodphil 2023!</h1>      
                            <progress className="progress progress-info w-full h-6" value={totalPoints} max="100"></progress>
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
                <MemberID/>
            </main>
        </div>
    )
}