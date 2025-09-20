import React, { useState } from 'react';
import PlayerSidebar from '../../components/PlayerSideBar/PlayerSidebar.tsx';
import GameSettings from '../../components/GameSettings/GameSettings.tsx';
import './Lobby.css';

interface Player {
  name: string;
  socketId: string;
  isHost?: boolean;
}

interface GameSettingsData {
  programmingLanguage: string;
  numberOfQuestions: number;
  typesOfQuestions: string[];
  maxPlayers: number;
  timeLimit: number;
}

const Lobby: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    { name: 'You', socketId: 'host-123', isHost: true },
    { name: 'Alice', socketId: 'player-456' },
    { name: 'Bob', socketId: 'player-789' },
  ]);

  const [gameSettings, setGameSettings] = useState<GameSettingsData>({
    programmingLanguage: 'JavaScript',
    numberOfQuestions: 10,
    typesOfQuestions: ['selectCorrectCode', 'selectIncorrectCode'],
    maxPlayers: 8,
    timeLimit: 30,
  });

  const handleStartGame = () => {
    console.log('Starting game with settings:', gameSettings);
    // TODO: Implement game start logic
  };

  const handleInvite = async () => {
    const inviteLink = `${window.location.origin}/join/${generateRoomId()}`;
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

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <div className="lobby-container">
      <div className="lobby-content">
        <PlayerSidebar players={players} />
        <div className="lobby-main">
          <div className="lobby-header">
            <h1>Bug Battles</h1>
            <p>Configure your game settings and invite players</p>
          </div>
          
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

export default Lobby;
