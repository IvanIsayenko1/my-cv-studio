type BaseFieldAIReview = {
  field: string;

  score: number;
  summary: string;

  issues: string[];

  typos: {
    hasTypos: boolean;
    details: string[];
  };
};

export type ProfessionalTitleAIReview = BaseFieldAIReview & {
  field: "professionalTitle";

  improvements: {
    atsOptimized: string;
    balanced: string;
    humanFriendly: string;
  };

  keywords: {
    detected: string[];
    missing: string[];
  };
};

export type EmailAIReview = BaseFieldAIReview & {
  field: "email";

  isProfessional: boolean;
  suggestions: string[];
};

export type CVPersonalInformationAIReview = {
  results: (ProfessionalTitleAIReview | EmailAIReview)[];
};
