// src/components/PlayerInfo.jsx

const PlayerInfo = ({ player }) => {
  return (
    <div className="bg-white/20 p-3 rounded-lg flex justify-between items-center shadow-md">
      <span>🎮 {player.name}</span>
      <div className="text-sm text-yellow-300">
        Rando: {player.randoCount}
        {player.ready && <span className="ml-2 text-green-400">🟢 Ready</span>}
      </div>
    </div>
  );
};

export default PlayerInfo;
