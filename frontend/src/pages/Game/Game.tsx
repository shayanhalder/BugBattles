import './Game.css'
import Question from '../../components/Question/Question'

export default function Game({ socketRef, currentRoomCode, questions, setQuestions } : any ) {
    const currentQuestion = questions[questions.length - 1]

  return (
        <>
            <Question question={currentQuestion.question} code={currentQuestion.code} onSubmit={() => {}} />
        </>
    )
}


