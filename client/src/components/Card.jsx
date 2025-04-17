import React, { useEffect } from "react";

const Card = (imageUrl) => {
    useEffect(() => {
        console.log(imageUrl.imageUrl)
      }, []);
    
  return (
    <div className="relative h-[50vh] w-[42vh] rounded-2xl overflow-hidden shadow-md cursor-pointer group transform transition-transform hover:scale-105 duration-300">
      {imageUrl ? (
        <img
          src={imageUrl.imageUrl}
          alt=""
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white font-semibold">
          No Image
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      <div className="absolute bottom-3 left-3 text-white z-10">
        <h3 className="text-lg font-bold drop-shadow">{imageUrl.name}</h3>
      </div>
    </div>
  );
};

export default Card;
