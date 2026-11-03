import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { ThemeToggle } from '../components/ThemeToggle.js';
import {
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  BarChart3,
  Terminal,
  Calculator,
  Atom,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Layers,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';

export const Landing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'programming' | 'aptitude' | 'engineering' | 'science'>('all');

  // Interactive Live Quiz Demo Card State
  const [demoSelected, setDemoSelected] = useState<number | null>(null);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoSeconds, setDemoSeconds] = useState(105);

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoSeconds((prev) => (prev > 0 ? prev - 1 : 120));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDemoTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const demoOptions = [
    { text: 'return', correct: false },
    { text: 'yield', correct: true },
    { text: 'await', correct: false },
    { text: 'defer', correct: false },
  ];

  const subjects = [
    { name: 'Python', category: 'programming', tag: 'High-Demand', questions: '420+ Qs', icon: <Terminal className="w-5 h-5 text-emerald-500" /> },
    { name: 'React.js', category: 'programming', tag: 'Frontend', questions: '380+ Qs', icon: <Terminal className="w-5 h-5 text-cyan-500" /> },
    { name: 'JavaScript ES6+', category: 'programming', tag: 'Web Core', questions: '510+ Qs', icon: <Terminal className="w-5 h-5 text-amber-500" /> },
    { name: 'Java & JVM', category: 'programming', tag: 'Enterprise', questions: '390+ Qs', icon: <Terminal className="w-5 h-5 text-red-500" /> },
    { name: 'C & Systems', category: 'programming', tag: 'Pointers & OS', questions: '310+ Qs', icon: <Terminal className="w-5 h-5 text-blue-500" /> },
    { name: 'Quantitative Aptitude', category: 'aptitude', tag: 'Campus Placements', questions: '640+ Qs', icon: <Calculator className="w-5 h-5 text-purple-500" /> },
    { name: 'Logical Reasoning', category: 'aptitude', tag: 'Cognitive', questions: '450+ Qs', icon: <Calculator className="w-5 h-5 text-indigo-500" /> },
    { name: 'Verbal Ability', category: 'aptitude', tag: 'Communication', questions: '380+ Qs', icon: <Calculator className="w-5 h-5 text-teal-500" /> },
    { name: 'Digital Logic & Circuit', category: 'engineering', tag: 'ECE / EE', questions: '290+ Qs', icon: <Layers className="w-5 h-5 text-pink-500" /> },
    { name: 'Thermodynamics', category: 'engineering', tag: 'Mechanical', questions: '240+ Qs', icon: <Layers className="w-5 h-5 text-rose-500" /> },
    { name: 'Quantum & Wave Physics', category: 'science', tag: 'Applied Physics', questions: '310+ Qs', icon: <Atom className="w-5 h-5 text-sky-500" /> },
    { name: 'Organic & Analytical Chemistry', category: 'science', tag: 'Applied Chemistry', questions: '270+ Qs', icon: <Atom className="w-5 h-5 text-emerald-500" /> },
  ];

  const filteredSubjects = activeCategory === 'all'
    ? subjects
    : subjects.filter(s => s.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-emerald-500 selection:text-white transition-colors duration-200">
      
      {/* 1. STICKY BLUR NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-700 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                QuizLab
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                AI Powered
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Features</a>
            <a href="#subjects" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Subject Matrix</a>
            <a href="#anti-cheat" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">Anti-Cheat Timing</a>
            <a href="#ai-tutor" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">AI Tutor</a>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />

            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm hover:shadow-emerald-500/25 transition cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition cursor-pointer"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pt-3 pb-6 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Features
            </a>
            <a
              href="#subjects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Subject Matrix
            </a>
            <a
              href="#anti-cheat"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Anti-Cheat Timing
            </a>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                  className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-emerald-600 text-white"
                >
                  Go to Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full py-2.5 rounded-xl text-center text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                    className="w-full py-2.5 rounded-xl text-center text-sm font-semibold bg-emerald-600 text-white"
                  >
                    Get Started Free
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION WITH INTERACTIVE DEMO CARD */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Next-Gen Examination Engine • 2026 Release</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white mb-6">
              Master Any Subject with Fair,{' '}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                Server-Timed Quizzes
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
              Every candidate receives a distinct, randomized assessment satisfying deep blueprints. 
              The server strictly governs countdowns, paper generation, and tamper-proof grading.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition flex items-center justify-center gap-2 cursor-pointer text-base"
              >
                Start Practicing Free
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <a
                href="#demo"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200"
              >
                <Zap className="w-4 h-4 text-emerald-500" />
                Try Interactive Demo
              </a>
            </div>

            {/* Quick Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Neon PostgreSQL Cloud Speed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Teacher Verification Shield</span>
              </div>
            </div>
          </div>

          {/* INTERACTIVE DEMO CARD */}
          <div id="demo" className="max-w-2xl mx-auto">
            <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/40 relative">
              
              {/* Header inside demo card */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live Demo Quiz
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Python Generator
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{formatDemoTime(demoSeconds)}</span>
                </div>
              </div>

              {/* Question Text */}
              <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-5 leading-snug">
                Which keyword in Python pauses function execution and emits a value to the caller without losing internal state?
              </p>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {demoOptions.map((opt, idx) => {
                  const isSelected = demoSelected === idx;
                  let cardStyle = "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700";

                  if (demoSubmitted) {
                    if (opt.correct) {
                      cardStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold";
                    } else if (isSelected && !opt.correct) {
                      cardStyle = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200";
                    }
                  } else if (isSelected) {
                    cardStyle = "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 font-semibold";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!demoSubmitted) {
                          setDemoSelected(idx);
                        }
                      }}
                      className={`w-full p-4 rounded-xl border text-left text-sm transition-all flex items-center justify-between cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <code className="text-sm font-mono">{opt.text}</code>
                      </div>

                      {demoSubmitted && opt.correct && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Demo Action Button */}
              {!demoSubmitted ? (
                <button
                  disabled={demoSelected === null}
                  onClick={() => setDemoSubmitted(true)}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition cursor-pointer flex items-center justify-center gap-2 ${
                    demoSelected !== null
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Submit Demo Answer
                </button>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-200 text-sm animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="font-bold">Correct! </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      <code>yield</code> turns a standard function into a Python generator iterator.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setDemoSelected(null);
                      setDemoSubmitted(false);
                      setDemoSeconds(120);
                    }}
                    className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Reset Demo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. LIVE STATS STRIP */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">15,000+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Questions Generated</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">99.98%</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Server Clock Precision</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">40+</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Subject Blueprints</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">&lt; 150ms</p>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">Neon DB API Latency</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SUBJECT MATRIX SHOWCASE */}
      <section id="subjects" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
            Diverse Subject Blueprints
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From modern web stacks to quantitative aptitude and fundamental physical sciences.
          </p>

          {/* Category Tabs */}
          <div className="mt-6 flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: 'all', label: 'All Subjects' },
              { id: 'programming', label: 'Programming' },
              { id: 'aptitude', label: 'Aptitude' },
              { id: 'engineering', label: 'Engineering' },
              { id: 'science', label: 'Sciences' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer whitespace-nowrap ${
                  activeCategory === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSubjects.map((sub, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-md transition group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {sub.icon}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {sub.tag}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                {sub.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub.questions}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BENTO GRID FEATURES */}
      <section id="features" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight sm:text-4xl">
              Engineered for Academic Integrity & Speed
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              Say goodbye to predictable question lists and easily manipulated client-side clocks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento Card 1: Server Time */}
            <div id="anti-cheat" className="md:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
                <Clock className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Zero Clock Manipulation</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Server-Owned Timing Engine
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-lg mb-6">
                Client clocks can be paused, frozen, or adjusted. QuizLab calculates exam expiration directly inside PostgreSQL with server timestamps. If a student attempts to submit 1 second after expiration, the server auto-finalizes and locks the paper.
              </p>
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 font-mono text-xs text-slate-700 dark:text-slate-300">
                <code>SELECT expires_at FROM quiz_attempts WHERE id = $1 AND expires_at &gt; NOW();</code>
              </div>
            </div>

            {/* Bento Card 2: AI Generation */}
            <div id="ai-tutor" className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Gemini 2.5 AI Engine</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Dynamic Question Generation
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                  Need fresh problems in React, Python, or Thermodynamics? Our server synthesizes strict 4-option blueprints with code snippets on demand.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span>AI Study Tutor included</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Bento Card 3: Deep Analytics */}
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
                <BarChart3 className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Analytics</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Granular Gap Detection
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Review your exact mistakes with instant explanations. Spot whether difficulty or speed is holding your performance back.
              </p>
            </div>

            {/* Bento Card 4: Teacher & Institution */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-3">
                  <GraduationCap className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-wider">Institutional Guard</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Teacher Verified Signup
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-md">
                  Educator roles are secured behind cryptographic institutional invite codes (<code className="text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">QUIZLAB_TEACHER_2026</code>) preventing unauthorized access to exam management.
                </p>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm whitespace-nowrap transition cursor-pointer"
              >
                Join as Teacher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-emerald-600 text-white shadow-2xl shadow-emerald-600/30">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
              Ready to Test Your Real Knowledge?
            </h2>
            <p className="text-emerald-100 max-w-xl mx-auto text-base sm:text-lg mb-8 leading-relaxed">
              No repetitive static tests. Experience true adaptive, server-timed examination now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white text-emerald-800 hover:bg-slate-100 shadow-lg transition cursor-pointer text-base"
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold border border-white/30 hover:bg-white/10 text-white transition cursor-pointer"
              >
                Sign In to Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MODERN FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200 dark:border-slate-800">
            
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">QuizLab</span>
              <span className="text-xs text-slate-500">© 2026 QuizLab Inc.</span>
            </div>

            {/* Segmented Theme Switcher */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Appearance:</span>
              <ThemeToggle variant="segmented" />
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
            <p>Designed with academic rigor, full-stack security, and high-performance server synchronization.</p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
