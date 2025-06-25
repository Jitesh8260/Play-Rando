export const getPlayerPosition = (mySeat, targetSeat, totalPlayers, width, height) => {
  const CENTER_X = width / 2;
  const CENTER_Y = height / 2;
  const RESERVED_ANGLE_START = 70;
  const RESERVED_ANGLE_END = 160;

  const RESERVED_ANGLE = RESERVED_ANGLE_END - RESERVED_ANGLE_START;
  const USABLE_ANGLE = 360 - RESERVED_ANGLE;
  const angleGap = USABLE_ANGLE / (totalPlayers - 1 || 1); // excluding self

  // Get relative position
  const relativeSeat = (targetSeat - mySeat + totalPlayers) % totalPlayers;

  // Skip index 0 (you), others start from angle index 0
  const adjustedIndex = relativeSeat - 1;
  if (adjustedIndex < 0) return { x: CENTER_X, y: CENTER_Y + height / 2 + 80 }; // You (bottom center)

  const angleDeg = (RESERVED_ANGLE_END + adjustedIndex * angleGap) % 360;
  const angleRad = (Math.PI / 180) * angleDeg;

  const x = CENTER_X + (width / 2.2) * Math.cos(angleRad);
  const y = CENTER_Y + (height / 2.2) * Math.sin(angleRad);

  return { x, y };
};


export const getSuitSymbol = (suit) => {
  switch (suit) {
    case "Hearts":
      return "♥";
    case "Diamonds":
      return "♦";
    case "Clubs":
      return "♣";
    case "Spades":
      return "♠";
    default:
      return "";
  }
};
