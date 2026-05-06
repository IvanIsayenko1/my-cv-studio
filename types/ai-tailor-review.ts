export interface CVTailorTitleSuggestion {
  current: string;
  suggested: string;
  reason: string;
}

export interface CVTailorExperienceSuggestion {
  roleIndex: number;
  jobTitle: string;
  company: string;
  current: string;
  suggested: string;
  score: number;
  issues: string[];
  keyImprovements: string[];
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
  suggestedExperience: CVTailorExperienceSuggestion[];
}
