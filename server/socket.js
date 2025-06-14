const { Server } = require("socket.io");

let rooms = {}; // { roomId: [ { name, ready }, ... ] }

function initSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 Client connected:", socket.id);

        // Player joins a room
        socket.on("join_room", ({ roomId, playerName }) => {
            socket.join(roomId);
            socket.roomId = roomId;
            socket.playerName = playerName;

            if (!rooms[roomId]) rooms[roomId] = [];
            rooms[roomId].push({
                id: socket.id,
                name: playerName,
                ready: false,
            });

            console.log(`${playerName} joined room ${roomId}`);

            io.to(roomId).emit("update_players", rooms[roomId]);
        });

        // Player marks as ready
        socket.on("player_ready", () => {
            const { roomId, playerName } = socket;
            if (!rooms[roomId]) return;

            // Mark this player as ready
            const index = rooms[roomId].findIndex(p => p.id === socket.id);
            if (index !== -1) {
                rooms[roomId][index].ready = true;
            }

            // Emit updated player list
            io.to(roomId).emit("update_players", rooms[roomId]);

            // Check if all players are ready AND at least 4 players
            const allReady = rooms[roomId].length >= 4 &&
                rooms[roomId].every(p => p.ready);

            if (allReady) {
                io.to(roomId).emit("start_game");
                console.log(`🎮 Game started in room ${roomId}`);
            }
        });

        // Player disconnects
        socket.on("disconnect", () => {
            const { roomId, playerName } = socket;

            if (rooms[roomId]) {
                rooms[roomId] = rooms[roomId].filter((p) => p.name !== playerName);

                io.to(roomId).emit("update_players", rooms[roomId]);
                console.log(`❌ ${playerName} left room ${roomId}`);
            }
        });
    });

    return io;
}

module.exports = initSocket;
