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
      | "Internship";
    startDate: string; // MM/YYYY
    endDate: string | "Present";
    achievements: string[];
    technologies: string[];
    sortOrder: number;
  }>;

  // Education
  education: Array<{
    degree: string;
    fieldOfStudy: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: number;
    honors?: string;
  }>;

  // Skills
  skills: {
    coreCompetencies: string[];
    toolsAndTechnologies: string[];
    systemsAndMethodologies: string[];
    collaborationAndDelivery: string[];
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
