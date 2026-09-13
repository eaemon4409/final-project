(async () => {
  // Never inject into iframes, only run in top-level browsing context
  if (typeof window !== 'undefined' && window.self !== window.top) {
    return;
  }

  try {
    const src = chrome.runtime.getURL('assets/content.js');
    await import(src);
  } catch (err) {
    console.error('Failed to load Compare Anything content script:', err);
  }
})();
