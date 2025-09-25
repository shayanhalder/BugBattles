import React, { useState } from 'react';
import './AnswerDelta.css';
import type { AnswerDeltaInfo } from '../../types';

interface AnswerDeltaProps {
  answerDelta: AnswerDeltaInfo;
}

const AnswerDelta: React.FC<AnswerDeltaProps> = ({ answerDelta }) => {
  const [activeTab, setActiveTab] = useState<'player' | 'correct'>('player');
  const codeLines = answerDelta.code.split('\n');

  const getLineHighlightClass = (lineNumber: number, tab: 'player' | 'correct') => {
    if (tab === 'player') {
      const isPlayerSelected = answerDelta.playerAnswer.includes(lineNumber);
      const isCorrectSelected = answerDelta.correctAnswer.includes(lineNumber);
      
      if (isPlayerSelected && isCorrectSelected) {
        return 'correct-line'; // Green - player got it right
      } else if (isPlayerSelected && !isCorrectSelected) {
        return 'incorrect-line'; // Red - player got it wrong
      }
    } else if (tab === 'correct') {
      if (answerDelta.correctAnswer.includes(lineNumber)) {
        return 'correct-answer-line'; // Blue - correct answer
      }
    }
    
    return '';
  };

  return (
    <div className="answer-result-container">
      <div className="answer-result-content">

      <div className="answer-result-tabs">
          <button 
            className={`tab-button ${activeTab === 'player' ? 'active' : ''}`}
            onClick={() => setActiveTab('player')}
          >
            Your Answer
          </button>
          <button 
            className={`tab-button ${activeTab === 'correct' ? 'active' : ''}`}
            onClick={() => setActiveTab('correct')}
          >
            Correct Answer
          </button>
        </div>
        <p className="answer-result-question">{answerDelta.question}</p>
        
        
        <div className="answer-result-code-block">
          <div className="code-lines">
            {codeLines.map((line, index) => {
              const lineNumber = index + 1;
              const highlightClass = getLineHighlightClass(lineNumber, activeTab);
              
              return (
                <div 
                  key={index} 
                  className={`code-line ${highlightClass}`}
                >
                  <span className="line-number">{lineNumber}</span>
                  <span className="line-content">{line}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* <div className="answer-result-legend"> */}
          {/* {activeTab === 'player' && (
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color correct-line"></div>
                <span>Correctly selected</span>
              </div>
              <div className="legend-item">
                <div className="legend-color incorrect-line"></div>
                <span>Incorrectly selected</span>
              </div>
            </div>
          )} */}
          {/* {activeTab === 'correct' && (
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color correct-answer-line"></div>
                <span>Correct answer lines</span>
              </div>
            </div>
          )} */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default AnswerDelta;
