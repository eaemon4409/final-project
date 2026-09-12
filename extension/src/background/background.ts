import { getComparisonState } from '../storage/storageService';

// Function to update the browser toolbar icon badge
async function updateExtensionBadge() {
  try {
    const state = await getComparisonState();
    const count = state.pages.length;
    
    if (count > 0) {
      chrome.action.setBadgeText({ text: String(count) });
      chrome.action.setBadgeBackgroundColor({ color: '#ef4444' }); // Red badge
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  } catch (err) {
    console.error('Failed to update extension badge:', err);
  }
}

// Update badge on extension installation or startup
chrome.runtime.onInstalled.addListener(() => {
  updateExtensionBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateExtensionBadge();
});

// Listen for storage changes from popup or content script
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes['compare_anything_state']) {
    updateExtensionBadge();
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'openResults') {
    chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
    sendResponse({ success: true });
    return true;
  }

  if (message.action === 'updateBadge') {
    updateExtensionBadge().then(() => sendResponse({ success: true }));
    return true;
  }

  return false;
});
