import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { ComparisonItem, PageSnapshot } from '../../models/types';

interface SourcesListProps {
  items: ComparisonItem[];
  pages: PageSnapshot[];
}

export const SourcesList: React.FC<SourcesListProps> = ({ items, pages }) => {
  const pageMap = new Map(pages.map((p) => [p.id, p]));

  return (
    <div className="sources-section">
      <h3 className="section-title">Original Sources</h3>
      <div className="sources-grid">
        {items.map((item) => {
          const page = pageMap.get(item.id);
          if (!page) return null;

          return (
            <a
              key={item.id}
              href={page.url}
              target="_blank"
              rel="noreferrer"
              className="source-card-link"
            >
              <div className="source-domain-line">
                <Globe size={13} className="source-domain-icon" />
                <span className="source-domain">{page.domain}</span>
              </div>
              <h5 className="source-title" title={page.title}>
                {item.displayName}
              </h5>
              <div className="source-action-label">
                <span>Visit Page</span>
                <ExternalLink size={12} />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};
