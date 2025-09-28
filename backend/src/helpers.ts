import { GameRoom, Answer } from "./types";

interface PlayerInfo {
    playerName: string;
    socketId: string;
    accuracy: number;
    currentQuestion: number;
}

export function calculateCurrentPlayerRanking(gameRoom: GameRoom) : PlayerInfo[] {
    // players ranked based on their accuracy. if two players have the same accuracy, the player who has completed more questions is ranked higher
    // otherwise the players are tied.
    const playerInfo : PlayerInfo[] = []

    for (const player of gameRoom.players) {
        let numCorrect = 0;
        player.answers.forEach((answer: Answer) => {
            if (answer.isCorrect) {
                numCorrect++;   
            }
        })
        let accuracy = numCorrect / player.answers.length;
        let currentQuestion = player.answers.length + 1;
        playerInfo.push({
            playerName: player.name,
            socketId: player.socketId,
            accuracy: accuracy,
            currentQuestion: currentQuestion
        })
    }
    playerInfo.sort((a, b) => {
        if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy;
        } else {
            return b.currentQuestion - a.currentQuestion;
        }
    })

    return playerInfo;
}



