import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WatchlistDropdown from '../components/WatchlistDropDown';

function WatchlistHome() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-tr from-[#0f0f0f] via-[#1c1c1c] to-[#141414] text-white text-sm">
            <Navbar />

            <div className='flex-1 pt-4'>
                <WatchlistDropdown />
            </div>


            <Footer className="w-full" />
        </div >
    )
}

export default WatchlistHome