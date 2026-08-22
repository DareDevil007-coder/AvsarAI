'use client';

import React, { useMemo } from 'react';
import HeroSection from '@/components/HeroSection';
import StatsSection from '@/components/StatsSection';
import WorkflowSection from '@/components/WorkflowSection';
import StudentOutreachBanner from '@/components/StudentOutreachBanner';
import Link from 'next/link';
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  ArrowRight, 
  ShieldCheck
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function HomePage() {
  const { internships, getRecommendations } = useAppContext();

  const featuredOpportunities = useMemo(() => {
    const recs = getRecommendations();
    if (recs.length > 0) {
      return recs.slice(0, 3);
    }
    return internships.slice(0, 3).map((item) => ({
      ...item,
      match: { matchScore: 85, isEligible: true, personalizedReason: "Recommended role" },
    }));
  }, [internships, getRecommendations]);

  return (
    <div className="space-y-0">
      
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Live Stats Section */}
      <StatsSection />

      {/* 3. Workflow Section */}
      <WorkflowSection />

      {/* 4. Student Outreach Banner */}
      <StudentOutreachBanner />

      {/* 5. Featured Opportunities */}
      <section className="py-16 bg-[#ADD8E6]/20 border-b border-sky-300/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-ayush-700">
                Curated Hiring Drives • {internships.length} Database Positions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Internships</h2>
            </div>
            <Link
              href="/internships"
              className="bg-ayush-700 hover:bg-ayush-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors mt-3 md:mt-0"
            >
              Browse All Internships ({internships.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                      {opp.domain || 'General Industry'}
                    </span>
                    <span className="bg-ayush-50 text-ayush-800 text-[10px] font-extrabold px-2 py-0.5 rounded border border-ayush-200">
                      {opp.match?.matchScore ?? 85}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1 line-clamp-1">{opp.title}</h3>
                  <div className="flex items-center text-xs text-slate-600 space-x-1 mb-3">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{opp.organization}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="font-semibold text-emerald-700">
                      {opp.stipend}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Avsar AI Verified
                  </span>
                  <Link
                    href={`/internships?id=${opp.id}`}
                    className="text-xs font-semibold text-ayush-700 hover:underline flex items-center gap-1"
                  >
                    <span>Apply Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Callout Banner */}
      <section className="py-14 bg-gradient-to-r from-ayush-800 to-ayush-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Avsar AI Skill Diagnostics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold">Unsure about your job readiness?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Use our AI engine to benchmark your technical and soft skills against top industry requirements in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/skill-mapping"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold text-sm px-6 py-3 rounded-lg shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Run Avsar AI Skill Mapping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
