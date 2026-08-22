export interface SkillItem {
  name: string;
  category: string;
}

export const CATEGORIZED_SKILLS: Record<string, string[]> = {
  "Programming Languages": [
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C", "Go", "Rust", "Kotlin", "Swift", "Ruby", "PHP", "Scala", "R", "Dart"
  ],
  "Web Development": [
    "React", "Next.js", "Vue", "Angular", "Node.js", "Express", "HTML/CSS", "Tailwind CSS", "Svelte", "Django", "Flask", "FastAPI", "Spring Boot", "REST API", "GraphQL"
  ],
  "Data & AI/ML": [
    "SQL", "Data Analytics", "Machine Learning", "Deep Learning", "NLP", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Power BI", "Excel", "Tableau", "BigQuery", "Apache Spark", "Scikit-Learn"
  ],
  "Cloud & DevOps": [
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git/GitHub", "CI/CD", "Terraform", "Linux", "Jenkins", "Vercel", "Firebase"
  ],
  "Mobile Development": [
    "Android (Kotlin/Java)", "Flutter", "React Native", "Swift-iOS"
  ],
  "Design & Creative": [
    "UI/UX Design", "Figma", "Adobe XD", "Wireframing", "Prototyping", "Photoshop", "Illustrator"
  ],
  "Soft Skills": [
    "Communication", "Teamwork", "Problem Solving", "Leadership", "Critical Thinking", "Time Management", "Presentation"
  ]
};

// Flattened master list for easy search index lookup
export const ALL_MASTER_SKILLS: string[] = Object.values(CATEGORIZED_SKILLS).flat();
