import React, { createContext, useState, useEffect } from 'react';

// ThemeContext provides the current theme ('light' or 'dark') and a
// toggle function.  The provider is responsible for syncing the class on
// <html> (which Tailwind uses for its dark variants) and persisting the
// preference to localStorage.

export const ThemeContext = createContext({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  const applyClass = (newTheme) => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyClass(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {
      // ignore storage errors
    }
  };

  // on first render read saved preference and apply it
  useEffect(() => {
    let saved;
    try {
      saved = localStorage.getItem('theme');
    } catch (e) {
      saved = null;
    }
    const initial = saved || theme;
    setTheme(initial);
    applyClass(initial);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
