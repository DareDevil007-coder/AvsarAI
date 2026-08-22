'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Target,
  Search,
  CheckCircle2,
  BookOpen,
  Zap,
  ArrowRight,
  TrendingUp,
  Info,
  Sliders,
  Award
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useAppContext } from '@/context/AppContext';

// Comprehensive 15 Domains Mapping to multiple cascading Professional Roles
const DOMAINS_AND_ROLES: Record<string, string[]> = {
  "Software Quality & Testing": [
    "Test Automation Specialist", "Manual QA Engineer", "Performance Test Engineer", "SDET (Software Development Engineer in Test)"
  ],
  "Software Engineering": [
    "Backend Software Engineer", "Java Developer", "Python Developer", "Systems Software Engineer", "Full Stack Software Engineer"
  ],
  "Web Development": [
    "Frontend Web Developer", "React Developer", "Node.js Developer", "Angular Developer", "Full Stack Developer"
  ],
  "Mobile App Development": [
    "Android Developer (Kotlin/Java)", "iOS Developer (Swift)", "Flutter Developer", "React Native Developer"
  ],
  "Data Science & Analytics": [
    "Data Scientist", "Data Analyst", "Business Intelligence Analyst", "Data Engineer", "Quantitative Analyst"
  ],
  "AI/ML Engineering": [
    "Machine Learning Engineer", "NLP Scientist", "Computer Vision Specialist", "MLOps Engineer", "Deep Learning Engineer"
  ],
  "Cloud & DevOps": [
    "DevOps Engineer", "Cloud Architect", "Site Reliability Engineer (SRE)", "Platform Engineer", "Systems Administrator"
  ],
  "Cybersecurity": [
    "Security Analyst", "Penetration Tester", "Security Engineer", "Cryptographer", "Incident Responder"
  ],
  "UI/UX Design": [
    "UI Designer", "UX Researcher", "Product Designer", "Interaction Designer"
  ],
  "Product Management": [
    "Associate Product Manager", "Technical Product Manager", "Product Analyst", "Scrum Master"
  ],
  "Database Administration": [
    "Database Administrator (DBA)", "Database Developer", "Data Warehouse Architect"
  ],
  "Networking": [
    "Network Engineer", "Systems & Network Admin", "Network Security Engineer"
  ],
  "Embedded Systems/IoT": [
    "Embedded Systems Engineer", "Firmware Developer", "IoT Architect"
  ],
  "Digital Marketing": [
    "SEO Specialist", "Performance Marketer", "Growth Hacker", "Digital Analytics Manager"
  ],
  "Business Analysis": [
    "Business Analyst", "Systems Analyst", "Requirements Engineer"
  ]
};

// Skill axes mapped to each Domain
const SKILLS_AXES_BY_DOMAIN: Record<string, string[]> = {
  "Software Quality & Testing": [
    "Test Case Design", "Automation Tools (Selenium/Playwright)", "Bug Tracking (Jira)", "Scripting (Python/JS)", "CI/CD Pipelines"
  ],
  "Software Engineering": [
    "Algorithms & Logic", "System Architecture", "Backend Frameworks", "SQL/NoSQL Databases", "Object-Oriented Design"
  ],
  "Web Development": [
    "HTML/CSS/Tailwind", "JavaScript/ES6+", "React/Next.js", "API Design & Integration", "State Management"
  ],
  "Mobile App Development": [
    "Swift/Kotlin Core", "Mobile SDK Frameworks", "UI/UX Layouts", "App State Syncing", "App Store Deployment"
  ],
  "Data Science & Analytics": [
    "Data Cleaning", "Data Visualization", "SQL Database Queries", "Statistical Modeling", "Python/Pandas"
  ],
  "AI/ML Engineering": [
    "Linear Algebra & Calculus", "Python/PyTorch/TensorFlow", "Model Validation", "Data Engineering", "Model Deployment (MLOps)"
  ],
  "Cloud & DevOps": [
    "Cloud Architecture (AWS/GCP)", "Docker & Kubernetes", "CI/CD Orchestration", "Linux Administration", "Infrastructure as Code"
  ],
  "Cybersecurity": [
    "Network Security", "Cryptography Principles", "Vulnerability Audits", "Linux Admin & Shell", "Compliance Standards"
  ],
  "UI/UX Design": [
    "User Research", "Figma Design & Wireframes", "Prototyping", "Visual Hierarchy", "Design Systems"
  ],
  "Product Management": [
    "Market Research", "Agile & Scrum Processes", "Data Analytics Tools", "User Journey Mapping", "Roadmap Strategy"
  ],
  "Database Administration": [
    "SQL Optimization", "Database Schema Design", "NoSQL Datastores", "Backup & Recovery", "ETL Processing"
  ],
  "Networking": [
    "TCP/IP Stack", "Routing & Switching", "Network Firewalls", "Linux Systems Admin", "Network Troubleshooting"
  ],
  "Embedded Systems/IoT": [
    "C/C++ Programming", "Microcontrollers (Arduino/STM32)", "Real-Time OS (RTOS)", "Hardware Interfaces", "IoT Security Protocols"
  ],
  "Digital Marketing": [
    "SEO Content Optimization", "Ad Campaign Management", "Web Analytics (GA4)", "Copywriting & Creatives", "A/B Conversion Testing"
  ],
  "Business Analysis": [
    "Requirements Gathering", "Business Process Modeling", "Data Analysis Tools", "SQL Queries", "Agile/Scrum Frameworks"
  ]
};

// Map actual student profile skills to these axes to seed default score (90 if matched, 30 fallback)
function checkPossessedSkill(axisName: string, studentSkills: string[]): boolean {
  const normalizedSkills = studentSkills.map(s => s.toLowerCase().trim());
  const axisWords = axisName.toLowerCase().split(/[/\s&,()]+/);
  
  return axisWords.some(word => {
    if (word.length < 3) return false; // skip short fillers like 'at', 'in', '&'
    return normalizedSkills.some(skill => skill.includes(word));
  });
}

export default function SkillMappingPage() {
  const { studentProfile, user } = useAppContext();

  const [discipline, setDiscipline] = useState('IT / Software Development');
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [selfAssessedScores, setSelfAssessedScores] = useState<Record<string, number>>({});

  const activeSkills = useMemo(() => {
    return studentProfile?.skills || ['Python', 'SQL', 'React', 'Data Analytics', 'Communication'];
  }, [studentProfile]);

  // Adjust default discipline/role mapping if needed on initial mount
  useEffect(() => {
    // Set default domain to Web Dev if it doesn't match keys
    const firstDomain = Object.keys(DOMAINS_AND_ROLES)[0];
    setDiscipline(firstDomain);
    setTargetRole(DOMAINS_AND_ROLES[firstDomain][0]);
  }, []);

  // Update cascading target professional role dropdown options
  const handleDomainChange = (domain: string) => {
    setDiscipline(domain);
    const roles = DOMAINS_AND_ROLES[domain];
    if (roles && roles.length > 0) {
      setTargetRole(roles[0]);
    }
  };

  // Re-seed self-assessed scores dynamically whenever domain or target role changes
  const skillAxes = useMemo(() => {
    // Find skill axes associated with selected Domain, or fallback to Software Engineering
    return SKILLS_AXES_BY_DOMAIN[discipline] || SKILLS_AXES_BY_DOMAIN["Software Engineering"];
  }, [discipline]);

  useEffect(() => {
    const initialScores: Record<string, number> = {};
    skillAxes.forEach(axis => {
      // Benchmark based on student skills: 90 if matched, else 35
      const matches = checkPossessedSkill(axis, activeSkills);
      initialScores[axis] = matches ? 90 : 35;
    });
    setSelfAssessedScores(initialScores);
  }, [skillAxes, activeSkills]);

  // Handle manual adjustment of slider values
  const handleScoreChange = (axis: string, val: number) => {
    setSelfAssessedScores(prev => ({
      ...prev,
      [axis]: val
    }));
  };

  // Radar chart data mapping
  const radarData = useMemo(() => {
    return skillAxes.map(axis => {
      const studentScore = selfAssessedScores[axis] ?? 40;
      // Fixed employer benchmark (usually ranges 80-95 depending on role seniority)
      const benchmarkScore = axis.toLowerCase().includes("communication") || axis.toLowerCase().includes("team") ? 80 : 90;
      return {
        subject: axis,
        student: studentScore,
        required: benchmarkScore
      };
    });
  }, [skillAxes, selfAssessedScores]);

  // Dynamic overall readiness metric computation
  const matchPercentage = useMemo(() => {
    if (radarData.length === 0) return 0;
    const total = radarData.reduce((acc, curr) => acc + curr.student, 0);
    return Math.min(99, Math.round(total / radarData.length));
  }, [radarData]);

  return (
    <div className="py-12 bg-[#ADD8E6]/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-2xl p-8 text-white shadow-md relative overflow-hidden border border-white/10">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs px-3 py-1 rounded-full font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>Avsar AI Competency Vector Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">AI Skill Mapping & Competency Diagnostics</h1>
            <p className="text-xs text-slate-350 leading-relaxed">
              Analyze student skill gaps against live employer demands. Toggle domains, customize target career streams, and assess your proficiency vector parameters interactively.
            </p>
          </div>
        </div>

        {/* Adjusting layout grid to render two column cards layout cleanly */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Configurations & Profile Vectors */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Target Career Stream Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-700" />
                <span>Target Career Stream</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Select Domain</label>
                  <select
                    value={discipline}
                    onChange={(e) => handleDomainChange(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none cursor-pointer"
                  >
                    {Object.keys(DOMAINS_AND_ROLES).map(domain => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Professional Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none cursor-pointer"
                  >
                    {(DOMAINS_AND_ROLES[discipline] || [targetRole]).map((r, i) => (
                      <option key={i} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Skills Checklist */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>My Verified Profile Skills</span>
                </h3>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-250">
                  {activeSkills.length} Verified
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 pt-1">
                  {activeSkills.map((skill, i) => (
                    <span key={i} className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Avsar AI Candidate Readiness Vector</span>
                <span className="font-bold text-emerald-700">{matchPercentage}% Score</span>
              </div>
            </div>

            {/* Interactive Proficiency Sliders */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-700" />
                <span>Assessed Skill Parameters (Self-Assessed)</span>
              </h3>
              <p className="text-[10px] text-slate-500">Adjust the sliders or type values directly to customize the radar graph axes dynamically:</p>
              
              <div className="space-y-3.5">
                {skillAxes.map((axis) => {
                  const score = selfAssessedScores[axis] ?? 40;
                  return (
                    <div key={axis} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span className="truncate max-w-[180px]">{axis}</span>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="10"
                            max="100"
                            value={score}
                            onChange={(e) => {
                              const val = Math.max(10, Math.min(100, parseInt(e.target.value) || 10));
                              handleScoreChange(axis, val);
                            }}
                            className="w-12 text-center py-0.5 border border-slate-300 rounded-lg font-mono text-[11px] text-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-600 bg-slate-50"
                          />
                          <span className="text-[10px] font-bold text-slate-400">%</span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={score}
                        onChange={(e) => handleScoreChange(axis, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-700 focus:outline-none"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column - Skill Gap diagnostics & Radar chart */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Expanded legibility Radar Chart Container */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-slate-900 text-sm tracking-tight uppercase">Avsar AI Skill Gap Diagnostics</h3>
                  <p className="text-xs text-slate-500 font-medium">Target Stream: {targetRole}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-purple-700">{matchPercentage}%</div>
                  <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black">Readiness Metric</div>
                </div>
              </div>

              {/* Increased size container: height changed from 64 to 96 (legibility improvement) */}
              <div className="h-96 w-full pt-4 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="78%" data={radarData}>
                    <PolarGrid stroke="#F1F5F9" strokeWidth={1.5} />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9.5, fill: '#334155', fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#64748B' }} />
                    
                    {/* User Assessed Competency Vector */}
                    <Radar 
                      name="Self-Assessed Score" 
                      dataKey="student" 
                      stroke="#8B5CF6" 
                      fill="#8B5CF6" 
                      fillOpacity={0.35} 
                      strokeWidth={2}
                    />
                    
                    {/* Employer Demands Benchmark */}
                    <Radar 
                      name="Industry Benchmark" 
                      dataKey="required" 
                      stroke="#0F5257" 
                      fill="#0F5257" 
                      fillOpacity={0.15} 
                      strokeWidth={1.5}
                    />
                    
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        color: '#FFF', 
                        fontSize: '11px', 
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'
                      }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Chart Legend Summary */}
              <div className="flex justify-center gap-6 pt-3 text-[10px] font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3 bg-purple-600/35 border border-purple-500 rounded-sm" />
                  <span className="text-slate-600">Self-Assessed / Profile Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3 bg-[#0F5257]/15 border border-[#0F5257] rounded-sm" />
                  <span className="text-slate-600">Industry Required Standard</span>
                </div>
              </div>
            </div>

            {/* Skill Bridge Actions Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-700" />
                <span>Recommended Skill Bridge Actions</span>
              </h3>

              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-emerald-900">Take Assessment Tests to Verify Skills</div>
                    <div className="text-[11px] text-emerald-700">Complete assessment tests and add verified parameters directly.</div>
                  </div>
                  <Link href="/assessment" className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-xs">
                    Take Quiz
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
