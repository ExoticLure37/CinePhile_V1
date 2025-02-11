import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

const Profile = () => {
  return (
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
  )
}

export default Profile