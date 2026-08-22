'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  Clock, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Database,
  MessageSquare,
  Users,
  AlertCircle
} from 'lucide-react';
import { ASSESSMENT_TESTS, AssessmentTest } from '@/lib/assessmentTests';
import { useAppContext } from '@/context/AppContext';

export default function AssessmentPage() {
  const { submitAssessmentResult, studentProfile } = useAppContext();

  const [activeTest, setActiveTest] = useState<AssessmentTest | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartTest = (test: AssessmentTest) => {
    setActiveTest(test);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setTestResult(null);
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    setUserAnswers({ ...userAnswers, [questionId]: optionIndex });
  };

  const handleSubmitTest = async () => {
    if (!activeTest) return;
    setIsSubmitting(true);

    let correctCount = 0;
    const total = activeTest.questions.length;
    activeTest.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / total) * 100);
    const passedStatus = percentage >= 70 ? "Passed" : percentage >= 50 ? "Needs Improvement" : "Needs Improvement";

    // Submit score to backend API via AppContext
    await submitAssessmentResult({
      testId: activeTest.id,
      testTitle: activeTest.title,
      category: activeTest.category,
      score: correctCount,
      total,
      percentage,
      status: passedStatus,
    });

    setTestResult({
      testTitle: activeTest.title,
      skillTag: activeTest.skillTag,
      totalQuestions: total,
      correctCount,
      scorePercentage: percentage,
      status: passedStatus,
    });

    setIsSubmitting(false);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2': return Code2;
      case 'Database': return Database;
      case 'MessageSquare': return MessageSquare;
      case 'Users': return Users;
      default: return CheckSquare;
    }
  };

  return (
    <div className="py-12 bg-[#ADD8E6]/20 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-ayush-800 via-ayush-700 to-teal-800 rounded-2xl p-8 text-white shadow-md">
          <div className="flex items-center space-x-2 bg-amber-400/20 text-amber-200 text-xs px-3 py-1 rounded-full font-bold border border-amber-300/30 w-fit mb-3">
            <CheckSquare className="w-3.5 h-3.5 text-amber-300" />
            <span>Avsar AI Interactive Skill Assessment Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Technology & Soft-Skill Assessments</h1>
          <p className="text-sm text-slate-200 mt-2 max-w-2xl leading-relaxed">
            Take verified Python, SQL, Communication, and Teamwork skill evaluations. High test scores are automatically recorded on your Student Profile and boost your AI recommendation match score.
          </p>
        </div>

        {/* State 1: Active Quiz Mode */}
        {activeTest && !testResult && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-ayush-700 bg-ayush-50 px-2.5 py-1 rounded">
                  {activeTest.skillTag} • {activeTest.category.toUpperCase().replace('_', ' ')}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{activeTest.title}</h2>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-ayush-700" />
                <span>Question {currentQuestionIndex + 1} of {activeTest.questions.length}</span>
              </div>
            </div>

            {/* Current Question */}
            {(() => {
              const q = activeTest.questions[currentQuestionIndex];
              return (
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {currentQuestionIndex + 1}. {q.questionText}
                  </h3>

                  <div className="space-y-2.5 pt-2">
                    {q.options.map((optText, optIdx) => {
                      const isSelected = userAnswers[q.id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleOptionSelect(q.id, optIdx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-ayush-600 bg-ayush-50 text-ayush-900 font-bold shadow-xs'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span><strong className="mr-2 font-mono">{String.fromCharCode(65 + optIdx)}.</strong> {optText}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-ayush-700 bg-ayush-700 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <span className="text-[10px]">✓</span>}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Navigation buttons */}
            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
              >
                Previous Question
              </button>

              {currentQuestionIndex < activeTest.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  className="px-5 py-2.5 bg-ayush-700 text-white rounded-lg text-xs font-bold hover:bg-ayush-800 transition-colors cursor-pointer"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-md transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Evaluating Score...' : 'Submit & Record Score'}
                </button>
              )}
            </div>

          </div>
        )}

        {/* State 2: Assessment Results Screen */}
        {testResult && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6 text-center max-w-xl mx-auto">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center shadow-md ${
              testResult.scorePercentage >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assessment Result Recorded</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{testResult.testTitle}</h2>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-2">
              <div className="text-4xl font-black text-ayush-700">{testResult.scorePercentage}%</div>
              <div className="text-xs font-semibold text-slate-600">
                Score: {testResult.correctCount} / {testResult.totalQuestions} Questions Correct
              </div>
              <div className="text-xs text-emerald-600 font-bold pt-2 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Score Automatically Synced with Student Profile & AI Match Engine!</span>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => { setActiveTest(null); setTestResult(null); }}
                className="w-1/2 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Take Another Test
              </button>
              <Link
                href="/profile"
                className="w-1/2 py-2.5 bg-ayush-700 hover:bg-ayush-800 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>View Profile Scores</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Available Test Catalog */}
        {!activeTest && (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Select an Assessment to Begin</h2>
              <span className="text-xs text-slate-500 font-medium">Avsar AI Official Tests ({ASSESSMENT_TESTS.length})</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ASSESSMENT_TESTS.map((test) => {
                const IconComponent = getIcon(test.iconName);
                const hasTaken = (studentProfile?.assessmentScores || []).some((s) => s.testId === test.id);
                return (
                  <div key={test.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-ayush-400 transition-all space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="bg-ayush-100 text-ayush-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded">
                          {test.skillTag} • {test.category.toUpperCase().replace('_', ' ')}
                        </span>
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          {test.difficulty}
                        </span>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-ayush-700 text-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{test.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{test.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-slate-600 pt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{test.durationMinutes} Minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                          <span>{test.totalQuestions} Questions</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartTest(test)}
                      className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                        hasTaken
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-ayush-700 hover:bg-ayush-800 text-white'
                      }`}
                    >
                      <span>{hasTaken ? 'Retake Assessment Test' : 'Start Assessment Test'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
