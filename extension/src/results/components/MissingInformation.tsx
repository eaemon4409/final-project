import React from 'react';
import { AlertCircle } from 'lucide-react';
import { ComparisonItem, MissingInformation as MissingInfoType } from '../../models/types';

interface MissingInformationProps {
  missingList: MissingInfoType[];
  items: ComparisonItem[];
}

export const MissingInformation: React.FC<MissingInformationProps> = ({ missingList, items }) => {
  const itemMap = new Map(items.map((it) => [it.id, it.displayName]));
  const validMissing = missingList.filter((m) => m.fields && m.fields.length > 0);

  if (validMissing.length === 0) return null;

  return (
    <div className="missing-info-section">
      <div className="section-title-row">
        <h3 className="section-title">Missing Information (Not Disclosed on Webpage)</h3>
      </div>
      <div className="missing-info-grid">
        {validMissing.map((entry, idx) => (
          <div key={idx} className="missing-info-card">
            <div className="missing-card-header">
              <AlertCircle size={15} className="missing-icon" />
              <h4 className="missing-item-title">{itemMap.get(entry.itemId) || entry.itemId}</h4>
            </div>
            <div className="missing-fields-chips">
              {entry.fields.map((field, fIdx) => (
                <span key={fIdx} className="missing-chip">
                  {field}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
