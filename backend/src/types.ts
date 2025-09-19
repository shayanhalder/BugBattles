
export enum QuestionTypes {
    alwaysIncorrect = "alwaysIncorrect",
    unknownCorrectness = "unknownCorrectness",
    selectIncorrectCode = "selectIncorrectCode",
    selectCorrectCode = "selectCorrectCode",
}

interface Question {
    question: string
    code: string
    answer: number[]
}

interface Answer {
    playerAnswer: number[]
    correctAnswer: number[]
    isCorrect: boolean
}

interface Player {
    name: string
    socketId: string
    answers: Answer[]
    timeTaken: number | null // in seconds
}

interface GameSettings {
    numberOfQuestions: number
    questionTypes: Array<QuestionTypes>
    maxPlayers: number
}

interface GameRoom {
    questions: Question[]
    players: Player[]
    isGameStarted: boolean
    settings: GameSettings
}

interface GameState {
    [key: string]: GameRoom
}

export type { GameRoom, GameState, GameSettings, Question, Answer, Player }



