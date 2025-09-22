import { Socket } from "socket.io-client";
import { SOCKET_EVENTS, type Question} from "./types";

export default function setupSocketEventListeners(socket: Socket, setCurrentRoomCode: Function, setQuestions: Function, setGameStarted: Function) {

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

    socket.on(SOCKET_EVENTS.ROOM_JOINED, (roomCode: string) => {
        console.log('Joined room:', roomCode)
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

    socket.on(SOCKET_EVENTS.QUESTION_ANSWERED, (roomCode: string, questionNumber: number, isCorrect: boolean, nextQuestion: Question) => {
        console.log('Next question:', nextQuestion)
        setQuestions((prevQuestions: Question[]) => [...prevQuestions, nextQuestion])
    })
}

