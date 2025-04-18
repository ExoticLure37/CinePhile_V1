import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

function NavLinks() {
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
        <nav className=" px-6 md:px-32 py-4 shadow-md">
            <div className="flex gap-4">
                {navLinks.map(({ path, label }) => {
                    const isActive = location.pathname === path;

                    return (
                        <Link
                            key={path}
                            to={path}
                            className={`text-sm md:text-base font-semibold transition-all duration-300 pb-1 border-b-2
                                ${isActive
                                    ? 'text-red-600 border-red-500 transition-all duration-300  '
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

export default NavLinks;
