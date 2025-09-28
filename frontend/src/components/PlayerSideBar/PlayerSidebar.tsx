import React from 'react';
import './PlayerSidebar.css';

interface Player {
  username: string;
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
                  {player.username}
                  {player.isHost && <span className="host-badge">Host</span>}
                </span>
                <span className="player-status">Ready</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerSidebar;
