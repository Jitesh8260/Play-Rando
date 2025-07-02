import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameOverModal = ({ rankings }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/lobby");
    }, 8000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0f0c29]/90 via-[#302b63]/90 to-[#24243e]/90 backdrop-blur-md">
      <div className="bg-white/10 border border-white/20 rounded-2xl px-10 py-8 shadow-2xl text-center max-w-md w-full animate-fade-in backdrop-blur-md">
        <h1 className="text-4xl font-bold text-yellow-300 mb-6 font-display animate-pulse drop-shadow">
          🏆 Game Over
        </h1>

        <div className="space-y-4 text-white font-display text-lg">
          {rankings.map((r, i) => (
            <div
              key={i}
              className={`py-2 px-4 rounded-lg shadow-md ${
                i === 0
                  ? "bg-yellow-300 text-black"
                  : i === 1
                  ? "bg-gray-300 text-black"
                  : "bg-orange-400 text-black"
              }`}
            >
              <span className="text-xl font-bold">
                {["🥇 First", "🥈 Second", "🥉 Third"][i]}
              </span>
              : {r.name}
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-slate-300 font-body tracking-wide">
          🔄 Redirecting to Lobby...
        </p>
      </div>
    </div>
  );
};

export default GameOverModal;
