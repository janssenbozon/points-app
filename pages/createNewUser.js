import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { authentication } from '../firebase/clientApp.ts'
import React, { useState } from 'react';
import { getDatabase, ref, set } from "firebase/database";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'

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
                    type="tel"
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
                >Submit</button>
            </div>
        </div>

    </>
    )

}

const YearPrompt = (props) => {

    return (
    <>
        <h1 className="text-2xl font-bold font-lato text-center">
            {props.largeText}
        </h1>
        <h2 className='text-md font-bold font-lato text-center'>{props.smallText}</h2>
        <div className=''>
            <DropdownMenu/>
            <div className="flex space-x-2 justify-center pt-4">
                <button
                    type="submit"
                    className="inline-block px-6 py-2.5 bg-gray-800 text-white font-medium text-sm leading-tight uppercase rounded-lg shadow-md hover:bg-gray-900 hover:shadow-lg focus:bg-gray-900 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-900 active:shadow-lg transition duration-150 ease-in-out"
                    onClick={props.screenFunction}
                >Submit</button>
            </div>
        </div>

    </>
    )

}

const DropdownMenu = () => {

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    return (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Options
              <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </Menu.Button>
          </div>
    
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Account settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Support
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      License
                    </a>
                  )}
                </Menu.Item>
                <form method="POST" action="#">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="submit"
                        className={classNames(
                          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                          'block w-full px-4 py-2 text-left text-sm'
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </form>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      )
}


export default function CreateNewUser() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [year, setYear] = useState("")
    const [bigFam, setBigFam] = useState("")
    const [screen, setScreen] = useState(1)

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
                largeText="You're verfied! Now let's get to know you better."
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
                screenFunction={() => setScreen(3)}
            />

            : null
            
            }

                

            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    )

}
