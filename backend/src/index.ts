import { Server } from "socket.io";
import { GameState, Player, QuestionTypes, SOCKET_EVENTS } from './types';

const PORT: number = parseInt(process.env.PORT || "3000");

const io = new Server(PORT, {})
const gameState: GameState = {}


function generateRoomCode(gameState: GameState): string {
    let roomCode: string;
    do {
        roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (roomCode in gameState);
    return roomCode;
}

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on(SOCKET_EVENTS.CREATE_ROOM, (username: string | null) => {
        const roomCode = generateRoomCode(gameState);
        const host: Player = {
            name: username || "Host",
            socketId: socket.id,
            answers: [],
            timeTaken: null
        }
        gameState[roomCode] = {
            questions: [],
            players: [host],
            host: host,
            isGameStarted: false,
            settings: {
                numberOfQuestions: 10,
                questionTypes: [QuestionTypes.alwaysIncorrect, QuestionTypes.unknownCorrectness, QuestionTypes.selectIncorrectCode, QuestionTypes.selectCorrectCode],
                maxPlayers: 4,
                timeLimit: 900
            }
        }
        socket.join(roomCode);
        socket.emit(SOCKET_EVENTS.ROOM_CREATED, roomCode);
    })

    socket.on(SOCKET_EVENTS.JOIN_ROOM, (roomCode: string, username: string) => {
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        socket.join(roomCode);
        const player: Player = {
            name: username,
            socketId: socket.id,
            answers: [],
            timeTaken: null
        }
        gameState[roomCode].players.push(player);
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, roomCode);
    })

    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (roomCode: string) => {
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        // remove player from game state
        gameState[roomCode].players = gameState[roomCode].players.filter(player => player.socketId !== socket.id);
        socket.leave(roomCode);
        socket.emit(SOCKET_EVENTS.ROOM_LEFT, roomCode);
    })

    socket.on(SOCKET_EVENTS.START_GAME, (roomCode: string) => {
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        if (gameState[roomCode].host.socketId !== socket.id) {
            socket.emit(SOCKET_EVENTS.NOT_AUTHORIZED, roomCode);
            return;
        }
        gameState[roomCode].isGameStarted = true;
        // game started, send the first question to all players
        socket.to(roomCode).emit(SOCKET_EVENTS.GAME_STARTED, gameState[roomCode].questions[0]);
        setTimeout(() => {
            socket.to(roomCode).emit(SOCKET_EVENTS.GAME_ENDED, roomCode);
        }, gameState[roomCode].settings.timeLimit * 1000);
    })

    socket.on(SOCKET_EVENTS.ANSWER_QUESTION, (roomCode: string, questionNumber: number, answer: number[]) => {
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        if (questionNumber >= gameState[roomCode].questions.length || questionNumber < 0) {
            socket.emit(SOCKET_EVENTS.INVALID_QUESTION_NUMBER, roomCode);
            return;
        }
        const player = gameState[roomCode].players.find(player => player.socketId === socket.id);
        if (!player) {
            return;
        }
        // update answer in the game state
        const isCorrect = answer === gameState[roomCode].questions[questionNumber].answer;
        gameState[roomCode].players.find(player => player.socketId === socket.id)?.answers.push({
            playerAnswer: answer,
            isCorrect: isCorrect
        });
        let nextQuestion;
        if (questionNumber === gameState[roomCode].questions.length - 1) {
            nextQuestion = null;
            gameState[roomCode].numPlayersFinished++;
        } else {
            nextQuestion = gameState[roomCode].questions[questionNumber + 1];
        }
        socket.emit(SOCKET_EVENTS.QUESTION_ANSWERED, roomCode, questionNumber, isCorrect, nextQuestion);
        if (gameState[roomCode].numPlayersFinished === gameState[roomCode].players.length) {
            socket.to(roomCode).emit(SOCKET_EVENTS.GAME_ENDED, roomCode);
        }
    })
    

});







