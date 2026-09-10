import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import {
  Sparkles,
  Copy,
  Download,
  RotateCcw,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  Layers,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { ComparisonResult, ComparisonState } from '../models/types';
import {
  clearComparison,
  getCachedComparison,
  getComparisonState,
  saveCachedComparison,
} from '../storage/storageService';
import { comparePages, ApiError } from '../services/apiService';
import { copyComparisonToClipboard, downloadCsv } from './utils/exportHelpers';
import { QuickVerdict } from './components/QuickVerdict';
import { ComparisonTable } from './components/ComparisonTable';
import { BestForSection } from './components/BestForSection';
import { KeyDifferences } from './components/KeyDifferences';
import { MissingInformation } from './components/MissingInformation';
import { SourcesList } from './components/SourcesList';
import './Results.css';

const ResultsApp: React.FC = () => {
  const [state, setState] = useState<ComparisonState>({ installId: '', pages: [], goal: '' });
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  useEffect(() => {
    initAndCompare();
  }, []);

  const initAndCompare = async (forceRefresh: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const currentState = await getComparisonState();
      setState(currentState);

      if (currentState.pages.length < 2) {
        setIsLoading(false);
        return;
      }

      // 1. Check local storage cache: Only use cache if the exact same page URLs and goal match
      const currentFingerprint = currentState.pages.map((p) => p.url).sort().join('||') + `::${currentState.goal}`;
      if (!forceRefresh) {
        const cached = await getCachedComparison();
        if (cached && (cached as any)._fingerprint === currentFingerprint) {
          setResult(cached);
          setIsLoading(false);
          return;
        }
      }

      // 2. Call AI Backend API
      const comparison = await comparePages(currentState);
      const comparisonWithFingerprint = {
        ...comparison,
        _fingerprint: currentFingerprint,
      };
      setResult(comparisonWithFingerprint);
      await saveCachedComparison(comparisonWithFingerprint as any);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Comparison could not be generated. Please check your backend connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const success = await copyComparisonToClipboard(result, state.pages);
    if (success) {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    downloadCsv(result, state.pages);
  };

  const handleStartNew = async () => {
    if (window.confirm('Clear current comparison and start a new one?')) {
      await clearComparison();
      setState({ installId: state.installId, pages: [], goal: '' });
      setResult(null);
    }
  };

  // State A: Less than 2 pages selected
  if (!isLoading && state.pages.length < 2) {
    return (
      <div className="results-layout">
        <header className="results-app-bar">
          <div className="app-bar-inner">
            <div className="app-brand">
              <div className="app-logo">
                <Sparkles size={20} />
              </div>
              <div className="app-title-group">
                <span className="app-title">COMPARE ANYTHING</span>
                <span className="app-subtitle">Stop switching between tabs. Compare them.</span>
              </div>
            </div>
          </div>
        </header>

        <div className="results-container">
          <div className="error-view-container">
            <div className="error-icon-box" style={{ background: 'var(--chrome-blue-tint)', color: 'var(--chrome-blue)' }}>
              <Layers size={28} />
            </div>
            <h2 className="error-title">At Least 2 Pages Needed</h2>
            <p className="error-desc">
              You currently have {state.pages.length} page selected. To generate an objective side-by-side comparison, please open at least 2 webpages and click <strong>+ ADD TO COMPARISON</strong> in the extension popup.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // State B: Loading State
  if (isLoading) {
    return (
      <div className="results-layout">
        <header className="results-app-bar">
          <div className="app-bar-inner">
            <div className="app-brand">
              <div className="app-logo">
                <Sparkles size={20} />
              </div>
              <div className="app-title-group">
                <span className="app-title">COMPARE ANYTHING</span>
                <span className="app-subtitle">Evidence-based AI Comparison Engine</span>
              </div>
            </div>
          </div>
        </header>

        <div className="results-container">
          <div className="loading-view-container">
            <div className="loading-spinner-circle" />
            <h2 className="loading-title">Generating Side-by-Side Comparison</h2>
            <p className="loading-subtitle">
              Analyzing facts from {state.pages.length} webpages with zero-hallucination engine. Discovering key criteria and trade-offs...
            </p>
            <div className="loading-steps-chips">
              <div className="step-chip active">
                <CheckCircle2 size={13} />
                <span>Extracting Structured Specs</span>
              </div>
              <div className="step-chip active">
                <CheckCircle2 size={13} />
                <span>Normalizing Attributes</span>
              </div>
              <div className="step-chip active">
                <Sparkles size={13} />
                <span>Finding Key Differences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State C: Error State
  if (error || !result) {
    return (
      <div className="results-layout">
        <header className="results-app-bar">
          <div className="app-bar-inner">
            <div className="app-brand">
              <div className="app-logo">
                <Sparkles size={20} />
              </div>
              <div className="app-title-group">
                <span className="app-title">COMPARE ANYTHING</span>
                <span className="app-subtitle">AI Comparison System</span>
              </div>
            </div>
          </div>
        </header>

        <div className="results-container">
          <div className="error-view-container">
            <div className="error-icon-box">
              <AlertTriangle size={28} />
            </div>
            <h2 className="error-title">Comparison Unavailable</h2>
            <p className="error-desc">{error || 'Unable to generate comparison at this time.'}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-action btn-action-primary"
                onClick={() => initAndCompare(true)}
              >
                <RefreshCw size={14} />
                <span>Retry Comparison</span>
              </button>
              <button type="button" className="btn-action" onClick={handleStartNew}>
                <RotateCcw size={14} />
                <span>Start New Comparison</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State D: Full Comparison Dashboard
  return (
    <div className="results-layout">
      {/* Chrome App Bar */}
      <header className="results-app-bar">
        <div className="app-bar-inner">
          <div className="app-brand">
            <div className="app-logo">
              <Sparkles size={20} />
            </div>
            <div className="app-title-group">
              <span className="app-title">COMPARE ANYTHING</span>
              <span className="app-subtitle">Evidence-based AI Comparison Engine</span>
            </div>
          </div>

          <div className="app-bar-actions">
            <button
              type="button"
              className={`btn-action ${copiedToast ? 'copied' : ''}`}
              onClick={handleCopy}
              title="Copy comparison summary to clipboard"
            >
              <Copy size={14} />
              <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={handleDownloadCsv}
              title="Download side-by-side table as CSV"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={() => initAndCompare(true)}
              title="Re-run comparison with AI"
            >
              <RefreshCw size={14} />
              <span>Re-compare</span>
            </button>

            <button
              type="button"
              className="btn-action"
              onClick={handleStartNew}
              title="Clear comparison state"
            >
              <RotateCcw size={14} />
              <span>New</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Comparison Dashboard */}
      <main className="results-container">
        {/* Hero Section */}
        <section className="comparison-hero-header">
          <div className="hero-meta-row">
            <span className="badge-category">{result.comparisonType}</span>
            <span className="pages-count-tag">• {state.pages.length} Webpages Compared</span>
          </div>

          <h1 className="hero-title">{result.comparisonTitle}</h1>

          {result.goal && (
            <div className="user-goal-callout">
              <span className="goal-prefix">Your Priority:</span>
              <span>"{result.goal}"</span>
            </div>
          )}
        </section>

        {/* 1. Quick Verdict & Best Overall */}
        <QuickVerdict
          bestOverall={result.bestOverall}
          items={result.items}
          pages={state.pages}
        />

        {/* 2. Side-by-side comparison table */}
        <ComparisonTable
          items={result.items}
          criteria={result.criteria}
          pages={state.pages}
        />

        {/* 3. Best For breakdowns */}
        <BestForSection
          bestFor={result.bestFor}
          items={result.items}
          pages={state.pages}
        />

        {/* 4. Important Differences */}
        <KeyDifferences differences={result.keyDifferences} />

        {/* 5. Missing Information (Zero-hallucination evidence) */}
        <MissingInformation
          missingList={result.missingInformation}
          items={result.items}
        />

        {/* 6. Original Source Links */}
        <SourcesList items={result.items} pages={state.pages} />
      </main>

      {/* Toast Notification */}
      {copiedToast && (
        <div className="toast-notice">
          ✓ Comparison summary copied to clipboard!
        </div>
      )}
    </div>
  );
};

const root = document.getElementById('results-root');
if (root) {
  ReactDOM.createRoot(root).render(<ResultsApp />);
}
