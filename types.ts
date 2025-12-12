export interface ReligionAnalysis {
  perspective: string;
  core_beliefs: string;
  key_verses: Array<{
    citation: string;
    text: string;
    context?: string;
  }>;
}

export interface ComparativeAnalysis {
  topic: string;
  christianity: ReligionAnalysis;
  judaism: ReligionAnalysis;
  islam: ReligionAnalysis;
  synthesis: {
    similarities: string[];
    differences: string[];
    conclusion: string;
  };
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}