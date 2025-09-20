import { useState } from 'react'
import './App.css'

function App() {
  const [mode, setMode] = useState<'create' | 'join'>('create')
  const [name, setName] = useState('')
  const [roomCode, setRoomCode] = useState('')

  const handleCreateRoom = () => {
    if (name.trim()) {
      console.log('Creating room with name:', name)
      // TODO: Implement room creation logic
    }
  }

  const handleJoinRoom = () => {
    if (name.trim() && roomCode.trim()) {
      console.log('Joining room:', roomCode, 'with name:', name)
      // TODO: Implement room joining logic
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
        </div>
      </div>
    </div>
  )
}

export default App
