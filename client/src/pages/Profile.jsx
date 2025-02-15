import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Error from '../components/Error'

const Profile = () => {

    const curUser=useSelector((state)=>state.userProfile)
    console.log(curUser)

  return (
    curUser.fullname?
    <div>
        <div>
            <Navbar/>
        </div>

        <div>
            <div>
                <Sidebar/>
            </div>

            <div>
                <Outlet/>
            </div>
        </div>
    </div>

    :
    <Error/>
  )
}

export default Profile