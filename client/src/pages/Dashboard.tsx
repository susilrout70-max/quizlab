import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { Navbar } from '../components/Navbar.js';
import { api } from '../lib/api.js';
import { Difficulty, QuizAttemptStartResponse, QuizAnalytics } from '../types.js';
import {
  Code,
  Terminal,
  Calculator,
  Atom,
  Globe,
  ArrowRight,
  Zap,
  Sparkles,
  BarChart3,
  Award,
  Flame,
  CheckCircle2,
  Layers,
  Clock,
} from 'lucide-react';

interface SubjectItem {
  id: string;
  name: string;
  tag: string;
  description: string;
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  subjects: SubjectItem[];
}

const CATEGORIES: CategoryInfo[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'HTML, CSS, JavaScript, Python, Java, C, C++, React.js & modern languages',
    icon: <Terminal className="w-6 h-6" />,
    gradient: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
    subjects: [
      { id: 'HTML', name: 'HTML', tag: 'Frontend', description: 'Semantic tags, DOM structure, forms & HTML5' },
      { id: 'CSS', name: 'CSS', tag: 'Styling', description: 'Flexbox, Grid, animations, selectors & responsive design' },
      { id: 'JavaScript', name: 'JavaScript', tag: 'Web', description: 'ES6+, closures, event loop, async/await & scope' },
      { id: 'React.js', name: 'React.js', tag: 'Frontend', description: 'Hooks, Virtual DOM, state management & components' },
      { id: 'Python', name: 'Python', tag: 'General', description: 'Syntax, OOP, generators, list comprehensions & libraries' },
      { id: 'Java', name: 'Java', tag: 'Enterprise', description: 'JVM architecture, multithreading, OOP & collections' },
      { id: 'C', name: 'C', tag: 'Low-Level', description: 'Pointers, memory management, structs & preprocessor' },
      { id: 'C++', name: 'C++', tag: 'Systems', description: 'Pointers, templates, STL containers, RAII & OOP' },
      { id: 'Node.js', name: 'Node.js', tag: 'Backend', description: 'Event-driven I/O, streams, Express & asynchronous APIs' },
      { id: 'SQL', name: 'SQL', tag: 'Database', description: 'Queries, joins, indexing, aggregation & transactions' },
    ],
  },
  {
    id: 'cs',
    name: 'Computer Science',
    description: 'DBMS, DSA, Operating Systems, Networks, AI & core architecture',
    icon: <Code className="w-6 h-6" />,
    gradient: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
    subjects: [
      { id: 'DSA', name: 'DSA', tag: 'Algorithms', description: 'Trees, graphs, dynamic programming, sorting & Big-O' },
      { id: 'DBMS', name: 'DBMS', tag: 'Databases', description: 'ACID properties, normalization, indexing & concurrency' },
      { id: 'Operating Systems', name: 'Operating Systems', tag: 'Systems', description: 'Processes, threads, CPU scheduling, virtual memory & deadlocks' },
      { id: 'Computer Networks', name: 'Computer Networks', tag: 'Networks', description: 'OSI model, TCP/IP, DNS, HTTP/S & routing protocols' },
      { id: 'AI & Machine Learning', name: 'AI & Machine Learning', tag: 'Intelligence', description: 'Neural networks, supervised learning, gradient descent & NLP' },
      { id: 'Cyber Security', name: 'Cyber Security', tag: 'Security', description: 'Cryptography, hashing, authentication & OWASP top 10' },
    ],
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Calculus, algebra, probability, matrices, and geometry',
    icon: <Calculator className="w-6 h-6" />,
    gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
    subjects: [
      { id: 'Algebra', name: 'Algebra', tag: 'Core', description: 'Polynomials, quadratic equations, matrices & systems of equations' },
      { id: 'Calculus', name: 'Calculus', tag: 'Analysis', description: 'Limits, derivatives, integrals, series & vector calculus' },
      { id: 'Probability & Statistics', name: 'Probability & Statistics', tag: 'Data', description: 'Distributions, Bayes theorem, expected value & variance' },
      { id: 'Linear Algebra', name: 'Linear Algebra', tag: 'Vectors', description: 'Vector spaces, eigenvalues, matrix transformations & dot products' },
      { id: 'Discrete Mathematics', name: 'Discrete Math', tag: 'Theory', description: 'Set theory, combinatorics, graph theory & logic' },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, chemistry, cellular biology, and natural laws',
    icon: <Atom className="w-6 h-6" />,
    gradient: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
    subjects: [
      { id: 'Physics', name: 'Physics', tag: 'Mechanics', description: 'Classical mechanics, thermodynamics, electromagnetism & optics' },
      { id: 'Chemistry', name: 'Chemistry', tag: 'Molecular', description: 'Periodic table, bonding, organic chemistry & reaction kinetics' },
      { id: 'Biology', name: 'Biology', tag: 'Life Science', description: 'Cell biology, genetics, human physiology & evolution' },
      { id: 'Astronomy', name: 'Astronomy', tag: 'Cosmos', description: 'Planetary science, stellar evolution, black holes & galaxies' },
    ],
  },
  {
    id: 'gk',
    name: 'General Knowledge',
    description: 'World history, global geography, discoveries, and culture',
    icon: <Globe className="w-6 h-6" />,
    gradient: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
    subjects: [
      { id: 'World History', name: 'World History', tag: 'History', description: 'Ancient civilizations, global revolutions & landmark treaties' },
      { id: 'Geography', name: 'Geography', tag: 'Earth', description: 'Continents, capitals, mountain systems & global climates' },
      { id: 'Inventions & Discoveries', name: 'Inventions', tag: 'Pioneers', description: 'Scientific breakthroughs, inventors & Nobel prize discoveries' },
      { id: 'Literature & Arts', name: 'Literature & Arts', tag: 'Culture', description: 'Classical authors, famous literary works & world art' },
    ],
  },
];

const DIFFICULTIES: { id: Difficulty; label: string; desc: string; timing: string; color: string; activeColor: string }[] = [
  {
    id: 'easy',
    label: 'Easy (Level 1)',
    desc: 'Core fundamentals & direct recall',
    timing: '⏱️ 1 min / question (10 mins)',
    color: 'border-slate-800 hover:border-emerald-500/40 text-slate-300',
    activeColor: 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20',
  },
  {
    id: 'medium',
    label: 'Medium (Level 2)',
    desc: 'Application & problem solving',
    timing: '⏱️ 1.5 min / question (15 mins)',
    color: 'border-slate-800 hover:border-amber-500/40 text-slate-300',
    activeColor: 'bg-amber-500/15 border-amber-500 text-amber-300 ring-2 ring-amber-500/20',
  },
  {
    id: 'difficult',
    label: 'Difficult (Level 3)',
    desc: 'Advanced theory & complex analysis',
    timing: '⏱️ 2 min / question (20 mins)',
    color: 'border-slate-800 hover:border-rose-500/40 text-slate-300',
    activeColor: 'bg-rose-500/15 border-rose-500 text-rose-300 ring-2 ring-rose-500/20',
  },
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo>(CATEGORIES[0]);
  const [selectedSubject, setSelectedSubject] = useState<string>(CATEGORIES[0].subjects[0].name);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get<QuizAnalytics>('/quiz/analytics');
        setAnalytics(res.data);
      } catch (err) {
        console.error('Failed to load user analytics:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const handleCategoryClick = (category: CategoryInfo) => {
    setSelectedCategory(category);
    // If current subject is not in this category, set it to the first subject of the new category
    const hasCurrent = category.subjects.some((s) => s.name === selectedSubject);
    if (!hasCurrent && category.subjects.length > 0) {
      setSelectedSubject(category.subjects[0].name);
    }
  };

  const handleStartQuiz = async () => {
    setError(null);
    setIsStarting(true);

    try {
      const res = await api.post<QuizAttemptStartResponse>('/quiz/start', {
        subject: selectedSubject,
        difficulty: selectedDifficulty,
      });

      // Save initial attempt in sessionStorage and navigate
      sessionStorage.setItem(`quiz_${res.data.attempt_id}`, JSON.stringify(res.data));
      navigate(`/quiz/${res.data.attempt_id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start quiz. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Category & Subject Exploration · Hybrid AI
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.full_name}!
            </h1>
            <p className="mt-1 text-slate-400 text-sm sm:text-base">
              Choose your category and specific subject to begin a fresh, customized quiz challenge.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          {analytics && analytics.total_quizzes > 0 && (
            <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl">
              <div className="text-center px-2">
                <div className="text-2xl font-black text-white">{analytics.total_quizzes}</div>
                <div className="text-xs text-slate-400 font-medium">Completed</div>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <div className="text-center px-2">
                <div className="text-2xl font-black text-emerald-400">{analytics.average_percentage}%</div>
                <div className="text-xs text-slate-400 font-medium">Avg Score</div>
              </div>
              <div className="w-px h-8 bg-slate-800"></div>
              <button
                onClick={() => navigate('/history')}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 transition cursor-pointer"
              >
                <BarChart3 className="w-4 h-4" />
                History
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Quiz Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Select Category */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">1</span>
                Select Category
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                Click a category below to reveal and select its related subjects.
              </p>

              {/* Category Cards matching user UI screenshot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className={`text-left p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-800/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg'
                          : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className={`p-2.5 rounded-xl border ${cat.gradient}`}>
                          {cat.icon}
                        </div>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{cat.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Step 1B: Related Subjects in Selected Category */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-slate-200">
                      Choose Subject under <span className="text-emerald-400">{selectedCategory.name}</span>:
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {selectedCategory.subjects.length} Subjects available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedCategory.subjects.map((sub) => {
                    const isSubSelected = selectedSubject === sub.name;
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSelectedSubject(sub.name)}
                        className={`text-left p-3 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                          isSubSelected
                            ? 'bg-emerald-500/15 border-emerald-500 text-white ring-2 ring-emerald-500/20 shadow-md'
                            : 'bg-slate-950/50 border-slate-800/90 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm tracking-tight">{sub.name}</span>
                          {isSubSelected ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 font-mono">
                              {sub.tag}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{sub.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Select Difficulty Level */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">2</span>
                Select Difficulty Level
              </h2>
              <p className="text-xs text-slate-400 mb-4">
                3 tiers with subject-specific questions and targeted cognitive depth.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DIFFICULTIES.map((diff) => {
                  const isSelected = selectedDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => setSelectedDifficulty(diff.id)}
                      className={`text-left p-4 rounded-xl border transition cursor-pointer ${
                        isSelected ? diff.activeColor : `bg-slate-950/40 ${diff.color}`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-base capitalize">{diff.label}</span>
                        {diff.id === 'difficult' && <Flame className="w-4 h-4 text-rose-400" />}
                        {diff.id === 'medium' && <Zap className="w-4 h-4 text-amber-400" />}
                        {diff.id === 'easy' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{diff.desc}</p>
                      <div className="mt-2 text-[11px] font-semibold text-slate-300 flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 w-fit">
                        {diff.timing}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Exam Specification */}
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                Exam Specification
              </h3>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-semibold text-white">{selectedCategory.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Subject:</span>
                  <span className="font-bold text-emerald-400">{selectedSubject}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Difficulty:</span>
                  <span className={`font-semibold capitalize ${
                    selectedDifficulty === 'easy' ? 'text-emerald-400' :
                    selectedDifficulty === 'medium' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedDifficulty === 'easy' ? 'Easy (Level 1)' : selectedDifficulty === 'medium' ? 'Medium (Level 2)' : 'Difficult (Level 3)'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Mock Test Timer:</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    {selectedDifficulty === 'easy' ? '10 mins (1 min/q pace)' : selectedDifficulty === 'medium' ? '15 mins (1.5 min/q)' : '20 mins (2 min/q)'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Question Pool:</span>
                  <span className="font-semibold text-emerald-400">10 Fresh Questions</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Engine:</span>
                  <span className="font-medium text-slate-300">Hybrid DB + AI Generator</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Reattempt Support:</span>
                  <span className="font-medium text-slate-300">Yes (Exact Questions)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 mb-6">
                💡 <strong>Targeted Subject Questions:</strong> Questions will specifically test <strong>{selectedSubject}</strong> concepts at <strong>{selectedDifficulty}</strong> difficulty level.
              </div>

              <button
                type="button"
                disabled={isStarting}
                onClick={handleStartQuiz}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 text-base font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition disabled:opacity-50 cursor-pointer"
              >
                {isStarting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating {selectedSubject} Quiz...</span>
                  </div>
                ) : (
                  <>
                    <span>Start {selectedSubject} Quiz</span>
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
