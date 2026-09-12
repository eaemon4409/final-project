import React, { useState, useEffect } from 'react';
import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Settings } from 'lucide-react';
import { CurrentPageCard } from './components/CurrentPageCard';
import { SelectedPageList } from './components/SelectedPageList';
import { GoalInput } from './components/GoalInput';
import { SettingsModal } from './components/SettingsModal';
import {
  getComparisonState,
  addPageSnapshot,
  removePageSnapshot,
  setUserGoal,
  clearComparison,
  clearCachedComparison
} from '../storage/storageService';
import { extractActiveTabContent } from '../extractors/pageExtractor';
import { normalizeUrl } from '../utils/urlHelper';
import { ComparisonState } from '../models/types';
import './Popup.css';

export const Popup: React.FC = () => {
  const [state, setState] = useState<ComparisonState>({ installId: '', pages: [], goal: '' });
  const [currentTab, setCurrentTab] = useState<{ id?: number; title: string; url: string }>({
    title: '',
    url: ''
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load active tab and state on mount
  useEffect(() => {
    loadCurrentTab();
    refreshState();

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }, area: string) => {
      if (area === 'local' && changes['compare_anything_state']) {
        refreshState();
      }
    };

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener(handleStorageChange);
      return () => {
        chrome.storage.onChanged.removeListener(handleStorageChange);
      };
    }
  }, []);

  const loadCurrentTab = async () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab) {
          setCurrentTab({
            id: tab.id,
            title: tab.title || '',
            url: tab.url || ''
          });
        }
      } catch (err) {
        console.error('Failed to get active tab:', err);
      }
    } else {
      setCurrentTab({
        title: 'ASUS Vivobook 15 Laptop (Core i5 13th Gen)',
        url: 'https://startech.com.bd/asus-vivobook-15'
      });
    }
  };

  const refreshState = async () => {
    const currentState = await getComparisonState();
    setState(currentState);
  };

  const isAlreadyAdded = state.pages.some(p => {
    if (!currentTab.url || !p.url) return false;
    return normalizeUrl(p.url) === normalizeUrl(currentTab.url);
  });

  const isMaxReached = state.pages.length >= 4;
  const canCompare = state.pages.length >= 2;

  const handleAddCurrentPage = async () => {
    setErrorMessage(null);
    setIsExtracting(true);

    try {
      const snapshot = await extractActiveTabContent();
      const result = await addPageSnapshot(snapshot);

      if (!result.success) {
        setErrorMessage(result.message || 'Failed to add page.');
      } else {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 2500);
        await refreshState();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not extract data from this page.';
      setErrorMessage(msg);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRemovePage = async (pageId: string) => {
    const updated = await removePageSnapshot(pageId);
    setState(updated);
    setErrorMessage(null);
  };

  const handleGoalChange = (newGoal: string) => {
    setState(prev => ({ ...prev, goal: newGoal }));
    setUserGoal(newGoal);
  };

  const handleClear = async () => {
    if (window.confirm('Clear all selected pages and start fresh?')) {
      const reset = await clearComparison();
      setState(reset);
      setErrorMessage(null);
      setJustAdded(false);
    }
  };

  const handleCompare = async () => {
    if (!canCompare) {
      setErrorMessage('Add at least one more page to compare (2 to 4 pages required).');
      return;
    }

    // Always clear old cached comparison so a fresh comparison is generated for the current pages
    await clearCachedComparison();

    // Open dedicated results tab
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      const resultsUrl = chrome.runtime.getURL('results.html');
      chrome.tabs.create({ url: resultsUrl });
    } else {
      window.open('results.html', '_blank');
    }
  };

  return (
    <div className="popup-container">
      {/* Brand Header */}
      <header className="popup-header">
        <div className="brand-badge">
          <Sparkles size={16} className="brand-icon" />
          <div>
            <h1 className="brand-title">COMPARE ANYTHING</h1>
            <p className="brand-tagline">Stop switching between tabs. Compare them.</p>
          </div>
        </div>
        <button
          type="button"
          className="btn-header-settings"
          onClick={() => setIsSettingsOpen(true)}
          title="Monetization & API Settings"
          aria-label="Settings"
        >
          <Settings size={16} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="popup-content">
        {/* Step 2/3: Current Page detection & Add */}
        <CurrentPageCard
          currentUrl={currentTab.url}
          currentTitle={currentTab.title}
          isAlreadyAdded={isAlreadyAdded}
          isMaxReached={isMaxReached}
          isExtracting={isExtracting}
          onAddCurrentPage={handleAddCurrentPage}
          justAdded={justAdded}
          errorMessage={errorMessage}
        />

        {/* Selected pages cards & counter */}
        <SelectedPageList
          pages={state.pages}
          onRemovePage={handleRemovePage}
        />

        {/* User Priority/Goal Field */}
        {state.pages.length > 0 && (
          <GoalInput
            goal={state.goal}
            onChangeGoal={handleGoalChange}
          />
        )}
      </main>

      {/* Bottom Actions */}
      <footer className="popup-footer">
        <div className="primary-action-group">
          <button
            type="button"
            className={`btn btn-compare ${canCompare ? 'active' : 'disabled'}`}
            disabled={!canCompare}
            onClick={handleCompare}
          >
            <span>COMPARE {state.pages.length > 0 ? `${state.pages.length} PAGES` : ''}</span>
            <ArrowRight size={18} />
          </button>

          {state.pages.length > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-clear"
              onClick={handleClear}
              title="Clear all pages"
            >
              <RotateCcw size={14} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Privacy & Trust Badge */}
        <div className="privacy-badge">
          <ShieldCheck size={12} />
          <span>Only pages you explicitly add are accessed. Zero data selling.</span>
        </div>
      </footer>

      {/* Monetization & API Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
