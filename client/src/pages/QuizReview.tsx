import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api.js';
import { Navbar } from '../components/Navbar.js';
import { ReviewedQuestion, QuizAttemptStartResponse } from '../types.js';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  PlusCircle,
  Lightbulb,
  Sparkles,
  BarChart3
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

      try {
        const res = await api.get<{ attempt: any; questions: ReviewedQuestion[] }>(
          `/quiz/review/${attemptId}`
        );
        setAttempt(res.data.attempt);
        setQuestions(res.data.questions);
      } catch (err: any) {
        setError(getErrorMessage(err, 'Failed to load quiz results'));
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
      setError(getErrorMessage(err, 'Failed to initiate reattempt'));
      setIsReattempting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-rose-500 dark:text-rose-400 mb-4">{error || 'Review data not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium shadow-sm"
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

  const getGradeBadge = (pct: number) => {
    if (pct >= 80) return { label: 'Outstanding!', color: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20' };
    if (pct >= 50) return { label: 'Good Effort!', color: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' };
    return { label: 'Needs Practice', color: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20' };
  };

  const grade = getGradeBadge(percentage);

  const filteredQuestions = questions.filter((q) => {
    if (filterMode === 'incorrect') return !q.is_correct;
    if (filterMode === 'correct') return q.is_correct;
    return true;
  });

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Score Summary Banner */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm mb-6 sm:mb-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-3 ${grade.color}`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> {grade.label}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Results: {attempt.subject}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Difficulty: <strong className="text-slate-800 dark:text-slate-200 capitalize">{attempt.difficulty}</strong>
                {attempt.is_reattempt && (
                  <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                    Reattempt
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">
                  {score}/{total}
                </div>
                <div className="text-[11px] sm:text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mt-1">
                  Correct Score
                </div>
              </div>
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800"></div>
              <div className="text-center">
                <div className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
                  {percentage}%
                </div>
                <div className="text-[11px] sm:text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider mt-1">
                  Accuracy
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6 sm:mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              disabled={isReattempting}
              onClick={handleReattempt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              {isReattempting ? 'Preparing...' : 'Reattempt Exact Quiz'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Take Another Quiz
            </button>

            <button
              type="button"
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm transition cursor-pointer sm:ml-auto"
            >
              <BarChart3 className="w-4 h-4" />
              View All History
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filterMode === 'all'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Questions ({questions.length})
          </button>
          <button
            onClick={() => setFilterMode('incorrect')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'incorrect'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            Incorrect ({total - score})
          </button>
          <button
            onClick={() => setFilterMode('correct')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              filterMode === 'correct'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Correct ({score})
          </button>
        </div>

        {/* Question Review Cards */}
        <div className="space-y-4 sm:space-y-6">
          {filteredQuestions.map((q) => (
            <div
              key={q.position}
              className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                q.is_correct
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-500/30 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-rose-300 dark:border-rose-500/30 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Question {q.position} of {total}
                </span>

                {q.is_correct ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct (+1)
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    <XCircle className="w-3.5 h-3.5" /> Incorrect (0)
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                {q.question_text}
              </h3>

              {/* Options Breakdown */}
              <div className="space-y-2 mb-4">
                {q.options.map((opt, oIdx) => {
                  const isUserPick = q.selected_option === oIdx;
                  const isCorrect = q.correct_option === oIdx;

                  let style = 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                  if (isCorrect) {
                    style = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isUserPick && !isCorrect) {
                    style = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200';
                  }

                  return (
                    <div
                      key={oIdx}
                      className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${style}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg border border-current flex items-center justify-center font-bold text-xs shrink-0">
                          {optionLetters[oIdx]}
                        </span>
                        <span>{opt}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isUserPick && (
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                            Your Choice
                          </span>
                        )}
                        {isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Card */}
              {q.explanation && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Explanation:</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
