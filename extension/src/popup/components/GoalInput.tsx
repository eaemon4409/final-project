import React from 'react';
import { Target } from 'lucide-react';

interface GoalInputProps {
  goal: string;
  onChangeGoal: (goal: string) => void;
}

export const GoalInput: React.FC<GoalInputProps> = ({ goal, onChangeGoal }) => {
  return (
    <div className="goal-input-section">
      <label htmlFor="user-goal-input" className="goal-label">
        <Target size={14} className="goal-icon" />
        <span>What matters to you? — <span className="optional-tag">Optional</span></span>
      </label>
      <div className="input-wrapper">
        <textarea
          id="user-goal-input"
          className="goal-textarea"
          rows={2}
          placeholder="e.g. Best laptop for programming under Tk 80,000, or Battery life is most important..."
          value={goal}
          onChange={(e) => onChangeGoal(e.target.value)}
          maxLength={300}
        />
      </div>
      <p className="goal-hint">
        Personalizes the comparison verdict. If left blank, AI performs an objective general comparison.
      </p>
    </div>
  );
};
