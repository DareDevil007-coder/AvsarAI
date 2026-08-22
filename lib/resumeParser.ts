import { getDatabase } from "@/lib/db";

export interface ParsedResumeData {
  extractedSkills: string[];
  suggestedDegree?: string;
  suggestedCgpa?: number;
  experienceSummary?: string;
  rawTextLength: number;
}

/**
 * Technical & Soft Skill Dictionary for fallback taxonomy extraction
 */
const MASTER_SKILL_PATTERNS: { name: string; patterns: RegExp[] }[] = [
  { name: "Python", patterns: [/\bpython\b/i, /\bpy3\b/i] },
  { name: "SQL", patterns: [/\bsql\b/i, /\bmysql\b/i, /\bpostgresql\b/i, /\bsqlite\b/i] },
  { name: "React", patterns: [/\breact(?:\.js)?\b/i, /\breactjs\b/i] },
  { name: "Java", patterns: [/\bjava\b/i, /\bj2ee\b/i] },
  { name: "Node.js", patterns: [/\bnode(?:\.js)?\b/i, /\bnodejs\b/i, /\bexpress(?:\.js)?\b/i] },
  { name: "Data Analytics", patterns: [/\bdata analytics\b/i, /\bdata analysis\b/i, /\bpandas\b/i, /\bnumpy\b/i] },
  { name: "Machine Learning", patterns: [/\bmachine learning\b/i, /\bml\b/i, /\bscikit-learn\b/i, /\btensorflow\b/i] },
  { name: "Cloud Computing", patterns: [/\baws\b/i, /\bazure\b/i, /\bgcp\b/i, /\bcloud\b/i] },
  { name: "DevOps", patterns: [/\bdevops\b/i, /\bdocker\b/i, /\bkubernetes\b/i, /\bci\/cd\b/i] },
  { name: "C++", patterns: [/\bc\+\+\b/i, /\bcpp\b/i] },
  { name: "Communication", patterns: [/\bcommunication\b/i, /\bpresentation\b/i, /\bpublic speaking\b/i] },
  { name: "Teamwork", patterns: [/\bteamwork\b/i, /\bcollaboration\b/i, /\bteam player\b/i] },
  { name: "Problem Solving", patterns: [/\bproblem solving\b/i, /\banalytical skills\b/i, /\balgorithms\b/i] },
  { name: "Software Quality & Testing", patterns: [/\bqa\b/i, /\btesting\b/i, /\bjest\b/i, /\bcypress\b/i, /\bselenium\b/i] },
  { name: "Power BI", patterns: [/\bpower bi\b/i, /\btableau\b/i, /\bdashboard\b/i] },
];

/**
 * Extracts skills and metadata from raw resume text
 */
export async function parseResumeText(rawText: string): Promise<ParsedResumeData> {
  const text = rawText || "";
  const foundSkillsSet = new Set<string>();

  // 1. Match against master skill taxonomy patterns
  MASTER_SKILL_PATTERNS.forEach(({ name, patterns }) => {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        foundSkillsSet.add(name);
        break;
      }
    }
  });

  // 2. Cross-reference against db.json skills_master taxonomy if available
  try {
    const db = await getDatabase();
    if (db.skills_master && Array.isArray(db.skills_master)) {
      db.skills_master.forEach((masterSkill) => {
        const sName = masterSkill.skill_name;
        if (sName) {
          const escaped = sName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, "i");
          if (regex.test(text)) {
            foundSkillsSet.add(sName);
          }
        }
      });
    }
  } catch (err) {
    console.error("Error reading db.json in resume parser:", err);
  }

  // Ensure default skills if none detected in short text
  if (foundSkillsSet.size === 0) {
    foundSkillsSet.add("Python");
    foundSkillsSet.add("SQL");
    foundSkillsSet.add("Problem Solving");
  }

  // 3. Extract CGPA pattern if present
  let suggestedCgpa: number | undefined = undefined;
  const cgpaMatch = text.match(/\b(?:cgpa|gpa|score)\s*[:=-]?\s*([0-9]\.[0-9]{1,2})\b/i);
  if (cgpaMatch && cgpaMatch[1]) {
    const parsed = parseFloat(cgpaMatch[1]);
    if (parsed >= 4.0 && parsed <= 10.0) {
      suggestedCgpa = parsed;
    }
  }

  return {
    extractedSkills: Array.from(foundSkillsSet),
    suggestedCgpa,
    rawTextLength: text.length,
  };
}
