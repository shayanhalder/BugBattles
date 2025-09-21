import { useState, useEffect, useRef } from 'react'
import './App.css'
import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS, type Question } from './types'
import Lobby from './pages/Lobby/Lobby';
import Home from './pages/Home/Home';
import Game from './pages/Game/Game';

function App() {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [currentRoomCode, setCurrentRoomCode] = useState('')
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // initialize socket connection only once when component mounts
    socketRef.current = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    })

    socketRef.current.on('connect', () => {
      console.log('Connected to server:', socketRef.current?.id)
    })

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from server')
    })

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error)
      alert('Failed to connect to server. Please make sure the backend is running.')
    })

    socketRef.current.on(SOCKET_EVENTS.ROOM_CREATED, (roomCode: string) => {
      console.log('Room created:', roomCode)
      // socketRef.current?.join(roomCode)
      setCurrentRoomCode(roomCode)
    })

    socketRef.current.on(SOCKET_EVENTS.ROOM_JOINED, (roomCode: string) => {
      console.log('Joined room:', roomCode)
      setCurrentRoomCode(roomCode)
    })

    socketRef.current.on(SOCKET_EVENTS.ROOM_NOT_FOUND, (roomCode: string) => {
      console.error('Room not found:', roomCode)
      alert('Room not found! Please check the room code.')
    })

    socketRef.current.on(SOCKET_EVENTS.NOT_AUTHORIZED, (roomCode: string) => {
      console.error('Not authorized for room:', roomCode)
      alert('You are not authorized to perform this action.')
    })

    socketRef.current.on(SOCKET_EVENTS.GAME_STARTED, (question: Question) => {
      console.log('Game started. Received question:', question)
      setQuestions(prevQuestions => [...prevQuestions, question])
      setGameStarted(true)
    })

    socketRef.current.on(SOCKET_EVENTS.QUESTION_ANSWERED, (roomCode: string, questionNumber: number, isCorrect: boolean, nextQuestion: Question) => {
      console.log('Next question:', nextQuestion)
      setQuestions(prevQuestions => [...prevQuestions, nextQuestion])
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const handleCreateRoom = () => {
    if (socketRef.current && name.trim()) {
      console.log('Creating room with name:', name)
      socketRef.current.emit(SOCKET_EVENTS.CREATE_ROOM, name)
    }
  }

  const handleJoinRoom = () => {
    if (socketRef.current && name.trim() && roomCode.trim()) {
      console.log('Joining room:', roomCode, 'with name:', name)
      socketRef.current.emit(SOCKET_EVENTS.JOIN_ROOM, roomCode, name)
    }
  }

  const renderCurrentView = () => {
    const viewMap = {
      home: !currentRoomCode && !gameStarted,
      lobby: currentRoomCode && !gameStarted,
      game: gameStarted
    };

    if (viewMap.game) return <Game socketRef={socketRef} currentRoomCode={currentRoomCode} questions={questions} />;
    if (viewMap.lobby) return <Lobby socketRef={socketRef} currentRoomCode={currentRoomCode} />;
    return <Home mode={mode} setMode={setMode} name={name} setName={setName} 
        roomCode={roomCode} setRoomCode={setRoomCode} currentRoomCode={currentRoomCode} 
        setCurrentRoomCode={setCurrentRoomCode} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}/>;
  }


  return (
    <div className="app">
      <h1 className="title">BugBattles</h1>
      {renderCurrentView()}
    </div>
  )
}

export default App
