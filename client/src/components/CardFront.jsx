import { motion } from "framer-motion";
import { getSuitSymbol } from "../utils/helpers";

const CardFront = ({ card, index, isSelected, onClick }) => {
  const suit = getSuitSymbol(card.suit);
  const isRed = card.suit === "Hearts" || card.suit === "Diamonds";

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`w-20 h-32 rounded-xl shadow-lg border-2 
        ${isRed ? "text-red-400" : "text-white"} 
        ${isSelected ? "border-yellow-400 ring-2 ring-yellow-300 scale-110" : "border-slate-600"} 
        bg-gradient-to-br from-slate-900 to-slate-700
        flex flex-col justify-between items-start p-2 cursor-pointer 
        hover:scale-105 transition-transform duration-200 ease-in-out`}
    >
      <div className="text-sm font-bold">
        {card.rank} {suit}
      </div>
      <div className="text-3xl text-center w-full">{suit}</div>
      <div className="text-sm font-bold rotate-180 self-end">
        {card.rank} {suit}
      </div>
    </motion.div>
  );
};

export default CardFront;
