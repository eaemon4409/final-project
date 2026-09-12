import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, Cloud, ShieldCheck } from 'lucide-react';
import { getActiveAffiliateConfig, saveAffiliateConfig, initAffiliateConfig, AffiliateConfig } from '../../utils/affiliateHelper';
import { getApiBaseUrl } from '../../services/apiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [affiliate, setAffiliate] = useState<AffiliateConfig>({
    amazonTag: '',
    darazAffiliateId: '',
    ebayCampId: '',
    aliexpressTag: '',
    genericRefTag: '',
  });
  const [apiUrl, setApiUrl] = useState<string>('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initAffiliateConfig().then((cfg) => {
        setAffiliate({
          amazonTag: cfg.amazonTag || '',
          darazAffiliateId: cfg.darazAffiliateId || '',
          ebayCampId: cfg.ebayCampId || '',
          aliexpressTag: cfg.aliexpressTag || '',
          genericRefTag: cfg.genericRefTag || '',
        });
      });

      getApiBaseUrl().then((url) => setApiUrl(url));
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    await saveAffiliateConfig(affiliate);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ customApiUrl: apiUrl.trim() });
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <DollarSign size={18} className="modal-icon-gold" />
            <h3>Monetization & API Settings</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="settings-desc">
            Configure your affiliate tags to earn commission whenever users click product links on the comparison page.
          </p>

          <div className="settings-field">
            <label>Amazon Associates Tag</label>
            <input
              type="text"
              placeholder="e.g. yourtag-20"
              value={affiliate.amazonTag}
              onChange={(e) => setAffiliate({ ...affiliate, amazonTag: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?tag=yourtag-20</code> on Amazon links</span>
          </div>

          <div className="settings-field">
            <label>eBay Campaign ID (EPN)</label>
            <input
              type="text"
              placeholder="e.g. 5339000000"
              value={affiliate.ebayCampId}
              onChange={(e) => setAffiliate({ ...affiliate, ebayCampId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?campid=...&mkcid=1</code> on eBay links</span>
          </div>

          <div className="settings-field">
            <label>AliExpress Affiliate Tag / Key</label>
            <input
              type="text"
              placeholder="e.g. your_sk_or_tag"
              value={affiliate.aliexpressTag}
              onChange={(e) => setAffiliate({ ...affiliate, aliexpressTag: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?aff_platform=...&sk=...</code> on AliExpress links</span>
          </div>

          <div className="settings-field">
            <label>Daraz Affiliate ID / Source</label>
            <input
              type="text"
              placeholder="e.g. your_daraz_id"
              value={affiliate.darazAffiliateId}
              onChange={(e) => setAffiliate({ ...affiliate, darazAffiliateId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?aff_id=...</code> on Daraz links</span>
          </div>

          <div className="settings-divider" />

          <div className="settings-field">
            <label>
              <Cloud size={14} style={{ display: 'inline', marginRight: 4 }} />
              Live Cloud Backend API URL
            </label>
            <input
              type="text"
              placeholder="https://compare-anything-backend.onrender.com/api/v1"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
            <span className="field-hint">Your 24/7 Render cloud backend endpoint</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className={`btn-save ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? (
              <>
                <Check size={16} />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
