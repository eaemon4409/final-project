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

// Broadcast floating button state to all tabs in all windows
function broadcastFloatingButtonState(enabled: boolean) {
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({}, (tabs) => {
      for (const tab of tabs) {
        if (
          tab.id &&
          tab.url &&
          !tab.url.startsWith('chrome://') &&
          !tab.url.startsWith('chrome-extension://') &&
          !tab.url.startsWith('edge://')
        ) {
          chrome.tabs.sendMessage(
            tab.id,
            { action: 'toggleFloatingButton', enabled },
            () => {
              // Access chrome.runtime.lastError to mark it handled and prevent Chrome from logging an error
              if (chrome.runtime && chrome.runtime.lastError) {
                void chrome.runtime.lastError;
              }
            }
          );
        }
      }
    });
  }
}

// Listen for storage changes from popup or content script
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local') {
    if (changes['compare_anything_state']) {
      updateExtensionBadge();
    }
    if (changes['compare_anything_show_fab']) {
      const isEnabled = changes['compare_anything_show_fab'].newValue !== false;
      broadcastFloatingButtonState(isEnabled);
    }
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'openResults') {
    chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
    sendResponse({ success: true });
    return false;
  }

  if (message.action === 'updateBadge') {
    updateExtensionBadge().then(() => sendResponse({ success: true }));
    return true; // Keep message channel open for async response
  }

  if (message.action === 'broadcastFloatingButtonState') {
    broadcastFloatingButtonState(message.enabled !== false);
    sendResponse({ success: true });
    return false;
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
        chrome.tabs.sendMessage(activeTab.id, { action: 'triggerAddCurrentPage' }, () => {
          if (chrome.runtime && chrome.runtime.lastError) {
            void chrome.runtime.lastError;
          }
        });
      }
    } catch (err) {
      console.error('Failed to handle add-current-page shortcut:', err);
    }
  }
});

