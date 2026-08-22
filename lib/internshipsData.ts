export interface InternshipItem {
  id: string;
  title: string;
  organization: string;
  location: string;
  category: string;
  stipend: string;
  stipendNumeric: number;
  type: string;
  duration: string;
  durationCategory: string;
  matchScore: number;
  description: string;
  requirements: string[];
  postedDate: string;
}

export const ALL_INTERNSHIPS_DATA: InternshipItem[] = [
  {
    id: 'int-1',
    title: 'Software Development & AI Research Trainee',
    organization: 'Tata Consultancy Services',
    location: 'New Delhi',
    category: 'IT / Software Development',
    stipend: '₹18,000 / month',
    stipendNumeric: 18000,
    type: 'On-site',
    duration: '6 Months',
    durationCategory: '4-6 Months',
    matchScore: 94,
    description: 'Develop full stack web applications, REST API endpoints, and assist in AI model optimization.',
    requirements: ['B.Tech / B.E / BCA', 'Python', 'React', 'SQL'],
    postedDate: '1 day ago'
  },
  {
    id: 'int-2',
    title: 'Software Quality & Automated Testing Associate',
    organization: 'Infosys Innovation Labs',
    location: 'Bengaluru',
    category: 'Software Quality & Testing',
    stipend: '₹20,000 / month',
    stipendNumeric: 20000,
    type: 'On-site',
    duration: '3 Months',
    durationCategory: '1-3 Months',
    matchScore: 88,
    description: 'Engage in automated unit testing, API contract verification, and CI/CD deployment pipeline monitoring.',
    requirements: ['Computer Science Graduate', 'Jest / Cypress', 'CI/CD Pipelines'],
    postedDate: '2 days ago'
  },
  {
    id: 'int-3',
    title: 'Cloud & DevOps Infrastructure Fellow',
    organization: 'Wipro Cloud Solutions',
    location: 'Pune',
    category: 'Cloud & Data Engineering',
    stipend: '₹22,000 / month',
    stipendNumeric: 22000,
    type: 'Hybrid',
    duration: '6 Months',
    durationCategory: '4-6 Months',
    matchScore: 91,
    description: 'Manage AWS cloud containerization, Kubernetes cluster orchestration, and server security auditing.',
    requirements: ['IT / CS Graduate', 'AWS / Docker', 'Linux Scripting'],
    postedDate: '3 days ago'
  },
  {
    id: 'int-4',
    title: 'Data Analytics & Business Intelligence Intern',
    organization: 'Accenture Digital Labs',
    location: 'Mumbai',
    category: 'Data Analytics',
    stipend: '₹19,000 / month',
    stipendNumeric: 19000,
    type: 'Remote',
    duration: '4 Months',
    durationCategory: '4-6 Months',
    matchScore: 86,
    description: 'Analyze large-scale enterprise data, build automated SQL dashboard reports, and present business insights.',
    requirements: ['B.Tech / B.Sc Stats', 'SQL', 'Python Pandas', 'Power BI'],
    postedDate: 'Just now'
  }
];
