'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Building2, 
  ShieldCheck, 
  Briefcase, 
  CheckCircle2, 
  X, 
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  UserCheck,
  IndianRupee,
  GraduationCap
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Internship, calculateMatch, MatchResult } from '@/lib/matching';

export default function InternshipsPage() {
  const { internships, studentProfile, applyToInternship, applications, searchInternships, user } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedStipendRange, setSelectedStipendRange] = useState('ALL');
  const [selectedDuration, setSelectedDuration] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [sortBy, setSortBy] = useState<'MATCH' | 'STIPEND' | 'NEWEST'>('MATCH');
  
  const [activeModalOpp, setActiveModalOpp] = useState<(Internship & { match: MatchResult }) | null>(null);
  const [appliedStatus, setAppliedStatus] = useState<string | null>(null);

  // Pagination state (Load More)
  const [visibleCount, setVisibleCount] = useState(1000);

  // Trigger search to backend on filter/search changes
  useEffect(() => {
    const timer = setTimeout(() => {
      searchInternships(searchQuery, selectedLocation, selectedDiscipline);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedLocation, selectedDiscipline, searchInternships]);

  // Extract unique domains & locations present in database
  const domains = useMemo(() => {
    const set = new Set<string>();
    internships.forEach((i) => {
      if (i.domain) set.add(i.domain);
    });
    return ['ALL', ...Array.from(set)];
  }, [internships]);

  const locations = useMemo(() => {
    const set = new Set<string>();
    internships.forEach((i) => {
      if (i.location) set.add(i.location);
    });
    return ['ALL', ...Array.from(set)];
  }, [internships]);

  // Dynamic match calculation and filtering
  const filteredList = useMemo(() => {
    const currentProfile = studentProfile || {
      name: user?.name || 'Student',
      email: user?.email || 'student@avsar.ai',
      degree: 'B.Tech',
      college: 'Gujarat Technological University',
      graduationYear: 2026,
      cgpa: 8.5,
      skills: ['Python', 'SQL', 'React', 'Communication'],
      interests: ['Software', 'AI/ML'],
      preferredDomains: ['IT / Software Development'],
      preferredLocations: ['Ahmedabad', 'Remote'],
    };

    let list = internships.map((item) => ({
      ...item,
      match: calculateMatch(currentProfile, item),
    }));

    // Apply Filters
    list = list.filter((item) => {
      const matchesQuery =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requiredSkills.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDomain = selectedDiscipline === 'ALL' || item.domain.toLowerCase().includes(selectedDiscipline.toLowerCase());
      const matchesLocation = selectedLocation === 'ALL' || item.location.toLowerCase().includes(selectedLocation.toLowerCase());

      return matchesQuery && matchesDomain && matchesLocation;
    });

    // Apply Sorting
    if (sortBy === 'MATCH') {
      list.sort((a, b) => b.match.matchScore - a.match.matchScore);
    } else if (sortBy === 'STIPEND') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'NEWEST') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    return list;
  }, [internships, studentProfile, user, searchQuery, selectedDiscipline, selectedLocation, sortBy]);

  const displayedList = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const handleApply = async (id: string) => {
    setAppliedStatus(id);
    await applyToInternship(id);
    setTimeout(() => {
      setActiveModalOpp(null);
      setAppliedStatus(null);
    }, 1500);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDiscipline('ALL');
    setSelectedType('ALL');
    setSelectedStipendRange('ALL');
    setSelectedDuration('ALL');
    setSelectedLocation('ALL');
    setSortBy('MATCH');
    setVisibleCount(12);
  };

  return (
    <div className="py-12 bg-[#ADD8E6]/20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-100 text-ayush-800 text-xs px-3 py-1 rounded-full font-bold border border-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Avsar AI Verified Database</span>
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold border border-slate-200 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-ayush-700" />
                <span>{user?.name || studentProfile?.name || 'Guest Candidate'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Internships & Traineeships Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Explore verified internship opportunities across top institutes, R&D labs, and companies in real-time.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Briefcase className="w-4 h-4 text-ayush-700" />
            <span>{filteredList.length} Active Positions ({internships.length} Total Database Records)</span>
          </div>
        </div>

        {/* Multi-Filter Console */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 text-xs font-extrabold uppercase text-ayush-700">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Search & Multi-Filter Console</span>
            </div>
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 hover:text-ayush-700 underline font-medium cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search title, org, skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ayush-600 focus:outline-none font-medium"
              />
            </div>

            <div>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
              >
                <option value="ALL">Select Category / Domain (All)</option>
                {domains.filter(d => d !== 'ALL').map((dom) => (
                  <option key={dom} value={dom}>{dom}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full text-xs py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
              >
                <option value="ALL">Select Location (All Locations)</option>
                {locations.filter(l => l !== 'ALL').map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs py-2.5 px-3 bg-ayush-50 border border-ayush-300 text-ayush-900 font-bold rounded-lg focus:ring-2 focus:ring-ayush-600 focus:outline-none"
              >
                <option value="MATCH">Sort by: Avsar AI Match Score</option>
                <option value="STIPEND">Sort by: Stipend / Title</option>
                <option value="NEWEST">Sort by: Newest Database Records</option>
              </select>
            </div>

          </div>

        </div>

        {/* Internships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedList.map((item) => {
            const isApplied = applications.some((app) => app.internshipId === item.id);
            return (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="bg-ayush-50 text-ayush-800 text-[10px] font-extrabold px-2.5 py-1 rounded border border-ayush-200">
                      {item.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      item.match.matchScore >= 80
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}>
                      {item.match.matchScore}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.title}</h3>
                  
                  <div className="flex items-center text-xs text-slate-600 space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item.organization}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>
                    <span className="font-bold text-emerald-700">{item.stipend}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                    {item.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Required Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {item.requiredSkills.map((req, i) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{item.duration}</span>
                  <button
                    onClick={() => setActiveModalOpp(item)}
                    className="bg-ayush-700 hover:bg-ayush-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View & Apply</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More & Show All Controls */}
        {visibleCount < filteredList.length && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-6 py-3 bg-ayush-700 hover:bg-ayush-800 text-white font-bold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Load More Database Internships ({filteredList.length - visibleCount} remaining)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setVisibleCount(filteredList.length)}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-all cursor-pointer"
            >
              <span>Show All ({filteredList.length} Internships)</span>
            </button>
          </div>
        )}

        {/* Application Modal */}
        {activeModalOpp && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setActiveModalOpp(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div>
                <span className="text-xs font-bold text-ayush-700 bg-ayush-50 px-2.5 py-1 rounded">
                  {activeModalOpp.domain}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-2">{activeModalOpp.title}</h2>
                <p className="text-xs text-slate-600">{activeModalOpp.organization} • {activeModalOpp.location}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-xs space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant Name:</span>
                  <span className="font-bold text-slate-900">{studentProfile?.name || user?.name || "Candidate"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stipend:</span>
                  <span className="font-bold text-emerald-700">{activeModalOpp.stipend}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Duration & Seats:</span>
                  <span className="font-medium text-slate-800">{activeModalOpp.duration} ({activeModalOpp.availableSeats} Available Seats)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Avsar AI Match Rationale:</span>
                  <span className="font-bold text-ayush-700">{activeModalOpp.match.personalizedReason}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Role Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{activeModalOpp.description}</p>
              </div>

              {appliedStatus === activeModalOpp.id || applications.some((app) => app.internshipId === activeModalOpp.id) ? (
                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-center text-xs font-bold flex items-center justify-center gap-2 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Application Successfully Submitted to {activeModalOpp.organization}!</span>
                </div>
              ) : (
                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setActiveModalOpp(null)}
                    className="w-1/3 py-2.5 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleApply(activeModalOpp.id)}
                    className="w-2/3 py-2.5 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-lg shadow-md transition-colors cursor-pointer"
                  >
                    Confirm & Submit Application
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
