import React from 'react';
import './PlayerSidebar.css';

interface Player {
  name: string;
  socketId: string;
  isHost?: boolean;
}

interface PlayerSidebarProps {
  players: Player[];
}

const PlayerSidebar: React.FC<PlayerSidebarProps> = ({ players }) => {
  return (
    <div className="player-sidebar">
      <div className="sidebar-header">
        <h2>Players ({players.length})</h2>
      </div>
      
      <div className="players-list">
        {players.map((player, index) => (
          <div key={player.socketId} className="player-item">
            <div className="player-info">
              <div className="player-rank">
                #{index + 1}
              </div>
              <div className="player-details">
                <span className="player-name">
                  {player.name}
                  {player.isHost && <span className="host-badge">Host</span>}
                </span>
                <span className="player-status">Ready</span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Show empty slots for remaining players */}
        {Array.from({ length: Math.max(0, 7 - players.length) }).map((_, index) => (
          <div key={`empty-${index}`} className="player-item empty-slot">
            <div className="player-info">
              <div className="player-rank">
                #{players.length + index + 1}
              </div>
              <div className="player-details">
                <span className="player-name">Waiting...</span>
                <span className="player-status">Empty</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSidebar;
