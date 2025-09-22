import React from 'react';
import './Question.css';

interface QuestionProps {
  question: string;
  code: string;
  onSubmit?: () => void;
  selectedLines: number[];
  setSelectedLines: (lines: number[]) => void;
}

const Question: React.FC<QuestionProps> = ({ question, code, selectedLines, setSelectedLines, onSubmit } : any) => {
  const codeLines = code.split('\n');
  
  const handleLineClick = (lineNumber: number) => {
    setSelectedLines((prev: any) => 
      prev.includes(lineNumber) 
        ? prev.filter((num: any) => num !== lineNumber)
        : [...prev, lineNumber]
    );
  };

  return (
    <div className="question-container">
      <div className="question-content">
        <p className="question-text">{question}</p>
        
        <div className="code-block">
          <div className="code-lines">
            {codeLines.map((line: any, index: any) => {
              const lineNumber = index + 1;
              const isSelected = selectedLines.includes(lineNumber);
              
              return (
                <div 
                  key={index} 
                  className={`code-line ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleLineClick(lineNumber)}
                >
                  <span className="line-number">{lineNumber}</span>
                  <span className="line-content">{line}</span>
                </div>
              )
            })}
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
