import React from 'react';
import { GitCompare } from 'lucide-react';

interface KeyDifferencesProps {
  differences: string[];
}

export const KeyDifferences: React.FC<KeyDifferencesProps> = ({ differences }) => {
  if (differences.length === 0) return null;

  return (
    <div className="key-differences-section">
      <div className="section-title-row">
        <h3 className="section-title">Important Differences</h3>
      </div>
      <div className="differences-card">
        <ul className="differences-list">
          {differences.map((diff, idx) => (
            <li key={idx} className="difference-item">
              <GitCompare size={15} className="diff-bullet-icon" />
              <span className="diff-text">{diff}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
