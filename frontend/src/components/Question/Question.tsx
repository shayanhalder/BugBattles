import React from 'react';
import './Question.css';

interface QuestionProps {
  question: string;
  code: string;
  onSubmit?: () => void;
}

const Question: React.FC<QuestionProps> = ({ question, code, onSubmit }) => {
  const codeLines = code.split('\n');

  return (
    <div className="question-container">
      <div className="question-content">
        <h1 className="question-title">BugBattles</h1>
        <p className="question-text">{question}</p>
        
        <div className="code-block">
          <div className="code-lines">
            {codeLines.map((line, index) => (
              <div key={index} className="code-line">
                <span className="line-number">{index + 1}</span>
                <span className="line-content">{line}</span>
              </div>
            ))}
          </div>
        </div>
        
        <button className="submit-button" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Question;
