"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-colors
        ${theme === 'light' ? 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50' : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}
        ${className}
      `}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
      <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'} mode</span>
    </button>
  );
}


