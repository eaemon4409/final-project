import React from 'react';
import { Plus, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { extractDomain } from '../../utils/urlHelper';

interface CurrentPageCardProps {
  currentUrl: string;
  currentTitle: string;
  isAlreadyAdded: boolean;
  isMaxReached: boolean;
  isExtracting: boolean;
  onAddCurrentPage: () => void;
  onOpenAlternatives: () => void;
  justAdded: boolean;
  errorMessage?: string | null;
}

export const CurrentPageCard: React.FC<CurrentPageCardProps> = ({
  currentUrl,
  currentTitle,
  isAlreadyAdded,
  isMaxReached,
  isExtracting,
  onAddCurrentPage,
  onOpenAlternatives,
  justAdded,
  errorMessage
}) => {
  const domain = extractDomain(currentUrl);
  const isInternal = currentUrl.startsWith('chrome://') || currentUrl.startsWith('chrome-extension://') || currentUrl.startsWith('edge://');

  return (
    <div className="current-page-card">
      <div className="card-header">
        <span className="section-label">Current Page</span>
        {domain && <span className="domain-badge">{domain}</span>}
      </div>

      <div className="current-page-body">
        <h3 className="current-page-title" title={currentTitle}>
          {currentTitle || 'Loading page details...'}
        </h3>
      </div>

      {errorMessage && (
        <div className="error-banner">
          <AlertCircle size={14} className="error-icon" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="action-row">
        {justAdded ? (
          <div className="status-badge success">
            <Check size={16} />
            <span>✓ Added to comparison</span>
          </div>
        ) : isAlreadyAdded ? (
          <div className="status-badge info">
            <Check size={16} />
            <span>Already added</span>
          </div>
        ) : isInternal ? (
          <div className="status-badge disabled">
            <span>Internal browser pages cannot be compared</span>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onAddCurrentPage}
            disabled={isExtracting || isMaxReached}
          >
            {isExtracting ? (
              <>
                <Loader2 size={16} className="spin" />
                <span>Extracting page details...</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>+ ADD TO COMPARISON</span>
                <kbd className="btn-kbd-badge" title="Shortcut: Alt+C">Alt+C</kbd>
              </>
            )}
          </button>
        )}
      </div>

      {!isInternal && currentTitle && (
        <button
          type="button"
          className="btn-find-alternatives"
          onClick={onOpenAlternatives}
          title="AI discovers 2-3 top competing products and store deals"
        >
          <Sparkles size={13} />
          <span>🔍 Find Top Alternatives & Deals</span>
        </button>
      )}

      {isMaxReached && !isAlreadyAdded && (
        <p className="helper-text warning">Maximum limit reached (4 pages max).</p>
      )}
    </div>
  );
};
