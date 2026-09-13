import React from 'react';
import { Compass, Keyboard } from 'lucide-react';

interface OnboardingGuideProps {
  onDismiss?: () => void;
}

export const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onDismiss }) => {
  return (
    <div className="onboarding-card">
      <div className="onboarding-header">
        <div className="onboarding-title-group">
          <Compass size={16} className="onboarding-icon" />
          <span className="onboarding-title">How It Works (3 Easy Steps)</span>
        </div>
        {onDismiss && (
          <button
            type="button"
            className="btn-onboarding-dismiss"
            onClick={onDismiss}
            title="Dismiss guide"
          >
            Got it
          </button>
        )}
      </div>

      <div className="onboarding-steps">
        <div className="onboarding-step">
          <div className="step-num-badge">1</div>
          <div className="step-text-wrap">
            <strong>Open 2 to 4 Pages</strong>
            <p>Open product, pricing, or article tabs you want to compare.</p>
          </div>
        </div>

        <div className="onboarding-step">
          <div className="step-num-badge">2</div>
          <div className="step-text-wrap">
            <strong>Add Each Webpage</strong>
            <p>
              Click <strong>+ ADD</strong> above, click the red floating button, or press{' '}
              <kbd className="kbd-inline">Alt+C</kbd>.
            </p>
          </div>
        </div>

        <div className="onboarding-step">
          <div className="step-num-badge">3</div>
          <div className="step-text-wrap">
            <strong>Instant AI Comparison</strong>
            <p>
              Click <strong>COMPARE</strong> to get a side-by-side table, key differences, and top pick!
            </p>
          </div>
        </div>
      </div>

      <div className="onboarding-shortcuts-hint">
        <Keyboard size={13} />
        <span>Shortcuts: <kbd className="kbd-inline">Alt+C</kbd> Add Page • <kbd className="kbd-inline">Alt+Shift+C</kbd> Open Results</span>
      </div>
    </div>
  );
};
