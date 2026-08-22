import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-ayush-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-slate-800">
          
          {/* Col 1: Portal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-ayush-600 text-white rounded flex items-center justify-center font-bold text-lg">
                AAI
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Avsar AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Platform for Skill Mapping, Competency Diagnostics, and Internship Discovery powered by Avsar AI.
            </p>
            <div className="flex items-center space-x-2 text-xs text-sky-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Avsar AI Verified Platform</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Key Modules</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/skill-mapping" className="hover:text-sky-400 transition-colors">Skill Mapping Engine</Link></li>
              <li><Link href="/assessment" className="hover:text-sky-400 transition-colors">Take Assessment Test</Link></li>
              <li><Link href="/internships" className="hover:text-sky-400 transition-colors">Internships Portal</Link></li>
              <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Avsar AI</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Support */}
          <div>
            <h3 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">Support & Contact</h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span>Avsar AI Technology Innovation Hub, New Delhi - 110001</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Toll Free Support: 1800-200-AVSAR</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>support@avsar.ai</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 pt-4">
          <p>© {new Date().getFullYear()} Avsar AI Platform. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
