import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
//import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Error from '../components/Error'
import LinkNavbar from '../components/LinkNavbar'
//import Dashboard from '../components/Dashboard'

const Profile = () => {

    const curUser = useSelector((state) => state.userProfile)
    // console.log(curUser)

    return (
        curUser.fullname ?
            <div className='min-h-screen flex flex-col bg-[#141414]'>
                <div>
                    <Navbar />
                </div>

                <div className="bg-black/30 backdrop-blur-md sticky top-0 z-40">
                    <LinkNavbar />
                </div>

                <div>
                    <div>
                        <Sidebar />
                    </div>
                </div>
            </div>

            :
            <Error />
    )
}

export default Profile;