import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, UserCheck, Cpu, Building2, Briefcase, CheckCircle2 } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ADD8E6]/40 via-[#ADD8E6]/20 to-sky-100/50 border-b border-sky-300/60 py-16 lg:py-24">
      
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0d47a110_1px,transparent_1px),linear-gradient(to_bottom,#0d47a110_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 bg-white/90 border border-sky-300 text-ayush-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Avsar AI Personalized Recommendation Engine</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Find Your Perfect <span className="text-ayush-700 underline decoration-sky-400 decoration-wavy decoration-2">Internship Match</span> with Avsar AI
            </h1>

            <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Discover tailored internship recommendations that match your technical skills, degree background, and career preferences efficiently and effectively.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/internships"
                className="w-full sm:w-auto bg-ayush-700 hover:bg-ayush-800 text-white font-bold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <span>Get Recommendations</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/assessment"
                className="w-full sm:w-auto bg-white hover:bg-sky-50 text-slate-800 font-bold px-6 py-3.5 rounded-xl border border-sky-300 hover:border-ayush-600 transition-all flex items-center justify-center space-x-2 text-sm cursor-pointer"
              >
                <span>Take Skill Test</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-sky-300/60 grid grid-cols-3 gap-4 text-xs text-slate-800 font-semibold">
              <div className="flex items-center space-x-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0" />
                <span>Personalized AI Matches</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0" />
                <span>Efficient Skill Mapping</span>
              </div>
              <div className="flex items-center space-x-1.5 justify-center lg:justify-start">
                <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0" />
                <span>Direct Applications</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Process Flow Diagram */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur p-6 sm:p-8 rounded-2xl border border-sky-200 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-ayush-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" /> AI Recommendation Flow
                </span>
                <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold border border-sky-300">
                  Avsar AI Engine
                </span>
              </div>

              {/* Process Sequence Cards */}
              <div className="space-y-3 relative">
                
                {/* Connecting Line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-ayush-700 via-sky-500 to-teal-600 z-0" />

                {/* Step 1 */}
                <div className="relative z-10 flex items-center space-x-3 bg-sky-50/80 p-3 rounded-xl border border-sky-200">
                  <div className="w-8 h-8 rounded-lg bg-ayush-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">1. Input Profile & Skills</h4>
                    <p className="text-[11px] text-slate-600">Provide academic credentials and test scores</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex items-center space-x-3 bg-sky-100/90 p-3 rounded-xl border border-sky-300">
                  <div className="w-8 h-8 rounded-lg bg-sky-700 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-sky-900">2. Avsar AI Matching</h4>
                    <p className="text-[11px] text-sky-800">Compute match score against requirements</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex items-center space-x-3 bg-sky-50/80 p-3 rounded-xl border border-sky-200">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">3. Evaluate Fit & Skill Gaps</h4>
                    <p className="text-[11px] text-slate-600">Identify matching and missing competencies</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex items-center space-x-3 bg-sky-50/80 p-3 rounded-xl border border-sky-200">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center flex-shrink-0 shadow-sm font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">4. Instant Applications</h4>
                    <p className="text-[11px] text-slate-600">Apply to matching internships in one click</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
