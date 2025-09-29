import { Socket } from "socket.io-client";
import { createContext, useContext } from "react";

export const SOCKET_EVENTS = {
    CREATE_ROOM: "create_room", 
    ROOM_CREATED: "room_created",
    JOIN_ROOM: "join_room",
    ROOM_JOINED: "room_joined",
    ROOM_NOT_FOUND: "room_not_found",
    LEAVE_ROOM: "leave_room",
    ROOM_LEFT: "room_left",
    START_GAME: "start_game",
    GAME_STARTED: "game_started",
    GAME_ENDED: "game_ended",
    GAME_NOT_FOUND: "game_not_found",
    GAME_NOT_STARTED: "game_not_started",
    NOT_AUTHORIZED: "not_authorized",
    ANSWER_QUESTION: "answer_question",
    QUESTION_ANSWERED: "question_answered",
    PLAYER_RANKING_UPDATED: "player_ranking_updated",
    INVALID_QUESTION_NUMBER: "invalid_question_number",
    PLAYER_FINISHED: "player_finished",
    PLAYER_FINISHED_RESULT: "player_finished_result",
    PLAYER_JOINED: "player_joined",
    PLAYER_LEFT: "player_left",
}


export interface Question {
    question: string
    code: string
    playerAnswer: number[] | null
    isCorrect: boolean | null
}

export interface AnswerDeltaInfo {
    question: string,
    code: string,
    correctAnswer: number[]
    playerAnswer: number[]
}

export interface Player {
    username: string
    socketId: string
    answers: Answer[]
    accuracy: number // number of questions correctly answered
    totalQuestionTimeTaken: number // in seconds
    isHost: boolean
}

interface Answer {
    playerAnswer: number[]
    isCorrect: boolean
}

export interface GameContextType {
    // State
  name: string;
  setName: (name: string) => void;
  mode: 'create' | 'join';
  setMode: (mode: 'create' | 'join') => void;
  roomCode: string;
  setRoomCode: (code: string) => void;
  currentRoomCode: string;
  setCurrentRoomCode: (code: string) => void;
  gameStarted: boolean;
  setGameStarted: (started: boolean) => void;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  showAnswerAlert: boolean;
  setShowAnswerAlert: (show: boolean) => void;
  answerIsCorrect: boolean;
  setAnswerIsCorrect: (correct: boolean) => void;
  answerResults: AnswerDeltaInfo[];
  setAnswerResults: (results: AnswerDeltaInfo[]) => void;
  handleCreateRoom: () => void;
  handleJoinRoom: () => void;
  
  // Socket
  socketRef: React.RefObject<Socket | null>;
    // socketRef: React.RefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>;

}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
      throw new Error('useGameContext must be used within a GameProvider');
    }
    return context;
};

