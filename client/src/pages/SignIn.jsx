import React from 'react'
import { Link } from 'react-router-dom'

function SignIn() {
    return (
        <div className='h-screen flex flex-col'>
            <div className='h-14 w-screen flex justify-between 
            items-center mb-auto
            bg-red-600'>
                <h1 className='ml-5 text-lg'>projectV</h1>

                <span className='mr-2'>SignIn</span>
            </div>

            <div className='flex mb-auto justify-between
            bg-slate-900 h-screen text-white items-center'>
                <form action="" className='flex flex-col gap-2 mx-auto w-1/4'>
                    <h1 className='text-3xl font-bold'>SignIn</h1>

                    <span>E-mail</span>
                    <input className='rounded-sm pl-1' type="text" placeholder='E-mail' />

                    <span>Password</span>
                    <input className='rounded-sm pl-1' type="password" placeholder='Password' />

                    <button className='bg-red-600 rounded-sm hover:bg-red-500'>Sign In</button>

                    <span className='mx-auto'>Not having an Account?</span>
                    <Link to="/"><button className='bg-red-600 rounded-sm hover:bg-red-500 w-full'>Create an Account</button></Link>

                </form>
            </div>
        </div>
    )
}

export default SignIn