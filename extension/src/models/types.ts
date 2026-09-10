export interface PageSnapshot {
  id: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  structuredData?: string;
  importantText: string;
  capturedAt: string;
}

export interface ComparisonState {
  installId: string;
  pages: PageSnapshot[];
  goal: string;
}

export interface ExtractionResult {
  success: boolean;
  snapshot?: PageSnapshot;
  error?: string;
}

// Day 3 Comparison Result Schema Types
export interface ComparisonItem {
  id: string;
  displayName: string;
  shortDescription: string;
}

export interface CriterionValue {
  itemId: string;
  value: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface Criterion {
  name: string;
  importance: 'high' | 'medium' | 'low';
  values: CriterionValue[];
  winnerItemIds: string[];
}

export interface BestOverall {
  itemId: string | null;
  reason: string;
}

export interface BestFor {
  label: string;
  itemId: string;
  reason: string;
}

export interface MissingInformation {
  itemId: string;
  fields: string[];
}

export interface ComparisonResult {
  comparisonTitle: string;
  comparisonType: string;
  goal: string;
  items: ComparisonItem[];
  criteria: Criterion[];
  bestOverall: BestOverall;
  bestFor: BestFor[];
  keyDifferences: string[];
  missingInformation: MissingInformation[];
}

export interface ApiResponse<T> {
  success: boolean;
  requestId?: string;
  data?: T;
  message?: string;
  error_detail?: string | null;
}
