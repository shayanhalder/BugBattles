import './Game.css'
import Question from '../../components/Question/Question'
import PlayerSidebar from '../../components/PlayerSideBar/PlayerSidebar'
import { useState } from 'react'
import { SOCKET_EVENTS } from '../../types';

export default function Game({ socketRef, currentRoomCode, questions, players, name } : any ) {
    const [selectedLines, setSelectedLines] = useState<number[]>([]);
    const currentQuestion = questions[questions.length - 1]

    function submitAnswer() {
        socketRef.current.emit(SOCKET_EVENTS.ANSWER_QUESTION, currentRoomCode, name, questions.length, selectedLines)
        setSelectedLines([])
    }
    
    return (
        <div className="game-container">
            <PlayerSidebar players={players} />
            <div className="game-main">
                {
                    currentQuestion && (
                        <Question question={currentQuestion.question} code={currentQuestion.code} onSubmit={submitAnswer}
                            selectedLines={selectedLines} setSelectedLines={setSelectedLines} />
                    )
                }
            </div>
        </div>
    )
}


