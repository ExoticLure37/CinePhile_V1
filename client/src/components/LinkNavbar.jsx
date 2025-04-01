import React from 'react'
import { Link } from 'react-router-dom'

function LinkNavbar() {
    return (
        <div><div className='flex items-center px-32 justify-between 
        py-4 h-10'>
            <Link to={'/home'} className="text-white hover:text-opacity-30 hover:border-b-2 border-white">Home</Link>
            <Link to={'/friends'} className="text-white hover:text-opacity-30 hover:border-b-2 border-white">Friends</Link>
            <Link to={'/friends-watchlist'} className="text-white hover:text-opacity-30 hover:border-b-2 border-white">Friends Watchlist</Link>
            <Link to={'/watchlist'} className="text-white hover:text-opacity-30 hover:border-b-2 border-white">Watchlist</Link>
            <Link to={'/calendar'} className="text-white hover:text-opacity-30 hover:border-b-2 border-white">Calendar</Link>
        </div></div>
    )
}

export default LinkNavbar