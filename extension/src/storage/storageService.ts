import { ComparisonResult, ComparisonState, PageSnapshot } from '../models/types';
import { normalizeUrl } from '../utils/urlHelper';

const STORAGE_KEY_STATE = 'compare_anything_state';
const STORAGE_KEY_RESULT = 'compare_anything_cached_result';
const MAX_PAGES = 4;

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function getComparisonState(): Promise<ComparisonState> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      // Fallback for non-extension browser testing environment
      try {
        const stored = localStorage.getItem(STORAGE_KEY_STATE);
        if (stored) {
          return resolve(JSON.parse(stored));
        }
      } catch {
        // Ignore
      }
      return resolve({
        installId: 'dev-install-id-' + Math.random().toString(36).substring(2, 9),
        pages: [],
        goal: ''
      });
    }

    chrome.storage.local.get([STORAGE_KEY_STATE], (result) => {
      const data = result[STORAGE_KEY_STATE] as Partial<ComparisonState> | undefined;
      const installId = data?.installId || generateUUID();
      const pages = data?.pages || [];
      const goal = data?.goal || '';

      const state: ComparisonState = { installId, pages, goal };
      // Ensure installId is persisted if newly created
      if (!data?.installId) {
        chrome.storage.local.set({ [STORAGE_KEY_STATE]: state });
      }
      resolve(state);
    });
  });
}

export async function saveComparisonState(state: ComparisonState): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      try {
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
      } catch {
        // Ignore
      }
      return resolve();
    }

    chrome.storage.local.set({ [STORAGE_KEY_STATE]: state }, () => {
      resolve();
    });
  });
}

export async function clearCachedComparison(): Promise<void> {
  if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
    try {
      localStorage.removeItem(STORAGE_KEY_RESULT);
    } catch {
      // Ignore
    }
  } else {
    chrome.storage.local.remove([STORAGE_KEY_RESULT]);
  }
}

export async function addPageSnapshot(snapshot: PageSnapshot): Promise<{ success: boolean; message?: string }> {
  const state = await getComparisonState();

  // Check if max 4 pages reached
  if (state.pages.length >= MAX_PAGES) {
    return { success: false, message: `Maximum ${MAX_PAGES} pages can be compared at once.` };
  }

  // Check duplicate URL
  const normalizedIncoming = normalizeUrl(snapshot.url);
  const exists = state.pages.some(p => normalizeUrl(p.url) === normalizedIncoming);
  if (exists) {
    return { success: false, message: 'This page is already in your comparison.' };
  }

  // Assign clean sequential ID if needed
  const pageId = `page-${state.pages.length + 1}`;
  const updatedSnapshot: PageSnapshot = { ...snapshot, id: pageId };

  state.pages.push(updatedSnapshot);
  await saveComparisonState(state);
  await clearCachedComparison();
  return { success: true };
}

export async function removePageSnapshot(pageId: string): Promise<ComparisonState> {
  const state = await getComparisonState();
  state.pages = state.pages.filter(p => p.id !== pageId);
  // Re-index remaining pages
  state.pages = state.pages.map((p, idx) => ({ ...p, id: `page-${idx + 1}` }));
  await saveComparisonState(state);
  await clearCachedComparison();
  return state;
}

export async function setUserGoal(goal: string): Promise<void> {
  const state = await getComparisonState();
  state.goal = goal;
  await saveComparisonState(state);
  await clearCachedComparison();
}

export async function clearComparison(): Promise<ComparisonState> {
  const state = await getComparisonState();
  state.pages = [];
  state.goal = '';
  await saveComparisonState(state);
  await clearCachedComparison();
  return state;
}

export async function getCachedComparison(): Promise<ComparisonResult | null> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_RESULT);
        if (stored) {
          return resolve(JSON.parse(stored));
        }
      } catch {
        // Ignore
      }
      return resolve(null);
    }

    chrome.storage.local.get([STORAGE_KEY_RESULT], (result) => {
      const data = result[STORAGE_KEY_RESULT] as ComparisonResult | undefined;
      resolve(data || null);
    });
  });
}

export async function saveCachedComparison(comparison: ComparisonResult): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      try {
        localStorage.setItem(STORAGE_KEY_RESULT, JSON.stringify(comparison));
      } catch {
        // Ignore
      }
      return resolve();
    }

    chrome.storage.local.set({ [STORAGE_KEY_RESULT]: comparison }, () => {
      resolve();
    });
  });
}

export const STORAGE_KEY_SHOW_FAB = 'compare_anything_show_fab';

export async function getFloatingButtonEnabled(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_SHOW_FAB);
        return resolve(stored === null ? true : stored === 'true');
      } catch {
        return resolve(true);
      }
    }

    chrome.storage.local.get([STORAGE_KEY_SHOW_FAB], (result) => {
      const enabled = result[STORAGE_KEY_SHOW_FAB];
      resolve(enabled === undefined ? true : Boolean(enabled));
    });
  });
}

export async function setFloatingButtonEnabled(enabled: boolean): Promise<void> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
      try {
        localStorage.setItem(STORAGE_KEY_SHOW_FAB, String(enabled));
      } catch {
        // Ignore
      }
      return resolve();
    }

    chrome.storage.local.set({ [STORAGE_KEY_SHOW_FAB]: enabled }, () => {
      resolve();
    });
  });
}
