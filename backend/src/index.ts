import { Server } from "socket.io";
import { GameState, Player, QuestionTypes } from './types';
// import { QuestionTypes } from './types';

enum SOCKET_EVENTS {
    CREATE_ROOM = "create_room", 
    ROOM_CREATED = "room_created",

}

const PORT: number = parseInt(process.env.PORT || "3000");

const io = new Server(PORT, {})
const gameState: GameState = {};


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on(SOCKET_EVENTS.CREATE_ROOM, (username: string | null) => {
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        const host: Player = {
            name: username || "Host",
            socketId: socket.id,
            answers: [],
            timeTaken: null
        }
        gameState[roomCode] = {
            questions: [],
            players: [host],
            isGameStarted: false,
            settings: {
                numberOfQuestions: 10,
                questionTypes: [QuestionTypes.alwaysIncorrect, QuestionTypes.unknownCorrectness, QuestionTypes.selectIncorrectCode, QuestionTypes.selectCorrectCode],
                maxPlayers: 4
            }
        }
        socket.join(roomCode);
        socket.emit(SOCKET_EVENTS.ROOM_CREATED, roomCode);

    })

});







