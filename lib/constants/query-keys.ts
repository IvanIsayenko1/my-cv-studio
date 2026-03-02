export const QUERY_KEYS = {
  PROJECTS: "projects",
  TEMPLATE: "template",
  SUMMARY: "summary",
  PERSONAL_INFO: "personal-info",
  AWARDS: "awards",
  CERTIFICATIONS: "certifications",
  CV: "cv",
  EDUCATION: "education",
  SKILLS: "skills",
  WORK_EXPERIENCE: "work-experience",
  STATUS: "status",
  CV_LIST: "cv-list",
  LANGUAGES: "languages",
} as const;

export type QueryKeys = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];
