"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  APP_THEMES,
  DEFAULT_THEME,
  isAppTheme,
  type AppThemeId,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: AppThemeId;
  setTheme: (theme: AppThemeId) => void;
  themes: typeof APP_THEMES;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: AppThemeId) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<AppThemeId>(DEFAULT_THEME);

  useEffect(() => {
    const saved = localStorage.getItem("concert-theme");
    const next = isAppTheme(saved) ? saved : DEFAULT_THEME;
    setThemeState(next);
    applyTheme(next);
  }, []);

  const setTheme = useCallback((next: AppThemeId) => {
    setThemeState(next);
    localStorage.setItem("concert-theme", next);
    applyTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: APP_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
