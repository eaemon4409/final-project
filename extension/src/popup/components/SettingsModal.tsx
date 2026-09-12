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
    ebayCampId: '',
    aliexpressTag: '',
    walmartId: '',
    bestbuyId: '',
    targetId: '',
    neweggId: '',
    darazAffiliateId: '',
    flipkartAffId: '',
    bookingAid: '',
    agodaCid: '',
    courseraPartnerId: '',
    udemyPartnerId: '',
    genericRefTag: '',
  });
  const [apiUrl, setApiUrl] = useState<string>('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initAffiliateConfig().then((cfg) => {
        setAffiliate({
          amazonTag: cfg.amazonTag || '',
          ebayCampId: cfg.ebayCampId || '',
          aliexpressTag: cfg.aliexpressTag || '',
          walmartId: cfg.walmartId || '',
          bestbuyId: cfg.bestbuyId || '',
          targetId: cfg.targetId || '',
          neweggId: cfg.neweggId || '',
          darazAffiliateId: cfg.darazAffiliateId || '',
          flipkartAffId: cfg.flipkartAffId || '',
          bookingAid: cfg.bookingAid || '',
          agodaCid: cfg.agodaCid || '',
          courseraPartnerId: cfg.courseraPartnerId || '',
          udemyPartnerId: cfg.udemyPartnerId || '',
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
            <h3>Affiliate & API Settings</h3>
          </div>
          <button className="btn-close-modal" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <p className="settings-desc">
            Configure your affiliate tags to earn commissions whenever users click product links on comparison pages.
          </p>

          {/* Section 1: Major Global Retail */}
          <div className="settings-section-title">Major Global Retailers</div>

          <div className="settings-field">
            <label>Amazon Associates Tag</label>
            <input
              type="text"
              placeholder="e.g. eaemon-20"
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
              placeholder="e.g. your_sk_tag"
              value={affiliate.aliexpressTag}
              onChange={(e) => setAffiliate({ ...affiliate, aliexpressTag: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?aff_platform=...&sk=...</code> on AliExpress</span>
          </div>

          <div className="settings-field">
            <label>Walmart Affiliate Partner ID</label>
            <input
              type="text"
              placeholder="e.g. your_impact_partner_id"
              value={affiliate.walmartId}
              onChange={(e) => setAffiliate({ ...affiliate, walmartId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?wmlspartner=...&veh=aff</code> on Walmart</span>
          </div>

          <div className="settings-field">
            <label>Best Buy Affiliate Tag / ID</label>
            <input
              type="text"
              placeholder="e.g. your_bestbuy_id"
              value={affiliate.bestbuyId}
              onChange={(e) => setAffiliate({ ...affiliate, bestbuyId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?ref=...&loc=compare_anything</code> on Best Buy</span>
          </div>

          <div className="settings-field">
            <label>Target Partners ID</label>
            <input
              type="text"
              placeholder="e.g. your_target_id"
              value={affiliate.targetId}
              onChange={(e) => setAffiliate({ ...affiliate, targetId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?afid=...</code> on Target links</span>
          </div>

          <div className="settings-field">
            <label>Newegg Affiliate ID</label>
            <input
              type="text"
              placeholder="e.g. your_newegg_id"
              value={affiliate.neweggId}
              onChange={(e) => setAffiliate({ ...affiliate, neweggId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?AID=...</code> on Newegg links</span>
          </div>

          {/* Section 2: Regional E-Commerce */}
          <div className="settings-section-title">Regional E-Commerce</div>

          <div className="settings-field">
            <label>Daraz Affiliate ID (BD / South Asia)</label>
            <input
              type="text"
              placeholder="e.g. your_daraz_id"
              value={affiliate.darazAffiliateId}
              onChange={(e) => setAffiliate({ ...affiliate, darazAffiliateId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?aff_id=...</code> on Daraz links</span>
          </div>

          <div className="settings-field">
            <label>Flipkart Affiliate ID</label>
            <input
              type="text"
              placeholder="e.g. your_flipkart_affid"
              value={affiliate.flipkartAffId}
              onChange={(e) => setAffiliate({ ...affiliate, flipkartAffId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?affid=...</code> on Flipkart links</span>
          </div>

          {/* Section 3: Hotels & Travel */}
          <div className="settings-section-title">Hotels & Travel</div>

          <div className="settings-field">
            <label>Booking.com Affiliate Partner AID</label>
            <input
              type="text"
              placeholder="e.g. your_booking_aid"
              value={affiliate.bookingAid}
              onChange={(e) => setAffiliate({ ...affiliate, bookingAid: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?aid=...</code> on Booking.com hotel pages</span>
          </div>

          <div className="settings-field">
            <label>Agoda Partner CID</label>
            <input
              type="text"
              placeholder="e.g. your_agoda_cid"
              value={affiliate.agodaCid}
              onChange={(e) => setAffiliate({ ...affiliate, agodaCid: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?cid=...</code> on Agoda links</span>
          </div>

          {/* Section 4: Courses & Online Learning */}
          <div className="settings-section-title">Courses & Education</div>

          <div className="settings-field">
            <label>Coursera Partner Campaign / ID</label>
            <input
              type="text"
              placeholder="e.g. your_coursera_partner"
              value={affiliate.courseraPartnerId}
              onChange={(e) => setAffiliate({ ...affiliate, courseraPartnerId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?utm_campaign=...</code> on Coursera links</span>
          </div>

          <div className="settings-field">
            <label>Udemy Affiliate Code</label>
            <input
              type="text"
              placeholder="e.g. your_udemy_code"
              value={affiliate.udemyPartnerId}
              onChange={(e) => setAffiliate({ ...affiliate, udemyPartnerId: e.target.value })}
            />
            <span className="field-hint">Appended as <code>?couponCode=...</code> on Udemy links</span>
          </div>

          <div className="settings-divider" />

          {/* Section 5: API Settings */}
          <div className="settings-section-title">Backend API Settings</div>

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
