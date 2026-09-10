import React from 'react';
import { Award } from 'lucide-react';
import { BestFor, ComparisonItem, PageSnapshot } from '../../models/types';

interface BestForSectionProps {
  bestFor: BestFor[];
  items: ComparisonItem[];
  pages: PageSnapshot[];
}

export const BestForSection: React.FC<BestForSectionProps> = ({ bestFor, items, pages }) => {
  if (bestFor.length === 0) return null;

  const itemMap = new Map(items.map((it) => [it.id, it]));
  const pageMap = new Map(pages.map((p) => [p.id, p]));

  return (
    <div className="best-for-section">
      <h3 className="section-title">Best For Specific Needs</h3>
      <div className="best-for-grid">
        {bestFor.map((entry, idx) => {
          const item = itemMap.get(entry.itemId);
          const page = pageMap.get(entry.itemId);

          return (
            <div key={idx} className="best-for-card">
              <div className="best-for-header">
                <span className="best-for-label">
                  <Award size={14} className="label-icon" />
                  {entry.label}
                </span>
                {page?.domain && (
                  <span className="domain-subtle-tag">{page.domain}</span>
                )}
              </div>
              <h4 className="best-for-item-name">{item?.displayName || entry.itemId}</h4>
              <p className="best-for-reason">{entry.reason}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
