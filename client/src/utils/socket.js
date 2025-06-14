import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Change if deployed

export { socket }; // <-- THIS LINE IS REQUIRED
