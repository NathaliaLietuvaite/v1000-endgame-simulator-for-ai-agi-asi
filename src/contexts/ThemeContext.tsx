import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'night' | 'day';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'night';
    return (localStorage.getItem('pqms-theme') as Theme) || 'night';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('day', theme === 'day');
    document.documentElement.classList.toggle('night', theme === 'night');
    localStorage.setItem('pqms-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'night' ? 'day' : 'night')) }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
