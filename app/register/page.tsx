'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, GraduationCap, ChevronRight, AlertCircle } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAppContext();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    const result = await registerUser(name, email, password, institution);
    setIsLoading(false);

    if (result.success) {
      router.push('/profile');
    } else {
      setErrorMsg(result.error || "Registration failed. Please check your inputs.");
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full px-4">
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-ayush-700 text-white rounded-xl mx-auto flex items-center justify-center font-bold text-xl shadow-md">
              AAI
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Your Account</h1>
            <p className="text-xs text-slate-500">Join the Avsar AI Skill & Opportunity Portal</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ayush-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-ayush-600 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / Institute Name</label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. University School of Healthcare"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
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
                  placeholder="At least 8 characters"
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
              <span>{isLoading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{' '}
            <Link href="/login" className="text-ayush-700 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
