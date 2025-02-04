import React from 'react'
import { Link } from 'react-router-dom'

function SignUp() {
    return (
        <div className='h-screen flex flex-col'>
            <div className='h-14 w-screen flex justify-between 
            items-center mb-auto
            bg-red-600'>
                <h1 className='ml-5 text-lg'>projectV</h1>

                <span className='mr-2'>SignUp</span>
            </div>

            <div className='flex mb-auto justify-between
            h-screen text-white items-center w-full'>
                <span className='mx-auto'>Lorem, ipsum dolor sit amet
                    adipisicing elit. <br />At consequuntur facilis vero illum officia
                    similique ipsum <br />quos quo quam ratione?
                    Lorem, ipsum dolor sit amet
                    adipisicing elit. <br />At consequuntur facilis vero illum officia
                    similique ipsum <br />quos quo quam ratione?
                    Lorem, ipsum dolor sit amet
                    adipisicing elit. <br />At consequuntur facilis vero illum officia
                    similique ipsum <br />quos quo quam ratione?</span>

                <form action="" className='flex flex-col gap-2 mx-auto '>
                    <h1 className='text-3xl font-bold'>Welcome to projectV</h1>

                    <span>First Name</span>
                    <input className='rounded-sm pl-1 text-black' type="text" placeholder='First Name' />

                    <span>E-mail</span>
                    <input className='rounded-sm pl-1 text-black' type="text" placeholder='E-mail' />

                    <span>Password</span>
                    <input className='rounded-sm pl-1 text-black' type="password" placeholder='Password' />

                    <button className='bg-red-600 rounded-sm hover:bg-red-500'>Create Account</button>

                    <span className='mx-auto'>Already having a Account?</span>
                    <Link to="/signin"><button className='bg-red-600 rounded-sm hover:bg-red-500 w-full'>Sign-In</button>
                    </Link>
                </form>
            </div>
        </div>
    )
}

export default SignUp