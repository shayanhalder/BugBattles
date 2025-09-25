// import type { AnswerDelta } from '../../types';
import AnswerDelta from '../AnswerDelta/AnswerDelta.tsx';
import type { AnswerDeltaInfo } from '../../types';

export default function AnswerResults( { answerResults } : any) {

    return (
        <div className="answer-results-container">
            {answerResults.map((answerDelta: AnswerDeltaInfo) => (
                <AnswerDelta key={answerDelta.question} answerDelta={answerDelta} />
            ))}
        </div>
    )

}


