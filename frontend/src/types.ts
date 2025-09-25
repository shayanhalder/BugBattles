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

export interface AnswerResult {
    correctAnswer: number[]
    playerAnswer: number[]
}