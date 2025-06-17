import React, { useEffect, useState } from "react";
import { socket } from "../utils/socket";

const Game = () => {
    const [hand, setHand] = useState([]);
    const [message, setMessage] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [flippedIndex, setFlippedIndex] = useState(null);

    useEffect(() => {
        console.log("🔌 Connected?", socket.connected);
        console.log("🪪 Socket ID:", socket.id);

        const requestCards = () => {
            console.log("📤 Requesting cards on mount...");
            socket.emit("get_cards");
        };

        socket.on("deal_cards", (cards) => {
            console.log("🃏 Cards received from server:", cards);
            setHand(cards);
        });

        socket.on("start_game", () => {
            console.log("🎮 Game started!");
            requestCards();
        });

        if (socket.connected) {
            requestCards();
        }

        return () => {
            socket.off("start_game");
            socket.off("deal_cards");
        };
    }, []);

    const handleCardClick = (index) => {
        setSelectedIndex(index);
    };

    const handleSwap = () => {
        if (selectedIndex === null) {
            alert("Select a card to swap!");
            return;
        }

        // Swap logic can be added here
        setFlippedIndex(selectedIndex);
        setTimeout(() => {
            setFlippedIndex(null);
            setSelectedIndex(null);
        }, 1000);
    };

    return (
        <div className="h-screen bg-green-700 flex flex-col items-center justify-center text-white font-[Cardo]">
            <h1 className="text-4xl mb-6 flex items-center gap-2">
                <span role="img" aria-label="joker">🃏</span> Play Rando
            </h1>

            <div className="flex gap-6 mb-8">
                {hand.map((card, idx) => {
                    const isRed = card.suit === "Hearts" || card.suit === "Diamonds";
                    const suitSymbols = {
                        Hearts: "♥",
                        Diamonds: "♦",
                        Spades: "♠",
                        Clubs: "♣",
                    };
                    const suit = suitSymbols[card.suit];

                    return (
                        <div
                            key={idx}
                            className={`w-24 h-36 bg-white rounded-xl shadow-md border-2 border-gray-300 flex flex-col justify-between p-2 ${isRed ? "text-red-600" : "text-black"
                                }`}
                        >
                            <div className="text-sm font-bold">
                                {card.rank} {suit}
                            </div>
                            <div className="text-3xl text-center">{suit}</div>
                            <div className="text-sm font-bold rotate-180 self-end">
                                {card.rank} {suit}
                            </div>
                        </div>
                    );
                })}

            </div>

            <div className="mt-2 flex gap-6">
                <button
                    className="bg-yellow-400 text-black px-6 py-2 rounded font-semibold"
                    onClick={handleSwap}
                >
                    Swap ♻️
                </button>
                <button className="bg-red-500 px-6 py-2 rounded font-semibold">Knock 🔔</button>
            </div>
        </div>
    );
};

// Utility functions
const getSuitSymbol = (suit) => {
    switch (suit) {
        case "Hearts": return "♥";
        case "Diamonds": return "♦";
        case "Clubs": return "♣";
        case "Spades": return "♠";
        default: return "";
    }
};

const getSuitColor = (suit) => {
    return (suit === "Hearts" || suit === "Diamonds") ? "text-red-600" : "text-black";
};

export default Game;
