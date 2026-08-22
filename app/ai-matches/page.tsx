'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Briefcase,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Mail,
  UserCheck,
  FileText
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { calculateMatch, normalizeInternshipRecord } from '@/lib/matching';

export default function AiMatchesPage() {
  const { studentProfile, internships, applications, applyToInternship, user } = useAppContext();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<Record<string, boolean>>({});
  const [applyingId, setApplyingId] = useState<string | null>(null);

  // Filter and rank Top 5 best matches
  const topMatches = useMemo(() => {
    if (!studentProfile) return [];

    const list = internships.map((item) => {
      const normalized = normalizeInternshipRecord(item);
      const matchResult = calculateMatch(studentProfile, normalized);
      return {
        ...normalized,
        match: matchResult,
      };
    });

    // Sort by match score descending
    list.sort((a, b) => b.match.matchScore - a.match.matchScore);

    // Get Top 5
    return list.slice(0, 5);
  }, [internships, studentProfile]);

  const handleApply = async (internshipId: string) => {
    setApplyingId(internshipId);
    try {
      await applyToInternship(internshipId);
      setAppliedStatus(prev => ({ ...prev, [internshipId]: true }));
    } catch (e) {
      console.error(e);
    } finally {
      setApplyingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (!user) {
    return (
      <div className="py-20 bg-slate-50 min-h-screen flex items-center justify-center text-slate-800 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-2xl text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-purple-600 mx-auto animate-pulse" />
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">Authentication Required</h2>
            <p className="text-xs text-slate-500">Please sign in to access your student profile and dynamically calculate your Top 5 AI matches.</p>
          </div>
          <Link 
            href="/login" 
            className="inline-flex w-full justify-center items-center gap-1.5 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Sign In to Student Portal</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen text-slate-850">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Premium Dashboard Header - Light Theme */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-950 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-purple-600 flex-shrink-0 animate-pulse" />
              <span>AI-Powered Internship Matches</span>
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-medium">
              Personalized internship opportunities ranked according to your skills, academic profile, career interests, domain preference, and location.
            </p>
          </div>
          
          <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl text-right flex-shrink-0">
            <div className="text-[10px] font-black text-purple-700 tracking-widest uppercase">MATCH ENGINE</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">AVSAR AI Core</div>
          </div>
        </div>

        {/* Top 5 AI Matches List */}
        <div className="space-y-6">
          {topMatches.length === 0 ? (
            <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs space-y-3 shadow-xs">
              <AlertCircle className="w-12 h-12 text-purple-400 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">No match recommendations available</p>
                <p>Ensure you have verified skills and domain preferences saved on your profile.</p>
              </div>
            </div>
          ) : (
            topMatches.map((opp, idx) => {
              const rank = idx + 1;
              const isExpanded = expandedId === opp.id;
              
              // Check if already applied
              const hasApplied = applications.some((app) => app.internshipId === opp.id) || !!appliedStatus[opp.id];
              const isEligible = opp.match.isEligible;

              // Extract skills and skills gap
              const studentSkillsLower = (studentProfile?.skills || []).map((s) => s.toLowerCase().trim());
              const skillGap = opp.requiredSkills.filter(
                (skill) => !studentSkillsLower.includes(skill.toLowerCase().trim())
              );

              return (
                <div 
                  key={opp.id} 
                  className={`bg-white rounded-2xl border transition-all ${
                    isExpanded 
                      ? 'border-purple-500/40 shadow-xl shadow-purple-500/5' 
                      : 'border-slate-200 hover:border-purple-500/35 shadow-sm'
                  }`}
                >
                  {/* Card Collapsed Summary View */}
                  <div 
                    onClick={() => toggleExpand(opp.id)}
                    className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Premium Rank Counter Badge */}
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl flex items-center justify-center font-black text-base shadow-lg shadow-purple-500/10 flex-shrink-0 border border-purple-400/20">
                        #{rank}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-800 text-sm hover:text-purple-700 transition-colors">{opp.title}</h3>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded border tracking-wider ${
                            isEligible 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 bg-emerald-100/50' 
                              : 'bg-red-50 text-red-800 border-red-200 bg-red-100/50'
                          }`}>
                            {isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                          </span>
                        </div>
                        <p className="text-xs text-purple-700 font-bold">
                          {opp.organization} • <span className="text-slate-500 font-medium">{opp.domain}</span>
                        </p>
                        <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1 font-medium">
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-purple-500" /> {opp.location}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-500" /> {opp.duration}</span>
                          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-purple-500" /> {opp.availableSeats} positions left</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 self-stretch md:self-auto justify-between md:justify-end border-t border-slate-100 md:border-t-0 pt-3 md:pt-0">
                      <div className="text-right">
                        <div className="text-xl font-black text-purple-700 tracking-tight">{opp.match.matchScore}% MATCH</div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Avsar Fit Score</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-100 text-purple-600 hover:bg-slate-200/80 transition-colors border border-slate-200">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Card Expanded Content Drawer */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-3 border-t border-slate-100 space-y-6 text-xs text-slate-600">
                      
                      {/* AI Recommendation Fit Summary - Light Purple Theme */}
                      <div className="p-5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-4">
                        <h4 className="font-black text-purple-800 text-xs tracking-wider uppercase flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                          <span>AI RECOMMENDATION FIT</span>
                        </h4>
                        
                        <p className="text-purple-950 leading-relaxed italic bg-white p-3 rounded-lg border border-purple-100 font-medium">
                          "{opp.match.personalizedReason}"
                        </p>

                        {/* Weighted Match Breakdown Bars */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                          
                          {/* Skills Match (50%) */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-700 text-[10px] uppercase tracking-wider">
                              <span>SKILLS MATCH (50%)</span>
                              <span className="font-mono text-purple-800">{opp.match.breakdown.skillsScore}/50</span>
                            </div>
                            <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full rounded-full transition-all"
                                style={{ width: `${(opp.match.breakdown.skillsScore / 50) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Domain Fit (25%) */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-700 text-[10px] uppercase tracking-wider">
                              <span>DOMAIN FIT (25%)</span>
                              <span className="font-mono text-purple-800">{opp.match.breakdown.domainScore}/25</span>
                            </div>
                            <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all"
                                style={{ width: `${(opp.match.breakdown.domainScore / 25) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Location Match (15%) */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-700 text-[10px] uppercase tracking-wider">
                              <span>LOCATION MATCH (15%)</span>
                              <span className="font-mono text-purple-800">{opp.match.breakdown.locationScore}/15</span>
                            </div>
                            <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all"
                                style={{ width: `${(opp.match.breakdown.locationScore / 15) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Interest Fit (10%) */}
                          <div className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-700 text-[10px] uppercase tracking-wider">
                              <span>INTEREST FIT (10%)</span>
                              <span className="font-mono text-purple-800">{opp.match.breakdown.interestScore}/10</span>
                            </div>
                            <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden border border-slate-200">
                              <div 
                                className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full rounded-full transition-all"
                                style={{ width: `${(opp.match.breakdown.interestScore / 10) * 100}%` }}
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Main Details and Side Panel Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        
                        {/* Left Info Column */}
                        <div className="lg:col-span-8 space-y-6">
                          
                          {/* Role Description */}
                          <div className="space-y-2">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">ROLE DESCRIPTION</h4>
                            <p className="text-slate-750 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-line font-medium">
                              {opp.description}
                            </p>
                          </div>

                          {/* Skills Comparison Checklist */}
                          <div className="space-y-2">
                            <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">REQUIRED SKILLS</h4>
                            <div className="flex flex-wrap gap-2.5">
                              {opp.requiredSkills.map((skill) => {
                                const isPossessed = studentSkillsLower.includes(skill.toLowerCase().trim());
                                return (
                                  <span 
                                    key={skill} 
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs ${
                                      isPossessed 
                                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                        : 'bg-amber-50 text-amber-800 border-amber-200'
                                    }`}
                                  >
                                    {isPossessed ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                    ) : (
                                      <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                    )}
                                    <span>{skill} {isPossessed ? '✓' : ''}</span>
                                  </span>
                                );
                              })}
                            </div>

                            {/* Gaps Bridging Panel */}
                            {skillGap.length > 0 && (
                              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1.5 mt-2">
                                <div className="text-[11px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Skills to Improve:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {skillGap.map((skill) => (
                                    <span key={skill} className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Right Summary Panel Column */}
                        <div className="lg:col-span-4 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 h-fit">
                          <h4 className="font-black text-slate-800 uppercase tracking-widest text-[10px] border-b border-slate-200 pb-2">
                            Position Summary
                          </h4>
                          
                          <div className="space-y-3.5 text-xs font-semibold text-slate-700">
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">Compensation</div>
                              <div className="font-extrabold text-slate-900 mt-0.5">{opp.stipend}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">Duration</div>
                              <div className="font-extrabold text-purple-800 mt-0.5">{opp.duration}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">Required CGPA</div>
                              <div className="font-extrabold text-slate-900 mt-0.5">{(opp.eligibilityCriteria?.minCGPA || 0).toFixed(1)}+</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">Target Cohort</div>
                              <div className="font-extrabold text-slate-900 mt-0.5">
                                {opp.eligibilityCriteria?.targetGradYears?.join(", ") || "All Batches"}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">Work Mode</div>
                              <div className="font-extrabold text-slate-900 mt-0.5">{opp.type || "On-site"}</div>
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-500 font-bold uppercase">Application Deadline</div>
                              <div className="font-extrabold text-rose-600 mt-0.5">{opp.applicationDeadline}</div>
                            </div>
                          </div>

                          {/* CTA Submission Actions */}
                          <div className="pt-4 border-t border-slate-200">
                            {hasApplied ? (
                              <button 
                                disabled
                                className="w-full py-3 bg-emerald-50 border border-emerald-250 text-emerald-800 font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                                <span>Applied Successfully</span>
                              </button>
                            ) : isEligible ? (
                              <button
                                disabled={applyingId === opp.id}
                                onClick={() => handleApply(opp.id)}
                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-500/10 transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <span>{applyingId === opp.id ? 'Submitting...' : 'Apply Now'}</span>
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                disabled
                                className="w-full py-3 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-xs rounded-xl cursor-not-allowed"
                              >
                                Ineligible to Apply
                              </button>
                            )}
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
