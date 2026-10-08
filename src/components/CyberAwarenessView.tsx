import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { AwarenessModule, QuizQuestion, User } from '../types';
import { api } from '../lib/api';

interface CyberAwarenessViewProps {
  currentUser: User | null;
  modules: AwarenessModule[];
  onRefreshModules: () => void;
  onRefreshDashboard: () => void;
}

export const CyberAwarenessView: React.FC<CyberAwarenessViewProps> = ({
  currentUser,
  modules,
  onRefreshModules,
  onRefreshDashboard,
}) => {
  const [selectedModule, setSelectedModule] = useState<AwarenessModule | null>(null);
  const [activeQuizModule, setActiveQuizModule] = useState<AwarenessModule | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [quizResult, setQuizResult] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    correctAnswers: Record<string, string>;
    newScore?: number;
  } | null>(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);

  const completedCount = modules.filter((m) => m.isCompleted).length;
  const progressPercent = Math.round((completedCount / (modules.length || 1)) * 100);

  const handleStartQuiz = (mod: AwarenessModule) => {
    setActiveQuizModule(mod);
    setQuizAnswers({});
    setQuizResult(null);
  };

  const handleAnswerSelect = (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuizModule) return;
    setIsSubmittingQuiz(true);

    try {
      const res = await api.awareness.submitQuiz(activeQuizModule.id, quizAnswers);
      setQuizResult({
        score: res.score,
        total: res.totalQuestions,
        percentage: res.percentage,
        passed: res.passed,
        correctAnswers: res.correctAnswers,
        newScore: res.newSecurityScore,
      });
      onRefreshModules();
      onRefreshDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz.');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cyber Awareness & Employee Training Center
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-semibold">
              <Award className="w-3 h-3" />
              {completedCount} / {modules.length} Completed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Build defense-in-depth through human awareness. Complete certified security training modules to improve your personal and organizational security score.
          </p>
        </div>

        {/* Progress Bar Header */}
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block font-mono">
              Overall Progress
            </span>
            <span className="text-sm font-bold font-mono text-white">{progressPercent}%</span>
          </div>
          <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of 8 Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {modules.map((mod) => {
          const isDone = mod.isCompleted;
          return (
            <div
              key={mod.id}
              className={`bg-slate-900/90 border rounded-xl p-5 flex flex-col justify-between transition-all hover:border-slate-700 ${
                isDone ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    Module 0{mod.moduleNumber}
                  </span>
                  {isDone ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Passed ({mod.userScore}%)
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {mod.durationMinutes} min
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-100 line-clamp-2 mb-2 leading-snug">
                  {mod.title}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedModule(mod)}
                  className="text-xs text-slate-300 hover:text-white flex items-center gap-1 font-medium"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  Read Material
                </button>

                <button
                  onClick={() => handleStartQuiz(mod)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                    isDone
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                  }`}
                >
                  {isDone ? 'Retake Quiz' : 'Take Quiz'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Content Reader Modal / Drawer */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-400">
                  Module 0{selectedModule.moduleNumber} · {selectedModule.category}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedModule.title}</h3>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {/* Key Takeaways */}
            <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-lg p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                Key Learning Objectives:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedModule.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">›</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Deep Educational Material */}
            <div className="text-xs text-slate-300 space-y-3 leading-relaxed font-sans">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Comprehensive Training Lesson:
              </h4>
              <p className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 leading-relaxed text-slate-200">
                {selectedModule.learningContent}
              </p>
            </div>

            {/* Reference Resources */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Industry Standards & External Guidance:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedModule.resourceLinks.map((link, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                    {link}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedModule(null)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Back to Modules
              </button>
              <button
                onClick={() => {
                  const mod = selectedModule;
                  setSelectedModule(null);
                  handleStartQuiz(mod);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Proceed to Module Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Quiz Modal */}
      {activeQuizModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                  Knowledge Evaluation · Module 0{activeQuizModule.moduleNumber}
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">{activeQuizModule.title}</h3>
              </div>
              <button
                onClick={() => setActiveQuizModule(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {/* If Quiz Completed Result */}
            {quizResult ? (
              <div className="space-y-4 text-xs">
                <div
                  className={`p-4 rounded-xl border text-center space-y-2 ${
                    quizResult.passed
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                  }`}
                >
                  <div className="text-2xl font-bold font-mono">
                    {quizResult.score} / {quizResult.total} ({quizResult.percentage}%)
                  </div>
                  <p className="font-semibold text-sm">
                    {quizResult.passed
                      ? '🎉 Congratulations! You passed the security evaluation.'
                      : '⚠️ Score below passing grade (66%). Please review the answers and retry.'}
                  </p>
                  {quizResult.newScore && (
                    <p className="text-xs text-slate-300">
                      Updated Personal Security Score: <span className="font-mono font-bold text-white">{quizResult.newScore} / 100</span>
                    </p>
                  )}
                </div>

                {/* Review Questions & Explanations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Question Analysis & Correct Answers:
                  </h4>
                  {activeQuizModule.questions.map((q, idx) => {
                    const userAnswer = quizAnswers[q.id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`p-3.5 rounded-lg border text-xs space-y-2 ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-red-950/20 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-200">
                            {idx + 1}. {q.question}
                          </span>
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isCorrect
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="text-slate-400 font-mono text-[11px]">
                          Your answer: <span className="text-white font-bold">{userAnswer || 'None'}</span> · Correct answer: <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                        </div>

                        <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800">
                          <span className="font-semibold text-slate-400 block mb-0.5">Explanation:</span>
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setQuizResult(null);
                      setQuizAnswers({});
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium"
                  >
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setActiveQuizModule(null)}
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz In-Progress Form */
              <div className="space-y-4 text-xs">
                {activeQuizModule.questions.map((q, qIdx) => (
                  <div key={q.id} className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800 space-y-2">
                    <p className="font-semibold text-slate-200 leading-snug">
                      <span className="font-mono text-indigo-400 mr-1.5">Q{qIdx + 1}:</span>
                      {q.question}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const isSelected = quizAnswers[q.id] === optKey;
                        return (
                          <button
                            key={optKey}
                            type="button"
                            onClick={() => handleAnswerSelect(q.id, optKey)}
                            className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2.5 border ${
                              isSelected
                                ? 'bg-indigo-600/20 border-indigo-500/50 text-white font-medium'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0 ${
                                isSelected
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {optKey}
                            </span>
                            <span className="leading-snug">{q.options[optKey]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Answered {Object.keys(quizAnswers).length} of {activeQuizModule.questions.length} questions
                  </span>

                  <button
                    onClick={handleSubmitQuiz}
                    disabled={
                      isSubmittingQuiz ||
                      Object.keys(quizAnswers).length < activeQuizModule.questions.length
                    }
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm"
                  >
                    {isSubmittingQuiz ? 'Grading Answers...' : 'Submit Evaluation'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
