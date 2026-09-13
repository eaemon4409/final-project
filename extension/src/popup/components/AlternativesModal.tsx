import React, { useState, useEffect } from 'react';
import { X, Sparkles, ExternalLink, Loader2, AlertCircle, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { fetchAlternatives } from '../../services/apiService';
import { AlternativeResult, AlternativeItem } from '../../models/types';
import { extractDomain } from '../../utils/urlHelper';

interface AlternativesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentUrl: string;
}

export const AlternativesModal: React.FC<AlternativesModalProps> = ({
  isOpen,
  onClose,
  currentTitle,
  currentUrl,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AlternativeResult | null>(null);

  useEffect(() => {
    if (isOpen && !data && currentTitle) {
      loadAlternatives();
    }
  }, [isOpen, currentTitle]);

  const loadAlternatives = async () => {
    setLoading(true);
    setError(null);
    try {
      const domain = extractDomain(currentUrl);
      const res = await fetchAlternatives({
        title: currentTitle,
        url: currentUrl,
        domain: domain,
      });
      setData(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not find alternatives at this time.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStoreLink = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card alternatives-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="icon-badge-sparkle">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="modal-title">Smart Alternatives & Deals</h2>
              <p className="modal-subtitle">AI-recommended rivals & store prices</p>
            </div>
          </div>
          <button type="button" className="btn-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body alternatives-body">
          {loading && (
            <div className="alternatives-loading">
              <Loader2 size={28} className="spin text-blue" />
              <h4>Analyzing page & discovering better deals...</h4>
              <p>Scanning top competitors across StarTech, Ryans, Daraz & global stores</p>
            </div>
          )}

          {error && (
            <div className="alternatives-error">
              <AlertCircle size={22} className="text-red" />
              <p>{error}</p>
              <button type="button" className="btn btn-secondary btn-sm" onClick={loadAlternatives}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && data && (
            <div className="alternatives-content">
              {/* Target Item summary badge */}
              <div className="target-item-banner">
                <span className="target-badge-label">Active Item:</span>
                <span className="target-item-title" title={data.identifiedProduct}>
                  {data.identifiedProduct}
                </span>
                <span className="target-badge-category">{data.category}</span>
              </div>

              {/* Alternatives List */}
              <div className="alternatives-list">
                {data.alternatives.map((alt: AlternativeItem, idx: number) => (
                  <div key={idx} className="alternative-card">
                    <div className="alt-card-top">
                      <div>
                        <div className="alt-rank-tag">Alternative #{idx + 1}</div>
                        <h4 className="alt-title">{alt.name}</h4>
                      </div>
                      <span className="alt-price-tag">{alt.estimatedPriceRange}</span>
                    </div>

                    <div className="alt-strengths">
                      <div className="alt-strength-row text-green">
                        <span className="alt-bullet">✓ Why Consider:</span>
                        <span>{alt.whyBetter}</span>
                      </div>
                      {alt.tradeOff && (
                        <div className="alt-strength-row text-amber">
                          <span className="alt-bullet">⚠️ Trade-off:</span>
                          <span>{alt.tradeOff}</span>
                        </div>
                      )}
                    </div>

                    {alt.bestFor && (
                      <div className="alt-best-for">
                        <span>Best for:</span> <strong>{alt.bestFor}</strong>
                      </div>
                    )}

                    {/* 1-Click Store Search buttons */}
                    <div className="alt-store-actions">
                      <span className="store-action-label">Find & Compare:</span>
                      <div className="store-buttons-group">
                        <button
                          type="button"
                          className="btn-store-link startech"
                          onClick={() => handleOpenStoreLink(alt.searchLinks.startech)}
                          title="Search on StarTech BD"
                        >
                          StarTech <ArrowUpRight size={11} />
                        </button>
                        <button
                          type="button"
                          className="btn-store-link ryans"
                          onClick={() => handleOpenStoreLink(alt.searchLinks.ryans)}
                          title="Search on Ryans Computers"
                        >
                          Ryans <ArrowUpRight size={11} />
                        </button>
                        <button
                          type="button"
                          className="btn-store-link daraz"
                          onClick={() => handleOpenStoreLink(alt.searchLinks.daraz)}
                          title="Search on Daraz"
                        >
                          Daraz <ArrowUpRight size={11} />
                        </button>
                        <button
                          type="button"
                          className="btn-store-link google"
                          onClick={() => handleOpenStoreLink(alt.searchLinks.google)}
                          title="Search on Google Deals"
                        >
                          Google <ArrowUpRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="modal-footer-hint">
            <ShoppingBag size={13} />
            <span>Open any store link, then press <strong>Alt+C</strong> to add to comparison!</span>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
