import { Server, Socket } from "socket.io";
import { GameState, Player, QuestionTypes, SOCKET_EVENTS, AnswerResult, GAME_STYLE } from "./types";
import questions from "./questions";
import { calculateCurrentPlayerRanking } from "./helpers";

export default function setupEventHandlers(socket: Socket, io: Server, gameState: GameState) {
    handleCreateRoom(socket, io, gameState);
    handleJoinRoom(socket, io, gameState);
    handleLeaveRoom(socket, gameState);
    handleStartGame(socket, gameState, io);
    handleAnswerQuestion(socket, io, gameState);
    handlePlayerFinished(socket, io, gameState);
}

function handleCreateRoom(socket: Socket, io: Server, gameState: GameState) {
    socket.on(SOCKET_EVENTS.CREATE_ROOM, (payload: { username: string | null }) => {
        const { username } = payload;
        const roomCode = generateRoomCode(gameState);
        const host: Player = {
            username: username || "Host",
            socketId: socket.id,
            answers: [],
            totalQuestionTimeTaken: 0,
            accuracy: 0,
            isHost: true
        }
        gameState[roomCode] = {
            questions: questions,
            players: [host],
            host: host,
            isGameStarted: false,
            numPlayersFinished: 0,
            startTime: null,
            settings: {
                numberOfQuestions: 10,
                questionTypes: [QuestionTypes.alwaysIncorrect, QuestionTypes.unknownCorrectness, QuestionTypes.selectIncorrectCode, QuestionTypes.selectCorrectCode],
                maxPlayers: 4,
                timeLimit: 900,
                gameStyle: GAME_STYLE.STANDARD
            }
        }
        console.log("Room created", gameState);
        socket.join(roomCode);
        const currentPlayerRankings = calculateCurrentPlayerRanking(gameState[roomCode]);
        const currentPlayerRankingsResponse = {
            roomCode: roomCode,
            currentPlayerRankings: currentPlayerRankings
        }
        io.to(roomCode).emit(SOCKET_EVENTS.PLAYER_RANKING_UPDATED, currentPlayerRankingsResponse);
        socket.emit(SOCKET_EVENTS.ROOM_CREATED, roomCode);
    })

}

function handleJoinRoom(socket: Socket, io: Server, gameState: GameState) {
    socket.on(SOCKET_EVENTS.JOIN_ROOM, (payload: { roomCode: string, username: string }) => {
        const { roomCode, username } = payload;
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        socket.join(roomCode);
        const player: Player = {
            username: username,
            socketId: socket.id,
            answers: [],
            accuracy: 0,
            totalQuestionTimeTaken: 0,
            isHost: false
        }
        gameState[roomCode].players.push(player);
        const currentPlayerRankings = calculateCurrentPlayerRanking(gameState[roomCode]);
        const playerJoinedResponse = {
            roomCode: roomCode,
            currentPlayerRankings: currentPlayerRankings
        }
        io.to(roomCode).emit(SOCKET_EVENTS.PLAYER_RANKING_UPDATED, playerJoinedResponse);
        const roomJoinedResponse = {
            roomCode: roomCode,
            username: username,
            players: currentPlayerRankings
        }
        socket.emit(SOCKET_EVENTS.ROOM_JOINED, roomJoinedResponse);
    })
}

function handleLeaveRoom(socket: Socket, gameState: GameState) {
    socket.on(SOCKET_EVENTS.LEAVE_ROOM, (payload: { roomCode: string }) => {
        const { roomCode } = payload;
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        // remove player from game state
        gameState[roomCode].players = gameState[roomCode].players.filter(player => player.socketId !== socket.id);
        socket.leave(roomCode);
        socket.emit(SOCKET_EVENTS.ROOM_LEFT, roomCode);
    })

}

function handleStartGame(socket: Socket, gameState: GameState, io: Server) {
    socket.on(SOCKET_EVENTS.START_GAME, (payload: { roomCode: string }) => {
        const { roomCode } = payload;
        if (!(roomCode in gameState)) {
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        if (gameState[roomCode].host.socketId !== socket.id) {
            socket.emit(SOCKET_EVENTS.NOT_AUTHORIZED, roomCode);
            return;
        }
        gameState[roomCode].isGameStarted = true;
        console.log("Game started", gameState[roomCode]);
        // game started, send the first question to all players
        gameState[roomCode].startTime = Date.now();
        io.to(roomCode).emit(SOCKET_EVENTS.GAME_STARTED, gameState[roomCode].questions[0]);
        setTimeout(() => {
            io.to(roomCode).emit(SOCKET_EVENTS.GAME_ENDED, roomCode);
        }, gameState[roomCode].settings.timeLimit * 1000);
    })
}

function handleAnswerQuestion(socket: Socket, io: Server, gameState: GameState) {
    socket.on(SOCKET_EVENTS.ANSWER_QUESTION, (payload: { roomCode: string, username: string, questionNumber: number, answer: number[] }) => {
        const { roomCode, username, questionNumber, answer } = payload;
        // questionNumber = question being answered (1-indexed)
        if (!(roomCode in gameState)) { // invalid room code
            socket.emit(SOCKET_EVENTS.ROOM_NOT_FOUND, roomCode);
            return;
        }
        if (questionNumber > gameState[roomCode].questions.length || questionNumber < 0) { // invalid question number
            socket.emit(SOCKET_EVENTS.INVALID_QUESTION_NUMBER, roomCode);
            return;
        }
        console.log("Answer received", answer);
        console.log("Question number", questionNumber);
        console.log("num questions", gameState[roomCode].questions.length);
        const player = gameState[roomCode].players.find(player => player.socketId === socket.id);
        if (!player) { // player not found
            return;
        }
        // update answer in the game state
        const correctAnswer = gameState[roomCode].questions[questionNumber - 1].answer.sort((a, b) => a - b);
        // compare answer and correct answer arrays for equality
        const isCorrect = Array.isArray(answer) && Array.isArray(correctAnswer) &&
            answer.length === correctAnswer.length &&
            answer.slice().sort((a, b) => a - b).every((val, idx) => val === correctAnswer[idx]);
        gameState[roomCode].players.find(player => player.socketId === socket.id)?.answers.push({
            playerAnswer: answer,
            isCorrect: isCorrect
        });
        let nextQuestion;
        if (questionNumber === gameState[roomCode].questions.length) {
            console.log("Player finished");
            nextQuestion = null;
            gameState[roomCode].numPlayersFinished++;
        } else {
            nextQuestion = gameState[roomCode].questions[questionNumber];
            console.log("Next question", nextQuestion);
        }
        const currentPlayerRankings = calculateCurrentPlayerRanking(gameState[roomCode]);
        const questionAnsweredResponse = {
            roomCode: roomCode,
            username: username,
            questionNumber: questionNumber,
            isCorrect: isCorrect,
            nextQuestion: nextQuestion,
        }
        const playerRankingUpdatedResponse = {
            roomCode: roomCode,
            currentPlayerRankings: currentPlayerRankings
        }
        io.to(roomCode).emit(SOCKET_EVENTS.PLAYER_RANKING_UPDATED, playerRankingUpdatedResponse);

        socket.emit(SOCKET_EVENTS.QUESTION_ANSWERED, questionAnsweredResponse);
        if (gameState[roomCode].numPlayersFinished === gameState[roomCode].players.length) {
            io.to(roomCode).emit(SOCKET_EVENTS.GAME_ENDED, roomCode);
        }
    })
}

function handlePlayerFinished(socket: Socket, io: Server, gameState: GameState) {
    socket.on(SOCKET_EVENTS.PLAYER_FINISHED, (payload: { roomCode: string, username: string }) => {
        const { roomCode, username } = payload;
        const answerResults: AnswerResult[] = [];
        const ourPlayer = gameState[roomCode].players.find(player => player.username === username);

        if (!ourPlayer) {
            return;
        }
        
        for (let i = 0; i < ourPlayer?.answers.length; i++) {
            answerResults.push({
                correctAnswer: gameState[roomCode].questions[i].answer,
                playerAnswer: ourPlayer.answers[i].playerAnswer,
                question: gameState[roomCode].questions[i].question,
                code: gameState[roomCode].questions[i].code
            });
        }

        socket.emit(SOCKET_EVENTS.PLAYER_FINISHED_RESULT, answerResults);
    })
}

function generateRoomCode(gameState: GameState): string {
    let roomCode: string;
    do {
        roomCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (roomCode in gameState);
    return roomCode;
}
