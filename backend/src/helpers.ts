import { GameRoom, Answer, Player } from "./types";

export function calculateCurrentPlayerRanking(gameRoom: GameRoom) : Player[] {
    // players ranked based on their accuracy. if two players have the same accuracy, the player who has completed more questions is ranked higher
    // otherwise the players are tied.
    
    for (let i = 0; i < gameRoom.players.length; i++) {
        let numCorrect = 0;
        gameRoom.players[i].answers.forEach((answer: Answer) => {
            if (answer.isCorrect) {
                numCorrect++;   
            }
        })
        let accuracy = gameRoom.players[i].answers.length > 0 ? numCorrect / gameRoom.players[i].answers.length : 0;
        gameRoom.players[i].accuracy = accuracy;
    }
    gameRoom.players.sort((a: Player, b: Player) => {
        if (b.accuracy !== a.accuracy) {
            return b.accuracy - a.accuracy; // higher accuracy is better
        } else {
            return b.answers.length - a.answers.length; // more questions answered is better
        }
    })

    return gameRoom.players;
}



