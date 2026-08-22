export interface CertificateRecord {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  fileName: string;
  fileSize?: string;
}

export interface ProjectRecord {
  id: string;
  title: string;
  description: string;
  link: string;
  technologies: string[];
}

export interface AssessmentResultRecord {
  testId: string;
  testTitle: string;
  category: "technical" | "soft_skill";
  score: number;
  total: number;
  percentage: number;
  completedAt: string;
  status: "Passed" | "Needs Improvement" | "Exemplary";
}

export interface StudentProfile {
  name: string;
  email: string;
  degree: string;
  college: string;
  graduationYear: number;
  cgpa: number;
  skills: string[];
  interests: string[];
  preferredDomains: string[];
  preferredLocations: string[];
  experience?: string;
  resumeFileName?: string;
  resumeFileSize?: string;
  resumeUploadedAt?: string;
  certificates?: CertificateRecord[];
  projects?: ProjectRecord[];
  portfolios?: { id: string; platform: string; url: string }[];
  assessmentScores?: AssessmentResultRecord[];
  readinessScore?: number;
}

export interface Internship {
  id: string;
  title: string;
  organization: string;
  domain: string;
  location: string;
  requiredSkills: string[];
  preferredSkills?: string[];
  eligibilityCriteria: {
    minCGPA: number;
    targetGradYears: number[];
    eligibleBranches?: string[];
    mandatorySkills?: string[];
  };
  duration: string;
  stipend: string;
  availableSeats: number;
  description: string;
  applicationDeadline?: string;
  co?: string;
  bg?: string;
  color?: string;
  type?: string; // e.g. "On-site" | "Remote" | "Hybrid"
}

export function normalizeInternshipRecord(raw: any): Internship {
  if (!raw || typeof raw !== "object") {
    return {
      id: `int-${Math.random().toString(36).substr(2, 9)}`,
      title: "Internship Opportunity",
      organization: "Partner Organization",
      domain: "General Industry",
      location: "Flexible Location",
      requiredSkills: ["Problem Solving", "Communication"],
      eligibilityCriteria: { minCGPA: 0, targetGradYears: [] },
      duration: "3 Months",
      stipend: "Stipend Provided",
      availableSeats: 1,
      description: "No description provided.",
      applicationDeadline: "Open Until Filled",
      co: "TCS",
      bg: "bg-indigo-950/40",
      color: "text-indigo-400 border-indigo-900/50",
    };
  }

  const title = raw.title || raw.internship_title || raw.role_title || raw.position || "Internship Opportunity";
  const organization = raw.organization || raw.company_name || raw.company || "Partner Organization";
  const domain = raw.domain || raw.sector || raw.category || "General Industry";
  const location = raw.location || raw.city || "Flexible Location";

  // Parse required skills
  let requiredSkills: string[] = [];
  const rawReq = raw.requiredSkills || raw.skills || raw.skills_required || raw.mandatorySkills;
  if (Array.isArray(rawReq)) {
    requiredSkills = rawReq.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof rawReq === "string") {
    requiredSkills = rawReq.split(",").map((s) => s.trim()).filter(Boolean);
  }

  // Parse preferred skills
  let preferredSkills: string[] = [];
  const rawPref = raw.preferredSkills || raw.softSkills || raw.preferred_skills;
  if (Array.isArray(rawPref)) {
    preferredSkills = rawPref.map((s) => String(s).trim()).filter(Boolean);
  } else if (typeof rawPref === "string") {
    preferredSkills = rawPref.split(",").map((s) => s.trim()).filter(Boolean);
  }

  const duration = raw.duration || raw.internship_duration || "3 Months";
  const stipend = raw.stipend || raw.salary || "Stipend Provided";
  
  const availableSeats = typeof raw.availableSeats === "number" ? raw.availableSeats : (raw.openings || raw.seats || 1);
  const description = raw.description || "Detailed internship role description provided by employer.";

  let eligibilityCriteria = {
    minCGPA: 0,
    targetGradYears: [] as number[],
    eligibleBranches: [] as string[],
    mandatorySkills: [] as string[],
  };

  if (raw.eligibilityCriteria && typeof raw.eligibilityCriteria === "object") {
    eligibilityCriteria = {
      minCGPA: typeof raw.eligibilityCriteria.minCGPA === "number" ? raw.eligibilityCriteria.minCGPA : 0,
      targetGradYears: Array.isArray(raw.eligibilityCriteria.targetGradYears) ? raw.eligibilityCriteria.targetGradYears : [],
      eligibleBranches: Array.isArray(raw.eligibilityCriteria.eligibleBranches) ? raw.eligibilityCriteria.eligibleBranches : [],
      mandatorySkills: Array.isArray(raw.eligibilityCriteria.mandatorySkills) ? raw.eligibilityCriteria.mandatorySkills : [],
    };
  } else {
    eligibilityCriteria = {
      minCGPA: typeof raw.minCGPA === "number" ? raw.minCGPA : (raw.cgpa_required || 0),
      targetGradYears: raw.gradYear ? [raw.gradYear] : [],
      eligibleBranches: raw.branches ? (Array.isArray(raw.branches) ? raw.branches : [raw.branches]) : [],
      mandatorySkills: [],
    };
  }

  return {
    id: String(raw.id || `int-${Math.random().toString(36).substr(2, 9)}`),
    title,
    organization,
    domain,
    location,
    requiredSkills,
    preferredSkills,
    eligibilityCriteria,
    duration,
    stipend,
    availableSeats,
    description,
    applicationDeadline: raw.applicationDeadline || raw.deadline || "Open Until Filled",
    co: raw.co || "TCS",
    bg: raw.bg || "bg-indigo-950/40",
    color: raw.color || "text-indigo-400 border-indigo-900/50",
    type: raw.type || raw.work_mode || "On-site",
  };
}

export interface MatchResult {
  internshipId: string;
  isEligible: boolean;
  ineligibilityReasons: string[];
  matchScore: number;
  personalizedReason: string;
  breakdown: {
    skillsScore: number;     // out of 50
    domainScore: number;     // out of 25
    locationScore: number;   // out of 15
    interestScore: number;   // out of 10
  };
}

export function calculateMatch(student: any, rawInternship: any): MatchResult {
  const internship = normalizeInternshipRecord(rawInternship);

  const safeStudent: StudentProfile = {
    name: student?.name || "Student",
    email: student?.email || "student@avsar.ai",
    degree: student?.degree || "B.Tech",
    college: student?.college || "University",
    graduationYear: typeof student?.graduationYear === "number" ? student.graduationYear : 2026,
    cgpa: typeof student?.cgpa === "number" ? student.cgpa : 8.0,
    skills: Array.isArray(student?.skills) ? student.skills : ["Python", "SQL", "React"],
    interests: Array.isArray(student?.interests) ? student.interests : ["IT / Software Development"],
    preferredDomains: Array.isArray(student?.preferredDomains) ? student.preferredDomains : ["IT / Software Development"],
    preferredLocations: Array.isArray(student?.preferredLocations) ? student.preferredLocations : ["Ahmedabad", "Remote"],
  };

  const ineligibilityReasons: string[] = [];

  // 1. Minimum CGPA Check
  const minCGPA = internship.eligibilityCriteria?.minCGPA || 0;
  if (safeStudent.cgpa < minCGPA) {
    ineligibilityReasons.push(`Required minimum CGPA is ${minCGPA.toFixed(1)} (Your CGPA: ${safeStudent.cgpa.toFixed(1)})`);
  }

  // 2. Degree / Branch eligibility check
  const eligibleBranches = internship.eligibilityCriteria?.eligibleBranches || [];
  if (eligibleBranches.length > 0) {
    const studentDegreeLower = safeStudent.degree.toLowerCase();
    const isBranchMatch = eligibleBranches.some((b) => studentDegreeLower.includes(b.toLowerCase()));
    if (!isBranchMatch) {
      ineligibilityReasons.push(`Preferred disciplines: ${eligibleBranches.join(", ")}`);
    }
  }

  // 3. Year / Cohort check
  const targetGradYears = internship.eligibilityCriteria?.targetGradYears || [];
  if (targetGradYears.length > 0 && !targetGradYears.includes(safeStudent.graduationYear)) {
    ineligibilityReasons.push(`Target cohorts: ${targetGradYears.join(", ")}`);
  }

  // 4. Mandatory Skills check
  const mandatorySkills = internship.eligibilityCriteria?.mandatorySkills || [];
  if (mandatorySkills.length > 0) {
    const studentSkillsLower = safeStudent.skills.map((s) => s.toLowerCase());
    mandatorySkills.forEach((mSkill) => {
      if (!studentSkillsLower.includes(mSkill.toLowerCase())) {
        ineligibilityReasons.push(`Missing mandatory skill: ${mSkill}`);
      }
    });
  }

  const isEligible = ineligibilityReasons.length === 0;

  // 5. WEIGHTED SCORING
  
  // A. Skill Match - 50%
  const studentSkillsLower = safeStudent.skills.map((s) => s.toLowerCase().trim());
  const reqSkills = internship.requiredSkills || [];
  const prefSkills = internship.preferredSkills || [];

  let matchedReqCount = 0;
  reqSkills.forEach((skill) => {
    if (studentSkillsLower.includes(skill.toLowerCase().trim())) {
      matchedReqCount++;
    }
  });

  let matchedPrefCount = 0;
  prefSkills.forEach((skill) => {
    if (studentSkillsLower.includes(skill.toLowerCase().trim())) {
      matchedPrefCount++;
    }
  });

  // Calculate skill score out of 50
  let skillsScore = 0;
  if (reqSkills.length > 0) {
    const reqWeight = 0.8;
    const prefWeight = 0.2;
    const reqScore = (matchedReqCount / reqSkills.length) * 50 * reqWeight;
    const prefScore = prefSkills.length > 0 ? (matchedPrefCount / prefSkills.length) * 50 * prefWeight : 50 * prefWeight;
    skillsScore = Math.round(reqScore + prefScore);
  } else {
    skillsScore = 50; // Fallback
  }

  // B. Domain Fit - 25%
  let domainScore = 0;
  const prefDomains = safeStudent.preferredDomains.map((d) => d.toLowerCase().trim());
  const internshipDomainLower = internship.domain.toLowerCase().trim();

  if (prefDomains.includes(internshipDomainLower)) {
    domainScore = 25; // Exact Match
  } else if (prefDomains.some((d) => d.includes(internshipDomainLower) || internshipDomainLower.includes(d))) {
    domainScore = 15; // Related Domain Match
  } else {
    domainScore = 0;
  }

  // C. Location Match - 15%
  let locationScore = 0;
  const prefLocations = safeStudent.preferredLocations.map((l) => l.toLowerCase().trim());
  const internshipLocLower = internship.location.toLowerCase().trim();
  const isRemotePreferred = prefLocations.includes("remote");
  const isRemoteInternship = internshipLocLower.includes("remote") || (internship.type && internship.type.toLowerCase().includes("remote"));

  if (isRemoteInternship && isRemotePreferred) {
    locationScore = 15;
  } else if (prefLocations.some((loc) => internshipLocLower.includes(loc))) {
    locationScore = 15; // Exact matching city
  } else if (isRemoteInternship || isRemotePreferred) {
    locationScore = 8; // Partial remote fit
  } else {
    locationScore = 0;
  }

  // D. Interest/Role Fit - 10%
  let interestScore = 0;
  const interests = safeStudent.interests.map((i) => i.toLowerCase().trim());
  const titleLower = internship.title.toLowerCase();
  const descLower = internship.description.toLowerCase();

  let interestMatchCount = 0;
  interests.forEach((interest) => {
    if (titleLower.includes(interest) || descLower.includes(interest)) {
      interestMatchCount++;
    }
  });

  if (interestMatchCount > 0) {
    interestScore = Math.min(10, Math.round((interestMatchCount / interests.length) * 10));
  } else {
    interestScore = 0;
  }

  const matchScore = skillsScore + domainScore + locationScore + interestScore;

  // Build Personalized Recommendation Reason Explanation strictly based on database properties
  const matchedSkillsNames = reqSkills.filter((s) => studentSkillsLower.includes(s.toLowerCase().trim()));
  const skillText = matchedSkillsNames.length > 0 
    ? `matches ${matchedSkillsNames.length} of your key skills (${matchedSkillsNames.slice(0, 3).join(", ")})` 
    : "matches your general academic branch";

  const domainText = domainScore > 0 
    ? `aligns with your preferred domain of ${internship.domain}` 
    : "offers cross-domain industry experience";

  const locationText = locationScore > 0 
    ? `matches your preferred location of ${internship.location}` 
    : "is located outside your preferred cities";

  const eligibilityText = isEligible 
    ? "You satisfy all eligibility requirements." 
    : `Note: you do not satisfy some requirements (${ineligibilityReasons.join("; ")}).`;

  const personalizedReason = `This role is a ${matchScore}% match because it ${skillText}, ${domainText}, and ${locationText}. ${eligibilityText}`;

  return {
    internshipId: internship.id,
    isEligible,
    ineligibilityReasons,
    matchScore,
    personalizedReason,
    breakdown: {
      skillsScore,
      domainScore,
      locationScore,
      interestScore,
    },
  };
}
