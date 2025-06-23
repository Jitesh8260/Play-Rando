export const getPlayerPosition = (index, totalPlayers, width, height) => {
  const CENTER_X = width / 2;
  const CENTER_Y = height / 2;
  const RESERVED_ANGLE_START = 70;
  const RESERVED_ANGLE_END = 160;

  const RESERVED_ANGLE = RESERVED_ANGLE_END - RESERVED_ANGLE_START;
  const USABLE_ANGLE = 360 - RESERVED_ANGLE;
  const angleGap = USABLE_ANGLE / totalPlayers;

  const angleDeg = (RESERVED_ANGLE_END + index * angleGap) % 360;
  const angleRad = (Math.PI / 180) * angleDeg;

  const x = CENTER_X + (width / 2) * Math.cos(angleRad);
  const y = CENTER_Y + (height / 2) * Math.sin(angleRad);

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
