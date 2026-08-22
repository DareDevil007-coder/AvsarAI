'use client';

import React from 'react';
import { Users, GraduationCap, Building, Briefcase, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const chartData = [
  { category: 'Software Dev', students: 4200, internships: 380 },
  { category: 'Data Science', students: 3100, internships: 290 },
  { category: 'Cloud & DevOps', students: 2800, internships: 270 },
  { category: 'Data Analytics', students: 2100, internships: 210 },
  { category: 'AI & ML', students: 1300, internships: 150 },
];

export default function StatsSection() {
  const stats = [
    { label: 'Active Candidates', value: '12,500+', icon: Users, change: '+14% this quarter', color: 'text-sky-700 bg-sky-100 border-sky-300' },
    { label: 'Partner Institutions', value: '350+', icon: GraduationCap, change: 'Accredited Colleges', color: 'text-ayush-700 bg-sky-100 border-sky-300' },
    { label: 'Industry Opportunities', value: '1,200+', icon: Building, change: 'Tech Companies & Labs', color: 'text-teal-700 bg-sky-100 border-sky-300' },
    { label: 'Internship Placements', value: '850+', icon: Briefcase, change: '92% completion rate', color: 'text-indigo-700 bg-sky-100 border-sky-300' },
  ];

  return (
    <section className="py-16 bg-[#ADD8E6]/30 border-b border-sky-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-ayush-700 mb-2">Live Portal Statistics</h2>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900">Avsar AI Metric Overview</p>
          <p className="text-sm text-slate-600 mt-2 font-medium">Real-time data synchronization across colleges and industry partners.</p>
        </div>

        {/* 4 Dashboard Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/95 p-6 rounded-2xl border border-sky-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl border ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-sky-700" /> {item.change}
                  </span>
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{item.value}</div>
                <div className="text-xs font-bold text-slate-700">{item.label}</div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
