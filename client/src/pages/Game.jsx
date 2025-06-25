import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import CardFront from "../components/CardFront";
import { getPlayerPosition } from "../utils/helpers";

if (!sessionStorage.getItem("playerId")) {
  sessionStorage.setItem("playerId", crypto.randomUUID());
}

const OVAL_WIDTH = 850;
const OVAL_HEIGHT = 500;

const Game = () => {
  const [players, setPlayers] = useState([]);
  const [myId] = useState(sessionStorage.getItem("playerId"));
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [discardTop, setDiscardTop] = useState(null);
  const [drawnCard, setDrawnCard] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [knocker, setKnocker] = useState(null);
  const [showKnockMessage, setShowKnockMessage] = useState(false);
  const [finalHands, setFinalHands] = useState(null);
  const [canKnock, setCanKnock] = useState(false);
  const [knockTimer, setKnockTimer] = useState(null); // NEW 🕒

  const myPlayer = players.find((p) => p.playerId === myId);
  const otherPlayers = players.filter((p) => p.playerId !== myId);
  const isMyTurn = currentTurn === myId;

  useEffect(() => {
    const name = sessionStorage.getItem("playerName");
    const roomId = sessionStorage.getItem("roomId") || "1";

    if (myId && name && roomId) {
      socket.emit("join_room", {
        roomId,
        playerId: myId,
        playerName: name,
      });
    }
  }, [myId]);

  useEffect(() => {
    const requestCards = () => socket.emit("get_cards");

    socket.on("deal_cards", ({ players, currentTurn, discardTop }) => {
      setPlayers(players);
      setCurrentTurn(currentTurn);
      setDiscardTop(discardTop || null);
    });

    socket.on("start_game", requestCards);
    socket.on("update_turn", (nextTurnId) => {
      setCurrentTurn(nextTurnId);
      setCanKnock(false);
    });

    socket.on("update_discard_pile", (topCard) => setDiscardTop(topCard));
    socket.on("card_drawn", (card) => setDrawnCard(card));

    socket.on("update_hand", (newHand) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.playerId === myId ? { ...p, cards: newHand } : p
        )
      );
      setDrawnCard(null);
      setSelectedIndex(null);
    });

    socket.on("player_knocked", (playerName) => {
      setKnocker(playerName);
      setShowKnockMessage(true);
      setTimeout(() => setShowKnockMessage(false), 3000);
    });

    socket.on("round_end", ({ finalHands }) => {
      setFinalHands(finalHands);
    });

    // ✅ Knock timer events
    socket.on("allow_knock", () => {
      setCanKnock(true);
    });

    socket.on("knock_timer", (count) => {
      setKnockTimer(count);
      if (count === 0) setKnockTimer(null);
    });

    socket.on("disable_knock", () => {
      setCanKnock(false);
      setKnockTimer(null);
    });

    if (socket.connected) requestCards();

    return () => {
      socket.off("deal_cards");
      socket.off("start_game");
      socket.off("update_turn");
      socket.off("update_hand");
      socket.off("update_discard_pile");
      socket.off("card_drawn");
      socket.off("player_knocked");
      socket.off("round_end");

      // cleanup for new listeners
      socket.off("allow_knock");
      socket.off("knock_timer");
      socket.off("disable_knock");
    };
  }, [myId]);

  const handleCardClick = (index) => setSelectedIndex(index);

  const handleSwap = () => {
    if (!isMyTurn) return alert("Wait for your turn!");
    if (!drawnCard) return alert("Pick a card first!");
    if (selectedIndex === null) return alert("Select a card to discard.");

    const cardToDiscard = myPlayer.cards[selectedIndex];
    socket.emit("discard_card", { discard: cardToDiscard, keep: drawnCard });

    // No need to manually trigger knock timer here anymore
  };

  const handleKnock = () => {
    if (!isMyTurn || !canKnock) return;
    socket.emit("player_knock");
    setCanKnock(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-[Cardo] flex justify-center items-center overflow-hidden relative">
      <h1 className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-display text-yellow-300 tracking-wider z-20 drop-shadow-lg">
        🎴 Play Rando
      </h1>

      {showKnockMessage && knocker && (
        <div className="absolute top-32 left-1/2 -translate-x-1/2 z-40 text-xl text-pink-300 font-display bg-black/50 px-4 py-2 rounded-full">
          🚨 {knocker} knocked!
        </div>
      )}

      {finalHands && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white p-6 rounded-xl z-50 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">📊 Round Over</h2>
          {finalHands.map((p, idx) => (
            <div key={idx} className="mb-2 text-lg text-center">
              <strong>{p.name}</strong>: {p.cards.map(c => `${c.rank}${c.suit[0]}`).join(" ")}
            </div>
          ))}
        </div>
      )}

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 text-lg font-display text-cyan-300 drop-shadow">
        {isMyTurn ? "🔁 Your Turn" : `🎮 ${players.find((p) => p.playerId === currentTurn)?.name || "Waiting"
          }'s Turn`}
      </div>

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
        {myPlayer &&
          otherPlayers.map((player) => {
            const pos = getPlayerPosition(
              myPlayer.seat,
              player.seat,
              players.length,
              OVAL_WIDTH,
              OVAL_HEIGHT
            );

            return (
              <div
                key={player.playerId}
                className="absolute"
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <p className="text-xs text-slate-300 font-display mb-1">
                  {player.name}
                </p>
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

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 z-10">
          <div
            onClick={() => isMyTurn && socket.emit("draw_card")}
            className={`w-20 h-32 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition ${isMyTurn
                ? "bg-gray-800 border-gray-600"
                : "bg-gray-700 border-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            🂠
          </div>
          <div
            onClick={() => isMyTurn && socket.emit("pick_discard_card")}
            className={`w-20 h-32 border-2 rounded-lg p-2 cursor-pointer hover:scale-105 transition ${isMyTurn
                ? "border-red-500"
                : "border-gray-600 cursor-not-allowed opacity-50"
              }`}
          >
            {discardTop ? (
              <CardFront card={discardTop} index={0} />
            ) : (
              <div className="text-center text-sm text-red-300 mt-10">
                Empty
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player's Cards */}
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

      {/* Drawn Card Display */}
      {drawnCard && (
        <div className="absolute bottom-28 right-[120px] text-center">
          <p className="text-yellow-400 font-semibold mb-2">Picked</p>
          <CardFront card={drawnCard} index={3} />
        </div>
      )}

      {/* Knock Timer Display */}
      {canKnock && knockTimer !== null && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-lg font-bold text-yellow-400 z-50 font-display">
          ⏱️ Knock in: {knockTimer}
        </div>
      )}

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-20">
        <button
          disabled={!isMyTurn}
          className={`font-display px-6 py-2 rounded-full shadow-md transition ${isMyTurn
              ? "bg-yellow-400 text-black hover:brightness-110"
              : "bg-yellow-300 text-black opacity-50 cursor-not-allowed"
            }`}
          onClick={handleSwap}
        >
          ♻️ Swap
        </button>
        <button
          disabled={!isMyTurn || !canKnock}
          onClick={handleKnock}
          className={`font-display px-6 py-2 rounded-full shadow-md transition ${isMyTurn && canKnock
              ? "bg-red-500 text-white hover:bg-red-400"
              : "bg-red-400 text-white opacity-50 cursor-not-allowed"
            }`}
        >
          🔔 Knock
        </button>
      </div>
    </div>
  );
};

export default Game;
