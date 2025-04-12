import React, { useRef, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MediaCard from "../components/MediaCard";

function TrendingSection({ popularMovies, activeModalId, setActiveModalId }) {
  const scrollRef = useRef(null);
  const CARD_WIDTH = 220; // card + margin
  const CARDS_VISIBLE = 5;

  const [scrollIndex, setScrollIndex] = useState(0);

  const scrollRight = () => {
    if (scrollRef.current) {
      const maxIndex = Math.ceil(popularMovies.length / CARDS_VISIBLE) - 1;
      const newIndex = Math.min(scrollIndex + 1, maxIndex);
      scrollRef.current.scrollTo({
        left: newIndex * CARD_WIDTH * CARDS_VISIBLE,
        behavior: "smooth"
      });
      setScrollIndex(newIndex);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      const newIndex = Math.max(scrollIndex - 1, 0);
      scrollRef.current.scrollTo({
        left: newIndex * CARD_WIDTH * CARDS_VISIBLE,
        behavior: "smooth"
      });
      setScrollIndex(newIndex);
    }
  };

  return (
    <div className="flex flex-col gap-5 relative w-full">
      <div className="flex justify-between items-center px-4">
        <h2 className="font-bold text-4xl text-white hover:text-5xl transition-all duration-200">
          Trending <ArrowForwardIosIcon />
        </h2>
        <div className="flex gap-3">
          <button
            onClick={scrollLeft}
            className="text-white hover:scale-125 transition-all duration-300 p-2"
          >
            <ChevronLeftIcon fontSize="large" />
          </button>
          <button
            onClick={scrollRight}
            className="text-white hover:scale-125 transition-all duration-300 p-2"
          >
            <ChevronRightIcon fontSize="large" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden w-[1100px] mx-4">
        <div
          ref={scrollRef}
          className="flex transition-all duration-500 ease-in-out"
          style={{ scrollBehavior: "smooth" }}
        >
          {popularMovies.map((item) => (
            <div
              key={item.id}
              style={{ minWidth: "200px", maxWidth: "200px", marginRight: "20px" }}
            >
              <MediaCard
                media={{
                  ...item,
                  primaryImage: item.primaryImage,
                  primaryTitle: item.originalTitle || "No Title",
                  genres: item.genres || [],
                  spokenLanguages: item.spokenLanguages || ["en"],
                  countriesOfOrigin: item.countriesOfOrigin || [],
                  url: `https://www.imdb.com/title/${item.id}`,
                  type: item.titleType || "movie",
                }}
                mediaId={item.id}
                activeModalId={activeModalId}
                setActiveModalId={setActiveModalId}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TrendingSection;
