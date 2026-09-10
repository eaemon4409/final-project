import React from 'react';
import { Trash2, ExternalLink, Layers } from 'lucide-react';
import { PageSnapshot } from '../../models/types';

interface SelectedPageListProps {
  pages: PageSnapshot[];
  onRemovePage: (pageId: string) => void;
}

export const SelectedPageList: React.FC<SelectedPageListProps> = ({ pages, onRemovePage }) => {
  return (
    <div className="selected-pages-section">
      <div className="section-header">
        <div className="title-with-count">
          <Layers size={16} className="header-icon" />
          <span className="section-label">Selected Pages</span>
        </div>
        <span className={`counter-pill ${pages.length >= 2 ? 'ready' : ''}`}>
          {pages.length} / 4 pages added
        </span>
      </div>

      {pages.length === 0 ? (
        <div className="empty-state-box">
          <p className="empty-title">No pages added yet</p>
          <p className="empty-subtitle">
            Navigate to any 2–4 product, article, or plan pages and click <strong>+ ADD TO COMPARISON</strong>.
          </p>
        </div>
      ) : (
        <div className="cards-stack">
          {pages.map((page, index) => (
            <div key={page.id} className="selected-card">
              <div className="card-number">{index + 1}</div>
              <div className="card-content">
                <h4 className="card-title" title={page.title}>
                  {page.title}
                </h4>
                <div className="card-meta">
                  <span className="domain-tag">{page.domain}</span>
                  <a
                    href={page.url}
                    target="_blank"
                    rel="noreferrer"
                    className="source-icon-link"
                    title="Open original page"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <button
                type="button"
                className="btn-remove"
                onClick={() => onRemovePage(page.id)}
                title="Remove from comparison"
                aria-label="Remove page"
              >
                <Trash2 size={14} />
                <span>Remove</span>
              </button>
            </div>
          ))}

          {pages.length === 1 && (
            <div className="prompt-more-box">
              <span>💡 Open another webpage to add it (minimum 2 needed).</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
