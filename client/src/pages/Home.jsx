import React from "react";
import { useNavigate } from "react-router-dom";
import PlayNowButton from "../components/PlayNowButton";

const Home = () => {
  const navigate = useNavigate();

  // ✅ Generate unique playerId if not already stored
  if (!sessionStorage.getItem("playerId")) {
    sessionStorage.setItem("playerId", crypto.randomUUID());
  }

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden px-4 font-body">
      
      {/* Glass Card */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 md:p-16 shadow-lg text-center max-w-2xl w-full mx-4">
        
        <h1
          className="text-5xl md:text-6xl font-extrabold tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-pink-300 to-purple-400 font-display"
          style={{
            textShadow: "0 0 8px rgba(255, 255, 255, 0.2), 0 0 20px rgba(128, 90, 213, 0.4)",
          }}
        >
          Play-Rando 🎮
        </h1>

        <p className="text-lg md:text-xl mb-10 text-gray-200 font-body">
          Multiplayer Card Game | Strategize, Knock, and Survive to be the Last One Standing!
        </p>

        <PlayNowButton onClick={() => navigate("/lobby")} />
      </div>

      {/* Optional Background Particles */}
      <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="w-full h-full opacity-10 bg-[url('/stars.svg')] bg-cover bg-center" />
      </div>

      <footer className="absolute bottom-4 text-xs text-gray-300 tracking-wide opacity-70 font-body">
        Created by <span className="text-pink-400">Jitesh & Team</span> © 2025
      </footer>
    </div>
  );
};

export default Home;
