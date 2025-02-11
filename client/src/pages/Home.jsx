import React from "react";
import Navbar from "../components/Navbar";

function Home() {
    const currentUser = useSelector((state) => state.userProfile);

    console.log(currentUser);
    return (
        <div className='h-screen flex flex-col'>
            <div className="navbar w-full flex justify-between items-center
             py-2 px-6 text-white bg-[#E50914]">
                <div className="flex-1">
                    <a className="btn btn-ghost text-xl">projectV</a>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <div tabindex="0" role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul
                            tabindex="0"
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <a className="justify-between">
                                    {currentUser.username}
                                </a>
                            </li>
                            <li><a>My List</a></li>
                            <li><a>Contact</a></li>
                            <li><a>Settings</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='flex items-center px-32 justify-between 
            py-4 text-white bg-slate-200 bg-opacity-20 sticky top-0 z-40 h-10'>
                <span>Home</span>
                <span>Friends</span>
                <span>Friends Watchlist</span>
                <span>Manage Watchlist</span>
                <span>Calendar</span>
            </div>

            <div className='flex flex-col mt-8 gap-10 ml-10'>
                <div className='flex flex-col gap-5'>
                    <span className='font-bold text-4xl'>Watching</span>

                    <div className='flex gap-8'>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <span className='font-bold text-4xl'>Trending</span>

                    <div className='flex gap-8'>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <span className='font-bold text-4xl'>Upcoming</span>

                    <div className='flex gap-8'>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <span className='font-bold text-4xl'>Latest</span>

                    <div className='flex gap-8'>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                        <div className='bg-red-600 h-60 w-1/6 rounded-md'>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home