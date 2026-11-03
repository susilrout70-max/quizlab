import React from 'react';
import { useTheme, Theme } from '../context/ThemeContext.js';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'icon' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, actualTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'segmented') {
    const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
      { id: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
      { id: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
      { id: 'system', label: 'System', icon: <Laptop className="w-4 h-4" /> },
    ];

    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700/60 ${className}`}>
        {options.map((opt) => {
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title={`Switch to ${opt.label} mode`}
            >
              {opt.icon}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
        actualTheme === 'dark'
          ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-amber-300'
          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 shadow-sm'
      } ${className}`}
      aria-label="Toggle theme"
      title={`Switch to ${actualTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {actualTheme === 'dark' ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
};
