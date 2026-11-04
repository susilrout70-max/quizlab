import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api.js';
import { Navbar } from '../components/Navbar.js';
import { PastAttempt, QuizAnalytics, QuizAttemptStartResponse } from '../types.js';
import {
  BarChart3,
  RotateCcw,
  Eye,
  PlusCircle,
  FileQuestion,
  TrendingUp
} from 'lucide-react';

export const QuizHistory: React.FC = () => {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState<PastAttempt[]>([]);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reattemptingId, setReattemptingId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [historyRes, analyticsRes] = await Promise.all([
          api.get<{ attempts: PastAttempt[] }>('/quiz/history'),
          api.get<QuizAnalytics>('/quiz/analytics'),
        ]);

        setAttempts(historyRes.data.attempts || []);
        setAnalytics(analyticsRes.data);
      } catch (err: any) {
        setError(getErrorMessage(err, 'Failed to load history'));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleReattempt = async (attemptId: string) => {
    setReattemptingId(attemptId);
    try {
      const res = await api.post<QuizAttemptStartResponse>(`/quiz/reattempt/${attemptId}`);
      sessionStorage.setItem(`quiz_${res.data.attempt_id}`, JSON.stringify(res.data));
      navigate(`/quiz/${res.data.attempt_id}`);
    } catch (err: any) {
      alert(getErrorMessage(err, 'Failed to start reattempt'));
      setReattemptingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Quiz History & Analytics
            </h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Review your past performance, subject proficiency, and reattempt any exam.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            New Quiz
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Analytics Metric Cards */}
        {analytics && analytics.total_quizzes > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Total Quizzes
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {analytics.total_quizzes}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Saved attempts</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Average Accuracy
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {analytics.average_percentage}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Overall average</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Questions Answered
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                {analytics.total_questions}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Questions taken</div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Correct Answers
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                {analytics.total_correct}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Total points</div>
            </div>
          </div>
        )}

        {/* Subject Performance Breakdown */}
        {analytics && analytics.subject_stats.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Subject Performance Breakdown
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {analytics.subject_stats.map((sub) => (
                <div key={sub.subject} className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{sub.subject}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{sub.attempts} quiz{sub.attempts > 1 ? 'zes' : ''}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{sub.avg_percentage}%</span>
                    <span className="text-xs text-slate-500">avg</span>
                    <span className="text-xs text-slate-400 ml-auto">Best: {sub.best_percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, sub.avg_percentage)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Attempts Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Past Exam Submissions
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{attempts.length} Total</span>
          </div>

          {attempts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <FileQuestion className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">No completed quizzes yet.</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start your first subject quiz to view results here!</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm"
              >
                Start Quiz Now
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE VIEW (md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-400 font-semibold">
                      <th className="pb-3 px-3">Subject</th>
                      <th className="pb-3 px-3">Difficulty</th>
                      <th className="pb-3 px-3">Score</th>
                      <th className="pb-3 px-3">Accuracy</th>
                      <th className="pb-3 px-3">Date</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {attempts.map((att) => {
                      const isReatt = att.is_reattempt;
                      const dateStr = att.completed_at
                        ? new Date(att.completed_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Completed';

                      return (
                        <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition">
                          <td className="py-4 px-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            {att.subject}
                            {isReatt && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 font-mono font-medium">
                                Reattempt
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${
                                att.difficulty === 'easy'
                                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20'
                                  : att.difficulty === 'medium'
                                  ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                                  : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                              }`}
                            >
                              {att.difficulty}
                            </span>
                          </td>
                          <td className="py-4 px-3 font-semibold text-slate-800 dark:text-slate-200">
                            {att.score} / {att.total_questions}
                          </td>
                          <td className="py-4 px-3">
                            <span
                              className={`font-bold ${
                                att.percentage >= 80
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : att.percentage >= 50
                                  ? 'text-amber-600 dark:text-amber-400'
                                  : 'text-rose-600 dark:text-rose-400'
                              }`}
                            >
                              {att.percentage}%
                            </span>
                          </td>
                          <td className="py-4 px-3 text-xs text-slate-400">{dateStr}</td>
                          <td className="py-4 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/review/${att.id}`)}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Review
                              </button>

                              <button
                                disabled={reattemptingId === att.id}
                                onClick={() => handleReattempt(att.id)}
                                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/15 hover:bg-blue-100 dark:hover:bg-blue-500/25 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 font-medium transition cursor-pointer disabled:opacity-50"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                {reattemptingId === att.id ? 'Loading...' : 'Reattempt'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARD VIEW (< md screens) */}
              <div className="md:hidden space-y-3">
                {attempts.map((att) => {
                  const dateStr = att.completed_at
                    ? new Date(att.completed_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Done';

                  return (
                    <div
                      key={att.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {att.subject}
                          </span>
                          {att.is_reattempt && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                              Reattempt
                            </span>
                          )}
                        </div>

                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                          att.difficulty === 'easy' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' :
                          att.difficulty === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' :
                          'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400'
                        }`}>
                          {att.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-3">
                          <span>Score: <strong className="text-slate-800 dark:text-slate-200">{att.score}/{att.total_questions}</strong></span>
                          <span>Accuracy: <strong className={att.percentage >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>{att.percentage}%</strong></span>
                        </div>
                        <span>{dateStr}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button
                          onClick={() => navigate(`/review/${att.id}`)}
                          className="min-h-[40px] flex items-center justify-center gap-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Review
                        </button>
                        <button
                          disabled={reattemptingId === att.id}
                          onClick={() => handleReattempt(att.id)}
                          className="min-h-[40px] flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Reattempt
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
