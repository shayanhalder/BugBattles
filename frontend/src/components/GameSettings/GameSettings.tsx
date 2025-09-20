import React from 'react';
import './GameSettings.css';

interface GameSettingsData {
  programmingLanguage: string;
  numberOfQuestions: number;
  typesOfQuestions: string[];
  maxPlayers: number;
  timeLimit: number;
}

interface GameSettingsProps {
  settings: GameSettingsData;
  onSettingsChange: (settings: GameSettingsData) => void;
}

const GameSettings: React.FC<GameSettingsProps> = ({ settings, onSettingsChange }) => {
  const programmingLanguages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'PHP',
    'Ruby'
  ];

  const questionTypes = [
    { value: 'selectCorrectCode', label: 'Select Correct Code' },
    { value: 'selectIncorrectCode', label: 'Select Incorrect Code' },
    { value: 'alwaysIncorrect', label: 'Always Incorrect' },
    { value: 'unknownCorrectness', label: 'Unknown Correctness' }
  ];

  const numberOfQuestionsOptions = [5, 10, 15, 20, 25, 30];
  const maxPlayersOptions = [2, 4, 6, 8, 10, 12];
  const timeLimitOptions = [15, 30, 45, 60, 90, 120];

  const handleSettingChange = (key: keyof GameSettingsData, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const handleQuestionTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      handleSettingChange('typesOfQuestions', [...settings.typesOfQuestions, type]);
    } else {
      handleSettingChange('typesOfQuestions', settings.typesOfQuestions.filter(t => t !== type));
    }
  };

  return (
    <div className="game-settings">
      <h3>Game Settings</h3>
      
      <div className="settings-grid">
        <div className="setting-item">
          <label htmlFor="programming-language">
            <span className="setting-icon">💻</span>
            Programming Language
          </label>
          <select
            id="programming-language"
            value={settings.programmingLanguage}
            onChange={(e) => handleSettingChange('programmingLanguage', e.target.value)}
            className="setting-select"
          >
            {programmingLanguages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="setting-item">
          <label htmlFor="number-of-questions">
            <span className="setting-icon">❓</span>
            Number of Questions
          </label>
          <select
            id="number-of-questions"
            value={settings.numberOfQuestions}
            onChange={(e) => handleSettingChange('numberOfQuestions', parseInt(e.target.value))}
            className="setting-select"
          >
            {numberOfQuestionsOptions.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="setting-item">
          <label htmlFor="max-players">
            <span className="setting-icon">👥</span>
            Maximum Players
          </label>
          <select
            id="max-players"
            value={settings.maxPlayers}
            onChange={(e) => handleSettingChange('maxPlayers', parseInt(e.target.value))}
            className="setting-select"
          >
            {maxPlayersOptions.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        <div className="setting-item">
          <label htmlFor="time-limit">
            <span className="setting-icon">⏱️</span>
            Time Limit (seconds)
          </label>
          <select
            id="time-limit"
            value={settings.timeLimit}
            onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value))}
            className="setting-select"
          >
            {timeLimitOptions.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="setting-item question-types">
        <label>
          <span className="setting-icon">🎯</span>
          Types of Questions
        </label>
        <div className="question-types-grid">
          {questionTypes.map(type => (
            <label key={type.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={settings.typesOfQuestions.includes(type.value)}
                onChange={(e) => handleQuestionTypeChange(type.value, e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-text">{type.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSettings;
