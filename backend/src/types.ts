
export enum QuestionTypes {
    alwaysIncorrect = "alwaysIncorrect",
    unknownCorrectness = "unknownCorrectness",
    selectIncorrectCode = "selectIncorrectCode",
    selectCorrectCode = "selectCorrectCode",
}

export enum SOCKET_EVENTS {
    CREATE_ROOM = "create_room", 
    ROOM_CREATED = "room_created",
    JOIN_ROOM = "join_room",
    ROOM_JOINED = "room_joined",
    ROOM_NOT_FOUND = "room_not_found",
    LEAVE_ROOM = "leave_room",
    ROOM_LEFT = "room_left",
    START_GAME = "start_game",
    GAME_STARTED = "game_started",
    GAME_ENDED = "game_ended",
    GAME_NOT_FOUND = "game_not_found",
    GAME_NOT_STARTED = "game_not_started",
    NOT_AUTHORIZED = "not_authorized",
    ANSWER_QUESTION = "answer_question",
    QUESTION_ANSWERED = "question_answered",
    PLAYER_RANKING_UPDATED = "player_ranking_updated",
    INVALID_QUESTION_NUMBER = "invalid_question_number",
    PLAYER_FINISHED = "player_finished",
    PLAYER_FINISHED_RESULT = "player_finished_result",
}

export enum GAME_STYLE {
    KAHOOT = "kahoot", // every player answers the same question one by one similar to kahoot
    STANDARD = "standard", // every player progresses to the next question at their own pace
}

interface Question {
    question: string
    code: string
    answer: number[]
}

interface Answer {
    playerAnswer: number[]
    isCorrect: boolean
}

interface Player {
    username: string
    socketId: string
    answers: Answer[]
    accuracy: number // number of questions correctly answered
    totalQuestionTimeTaken: number // in seconds
}

interface GameSettings {
    numberOfQuestions: number
    questionTypes: Array<QuestionTypes>
    maxPlayers: number
    timeLimit: number // in seconds
    gameStyle: GAME_STYLE
}

interface GameRoom {
    questions: Question[]
    players: Player[]
    host: Player
    isGameStarted: boolean
    numPlayersFinished: number
    startTime: number | null, 
    settings: GameSettings
}

interface GameState {
    [key: string]: GameRoom
}

interface AnswerResult {
    correctAnswer: number[]
    playerAnswer: number[]
    question: string
    code: string
}

export type { GameRoom, GameState, GameSettings, Question, Answer, Player, AnswerResult }



