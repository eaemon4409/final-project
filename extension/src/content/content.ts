import { extractPageFromDOM } from '../extractors/pageExtractor';
import {
  getComparisonState,
  addPageSnapshot,
  removePageSnapshot,
  clearComparison,
  getFloatingButtonEnabled,
  STORAGE_KEY_SHOW_FAB
} from '../storage/storageService';
import { normalizeUrl } from '../utils/urlHelper';
import { PageSnapshot } from '../models/types';

(function initCompareAnythingFab() {
  // Never inject into iframes, only run in top-level browsing context
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return;
  }

  // Remove any stale/orphaned instance from a previous version or reload
  const staleHost = document.getElementById('compare-anything-fab-root');
  if (staleHost) {
    try {
      staleHost.remove();
    } catch {
      // Ignore
    }
  }

  // Create host and attach Shadow DOM for 100% CSS style isolation
  const host = document.createElement('div');
  host.id = 'compare-anything-fab-root';
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  host.style.bottom = '26px';
  host.style.right = '26px';
  host.style.pointerEvents = 'none'; // container does not block clicks elsewhere
  // Start initially hidden so it NEVER flashes or appears if disabled
  host.style.setProperty('display', 'none', 'important');
  host.style.setProperty('visibility', 'hidden', 'important');
  host.style.setProperty('opacity', '0', 'important');
  host.setAttribute('hidden', '');
  host.classList.add('fab-hidden');

  const shadow = host.attachShadow({ mode: 'open' });

  // Encapsulated CSS styles
  const style = document.createElement('style');
  style.textContent = `
    :host([hidden]),
    :host(.fab-hidden),
    .fab-wrapper.fab-hidden {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .fab-wrapper {
      position: relative;
      pointer-events: auto;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 12px;
    }

    /* Floating Red Circular Button */
    .fab-button {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ff4b4b 0%, #dc2626 100%);
      color: #ffffff;
      border: 2px solid rgba(255, 255, 255, 0.45);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 22px rgba(220, 38, 38, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2);
      transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.22s ease, background 0.25s ease;
      position: relative;
      outline: none;
      -webkit-tap-highlight-color: transparent;
      touch-action: none;
    }

    .fab-button:hover {
      transform: translateY(-3px) scale(1.08);
      box-shadow: 0 10px 28px rgba(220, 38, 38, 0.65), 0 4px 12px rgba(0, 0, 0, 0.25);
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    }

    .fab-button:active {
      transform: scale(0.94);
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);
    }

    .fab-button.is-added {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 6px 22px rgba(16, 185, 129, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.6);
    }

    .fab-button.is-added:hover {
      background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
      box-shadow: 0 10px 28px rgba(16, 185, 129, 0.65);
    }

    .fab-icon-svg {
      width: 25px;
      height: 25px;
      stroke: #ffffff;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
      transition: transform 0.22s ease;
    }

    .fab-button:hover .fab-icon-svg {
      transform: scale(1.06);
    }

    /* Counter Badge on top-right */
    .fab-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      background: #0f172a;
      color: #ffffff;
      font-size: 11px;
      font-weight: 800;
      min-width: 22px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      border: 2px solid #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    /* Tooltip */
    .fab-tooltip {
      position: absolute;
      right: 66px;
      background: #0f172a;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transform: translateX(8px);
      transition: opacity 0.2s ease, transform 0.2s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .fab-wrapper:hover .fab-tooltip {
      opacity: 1;
      transform: translateX(0);
    }

    /* Sleek Floating Toast Card */
    .fab-toast {
      position: absolute;
      bottom: 68px;
      right: 0;
      width: 335px;
      background: #0f172a;
      color: #ffffff;
      border-radius: 14px;
      padding: 14px 16px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45), 0 4px 12px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.15);
      opacity: 0;
      transform: translateY(14px) scale(0.96);
      pointer-events: none;
      transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 10;
    }

    .fab-toast.show {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .toast-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 700;
      gap: 6px;
    }

    .toast-status-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .toast-title {
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .toast-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
    }

    .toast-btn-compare {
      flex: 1.2;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      white-space: nowrap;
      transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
    }

    .toast-btn-compare:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.45);
    }

    .toast-btn-clear {
      flex: 1;
      background: rgba(239, 68, 68, 0.15);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
    }

    .toast-btn-clear:hover {
      background: rgba(239, 68, 68, 0.32);
      color: #ffffff;
      border-color: rgba(239, 68, 68, 0.6);
      transform: translateY(-1px);
    }

    .toast-btn-close {
      background: rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.18s ease, color 0.18s ease, transform 0.18s ease;
    }

    .toast-btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      transform: translateY(-1px);
    }
  `;

  // SVGs
  const compareIconSvg = `
    <svg class="fab-icon-svg" viewBox="0 0 24 24">
      <rect x="3" y="4" width="7" height="16" rx="1.5"></rect>
      <rect x="14" y="10" width="7" height="10" rx="1.5"></rect>
      <path d="M14 4h4a2 2 0 0 1 2 2v2"></path>
      <line x1="17" y1="1" x2="17" y2="7"></line>
    </svg>
  `;

  const checkIconSvg = `
    <svg class="fab-icon-svg" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;

  // Build DOM Structure
  const wrapper = document.createElement('div');
  wrapper.className = 'fab-wrapper';

  const tooltip = document.createElement('div');
  tooltip.className = 'fab-tooltip';
  tooltip.textContent = 'Add to Compare (Click)';

  const button = document.createElement('button');
  button.className = 'fab-button';
  button.title = 'Compare Anything — Click to Add';
  button.innerHTML = compareIconSvg;

  const badge = document.createElement('div');
  badge.className = 'fab-badge';
  badge.textContent = '0';
  badge.style.display = 'none';
  button.appendChild(badge);

  const toast = document.createElement('div');
  toast.className = 'fab-toast';
  toast.innerHTML = `
    <div class="toast-header">
      <div class="toast-status-row">
        <span class="toast-status-text">✓ Added to Comparison!</span>
      </div>
      <span class="toast-count-text" style="font-size: 11px; color: #cbd5e1;">(1/4)</span>
    </div>
    <div class="toast-title"></div>
    <div class="toast-actions">
      <button class="toast-btn-compare">Compare Now ➔</button>
      <button class="toast-btn-clear">Clear All</button>
      <button class="toast-btn-close">Close</button>
    </div>
  `;

  wrapper.appendChild(tooltip);
  wrapper.appendChild(toast);
  wrapper.appendChild(button);

  shadow.appendChild(style);
  shadow.appendChild(wrapper);

  // State trackers
  let isCurrentPageAdded = false;
  let currentPageId: string | null = null;
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  let isFabGloballyEnabled = false;

  // Robust visibility setter that completely hides/shows all elements
  function setHostVisibility(visible: boolean) {
    isFabGloballyEnabled = visible;

    if (!visible) {
      // 1. Fully hide host element
      host.style.setProperty('display', 'none', 'important');
      host.style.setProperty('visibility', 'hidden', 'important');
      host.style.setProperty('opacity', '0', 'important');
      host.style.setProperty('pointer-events', 'none', 'important');
      host.setAttribute('hidden', '');
      host.classList.add('fab-hidden');

      // 2. Fully hide inner components inside shadow DOM
      wrapper.style.setProperty('display', 'none', 'important');
      wrapper.classList.add('fab-hidden');
      button.style.setProperty('display', 'none', 'important');
      tooltip.style.setProperty('display', 'none', 'important');
      toast.style.setProperty('display', 'none', 'important');
      toast.classList.remove('show');
      if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
      }

      // 3. REMOVE FROM DOM COMPLETELY when disabled!
      if (host.parentElement) {
        try {
          host.remove();
        } catch {
          // Ignore
        }
      }
    } else {
      // When enabled:
      host.removeAttribute('hidden');
      host.classList.remove('fab-hidden');
      host.style.setProperty('display', 'block', 'important');
      host.style.setProperty('visibility', 'visible', 'important');
      host.style.setProperty('opacity', '1', 'important');
      host.style.setProperty('pointer-events', 'none', 'important');

      wrapper.style.removeProperty('display');
      wrapper.classList.remove('fab-hidden');
      button.style.removeProperty('display');
      tooltip.style.removeProperty('display');
      toast.style.removeProperty('display');

      // Re-attach to DOM if not currently attached
      const targetParent = document.body || document.documentElement;
      if (targetParent && !host.parentElement) {
        targetParent.appendChild(host);
      }

      refreshWidgetState();
    }
  }

  // Check whether user has enabled or disabled the floating button on initial load
  getFloatingButtonEnabled().then((enabled) => {
    setHostVisibility(enabled);
  }).catch(() => {
    setHostVisibility(false);
  });

  // Re-sync visibility whenever tab receives focus (user switches to this tab)
  window.addEventListener('focus', () => {
    getFloatingButtonEnabled().then((enabled) => {
      setHostVisibility(enabled);
    }).catch(() => {});
  });

  // Refresh widget state from storage
  async function refreshWidgetState() {
    if (!isFabGloballyEnabled) {
      return;
    }
    try {
      const state = await getComparisonState();
      const currentUrl = window.location.href;
      const normalizedCurrent = normalizeUrl(currentUrl);

      const count = state.pages.length;
      badge.textContent = String(count);
      badge.style.display = count > 0 ? 'flex' : 'none';

      const existing = state.pages.find(p => normalizeUrl(p.url) === normalizedCurrent);
      isCurrentPageAdded = !!existing;
      currentPageId = existing ? existing.id : null;

      if (isCurrentPageAdded) {
        button.classList.add('is-added');
        button.innerHTML = checkIconSvg;
        button.appendChild(badge);
        tooltip.textContent = `Page Added (${count}/4) — Click to view`;
      } else {
        button.classList.remove('is-added');
        button.innerHTML = compareIconSvg;
        button.appendChild(badge);
        tooltip.textContent = count > 0 
          ? `Add to Compare (${count}/4 added)` 
          : 'Add to Compare (Click)';
      }
    } catch (err) {
      console.error('Failed to update compare widget state:', err);
    }
  }

  // Toast notification
  function showToast(
    statusText: string,
    titleText: string,
    countText: string,
    isError: boolean = false,
    showActions: boolean = true
  ) {
    if (!isFabGloballyEnabled) {
      return;
    }
    const targetParent = document.body || document.documentElement;
    if (targetParent && !host.parentElement) {
      targetParent.appendChild(host);
    }
    if (toastTimer) clearTimeout(toastTimer);

    const statusEl = toast.querySelector('.toast-status-text') as HTMLElement;
    const titleEl = toast.querySelector('.toast-title') as HTMLElement;
    const countEl = toast.querySelector('.toast-count-text') as HTMLElement;
    const compareBtn = toast.querySelector('.toast-btn-compare') as HTMLElement;
    const clearBtn = toast.querySelector('.toast-btn-clear') as HTMLElement;
    const closeBtn = toast.querySelector('.toast-btn-close') as HTMLElement;

    if (statusEl) {
      statusEl.textContent = statusText;
      statusEl.style.color = isError ? '#f87171' : '#34d399';
    }
    if (titleEl) titleEl.textContent = titleText;
    if (countEl) countEl.textContent = countText;

    if (compareBtn) {
      compareBtn.style.display = showActions ? 'flex' : 'none';
    }
    if (clearBtn) {
      clearBtn.style.display = showActions ? 'flex' : 'none';
    }
    if (closeBtn) {
      closeBtn.style.display = 'block';
    }

    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // Handle Quick Add
  async function handleFabClick() {
    if (!isFabGloballyEnabled) {
      return;
    }
    try {
      const state = await getComparisonState();
      const currentUrl = window.location.href;
      const normalizedCurrent = normalizeUrl(currentUrl);

      const existing = state.pages.find(p => normalizeUrl(p.url) === normalizedCurrent);

      if (existing) {
        showToast(
          '✓ Already in Comparison!',
          document.title || 'This Webpage',
          `(${state.pages.length}/4 pages)`,
          false,
          true
        );
        return;
      }

      if (state.pages.length >= 4) {
        showToast(
          '⚠️ Maximum 4 pages reached!',
          'You already have 4 pages selected. Click Compare Now to see your side-by-side analysis, or Clear All to start fresh.',
          '(4/4)',
          true,
          true
        );
        return;
      }

      // Extract page details with high-fidelity DOM extractor
      const extracted = extractPageFromDOM();
      const newSnapshot: PageSnapshot = {
        id: `page-${state.pages.length + 1}`,
        url: extracted.url,
        domain: extracted.domain,
        title: extracted.title,
        description: extracted.description,
        structuredData: extracted.structuredData,
        importantText: extracted.importantText,
        capturedAt: extracted.capturedAt
      };

      const result = await addPageSnapshot(newSnapshot);

      if (result.success) {
        await refreshWidgetState();
        const newState = await getComparisonState();
        showToast(
          '✓ Added to Comparison!',
          newSnapshot.title || 'Page added',
          `(${newState.pages.length}/4 pages)`,
          false,
          true
        );
      } else {
        showToast(
          'Note:',
          result.message || 'Could not add page.',
          `(${state.pages.length}/4)`,
          true,
          false
        );
      }
    } catch (err: unknown) {
      console.error('Error adding page to comparison:', err);
      showToast(
        'Extraction error',
        'Could not capture enough details from this page.',
        '',
        true,
        false
      );
    }
  }

  // Handle Clear All from comparison
  async function handleClearAllClick() {
    try {
      await clearComparison();
      await refreshWidgetState();
      showToast(
        '✓ All Pages Cleared!',
        'All selected pages have been cleared. You can start fresh.',
        '(0/4)',
        false,
        false
      );
    } catch (err) {
      console.error('Failed to clear all pages:', err);
    }
  }

  // Dragging support so user can freely position the red icon anywhere on the screen
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;
  let dragMoved = false;

  button.addEventListener('pointerdown', (e) => {
    isDragging = true;
    dragMoved = false;
    startX = e.clientX;
    startY = e.clientY;

    const rect = host.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    button.setPointerCapture(e.pointerId);
  });

  button.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      dragMoved = true;
      host.style.bottom = 'auto';
      host.style.right = 'auto';
      host.style.left = `${Math.max(10, Math.min(window.innerWidth - 68, initialLeft + dx))}px`;
      host.style.top = `${Math.max(10, Math.min(window.innerHeight - 68, initialTop + dy))}px`;
    }
  });

  button.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      try {
        button.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore
      }
    }
  });

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dragMoved) {
      dragMoved = false;
      return;
    }
    handleFabClick();
  });

  // Compare Now button in Toast
  const toastCompareBtn = toast.querySelector('.toast-btn-compare');
  if (toastCompareBtn) {
    toastCompareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.runtime.sendMessage({ action: 'openResults' });
    });
  }

  // Clear All button in Toast
  const toastClearBtn = toast.querySelector('.toast-btn-clear');
  if (toastClearBtn) {
    toastClearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleClearAllClick();
    });
  }

  // Close button in Toast
  const toastCloseBtn = toast.querySelector('.toast-btn-close');
  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toast.classList.remove('show');
    });
  }

  // Storage listener for synchronization with popup or other tabs
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'local') {
        if (changes[STORAGE_KEY_SHOW_FAB]) {
          const isVisible = changes[STORAGE_KEY_SHOW_FAB].newValue === true;
          setHostVisibility(isVisible);
        }
        if (changes['compare_anything_state'] && isFabGloballyEnabled) {
          refreshWidgetState();
        }
      }
    });
  }

  // Handle messages from background worker or popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.action === 'toggleFloatingButton') {
        const isVisible = message.enabled === true;
        setHostVisibility(isVisible);
        sendResponse({ success: true, isVisible });
        return false;
      }
      if (message.action === 'triggerAddCurrentPage') {
        if (isFabGloballyEnabled) {
          handleFabClick();
        }
        sendResponse({ success: true });
        return false;
      }
      return false;
    });
  }
})();
