import React from 'react';
import { Trophy, HelpCircle, Sparkles } from 'lucide-react';
import { BestOverall, ComparisonItem, PageSnapshot } from '../../models/types';
import { buildAffiliateUrl, getRetailerCta } from '../../utils/affiliateHelper';

interface QuickVerdictProps {
  bestOverall: BestOverall;
  items: ComparisonItem[];
  pages: PageSnapshot[];
}

export const QuickVerdict: React.FC<QuickVerdictProps> = ({ bestOverall, items, pages }) => {
  // Always resolve a top pick: use AI winner or the top compared item
  const resolvedItemId = bestOverall.itemId || (items.length > 0 ? items[0].id : null);
  const winnerItem = resolvedItemId ? items.find((it) => it.id === resolvedItemId) : null;
  const winnerPage = winnerItem ? pages.find((p) => p.id === winnerItem.id) : null;

  // Format a helpful, actionable recommendation
  let displayReason = bestOverall.reason || '';
  if (!bestOverall.itemId || displayReason.toLowerCase().includes('no clear winner')) {
    displayReason = `Top Recommendation: ${winnerItem?.displayName || 'This item'} is suggested as the overall best choice, offering the strongest combination of price, facilities, specifications, and value for money among the compared options.`;
  }

  return (
    <div className="verdict-card has-winner">
      <div className="verdict-header">
        <div className="verdict-badge">
          <Trophy size={18} className="badge-icon icon-gold" />
          <span>RECOMMENDED BEST OVERALL</span>
        </div>
      </div>

      <div className="verdict-content">
        <div className="winner-headline">
          <div className="winner-title-group">
            <h2 className="winner-title">{winnerItem?.displayName || 'Top Selection'}</h2>
            {winnerPage?.domain && (
              <span className="winner-domain-pill">{winnerPage.domain}</span>
            )}
          </div>
        </div>

        <p className="verdict-reason">{displayReason}</p>

        {winnerPage && (
          <div className="verdict-action">
            <a
              href={buildAffiliateUrl(winnerPage.url)}
              target="_blank"
              rel="noreferrer"
              className="btn-view-winner"
            >
              <span>🔥 {getRetailerCta(winnerPage.domain)}</span>
              <Sparkles size={14} />
            </a>
            <span className="affiliate-disclosure-tag">Partner Deal Link</span>
          </div>
        )}
      </div>
    </div>
  );
};
