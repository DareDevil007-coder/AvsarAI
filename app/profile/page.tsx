'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  FolderGit2, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  MapPin, 
  Mail, 
  Globe, 
  CheckSquare,
  Award,
  Plus,
  Trash2,
  Save,
  Compass,
  ChevronRight,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAppContext } from '@/context/AppContext';
import { calculateMatch } from '@/lib/matching';
import ResumeUploader from '@/components/ResumeUploader';
import { CATEGORIZED_SKILLS, ALL_MASTER_SKILLS } from '@/lib/skillsData';
import { Search } from 'lucide-react';

export default function StudentProfilePage() {
  const { studentProfile, user, updateProfile, uploadCertificate, deleteCertificate, addProject, deleteProject } = useAppContext();

  const [activeTab, setActiveTab] = useState<'academic' | 'skills' | 'portfolio' | 'analysis' | 'guides'>('academic');

  // Form states
  const [name, setName] = useState(studentProfile?.name || '');
  const [email, setEmail] = useState(studentProfile?.email || '');
  const [degree, setDegree] = useState(studentProfile?.degree || 'Bachelor of Technology (B.Tech - Computer Science)');
  const [college, setCollege] = useState(studentProfile?.college || 'Gujarat Technological University');
  const [graduationYear, setGraduationYear] = useState<number>(studentProfile?.graduationYear || 2026);
  const [cgpa, setCgpa] = useState<number>(studentProfile?.cgpa || 8.5);
  const [experience, setExperience] = useState<string>(studentProfile?.experience || 'Fresher');
  const [preferredLocation, setPreferredLocation] = useState<string>(studentProfile?.preferredLocations?.[0] || 'Ahmedabad');

  // Modal controls
  const [showCertModal, setShowCertModal] = useState(false);
  const [certTitle, setCertTitle] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certFileName, setCertFileName] = useState('');

  const [showProjModal, setShowProjModal] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projDesc, setProjDesc] = useState('');
  const [projLink, setProjLink] = useState('');
  const [projTech, setProjTech] = useState('');

  // Skills selection states
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [skillsSearchQuery, setSkillsSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [tempSelectedSkills, setTempSelectedSkills] = useState<string[]>([]);

  // Sync state when profile loads
  React.useEffect(() => {
    if (studentProfile) {
      setName(studentProfile.name || '');
      setEmail(studentProfile.email || '');
      setDegree(studentProfile.degree || '');
      setCollege(studentProfile.college || '');
      setGraduationYear(studentProfile.graduationYear || 2026);
      setCgpa(studentProfile.cgpa || 0);
      setExperience(studentProfile.experience || 'Fresher');
      setPreferredLocation(studentProfile.preferredLocations?.[0] || 'Ahmedabad');
    }
  }, [studentProfile]);

  // Compute metrics
  const readinessScore = useMemo(() => {
    if (!studentProfile) return 85;
    let score = 50;
    if (studentProfile.cgpa >= 8.0) score += 15;
    if ((studentProfile.skills || []).length > 2) score += 15;
    if ((studentProfile.certificates || []).length > 0) score += 10;
    if ((studentProfile.projects || []).length > 0) score += 10;
    return Math.min(98, score);
  }, [studentProfile]);

  const assessmentScores = useMemo(() => {
    if (studentProfile?.assessmentScores && studentProfile.assessmentScores.length > 0) {
      return studentProfile.assessmentScores.map((s) => ({
        topic: s.testTitle.split(' ')[0],
        score: s.percentage,
      }));
    }
    return [
      { topic: 'Python', score: 92 },
      { topic: 'SQL', score: 88 },
      { topic: 'Communication', score: 85 },
      { topic: 'Teamwork', score: 90 },
    ];
  }, [studentProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      email,
      degree,
      college,
      graduationYear,
      cgpa,
      experience,
      preferredLocations: [preferredLocation],
    });
  };

  const handleAddCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle || !certIssuer) return;
    await uploadCertificate({
      title: certTitle,
      issuer: certIssuer,
      issueDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      fileName: certFileName || `${certTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`,
    });
    setCertTitle('');
    setCertIssuer('');
    setCertFileName('');
    setShowCertModal(false);
  };

  const handleAddProjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle) return;
    await addProject({
      title: projTitle,
      description: projDesc,
      link: projLink,
      technologies: projTech.split(',').map((s) => s.trim()).filter(Boolean),
    });
    setProjTitle('');
    setProjDesc('');
    setProjLink('');
    setProjTech('');
    setShowProjModal(false);
  };

  const recommendedGuides = [
    {
      title: 'Mastering SQL & Relational Database Optimization',
      author: 'Avsar AI Research Wing',
      type: 'Technical Guide',
      level: 'Advanced',
      readTime: '3.5 Hours'
    },
    {
      title: 'Professional Communication & Stakeholder Etiquette',
      author: 'Gujarat Technical Development Cell',
      type: 'Workplace SOP',
      level: 'Advanced',
      readTime: '2.5 Hours'
    },
    {
      title: 'Building Cloud & Microservices Projects for Portfolios',
      author: 'Central Placement Council',
      type: 'Handbook',
      level: 'Intermediate',
      readTime: '4.0 Hours'
    }
  ];

  return (
    <div className="py-12 bg-[#ADD8E6]/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Top Banner */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 bg-ayush-700 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md flex-shrink-0">
              {(studentProfile?.name || name).split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{studentProfile?.name || name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Candidate
                </span>
                <span className="bg-ayush-50 text-ayush-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-ayush-200">
                  {readinessScore}% Readiness Score
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{studentProfile?.college || college}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-ayush-700" /> {studentProfile?.degree || degree}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {preferredLocation}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {studentProfile?.email || email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Link
              href="/assessment"
              className="flex-1 md:flex-none text-center bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Take Skill Tests</span>
            </Link>
            <button
              onClick={() => setShowCertModal(true)}
              className="flex-1 md:flex-none text-center border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-ayush-700" />
              <span>Add Certificate</span>
            </button>
          </div>

        </div>

        {/* Automated Resume Upload & AI Skill Extraction Component */}
        <ResumeUploader />

        {/* Profile Tabs Navigation */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1 text-xs font-bold">
          {[
            { id: 'academic', label: 'Core Info & Profile', icon: GraduationCap },
            { id: 'skills', label: 'Skills & Preferences', icon: Sparkles },
            { id: 'portfolio', label: 'Projects & Certifications', icon: FolderGit2 },
            { id: 'analysis', label: 'My Progress & Analytics', icon: TrendingUp },
            { id: 'guides', label: 'Recommended Guides', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-ayush-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Core Academic & General Info Form */}
        {activeTab === 'academic' && (
          <form onSubmit={handleSaveProfile} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-ayush-700" />
                <span>Academic & General Information</span>
              </h2>
              <button
                type="submit"
                className="px-5 py-2 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Degree / Program</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">College / Institution</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">CGPA / Percentage</label>
                <input
                  type="number"
                  step="0.1"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                  <MapPin className="w-4 h-4 text-ayush-700 mr-1" />
                  Preferred Location
                </label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:ring-2 focus:ring-ayush-600 focus:outline-none cursor-pointer"
                >
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Surat">Surat</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Pune">Pune</option>
                  <option value="Remote">Remote (Work from Home)</option>
                </select>
              </div>
            </div>

            {/* Experience Single Select Options */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <label className="block font-bold text-slate-700 text-xs uppercase tracking-wider">Work / Internship Experience</label>
              <div className="flex flex-wrap gap-2 text-xs">
                {['None', 'Fresher', '0–1 Years', '1–2 Years', '2–5 Years', '5+ Years'].map((exp) => (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => setExperience(exp)}
                    className={`px-3.5 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                      experience === exp
                        ? 'bg-ayush-700 text-white border-ayush-800 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Tab 2: Skills & Preferences */}
        {activeTab === 'skills' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>Verified Skills & Candidate Preferences</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">Used by Avsar AI recommendation engine to match top internship opportunities.</p>
              </div>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl font-bold border border-emerald-300">
                {(studentProfile?.skills || ['Python', 'SQL', 'React', 'Data Analytics', 'Communication']).length} Verified
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Acquired Technical Competencies</h3>
                <div className="flex flex-wrap gap-2 items-center">
                  {(studentProfile?.skills || ['Python', 'SQL', 'React', 'Data Analytics', 'Communication']).map((skill, i) => (
                    <span key={i} className="text-xs bg-emerald-100 text-emerald-900 font-bold px-3 py-1.5 rounded-lg border border-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={async () => {
                          const currentSkills = studentProfile?.skills || ['Python', 'SQL', 'React', 'Data Analytics', 'Communication'];
                          const updated = currentSkills.filter(s => s !== skill);
                          await updateProfile({ skills: updated });
                        }}
                        className="text-emerald-700 hover:text-red-600 transition-colors ml-0.5 cursor-pointer font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const currentSkills = studentProfile?.skills || ['Python', 'SQL', 'React', 'Data Analytics', 'Communication'];
                      setTempSelectedSkills(currentSkills);
                      setSkillsSearchQuery('');
                      setShowSkillsModal(true);
                    }}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Skill</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Preferred Internship Domains</h3>
                <div className="flex flex-wrap gap-2">
                  {(studentProfile?.interests || ['Software Engineering', 'AI/ML', 'Cloud Computing']).map((interest, i) => (
                    <span key={i} className="text-xs bg-ayush-50 text-ayush-800 font-semibold px-3 py-1.5 rounded-lg border border-ayush-200">
                      🎯 {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Projects & Portfolio */}
        {activeTab === 'portfolio' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-ayush-700" />
                <span>Projects & Certifications Showcase</span>
              </h2>
              <button
                onClick={() => setShowProjModal(true)}
                className="px-4 py-2 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-4">
              {(studentProfile?.projects || []).length === 0 ? (
                <div className="p-8 border border-dashed border-slate-300 rounded-xl text-center text-slate-500 text-xs">
                  No projects added yet. Click "+ Add Project" to feature your GitHub repos or live applications.
                </div>
              ) : (
                (studentProfile?.projects || []).map((proj) => (
                  <div key={proj.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <h3 className="font-bold text-slate-900 text-sm">{proj.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs text-ayush-700 font-bold hover:underline flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> {proj.link} <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies?.map((t, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Verified Certifications</h3>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="text-xs text-ayush-700 hover:underline font-bold cursor-pointer"
                >
                  + Add Certificate
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(studentProfile?.certificates || []).map((cert) => (
                  <div key={cert.id} className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-1 relative">
                    <button
                      onClick={() => deleteCertificate(cert.id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="font-bold text-slate-900 text-xs">{cert.title}</div>
                    <div className="text-[11px] text-slate-600">{cert.issuer} • Issued {cert.issueDate}</div>
                    <div className="text-[10px] text-emerald-700 font-mono">File: {cert.fileName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: My Progress & Analytics */}
        {activeTab === 'analysis' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-ayush-700" />
                <span>My Skill Assessment Progress & Analytics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Scores recorded automatically from Skill Assessment tests.</p>
            </div>

            <div className="h-64 w-full bg-slate-50 p-4 rounded-xl border border-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assessmentScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="topic" tick={{ fontSize: 11, fill: '#475569' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#475569' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#FFF', fontSize: '11px', borderRadius: '6px' }} />
                  <Bar dataKey="score" fill="#0F5257" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="text-2xl font-black text-emerald-800">{readinessScore}%</div>
                <div className="text-slate-600 font-semibold mt-1">Readiness Score</div>
              </div>
              <div className="p-4 bg-ayush-50 rounded-xl border border-ayush-200">
                <div className="text-2xl font-black text-ayush-800">{(studentProfile?.assessmentScores || []).length} / 4</div>
                <div className="text-slate-600 font-semibold mt-1">Tests Completed</div>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <div className="text-2xl font-black text-amber-800">Top 5%</div>
                <div className="text-slate-600 font-semibold mt-1">Avsar AI Percentile</div>
              </div>
            </div>

            {/* Discover Top 5 AI Matches Banner */}
            <div className="bg-gradient-to-r from-ayush-800 to-teal-700 p-6 rounded-2xl border border-slate-200 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6">
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Discover Your Top 5 AI Internship Matches</span>
                </h3>
                <p className="text-xs text-slate-200">
                  Analyze your profile vectors dynamically against database internships and apply in one click.
                </p>
              </div>
              <Link 
                href="/ai-matches"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>View AI Matches</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        )}

        {/* Tab 5: Recommended Guides */}
        {activeTab === 'guides' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>AI Recommended Study Guides & SOP Manuals</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Handpicked by Avsar AI to strengthen technical and workplace competency.</p>
            </div>

            <div className="space-y-4">
              {recommendedGuides.map((guide, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                      {guide.type}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{guide.title}</h3>
                    <div className="text-xs text-slate-500 mt-1">{guide.author} • Level: {guide.level}</div>
                  </div>
                  <button className="bg-ayush-700 hover:bg-ayush-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer">
                    <span>Read Guide</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Add Certificate */}
        {showCertModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-ayush-700" />
                Add Verified Certificate
              </h3>
              <form onSubmit={handleAddCertSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Certificate Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Python & Data Science Certificate"
                    value={certTitle}
                    onChange={(e) => setCertTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Issuing Organization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gujarat Technical University / Coursera"
                    value={certIssuer}
                    onChange={(e) => setCertIssuer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PDF File Name</label>
                  <input
                    type="text"
                    placeholder="e.g. python_cert.pdf"
                    value={certFileName}
                    onChange={(e) => setCertFileName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ayush-700 hover:bg-ayush-800 text-white rounded-lg font-bold cursor-pointer"
                  >
                    Save Certificate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Project */}
        {showProjModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-ayush-700" />
                Add Showcase Project
              </h3>
              <form onSubmit={handleAddProjSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI Microservices Portal"
                    value={projTitle}
                    onChange={(e) => setProjTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of application features..."
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GitHub / Live Link</label>
                  <input
                    type="text"
                    placeholder="https://github.com/username/project"
                    value={projLink}
                    onChange={(e) => setProjLink(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Technologies (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Python, React, SQL"
                    value={projTech}
                    onChange={(e) => setProjTech(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProjModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-ayush-700 hover:bg-ayush-800 text-white rounded-lg font-bold cursor-pointer"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Search & Add Skills (Grouped, Collapsible) */}
        {showSkillsModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[85vh] flex flex-col">
              
              <button
                type="button"
                onClick={() => setShowSkillsModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                  <span>Verified Competencies Directory</span>
                </h3>
                <p className="text-xs text-slate-500">Search and select technical, DevOps, cloud, or soft skill vectors.</p>
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search skills (e.g. AWS, Next.js, Docker)..."
                  value={skillsSearchQuery}
                  onChange={(e) => setSkillsSearchQuery(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ayush-600 focus:outline-none font-semibold text-slate-900"
                />
              </div>

              {/* Categorized List Container (Scrollable) */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-1">
                {Object.entries(CATEGORIZED_SKILLS).map(([category, skills]) => {
                  const filteredSkills = skills.filter(s => 
                    s.toLowerCase().includes(skillsSearchQuery.toLowerCase().trim())
                  );

                  // Hide category if search returns nothing for it
                  if (filteredSkills.length === 0) return null;

                  const isCollapsed = !!collapsedCategories[category];
                  const currentSkills = studentProfile?.skills || ['Python', 'SQL', 'React', 'Data Analytics', 'Communication'];

                  return (
                    <div key={category} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50/40">
                      {/* Collapsible Header */}
                      <button
                        type="button"
                        onClick={() => setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }))}
                        className="w-full px-4 py-2.5 bg-slate-100/70 border-b border-slate-200/50 flex justify-between items-center text-xs font-bold text-slate-700 hover:bg-slate-150 transition-colors"
                      >
                        <span>{category} ({filteredSkills.length})</span>
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>

                      {/* Skills Grid */}
                      {!isCollapsed && (
                        <div className="p-3.5 flex flex-wrap gap-2">
                          {filteredSkills.map((skill) => {
                            const isSelected = tempSelectedSkills.includes(skill);
                            return (
                              <button
                                key={skill}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setTempSelectedSkills(tempSelectedSkills.filter(s => s !== skill));
                                  } else {
                                    setTempSelectedSkills([...tempSelectedSkills, skill]);
                                  }
                                }}
                                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                                  isSelected
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 animate-scale-in" />}
                                <span>{skill}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Close Action */}
              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSkillsModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await updateProfile({ skills: tempSelectedSkills });
                    setShowSkillsModal(false);
                  }}
                  className="px-5 py-2 bg-ayush-700 hover:bg-ayush-800 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                >
                  Save Selection
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
