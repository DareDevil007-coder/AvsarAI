'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';

export default function ResumeUploader() {
  const { user, studentProfile, updateProfile, refreshAllData } = useAppContext();

  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Interactive Skill Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      processResumeUpload(file);
    }
  };

  const processResumeUpload = async (file: File) => {
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      // Read text content from uploaded file for analysis
      const text = await file.text().catch(() => "");
      const currentUserId = user?.userId || "usr-student-001";

      const res = await fetch("/api/profile/upload-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          fileText: text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setExtractedSkills(data.extractedSkills || []);
        setReviewModalOpen(true);
        setUploadSuccess(true);
      }
    } catch (err) {
      console.error("Resume upload failed:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setExtractedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddCustomSkill = () => {
    if (newSkillInput.trim() && !extractedSkills.includes(newSkillInput.trim())) {
      setExtractedSkills((prev) => [...prev, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleConfirmAndSync = async () => {
    if (extractedSkills.length > 0) {
      const mergedSkills = Array.from(new Set([
        ...(studentProfile?.skills || []),
        ...extractedSkills,
      ]));
      await updateProfile({ skills: mergedSkills });
      await refreshAllData();
    }
    setReviewModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-xs space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-sky-100 text-ayush-700 border border-sky-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Resume Analysis & Automated Skill Extraction</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Upload your PDF/DOCX resume to automatically extract, parse, and verify your technical skills.
            </p>
          </div>
        </div>
        <span className="bg-sky-100 text-ayush-800 text-[10px] font-extrabold px-2.5 py-1 rounded border border-sky-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-sky-600" /> Avsar AI Engine
        </span>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-sky-300 hover:border-ayush-600 rounded-2xl p-6 bg-sky-50/40 text-center relative transition-all">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-2 pointer-events-none">
          <div className="w-12 h-12 rounded-2xl bg-white text-ayush-700 flex items-center justify-center shadow-xs border border-sky-200">
            <UploadCloud className="w-6 h-6" />
          </div>

          {isUploading ? (
            <div className="space-y-1">
              <div className="text-xs font-bold text-ayush-700 animate-pulse">
                Analyzing resume structure and extracting skill vectors...
              </div>
              <p className="text-[11px] text-slate-500">Please wait while Avsar AI parses your document.</p>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-slate-800">
                Drag & Drop your Resume or <span className="text-ayush-700 underline">Browse File</span>
              </div>
              <p className="text-[11px] text-slate-500">Supports PDF, DOCX, TXT (Max size 5MB)</p>
            </>
          )}
        </div>
      </div>

      {/* Status Bar */}
      {studentProfile?.resumeFileName && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 flex justify-between items-center text-xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold text-slate-800">
              Active Resume: <strong className="text-emerald-900">{studentProfile.resumeFileName}</strong> ({studentProfile.resumeFileSize || "1.2 MB"})
            </span>
          </div>
          <button
            onClick={() => {
              setExtractedSkills(studentProfile.skills || ["Python", "SQL", "React", "Data Analytics"]);
              setReviewModalOpen(true);
            }}
            className="text-xs font-bold text-ayush-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Review Extracted Skills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Review & Confirmation Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 bg-sky-100 text-ayush-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded border border-sky-300">
                <Sparkles className="w-3 h-3 text-sky-600" />
                <span>AI Skill Extraction Verification</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">Extracted Skills Review</h3>
              <p className="text-xs text-slate-600">
                Verify the skills detected from your uploaded resume. You can add or remove skills before merging them into your live Avsar AI profile.
              </p>
            </div>

            {/* Skill Tags Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Detected Skill Vectors ({extractedSkills.length})</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-sky-50/50 rounded-xl border border-sky-200">
                {extractedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 bg-white text-ayush-800 text-xs px-3 py-1 rounded-lg font-bold border border-sky-300 shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Custom Skill Input */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Add Additional Skill Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. AWS, Docker, PyTorch"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                  className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-ayush-600 focus:outline-none"
                />
                <button
                  onClick={handleAddCustomSkill}
                  className="px-4 py-2.5 bg-sky-100 hover:bg-sky-200 text-ayush-800 font-bold text-xs rounded-xl border border-sky-300 cursor-pointer"
                >
                  Add Tag
                </button>
              </div>
            </div>

            {/* Confirmation CTA */}
            <div className="pt-3 border-t border-slate-100 flex space-x-3">
              <button
                onClick={() => setReviewModalOpen(false)}
                className="w-1/3 py-2.5 border border-slate-300 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAndSync}
                className="w-2/3 py-2.5 bg-ayush-700 hover:bg-ayush-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Sync Profile</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
