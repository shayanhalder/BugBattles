import { Socket } from "socket.io-client";
import { SOCKET_EVENTS, type AnswerDeltaInfo, type Question} from "./types";

export default function setupSocketEventListeners(socket: Socket, setCurrentRoomCode: Function, setQuestions: Function, 
    setGameStarted: Function, setPlayers: Function, setShowAnswerAlert: Function, setAnswerIsCorrect: Function, 
    setAnswerResults: Function) {

    socket.on('connect', () => {
        console.log('Connected to server:', socket.id)
      })
  
    socket.on('disconnect', () => {
        console.log('Disconnected from server')
    })

    socket.on(SOCKET_EVENTS.ROOM_CREATED, (roomCode: string) => {
        console.log('Room created:', roomCode)
        setCurrentRoomCode(roomCode)
    })


    socket.on(SOCKET_EVENTS.ROOM_NOT_FOUND, (roomCode: string) => {
        console.error('Room not found:', roomCode)
        alert('Room not found! Please check the room code.')
    })

    socket.on(SOCKET_EVENTS.NOT_AUTHORIZED, (roomCode: string) => {
        console.error('Not authorized for room:', roomCode)
        alert('You are not authorized to perform this action.')
    })

    socket.on(SOCKET_EVENTS.GAME_STARTED, (question: Question) => {
        console.log('Game started. Received question:', question)
        setQuestions((prevQuestions: Question[]) => [...prevQuestions, question])
        setGameStarted(true)
    })

    socket.on(SOCKET_EVENTS.QUESTION_ANSWERED, (_roomCode: string, username: string, _questionNumber: number, isCorrect: boolean, nextQuestion: Question, currentPlayerRankings: any) => {
        console.log('Next question:', nextQuestion)
        setQuestions((prevQuestions: Question[]) => [...prevQuestions, nextQuestion])
        console.log('Name:', username)
        console.log('Current player rankings:', currentPlayerRankings)
        
        if (!nextQuestion) {
            socket.emit(SOCKET_EVENTS.PLAYER_FINISHED, _roomCode, username)
        }
        
        // Show answer alert
        setAnswerIsCorrect(isCorrect)
        setShowAnswerAlert(true)
    })

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, (players: {name: string, socketId: string, isHost?: boolean}[]) => {
        console.log('Player joined. Updated players list:', players)
        setPlayers(players)
    })

    socket.on(SOCKET_EVENTS.PLAYER_LEFT, (players: {name: string, socketId: string, isHost?: boolean}[]) => {
        console.log('Player left. Updated players list:', players)
        setPlayers(players)
    })

    socket.on(SOCKET_EVENTS.ROOM_JOINED, (roomCode: string, players: {name: string, socketId: string, isHost?: boolean}[]) => {
        console.log('Joined room:', roomCode, 'Players:', players)
        setCurrentRoomCode(roomCode)
        setPlayers(players)
    })

    socket.on(SOCKET_EVENTS.PLAYER_FINISHED_RESULT, (answerResults: AnswerDeltaInfo[]) => {
        console.log('Player finished result:', answerResults)
        setAnswerResults(answerResults);
    })
}

