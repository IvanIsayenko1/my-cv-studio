export interface CVTailorTitleSuggestion {
  current: string;
  suggested: string;
  reason: string;
}

export interface CVTailorReview {
  jobTitle: string;
  matchPercentage: number;
  matchSummary: string;
  titleSuggestion: CVTailorTitleSuggestion | null;
}
