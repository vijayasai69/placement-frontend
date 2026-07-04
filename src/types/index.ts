// Shared TypeScript types for PlaceAI frontend
// These mirror the backend Prisma schema

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  user: User;
  session: {
    id: string;
    expiresAt: string;
  };
}

export interface ResumeProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: string[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  profileStrength: number;
  parsedAt: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startYear: number;
  endYear: number;
  gpa?: string;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description?: string;
  technologies: string[];
  link?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date?: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Internship" | "Contract" | "Part-time";
  matchScore: number;
  salary: string;
  skills: string[];
  aiInsight: string;
  postedAt?: string;
  description?: string;
  applyUrl?: string;
  source?: string;
  saved?: boolean;
  matchedSkills?: string[];
  missingSkills?: string[];
  recommendationReason?: string;
}

export interface FilterParams {
  search?: string;
  location?: string[];
  jobType?: string[];
  experience?: string;
  minMatchScore?: number;
  sortBy?: "matchScore" | "salary" | "recent";
}

export interface DashboardStats {
  profileCompletion: number;
  resumeStatus: "not_uploaded" | "uploading" | "parsing" | "completed" | "failed";
  matchScore: number;
  jobsFound: number;
}

export interface ActivityItem {
  id: string;
  type: "resume_upload" | "resume_parsed" | "jobs_matched" | "top_match";
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
}

export interface ResumeUploadResponse {
  jobId: string;
  message: string;
}

export interface ResumeStatusResponse {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress?: number;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ProfileUpdateInput {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  location?: string;
  skills?: string[];
}
