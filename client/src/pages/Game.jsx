
import React, { useEffect, useState, useCallback } from "react";
import { socket } from "../utils/socket";
import CardFront from "../components/CardFront";
import { getPlayerPosition } from "../utils/helpers";
import Scoreboard from "../components/Scoreboard";
import GameOverModal from "../components/GameOverModal"; // ✅

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
  const [finalRankings, setFinalRankings] = useState(null); // ✅
  const [canKnock, setCanKnock] = useState(false);
  const [knockTimer, setKnockTimer] = useState(null);

  const myPlayer = players.find((p) => p.playerId === myId);
  const otherPlayers = players.filter((p) => p.playerId !== myId);
  const isMyTurn = currentTurn === myId;
  const isEliminated = myPlayer?.isEliminated;

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

      setFinalHands(null);
      setSelectedIndex(null);
      setDrawnCard(null);
      setKnockTimer(null);
      setCanKnock(false);
      setFinalRankings(null); // ✅
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

    socket.on("round_end", ({ finalHands, rankings }) => {
      setFinalHands(finalHands);

      if (rankings) {
        setTimeout(() => {
          setFinalRankings(rankings); // ✅ GameOverModal 3s baad
        }, 3000); // Wait 3s to let scoreboard show first
      }
    });


    socket.on("allow_knock", () => setCanKnock(true));
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
      socket.off("allow_knock");
      socket.off("knock_timer");
      socket.off("disable_knock");
    };
  }, [myId]);

  useEffect(() => {
    if (finalHands) {
      const timer = setTimeout(() => setFinalHands(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [finalHands]);

  const handleCardClick = (index) => {
    setSelectedIndex(index);
  };

  const handleDraw = useCallback(() => {
    if (isMyTurn && !isEliminated) {
      socket.emit("draw_card");
    }
  }, [isMyTurn, isEliminated]);

  const handlePickDiscard = useCallback(() => {
    if (isMyTurn && !isEliminated) {
      socket.emit("pick_discard_card");
    }
  }, [isMyTurn, isEliminated]);

  const handleSwap = () => {
    if (!isMyTurn || isEliminated) return alert("Wait for your turn!");
    if (!drawnCard) return alert("Pick a card first!");
    if (selectedIndex === null) return alert("Select a card to discard.");

    const allCards = [...(myPlayer.cards || []), drawnCard];
    const discard = allCards[selectedIndex];
    const keep = allCards.filter((_, i) => i !== selectedIndex);

    if (keep.length !== 3) return alert("Something went wrong!");

    socket.emit("discard_card", { discard, keep });
    setDrawnCard(null);
    setSelectedIndex(null);
  };

  const handleKnock = () => {
    if (!isMyTurn || !canKnock || isEliminated) return;
    socket.emit("player_knock");
    setCanKnock(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white font-[Cardo] flex justify-center items-center overflow-hidden relative">
      <h1 className="absolute top-10 left-1/2 -translate-x-1/2 text-3xl font-display text-yellow-300 tracking-wider z-20 drop-shadow-lg">
        🎴 Play Rando
      </h1>

      {showKnockMessage && knocker && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="px-8 py-4 rounded-2xl bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white shadow-2xl font-display text-xl tracking-wide animate-pulse border border-white/20 backdrop-blur-md">
            🚨 <span className="font-bold text-white text-2xl">{knocker}</span> knocked!
          </div>
        </div>
      )}

      {finalHands && <Scoreboard finalHands={finalHands} />}
      {finalRankings && <GameOverModal rankings={finalRankings} />} {/* ✅ */}

      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 text-lg font-display text-cyan-300 drop-shadow">
        {isMyTurn ? "🔁 Your Turn" : `🎮 ${players.find((p) => p.playerId === currentTurn)?.name || "Waiting"}'s Turn`}
      </div>

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

            const isOut = player.isEliminated;

            return (
              <div
                key={player.playerId}
                className={`absolute ${player.playerId === currentTurn ? "ring-4 ring-yellow-400 rounded-lg" : ""}`}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <p className={`text-xs font-display mb-1 ${isOut ? "text-red-400 line-through" : "text-slate-300"}`}>
                  {player.name}
                </p>
                {!isOut && (
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
                )}
              </div>
            );
          })}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-6 z-10">
          <div
            onClick={handleDraw}
            className={`w-20 h-32 border-2 rounded-lg flex items-center justify-center cursor-pointer hover:scale-105 transition ${isMyTurn && !isEliminated
              ? "bg-gray-800 border-gray-600"
              : "bg-gray-700 border-gray-500 cursor-not-allowed opacity-50"
              }`}
          >
            🂠
          </div>
          <div
            onClick={handlePickDiscard}
            className={`w-20 h-32 border-2 rounded-lg p-2 cursor-pointer hover:scale-105 transition ${isMyTurn && !isEliminated
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

      {!isEliminated && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
          <p className="text-green-400 font-display mb-2">You</p>
          <div className="flex gap-3">
            {[...(myPlayer?.cards || []), drawnCard].map((card, idx) =>
              card ? (
                <CardFront
                  key={idx}
                  card={card}
                  index={idx}
                  isSelected={selectedIndex === idx}
                  onClick={() => handleCardClick(idx)}
                />
              ) : null
            )}
          </div>
        </div>
      )}

      {isMyTurn && canKnock && knockTimer !== null && (
        <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-40">
          <div className="px-6 py-3 rounded-xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 text-black shadow-xl font-display text-lg font-bold tracking-wide animate-pulse border border-white/10 backdrop-blur-md">
            ⏱️ Knock in: <span className="text-white">{knockTimer}</span>
          </div>
        </div>
      )}



      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-6 z-20">
        <button
          disabled={!isMyTurn || finalHands || isEliminated}
          className={`font-display px-6 py-2 rounded-full shadow-md transition ${isMyTurn && !finalHands && !isEliminated
            ? "bg-yellow-400 text-black hover:brightness-110"
            : "bg-yellow-300 text-black opacity-50 cursor-not-allowed"
            }`}
          onClick={handleSwap}
        >
          ♻️ Swap
        </button>
        <button
          disabled={!isMyTurn || !canKnock || finalHands || isEliminated}
          onClick={handleKnock}
          className={`font-display px-6 py-2 rounded-full shadow-md transition ${isMyTurn && canKnock && !finalHands && !isEliminated
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
