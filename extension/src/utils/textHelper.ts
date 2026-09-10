export function cleanWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Intelligent truncation capping text at maxChars (~3,500 characters),
 * ensuring content ends on a clean sentence or boundary rather than mid-word.
 */
export function intelligentTruncate(text: string, maxChars: number = 3500): string {
  if (text.length <= maxChars) {
    return text.trim();
  }

  // Find nearest sentence end (.!?) or line break before maxChars
  const truncated = text.slice(0, maxChars);
  const lastPunctuation = Math.max(
    truncated.lastIndexOf('. '),
    truncated.lastIndexOf('.\n'),
    truncated.lastIndexOf('\n'),
    truncated.lastIndexOf('; ')
  );

  if (lastPunctuation > maxChars * 0.75) {
    return truncated.slice(0, lastPunctuation + 1).trim();
  }

  // Fallback to last word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > maxChars * 0.8) {
    return truncated.slice(0, lastSpace).trim() + '...';
  }

  return truncated.trim() + '...';
}
