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
  const winnerItem = bestOverall.itemId ? items.find((it) => it.id === bestOverall.itemId) : null;
  const winnerPage = winnerItem ? pages.find((p) => p.id === winnerItem.id) : null;
  const isNoWinner = !bestOverall.itemId;

  return (
    <div className={`verdict-card ${isNoWinner ? 'no-winner' : 'has-winner'}`}>
      <div className="verdict-header">
        <div className="verdict-badge">
          {isNoWinner ? (
            <>
              <HelpCircle size={18} className="badge-icon icon-neutral" />
              <span>DECISION ANALYSIS</span>
            </>
          ) : (
            <>
              <Trophy size={18} className="badge-icon icon-gold" />
              <span>RECOMMENDED BEST OVERALL</span>
            </>
          )}
        </div>
      </div>

      <div className="verdict-content">
        <div className="winner-headline">
          {isNoWinner ? (
            <h2 className="winner-title neutral-title">No Clear Winner</h2>
          ) : (
            <div className="winner-title-group">
              <h2 className="winner-title">{winnerItem?.displayName || 'Top Selection'}</h2>
              {winnerPage?.domain && (
                <span className="winner-domain-pill">{winnerPage.domain}</span>
              )}
            </div>
          )}
        </div>

        <p className="verdict-reason">{bestOverall.reason}</p>

        {!isNoWinner && winnerPage && (
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
