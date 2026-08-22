'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ChevronRight, Building2, User } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppContext();

  const [role, setRole] = useState<'student' | 'company'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    const success = await login(email, role, password);
    setIsLoading(false);

    if (success) {
      if (role === 'company') {
        router.push('/company');
      } else {
        router.push('/profile');
      }
    } else {
      setErrorMsg('Login failed. Please check your credentials or try guest account.');
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full px-4">
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ayush-700 text-white rounded-xl mx-auto flex items-center justify-center font-bold text-xl shadow-md">
              AAI
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Avsar AI Portal Login</h1>
            <p className="text-xs text-slate-500">Access your Student or Recruiter Portal</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setRole('student'); setEmail(''); }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'student' ? 'bg-white text-ayush-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Student Portal</span>
            </button>

            <button
              type="button"
              onClick={() => { setRole('company'); setEmail('hr@tcs.com'); }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'company' ? 'bg-white text-ayush-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recruiter Portal</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder={role === 'student' ? 'student@example.com' : 'hr@tcs.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ayush-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ayush-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating...' : `Sign In to ${role === 'student' ? 'Student' : 'Recruiter'} Portal`}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-ayush-700 font-bold hover:underline">
              Register Now
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
