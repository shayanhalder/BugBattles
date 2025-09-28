import { useState, useEffect, useRef } from 'react'
import './App.css'
import { io, Socket } from "socket.io-client";
import { SOCKET_EVENTS, type AnswerDeltaInfo, type Question } from './types'
import Lobby from './pages/Lobby/Lobby';
import Home from './pages/Home/Home';
import Game from './pages/Game/Game';
import setupSocketEventListeners from './socketEventListeners';
import AnswerAlert from './components/AnswerAlert/AnswerAlert';

function App() {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState<string>('')
  const [roomCode, setRoomCode] = useState<string>('')
  const [currentRoomCode, setCurrentRoomCode] = useState<string>('')
  const [gameStarted, setGameStarted] = useState<boolean>(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [players, setPlayers] = useState<{name: string, socketId: string, isHost?: boolean}[]>([])
  const [showAnswerAlert, setShowAnswerAlert] = useState<boolean>(false)
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>(false)
  const [answerResults, setAnswerResults] = useState<AnswerDeltaInfo[]>([])
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // initialize socket connection only once when component mounts
    socketRef.current = io('http://localhost:4000', {
      transports: ['websocket', 'polling']
    })

    setupSocketEventListeners(socketRef.current, setCurrentRoomCode, setQuestions, 
      setGameStarted, setPlayers, setShowAnswerAlert, setAnswerIsCorrect, setAnswerResults, setName)
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [])

  const handleCreateRoom = () => {
    if (socketRef.current && name.trim()) {
      console.log('Creating room with name:', name)
      const payload = {
        username: name
      }
      socketRef.current.emit(SOCKET_EVENTS.CREATE_ROOM, payload)
    }
  }

  const handleJoinRoom = () => {
    if (socketRef.current && name.trim() && roomCode.trim()) {
      console.log('Joining room:', roomCode, 'with name:', name)
      const payload = {
        roomCode: roomCode,
        username: name
      }
      socketRef.current.emit(SOCKET_EVENTS.JOIN_ROOM, payload)
    }
  }

  const renderCurrentView = () => {
    const viewMap = {
      home: !currentRoomCode && !gameStarted,
      lobby: currentRoomCode && !gameStarted,
      game: gameStarted,
      answerResults: answerResults
    };

    if (viewMap.game) return (
      <>
        <Game socketRef={socketRef} currentRoomCode={currentRoomCode} questions={questions} players={players}
          name={name} answerResults={answerResults} isGameStarted={gameStarted} />
      </>
    )
    if (viewMap.lobby) return (
      <>
        <Lobby players={players} socketRef={socketRef} currentRoomCode={currentRoomCode} isGameStarted={gameStarted} />
      </>
    )
    return (
    <>
      <h1 className="title">BugBattles</h1>
      <Home mode={mode} setMode={setMode} name={name} setName={setName} 
          roomCode={roomCode} setRoomCode={setRoomCode} currentRoomCode={currentRoomCode} 
          setCurrentRoomCode={setCurrentRoomCode} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom}
          />
    </>
    )
  }


  return (
    <div className="app">
      {renderCurrentView()}
      <AnswerAlert 
        isVisible={showAnswerAlert} 
        isCorrect={answerIsCorrect} 
        onClose={() => setShowAnswerAlert(false)} 
      />
    </div>
  )
}

export default App
