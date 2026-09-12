(async () => {
  try {
    const src = chrome.runtime.getURL('assets/content.js');
    await import(src);
  } catch (err) {
    console.error('Failed to load Compare Anything content script:', err);
  }
})();
