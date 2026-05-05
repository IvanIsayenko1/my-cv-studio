export interface CVTailorTitleSuggestion {
  current: string;
  suggested: string;
  reason: string;
}

export interface CVTailorReview {
  jobTitle: string;
  matchPercentage: number;
  skillScore: number;
  seniorityScore: number;
  domainScore: number;
  niceToHaveScore: number;
  matchSummary: string;
  extractedKeywords: string[];
  titleSuggestion: CVTailorTitleSuggestion | null;
  suggestedSummary: string;
}
