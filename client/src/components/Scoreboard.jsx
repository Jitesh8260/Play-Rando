import React from "react";

const suitEmoji = {
  hearts: "♥",
  spades: "♠",
  diamonds: "♦",
  clubs: "♣",
};

const Scoreboard = ({ finalHands }) => {
  if (!finalHands) return null;

  const activePlayers = finalHands.filter((p) => !p.isEliminated);
  const eliminatedPlayers = finalHands.filter((p) => p.isEliminated);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-3xl">
      <div className="bg-gradient-to-br from-[#1f1f2e] via-[#302b63] to-[#1a1a2e] rounded-2xl border border-indigo-500/30 shadow-2xl p-8 backdrop-blur-md text-white">
        <h2 className="text-3xl font-display font-extrabold text-center text-yellow-300 mb-6 tracking-wide drop-shadow-lg">
          📊 Round Over
        </h2>

        <div className="divide-y divide-white/10">
          {/* Active Players First */}
          {activePlayers.map((p, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col md:flex-row items-center justify-between px-2 md:px-4 gap-2 md:gap-0"
            >
              <div
                className={`text-lg font-display tracking-wide ${
                  p.isRando ? "text-red-400" : "text-white"
                }`}
              >
                {p.name}
              </div>

              <div className="flex items-center gap-2 font-mono text-base text-cyan-200">
                {p.cards.map((c, i) => (
                  <span
                    key={i}
                    className="bg-black/30 px-2 py-1 rounded-md border border-white/10 shadow-md"
                  >
                    {c.rank}
                    <span className="ml-[1px] text-sm">
                      {suitEmoji[c.suit?.toLowerCase()] || "?"}
                    </span>
                  </span>
                ))}
              </div>

              <div className="text-yellow-300 font-bold font-mono text-lg">
                {p.score}
              </div>

              <div className="text-sm font-semibold">
                {p.isRando && <span className="text-pink-400">🫣 Rando</span>}
              </div>
            </div>
          ))}

          {/* Eliminated Players at the Bottom */}
          {eliminatedPlayers.map((p, idx) => (
            <div
              key={`eliminated-${idx}`}
              className="py-4 flex flex-col md:flex-row items-center justify-between px-2 md:px-4 gap-2 md:gap-0"
            >
              <div
                className={`text-lg font-display tracking-wide text-gray-500 line-through`}
              >
                {p.name}
              </div>

              <div className="flex items-center gap-2 font-mono text-base text-gray-400">
                <span className="italic text-xs text-gray-500">--</span>
              </div>

              <div className="text-gray-500 font-bold font-mono text-lg">0</div>

              <div className="text-sm font-semibold flex items-center gap-2">
                {p.isRando && <span className="text-pink-400">🫣 Rando</span>}
                <span className="text-red-400">❌ Eliminated</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
