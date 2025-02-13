import React from 'react'
import { FaHome } from "react-icons/fa";

const Sidebar = () => {

  return (
    <div>
        <div>
            <h1>Dashboard</h1>
        </div>
        <hr />
        <div>
            <div className='flex flex-row'>
                <FaHome/> Home
            </div>
            <div>
                <h2>
                    Profile
                </h2>
            </div>

            <div>
                <h2>

                </h2>
            </div>
        </div>
    </div>
  )
}

export default Sidebar