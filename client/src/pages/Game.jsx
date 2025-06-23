import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { socket } from "../utils/socket";
import CardFront from "../components/CardFront";
import { getPlayerPosition } from "../utils/helpers";

const OVAL_WIDTH = 850;
const OVAL_HEIGHT = 500;
const CENTER_X = OVAL_WIDTH / 2;
const CENTER_Y = OVAL_HEIGHT / 2;

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [myId, setMyId] = useState(socket.id);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [discardTop, setDiscardTop] = useState(null);
  const [drawnCard, setDrawnCard] = useState(null);

  useEffect(() => {
    const requestCards = () => socket.emit("get_cards");

    socket.on("deal_cards", (playerList) => setPlayers(playerList));
    socket.on("start_game", requestCards);

    socket.on("card_drawn", (card) => setDrawnCard(card));
    socket.on("update_hand", (newHand) => {
      setPlayers((prev) =>
        prev.map((p) => (p.id === myId ? { ...p, cards: newHand } : p))
      );
      setDrawnCard(null);
      setSelectedIndex(null);
    });
    socket.on("update_discard_pile", (topCard) => setDiscardTop(topCard));

    if (socket.connected) {
      requestCards();
      setMyId(socket.id);
    }

    return () => {
      socket.off("start_game");
      socket.off("deal_cards");
      socket.off("card_drawn");
      socket.off("update_hand");
      socket.off("update_discard_pile");
    };
  }, []);

  const handleCardClick = (index) => setSelectedIndex(index);

  const handleSwap = () => {
    if (!drawnCard) return alert("Pick a card first!");
    if (selectedIndex === null) return alert("Select a card to discard.");
    const cardToDiscard = myPlayer.cards[selectedIndex];
    socket.emit("discard_card", { discard: cardToDiscard, keep: drawnCard });
  };

  const myPlayer = players.find((p) => p.id === myId);
  const otherPlayers = players.filter((p) => p.id !== myId);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-[Cardo] flex justify-center items-center overflow-hidden relative">
        {/* Game Title */}
        <h1 className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-display text-yellow-300 tracking-wider z-20 drop-shadow-lg">
          🎴 Play Rando
        </h1>

      {/* Oval Table */}
      <div
        className="relative"
        style={{
          width: `${OVAL_WIDTH}px`,
          height: `${OVAL_HEIGHT}px`,
          border: "10px solid #6366f1",
          borderRadius: "50%",
          background: "#1a1a2e",
          boxShadow: "0 0 80px #6b21a8",
        }}
      >


        {/* Players around oval */}
        {otherPlayers.map((player, index) => {
          const { x, y } = getPlayerPosition(index, otherPlayers.length, OVAL_WIDTH, OVAL_HEIGHT);
          return (
            <div
              key={player.id}
              className="absolute"
              style={{ left: `${x}px`, top: `${y}px`, transform: "translate(-50%, -50%)", textAlign: "center" }}
            >
              <p className="text-xs text-slate-300 font-display mb-1">{player.name}</p>
              <div className="flex">
                {player.cards.slice(0, 3).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-14 h-20 rounded-md border-2 border-purple-400 bg-purple-800 -ml-5 first:ml-0 shadow"
                  >
                    🎴
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Draw & Discard Piles in center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 z-10">
          <div
            onClick={() => socket.emit("draw_card")}
            className="w-20 h-32 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition"
          >
            🂠
          </div>
          <div
            onClick={() => socket.emit("pick_discard_card")}
            className="w-20 h-32 border-2 border-red-500 rounded-lg p-2 cursor-pointer hover:scale-105 transition"
          >
            {discardTop ? (
              <CardFront card={discardTop} index={0} />
            ) : (
              <div className="text-center text-sm text-red-300 mt-10">Empty</div>
            )}
          </div>
        </div>
      </div>

      {/* Your Cards */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
        <p className="text-green-400 font-display mb-2">You</p>
        <div className="flex gap-3">
          {myPlayer?.cards?.map((card, idx) => (
            <CardFront
              key={idx}
              card={card}
              index={idx}
              isSelected={selectedIndex === idx}
              onClick={() => handleCardClick(idx)}
            />
          ))}
        </div>
      </div>

      {/* Picked Card Preview */}
      {drawnCard && (
        <div className="absolute bottom-28 right-[120px] text-center">
          <p className="text-yellow-400 font-semibold mb-2">Picked</p>
          <CardFront card={drawnCard} index={3} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-20">
        <button
          className="bg-yellow-400 text-black font-display px-6 py-2 rounded-full shadow-md hover:brightness-110 transition"
          onClick={handleSwap}
        >
          ♻️ Swap
        </button>
        <button className="bg-red-500 text-white font-display px-6 py-2 rounded-full shadow-md hover:bg-red-400 transition">
          🔔 Knock
        </button>
      </div>
    </div>
  );
};

export default Game;
