import './Game.css'
import Question from '../../components/Question/Question'
import PlayerSidebar from '../../components/PlayerSideBar/PlayerSidebar'
import { useState } from 'react'
import { SOCKET_EVENTS } from '../../types';
import AnswerResults from '../../components/AnswerResults/AnswerResults';

export default function Game({ socketRef, currentRoomCode, questions, players, name, answerResults } : any ) {
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
                {
                    answerResults && (
                        <>
                            <h1 style={{ textAlign: 'center'}}> Answer Results</h1>
                            <AnswerResults answerResults={answerResults} />
                        </>
                    )
                }
            </div>
        </div>
    )
}


