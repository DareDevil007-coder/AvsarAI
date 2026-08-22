import fs from "fs/promises";
import path from "path";
import { StudentProfile, Internship } from "./matching";

export interface SkillMasterRecord {
  skill_id: number;
  skill_name: string;
  category?: string;
}

export interface SectorMasterRecord {
  sector_id: number;
  sector_name: string;
  description?: string;
}

export interface DistrictMasterRecord {
  district_id: number;
  state_name?: string;
  district_name: string;
  is_aspirational?: boolean;
  tier?: string;
}

export interface CompanyRecord {
  company_id: string;
  company_name: string;
  sector: string;
  industry: string;
  location: string;
  company_type: string;
  relevant_skills: string;
  is_verified?: boolean;
  website?: string;
  logo?: string;
  about?: string;
  contact_email?: string;
  contact_phone?: string;
  company_size?: string;
  areas_of_work?: string[];
  headquarters?: string;
  completion_rate?: number;
}

export interface UserRecord {
  userId: string;
  name: string;
  email: string;
  role: "student" | "admin" | "company";
  password?: string;
  company_id?: string;
}

export interface OpportunityRecord {
  id: string;
  company_id: string;
  title: string;
  type: "INTERNSHIP" | "JOB" | "INDUSTRIAL_TRAINING" | "FDP";
  status: "Draft" | "Published" | "Applications Open" | "Closing Soon" | "Closed";
  domain: string;
  location: string;
  work_mode: "On-site" | "Remote" | "Hybrid";
  requiredSkills: string[];
  softSkills?: string[];
  skillProficiency?: string;
  mandatorySkills?: string[];
  preferredSkills?: string[];
  eligibilityCriteria: {
    minCGPA: number;
    targetGradYears: number[];
    degree: string;
    eligibleDepartments?: string[];
    certifications?: string[];
  };
  duration: string;
  stipend: string;
  salaryPackage?: string;
  experienceRequirement?: string;
  availableSeats: number;
  description: string;
  responsibilities?: string;
  learningOutcomes?: string;
  requiredDocuments?: string[];
  selectionProcess?: string;
  applicationDeadline: string;
  publishedAt: string;
  applicantsCount?: number;
  shortlistedCount?: number;
  selectedCount?: number;
  co?: string;
  bg?: string;
  color?: string;
}

export interface ApplicationRecord {
  application_id?: string;
  userId: string;
  internshipId: string;
  appliedAt: string;
  status: "Applied" | "Under Review" | "Shortlisted" | "Interview" | "Selected" | "Rejected" | "Closed";
  remarks?: string;
  updatedAt?: string;
}

export interface InterviewRecord {
  interview_id: string;
  application_id: string;
  userId: string;
  internshipId: string;
  company_id: string;
  scheduledAt: string;
  mode: "Online" | "In-Person" | "Telephonic";
  meetingLinkOrVenue: string;
  notes?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
}

export interface NotificationRecord {
  notification_id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: "application_update" | "interview" | "general";
}

export interface DatabaseSchema {
  users: UserRecord[];
  companies: CompanyRecord[];
  skills_master?: SkillMasterRecord[];
  sectors_master?: SectorMasterRecord[];
  districts_master?: DistrictMasterRecord[];
  profiles: Record<string, StudentProfile & { userId: string }>;
  internships: Internship[];
  opportunities?: OpportunityRecord[];
  applications: ApplicationRecord[];
  ai_recommendations: any[];
  interviews?: InterviewRecord[];
  notifications?: NotificationRecord[];
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export async function getDatabase(): Promise<DatabaseSchema> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data) as DatabaseSchema;
  } catch (error) {
    console.error("Error reading database:", error);
    throw error;
  }
}

export async function saveDatabase(data: DatabaseSchema): Promise<void> {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing database:", error);
    throw error;
  }
}
