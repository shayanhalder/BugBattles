import './Game.css'
import Question from '../../components/Question/Question'
import { useState } from 'react'
import { SOCKET_EVENTS } from '../../types';

export default function Game({ socketRef, currentRoomCode, questions } : any ) {
    const [selectedLines, setSelectedLines] = useState<number[]>([]);
    const currentQuestion = questions[questions.length - 1]

    function submitAnswer() {
        socketRef.current.emit(SOCKET_EVENTS.ANSWER_QUESTION, currentRoomCode, questions.length, selectedLines)
        setSelectedLines([])
    }
    
    return (
        <>
            <Question question={currentQuestion.question} code={currentQuestion.code} onSubmit={submitAnswer}
                selectedLines={selectedLines} setSelectedLines={setSelectedLines} />
        </>
    )
}


