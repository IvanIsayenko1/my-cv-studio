export interface CVTailorTitleSuggestion {
  current: string;
  suggested: string;
  reason: string;
}

export interface CVTailorExperienceSuggestion {
  roleIndex: number;
  issues: string[];
  suggested: string;
}

export interface CVTailorReview {
  titleSuggestion: CVTailorTitleSuggestion | null;
  suggestedSummary: string;
  suggestedExperience: CVTailorExperienceSuggestion[];
}
