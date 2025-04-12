import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function LinkNavbar() {
    const location = useLocation();

    const navLinks = [
        { path: '/movies', label: 'Movies' },
        { path: '/tvshows', label: 'TV Shows' },
        { path: '/friends', label: 'Friends' },
        { path: '/friends-watchlist', label: 'Friends Watchlist' },
        { path: '/watchlist', label: 'Watchlist' },
        { path: '/calendar', label: 'Calendar' },
    ];

    return (
        <nav className="bg-[#141414] px-6 md:px-32 py-4 shadow-md">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
                {navLinks.map(({ path, label }) => {
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`text-sm md:text-base font-semibold transition-all duration-300 pb-1 border-b-2
                ${isActive
                                    ? 'text-blue-400 border-blue-400'
                                    : 'text-white border-transparent hover:text-blue-300 hover:border-blue-300'
                                }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

export default LinkNavbar;
