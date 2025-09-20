import { useState, useEffect, useRef } from 'react'
import './App.css'
import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from './types'
// import Question from './components/Question/Question'
import Lobby from './pages/Lobby/Lobby';
import Home from './pages/Home/Home';

function App() {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [currentRoomCode, setCurrentRoomCode] = useState('')
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

  return (
    <div className="app">
      <h1 className="title">BugBattles</h1>
      { currentRoomCode ? <Lobby /> : <Home mode={mode} setMode={setMode} name={name} setName={setName} roomCode={roomCode} setRoomCode={setRoomCode} currentRoomCode={currentRoomCode} setCurrentRoomCode={setCurrentRoomCode} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}/>}
      {/* <Question question="What is the capital of France?" code="console.log('Paris')" /> */}
    </div>
  )
}

export default App
