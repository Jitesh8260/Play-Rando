// src/components/PlayNowButton.jsx
import React from "react";

const PlayNowButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 transition-all duration-300 ease-in-out px-6 py-3 text-white font-medium rounded-xl shadow-md hover:shadow-lg active:scale-95"
  >
    Play Now
  </button>
);


export default PlayNowButton;
