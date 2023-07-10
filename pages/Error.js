// Confirmation screen template
import { XCircleIcon } from '@heroicons/react/solid'

const Error = (props) => {

    return (
    <>
        <div>
            <XCircleIcon className='h-full w-full text-red-400'></XCircleIcon>
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
                    onClick={props.action}
                >{props.actionPrompt}</button>
            </div>
        </div>
        </>
    )

}

export default Error;