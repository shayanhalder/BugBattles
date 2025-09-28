import './Home.css'

export default function Home({ mode, setMode, name, setName, roomCode, setRoomCode, currentRoomCode, setCurrentRoomCode, handleCreateRoom, handleJoinRoom } : any ) {
  return (
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

    )
}


