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

// Handle keyboard shortcuts (Alt+C and Alt+Shift+C)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'open-comparison-results') {
    chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
  } else if (command === 'add-current-page') {
    try {
      const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (
        activeTab &&
        activeTab.id &&
        activeTab.url &&
        !activeTab.url.startsWith('chrome://') &&
        !activeTab.url.startsWith('chrome-extension://') &&
        !activeTab.url.startsWith('edge://')
      ) {
        chrome.tabs.sendMessage(activeTab.id, { action: 'triggerAddCurrentPage' }).catch((err) => {
          console.warn('Could not send shortcut message to tab:', err);
        });
      }
    } catch (err) {
      console.error('Failed to handle add-current-page shortcut:', err);
    }
  }
});
