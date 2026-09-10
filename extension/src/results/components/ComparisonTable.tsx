import React from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { ComparisonItem, Criterion, PageSnapshot } from '../../models/types';
import { buildAffiliateUrl, getRetailerCta } from '../../utils/affiliateHelper';

interface ComparisonTableProps {
  items: ComparisonItem[];
  criteria: Criterion[];
  pages: PageSnapshot[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ items, criteria, pages }) => {
  const pageMap = new Map(pages.map((p) => [p.id, p]));

  return (
    <div className="table-section">
      <div className="section-title-row">
        <h3 className="section-title">Side-by-Side Comparison</h3>
        <span className="criteria-count-tag">{criteria.length} Criteria Discovered</span>
      </div>

      <div className="table-responsive-container">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="th-feature">
                <span>Features & Specifications</span>
              </th>
              {items.map((item) => {
                const page = pageMap.get(item.id);
                return (
                  <th key={item.id} className="th-item">
                    <div className="item-header-cell">
                      <div className="item-name-row">
                        <span className="item-title" title={item.displayName}>
                          {item.displayName}
                        </span>
                        {page && (
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noreferrer"
                            className="item-link"
                            title={`Open ${page.domain}`}
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>
                      {page?.domain && (
                        <span className="item-domain-badge">{page.domain}</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, cIdx) => {
              const valMap = new Map(criterion.values.map((v) => [v.itemId, v]));
              const winners = new Set(criterion.winnerItemIds || []);

              return (
                <tr key={cIdx} className="criterion-row">
                  <td className="td-feature">
                    <div className="feature-name-group">
                      <span className="feature-name">{criterion.name}</span>
                      {criterion.importance === 'high' && (
                        <span className="badge-importance high">Key Factor</span>
                      )}
                    </div>
                  </td>
                  {items.map((item) => {
                    const valueObj = valMap.get(item.id);
                    const rawVal = valueObj?.value ?? 'Not stated';
                    const isNotStated = rawVal.toLowerCase() === 'not stated' || rawVal.trim() === '';
                    const isWinner = winners.has(item.id);

                    return (
                      <td
                        key={item.id}
                        className={`td-value ${isWinner ? 'winner-cell' : ''} ${isNotStated ? 'not-stated-cell' : ''}`}
                      >
                        <div className="cell-content-wrapper">
                          {isWinner && !isNotStated && (
                            <span className="cell-winner-indicator" title="Wins on this criterion">
                              <Check size={13} />
                            </span>
                          )}
                          {isNotStated ? (
                            <span className="pill-not-stated">Not stated</span>
                          ) : (
                            <span className={`value-text ${isWinner ? 'value-winner' : ''}`}>
                              {rawVal}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {/* Action Row: Direct Links & Deals */}
            <tr className="action-row">
              <td className="td-feature td-action-feature">
                <span className="feature-name">Store Links & Deals</span>
                <span className="affiliate-subtle-hint">Partner Link</span>
              </td>
              {items.map((item) => {
                const page = pageMap.get(item.id);
                if (!page) {
                  return <td key={item.id} className="td-value td-action-cell">-</td>;
                }
                const affUrl = buildAffiliateUrl(page.url);
                return (
                  <td key={item.id} className="td-value td-action-cell">
                    <a
                      href={affUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-table-deal"
                    >
                      <span>{getRetailerCta(page.domain)}</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
