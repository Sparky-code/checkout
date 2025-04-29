export type ProcessingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProcessingState {
  text: string;
  loading: boolean;
  progress: number;
  error: string | null;
  startTime: number | null;
  endTime: number | null;
}

export interface ProcessingResult {
  text: string;
  confidence: number;
  lines: string[];
} 