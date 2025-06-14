import React, { useState, useEffect } from "react";
import { socket } from "../utils/socket";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [players, setPlayers] = useState([]);

  const navigate = useNavigate();

  const handleJoin = () => {
    if (!name || !roomId) {
      alert("Please enter name and room ID");
      return;
    }

    socket.emit("join_room", { playerName: name, roomId });
  };

  const handleReady = () => {
    socket.emit("player_ready");
    setIsReady(true);
  };

  useEffect(() => {
    socket.on("update_players", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    socket.on("start_game", () => {
      alert("Game is starting! 🚀");
      navigate("/game");
    });

    return () => {
      socket.off("update_players");
      socket.off("start_game");
    };
  }, []);

  return (
    <div className="relative h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white overflow-hidden px-4 font-body">
      
      {/* Glass Lobby Card */}
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl p-10 md:p-14 shadow-lg text-center max-w-2xl w-full mx-4">
        
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-widest mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-pink-300 to-purple-400 font-display"
          style={{
            textShadow: "0 0 8px rgba(255,255,255,0.15), 0 0 16px rgba(128,90,213,0.35)"
          }}
        >
          🎮 Game Lobby
        </h1>

        {!isReady ? (
          <div className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="px-4 py-2 w-full rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room ID"
              className="px-4 py-2 w-full rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={handleJoin}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded transition"
            >
              Join Room
            </button>
            <button
              onClick={handleReady}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded transition"
            >
              Ready
            </button>
          </div>
        ) : (
          <p className="text-lg text-green-400 mt-4">Waiting for others to get ready...</p>
        )}

        <div className="mt-8 text-left">
          <h2 className="text-lg font-semibold mb-2 text-pink-300">Players Joined:</h2>
          <ul className="space-y-1 text-sm text-gray-200">
            {players.map((p, i) =>
              p ? (
                <li key={i}>
                  {p.name} —{" "}
                  <span className={p.ready ? "text-green-400" : "text-yellow-400"}>
                    {p.ready ? "Ready" : " Not Ready"}
                  </span>
                </li>
              ) : null
            )}
          </ul>
        </div>
      </div>

      {/* Background effect */}
      <div className="absolute inset-0 z-[-1] opacity-10 bg-[url('/stars.svg')] bg-cover bg-center" />

       <footer className="absolute bottom-4 text-xs text-gray-300 tracking-wide opacity-70 font-body">
        Created by <span className="text-pink-400">Jitesh & Team</span> © 2025
      </footer>
    </div>
  );
};

export default Lobby;
