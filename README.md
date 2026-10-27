<h1 align="center">🎴 Play-Rando</h1>

<p align="center">
  <strong>A real-time multiplayer card game built with React, Node.js, and Socket.IO</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Socket.IO-4.x-010101?style=flat-square&logo=socket.io" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/license-ISC-blue?style=flat-square" alt="ISC License" />
</p>

---

## 📖 Table of Contents

- [About the Game](#-about-the-game)
- [Gameplay Overview](#-gameplay-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
- [How to Play](#-how-to-play)
- [Architecture](#-architecture)
- [Socket Events](#-socket-events)
- [Contributing](#-contributing)
- [Contributors](#-contributors)

---

## 🎮 About the Game

**Play-Rando** is an online real-time multiplayer card game inspired by classic knock-based card games. Players join a shared room, strategize with their three-card hand, and compete to achieve the highest score — or be the cunning one to **Knock** and end the round. The last player standing wins the game!

The game features a slick, space-themed dark UI with glowing effects, animated card transitions, live player state tracking, and an automatic game-over ranking screen.

---

## 🃏 Gameplay Overview

- **Players Required:** 4 players per room (game starts automatically once all 4 are ready)
- **Objective:** Hold the highest-scoring hand, or strategically knock to end the round before opponents can improve theirs
- **Hand:** Each player holds **3 cards** at all times
- **Scoring:** Cards are scored by rank; the player with the lowest hand score at the end of a round risks elimination
- **Rounds:** Multiple rounds are played until a winner is determined

---

## ✨ Features

- 🔴 **Real-Time Multiplayer** — Powered by Socket.IO; all game state is synced live across all connected players
- 🏠 **Room System** — Players create/join rooms using a custom Room ID and display name
- 🃏 **Dynamic Card Dealing** — Cards are dealt server-side and distributed securely to each player
- ♻️ **Draw & Swap Mechanic** — On your turn, draw from the deck or pick up the discard pile top card, then swap with one of your hand cards
- 🔔 **Knock Mechanic** — When eligible, a player can knock to trigger the final scoring reveal; a countdown timer adds urgency
- 📊 **Round-End Scoreboard** — Displays all players' final hands and scores after each round
- 🏆 **Game Over Rankings** — Full ranking screen (1st, 2nd, 3rd) is shown at game end, then redirects to lobby
- 🚫 **Elimination System** — Players with the lowest hand are eliminated round by round
- 👥 **Lobby & Ready System** — Players must mark themselves as ready before the game begins
- 💬 **Live Player List** — Real-time display of who has joined and who is ready in the lobby
- 🎨 **Animated UI** — Smooth card animations using Framer Motion; responsive glassmorphism design

---

## 🛠 Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React 19, React Router DOM 7          |
| Styling    | Tailwind CSS 4, PostCSS               |
| Animations | Framer Motion                         |
| Build Tool | Vite 6                                |
| Backend    | Node.js, Express 5                    |
| Real-Time  | Socket.IO 4 (server + client)         |
| Linting    | ESLint 9 with React Hooks plugin      |

---

## 📁 Project Structure

```
Play-Rando/
├── assets/                  # Contributor avatar images
│   ├── Jitesh.png
│   └── Monsoon.png
│
├── client/                  # React frontend (Vite)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx          # App entry point
│       ├── App.jsx           # Route definitions (/, /lobby, /game)
│       ├── index.css         # Global styles
│       ├── App.css
│       ├── pages/
│       │   ├── Home.jsx      # Landing / home screen
│       │   ├── Lobby.jsx     # Room join, player ready screen
│       │   └── Game.jsx      # Main game board
│       ├── components/
│       │   ├── CardFront.jsx      # Animated playing card component
│       │   ├── ChatBox.jsx        # (In development) In-game chat
│       │   ├── GameOverModal.jsx  # End-of-game rankings overlay
│       │   ├── PlayNowButton.jsx  # CTA button on home screen
│       │   ├── PlayerInfo.jsx     # Player info display
│       │   └── Scoreboard.jsx     # Round-end hand reveal & scores
│       └── utils/
│           ├── socket.js     # Socket.IO client instance
│           └── helpers.js    # Oval seat positioning & suit symbols
│
└── server/                  # Node.js backend
    ├── index.js              # Express + HTTP server bootstrap
    ├── socket.js             # All Socket.IO game logic & room management
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher

---

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/Jitesh8260/Play-Rando.git
cd Play-Rando
```

**2. Install server dependencies:**

```bash
cd server
npm install
```

**3. Install client dependencies:**

```bash
cd ../client
npm install
```

---

### Running Locally

You will need **two terminal windows** — one for the server and one for the client.

**Terminal 1 — Start the backend server:**

```bash
cd server
node index.js
```

> The server will start at `http://localhost:3000`

**Terminal 2 — Start the frontend dev server:**

```bash
cd client
npm run dev
```

> The client will start at `http://localhost:5173` (default Vite port)

Then open `http://localhost:5173` in your browser. Open 4 tabs (or share the URL with 3 friends) to test the full multiplayer experience!

---

## 🎯 How to Play

1. **Open the app** and click **Play Now** on the home screen.
2. **Enter your name** and a **Room ID** (e.g. `room1`) — share the same Room ID with your friends.
3. **Click "Join Room"** and then **"Ready"** when you're set.
4. The game starts automatically once **4 players** in the same room are all ready.
5. **On your turn:**
   - Click **🂠 Draw** to draw a card from the deck, or
   - Click the **discard pile** to pick up the top card.
   - Select which card in your hand to **discard**, then click **♻️ Swap**.
6. If you're eligible, click **🔔 Knock** before the timer runs out to trigger the final reveal.
7. After the round ends, the **Scoreboard** shows everyone's hands.
8. The player with the lowest score may be **eliminated**.
9. The game continues until a **winner** is crowned — a 🏆 **Game Over** screen with rankings is shown.

---

## 🏗 Architecture

```
Browser (React) ←——— Socket.IO ———→ Node.js Server
     |                                      |
  Home Page                          Room Management
  Lobby Page          ←events→       Deal Cards
  Game Board                         Turn Handling
  Scoreboard                         Knock Logic
  Game Over Modal                    Elimination / Rankings
```

All game state (rooms, player hands, turn order, scores) lives **server-side** in memory. The client only holds what it needs to render its own view — it never sees other players' cards directly.

---

## 📡 Socket Events

### Client → Server

| Event             | Payload                                      | Description                            |
|-------------------|----------------------------------------------|----------------------------------------|
| `join_room`       | `{ roomId, playerId, playerName }`           | Player joins a room                    |
| `player_ready`    | —                                            | Player marks themselves as ready       |
| `get_cards`       | —                                            | Request current hand after start       |
| `draw_card`       | —                                            | Draw a card from the deck              |
| `pick_discard_card` | —                                          | Pick up the top discard pile card      |
| `discard_card`    | `{ discard, keep }`                          | Swap drawn card with a hand card       |
| `player_knock`    | —                                            | Knock to end the round                 |

### Server → Client

| Event              | Payload                                      | Description                            |
|--------------------|----------------------------------------------|----------------------------------------|
| `update_players`   | `[{ id, name, ready }]`                      | Updated lobby player list              |
| `start_game`       | —                                            | Signals game start to all in room      |
| `deal_cards`       | `{ players, currentTurn, discardTop }`       | Initial card deal                      |
| `update_turn`      | `nextTurnId`                                 | Whose turn it is now                   |
| `update_discard_pile` | `topCard`                                 | New top card on discard pile           |
| `card_drawn`       | `card`                                       | The card the player just drew          |
| `update_hand`      | `newHand`                                    | Updated hand after a swap              |
| `player_knocked`   | `playerName`                                 | Broadcasts who knocked                 |
| `allow_knock`      | —                                            | Enables knock button for active player |
| `knock_timer`      | `count`                                      | Countdown ticks for knock window       |
| `disable_knock`    | —                                            | Disables knock button                  |
| `round_end`        | `{ finalHands, rankings }`                   | Ends round, reveals all hands          |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing style and that the app runs without errors before submitting.

---

## 👨‍💻 Contributors

<p align="center">
  <a href="https://github.com/Jitesh8260"><img src="https://github.com/Jitesh8260/Play-Rando/blob/main/assets/Jitesh.png?raw=true" width="80px" alt="Jitesh" /></a>
  <a href="https://github.com/Monsoon-19"><img src="https://github.com/Jitesh8260/Play-Rando/blob/main/assets/Monsoon.png?raw=true" width="80px" alt="Monsoon" /></a>
</p>

<p align="center">
  Built with ❤️ by <strong>Jitesh & Team</strong> © 2025
</p>
