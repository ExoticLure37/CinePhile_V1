import { useState } from "react";
import Watchlist from "./Watchlist";

const WatchlistDropdown = () => {
    const [selected, setSelected] = useState("My Watchlists");

    const watchlists = ["My Watchlists", "Favorites Watchlists", "Global Watchists"];

    const handleSelect = (event) => {
        setSelected(event.target.value);
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            {/* Selected Watchlist Display */}
            <div className="flex items-center justify-center w-full space-x-6 mt-4">
                {/* Left: Watchlist Name */}
                <h1 className="text-3xl font-bold mb-4 text-white drop-shadow-sm">📺 {selected}</h1>
                {/* Dropdown */}
                <select
                    value={selected}
                    onChange={handleSelect}
                    className="bg-[#1c1c1c] text-white border border-gray-600 rounded p-2 ml-auto"
                >
                    {watchlists.map((list) => (
                        <option key={list} value={list}>
                            {list}
                        </option>
                    ))}
                </select>
            </div>


            <div className="flex-1 w-full">
                <Watchlist type = {selected}/>
            </div>
        </div>
    );
};

export default WatchlistDropdown;
