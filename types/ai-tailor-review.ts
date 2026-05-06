export interface CVTailorTitleSuggestion {
  current: string;
  suggested: string;
  reason: string;
}

export interface CVTailorExperienceSuggestion {
  roleIndex: number;
  jobTitle: string;
  company: string;
  suggested: string;
  score: number;
  issues: string[];
  keyImprovements: string[];
}

export interface CVTailorSkillsSuggestion {
  categoryIndex: number;
  categoryName: string;
  suggested: string;
  suggestedName: string;
  score: number;
  issues: string[];
  keyImprovements: string[];
}

export interface CVTailorProjectSuggestion {
  projectIndex: number;
  projectName: string;
  suggested: string;
  score: number;
  issues: string[];
  keyImprovements: string[];
}

export interface CVTailorCertificationSuggestion {
  certificationIndex: number;
  suggestedName: string;
  suggestedIssuer: string;
  score: number;
  issues: string[];
}

export interface CVTailorLanguageSuggestion {
  languageIndex: number;
  suggestedLanguage: string;
  suggestedProficiency: string;
  score: number;
  issues: string[];
}

export interface CVTailorAwardSuggestion {
  awardIndex: number;
  awardName: string;
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
  suggestedSkills: CVTailorSkillsSuggestion[];
  suggestedProjects: CVTailorProjectSuggestion[];
  suggestedCertifications: CVTailorCertificationSuggestion[];
  suggestedAwards: CVTailorAwardSuggestion[];
  suggestedLanguages: CVTailorLanguageSuggestion[];
}
