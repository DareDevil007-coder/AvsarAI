"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  StudentProfile,
  Internship,
  MatchResult,
  calculateMatch,
  CertificateRecord,
  ProjectRecord,
  AssessmentResultRecord
} from "@/lib/matching";
import {
  CompanyRecord,
  OpportunityRecord,
  ApplicationRecord,
  InterviewRecord,
  NotificationRecord
} from "@/lib/db";

export interface User {
  userId: string;
  name: string;
  email: string;
  role: "student" | "admin" | "company";
  company_id?: string;
}

export interface AppliedInternship extends ApplicationRecord {
  job?: Internship;
}

export interface AiRecommendationItem extends Internship {
  match: MatchResult;
}

export interface MastersData {
  skills: { skill_id: number; skill_name: string; category?: string }[];
  sectors: { sector_id: number; sector_name: string; description?: string }[];
  districts: { district_id: number; state_name?: string; district_name: string; is_aspirational?: boolean }[];
}

export interface EnrichedApplicant {
  application_id: string;
  userId: string;
  internshipId: string;
  appliedAt: string;
  status: string;
  remarks?: string;
  candidateName: string;
  email: string;
  degree: string;
  college: string;
  cgpa: number;
  graduationYear: number;
  skills: string[];
  opportunityTitle: string;
  matchScore: number;
  isEligible: boolean;
}

interface AppContextType {
  user: User | null;
  studentProfile: StudentProfile | null;
  companyProfile: CompanyRecord | null;
  companyOpportunities: OpportunityRecord[];
  companyApplicants: EnrichedApplicant[];
  interviews: InterviewRecord[];
  notifications: NotificationRecord[];
  internships: Internship[];
  applications: AppliedInternship[];
  masters: MastersData | null;
  aiRecommendations: AiRecommendationItem[];
  isLoading: boolean;
  
  // Actions
  login: (email: string, role?: string, password?: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string, college: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedProfile: Partial<StudentProfile>) => Promise<void>;
  uploadCertificate: (cert: Omit<CertificateRecord, "id">) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  addProject: (proj: Omit<ProjectRecord, "id">) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  submitAssessmentResult: (result: Omit<AssessmentResultRecord, "completedAt">) => Promise<void>;
  applyToInternship: (internshipId: string) => Promise<void>;
  searchInternships: (query?: string, location?: string, domain?: string) => Promise<void>;
  getRecommendations: () => AiRecommendationItem[];
  fetchCompanyData: (companyId: string) => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyRecord | null>(null);
  const [companyOpportunities, setCompanyOpportunities] = useState<OpportunityRecord[]>([]);
  const [companyApplicants, setCompanyApplicants] = useState<EnrichedApplicant[]>([]);
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<AppliedInternship[]>([]);
  const [masters, setMasters] = useState<MastersData | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load initial internships from API
  const fetchInternshipsFromApi = useCallback(async (query = "", location = "ALL", domain = "ALL") => {
    try {
      const url = new URL("/api/internships", typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
      url.searchParams.set("_t", Date.now().toString());
      if (query) url.searchParams.set("q", query);
      if (location && location.trim().toUpperCase() !== "ALL") url.searchParams.set("location", location);
      if (domain && domain.trim().toUpperCase() !== "ALL") url.searchParams.set("domain", domain);

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (err) {
      console.error("Failed to fetch internships from API:", err);
    }
  }, []);

  const fetchMastersFromApi = useCallback(async () => {
    try {
      const res = await fetch("/api/masters");
      if (res.ok) {
        const data = await res.json();
        setMasters(data);
      }
    } catch (err) {
      console.error("Failed to fetch masters schema:", err);
    }
  }, []);

  const fetchApplicationsFromApi = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/applications?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error("Failed to fetch applications from API:", err);
    }
  }, []);

  const fetchCompanyData = useCallback(async (companyId: string) => {
    try {
      const profRes = await fetch(`/api/company/profile?companyId=${encodeURIComponent(companyId)}`, { cache: "no-store" });
      if (profRes.ok) {
        const profData = await profRes.json();
        setCompanyProfile(profData);
      }

      const oppRes = await fetch(`/api/company/opportunities?companyId=${encodeURIComponent(companyId)}`, { cache: "no-store" });
      if (oppRes.ok) {
        const oppData = await oppRes.json();
        setCompanyOpportunities(oppData);
      }

      const appRes = await fetch(`/api/company/applicants?companyId=${encodeURIComponent(companyId)}`, { cache: "no-store" });
      if (appRes.ok) {
        const appData = await appRes.json();
        setCompanyApplicants(appData);
      }

      const intvRes = await fetch(`/api/company/interviews?companyId=${encodeURIComponent(companyId)}`, { cache: "no-store" });
      if (intvRes.ok) {
        const intvData = await intvRes.json();
        setInterviews(intvData);
      }
    } catch (err) {
      console.error("Failed to fetch company portal data:", err);
    }
  }, []);

  const refreshAllData = useCallback(async () => {
    await fetchInternshipsFromApi();
    if (user?.userId && user.role === "student") {
      await fetchApplicationsFromApi(user.userId);
    }
    if (user?.company_id && user.role === "company") {
      await fetchCompanyData(user.company_id);
    }
  }, [fetchInternshipsFromApi, fetchApplicationsFromApi, fetchCompanyData, user]);

  // Login handler
  const login = async (email: string, role: string = "student", password?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.profile) setStudentProfile(data.profile);
        if (data.company) setCompanyProfile(data.company);
        if (typeof window !== "undefined") {
          localStorage.setItem("avsar_user", JSON.stringify(data.user));
        }
        await refreshAllData();
        return true;
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
    return false;
  };

  // Register user handler
  const registerUser = async (name: string, email: string, password: string, college: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "student" }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        if (data.profile) setStudentProfile(data.profile);
        if (typeof window !== "undefined") {
          localStorage.setItem("avsar_user", JSON.stringify(data.user));
        }
        // Update profile with college details
        await updateProfile({ college });
        await refreshAllData();
        return { success: true };
      }
      return { success: false, error: data.error || "Registration failed" };
    } catch (err) {
      console.error("Registration failed:", err);
      return { success: false, error: "Failed to connect to registration service" };
    }
  };

  const logout = () => {
    setUser(null);
    setStudentProfile(null);
    setCompanyProfile(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("avsar_user");
    }
  };

  // Initialize state & live auto-refresh polling
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchInternshipsFromApi();
      await fetchMastersFromApi();

      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("avsar_user");
        if (storedUser) {
          try {
            const parsedUser: User = JSON.parse(storedUser);
            setUser(parsedUser);

            if (parsedUser.role === "student") {
              const res = await fetch(`/api/profile?userId=${parsedUser.userId}`, { cache: "no-store" });
              if (res.ok) {
                const profileData = await res.json();
                setStudentProfile(profileData);
              }
              await fetchApplicationsFromApi(parsedUser.userId);
            } else if (parsedUser.role === "company" && parsedUser.company_id) {
              await fetchCompanyData(parsedUser.company_id);
            }
          } catch (e) {
            console.error("Failed to parse local storage user:", e);
          }
        } else {
          // Default guest student profile
          setStudentProfile({
            name: "",
            email: "",
            degree: "Bachelor of Technology (B.Tech - Computer Science)",
            college: "Gujarat Technological University",
            graduationYear: 2026,
            cgpa: 8.5,
            skills: ["Python", "SQL", "React", "Data Analytics"],
            interests: ["Software Engineering", "AI/ML", "Cloud Computing"],
            preferredDomains: ["IT / Software Development", "Data Analytics"],
            preferredLocations: ["Ahmedabad", "Gandhinagar", "Remote"],
            experience: "Fresher",
          });
        }
      }
      setIsLoading(false);
    };

    init();

    // Auto-refresh interval every 10 seconds
    const interval = setInterval(() => {
      fetchInternshipsFromApi();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchInternshipsFromApi, fetchMastersFromApi, fetchApplicationsFromApi, fetchCompanyData]);

  // Update profile
  const updateProfile = async (updatedProfile: Partial<StudentProfile>) => {
    try {
      const merged = { ...studentProfile, ...updatedProfile } as StudentProfile;
      setStudentProfile(merged);

      if (!user) return;

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          profile: merged,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStudentProfile(data.profile || data);
      }
    } catch (err) {
      console.error("Failed to update profile API:", err);
    }
  };

  // Upload Certificate
  const uploadCertificate = async (certData: Omit<CertificateRecord, "id">) => {
    if (!studentProfile) return;
    const newCert: CertificateRecord = {
      ...certData,
      id: `cert-${Date.now()}`,
    };
    const updatedCerts = [...(studentProfile.certificates || []), newCert];
    await updateProfile({ certificates: updatedCerts });
  };

  const deleteCertificate = async (id: string) => {
    if (!studentProfile) return;
    const updatedCerts = (studentProfile.certificates || []).filter((c) => c.id !== id);
    await updateProfile({ certificates: updatedCerts });
  };

  // Add Project Showcase
  const addProject = async (projData: Omit<ProjectRecord, "id">) => {
    if (!studentProfile) return;
    const newProj: ProjectRecord = {
      ...projData,
      id: `proj-${Date.now()}`,
    };
    const updatedProjects = [...(studentProfile.projects || []), newProj];
    await updateProfile({ projects: updatedProjects });
  };

  const deleteProject = async (id: string) => {
    if (!studentProfile) return;
    const updatedProjects = (studentProfile.projects || []).filter((p) => p.id !== id);
    await updateProfile({ projects: updatedProjects });
  };

  // Submit Assessment Result
  const submitAssessmentResult = async (resultData: Omit<AssessmentResultRecord, "completedAt">) => {
    if (!studentProfile) return;
    const newResult: AssessmentResultRecord = {
      ...resultData,
      completedAt: new Date().toISOString(),
    };

    const existingScores = studentProfile.assessmentScores || [];
    const filteredScores = existingScores.filter((s) => s.testId !== resultData.testId);
    const updatedScores = [newResult, ...filteredScores];

    await updateProfile({ assessmentScores: updatedScores });
  };

  // Apply to Internship
  const applyToInternship = async (internshipId: string) => {
    const currentUserId = user?.userId || "usr-student-001";
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          internshipId,
        }),
      });

      if (res.ok) {
        await fetchApplicationsFromApi(currentUserId);
      }
    } catch (err) {
      console.error("Failed to submit application API:", err);
    }
  };

  // Search internships with parameters
  const searchInternships = async (query = "", location = "All", domain = "All") => {
    await fetchInternshipsFromApi(query, location, domain);
  };

  // Compute AI recommendations across all internships
  const getRecommendations = useCallback(() => {
    if (!studentProfile) return [];
    return internships
      .map((item) => ({
        ...item,
        match: calculateMatch(studentProfile, item),
      }))
      .sort((a, b) => b.match.matchScore - a.match.matchScore);
  }, [studentProfile, internships]);

  return (
    <AppContext.Provider
      value={{
        user,
        studentProfile,
        companyProfile,
        companyOpportunities,
        companyApplicants,
        interviews,
        notifications,
        internships,
        applications,
        masters,
        aiRecommendations,
        isLoading,
        login,
        registerUser,
        logout,
        updateProfile,
        uploadCertificate,
        deleteCertificate,
        addProject,
        deleteProject,
        submitAssessmentResult,
        applyToInternship,
        searchInternships,
        getRecommendations,
        fetchCompanyData,
        refreshAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
