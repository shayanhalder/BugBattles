import { useState } from 'react';
import PlayerSidebar from '../../components/PlayerSideBar/PlayerSidebar.tsx';
import GameSettings from '../../components/GameSettings/GameSettings.tsx';
import { useGameContext } from '../../types';
import './Lobby.css';
import { SOCKET_EVENTS } from '../../types.ts';

// interface Player {
//   username: string;
//   socketId: string;
//   accuracy: number;
//   currentQuestion: number;
// }


interface GameSettingsData {
  programmingLanguage: string;
  numberOfQuestions: number;
  typesOfQuestions: string[];
  maxPlayers: number;
  timeLimit: number;
}

export default function Lobby() {
  const { players, socketRef, currentRoomCode, gameStarted } = useGameContext();

  const [gameSettings, setGameSettings] = useState<GameSettingsData>({
    programmingLanguage: 'JavaScript',
    numberOfQuestions: 10,
    typesOfQuestions: ['selectCorrectCode', 'selectIncorrectCode'],
    maxPlayers: 7,
    timeLimit: 30,
  });

  const handleStartGame = () => {
    console.log('Starting game with settings:', gameSettings);
    const payload = {
      roomCode: currentRoomCode
    }
    socketRef.current?.emit(SOCKET_EVENTS.START_GAME, payload);
  };

  const handleInvite = async () => {
    const inviteLink = `${window.location.origin}/join/${currentRoomCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      alert('Invite link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy invite link:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Invite link copied to clipboard!');
    }
  };


  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <PlayerSidebar players={players} isGameStarted={gameStarted} />
        <div className="lobby-main">
          {/* <div className="lobby-header">
            <h1>Bug Battles</h1>
            <p>Configure your game settings and invite players</p>
          </div> */}
          
          <GameSettings 
            settings={gameSettings}
            onSettingsChange={setGameSettings}
          />
          
          <div className="lobby-actions">
            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
            <button className="invite-button" onClick={handleInvite}>
              <span className="invite-icon">🔗</span>
              Invite Players
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default Lobby;
