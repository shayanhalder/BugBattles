import React from 'react';
import './PlayerSidebar.css';

interface Answer {
  playerAnswer: number[]
  isCorrect: boolean
}

interface Player {
  username: string;
  socketId: string;
  accuracy: number;
  answers: Answer[];
  isHost?: boolean;
}

interface PlayerSidebarProps {
  players: Player[];
  isGameStarted: boolean;
}

const PlayerItem = ({ player, rank, isGameStarted }: { player: Player, rank: number, isGameStarted: boolean }) => {
  return (
    <div key={player.socketId} className="player-item">
      <div className="player-info">
        <div className="player-rank">
          #{rank}
        </div>
        <div className="player-details">
          <span className="player-name">
            {player.username}
            {player.isHost && <span className="host-badge">Host</span>}
          </span>
          {
            isGameStarted && (
              <div>
                <span className="player-status">Score: {player.accuracy * player.answers.length}</span>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

const PlayerSidebar: React.FC<PlayerSidebarProps> = ({ players, isGameStarted }) => {
  const playerList = [];
  if (isGameStarted) {
    let rank = 0;
    for (let i = 0; i < players.length; i++) {
      if (i > 0 && i < players.length && players[i].accuracy === players[i - 1].accuracy && 
          players[i].answers.length === players[i - 1].answers.length) {
            playerList.push(PlayerItem({ player: players[i], rank: rank, isGameStarted: isGameStarted }))
      } else {
        rank++;
        playerList.push(PlayerItem({ player: players[i], rank: rank, isGameStarted: isGameStarted }))
      }
    }
  } else {
    let rank = 1;
    players.map((player) => {
      playerList.push(PlayerItem({ player: player, rank: rank, isGameStarted: isGameStarted }))
      rank++;
    })
  }


  return (
    <div className="player-sidebar">
      <div className="sidebar-header">
        <h2> { isGameStarted ? "Leaderboard" : "Players" } </h2>
      </div>
      
      <div className="players-list">
        {playerList}
      </div>
    </div>
  );
};

export default PlayerSidebar;
