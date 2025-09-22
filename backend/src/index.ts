import { Server } from "socket.io";
import { GameState } from './types';
import setupEventHandlers from './eventHandlers';

const PORT: number = parseInt(process.env.PORT || "4000");

const io = new Server(PORT, {
  cors: {
    origin: "http://localhost:5173", // Vite's default dev server port
    methods: ["GET", "POST"],
    credentials: true
  }
})
const gameState: GameState = {}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    setupEventHandlers(socket, io, gameState);
});







