import { ApiResponse, ComparisonResult, ComparisonState } from '../models/types';

const DEFAULT_API_URL = 'http://127.0.0.1:8000/api/v1';
const REQUEST_TIMEOUT_MS = 60000; // 60 seconds for AI processing

export class ApiError extends Error {
  statusCode: number;
  errorCode?: string;

  constructor(message: string, statusCode: number = 500, errorCode?: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

/**
 * Resolve the API base URL (supports local development or custom cloud deployment).
 */
export async function getApiBaseUrl(): Promise<string> {
  try {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const stored = await chrome.storage.local.get('customApiUrl');
      if (stored.customApiUrl && typeof stored.customApiUrl === 'string' && stored.customApiUrl.trim() !== '') {
        return stored.customApiUrl.trim().replace(/\/+$/, '');
      }
    }
  } catch {
    // Fallback to default
  }
  return DEFAULT_API_URL;
}

/**
 * Check if the backend server is reachable.
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const baseUrl = await getApiBaseUrl();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Send page snapshots and user goal to the backend for evidence-based comparison.
 */
export async function comparePages(state: ComparisonState): Promise<ComparisonResult> {
  if (state.pages.length < 2) {
    throw new ApiError('Add at least one more page to compare (2 to 4 pages required).', 422);
  }
  if (state.pages.length > 4) {
    throw new ApiError('Maximum 4 pages can be compared at once.', 422);
  }

  const payload = {
    installId: state.installId,
    goal: state.goal || null,
    pages: state.pages,
  };

  const baseUrl = await getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/compare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = (await response.json()) as ApiResponse<ComparisonResult>;

    if (response.status === 429) {
      throw new ApiError(
        data.message || "Today's free comparison limit has been reached. Please try again later.",
        429,
        'RATE_LIMIT_EXCEEDED'
      );
    }

    if (!response.ok || !data.success) {
      const errorMsg = data.message || 'Comparison could not be generated. Please try again.';
      throw new ApiError(errorMsg, response.status);
    }

    if (!data.data) {
      throw new ApiError('Received empty comparison data from the server.', 500);
    }

    return data.data;
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    if (err instanceof ApiError) {
      throw err;
    }

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError('The comparison request timed out. The AI model took too long to respond. Please try again.', 408);
    }

    // Network error (Backend not running or CORS blocked)
    throw new ApiError(
      `Cannot connect to the AI backend (${baseUrl}). Please ensure the server is running.`,
      503
    );
  }
}
