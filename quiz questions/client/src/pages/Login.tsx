import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

export const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const stateData = (location.state as { registeredEmail?: string; message?: string } | null);

  const [email, setEmail] = useState<string>(() => 
    stateData?.registeredEmail || localStorage.getItem('quizlab_remembered_email') || ''
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(() => 
    Boolean(localStorage.getItem('quizlab_remembered_email'))
  );
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(() => stateData?.message || null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      if (rememberMe) {
        localStorage.setItem('quizlab_remembered_email', email);
      } else {
        localStorage.removeItem('quizlab_remembered_email');
      }

      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-emerald-500/20 mb-4 ring-1 ring-white/10">
          <ShieldCheck className="w-8 h-8 text-slate-950" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome to QuizLab
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Sign in to access your interactive AI-powered quizzes & tests
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Registration Success Notification */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-3 shadow-lg shadow-emerald-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-emerald-300">Registration Complete!</p>
                <p className="text-xs text-emerald-400/90 mt-0.5 leading-relaxed">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* Error Notification */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3 shadow-lg shadow-rose-950/30 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-rose-300">Authentication Failed</p>
                <p className="text-xs text-rose-400/90 mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5 relative" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-300">
                  Password
                </label>
              </div>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer transition"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-0 focus:ring-1"
                />
                <span className="text-slate-400 hover:text-slate-300 transition">
                  Remember my email
                </span>
              </label>

              <span className="text-xs text-slate-500">
                Encrypted via Neon DB
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20 text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </button>
          </form>

          {/* Portal Info Badge */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-400">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Students & Teachers log in using the same portal</span>
          </div>

          {/* Switch to Register */}
          <div className="mt-4 text-center">
            <span className="text-sm text-slate-400">
              Don't have an account yet?{' '}
              <Link
                to="/signup"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition underline-offset-4 hover:underline"
              >
                Create an account
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
