import { TemplateId } from "./template";

export interface CV {
  // CV Data
  cvData: {
    id: string;
    userId: string;
    title: string;
    createdAt: string;
    updatedAt: string;
  };

  // Personal
  personalInfo: {
    firstName: string;
    lastName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    professionalLinks?: Array<{ label: string; url: string }>;
    linkedIn?: string;
    portfolio?: string;
    photo?: string; // URL
  };

  // Summary
  professionalSummary: string;

  // Experience
  workExperience: Array<{
    jobTitle: string;
    company: string;
    location: string;
    employmentType:
      | "Full-time"
      | "Part-time"
      | "Contract"
      | "Freelance"
      | "Internship"
      | "Temporary"
      | "Seasonal"
      | "Apprenticeship"
      | "Volunteer"
      | "Self-employed";
    startDate: string; // MM/YYYY
    endDate: string | "Present";
    achievements: string;
    toolsAndMethods: string[];
    sortOrder: number;
  }>;

  // Education
  education: Array<{
    degree: string;
    fieldOfStudy: string;
    institution: string;
    location: string;
    graduationDate: string;
    grade?: string;
    gradingScale?: string;
    honors?: string;
  }>;

  // Skills
  skills: {
    categories: Array<{
      name: string;
      items: string;
    }>;
    languages: Array<{ language: string; proficiency: string }>;
  };

  // Certifications
  certifications: Array<{
    name: string;
    issuingOrg: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
  }>;

  // Optional sections
  projects?: Array<{
    name: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    url?: string;
  }>;

  awards?: Array<{
    name: string;
    issuer: string;
    date: string;
    description: string;
  }>;

  templateId: TemplateId;
}
