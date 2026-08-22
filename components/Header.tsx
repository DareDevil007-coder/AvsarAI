'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  User, 
  Sparkles, 
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  LogOut
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, studentProfile, logout } = useAppContext();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Student Profile & Progress', href: '/profile' },
    { name: 'AI Matches', href: '/ai-matches', badge: 'New' },
    { name: 'Skill Mapping', href: '/skill-mapping', badge: 'AI' },
    { name: 'Take Assessment', href: '/assessment', highlight: true },
    { name: 'Internships', href: '/internships' },
    { name: 'Company Recruiter Portal', href: '/company' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-900/10 shadow-sm">
      {/* Top Banner - Avsar AI Platform Bar */}
      <div className="bg-ayush-800 text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Avsar AI • Intelligent Internship Recommendation Engine</span>
        </div>
        <div className="hidden sm:flex items-center space-x-4 text-emerald-100">
          <span className="hover:underline cursor-pointer">Skip to main content</span>
          <span>|</span>
          <span className="font-semibold text-emerald-300">
            {user ? `Logged in as: ${user.name} (${user.role.toUpperCase()})` : 'Avsar AI Engine v2.0'}
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-2">
          
          {/* Logo & Brand Name */}
          <Link href="/" className="flex items-center space-x-2.5 group flex-shrink-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shadow-md border border-slate-200 bg-white">
              <img src="/logo.jpg" alt="Avsar AI Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">Avsar AI</span>
                <span className="bg-emerald-100 text-ayush-800 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" /> Portal
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden xl:inline">
                Intelligent Internship Engine
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1 whitespace-nowrap ${
                    link.highlight
                      ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                      : isActive
                      ? 'bg-ayush-50 text-ayush-700 border-b-2 border-ayush-600 font-bold'
                      : 'text-slate-700 hover:text-ayush-700 hover:bg-slate-50'
                  }`}
                >
                  {link.highlight && <CheckSquare className="w-3 h-3 text-amber-600" />}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="bg-emerald-600 text-white text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Action Buttons: Login | Register or Logged in User Profile */}
          <div className="hidden sm:flex items-center space-x-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    pathname === '/profile'
                      ? 'bg-ayush-700 text-white border-ayush-800'
                      : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{user.name?.split(" ")[0] || "Profile"}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-slate-700 hover:text-ayush-700 px-3.5 py-2 rounded-lg text-xs font-bold border border-slate-300 hover:border-ayush-400 bg-white transition-colors shadow-2xs cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-ayush-700 hover:bg-ayush-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center space-x-1 cursor-pointer"
                >
                  <span>Register</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:text-ayush-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-md text-sm font-medium ${
                pathname === link.href
                  ? 'bg-ayush-50 text-ayush-700 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
                    {link.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
          {!user && (
            <div className="pt-4 border-t border-slate-100 flex items-center space-x-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-lg text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-1/2 text-center py-2.5 bg-ayush-700 text-white font-semibold rounded-lg text-sm"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
