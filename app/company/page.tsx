'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  Users, 
  UserCheck, 
  Plus, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function CompanyPortalPage() {
  const { user, companyProfile, companyOpportunities, companyApplicants, interviews, login, fetchCompanyData } = useAppContext();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'opportunities' | 'post' | 'applicants' | 'interviews'>('dashboard');

  // New Opportunity Form
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'INTERNSHIP' | 'JOB'>('INTERNSHIP');
  const [newDomain, setNewDomain] = useState('IT / Software Development');
  const [newLocation, setNewLocation] = useState('Ahmedabad');
  const [newWorkMode, setNewWorkMode] = useState<'On-site' | 'Remote' | 'Hybrid'>('On-site');
  const [newSkills, setNewSkills] = useState('Python, SQL, React');
  const [newStipend, setNewStipend] = useState('₹15,000 / month');
  const [newDuration, setNewDuration] = useState('3 Months');
  const [newSeats, setNewSeats] = useState(2);
  const [newDescription, setNewDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    // If not logged in as company, attempt auto-login as TCS CO001 recruiter
    if (!user || user.role !== 'company') {
      login('hr@tcs.com', 'company');
    }
  }, [user, login]);

  const handlePostOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;
    setIsPosting(true);

    try {
      const companyId = companyProfile?.company_id || 'CO001';
      const res = await fetch('/api/company/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          title: newTitle,
          type: newType,
          status: 'Applications Open',
          domain: newDomain,
          location: newLocation,
          work_mode: newWorkMode,
          requiredSkills: newSkills.split(',').map((s) => s.trim()).filter(Boolean),
          eligibilityCriteria: { minCGPA: 7.0, targetGradYears: [2025, 2026], degree: 'B.Tech' },
          duration: newDuration,
          stipend: newStipend,
          availableSeats: Number(newSeats),
          description: newDescription,
          applicationDeadline: '2026-10-30',
        }),
      });

      if (res.ok) {
        setPostSuccess(true);
        await fetchCompanyData(companyId);
        setTimeout(() => {
          setPostSuccess(false);
          setActiveTab('opportunities');
          setNewTitle('');
          setNewDescription('');
        }, 1200);
      }
    } catch (err) {
      console.error('Failed to post opportunity:', err);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="py-12 bg-[#ADD8E6]/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Recruiter Header Banner */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 bg-ayush-800 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-md flex-shrink-0">
              {companyProfile?.logo || 'TCS'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {companyProfile?.company_name || 'Tata Consultancy Services'}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Partner
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">{companyProfile?.industry || 'IT Services & Consulting'} • {companyProfile?.location || 'Mumbai'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <button
              onClick={() => setActiveTab('post')}
              className="flex-1 md:flex-none bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Internship</span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Active Internships</span>
              <Briefcase className="w-4 h-4 text-ayush-700" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{companyOpportunities.length || 3}</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Live hiring drives</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Total Applicants</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{companyApplicants.length || 12}</div>
            <div className="text-[10px] text-slate-500 font-medium">Candidate profiles</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>Interviews Scheduled</span>
              <Calendar className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{interviews.length || 4}</div>
            <div className="text-[10px] text-teal-700 font-semibold">Upcoming sessions</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold">
              <span>AI Match Benchmark</span>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">88.5%</div>
            <div className="text-[10px] text-emerald-700 font-semibold">Avg applicant fit</div>
          </div>
        </div>

        {/* Portal Tabs */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1 text-xs font-bold">
          {[
            { id: 'dashboard', label: 'Company Overview', icon: Building2 },
            { id: 'opportunities', label: 'Active Opportunities', icon: Briefcase },
            { id: 'post', label: 'Post New Opportunity', icon: Plus },
            { id: 'applicants', label: 'Candidate Pipeline', icon: Users },
            { id: 'interviews', label: 'Scheduled Interviews', icon: Calendar },
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

        {/* Tab 1: Overview */}
        {activeTab === 'dashboard' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Organization Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Company Name</span>
                <div className="font-bold text-slate-900 text-sm">{companyProfile?.company_name || 'Tata Consultancy Services'}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Sector & Industry</span>
                <div className="font-bold text-slate-900 text-sm">{companyProfile?.sector || 'IT'} • {companyProfile?.industry || 'Services'}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Headquarters / Location</span>
                <div className="font-bold text-slate-900 text-sm">{companyProfile?.location || 'Mumbai, Maharashtra'}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 font-medium">Recruiter Contact Email</span>
                <div className="font-bold text-ayush-700 text-sm">{companyProfile?.contact_email || 'hr@tcs.com'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Opportunities List */}
        {activeTab === 'opportunities' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Posted Internship Opportunities</h2>
              <button
                onClick={() => setActiveTab('post')}
                className="px-4 py-2 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post Opportunity</span>
              </button>
            </div>

            <div className="space-y-4">
              {companyOpportunities.map((opp) => (
                <div key={opp.id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ayush-700 bg-ayush-50 px-2.5 py-0.5 rounded border border-ayush-200">{opp.domain}</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">{opp.status}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{opp.title}</h3>
                    <p className="text-xs text-slate-600">{opp.location} ({opp.work_mode}) • {opp.stipend} • {opp.duration}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-xs font-bold text-slate-900">{opp.availableSeats} Open Seats</div>
                    <button onClick={() => setActiveTab('applicants')} className="text-xs text-ayush-700 hover:underline font-bold cursor-pointer">
                      View Applicants →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Post Opportunity Form */}
        {activeTab === 'post' && (
          <form onSubmit={handlePostOpportunity} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-ayush-700" />
              <span>Post New Internship or Job Drive</span>
            </h2>

            {postSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Opportunity Published Successfully! Redirecting...</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Opportunity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Development Intern"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain / Category</label>
                <select
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium cursor-pointer"
                >
                  <option value="IT / Software Development">IT / Software Development</option>
                  <option value="Data Analytics">Data Analytics</option>
                  <option value="Software Quality & Testing">Software Quality & Testing</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Mode</label>
                <select
                  value={newWorkMode}
                  onChange={(e) => setNewWorkMode(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium cursor-pointer"
                >
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stipend / Salary</label>
                <input
                  type="text"
                  value={newStipend}
                  onChange={(e) => setNewStipend(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration & Available Seats</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-2/3 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  />
                  <input
                    type="number"
                    value={newSeats}
                    onChange={(e) => setNewSeats(Number(e.target.value))}
                    className="w-1/3 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Role Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed responsibilities and requirements..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium"
                ></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPosting}
              className="px-6 py-3 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              {isPosting ? 'Publishing...' : 'Publish Internship Opportunity'}
            </button>
          </form>
        )}

        {/* Tab 4: Applicants */}
        {activeTab === 'applicants' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Candidate Applications</h2>
            <div className="space-y-4">
              {companyApplicants.map((app) => (
                <div key={app.application_id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{app.candidateName}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">{app.matchScore}% Match</span>
                    </div>
                    <p className="text-xs text-slate-600">{app.degree} • {app.college} (CGPA: {app.cgpa})</p>
                    <p className="text-[11px] text-ayush-700 font-semibold">Applied for: {app.opportunityTitle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-ayush-50 text-ayush-800 px-3 py-1 rounded border border-ayush-200">{app.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Interviews */}
        {activeTab === 'interviews' && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Scheduled Interviews</h2>
            <div className="space-y-4">
              {interviews.map((intv) => (
                <div key={intv.interview_id} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 text-sm">Candidate ID: {intv.userId}</h3>
                    <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">{intv.mode}</span>
                  </div>
                  <p className="text-xs text-slate-600">Scheduled: {intv.scheduledAt} • Link/Venue: {intv.meetingLinkOrVenue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
