import React from 'react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
//import toast from "react-toastify"
import { toast } from 'react-toastify'

function SignUp() {
    const [state, setState] = useState('Sign Up'); // to change the state from sign up to llog in
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    // const [name, setName] = useState('');
    // const [userName, setUserName] = useState('');
    const backendUrl="http://localhost:5000/user/register"

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullname: '',
        username: '',
        confirmPassword: '',
    })


    const submitHandler = async (e) => {
        e.preventDefault()
        if (!formData.fullname || !formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required!");
            return;
        }

        //console.log("FIRST")
        if (formData.password !== formData.confirmPassword) {
            //console.log("DONE")
            toast.error("Passwords do not match!");
            //console.log("TOAST")
            return;
        }
        try {
            console.log("Sending Data:", formData);
            const response = await axios.post(backendUrl, formData);
            console.log(response)
            toast.success("Account created successfully! Redirecting...");
            //console.log("HI")
            setTimeout(() => navigate('/signin'), 2000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }


    };

    return (

        <div className='h-screen flex flex-col'>
            <div className='h-14 w-screen flex justify-between 
            items-center mb-auto
            bg-red-600'>
                <h1 className='ml-5 text-lg'>projectV</h1>

                <span className='mr-2'>Sign Up</span>
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

                <form onSubmit={submitHandler}  action="" className='flex flex-col gap-2 mx-auto  '>
                    <h1 className='text-3xl font-bold'>Welcome to projectV</h1>

                    <span>First Name</span>
                    <input className='rounded-sm pl-1 text-white' type="text" placeholder='First Name'
                    name='fullname'
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required value={formData.fullname} />

                    <span>User Name</span>
                    <input className='rounded-sm pl-1 text-white' type="text" placeholder='user Name'
                    name='username'
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required value={formData.username} />

                    <span>E-mail</span>
                    <input className='rounded-sm pl-1 text-white' type="text" placeholder='E-mail'
                    name='email'
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required value={formData.email} />

                    <span>Password</span>
                    <input className='rounded-sm pl-1 text-white' type="password" placeholder='Password'
                    name='password'
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required value={formData.password} />

                    <span>Confirm Password</span>
                    <input className='rounded-sm pl-1 text-white' type="password" placeholder='ConfirmPassword'
                    name='confirmPassword'
                        onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} required value={formData.confirmPassword} />



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