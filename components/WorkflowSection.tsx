import React from 'react';
import { UserPlus, Target, Search, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WorkflowSection() {
  const steps = [
    {
      num: '01',
      title: 'Create Profile',
      desc: 'Students create their verified academic and professional profile.',
      icon: UserPlus,
      color: 'border-sky-500 bg-sky-100 text-sky-800'
    },
    {
      num: '02',
      title: 'Map Your Skills',
      desc: 'Avsar AI identifies technical skills and highlights potential skill gaps.',
      icon: Target,
      color: 'border-ayush-600 bg-sky-100 text-ayush-700'
    },
    {
      num: '03',
      title: 'Discover Opportunities',
      desc: 'Students receive AI-matched internship opportunities aligned with their career goals.',
      icon: Search,
      color: 'border-teal-500 bg-sky-100 text-teal-700'
    },
    {
      num: '04',
      title: 'Connect & Apply',
      desc: 'Students apply directly to organization partners, tracking application milestones in real-time.',
      icon: Send,
      color: 'border-slate-700 bg-slate-100 text-slate-800'
    }
  ];

  return (
    <section className="py-20 bg-[#ADD8E6]/20 border-b border-sky-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-ayush-700 mb-2">Step-by-Step Pathway</h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">How Avsar AI Works</p>
          <p className="text-sm text-slate-700 mt-2 font-medium">A streamlined 4-step workflow connecting candidates to career success.</p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white/95 p-6 rounded-2xl border border-sky-200 shadow-sm hover:shadow-md transition-all relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-sky-400 font-mono tracking-tighter">
                      {step.num}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-ayush-700">
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/skill-mapping"
            className="inline-flex items-center space-x-2 bg-ayush-700 hover:bg-ayush-800 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <span>Start Your Skill Mapping Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
