import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Homepage.module.css'

export default function Homepage() {
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
                <div className='container'>
                    <p className='text-xl font-bold font-lato'>Hi Janssen!</p>
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
                            <div className='w-full bg-gray-400 h-5 mb-2 rounded-full'>
                                <div className='bg-blue-400 h-5 rounded-full w-3/4'></div>
                            </div>
                            <h1 className='text-lg font-bold font-lato pb-1'>Culture Points</h1>
                            <div className='flex flex-row content-center'>
                                <div className='basis-5/6'>
                                    <div className='w-full bg-gray-400 h-5 mb-2 rounded-full'>
                                        <div className='bg-blue-400 h-5 rounded-full w-3/4'></div>
                                    </div>
                                </div>
                                <div className='basis-1/6'>
                                    <p className='text-center align-middle font-bold'>2/3</p>
                                </div>
                            </div>           
                            <h1 className='text-lg font-bold font-lato pb-1'>Sports Points</h1>
                            <div className='flex flex-row content-center'>
                                <div className='basis-5/6'>
                                    <div className='w-full bg-gray-400 h-5 mb-2 rounded-full'>
                                        <div className='bg-blue-400 h-5 rounded-full w-3/4'></div>
                                    </div>
                                </div>
                                <div className='basis-1/6'>
                                    <p className='text-center align-middle font-bold'>2/3</p>
                                </div>
                            </div>           
                            <h1 className='text-lg font-bold font-lato pb-1'>Community Points</h1>
                            <div className='flex flex-row content-center'>
                                <div className='basis-5/6'>
                                    <div className='w-full bg-gray-400 h-5 mb-2 rounded-full'>
                                        <div className='bg-blue-400 h-5 rounded-full w-3/4'></div>
                                    </div>
                                </div>
                                <div className='basis-1/6'>
                                    <p className='text-center align-middle font-bold'>2/3</p>
                                </div>
                            </div> 
                        </div>
                    </div>
                </div>
                <h1 className=' w-full text-3xl font-bold font-lato pt-2 text-start'>Member ID</h1>
                <div className="container mx-auto pt-2">
                    <div className="w-full overflow-hidden rounded-2xl shadow-lg bg-gray-200 place-content-center">
                        <img className='p-10' src='https://pngimg.com/uploads/qr_code/qr_code_PNG14.png'></img>
                    </div>
                </div>  
            </main>
        </div>
    )
}