import React from 'react'

function Home() {
    return (
        <div className='h-screen flex flex-col'>
            <div class="navbar bg-red-600">
                <div class="flex-1">
                    <a class="btn btn-ghost text-xl">projectV</a>
                </div>
                <div class="flex-none gap-2">
                    <div class="dropdown dropdown-end">
                        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                            <div class="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                        </div>
                        <ul
                            tabindex="0"
                            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li>
                                <a class="justify-between">
                                    My Account
                                </a>
                            </li>
                            <li><a>My List</a></li>
                            <li><a>Contact</a></li>
                            <li><a>Settings</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className='flex items-center px-32 justify-between border-b-2 py-4 border-slate-200 h-7 '>
                <span>Home</span>
                <span>Friends</span>
                <span>Friends Watchlist</span>
                <span>Manage Watchlist</span>
                <span>Calendar</span>
            </div>
        </div>
    )
}

export default Home