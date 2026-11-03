import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { Navbar } from '../components/Navbar.js';
import { ReviewedQuestion, QuizAttemptStartResponse } from '../types.js';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  PlusCircle,
  Lightbulb,
  Sparkles,
  BarChart3,
  BookOpen,
  Check,
  AlertTriangle,
} from 'lucide-react';

export const QuizReview: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<ReviewedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReattempting, setIsReattempting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');

  useEffect(() => {
    if (!attemptId) {
      navigate('/dashboard');
      return;
    }

    const loadReview = async () => {
      // 1. Check if freshly submitted review is in sessionStorage
      const cached = sessionStorage.getItem(`review_${attemptId}`);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setAttempt(parsed);
          setQuestions(parsed.questions || []);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error(e);
        }
      }

      // 2. Otherwise fetch from API
      try {
        const res = await api.get<{ attempt: any; questions: ReviewedQuestion[] }>(
          `/quiz/review/${attemptId}`
        );
        setAttempt(res.data.attempt);
        setQuestions(res.data.questions);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load quiz results');
      } finally {
        setIsLoading(false);
      }
    };

    loadReview();
  }, [attemptId, navigate]);

  const handleReattempt = async () => {
    if (!attemptId) return;
    setIsReattempting(true);

    try {
      const res = await api.post<QuizAttemptStartResponse>(`/quiz/reattempt/${attemptId}`);
      sessionStorage.setItem(`quiz_${res.data.attempt_id}`, JSON.stringify(res.data));
      navigate(`/quiz/${res.data.attempt_id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initiate reattempt');
      setIsReattempting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-rose-400 mb-4">{error || 'Review data not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-800 text-white font-medium"
          >
            Return to Dashboard
          </button>
        </main>
      </div>
    );
  }

  const score = attempt.score ?? 0;
  const total = attempt.total_questions ?? questions.length;
  const percentage = attempt.percentage ?? Math.round((score / total) * 100);
  const incorrectCount = total - score;

  const getGradeBadge = (pct: number) => {
    if (pct >= 80) return { label: 'Outstanding!', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (pct >= 50) return { label: 'Good Effort!', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Needs Practice', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const grade = getGradeBadge(percentage);

  // Filter questions based on student selection
  const filteredQuestions = questions.filter((q) => {
    if (filterMode === 'incorrect') return !q.is_correct;
    if (filterMode === 'correct') return q.is_correct;
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Summary Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-3 ${grade.color}`}>
                <Sparkles className="w-3.5 h-3.5" /> {grade.label}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Quiz Results: {attempt.subject}
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Difficulty: <strong className="text-slate-200 capitalize">{attempt.difficulty}</strong>
                {attempt.is_reattempt && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Reattempt
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                  {score}/{total}
                </div>
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mt-1">
                  Correct Score
                </div>
              </div>
              <div className="w-px h-12 bg-slate-800"></div>
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-white">
                  {percentage}%
                </div>
                <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider mt-1">
                  Accuracy
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-8 pt-6 border-t border-slate-800/80">
            <button
              type="button"
              disabled={isReattempting}
              onClick={handleReattempt}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition shadow-lg shadow-blue-600/20 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {isReattempting ? 'Preparing Reattempt...' : 'Reattempt Exact Quiz'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Take Another Quiz
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-300 font-semibold text-sm transition cursor-pointer ml-auto"
            >
              <BarChart3 className="w-4 h-4" />
              View Full History
            </button>
          </div>
        </div>

        {/* Learning Hub Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Step-by-Step Solutions & Explanations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Review correct answers, clear conceptual logic, and key takeaways for each question.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({total})
            </button>

            <button
              onClick={() => setFilterMode('incorrect')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterMode === 'incorrect'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Incorrect ({incorrectCount})
            </button>

            <button
              onClick={() => setFilterMode('correct')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterMode === 'correct'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Correct ({score})
            </button>
          </div>
        </div>

        {/* Detailed Solutions List */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/40 border border-slate-800 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-200">No questions in this filter.</p>
              <button
                onClick={() => setFilterMode('all')}
                className="mt-3 text-xs text-emerald-400 hover:underline"
              >
                View all questions
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isCorrect = q.is_correct;
              const hasAnswered = q.selected_option !== null && q.selected_option !== undefined;
              const correctLetter = optionLetters[q.correct_option];
              const correctText = q.options[q.correct_option];
              const userLetter = hasAnswered ? optionLetters[q.selected_option!] : null;

              return (
                <div
                  key={q.position}
                  className={`bg-slate-900/70 border rounded-2xl p-6 sm:p-7 shadow-xl transition ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-gradient-to-b from-emerald-950/10 to-slate-900/60'
                      : 'border-rose-500/30 bg-gradient-to-b from-rose-950/10 to-slate-900/60'
                  }`}
                >
                  {/* Question Header & Status Badge */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                      Question {q.position} of {total}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${
                        isCorrect
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct (+1)
                        </>
                      ) : hasAnswered ? (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" /> Incorrect (Selected Option {userLetter})
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-400" /> Skipped / Unanswered
                        </>
                      )}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">
                    {q.question_text}
                  </h3>

                  {/* 4 Options Grid */}
                  <div className="space-y-2.5 mb-6">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = q.selected_option === optIdx;
                      const isTheCorrectOption = q.correct_option === optIdx;

                      let cardStyle = 'bg-slate-950/40 border-slate-800/80 text-slate-400';
                      let badgeStyle = 'bg-slate-900 text-slate-400 border-slate-800';

                      if (isTheCorrectOption) {
                        cardStyle = 'bg-emerald-500/15 border-emerald-500 text-emerald-100 font-semibold shadow-sm shadow-emerald-500/10';
                        badgeStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold';
                      } else if (isSelected && !isTheCorrectOption) {
                        cardStyle = 'bg-rose-500/15 border-rose-500/80 text-rose-200 line-through';
                        badgeStyle = 'bg-rose-500 text-white border-rose-400 font-extrabold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-3.5 rounded-xl border flex items-center gap-3 text-sm transition ${cardStyle}`}
                        >
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 border ${badgeStyle}`}>
                            {optionLetters[optIdx]}
                          </span>
                          <span className="flex-1">{opt}</span>
                          {isTheCorrectOption && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                              <Check className="w-3.5 h-3.5" /> Correct Answer
                            </span>
                          )}
                          {isSelected && !isTheCorrectOption && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 px-2.5 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/30">
                              <XCircle className="w-3.5 h-3.5" /> Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* PROPER EASY SOLUTION BOX */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 shadow-inner">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-sm text-emerald-400 uppercase tracking-wider">
                        Proper Solution & Concept Explanation
                      </span>
                    </div>

                    {/* Direct Answer Summary */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 mb-3 text-xs sm:text-sm">
                      <div className="text-slate-400">
                        Correct Answer:{' '}
                        <strong className="text-emerald-400">
                          Option {correctLetter}: {correctText}
                        </strong>
                      </div>
                      {!isCorrect && hasAnswered && (
                        <div className="mt-1 text-rose-400/90 text-xs">
                          Your Answer: Option {userLetter} ({q.options[q.selected_option!]}) was incorrect.
                        </div>
                      )}
                    </div>

                    {/* Step-by-Step Reason */}
                    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-2">
                      <div>
                        <strong className="text-slate-200">Why it's correct: </strong>
                        <span>
                          {q.explanation ||
                            `Option ${correctLetter} correctly represents the established principle for this question.`}
                        </span>
                      </div>

                      {/* Easy Concept Takeaway */}
                      <div className="pt-2 border-t border-slate-800/60 flex items-start gap-2 text-xs text-slate-400">
                        <span className="text-emerald-400 font-semibold shrink-0">💡 Key Takeaway:</span>
                        <span>
                          Remember that in <strong>{attempt.subject}</strong>,{' '}
                          {correctText.length < 50
                            ? `"${correctText}" is the core defining rule.`
                            : 'always verify the foundational definition and rule scope.'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
