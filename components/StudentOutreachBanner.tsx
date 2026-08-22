import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Briefcase, 
  Users, 
  BookOpen, 
  Rocket, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

export default function StudentOutreachBanner() {
  const pillars = [
    {
      title: 'Hands-on Internships',
      desc: 'Work alongside leading software engineers, data scientists, and technology pioneers on real-world projects.',
      icon: Briefcase,
      badge: 'Stipend Backed',
      color: 'bg-sky-100 text-sky-800 border-sky-300'
    },
    {
      title: '1-on-1 Expert Mentorship',
      desc: 'Gain direct guidance from senior industry leaders to refine your technical architecture and portfolio.',
      icon: Users,
      badge: 'Expert Led',
      color: 'bg-ayush-50 text-ayush-800 border-ayush-200'
    },
    {
      title: 'Specialized Skill Workshops',
      desc: 'Master advanced Python, SQL, React, Cloud DevOps, and Data Analytics.',
      icon: BookOpen,
      badge: 'Certified',
      color: 'bg-teal-50 text-teal-800 border-teal-200'
    },
    {
      title: 'Direct Placement Pathways',
      desc: 'Convert your traineeship into a full-time software engineer or data analyst role with top recruiters.',
      icon: Rocket,
      badge: 'Fast Track',
      color: 'bg-amber-50 text-amber-900 border-amber-200'
    }
  ];

  return (
    <section className="py-16 bg-[#ADD8E6]/40 border-y border-sky-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container Box */}
        <div className="bg-white/95 rounded-3xl border border-sky-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Column: Inspiring Banner Message */}
            <div className="lg:col-span-5 bg-gradient-to-br from-ayush-800 via-ayush-700 to-sky-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
              
              {/* Background Glow Overlay */}
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                
                <div className="inline-flex items-center space-x-2 bg-sky-400/20 text-sky-200 text-xs px-3.5 py-1.5 rounded-full font-bold border border-sky-300/30">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Student Career Acceleration</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
                  Shape the Future of Technology With Avsar AI
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  Your academic journey is just the beginning. We’re passionate about nurturing the next generation of tech innovators by providing the mentorship, practical experience, and tools you need to thrive.
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-sky-200 font-medium">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300" />
                    <span>Access verified technology traineeships</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300" />
                    <span>Benchmark your skills with Avsar AI diagnostics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-300" />
                    <span>Connect directly with industry leaders</span>
                  </div>
                </div>

              </div>

              {/* Bottom CTA Button */}
              <div className="relative z-10 pt-8 mt-6">
                <Link
                  href="/register"
                  className="w-full bg-sky-400 hover:bg-sky-500 text-slate-900 font-extrabold text-xs py-3.5 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  <span>Launch Your Career Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>

            {/* Right Column: 4 Opportunity Pillars */}
            <div className="lg:col-span-7 p-8 sm:p-10 space-y-6 flex flex-col justify-between">
              
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-ayush-700">What We Offer You</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Empowering Your Growth at Every Step</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pillars.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-sky-50/60 border border-sky-200 hover:border-ayush-400 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-9 h-9 rounded-xl bg-white text-ayush-700 flex items-center justify-center shadow-xs border border-sky-200 font-bold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${item.color}`}>
                          {item.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-xs mb-1">{item.title}</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Secondary Callout Footer */}
              <div className="p-4 rounded-2xl bg-sky-100/80 border border-sky-300 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-5 h-5 text-ayush-700 flex-shrink-0" />
                  <span className="text-xs text-slate-800 font-semibold">
                    Ready to bridge your academic skills with industry opportunities?
                  </span>
                </div>
                <Link
                  href="/internships"
                  className="text-xs font-bold text-ayush-700 hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
                >
                  <span>Explore Internships</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
