import { useState, useEffect, useRef } from 'react'
import './App.css'
import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from './types'

function App() {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [currentRoomCode, setCurrentRoomCode] = useState('')
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Initialize socket connection only once when component mounts
    socketRef.current = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    })

    // Set up event listeners
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

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, []) // Empty dependency array means this only runs once on mount

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
      
      <div className="main-panel">
        <div className="mode-toggle">
          <button 
            className={`mode-button ${mode === 'create' ? 'active' : ''}`}
            onClick={() => setMode('create')}
          >
            Create room
          </button>
          <button 
            className={`mode-button ${mode === 'join' ? 'active' : ''}`}
            onClick={() => setMode('join')}
          >
            Join room
          </button>
        </div>

        <div className="form-section">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          
          {mode === 'join' && (
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="input-field"
            />
          )}

          <button 
            className="action-button"
            onClick={mode === 'create' ? handleCreateRoom : handleJoinRoom}
            disabled={!name.trim() || (mode === 'join' && !roomCode.trim())}
          >
            {mode === 'create' ? 'Create Room' : 'Join Room'}
          </button>

          {currentRoomCode && (
            <div className="room-info">
              <p>Room Code: <strong>{currentRoomCode}</strong></p>
              <p>Share this code with other players to join!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
