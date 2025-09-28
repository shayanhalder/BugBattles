import { Socket } from "socket.io-client";
import { SOCKET_EVENTS, type AnswerDeltaInfo, type Question} from "./types";

export default function setupSocketEventListeners(socket: Socket, setCurrentRoomCode: Function, setQuestions: Function, 
    setGameStarted: Function, setPlayers: Function, setShowAnswerAlert: Function, setAnswerIsCorrect: Function, 
    setAnswerResults: Function, setName: Function) {

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

    socket.on(SOCKET_EVENTS.QUESTION_ANSWERED, (response: any) => {
        console.log("response:", response)
        console.log('Next question:', response.nextQuestion)
        setQuestions((prevQuestions: Question[]) => [...prevQuestions, response.nextQuestion])
        console.log('Name:', response.username)

        if (!response.nextQuestion) {
            const payload = {
                roomCode: response.roomCode,
                username: response.username
            }
            socket.emit(SOCKET_EVENTS.PLAYER_FINISHED, payload)
        }
        
        // Show answer alert
        setAnswerIsCorrect(response.isCorrect)
        setShowAnswerAlert(true)
    })

    socket.on(SOCKET_EVENTS.PLAYER_RANKING_UPDATED, (response: any) => {
        console.log('Current player rankings:', response.currentPlayerRankings)
        setPlayers(response.currentPlayerRankings)
    })

    socket.on(SOCKET_EVENTS.PLAYER_JOINED, (response: {username: string, socketId: string, isHost?: boolean, players: any[]}) => {
        // console.log('Player joined. Updated players list:', players)
        console.log("player joined response: ", response)
        setPlayers(response.players)
    })

    socket.on(SOCKET_EVENTS.PLAYER_LEFT, (players: {name: string, socketId: string, isHost?: boolean}[]) => {
        console.log('Player left. Updated players list:', players)
        setPlayers(players)
    })

    socket.on(SOCKET_EVENTS.ROOM_JOINED, (response: {roomCode: string, username: string, players: {username: string, socketId: string, isHost?: boolean}[]}) => {
        const { roomCode, players, username } = response;
        console.log('Joined room:', roomCode, 'Players:', players)
        setName(username)
        setCurrentRoomCode(roomCode)
        setPlayers(players)
    })

    socket.on(SOCKET_EVENTS.PLAYER_FINISHED_RESULT, (answerResults: AnswerDeltaInfo[]) => {
        console.log('Player finished result:', answerResults)
        setAnswerResults(answerResults);
    })
}

