import React from 'react';
import { ShieldCheck, Target, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 bg-[#ADD8E6]/20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/90 text-ayush-800 text-xs px-3.5 py-1.5 rounded-full font-bold border border-sky-300">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Avsar AI Intelligent Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            About Avsar AI
          </h1>
          <p className="text-base text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            Bridging the gap between academic education, technology skill diagnostics, and modern industry internship demands across India.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/95 p-8 rounded-2xl border border-sky-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-ayush-700 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              To empower every student with AI-driven skill mapping, transparent internship access, and verified career pathways.
            </p>
          </div>

          <div className="bg-white/95 p-8 rounded-2xl border border-sky-200 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-sky-600 text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Avsar AI Skill Engine</h2>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Avsar AI provides real-time competency diagnostics by benchmarking student skills against standard technical curriculum guidelines and live industry requirements.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
