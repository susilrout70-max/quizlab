import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../lib/api.js';
import { Navbar } from '../components/Navbar.js';
import { QuizQuestion, QuizSubmitResponse } from '../types.js';
import {
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Send,
  AlertCircle,
  CheckCircle,
  RotateCcw,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const QuizRunner: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [subject, setSubject] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [isReattempt, setIsReattempt] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalDuration, setTotalDuration] = useState<number>(600);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const autoSubmittedRef = useRef(false);
  const answerSaveRef = useRef<Promise<unknown>>(Promise.resolve());

  useEffect(() => {
    if (!attemptId) {
      navigate('/dashboard');
      return;
    }

    const saved = sessionStorage.getItem(`quiz_${attemptId}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setQuestions(parsed.questions || []);
        setSubject(parsed.subject || '');
        setDifficulty(parsed.difficulty || '');
        setIsReattempt(parsed.is_reattempt || false);

        // Restore any local answers in case of accidental refresh
        const localSavedAnswers = localStorage.getItem(`quiz_answers_${attemptId}`);
        if (localSavedAnswers) {
          try {
            setAnswers(JSON.parse(localSavedAnswers));
          } catch (e) {}
        }
        return;
      } catch (err) {
        console.error('Failed to parse cached quiz:', err);
      }
    }

    navigate('/dashboard');
  }, [attemptId, navigate]);

  // Timer countdown and auto-submit initialization
  useEffect(() => {
    if (!questions.length || !attemptId || !difficulty) return;

    const pacePerQ = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120;
    const duration = questions.length * pacePerQ;
    setTotalDuration(duration);

    const timerStorageKey = `quiz_timer_end_${attemptId}`;
    let endTimestamp = Number(sessionStorage.getItem(timerStorageKey));

    if (!endTimestamp || isNaN(endTimestamp)) {
      endTimestamp = Date.now() + duration * 1000;
      sessionStorage.setItem(timerStorageKey, String(endTimestamp));
    }

    const tick = () => {
      const now = Date.now();
      const diffSecs = Math.max(0, Math.ceil((endTimestamp - now) / 1000));
      setTimeLeft(diffSecs);

      if (diffSecs <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        setIsTimeUp(true);
        handleAutoSubmit();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [questions.length, attemptId, difficulty]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = async (optionIndex: number) => {
    if (!currentQuestion || !attemptId) return;
    const previousAnswer = answers[currentQuestion.position];
    const updated = {
      ...answers,
      [currentQuestion.position]: optionIndex,
    };
    setAnswers(updated);
    localStorage.setItem(`quiz_answers_${attemptId}`, JSON.stringify(updated));
    setError(null);
    setIsSavingAnswer(true);

    const saveRequest = api.post(`/quiz/answer/${attemptId}`, {
      position: currentQuestion.position,
      selected_option: optionIndex,
    });
    answerSaveRef.current = saveRequest;

    try {
      await saveRequest;
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Could not save your answer. Please select it again.'));
      setAnswers((currentAnswers) => {
        const restored = { ...currentAnswers };
        if (previousAnswer === undefined) {
          delete restored[currentQuestion.position];
        } else {
          restored[currentQuestion.position] = previousAnswer;
        }
        localStorage.setItem(`quiz_answers_${attemptId}`, JSON.stringify(restored));
        return restored;
      });
    } finally {
      if (answerSaveRef.current === saveRequest) {
        answerSaveRef.current = Promise.resolve();
      }
      setIsSavingAnswer(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!attemptId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await answerSaveRef.current;
      const res = await api.post<QuizSubmitResponse>(`/quiz/submit/${attemptId}`, {});

      sessionStorage.removeItem(`quiz_${attemptId}`);
      sessionStorage.removeItem(`quiz_timer_end_${attemptId}`);
      localStorage.removeItem(`quiz_answers_${attemptId}`);
      sessionStorage.setItem(`review_${attemptId}`, JSON.stringify(res.data));
      navigate(`/review/${attemptId}`);
    } catch (err: any) {
      console.error('Auto-submit error:', err);
      setError(getErrorMessage(err, 'Failed to auto-submit quiz when time expired.'));
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!attemptId) return;
    setError(null);
    setIsSubmitting(true);

    try {
      await answerSaveRef.current;
      const res = await api.post<QuizSubmitResponse>(`/quiz/submit/${attemptId}`, {});

      sessionStorage.removeItem(`quiz_${attemptId}`);
      sessionStorage.removeItem(`quiz_timer_end_${attemptId}`);
      localStorage.removeItem(`quiz_answers_${attemptId}`);
      sessionStorage.setItem(`review_${attemptId}`, JSON.stringify(res.data));
      navigate(`/review/${attemptId}`);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Failed to submit quiz. Please try again.'));
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const selectedForCurrent = answers[currentQuestion.position];
  const progressPercentage = timeLeft !== null && totalDuration > 0
    ? Math.max(0, Math.min(100, (timeLeft / totalDuration) * 100))
    : 100;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200 pb-28 md:pb-12">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        
        {/* Top Info & Mock Test Timer Bar */}
        <div className="mb-4 sm:mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">{subject}</span>
              <span className={`text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                difficulty === 'easy' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' :
                difficulty === 'medium' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' :
                'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
              }`}>
                {difficulty === 'easy' ? 'Level 1 (Easy)' : difficulty === 'medium' ? 'Level 2 (Medium)' : 'Level 3 (Difficult)'}
              </span>
              {isReattempt && (
                <span className="hidden sm:flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                  <RotateCcw className="w-3 h-3" /> Reattempt
                </span>
              )}
            </div>

            {/* Countdown Timer */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {timeLeft !== null && (
                <div
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl border font-mono font-bold text-xs sm:text-sm transition-all ${
                    timeLeft <= 30
                      ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/50 animate-pulse ring-2 ring-rose-500/20'
                      : timeLeft <= 120
                      ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 ring-1 ring-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
                  }`}
                >
                  <Clock className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${timeLeft <= 30 ? 'animate-spin' : ''}`} />
                  <span className="text-sm sm:text-base tracking-wider">{formatTimer(timeLeft)}</span>
                </div>
              )}

              <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-950/60 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                <span>Done:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{answeredCount}</span>
                <span>/ {totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Visual Timer Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-950 h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${
                timeLeft !== null && timeLeft <= 30
                  ? 'bg-rose-500'
                  : timeLeft !== null && timeLeft <= 120
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Low Time Warning Alerts */}
        {timeLeft !== null && timeLeft <= 120 && timeLeft > 0 && (
          <div className={`mb-4 sm:mb-6 p-3 rounded-xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium ${
            timeLeft <= 30
              ? 'bg-rose-50 dark:bg-rose-500/15 border-rose-300 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 animate-pulse'
              : 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                {timeLeft <= 30
                  ? `Final 30 seconds! Responses will be auto-submitted when timer expires.`
                  : `Less than 2 minutes remaining! Review your answers now.`}
              </span>
            </div>
            <span className="font-mono font-bold text-sm shrink-0">{formatTimer(timeLeft)}</span>
          </div>
        )}

        {/* Question Navigation Palette */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 p-2 sm:p-3 bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto no-scrollbar">
          {questions.map((q, idx) => {
            const isAnswered = answers[q.position] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.position}
                onClick={() => setCurrentIndex(idx)}
                className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center border ${
                  isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-500 ring-2 ring-emerald-500/40 shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-500/30'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {q.position}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-900 dark:text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 sm:mb-4">
            <span className="uppercase tracking-wider">Question {currentIndex + 1} of {totalQuestions}</span>
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Multiple Choice
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 leading-snug">
            {currentQuestion.question_text}
          </h2>

          {/* Options Grid */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedForCurrent === optIdx;
              const optionLetters = ['A', 'B', 'C', 'D'];
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isSavingAnswer || isSubmitting}
                  className={`w-full text-left p-4 rounded-xl border transition flex items-center gap-3 sm:gap-4 cursor-pointer min-h-[54px] ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 border-emerald-500 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-slate-50/70 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 text-slate-800 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/70 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 border transition ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {optionLetters[optIdx]}
                  </span>
                  <span className="text-sm sm:text-base font-medium flex-1">{opt}</span>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop Navigation & Submission Controls */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-sm font-semibold transition cursor-pointer"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Submit Quiz
            </button>
          )}
        </div>
      </main>

      {/* STICKY BOTTOM THUMB BAR (MOBILE ONLY) */}
      <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 pb-safe shadow-xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="min-h-[44px] px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {currentIndex + 1} / {totalQuestions}
          </span>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="min-h-[44px] px-5 rounded-xl bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmModal(true)}
              className="min-h-[44px] px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to Submit?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              You have answered <strong className="text-emerald-600 dark:text-emerald-400">{answeredCount}</strong> out of{' '}
              <strong className="text-slate-900 dark:text-white">{totalQuestions}</strong> questions.
              {timeLeft !== null && (
                <span className="block mt-1 text-slate-700 dark:text-slate-300">
                  Time remaining: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{formatTimer(timeLeft)}</strong>
                </span>
              )}
              {answeredCount < totalQuestions && (
                <span className="block mt-2 text-amber-600 dark:text-amber-400 font-medium">
                  ⚠️ You have {totalQuestions - answeredCount} unanswered question(s). Unanswered questions will receive 0 marks.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition cursor-pointer"
              >
                Continue Quiz
              </button>
              <button
                type="button"
                disabled={isSubmitting || isSavingAnswer}
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Submit Overlay When Timer Reaches 0:00 */}
      {isTimeUp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Time is Up!</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Your mock test time limit has expired. Automatically submitting and calculating your score...
            </p>
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
};
